import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertLoveTreeSchema,
  insertLoveTreeItemSchema,
  insertCommentSchema,
  insertRecommendationSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Initialize stages
  await storage.initializeStages();

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
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
      res.json(loveTree);
    } catch (error) {
      console.error("Error creating love tree:", error);
      res.status(500).json({ message: "Failed to create love tree" });
    }
  });

  app.get('/api/love-trees/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
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
      const itemData = insertLoveTreeItemSchema.parse({
        ...req.body,
        loveTreeId,
      });
      const item = await storage.createLoveTreeItem(itemData);

      // Create notification for new seedling
      if (itemData.isFirstContent) {
        const loveTree = await storage.getLoveTree(loveTreeId);
        if (loveTree) {
          // Here you would notify followers, but for now we'll just create a general notification
          await storage.createNotification(
            loveTree.userId,
            'new_seedling',
            '새싹이 첫 영상을 올렸어요!',
            `${loveTree.title}에 첫 번째 콘텐츠가 추가되었습니다.`,
            loveTreeId,
            item.id
          );
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
      const newItemData = insertLoveTreeItemSchema.parse(req.body);
      const item = await storage.selectRecommendation(recommendationId, newItemData);
      res.json(item);
    } catch (error) {
      console.error("Error selecting recommendation:", error);
      res.status(500).json({ message: "Failed to select recommendation" });
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

  const httpServer = createServer(app);
  return httpServer;
}
