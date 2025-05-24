import {
  users,
  loveTrees,
  loveTreeItems,
  loveTreeStages,
  comments,
  likes,
  recommendations,
  tags,
  loveTreeTags,
  follows,
  notifications,
  shares,
  type User,
  type UpsertUser,
  type LoveTree,
  type InsertLoveTree,
  type LoveTreeItem,
  type InsertLoveTreeItem,
  type LoveTreeStage,
  type Comment,
  type InsertComment,
  type Like,
  type Recommendation,
  type InsertRecommendation,
  type Tag,
  type InsertTag,
  type Notification,
  type Share,
  type InsertShare,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, or, isNull } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllActiveGardeners(): Promise<User[]>;
  
  // Gardener system operations
  updateGardenerPoints(userId: string, points: number): Promise<User>;
  updateGardenerRank(userId: string): Promise<User>;

  // Love Tree operations
  getUserLoveTrees(userId: string): Promise<LoveTree[]>;
  getLoveTree(id: number): Promise<LoveTree | undefined>;
  createLoveTree(loveTree: InsertLoveTree): Promise<LoveTree>;
  updateLoveTree(id: number, updates: Partial<InsertLoveTree>): Promise<LoveTree>;
  getPopularLoveTrees(limit?: number): Promise<(LoveTree & { user: User; itemCount: number; likeCount: number })[]>;

  // Love Tree Item operations
  getLoveTreeItems(loveTreeId: number): Promise<(LoveTreeItem & { stage: LoveTreeStage; likeCount: number; commentCount: number })[]>;
  createLoveTreeItem(item: InsertLoveTreeItem): Promise<LoveTreeItem>;
  getLoveTreeItem(id: number): Promise<LoveTreeItem | undefined>;

  // Stage operations
  getLoveTreeStages(): Promise<LoveTreeStage[]>;
  initializeStages(): Promise<void>;

  // Comment operations
  getItemComments(itemId: number): Promise<(Comment & { user: User })[]>;
  createComment(comment: InsertComment): Promise<Comment>;

  // Like operations
  toggleLike(itemId: number, userId: string): Promise<{ liked: boolean; likeCount: number }>;
  getUserLike(itemId: number, userId: string): Promise<Like | undefined>;

  // Recommendation operations
  getItemRecommendations(itemId: number): Promise<(Recommendation & { recommender: User })[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  getRecommendation(recommendationId: number): Promise<Recommendation | undefined>;
  selectRecommendation(recommendationId: number, newItemData: InsertLoveTreeItem): Promise<LoveTreeItem>;

  // Tag operations
  getTags(): Promise<Tag[]>;
  createTag(tag: InsertTag): Promise<Tag>;

  // Notification operations
  getUserNotifications(userId: string, limit?: number): Promise<Notification[]>;
  createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    relatedLoveTreeId?: number,
    relatedItemId?: number
  ): Promise<Notification>;
  markNotificationAsRead(notificationId: number): Promise<void>;

  // Follow operations
  followLoveTree(followerId: string, loveTreeId: number): Promise<void>;
  unfollowLoveTree(followerId: string, loveTreeId: number): Promise<void>;

  // Share operations
  createShare(share: InsertShare): Promise<Share>;
  getLoveTreeShares(loveTreeId: number): Promise<Share[]>;
  incrementShareView(shareId: number): Promise<void>;

  // Shorts videos operations
  getShortsVideos(category?: string): Promise<any[]>;
  createShortsVideo(shorts: any): Promise<any>;
  createShortsRecommendation(recommendation: any): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAllActiveGardeners(): Promise<User[]> {
    const allUsers = await db
      .select()
      .from(users)
      .where(sql`${users.propagatorScore} > 0`)
      .orderBy(desc(users.propagatorScore));
    return allUsers;
  }

  // Gardener system operations
  async updateGardenerPoints(userId: string, points: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        propagatorScore: sql`${users.propagatorScore} + ${points}`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    // Check if rank should be updated
    await this.updateGardenerRank(userId);
    
    return user;
  }

  async updateGardenerRank(userId: string): Promise<User> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));
    
    if (!user) throw new Error("User not found");
    
    const score = user.propagatorScore || 0;
    let newRank = "새싹 가드너";
    
    if (score >= 151) {
      newRank = "레전드 가드너";
    } else if (score >= 51) {
      newRank = "마스터 가드너";
    } else if (score >= 11) {
      newRank = "정원사";
    }
    
    if (newRank !== user.propagatorRank) {
      const [updatedUser] = await db
        .update(users)
        .set({
          propagatorRank: newRank,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();
      return updatedUser;
    }
    
    return user;
  }

  // Love Tree operations
  async getUserLoveTrees(userId: string): Promise<LoveTree[]> {
    return await db
      .select()
      .from(loveTrees)
      .where(eq(loveTrees.userId, userId))
      .orderBy(desc(loveTrees.createdAt));
  }

  async getLoveTree(id: number): Promise<LoveTree | undefined> {
    const [loveTree] = await db
      .select()
      .from(loveTrees)
      .where(eq(loveTrees.id, id));
    return loveTree;
  }

  async createLoveTree(loveTree: InsertLoveTree): Promise<LoveTree> {
    const [newLoveTree] = await db
      .insert(loveTrees)
      .values(loveTree)
      .returning();
    return newLoveTree;
  }

  async updateLoveTree(id: number, updates: Partial<InsertLoveTree>): Promise<LoveTree> {
    const [updatedLoveTree] = await db
      .update(loveTrees)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(loveTrees.id, id))
      .returning();
    return updatedLoveTree;
  }

  async getPopularLoveTrees(limit = 10): Promise<(LoveTree & { user: User; itemCount: number; likeCount: number })[]> {
    try {
      const result = await db
        .select({
          loveTree: loveTrees,
          user: users,
          itemCount: sql<number>`count(distinct ${loveTreeItems.id})`,
          likeCount: sql<number>`count(distinct ${likes.id})`,
        })
        .from(loveTrees)
        .innerJoin(users, eq(loveTrees.userId, users.id))
        .leftJoin(loveTreeItems, eq(loveTrees.id, loveTreeItems.loveTreeId))
        .leftJoin(likes, eq(loveTreeItems.id, likes.loveTreeItemId))
        .where(eq(loveTrees.isPublic, true))
        .groupBy(loveTrees.id, users.id)
        .orderBy(desc(sql`count(distinct ${likes.id})`))
        .limit(limit);

      return result.map((row) => ({
        ...row.loveTree,
        user: row.user,
        itemCount: row.itemCount,
        likeCount: row.likeCount,
      }));
    } catch (error) {
      console.error("Error in getPopularLoveTrees:", error);
      // Return empty array if no data yet
      return [];
    }
  }

  // Love Tree Item operations
  async getLoveTreeItems(loveTreeId: number): Promise<(LoveTreeItem & { stage: LoveTreeStage; likeCount: number; commentCount: number })[]> {
    const result = await db
      .select({
        item: loveTreeItems,
        stage: loveTreeStages,
        likeCount: sql<number>`count(distinct ${likes.id})`,
        commentCount: sql<number>`count(distinct ${comments.id})`,
      })
      .from(loveTreeItems)
      .innerJoin(loveTreeStages, eq(loveTreeItems.stageId, loveTreeStages.id))
      .leftJoin(likes, eq(loveTreeItems.id, likes.loveTreeItemId))
      .leftJoin(comments, eq(loveTreeItems.id, comments.loveTreeItemId))
      .where(eq(loveTreeItems.loveTreeId, loveTreeId))
      .groupBy(loveTreeItems.id, loveTreeStages.id)
      .orderBy(loveTreeStages.order, loveTreeItems.order);

    return result.map((row) => ({
      ...row.item,
      stage: row.stage,
      likeCount: row.likeCount,
      commentCount: row.commentCount,
    }));
  }

  async createLoveTreeItem(item: InsertLoveTreeItem): Promise<LoveTreeItem> {
    const [newItem] = await db
      .insert(loveTreeItems)
      .values(item)
      .returning();
    return newItem;
  }

  async getLoveTreeItem(id: number): Promise<LoveTreeItem | undefined> {
    const [item] = await db
      .select()
      .from(loveTreeItems)
      .where(eq(loveTreeItems.id, id));
    return item;
  }

  // Stage operations
  async getLoveTreeStages(): Promise<LoveTreeStage[]> {
    return await db
      .select()
      .from(loveTreeStages)
      .orderBy(loveTreeStages.order);
  }

  async initializeStages(): Promise<void> {
    const existingStages = await this.getLoveTreeStages();
    if (existingStages.length === 0) {
      await db.insert(loveTreeStages).values([
        { name: "썸", maxItems: 100, order: 1, color: "#FFB6C1" },
        { name: "폴인럽", maxItems: 200, order: 2, color: "#FF69B4" },
        { name: "완성", maxItems: 999, order: 3, color: "#4ECDC4" },
      ]);
    }
  }

  // Comment operations
  async getItemComments(itemId: number): Promise<(Comment & { user: User })[]> {
    const result = await db
      .select({
        comment: comments,
        user: users,
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.loveTreeItemId, itemId))
      .orderBy(desc(comments.createdAt));

    return result.map((row) => ({
      ...row.comment,
      user: row.user,
    }));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db
      .insert(comments)
      .values(comment)
      .returning();
    return newComment;
  }

  // Like operations
  async toggleLike(itemId: number, userId: string): Promise<{ liked: boolean; likeCount: number }> {
    const existingLike = await this.getUserLike(itemId, userId);
    
    if (existingLike) {
      await db
        .delete(likes)
        .where(and(eq(likes.loveTreeItemId, itemId), eq(likes.userId, userId)));
    } else {
      await db
        .insert(likes)
        .values({ loveTreeItemId: itemId, userId });
    }

    const [likeCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(likes)
      .where(eq(likes.loveTreeItemId, itemId));

    return {
      liked: !existingLike,
      likeCount: likeCount.count,
    };
  }

  async getUserLike(itemId: number, userId: string): Promise<Like | undefined> {
    const [like] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.loveTreeItemId, itemId), eq(likes.userId, userId)));
    return like;
  }

  // Recommendation operations
  async getItemRecommendations(itemId: number): Promise<(Recommendation & { recommender: User })[]> {
    const result = await db
      .select({
        recommendation: recommendations,
        recommender: users,
      })
      .from(recommendations)
      .innerJoin(users, eq(recommendations.recommenderId, users.id))
      .where(eq(recommendations.fromItemId, itemId))
      .orderBy(desc(recommendations.createdAt));

    return result.map((row) => ({
      ...row.recommendation,
      recommender: row.recommender,
    }));
  }

  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const [newRecommendation] = await db
      .insert(recommendations)
      .values(recommendation)
      .returning();
    return newRecommendation;
  }

  async getRecommendation(recommendationId: number): Promise<Recommendation | undefined> {
    const [recommendation] = await db
      .select()
      .from(recommendations)
      .where(eq(recommendations.id, recommendationId));
    return recommendation;
  }

  async selectRecommendation(recommendationId: number, newItemData: InsertLoveTreeItem): Promise<LoveTreeItem> {
    // Mark recommendation as selected
    await db
      .update(recommendations)
      .set({ isSelected: true })
      .where(eq(recommendations.id, recommendationId));

    // Create new love tree item from recommendation
    const [newItem] = await db
      .insert(loveTreeItems)
      .values(newItemData)
      .returning();

    return newItem;
  }

  // Tag operations
  async getTags(): Promise<Tag[]> {
    return await db
      .select()
      .from(tags)
      .orderBy(tags.name);
  }

  async createTag(tag: InsertTag): Promise<Tag> {
    const [newTag] = await db
      .insert(tags)
      .values(tag)
      .returning();
    return newTag;
  }

  // Notification operations
  async getUserNotifications(userId: string, limit = 20): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  }

  async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    relatedLoveTreeId?: number,
    relatedItemId?: number
  ): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values({
        userId,
        type,
        title,
        message,
        relatedLoveTreeId,
        relatedItemId,
      })
      .returning();
    return notification;
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId));
  }

  // Follow operations
  async followLoveTree(followerId: string, loveTreeId: number): Promise<void> {
    await db
      .insert(follows)
      .values({ followerId, followingLoveTreeId: loveTreeId });
  }

  async unfollowLoveTree(followerId: string, loveTreeId: number): Promise<void> {
    await db
      .delete(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingLoveTreeId, loveTreeId)));
  }

  // Share operations
  async createShare(share: InsertShare): Promise<Share> {
    const [newShare] = await db
      .insert(shares)
      .values(share)
      .returning();
    return newShare;
  }

  async getLoveTreeShares(loveTreeId: number): Promise<Share[]> {
    return await db
      .select()
      .from(shares)
      .where(eq(shares.loveTreeId, loveTreeId))
      .orderBy(desc(shares.createdAt));
  }

  async incrementShareView(shareId: number): Promise<void> {
    await db
      .update(shares)
      .set({ viewCount: sql`${shares.viewCount} + 1` })
      .where(eq(shares.id, shareId));
  }
}

export const storage = new DatabaseStorage();
