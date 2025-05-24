import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import BottomNavigation from "@/components/bottom-navigation";
import LoveTreeProgress from "@/components/love-tree-progress";
import NewSeedAlert from "@/components/new-seed-alert";
import RecommendedShorts from "@/components/recommended-shorts";
import LoveTreeTimeline from "@/components/love-tree-timeline";
import LoveTreeMindmap from "@/components/love-tree-mindmap";
import PopularTrees from "@/components/popular-trees";
import { Heart, Bell, Map, List, Share2, Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import ShareLoveTree from "@/components/share-love-tree";
import PropagatorStats from "@/components/propagator-stats";
import YouTubeExtensionGuide from "@/components/youtube-extension-guide";
import TagFilter from "@/components/tag-filter";
import SampleLoveTree from "@/components/sample-love-tree";
import HorizontalLoveTree from "@/components/horizontal-love-tree";
import MindmapLoveTree from "@/components/mindmap-love-tree";

export default function Home() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"timeline" | "mindmap">("mindmap");
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectionOrder, setSectionOrder] = useState([
    "myLoveTree",
    "popularCategories", 
    "popularTrees",
    "propagatorStats",
    "recommendations"
  ]);
  
  const { data: loveTrees, isLoading: loveTreesLoading } = useQuery({
    queryKey: ["/api/love-trees"],
    queryFn: api.getLoveTrees,
  });

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
    queryFn: () => api.getNotifications(5),
  });

  const { data: popularTrees } = useQuery({
    queryKey: ["/api/love-trees/popular"],
    queryFn: () => api.getPopularLoveTrees(20),
  });

  const currentLoveTree = loveTrees?.[0]; // Most recent love tree

  // 현재 러브트리의 아이템들 가져오기
  const { data: loveTreeItems } = useQuery({
    queryKey: ["/api/love-trees", currentLoveTree?.id, "items"],
    queryFn: () => currentLoveTree ? api.getLoveTreeItems(currentLoveTree.id) : Promise.resolve([]),
    enabled: !!currentLoveTree,
  });

  return (
    <div className="min-h-screen bg-soft-pink">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-love-pink/20 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-love-pink to-tree-green rounded-full flex items-center justify-center animate-float">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-800">러브트리</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications?.some((n: any) => !n.isRead) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-love-pink rounded-full animate-sparkle"></span>
                )}
              </Button>
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border-2 border-tree-green object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-tree-green"></div>
              )}
            </div>
          </div>
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="러브트리 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full border-gray-200 bg-gray-50"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-20">
        {/* 1. 나의 러브트리 (최우선) */}
        {currentLoveTree && (
          <section className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <span className="text-2xl">🌳</span>
                <span>나의 러브트리</span>
              </h3>
              <div className="flex items-center space-x-2">
                <TagFilter 
                  onTagSelect={setSelectedTag} 
                  selectedTag={selectedTag} 
                />
                <ShareLoveTree loveTree={currentLoveTree} />
                <div className="bg-white rounded-full p-1 flex">
                  <Button
                    size="sm"
                    variant={viewMode === "mindmap" ? "default" : "ghost"}
                    onClick={() => setViewMode("mindmap")}
                    className={`rounded-full px-3 py-1 text-xs ${
                      viewMode === "mindmap" 
                        ? "bg-gradient-to-r from-love-pink to-love-dark text-white shadow-lg" 
                        : "text-gray-600"
                    }`}
                  >
                    <Map className="w-4 h-4 mr-1" />
                    마인드맵
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === "timeline" ? "default" : "ghost"}
                    onClick={() => setViewMode("timeline")}
                    className={`rounded-full px-3 py-1 text-xs ${
                      viewMode === "timeline" 
                        ? "bg-gradient-to-r from-love-pink to-love-dark text-white shadow-lg" 
                        : "text-gray-600"
                    }`}
                  >
                    <List className="w-4 h-4 mr-1" />
                    타임라인
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="px-4">
              {viewMode === "mindmap" ? (
                <MindmapLoveTree items={loveTreeItems} />
              ) : (
                <LoveTreeTimeline loveTreeId={currentLoveTree.id} />
              )}
            </div>
          </section>
        )}

        {/* 러브트리 예시 - 콘텐츠가 없을 때만 표시 */}
        {(!currentLoveTree || (currentLoveTree && (!loveTreeItems || loveTreeItems.length === 0))) && (
          <section className="px-4 py-2">
            <SampleLoveTree />
          </section>
        )}

        {/* Popular Categories */}
        {popularTrees && popularTrees.length > 0 && (
          <section className="px-4 py-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-tree-green" />
              인기 카테고리
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { name: "K-pop", icon: "🎵", count: popularTrees.filter((tree: any) => tree.category?.includes('K-pop')).length },
                { name: "드라마", icon: "🎬", count: popularTrees.filter((tree: any) => tree.category?.includes('드라마')).length },
                { name: "애니메이션", icon: "🎨", count: popularTrees.filter((tree: any) => tree.category?.includes('애니')).length },
                { name: "유튜버", icon: "📺", count: popularTrees.filter((tree: any) => tree.category?.includes('유튜버')).length },
              ].filter(category => category.count > 0).map((category) => (
                <Card key={category.name} className="bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.count}개 러브트리</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Popular Trees */}
        <PopularTrees />
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Floating Action Button */}
      <Button className="fixed bottom-24 right-4 w-14 h-14 bg-sparkle-gold hover:bg-sparkle-gold/90 rounded-full shadow-lg z-30 animate-float">
        <Heart className="w-6 h-6 text-white" />
      </Button>
    </div>
  );
}
