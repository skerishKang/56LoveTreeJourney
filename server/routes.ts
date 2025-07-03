import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage as originalStorage } from "./storage";
import { cachedStorage } from "./storage-cached";
import { cache } from "./redis";

// Redis가 사용 가능하면 캐시된 스토리지 사용, 아니면 일반 스토리지 사용
const storage = cache.isReady() ? cachedStorage : originalStorage;
import { setupAuth, isAuthenticated } from "./replitAuth";
import { authLimiter, createLimiter, apiLimiter } from "./middleware/rateLimiter";
import {
  insertLoveTreeSchema,
  insertLoveTreeItemSchema,
  insertCommentSchema,
  insertRecommendationSchema,
  insertShortsVideoSchema,
  insertShortsRecommendationSchema,
  insertConversionTrackingSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Initialize stages
  await storage.initializeStages();

  // Auth routes
  app.get('/api/auth/user', authLimiter, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Love Tree routes
  
  // Popular route MUST come before :id route to avoid conflict
  app.get('/api/love-trees/popular', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const popularTrees = await storage.getPopularLoveTrees(limit);
      res.json(popularTrees);
    } catch (error) {
      console.error("Error fetching popular love trees:", error);
      res.status(500).json({ message: "Failed to fetch popular love trees" });
    }
  });

  app.get('/api/love-trees', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const loveTrees = await storage.getUserLoveTrees(userId);
      res.json(loveTrees);
    } catch (error) {
      console.error("Error fetching love trees:", error);
      res.status(500).json({ message: "Failed to fetch love trees" });
    }
  });

  app.post('/api/love-trees', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const loveTreeData = insertLoveTreeSchema.parse({
        ...req.body,
        userId,
      });
      const loveTree = await storage.createLoveTree(loveTreeData);
      
      // Give gardener points for creating new love tree (+10 points)
      await storage.updateGardenerPoints(userId, 10);
      
      // Create notification for point gain
      await storage.createNotification(
        userId,
        'gardener_points',
        '가드너 포인트 획득! 🌳',
        '새로운 러브트리를 생성해서 +10 포인트를 획득했어요!'
      );
      
      res.json(loveTree);
    } catch (error) {
      console.error("Error creating love tree:", error);
      res.status(500).json({ message: "Failed to create love tree" });
    }
  });

  app.get('/api/love-trees/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid love tree ID" });
      }
      const loveTree = await storage.getLoveTree(id);
      if (!loveTree) {
        return res.status(404).json({ message: "Love tree not found" });
      }
      res.json(loveTree);
    } catch (error) {
      console.error("Error fetching love tree:", error);
      res.status(500).json({ message: "Failed to fetch love tree" });
    }
  });

  // Love Tree Item routes
  app.get('/api/love-trees/:id/items', isAuthenticated, async (req, res) => {
    try {
      const loveTreeId = parseInt(req.params.id);
      const items = await storage.getLoveTreeItems(loveTreeId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching love tree items:", error);
      res.status(500).json({ message: "Failed to fetch love tree items" });
    }
  });

  app.post('/api/love-trees/:id/items', isAuthenticated, async (req: any, res) => {
    try {
      const loveTreeId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const itemData = insertLoveTreeItemSchema.parse({
        ...req.body,
        loveTreeId,
      });
      const item = await storage.createLoveTreeItem(itemData);

      // Give gardener points for adding content (+5 points)
      await storage.updateGardenerPoints(userId, 5);
      
      // Create notification for point gain
      await storage.createNotification(
        userId,
        'gardener_points',
        '가드너 포인트 획득! 🌱',
        '새로운 콘텐츠를 추가해서 +5 포인트를 획득했어요!'
      );

      // Create notification for new seedling (notify other gardeners)
      if (itemData.isFirstContent) {
        const loveTree = await storage.getLoveTree(loveTreeId);
        if (loveTree) {
          // Get all other users who can recommend (experienced gardeners)
          const allUsers = await storage.getAllActiveGardeners();
          const otherGardeners = allUsers.filter(u => u.id !== userId);
          
          // Notify other gardeners about new seedling
          for (const gardener of otherGardeners.slice(0, 10)) { // Limit to 10 for now
            await storage.createNotification(
              gardener.id,
              'new_seedling',
              '🌱 새싹이 첫 영상을 올렸어요!',
              `"${loveTree.title}" 카테고리에 새로운 가드너가 입문했어요! 다음 영상을 추천해보세요.`,
              loveTreeId,
              item.id
            );
          }
        }
      }

      res.json(item);
    } catch (error) {
      console.error("Error creating love tree item:", error);
      res.status(500).json({ message: "Failed to create love tree item" });
    }
  });

  // Stage routes
  app.get('/api/stages', async (req, res) => {
    try {
      const stages = await storage.getLoveTreeStages();
      res.json(stages);
    } catch (error) {
      console.error("Error fetching stages:", error);
      res.status(500).json({ message: "Failed to fetch stages" });
    }
  });

  // Comment routes
  app.get('/api/items/:id/comments', isAuthenticated, async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const comments = await storage.getItemComments(itemId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/items/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const commentData = insertCommentSchema.parse({
        ...req.body,
        loveTreeItemId: itemId,
        userId,
      });
      const comment = await storage.createComment(commentData);
      res.json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Like routes
  app.post('/api/items/:id/like', isAuthenticated, async (req: any, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const result = await storage.toggleLike(itemId, userId);
      
      // Give gardener points when liking content (+2 points)
      if (result.liked) {
        await storage.updateGardenerPoints(userId, 2);
        
        // Create notification for point gain
        await storage.createNotification(
          userId,
          'gardener_points',
          '가드너 포인트 획득! 🌳',
          '하트를 눌러서 +2 포인트를 획득했어요!'
        );
      }
      
      res.json(result);
    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  // Recommendation routes
  app.get('/api/items/:id/recommendations', isAuthenticated, async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const recommendations = await storage.getItemRecommendations(itemId);
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  app.post('/api/items/:id/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const fromItemId = parseInt(req.params.id);
      const recommenderId = req.user.claims.sub;
      const recommendationData = insertRecommendationSchema.parse({
        ...req.body,
        fromItemId,
        recommenderId,
      });
      const recommendation = await storage.createRecommendation(recommendationData);
      res.json(recommendation);
    } catch (error) {
      console.error("Error creating recommendation:", error);
      res.status(500).json({ message: "Failed to create recommendation" });
    }
  });

  app.post('/api/recommendations/:id/select', isAuthenticated, async (req: any, res) => {
    try {
      const recommendationId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const newItemData = insertLoveTreeItemSchema.parse(req.body);
      
      // Get recommendation info to find who made the recommendation
      const recommendation = await storage.getRecommendation(recommendationId);
      if (!recommendation) {
        return res.status(404).json({ message: "Recommendation not found" });
      }
      
      const item = await storage.selectRecommendation(recommendationId, newItemData);
      
      // Reward the recommender with gardener points (+7 points for successful recommendation)
      await storage.updateGardenerPoints(recommendation.recommenderId, 7);
      
      // Notify the recommender about successful selection
      await storage.createNotification(
        recommendation.recommenderId,
        'recommendation_selected',
        '추천 영상이 선택되었어요! ✨',
        `새싹이 당신의 추천 영상을 선택했어요! +7 가드너 포인트를 획득했습니다.`
      );
      
      res.json(item);
    } catch (error) {
      console.error("Error selecting recommendation:", error);
      res.status(500).json({ message: "Failed to select recommendation" });
    }
  });

  // Search routes
  app.get('/api/search', apiLimiter, async (req, res) => {
    try {
      const query = req.query.q as string;
      const category = req.query.category as string | undefined;
      
      if (!query || query.length < 2) {
        return res.json({ loveTrees: [], users: [], tags: [] });
      }
      
      const results = await storage.searchAll(query, category);
      res.json(results);
    } catch (error) {
      console.error("Error searching:", error);
      res.status(500).json({ message: "Failed to search" });
    }
  });

  // Notification routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 20;
      const notifications = await storage.getUserNotifications(userId, limit);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.post('/api/notifications/:id/read', isAuthenticated, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      await storage.markNotificationAsRead(notificationId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Follow routes
  app.post('/api/love-trees/:id/follow', isAuthenticated, async (req: any, res) => {
    try {
      const loveTreeId = parseInt(req.params.id);
      const followerId = req.user.claims.sub;
      await storage.followLoveTree(followerId, loveTreeId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error following love tree:", error);
      res.status(500).json({ message: "Failed to follow love tree" });
    }
  });

  app.delete('/api/love-trees/:id/follow', isAuthenticated, async (req: any, res) => {
    try {
      const loveTreeId = parseInt(req.params.id);
      const followerId = req.user.claims.sub;
      await storage.unfollowLoveTree(followerId, loveTreeId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error unfollowing love tree:", error);
      res.status(500).json({ message: "Failed to unfollow love tree" });
    }
  });

  // Share routes
  app.post('/api/love-trees/:loveTreeId/share', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const loveTreeId = parseInt(req.params.loveTreeId);
      const { platform, shareUrl } = req.body;

      const share = await storage.createShare({
        userId,
        loveTreeId,
        platform,
        shareUrl,
      });

      res.json(share);
    } catch (error) {
      console.error("Error creating share:", error);
      res.status(500).json({ message: "Failed to create share" });
    }
  });

  app.get('/api/love-trees/:loveTreeId/shares', async (req, res) => {
    try {
      const loveTreeId = parseInt(req.params.loveTreeId);
      const shares = await storage.getLoveTreeShares(loveTreeId);
      res.json(shares);
    } catch (error) {
      console.error("Error fetching shares:", error);
      res.status(500).json({ message: "Failed to fetch shares" });
    }
  });

  // 자빠돌이/꼬돌이 API 라우트
  app.post('/api/track-conversion', isAuthenticated, async (req: any, res) => {
    try {
      const recommenderId = req.user.claims.sub;
      const { convertedUserId, loveTreeId, conversionType } = req.body;
      
      const tracking = await storage.trackConversion(recommenderId, convertedUserId, loveTreeId, conversionType);
      res.json(tracking);
    } catch (error) {
      console.error("Error tracking conversion:", error);
      res.status(500).json({ message: "Failed to track conversion" });
    }
  });

  app.get('/api/propagator-stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getPropagatorStats(userId);
      res.json(stats || { totalConversions: 0, monthlyConversions: 0, rank: "새싹 자빠돌이", trustScore: 0 });
    } catch (error) {
      console.error("Error fetching propagator stats:", error);
      res.status(500).json({ message: "Failed to fetch propagator stats" });
    }
  });

  app.get('/api/propagator-rankings', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const rankings = await storage.getPropagatorRankings(limit);
      res.json(rankings);
    } catch (error) {
      console.error("Error fetching propagator rankings:", error);
      res.status(500).json({ message: "Failed to fetch propagator rankings" });
    }
  });

  // 러브트리에 "빠짐" 표시하고 전도사 포인트 지급
  app.post("/api/love-trees/:id/convert", isAuthenticated, async (req, res) => {
    try {
      const loveTreeId = parseInt(req.params.id);
      const convertedUserId = (req.user as any).claims.sub;
      const { conversionType } = req.body; // "tree_complete" 또는 "single_video"
      
      const loveTree = await storage.getLoveTree(loveTreeId);
      if (!loveTree) {
        return res.status(404).json({ message: "Love tree not found" });
      }

      // 전도사 포인트 지급
      const conversion = await storage.trackConversion(
        loveTree.userId, 
        convertedUserId, 
        loveTreeId, 
        conversionType
      );

      // 전도사 통계 업데이트
      await storage.updatePropagatorStats(loveTree.userId);

      // 전도사에게 알림 보내기
      await storage.createNotification(
        loveTree.userId,
        "conversion",
        "새로운 덕후 탄생! 🎉",
        `누군가가 당신의 '${loveTree.title}' 러브트리로 덕후가 되었어요! 전도사 포인트 +10`,
        loveTreeId
      );

      res.json({ 
        success: true, 
        message: "전도사 포인트가 지급되었습니다!",
        conversion 
      });
    } catch (error) {
      console.error("Error tracking conversion:", error);
      res.status(500).json({ message: "Failed to track conversion" });
    }
  });

  // 전도사 구독 기능  
  app.post("/api/propagators/:userId/subscribe", isAuthenticated, async (req, res) => {
    try {
      const propagatorId = req.params.userId;
      const subscriberId = (req.user as any).claims.sub;
      
      // 구독 알림
      await storage.createNotification(
        propagatorId,
        "new_subscriber",
        "새로운 구독자! 👥",
        `새로운 덕후가 당신을 전도사로 구독했어요!`
      );

      res.json({ success: true, message: "전도사를 구독했습니다!" });
    } catch (error) {
      console.error("Error subscribing to propagator:", error);
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
