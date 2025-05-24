import { apiRequest } from "./queryClient";

export const api = {
  // Auth
  getUser: () => fetch("/api/auth/user", { credentials: "include" }).then(res => res.json()),

  // Love Trees
  getLoveTrees: () => fetch("/api/love-trees", { credentials: "include" }).then(res => res.json()),
  createLoveTree: (data: any) => apiRequest("POST", "/api/love-trees", data),
  getLoveTree: (id: number) => fetch(`/api/love-trees/${id}`, { credentials: "include" }).then(res => res.json()),
  getPopularLoveTrees: (limit?: number) => 
    fetch(`/api/love-trees/popular?limit=${limit || 10}`, { credentials: "include" }).then(res => res.json()),

  // Love Tree Items
  getLoveTreeItems: (loveTreeId: number) => 
    fetch(`/api/love-trees/${loveTreeId}/items`, { credentials: "include" }).then(res => res.json()),
  createLoveTreeItem: (loveTreeId: number, data: any) => 
    apiRequest("POST", `/api/love-trees/${loveTreeId}/items`, data),

  // Stages
  getStages: () => fetch("/api/stages").then(res => res.json()),

  // Comments
  getItemComments: (itemId: number) => 
    fetch(`/api/items/${itemId}/comments`, { credentials: "include" }).then(res => res.json()),
  createComment: (itemId: number, data: any) => 
    apiRequest("POST", `/api/items/${itemId}/comments`, data),

  // Likes
  toggleLike: (itemId: number) => 
    apiRequest("POST", `/api/items/${itemId}/like`, {}),

  // Recommendations
  getItemRecommendations: (itemId: number) => 
    fetch(`/api/items/${itemId}/recommendations`, { credentials: "include" }).then(res => res.json()),
  createRecommendation: (itemId: number, data: any) => 
    apiRequest("POST", `/api/items/${itemId}/recommendations`, data),
  selectRecommendation: (recommendationId: number, data: any) => 
    apiRequest("POST", `/api/recommendations/${recommendationId}/select`, data),

  // Notifications
  getNotifications: (limit?: number) => 
    fetch(`/api/notifications?limit=${limit || 20}`, { credentials: "include" }).then(res => res.json()),
  markNotificationAsRead: (notificationId: number) => 
    apiRequest("POST", `/api/notifications/${notificationId}/read`, {}),

  // Follows
  followLoveTree: (loveTreeId: number) => 
    apiRequest("POST", `/api/love-trees/${loveTreeId}/follow`, {}),
  unfollowLoveTree: (loveTreeId: number) => 
    apiRequest("DELETE", `/api/love-trees/${loveTreeId}/follow`, {}),
};
