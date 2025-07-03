import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // 러브트리 가드너 시스템
  propagatorScore: integer("propagator_score").default(0), // 가드너 점수
  propagatorRank: varchar("propagator_rank", { length: 50 }).default("새싹 가드너"), // 새싹 가드너, 정원사, 마스터 가드너, 레전드 가드너
  successfulRecommendations: integer("successful_recommendations").default(0), // 성공한 입덕 유도 수
  totalWatchTime: integer("total_watch_time").default(0), // 총 시청 시간 (분)
  dailyVideoCount: integer("daily_video_count").default(0), // 하루 영상 수
  lastActiveDate: timestamp("last_active_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Love Tree stages
export const loveTreeStages = pgTable("love_tree_stages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(), // 썸, 폴인럽, 완성 등
  maxItems: integer("max_items").notNull(), // 각 단계별 최대 아이템 수
  order: integer("order").notNull(), // 단계 순서
  color: varchar("color", { length: 7 }).notNull(), // 단계별 색상
});

// Love Trees - 사용자별 러브트리
export const loveTrees = pgTable("love_trees", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // K-pop, 드라마, 애니메이션 등
  targetPerson: varchar("target_person", { length: 200 }), // 입덕 대상 (아이돌, 배우 등)
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  isPublic: boolean("is_public").default(true),
  totalDuration: integer("total_duration"), // 완성까지 걸린 시간 (시간 단위)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Love Tree Items - 러브트리의 각 컨텐츠
export const loveTreeItems = pgTable("love_tree_items", {
  id: serial("id").primaryKey(),
  loveTreeId: integer("love_tree_id").references(() => loveTrees.id).notNull(),
  stageId: integer("stage_id").references(() => loveTreeStages.id).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  contentType: varchar("content_type", { length: 50 }).notNull(), // youtube, instagram, tiktok, etc.
  contentUrl: varchar("content_url", { length: 500 }),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  platform: varchar("platform", { length: 50 }).notNull(),
  isFirstContent: boolean("is_first_content").default(false), // 첫 영상인지
  reachedAt: timestamp("reached_at"),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Comments on Love Tree Items
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  loveTreeItemId: integer("love_tree_item_id").references(() => loveTreeItems.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Likes on Love Tree Items
export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  loveTreeItemId: integer("love_tree_item_id").references(() => loveTreeItems.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Recommendations - 다음 영상 추천
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  fromItemId: integer("from_item_id").references(() => loveTreeItems.id).notNull(),
  toItemId: integer("to_item_id").references(() => loveTreeItems.id),
  recommenderId: varchar("recommender_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  contentUrl: varchar("content_url", { length: 500 }),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  platform: varchar("platform", { length: 50 }).notNull(),
  isSelected: boolean("is_selected").default(false), // 새싹이 선택했는지
  createdAt: timestamp("created_at").defaultNow(),
});

// Tags for categorization
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  color: varchar("color", { length: 7 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Love Tree Tags (many-to-many)
export const loveTreeTags = pgTable("love_tree_tags", {
  id: serial("id").primaryKey(),
  loveTreeId: integer("love_tree_id").references(() => loveTrees.id).notNull(),
  tagId: integer("tag_id").references(() => tags.id).notNull(),
});

// Follows - 다른 유저의 러브트리 팔로우
export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: varchar("follower_id").references(() => users.id).notNull(),
  followingLoveTreeId: integer("following_love_tree_id").references(() => loveTrees.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // new_seedling, recommendation, like, comment
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  relatedLoveTreeId: integer("related_love_tree_id").references(() => loveTrees.id),
  relatedItemId: integer("related_item_id").references(() => loveTreeItems.id),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// 공유 기록 테이블
export const shares = pgTable("shares", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  loveTreeId: integer("love_tree_id").notNull().references(() => loveTrees.id),
  platform: varchar("platform", { length: 50 }).notNull(), // 'twitter', 'facebook', 'instagram', 'kakao', 'link'
  shareUrl: text("share_url"),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// 입덕 성공 기록 (러브트리 가드너 포인트 시스템)
export const conversions = pgTable("conversions", {
  id: serial("id").primaryKey(),
  gardenerId: varchar("gardener_id").references(() => users.id).notNull(), // 가드너 (추천한 사람)
  convertedUserId: varchar("converted_user_id").references(() => users.id).notNull(), // 입덕한 사람
  loveTreeId: integer("love_tree_id").references(() => loveTrees.id).notNull(), // 어떤 러브트리로 입덕했는지
  pointsEarned: integer("points_earned").default(10), // 획득 포인트
  conversionType: varchar("conversion_type", { length: 50 }).default("heart_reaction"), // heart_reaction, follow, share
  createdAt: timestamp("created_at").defaultNow(),
});

// 가드너 팔로우 시스템 (Felix 가드너가 새로운 인물 올릴 때 알림)
export const gardenerFollows = pgTable("gardener_follows", {
  id: serial("id").primaryKey(),
  followerId: varchar("follower_id").references(() => users.id).notNull(), // 팔로워
  gardenerId: varchar("gardener_id").references(() => users.id).notNull(), // 팔로우당하는 가드너
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  loveTrees: many(loveTrees),
  comments: many(comments),
  likes: many(likes),
  recommendations: many(recommendations),
  follows: many(follows),
  notifications: many(notifications),
  shares: many(shares),
}));

export const loveTreesRelations = relations(loveTrees, ({ one, many }) => ({
  user: one(users, {
    fields: [loveTrees.userId],
    references: [users.id],
  }),
  items: many(loveTreeItems),
  tags: many(loveTreeTags),
  followers: many(follows),
  shares: many(shares),
}));

export const loveTreeItemsRelations = relations(loveTreeItems, ({ one, many }) => ({
  loveTree: one(loveTrees, {
    fields: [loveTreeItems.loveTreeId],
    references: [loveTrees.id],
  }),
  stage: one(loveTreeStages, {
    fields: [loveTreeItems.stageId],
    references: [loveTreeStages.id],
  }),
  comments: many(comments),
  likes: many(likes),
  recommendationsFrom: many(recommendations, {
    relationName: "fromItem",
  }),
  recommendationsTo: many(recommendations, {
    relationName: "toItem",
  }),
}));

export const recommendationsRelations = relations(recommendations, ({ one }) => ({
  fromItem: one(loveTreeItems, {
    fields: [recommendations.fromItemId],
    references: [loveTreeItems.id],
    relationName: "fromItem",
  }),
  toItem: one(loveTreeItems, {
    fields: [recommendations.toItemId],
    references: [loveTreeItems.id],
    relationName: "toItem",
  }),
  recommender: one(users, {
    fields: [recommendations.recommenderId],
    references: [users.id],
  }),
}));

export const sharesRelations = relations(shares, ({ one }) => ({
  user: one(users, {
    fields: [shares.userId],
    references: [users.id],
  }),
  loveTree: one(loveTrees, {
    fields: [shares.loveTreeId],
    references: [loveTrees.id],
  }),
}));

// Insert schemas
export const upsertUserSchema = createInsertSchema(users);
export const insertLoveTreeSchema = createInsertSchema(loveTrees).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertLoveTreeItemSchema = createInsertSchema(loveTreeItems).omit({
  id: true,
  createdAt: true,
});
export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});
export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
});
export const insertTagSchema = createInsertSchema(tags).omit({
  id: true,
  createdAt: true,
});

export const insertShareSchema = createInsertSchema(shares).omit({
  id: true,
  createdAt: true,
  viewCount: true,
});

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoveTree = typeof loveTrees.$inferSelect;
export type InsertLoveTree = z.infer<typeof insertLoveTreeSchema>;
export type LoveTreeItem = typeof loveTreeItems.$inferSelect;
export type InsertLoveTreeItem = z.infer<typeof insertLoveTreeItemSchema>;
export type LoveTreeStage = typeof loveTreeStages.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Like = typeof likes.$inferSelect;
export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Tag = typeof tags.$inferSelect;
export type InsertTag = z.infer<typeof insertTagSchema>;
export type Notification = typeof notifications.$inferSelect;
export type Share = typeof shares.$inferSelect;
export type InsertShare = z.infer<typeof insertShareSchema>;

// 커뮤니티 활동 트래커
export const communityActivities = pgTable("community_activities", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  platform: varchar("platform").notNull(), // 더쿠, 여시, 디시, 인벤 등
  activityType: varchar("activity_type").notNull(), // 게시글, 댓글, 좋아요 등
  title: varchar("title"),
  url: varchar("url"),
  content: text("content"),
  likeCount: integer("like_count").default(0),
  commentCount: integer("comment_count").default(0),
  isPopular: boolean("is_popular").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_community_activities_user").on(table.userId),
  index("idx_community_activities_platform").on(table.platform),
]);

// 굿즈 컬렉션
export const goodsCollection = pgTable("goods_collection", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  category: varchar("category").notNull(), // 앨범, 포토카드, 의류, 액세서리 등
  itemName: varchar("item_name").notNull(),
  artist: varchar("artist"),
  price: integer("price"),
  purchaseDate: timestamp("purchase_date"),
  platform: varchar("platform"), // 온라인몰, 오프라인매장 등
  condition: varchar("condition"), // 새상품, 중고 등
  rarity: varchar("rarity"), // 일반, 한정판, 사인 등
  imageUrl: varchar("image_url"),
  notes: text("notes"),
  isWishlist: boolean("is_wishlist").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_goods_collection_user").on(table.userId),
  index("idx_goods_collection_category").on(table.category),
  index("idx_goods_collection_artist").on(table.artist),
]);

// 팬 활동 일지
export const fanActivities = pgTable("fan_activities", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  activityType: varchar("activity_type").notNull(), // 콘서트, 팬사인회, 성지순례 등
  title: varchar("title").notNull(),
  artist: varchar("artist"),
  venue: varchar("venue"), // 장소
  eventDate: timestamp("event_date"),
  cost: integer("cost"), // 비용
  companions: text("companions"), // 동행자
  photos: text("photos").array(), // 사진 URL 배열
  review: text("review"), // 후기
  rating: integer("rating"), // 1-5 별점
  isSpecial: boolean("is_special").default(false), // 특별한 경험
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_fan_activities_user").on(table.userId),
  index("idx_fan_activities_type").on(table.activityType),
  index("idx_fan_activities_artist").on(table.artist),
]);

// 구독 서비스 관리 (버블, 위버스 등)
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  platform: varchar("platform").notNull(), // 버블, 위버스, 팬클럽 등
  artist: varchar("artist").notNull(),
  subscriptionType: varchar("subscription_type"), // 월구독, 연구독 등
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  monthlyFee: integer("monthly_fee"),
  isActive: boolean("is_active").default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_subscriptions_user").on(table.userId),
  index("idx_subscriptions_platform").on(table.platform),
  index("idx_subscriptions_artist").on(table.artist),
]);

// 새로운 타입들
export const insertCommunityActivitySchema = createInsertSchema(communityActivities).omit({
  id: true,
  createdAt: true,
});

export const insertGoodsCollectionSchema = createInsertSchema(goodsCollection).omit({
  id: true,
  createdAt: true,
});

export const insertFanActivitySchema = createInsertSchema(fanActivities).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});

export type CommunityActivity = typeof communityActivities.$inferSelect;
export type InsertCommunityActivity = z.infer<typeof insertCommunityActivitySchema>;
export type GoodsCollection = typeof goodsCollection.$inferSelect;
export type InsertGoodsCollection = z.infer<typeof insertGoodsCollectionSchema>;
export type FanActivity = typeof fanActivities.$inferSelect;
export type InsertFanActivity = z.infer<typeof insertFanActivitySchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

// Shorts videos for community sharing
export const shortsVideos = pgTable("shorts_videos", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  thumbnail: varchar("thumbnail", { length: 500 }),
  artist: varchar("artist", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  stage: varchar("stage", { length: 20 }).notNull(), // 썸, 폴인럽, 최애
  uploaderId: varchar("uploader_id").notNull().references(() => users.id),
  initialReview: text("initial_review"),
  initialRating: integer("initial_rating").default(5),
  recommendationCount: integer("recommendation_count").default(0),
  avgRating: varchar("avg_rating", { length: 10 }).default("5.00"),
  isPopular: boolean("is_popular").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Shorts video recommendations/reviews
export const shortsRecommendations = pgTable("shorts_recommendations", {
  id: serial("id").primaryKey(),
  shortId: integer("short_id").notNull().references(() => shortsVideos.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id),
  review: text("review").notNull(),
  rating: integer("rating").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertShortsVideoSchema = createInsertSchema(shortsVideos).omit({
  id: true,
  recommendationCount: true,
  avgRating: true,
  isPopular: true,
  createdAt: true,
  updatedAt: true,
});

export const insertShortsRecommendationSchema = createInsertSchema(shortsRecommendations).omit({
  id: true,
  createdAt: true,
});

export type ShortsVideo = typeof shortsVideos.$inferSelect;
export type InsertShortsVideo = z.infer<typeof insertShortsVideoSchema>;
export type ShortsRecommendation = typeof shortsRecommendations.$inferSelect;
export type InsertShortsRecommendation = z.infer<typeof insertShortsRecommendationSchema>;

// 자빠돌이/꼬돌이 추적 시스템 - 추천으로 입덕시킨 횟수 추적
export const conversionTracking = pgTable("conversion_tracking", {
  id: serial("id").primaryKey(),
  recommenderId: varchar("recommender_id").notNull().references(() => users.id), // 추천한 사람 (자빠돌이/꼬돌이)
  convertedUserId: varchar("converted_user_id").notNull().references(() => users.id), // 입덕한 사람
  loveTreeId: integer("love_tree_id").notNull().references(() => loveTrees.id), // 추천한 러브트리
  conversionType: varchar("conversion_type", { length: 20 }).notNull(), // "love_tree_view", "follow", "complete"
  createdAt: timestamp("created_at").defaultNow(),
});

// 자빠돌이/꼬돌이 랭킹 시스템
export const propagatorStats = pgTable("propagator_stats", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  totalConversions: integer("total_conversions").default(0), // 총 입덕시킨 횟수
  monthlyConversions: integer("monthly_conversions").default(0), // 이번 달 입덕시킨 횟수
  rank: varchar("rank", { length: 20 }).default("새싹 자빠돌이"), // 자빠돌이 등급
  trustScore: integer("trust_score").default(0), // 신뢰도 점수
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertConversionTrackingSchema = createInsertSchema(conversionTracking).omit({
  id: true,
  createdAt: true,
});

export const insertPropagatorStatsSchema = createInsertSchema(propagatorStats).omit({
  id: true,
  lastUpdated: true,
});

export type ConversionTracking = typeof conversionTracking.$inferSelect;
export type InsertConversionTracking = z.infer<typeof insertConversionTrackingSchema>;
export type PropagatorStats = typeof propagatorStats.$inferSelect;
export type InsertPropagatorStats = z.infer<typeof insertPropagatorStatsSchema>;
