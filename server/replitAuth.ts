import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

// 🔍 환경 자동 감지
function detectEnvironment() {
  // 리플릿 환경 감지 방법들
  const isReplit = !!(
    process.env.REPLIT_DB_URL ||  // 리플릿 DB URL
    process.env.REPL_SLUG ||      // 리플릿 슬러그
    process.env.REPL_OWNER ||     // 리플릿 소유자
    process.env.REPLIT ||         // 리플릿 환경 변수
    process.platform === 'linux' && process.env.HOME?.includes('/home/runner') // 리플릿 런너
  );
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isLocalDev = isDevelopment && !isReplit;
  
  console.log(`🌍 환경 감지: ${isReplit ? '리플릿' : '로컬'} (개발모드: ${isDevelopment})`);
  
  return { isReplit, isLocalDev, isDevelopment };
}

const { isReplit, isLocalDev } = detectEnvironment();

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isReplit, // 리플릿에서는 secure, 로컬에서는 false
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(claims: any) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // 🔧 로컬 개발 환경에서는 더미 인증 사용
  if (isLocalDev) {
    console.log('🔧 로컬 개발 모드: 더미 인증 활성화');
    
    // 로컬용 더미 라우트
    app.get("/api/login", (req, res) => {
      console.log('🔑 로컬 더미 로그인');
      res.redirect("/");
    });
    
    app.get("/api/logout", (req, res) => {
      req.logout(() => {
        res.redirect("/");
      });
    });
    
    app.get("/api/callback", (req, res) => {
      res.redirect("/");
    });
    
    // passport serialization
    passport.serializeUser((user: Express.User, cb) => cb(null, user));
    passport.deserializeUser((user: Express.User, cb) => cb(null, user));
    
    return;
  }

  // 🚀 리플릿 환경: 정상적인 OIDC 인증
  console.log('🚀 리플릿 모드: OIDC 인증 활성화');
  
  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  for (const domain of process.env.REPLIT_DOMAINS!.split(",")) {
    const trimmedDomain = domain.trim();
    if (!trimmedDomain) continue;
    
    const strategy = new Strategy(
      {
        name: `replitauth:${trimmedDomain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${trimmedDomain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    const hostname = req.hostname;
    const strategyName = `replitauth:${hostname}`;
    
    console.log(`🔑 로그인 시도: ${strategyName}`);
    
    passport.authenticate(strategyName, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    const hostname = req.hostname;
    const strategyName = `replitauth:${hostname}`;
    
    passport.authenticate(strategyName, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // 🔧 로컬 개발 환경에서는 더미 사용자 자동 생성
  if (isLocalDev) {
    const dummyUser = {
      claims: {
        sub: 'local-dev-user',
        email: 'dev@localhost.com',
        first_name: 'Local',
        last_name: 'Developer',
        exp: Math.floor(Date.now() / 1000) + 3600
      },
      access_token: 'dummy-token',
      refresh_token: 'dummy-refresh-token',
      expires_at: Math.floor(Date.now() / 1000) + 3600
    };
    
    // 더미 사용자를 DB에 한 번만 생성
    try {
      await upsertUser(dummyUser.claims);
    } catch (error) {
      // 이미 존재하는 경우 무시
    }
    
    (req as any).user = dummyUser;
    return next();
  }
  
  // 🚀 리플릿 환경: 정상적인 인증 로직
  const user = req.user as any;

  if (!req.isAuthenticated() || !user?.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    return res.redirect("/api/login");
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    return res.redirect("/api/login");
  }
};
