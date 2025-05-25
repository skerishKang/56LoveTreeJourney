import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import LoveTreeProgress from "@/components/love-tree-progress";
import NewSeedAlert from "@/components/new-seed-alert";
import RecommendedShorts from "@/components/recommended-shorts";
import LoveTreeTimeline from "@/components/love-tree-timeline";
import LoveTreeMindmap from "@/components/love-tree-mindmap";
import EnhancedLoveTree from "@/components/enhanced-love-tree";
import InteractiveMindmap from "@/components/interactive-mindmap";
import PopularTrees from "@/components/popular-trees";
import { Heart, Bell, Map, List, Share2, Search, TrendingUp, GripVertical, Star, Users, Gamepad2, Gift, Smartphone, ChevronRight, Crown, Play, Sparkles, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import ShareLoveTree from "@/components/share-love-tree";
import PropagatorStats from "@/components/propagator-stats";
import PropagatorDashboard from "@/components/propagator-dashboard";
import YouTubeExtensionGuide from "@/components/youtube-extension-guide";
import TagFilter from "@/components/tag-filter";
import BottomNavigation from "@/components/bottom-navigation";
import MindmapLoveTree from "@/components/mindmap-love-tree";
import CategoryRequestModal from "@/components/category-request-modal";
import SettingsMenu from "@/components/settings-menu";
import SubscriptionModal from "@/components/subscription-modal";
import ContinueLoveTreeModal from "@/components/continue-love-tree-modal";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<"timeline" | "mindmap">("mindmap");
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showProgressInfo, setShowProgressInfo] = useState(false);
  const [showAllCrushes, setShowAllCrushes] = useState(false);
  const [showAllShorts, setShowAllShorts] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [showCategoryRequest, setShowCategoryRequest] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showContinueTree, setShowContinueTree] = useState(false);
  const [selectedLoveTree, setSelectedLoveTree] = useState<any>(null);
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
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full"
                onClick={() => setShowSettings(true)}
              >
                <Crown className="w-5 h-5" />
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
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">진행률</span>
                      <button 
                        onClick={() => setShowProgressInfo(!showProgressInfo)}
                        className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center text-xs text-white transition-colors"
                      >
                        ?
                      </button>
                    </div>
                    <span className="text-sm font-medium text-gray-700">15/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                  
                  {/* 진행률 설명 */}
                  {showProgressInfo && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                      <h5 className="font-medium text-blue-800 mb-2">📊 진행률 계산 방식</h5>
                      <div className="text-blue-700 space-y-1">
                        <p>• 영상 추가: +5점</p>
                        <p>• 하트 누르기: +2점</p>
                        <p>• 러브트리 생성: +10점</p>
                        <p>• 댓글 작성: +3점</p>
                        <p>• 시청 시간 10분당: +1점</p>
                        <p className="pt-1 border-t border-blue-300">💝 100점 달성 시 완전한 덕후!</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 현재 빠져있는 것 */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">현재 빠져있는 것</h4>
                    <button 
                      onClick={() => setShowAllCrushes(!showAllCrushes)}
                      className="text-xs text-yellow-700 hover:text-yellow-900 underline"
                    >
                      더보기
                    </button>
                  </div>
                  
                  {!showAllCrushes ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-pink-500" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">이준영</p>
                        <p className="text-sm text-gray-600">사랑함</p>
                        <p className="text-xs text-gray-500">2024.01.15 입덕</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* 현재 빠진 인물들 목록 */}
                      <div className="flex items-center space-x-3 p-2 bg-white rounded-lg">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                          <Heart className="w-4 h-4 text-pink-500" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">이준영</p>
                          <p className="text-xs text-gray-600">2024.01.15 입덕 · 진행률 85%</p>
                        </div>
                        <div className="ml-auto">
                          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-2 bg-white rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Heart className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">정국</p>
                          <p className="text-xs text-gray-600">2024.01.10 입덕 · 진행률 65%</p>
                        </div>
                        <div className="ml-auto">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-2 bg-white rounded-lg">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Heart className="w-4 h-4 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">금성제</p>
                          <p className="text-xs text-gray-600">2024.01.05 입덕 · 진행률 45%</p>
                        </div>
                        <div className="ml-auto">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 추천 쇼츠 */}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-gray-800 flex items-center space-x-2">
                    <span>추천 쇼츠</span>
                    <span className="text-lg">🔥</span>
                  </h4>
                  <button 
                    onClick={() => setShowAllShorts(!showAllShorts)}
                    className="text-xs text-gray-600 hover:text-gray-800 underline"
                  >
                    더보기
                  </button>
                </div>
                
                {/* 추천 알고리즘 설명 */}
                <div className="mb-3 p-2 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-xs text-purple-700">
                    💡 <strong>이준영</strong> 관련 영상과 <strong>K-pop 보컬</strong> 취향을 바탕으로 추천
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {/* 쇼츠 1 - 정국 */}
                  <div className="relative group cursor-pointer">
                    <div className="aspect-[9/16] bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg overflow-hidden">
                      {/* 실제 영상 썸네일 느낌 */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                      {/* 정국 이미지 느낌 */}
                      <div className="absolute top-4 left-4 right-4 text-center">
                        <div className="text-4xl mb-2">🎤</div>
                        <div className="text-white font-bold text-sm">정국</div>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="flex items-center space-x-1 text-white mb-1">
                          <Heart className="w-3 h-3 fill-current" />
                          <span className="text-xs font-medium">1.2k</span>
                        </div>
                        <p className="text-xs text-white/90 font-medium">정국 보컬 모음</p>
                        <p className="text-xs text-white/70">@jungkook_vocal</p>
                      </div>
                    </div>
                  </div>

                  {/* 쇼츠 2 - 약한영웅 금성제 */}
                  <div className="relative group cursor-pointer">
                    <div className="aspect-[9/16] bg-gradient-to-br from-orange-500 to-red-600 rounded-lg overflow-hidden">
                      {/* 실제 영상 썸네일 느낌 */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                      {/* 약한영웅 금성제 이미지 느낌 */}
                      <div className="absolute top-4 left-4 right-4 text-center">
                        <div className="text-4xl mb-2">🥊</div>
                        <div className="text-white font-bold text-sm">금성제</div>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="flex items-center space-x-1 text-white mb-1">
                          <Heart className="w-3 h-3 fill-current" />
                          <span className="text-xs font-medium">856</span>
                        </div>
                        <p className="text-xs text-white/90 font-medium">약한영웅 금성제</p>
                        <p className="text-xs text-white/70">@weak_hero_fan</p>
                      </div>
                    </div>
                  </div>

                  {/* 쇼츠 3 - 필릭스 */}
                  <div className="relative group cursor-pointer">
                    <div className="aspect-[9/16] bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg overflow-hidden">
                      {/* 실제 영상 썸네일 느낌 */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                      {/* 필릭스 이미지 느낌 */}
                      <div className="absolute top-4 left-4 right-4 text-center">
                        <div className="text-4xl mb-2">✨</div>
                        <div className="text-white font-bold text-sm">필릭스</div>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="flex items-center space-x-1 text-white mb-1">
                          <Heart className="w-3 h-3 fill-current" />
                          <span className="text-xs font-medium">2.1k</span>
                        </div>
                        <p className="text-xs text-white/90 font-medium">필릭스 댄스 모음</p>
                        <p className="text-xs text-white/70">@felix_dance</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 더보기 쇼츠 */}
                {showAllShorts && (
                  <div className="mb-4">
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {/* 추가 쇼츠 4 - 민호 */}
                      <div className="relative group cursor-pointer">
                        <div className="aspect-[9/16] bg-gradient-to-br from-green-500 to-teal-600 rounded-lg overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                              <Play className="w-6 h-6 text-white ml-1" />
                            </div>
                          </div>
                          <div className="absolute top-4 left-4 right-4 text-center">
                            <div className="text-4xl mb-2">🎭</div>
                            <div className="text-white font-bold text-sm">민호</div>
                          </div>
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="flex items-center space-x-1 text-white mb-1">
                              <Heart className="w-3 h-3 fill-current" />
                              <span className="text-xs font-medium">1.8k</span>
                            </div>
                            <p className="text-xs text-white/90 font-medium">민호 연기 모음</p>
                            <p className="text-xs text-white/70">@minho_acting</p>
                          </div>
                        </div>
                      </div>

                      {/* 추가 쇼츠 5 - 수빈 */}
                      <div className="relative group cursor-pointer">
                        <div className="aspect-[9/16] bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                              <Play className="w-6 h-6 text-white ml-1" />
                            </div>
                          </div>
                          <div className="absolute top-4 left-4 right-4 text-center">
                            <div className="text-4xl mb-2">🌟</div>
                            <div className="text-white font-bold text-sm">수빈</div>
                          </div>
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="flex items-center space-x-1 text-white mb-1">
                              <Heart className="w-3 h-3 fill-current" />
                              <span className="text-xs font-medium">3.2k</span>
                            </div>
                            <p className="text-xs text-white/90 font-medium">수빈 비주얼 모음</p>
                            <p className="text-xs text-white/70">@soobin_visual</p>
                          </div>
                        </div>
                      </div>

                      {/* 추가 쇼츠 6 - 연준 */}
                      <div className="relative group cursor-pointer">
                        <div className="aspect-[9/16] bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                              <Play className="w-6 h-6 text-white ml-1" />
                            </div>
                          </div>
                          <div className="absolute top-4 left-4 right-4 text-center">
                            <div className="text-4xl mb-2">🎵</div>
                            <div className="text-white font-bold text-sm">연준</div>
                          </div>
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="flex items-center space-x-1 text-white mb-1">
                              <Heart className="w-3 h-3 fill-current" />
                              <span className="text-xs font-medium">2.7k</span>
                            </div>
                            <p className="text-xs text-white/90 font-medium">연준 랩 모음</p>
                            <p className="text-xs text-white/70">@yeonjun_rap</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center">💡 총 50개 쇼츠 보관 중 · 알고리즘이 계속 업데이트됩니다</p>
                  </div>
                )}

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
                      <Sparkles className="w-4 h-4 mr-1" />
                      러브트리
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
                
                <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'h-96'} border border-gray-200 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 relative transition-all duration-300`}>
                  {/* 전체화면 버튼 */}
                  <button 
                    onClick={() => setLocation(`/love-tree/${currentLoveTree?.id || 1}`)}
                    className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-lg transition-all"
                  >
                    🖥️ 전체화면
                  </button>
                  
                  {viewMode === "mindmap" ? (
                    <div className={`relative w-full h-full ${isFullscreen ? 'p-8' : 'p-4'} transition-all duration-300`}>
                      {/* 실제 러브트리 마인드맵 시뮬레이션 */}
                      <svg className="absolute inset-0 w-full h-full">
                        {/* 연결선들 */}
                        <path 
                          d="M 50 100 Q 150 50 250 80" 
                          stroke="#10B981" 
                          strokeWidth="3" 
                          fill="none" 
                          strokeDasharray="5,5"
                        />
                        <path 
                          d="M 250 80 Q 350 120 450 90" 
                          stroke="#F59E0B" 
                          strokeWidth="3" 
                          fill="none" 
                          strokeDasharray="5,5"
                        />
                        <path 
                          d="M 450 90 Q 500 180 480 250" 
                          stroke="#EF4444" 
                          strokeWidth="3" 
                          fill="none" 
                          strokeDasharray="5,5"
                        />
                      </svg>

                      {/* 영상 노드들 - 틱톡/인스타 스타일 */}
                      {/* 시작점 */}
                      <div className="absolute" style={{ left: '30px', top: '80px' }}>
                        <div className="w-16 h-12 bg-gray-100 rounded border shadow-sm flex items-center justify-center text-xs font-medium">
                          시작
                        </div>
                      </div>

                      {/* 첫 번째 영상 - 금성제 */}
                      <div className="absolute" style={{ left: '180px', top: '30px' }}>
                        <div className="w-40 bg-white rounded-lg border-2 border-orange-300 shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                          {/* 영상 부분 */}
                          <div className="w-full h-24 bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center relative">
                            <Play className="w-8 h-8 text-white drop-shadow-lg" />
                            <div className="absolute bottom-1 left-1 text-xs text-white font-bold drop-shadow">금성제 ❤️‍🔥</div>
                            <div className="absolute top-1 right-1 text-xs text-white bg-black/20 px-1 rounded">0524</div>
                          </div>
                          {/* 감상 부분 */}
                          <div className="p-3 bg-white max-h-32 overflow-y-auto">
                            <p className="text-xs text-gray-700 leading-relaxed">
                              "저번주 금요일에 3일 빠졌다가 어제 다시 금성제❤️‍🔥 발성 목소리 발음 욕의 찰짐 넘 좋아 진짜🩷 내 스타일이 전혀 아니었는데 오히려 놀랐어... 한 번 보고 뿅감! 진짜 한눈에 반함✨"
                            </p>
                            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                              <div className="flex items-center">
                                <Heart className="w-3 h-3 mr-1 text-red-400" />
                                <span>2.8k</span>
                              </div>
                              <span className="text-blue-500 cursor-pointer">더보기...</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 두 번째 영상 - 수영장 씬 */}
                      <div className="absolute" style={{ left: '400px', top: '80px' }}>
                        <div className="w-40 bg-white rounded-lg border-2 border-blue-300 shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                          {/* 영상 부분 */}
                          <div className="w-full h-24 bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center relative">
                            <Play className="w-8 h-8 text-white drop-shadow-lg" />
                            <div className="absolute bottom-1 left-1 text-xs text-white font-bold drop-shadow">크루즈 수영장 💙</div>
                            <div className="absolute top-1 right-1 text-xs text-white bg-black/20 px-1 rounded">0204</div>
                          </div>
                          {/* 감상 부분 */}
                          <div className="p-3 bg-white max-h-32 overflow-y-auto">
                            <p className="text-xs text-gray-700 leading-relaxed">
                              "크루즈와 파트리끄 수영장씬 진짜 이뻐💎 그전에 경매 붙이는거 꺄악 나도 할래! 천만원 걸게 파트리끄한테 넘 좋아~ 재미져 봐도 봐도 잼나🏊‍♂️"
                            </p>
                            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                              <div className="flex items-center">
                                <Heart className="w-3 h-3 mr-1 text-red-400" />
                                <span>3.2k</span>
                              </div>
                              <span className="text-blue-500 cursor-pointer">더보기...</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 세 번째 영상 - 마누 미소 */}
                      <div className="absolute" style={{ left: '320px', top: '200px' }}>
                        <div className="w-40 bg-white rounded-lg border-2 border-pink-300 shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                          {/* 영상 부분 */}
                          <div className="w-full h-24 bg-gradient-to-r from-pink-400 to-rose-500 flex items-center justify-center relative">
                            <Play className="w-8 h-8 text-white drop-shadow-lg" />
                            <div className="absolute bottom-1 left-1 text-xs text-white font-bold drop-shadow">마누 미소 😊</div>
                            <div className="absolute top-1 right-1 text-xs text-white bg-black/20 px-1 rounded">재시청</div>
                          </div>
                          {/* 감상 부분 */}
                          <div className="p-3 bg-white max-h-32 overflow-y-auto">
                            <p className="text-xs text-gray-700 leading-relaxed">
                              "마누 보고파다💕 미소 넘 이쁘고 목소리 캬 넘 좋다 말투도 좋고 피부 흰피부에 이렇게 꽂힐줄이야~ 넘 매끄럽고 수염으로 가리지마 이쁜 얼굴 드러내야지✨"
                            </p>
                            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                              <div className="flex items-center">
                                <Heart className="w-3 h-3 mr-1 text-red-400" />
                                <span>4.1k</span>
                              </div>
                              <span className="text-blue-500 cursor-pointer">더보기...</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 우측 상단 도구 */}
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                          ➕ 영상 추가
                        </button>
                      </div>

                      {/* 인터랙션 안내 */}
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                        <p className="text-xs text-gray-700 font-medium">💡 러브트리 만들기</p>
                        <p className="text-xs text-gray-500 mt-1">영상 + 바로 아래 감상 작성</p>
                      </div>
                    </div>
                  ) : (
                    <LoveTreeTimeline loveTreeId={currentLoveTree.id} />
                  )}
                </div>
                
                {/* 러브트리 예시 - 스트레이키즈 입덕기 */}
                <div className="mt-6 p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl border border-pink-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-800 flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-pink-500" />
                      <span>러브트리 예시 - 스트레이키즈 입덕기</span>
                    </h4>
                  </div>
                  
                  {/* 깔끔한 다이아몬드 러브트리 */}
                  <div className="relative bg-white rounded-lg p-6 min-h-[200px] border border-gray-100">
                    {/* 연결선들 */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <path d="M 50% 50% L 50% 25%" stroke="#e0e0e0" strokeWidth="2" strokeDasharray="5,5" fill="none" />
                      <path d="M 50% 50% L 75% 50%" stroke="#e0e0e0" strokeWidth="2" strokeDasharray="5,5" fill="none" />
                      <path d="M 50% 50% L 50% 75%" stroke="#e0e0e0" strokeWidth="2" strokeDasharray="5,5" fill="none" />
                      <path d="M 50% 50% L 25% 50%" stroke="#e0e0e0" strokeWidth="2" strokeDasharray="5,5" fill="none" />
                    </svg>

                    {/* 중앙 노드 */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        시작
                      </div>
                    </div>
                    
                    {/* 상단 노드 - 귀여운 순간 */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        😊
                      </div>
                      <div className="text-xs text-center mt-1 text-gray-600 font-medium">귀여움</div>
                    </div>
                    
                    {/* 우측 노드 - 섹시한 순간 */}
                    <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
                      <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        💕
                      </div>
                      <div className="text-xs text-center mt-1 text-gray-600 font-medium">섹시함</div>
                    </div>
                    
                    {/* 하단 노드 - 댄스 */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        💃
                      </div>
                      <div className="text-xs text-center mt-1 text-gray-600 font-medium">댄스</div>
                    </div>
                    
                    {/* 좌측 노드 - 보컬 */}
                    <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
                      <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        🎵
                      </div>
                      <div className="text-xs text-center mt-1 text-gray-600 font-medium">보컬</div>
                    </div>
                  </div>
                  
                  {/* 간단한 안내 */}
                  <div className="mt-3 text-center">
                    <p className="text-xs text-gray-500">🌟 러브트리를 직접 만들어보세요!</p>
                  </div>
                  

                </div>

                {/* 두 가지 시스템 명확히 구분 */}
                <div className="mt-6 space-y-6">
                  {/* 시스템 차이 설명 */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-2">!</div>
                      두 가지 다른 시스템이에요!
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-white rounded-lg p-3 border border-orange-200">
                        <div className="font-medium text-orange-700 mb-2">🎯 자빠돌이/꼬돌이 시스템</div>
                        <div className="text-gray-600 space-y-1">
                          <p>• 다른 사람을 입덕시킨 <strong>영향력</strong> 측정</p>
                          <p>• 내 러브트리를 공유해서 사람들이 따라하면 점수 상승</p>
                          <p>• <strong>순위 경쟁</strong>이 핵심!</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <div className="font-medium text-green-700 mb-2">🌳 러브트리 가드너 시스템</div>
                        <div className="text-gray-600 space-y-1">
                          <p>• 내가 직접 하는 <strong>활동</strong>으로 포인트 획득</p>
                          <p>• 영상 추가, 하트, 댓글 등 개인 행동</p>
                          <p>• <strong>개인 성장</strong>이 핵심!</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 자빠돌이/꼬돌이 시스템 */}
                  <PropagatorDashboard />
                  
                  {/* 러브트리 가드너 시스템 */}
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      <CardTitle className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          🌱
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">🌳 러브트리 가드너 시스템</h3>
                          <p className="text-sm opacity-90">내 활동으로 직접 쌓는 가드너 포인트와 레벨</p>
                        </div>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-6 space-y-6">
                      {/* 현재 레벨 */}
                      <div className="text-center">
                        <Badge className="bg-gradient-to-r from-green-400 to-green-600 text-white text-lg px-4 py-2">
                          🌱 새싹 가드너
                        </Badge>
                        <p className="text-sm text-gray-600 mt-2">현재 레벨</p>
                      </div>

                      {/* 가드너 활동 통계 */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                          <div className="flex items-center justify-center mb-2">
                            <TrendingUp className="w-5 h-5 text-green-500 mr-1" />
                            <span className="text-2xl font-bold text-gray-800">1,247</span>
                          </div>
                          <p className="text-sm text-gray-600">가드너 포인트</p>
                        </div>

                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                          <div className="flex items-center justify-center mb-2">
                            <Clock className="w-5 h-5 text-blue-500 mr-1" />
                            <span className="text-2xl font-bold text-gray-800">3.2시간</span>
                          </div>
                          <p className="text-sm text-gray-600">총 시청시간</p>
                        </div>

                        <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
                          <div className="flex items-center justify-center mb-2">
                            <Heart className="w-5 h-5 text-pink-500 mr-1" />
                            <span className="text-2xl font-bold text-gray-800">42</span>
                          </div>
                          <p className="text-sm text-gray-600">하트 누른 횟수</p>
                        </div>

                        <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                          <div className="flex items-center justify-center mb-2">
                            <Plus className="w-5 h-5 text-orange-500 mr-1" />
                            <span className="text-2xl font-bold text-gray-800">12</span>
                          </div>
                          <p className="text-sm text-gray-600">영상 추가 횟수</p>
                        </div>
                      </div>

                      {/* 포인트 획득 방법 */}
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <h4 className="font-medium text-green-800 mb-3">💎 포인트 획득 방법</h4>
                        <div className="space-y-2 text-sm text-green-700">
                          <div className="flex items-center justify-between">
                            <span>• 영상 추가</span>
                            <span className="font-medium">+10 포인트</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>• 하트 누르기</span>
                            <span className="font-medium">+2 포인트</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>• 댓글 작성</span>
                            <span className="font-medium">+5 포인트</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>• 러브트리 완성</span>
                            <span className="font-medium">+50 포인트</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>• 10분 이상 시청</span>
                            <span className="font-medium">+3 포인트</span>
                          </div>
                        </div>
                      </div>

                      {/* 시청시간 설명 */}
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          총 시청시간이란?
                        </h4>
                        <div className="text-sm text-blue-700 space-y-1">
                          <p><strong>러브트리에 추가한 모든 영상들의 재생시간 합계</strong>입니다.</p>
                          <p>• 예: 3분 영상 10개 추가 = 총 30분 시청시간</p>
                          <p>• 실제로 영상을 다 본 시간이 아니라, 추가한 영상들의 <strong>원본 길이</strong></p>
                          <p>• 시청시간이 길수록 그 인물에 더 깊이 빠졌다는 의미! 💕</p>
                        </div>
                      </div>

                      {/* 다음 레벨까지 */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">정원사까지</span>
                          <span className="text-sm text-gray-500">753 포인트 더 필요</span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: "62%" }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
                    <Card 
                      className="bg-gradient-to-r from-love-light to-soft-pink border-dashed border-2 border-love-pink/30 hover:border-love-pink/50 transition-colors cursor-pointer"
                      onClick={() => setShowCategoryRequest(true)}
                    >
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



          // YouTube 확장 프로그램 안내 섹션
          if (sectionId === "recommendations") {
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
                    <span className="text-2xl">📺</span>
                    <span>YouTube 확장앱 연동</span>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">NEW</Badge>
                  </h3>
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                </div>
                <YouTubeExtensionGuide />
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