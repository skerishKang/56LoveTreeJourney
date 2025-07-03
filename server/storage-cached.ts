import { DatabaseStorage } from "./storage";
import { cache } from "./redis";
import type { 
  LoveTree, 
  User, 
  LoveTreeItem, 
  LoveTreeStage,
  Comment,
  Recommendation,
  Notification 
} from "@shared/schema";

// 캐시 키 프리픽스
const CACHE_PREFIX = {
  USER: 'user',
  LOVE_TREE: 'lovetree',
  LOVE_TREE_ITEMS: 'lovetree-items',
  POPULAR_TREES: 'popular-trees',
  USER_TREES: 'user-trees',
  COMMENTS: 'comments',
  RECOMMENDATIONS: 'recommendations',
  NOTIFICATIONS: 'notifications',
  SEARCH: 'search',
};

// 캐시 TTL (초)
const CACHE_TTL = {
  SHORT: 300,    // 5분 - 자주 변경되는 데이터
  MEDIUM: 1800,  // 30분 - 중간 빈도 데이터
  LONG: 3600,    // 1시간 - 잘 변경되지 않는 데이터
  VERY_LONG: 86400, // 24시간 - 거의 변경되지 않는 데이터
};

export class CachedDatabaseStorage extends DatabaseStorage {
  
  // User operations with caching
  async getUser(id: string): Promise<User | undefined> {
    const cacheKey = `${CACHE_PREFIX.USER}:${id}`;
    
    // 캐시 조회
    const cached = await cache.get<User>(cacheKey);
    if (cached) return cached;
    
    // DB 조회
    const user = await super.getUser(id);
    
    // 캐시 저장
    if (user) {
      await cache.set(cacheKey, user, { ttl: CACHE_TTL.MEDIUM });
    }
    
    return user;
  }

  async upsertUser(userData: any): Promise<User> {
    const user = await super.upsertUser(userData);
    
    // 캐시 업데이트
    const cacheKey = `${CACHE_PREFIX.USER}:${user.id}`;
    await cache.set(cacheKey, user, { ttl: CACHE_TTL.MEDIUM });
    
    return user;
  }

  // Love Tree operations with caching
  async getLoveTree(id: number): Promise<LoveTree | undefined> {
    const cacheKey = `${CACHE_PREFIX.LOVE_TREE}:${id}`;
    
    const cached = await cache.get<LoveTree>(cacheKey);
    if (cached) return cached;
    
    const loveTree = await super.getLoveTree(id);
    
    if (loveTree) {
      await cache.set(cacheKey, loveTree, { ttl: CACHE_TTL.MEDIUM });
    }
    
    return loveTree;
  }

  async getUserLoveTrees(userId: string): Promise<LoveTree[]> {
    const cacheKey = `${CACHE_PREFIX.USER_TREES}:${userId}`;
    
    const cached = await cache.get<LoveTree[]>(cacheKey);
    if (cached) return cached;
    
    const loveTrees = await super.getUserLoveTrees(userId);
    
    await cache.set(cacheKey, loveTrees, { ttl: CACHE_TTL.SHORT });
    
    return loveTrees;
  }

  async createLoveTree(loveTree: any): Promise<LoveTree> {
    const newLoveTree = await super.createLoveTree(loveTree);
    
    // 관련 캐시 무효화
    await cache.delPattern(`${CACHE_PREFIX.USER_TREES}:${loveTree.userId}`);
    await cache.del(`${CACHE_PREFIX.POPULAR_TREES}:*`);
    
    return newLoveTree;
  }

  async getPopularLoveTrees(limit?: number): Promise<any[]> {
    const cacheKey = `${CACHE_PREFIX.POPULAR_TREES}:${limit || 10}`;
    
    const cached = await cache.get<any[]>(cacheKey);
    if (cached) return cached;
    
    const popularTrees = await super.getPopularLoveTrees(limit);
    
    await cache.set(cacheKey, popularTrees, { ttl: CACHE_TTL.SHORT });
    
    return popularTrees;
  }

  // Love Tree Items with caching
  async getLoveTreeItems(loveTreeId: number): Promise<any[]> {
    const cacheKey = `${CACHE_PREFIX.LOVE_TREE_ITEMS}:${loveTreeId}`;
    
    const cached = await cache.get<any[]>(cacheKey);
    if (cached) return cached;
    
    const items = await super.getLoveTreeItems(loveTreeId);
    
    await cache.set(cacheKey, items, { ttl: CACHE_TTL.SHORT });
    
    return items;
  }

  async createLoveTreeItem(item: any): Promise<LoveTreeItem> {
    const newItem = await super.createLoveTreeItem(item);
    
    // 관련 캐시 무효화
    await cache.del(`${CACHE_PREFIX.LOVE_TREE_ITEMS}:${item.loveTreeId}`);
    await cache.del(`${CACHE_PREFIX.LOVE_TREE}:${item.loveTreeId}`);
    
    return newItem;
  }

  // Comments with caching
  async getItemComments(itemId: number): Promise<any[]> {
    const cacheKey = `${CACHE_PREFIX.COMMENTS}:${itemId}`;
    
    const cached = await cache.get<any[]>(cacheKey);
    if (cached) return cached;
    
    const comments = await super.getItemComments(itemId);
    
    await cache.set(cacheKey, comments, { ttl: CACHE_TTL.SHORT });
    
    return comments;
  }

  async createComment(comment: any): Promise<Comment> {
    const newComment = await super.createComment(comment);
    
    // 관련 캐시 무효화
    await cache.del(`${CACHE_PREFIX.COMMENTS}:${comment.loveTreeItemId}`);
    
    return newComment;
  }

  // Recommendations with caching
  async getItemRecommendations(itemId: number): Promise<any[]> {
    const cacheKey = `${CACHE_PREFIX.RECOMMENDATIONS}:${itemId}`;
    
    const cached = await cache.get<any[]>(cacheKey);
    if (cached) return cached;
    
    const recommendations = await super.getItemRecommendations(itemId);
    
    await cache.set(cacheKey, recommendations, { ttl: CACHE_TTL.SHORT });
    
    return recommendations;
  }

  async createRecommendation(recommendation: any): Promise<Recommendation> {
    const newRec = await super.createRecommendation(recommendation);
    
    // 관련 캐시 무효화
    await cache.del(`${CACHE_PREFIX.RECOMMENDATIONS}:${recommendation.fromItemId}`);
    
    return newRec;
  }

  // Notifications with caching
  async getUserNotifications(userId: string, limit?: number): Promise<Notification[]> {
    const cacheKey = `${CACHE_PREFIX.NOTIFICATIONS}:${userId}:${limit || 20}`;
    
    const cached = await cache.get<Notification[]>(cacheKey);
    if (cached) return cached;
    
    const notifications = await super.getUserNotifications(userId, limit);
    
    await cache.set(cacheKey, notifications, { ttl: CACHE_TTL.SHORT });
    
    return notifications;
  }

  async createNotification(...args: any[]): Promise<Notification> {
    const notification = await super.createNotification(...args);
    const userId = args[0];
    
    // 관련 캐시 무효화
    await cache.delPattern(`${CACHE_PREFIX.NOTIFICATIONS}:${userId}:*`);
    
    return notification;
  }

  // Search with caching
  async searchAll(query: string, category?: string): Promise<any> {
    const cacheKey = `${CACHE_PREFIX.SEARCH}:${query}:${category || 'all'}`;
    
    const cached = await cache.get<any>(cacheKey);
    if (cached) return cached;
    
    const results = await super.searchAll(query, category);
    
    // 검색 결과는 짧은 시간만 캐싱
    await cache.set(cacheKey, results, { ttl: CACHE_TTL.SHORT });
    
    return results;
  }

  // Like operations
  async toggleLike(itemId: number, userId: string): Promise<any> {
    const result = await super.toggleLike(itemId, userId);
    
    // 관련 캐시 무효화
    const item = await super.getLoveTreeItem(itemId);
    if (item) {
      await cache.del(`${CACHE_PREFIX.LOVE_TREE_ITEMS}:${item.loveTreeId}`);
    }
    
    return result;
  }

  // Stages (very stable data - long cache)
  async getLoveTreeStages(): Promise<LoveTreeStage[]> {
    const cacheKey = `${CACHE_PREFIX.LOVE_TREE}:stages`;
    
    const cached = await cache.get<LoveTreeStage[]>(cacheKey);
    if (cached) return cached;
    
    const stages = await super.getLoveTreeStages();
    
    await cache.set(cacheKey, stages, { ttl: CACHE_TTL.VERY_LONG });
    
    return stages;
  }
}

// Export cached storage instance
export const cachedStorage = new CachedDatabaseStorage();