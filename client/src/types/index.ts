// User related types
export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  propagatorRank?: string;
  propagatorScore?: number;
  gardenerLevel?: string;
  gardenerPoints?: number;
  successfulRecommendations?: number;
  totalWatchTime?: number;
}

// Love Tree types
export interface LoveTree {
  id: number;
  userId: string;
  title: string;
  category: string;
  targetPerson?: string;
  description?: string;
  isCompleted: boolean;
  isPublic: boolean;
  itemCount: number;
  likeCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  items?: LoveTreeItem[];
  period?: string;
}

export interface LoveTreeItem {
  id: number;
  loveTreeId: number;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  contentUrl?: string;
  platform: string;
  category: string;
  stageId: number;
  stage?: Stage;
  order: number;
  likeCount: number;
  isFirstContent: boolean;
  x?: number;
  y?: number;
  connections?: number[];
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stage {
  id: number;
  name: string;
  description?: string;
  order: number;
  color: string;
  emoji?: string;
}

// Comment types
export interface Comment {
  id: number;
  itemId: number;
  userId: string;
  content: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

// Recommendation types
export interface Recommendation {
  id: number;
  itemId: number;
  userId: string;
  recommendedItemId: number;
  recommendedItem?: LoveTreeItem;
  reason?: string;
  upvotes: number;
  isSelected: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

// Category types
export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  count: number;
  trend: "up" | "down" | "stable";
  description?: string;
}

// Propagator stats
export interface PropagatorStats {
  id: number;
  userId: string;
  totalConversions: number;
  monthlyConversions: number;
  rank: string;
  trustScore: number;
  lastUpdated: string;
  user: User;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// Form types
export interface CreateLoveTreeData {
  title: string;
  category: string;
  targetPerson?: string;
  description?: string;
  isPublic: boolean;
}

export interface CreateLoveTreeItemData {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  contentUrl?: string;
  platform: string;
  category: string;
  stageId: number;
  isFirstContent?: boolean;
}

export interface CreateCommentData {
  content: string;
}

export interface CreateRecommendationData {
  recommendedItemId: number;
  reason?: string;
}

// Filter types
export interface FilterOptions {
  category?: string;
  platform?: string;
  sortBy?: "latest" | "popular" | "trending";
  timeRange?: "day" | "week" | "month" | "all";
}