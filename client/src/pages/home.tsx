import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import LoveTreeProgress from "@/components/love-tree-progress";
import NewSeedAlert from "@/components/new-seed-alert";
import RecommendedShorts from "@/components/recommended-shorts";
import LoveTreeTimeline from "@/components/love-tree-timeline";
import LoveTreeMindmap from "@/components/love-tree-mindmap";
import EnhancedLoveTree from "@/components/enhanced-love-tree";
import PopularTrees from "@/components/popular-trees";
import { Heart, Bell, Map, List, Share2, Search, TrendingUp, GripVertical, Star, Users, Gamepad2, Gift, Smartphone, ChevronRight, Crown, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    "officialLoveTrees",
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
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-pink-600 border-pink-300 bg-pink-50">
                      첫 단계
                    </Badge>
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                  </div>
                </div>
                
                {/* 진행률 바 */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">진행률</span>
                    <span className="text-sm font-medium text-gray-700">0/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>

                {/* 현재 빠져있는 것 */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">현재 빠져있는 것</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">이준영</p>
                      <p className="text-sm text-gray-600">사랑함</p>
                    </div>
                  </div>
                </div>
                
                {/* 추천 쇼츠 */}
                <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center space-x-2">
                  <span>추천 쇼츠</span>
                  <span className="text-lg">🔥</span>
                </h4>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {/* 쇼츠 1 - 전국 캠프송 */}
                  <div className="relative group cursor-pointer">
                    <div className="aspect-[9/16] bg-gradient-to-br from-green-400 to-green-600 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="flex items-center space-x-1 text-white mb-1">
                          <Heart className="w-3 h-3" />
                          <span className="text-xs font-medium">1.2k</span>
                        </div>
                        <p className="text-xs text-white/90 font-medium">전국 캠프송</p>
                        <p className="text-xs text-white/70">@army_forever</p>
                      </div>
                    </div>
                  </div>

                  {/* 쇼츠 2 - 넷플릭스 브랜딩 */}
                  <div className="relative group cursor-pointer">
                    <div className="aspect-[9/16] bg-gradient-to-br from-red-500 to-red-700 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="flex items-center space-x-1 text-white mb-1">
                          <Heart className="w-3 h-3" />
                          <span className="text-xs font-medium">856</span>
                        </div>
                        <p className="text-xs text-white/90 font-medium">넷플릭스 브랜딩2</p>
                        <p className="text-xs text-white/70">@stay_with_skz</p>
                      </div>
                    </div>
                  </div>

                  {/* 쇼츠 3 - 인천 덕스 웰컴 */}
                  <div className="relative group cursor-pointer">
                    <div className="aspect-[9/16] bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="flex items-center space-x-1 text-white mb-1">
                          <Heart className="w-3 h-3" />
                          <span className="text-xs font-medium">2.1k</span>
                        </div>
                        <p className="text-xs text-white/90 font-medium">인천 덕스 웰컴</p>
                        <p className="text-xs text-white/70">@newyears_fan</p>
                      </div>
                    </div>
                  </div>
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
                    <EnhancedLoveTree loveTreeId={currentLoveTree.id} />
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

          // 공식 러브트리 섹션
          if (sectionId === "officialLoveTrees") {
            return (
              <div 
                key={`${sectionId}-${index}`}
                className="px-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg mx-4 my-2"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-purple-600" />
                    <span>공식 러브트리</span>
                    <Badge className="bg-purple-600 text-white">OFFICIAL</Badge>
                  </h3>
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {/* 공식 러브트리 카드들 */}
                  {[
                    {
                      title: "NewJeans 완벽 입덕 루트",
                      artist: "NewJeans",
                      curator: "ADOR 공식",
                      views: "128K",
                      stages: 5,
                      thumbnail: "🐰",
                      isHot: true
                    },
                    {
                      title: "BTS 입문자 가이드",
                      artist: "BTS",
                      curator: "BigHit Music",
                      views: "256K",
                      stages: 7,
                      thumbnail: "💜",
                      isHot: false
                    },
                    {
                      title: "IVE 매력 발견 여행",
                      artist: "IVE",
                      curator: "Starship Ent.",
                      views: "89K",
                      stages: 4,
                      thumbnail: "✨",
                      isHot: true
                    }
                  ].map((tree, idx) => (
                    <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer border-purple-100">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-2xl">
                            {tree.thumbnail}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-gray-800">{tree.title}</h4>
                              {tree.isHot && (
                                <Badge variant="destructive" className="text-xs">HOT</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{tree.artist} • {tree.curator}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Play className="w-3 h-3" />
                                <span>{tree.views} 조회</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Sparkles className="w-3 h-3" />
                                <span>{tree.stages}단계</span>
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                              공식 인증
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <Button variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50">
                    더 많은 공식 러브트리 보기
                  </Button>
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
                    <Crown className="w-5 h-5 text-love-pink" />
                    <span>자뻐둥이 스테이터스</span>
                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">NEW</Badge>
                  </h3>
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                </div>
                
                {/* 스테이터스 카드들 */}
                <div className="space-y-3">
                  {/* 전도사 점수 */}
                  <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-800">전도사 점수</span>
                    </div>
                    <span className="text-xl font-bold text-pink-600">0</span>
                  </div>

                  {/* 성공한 추천 */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-800">성공한 추천</span>
                    </div>
                    <span className="text-xl font-bold text-green-600">0</span>
                  </div>

                  {/* 총 시청 시간 */}
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-800">총 시청 시간</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">64시간</span>
                  </div>
                </div>

                {/* 다음 단계 안내 */}
                <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">💡</span>
                    <span className="font-medium text-gray-800">다음은 사랑을 전파한 사람에게 평점을 올려보세요!</span>
                  </div>
                </div>
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