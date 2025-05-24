import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import LoveTreeProgress from "@/components/love-tree-progress";
import NewSeedAlert from "@/components/new-seed-alert";
import RecommendedShorts from "@/components/recommended-shorts";
import LoveTreeTimeline from "@/components/love-tree-timeline";
import LoveTreeMindmap from "@/components/love-tree-mindmap";
import PopularTrees from "@/components/popular-trees";
import { Heart, Bell, Map, List, Share2, Search, TrendingUp, GripVertical, Star, Users, Gamepad2, Gift, Smartphone, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import ShareLoveTree from "@/components/share-love-tree";
import PropagatorStats from "@/components/propagator-stats";
import YouTubeExtensionGuide from "@/components/youtube-extension-guide";
import TagFilter from "@/components/tag-filter";
import BottomNavigation from "@/components/bottom-navigation";
import MindmapLoveTree from "@/components/mindmap-love-tree";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"timeline" | "mindmap">("mindmap");
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [sectionOrder, setSectionOrder] = useState([
    "myLoveTree",
    "popularCategories", 
    "popularTrees",
    "propagatorStats",
    "recommendations"
  ]);

  // 드래그 핸들러
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    
    if (dragIndex !== dropIndex) {
      const newOrder = [...sectionOrder];
      const [draggedItem] = newOrder.splice(dragIndex, 1);
      newOrder.splice(dropIndex, 0, draggedItem);
      setSectionOrder(newOrder);
      
      // 로컬 스토리지에 저장
      localStorage.setItem("homeSectionOrder", JSON.stringify(newOrder));
    }
  };

  // 컴포넌트 마운트 시 로컬 스토리지에서 순서 불러오기
  useEffect(() => {
    const savedOrder = localStorage.getItem("homeSectionOrder");
    if (savedOrder) {
      setSectionOrder(JSON.parse(savedOrder));
    }
  }, []);
  
  const { data: loveTrees, isLoading: loveTreesLoading } = useQuery({
    queryKey: ["/api/love-trees"],
    queryFn: api.getLoveTrees,
  });

  const { data: loveTreeItems } = useQuery({
    queryKey: ["/api/love-trees", loveTrees?.[0]?.id, "items"],
    queryFn: () => api.getLoveTreeItems(loveTrees?.[0]?.id!),
    enabled: !!loveTrees?.[0]?.id,
  });

  const currentLoveTree = loveTrees?.[0];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-love-light via-white to-love-light flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="text-6xl">🌸</div>
          <h1 className="text-2xl font-bold text-gray-800">러브트리에 오신 것을 환영합니다</h1>
          <p className="text-gray-600">사랑에 빠지는 순간을 기록하고 공유해보세요</p>
          <Button onClick={() => window.location.href = '/api/login'} className="bg-gradient-to-r from-love-pink to-love-dark text-white">
            시작하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-love-light via-white to-love-light">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-love-pink/20">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-love-pink to-love-dark rounded-full flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-r from-love-pink to-love-dark rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.firstName?.[0] || user?.email?.[0] || "?"}
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">안녕하세요! 🌸</h1>
                <p className="text-sm text-gray-600">오늘은 어떤 사랑에 빠져볼까요?</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="rounded-full">
                <Bell className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="러브트리 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-0 rounded-full"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-20">
        {/* 드래그 가능한 섹션들 */}
        {sectionOrder.map((sectionId, index) => {
          // 나의 러브트리 섹션
          if (sectionId === "myLoveTree" && currentLoveTree) {
            return (
              <div 
                key={`${sectionId}-${index}`}
                className="px-4 py-4 bg-white border border-gray-100 rounded-lg mx-4 my-2"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <span className="text-2xl">🌳</span>
                    <span>나의 러브트리</span>
                  </h3>
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
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
                
                <div>
                  {viewMode === "mindmap" ? (
                    <MindmapLoveTree items={loveTreeItems} />
                  ) : (
                    <LoveTreeTimeline loveTreeId={currentLoveTree.id} />
                  )}
                </div>
              </div>
            );
          }

          // 인기 카테고리 섹션
          if (sectionId === "popularCategories") {
            return (
              <div 
                key={`${sectionId}-${index}`}
                className="px-4 py-4 bg-white border border-gray-100 rounded-lg mx-4 my-2"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-love-pink" />
                    <span>인기 카테고리</span>
                  </h3>
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                </div>
                
                <div className="space-y-4">
                  {/* 기본 카테고리 */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "K-pop", icon: "🎤", count: "1.2K", color: "from-pink-400 to-purple-500", type: "산업" },
                      { name: "드라마", icon: "📺", count: "890", color: "from-blue-400 to-cyan-500", type: "작품" },
                      { name: "아이돌", icon: "✨", count: "2.1K", color: "from-purple-400 to-pink-500", type: "인물" },
                      { name: "애니메이션", icon: "🎨", count: "645", color: "from-orange-400 to-red-500", type: "작품" }
                    ].map((category) => (
                      <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-3">
                          <div className={`w-8 h-8 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mb-2`}>
                            <span className="text-lg">{category.icon}</span>
                          </div>
                          <h4 className="font-semibold text-gray-800">{category.name}</h4>
                          <p className="text-xs text-gray-500 mb-1">{category.type}</p>
                          <p className="text-sm text-gray-600">{category.count}개 러브트리</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* 확장 카테고리 */}
                  {showAllCategories && (
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: "배우", icon: "🎭", count: "567", color: "from-emerald-400 to-teal-500", type: "인물" },
                        { name: "영화", icon: "🎬", count: "789", color: "from-indigo-400 to-blue-500", type: "작품" },
                        { name: "유튜버", icon: "📹", count: "432", color: "from-green-400 to-emerald-500", type: "인물" },
                        { name: "음악", icon: "🎵", count: "1.5K", color: "from-rose-400 to-pink-500", type: "산업" },
                        { name: "게임", icon: "🎮", count: "234", color: "from-cyan-400 to-blue-500", type: "산업" },
                        { name: "웹툰", icon: "📖", count: "345", color: "from-yellow-400 to-orange-500", type: "작품" },
                        { name: "스포츠", icon: "⚽", count: "178", color: "from-lime-400 to-green-500", type: "산업" },
                        { name: "요리", icon: "👨‍🍳", count: "123", color: "from-amber-400 to-yellow-500", type: "산업" }
                      ].map((category) => (
                        <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-3">
                            <div className={`w-8 h-8 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mb-2`}>
                              <span className="text-lg">{category.icon}</span>
                            </div>
                            <h4 className="font-semibold text-gray-800">{category.name}</h4>
                            <p className="text-xs text-gray-500 mb-1">{category.type}</p>
                            <p className="text-sm text-gray-600">{category.count}개 러브트리</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* 더보기/접기 버튼 */}
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllCategories(!showAllCategories)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      {showAllCategories ? "접기" : "더보기"}
                      <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showAllCategories ? "rotate-90" : ""}`} />
                    </Button>
                  </div>

                  {/* 카테고리 요청하기 */}
                  <div className="text-center">
                    <Card className="bg-gradient-to-r from-love-light to-soft-pink border-dashed border-2 border-love-pink/30 hover:border-love-pink/50 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="text-2xl mb-2">💡</div>
                        <h4 className="font-semibold text-gray-800 mb-1">새 카테고리 요청</h4>
                        <p className="text-sm text-gray-600">원하는 분야가 없나요? 요청해주세요!</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            );
          }

          // 인기 러브트리 섹션
          if (sectionId === "popularTrees") {
            return (
              <div 
                key={`${sectionId}-${index}`}
                className="px-4 py-4 bg-white border border-gray-100 rounded-lg mx-4 my-2"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>인기 러브트리</span>
                  </h3>
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                </div>
                <PopularTrees />
              </div>
            );
          }

          // 팬활동 섹션
          if (sectionId === "fanActivities") {
            return (
              <div 
                key={`${sectionId}-${index}`}
                className="px-4 py-4 bg-white border border-gray-100 rounded-lg mx-4 my-2"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span>팬활동</span>
                  </h3>
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/community-tracker">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-3 text-center">
                        <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                        <p className="text-sm font-medium">커뮤니티 활동</p>
                        <p className="text-xs text-gray-500">SNS 팬 커뮤니티</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/goods-collection">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-3 text-center">
                        <Gift className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                        <p className="text-sm font-medium">굿즈 컬렉션</p>
                        <p className="text-xs text-gray-500">소중한 굿즈 관리</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/fan-activities">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-3 text-center">
                        <Gamepad2 className="w-6 h-6 mx-auto mb-2 text-green-500" />
                        <p className="text-sm font-medium">팬 활동 일지</p>
                        <p className="text-xs text-gray-500">콘서트 & 이벤트</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/subscription-manager">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-3 text-center">
                        <Smartphone className="w-6 h-6 mx-auto mb-2 text-cyan-500" />
                        <p className="text-sm font-medium">구독 서비스</p>
                        <p className="text-xs text-gray-500">버블, 위버스 등</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
            );
          }

          // 러브트리 가드너 스테이터스 섹션
          if (sectionId === "propagatorStats" && user) {
            return (
              <div 
                key={`${sectionId}-${index}`}
                className="px-4 py-4 bg-white border border-gray-100 rounded-lg mx-4 my-2"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    🌳 <span>러브트리 가드너</span>
                  </h3>
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                </div>
                <PropagatorStats user={user} />
              </div>
            );
          }

          // 추천 섹션
          if (sectionId === "recommendations") {
            return (
              <div 
                key={`${sectionId}-${index}`}
                className="px-4 py-4 bg-white border border-gray-100 rounded-lg mx-4 my-2"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">추천 숏츠</h3>
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                </div>
                <RecommendedShorts />
                <div className="mt-4">
                  <YouTubeExtensionGuide />
                </div>
              </div>
            );
          }

          return null;
        })}

        {/* New Seed Alert - 고정 위치 */}
        <div className="px-4 py-2">
          <NewSeedAlert />
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}