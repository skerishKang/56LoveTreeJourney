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
  // 자빠돌이/꼬돌이 시스템
  propagatorScore: integer("propagator_score").default(0), // 전도사 점수
  propagatorRank: varchar("propagator_rank", { length: 50 }).default("새싹"), // 새싹, 전도사, 마스터
  successfulRecommendations: integer("successful_recommendations").default(0), // 성공한 추천 수
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
