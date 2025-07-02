import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import { useBreakpoint, useScrollDirection } from "@/hooks/useResponsive";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { queryKeys } from "@/lib/queryClient";
import { Heart, Bell, Search, TrendingUp, Settings, Play, Sparkles, Crown, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, memo, useCallback } from "react";
import BottomNavigation from "@/components/bottom-navigation";
import "../styles/improved.css";

// 최적화된 헤더 컴포넌트
const OptimizedHeader = memo(() => {
  const { isMobile } = useBreakpoint();
  const scrollDirection = useScrollDirection();
  const { user } = useAuth();
  
  const headerHidden = isMobile && scrollDirection === 'down';

  return (
    <header className={`
      sticky top-0 z-50 glass-effect border-b border-white/20 transition-transform duration-300
      ${headerHidden ? '-translate-y-full' : 'translate-y-0'}
    `}>
      <div className={`max-w-md mx-auto ${isMobile ? 'px-4 py-3' : 'px-6 py-4'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">
                  {user?.firstName?.[0] || user?.email?.[0] || "U"}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                안녕하세요! 🌸
              </h1>
              <p className="text-sm text-gray-600">오늘은 어떤 사랑에 빠져볼까요?</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="rounded-full hover:bg-pink-50 relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full hover:bg-pink-50">
              <Settings className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="러브트리 검색..."
            className="pl-10 bg-white/80 border-0 rounded-full shadow-sm focus:ring-2 focus:ring-pink-200 transition-all"
          />
        </div>
      </div>
    </header>
  );
});

// 진행률 컴포넌트
const ProgressSection = memo(() => {
  const [showInfo, setShowInfo] = useState(false);
  
  return (
    <div className="card-soft rounded-xl p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
            <TrendingUp className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-700">나의 덕질 진행률</span>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="w-5 h-5 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500 transition-colors"
          >
            ?
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            15
          </span>
          <span className="text-sm text-gray-500">/100</span>
        </div>
      </div>
      
      <div className="relative">
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div className="progress-bar h-full" style={{ width: '15%' }}></div>
        </div>
        <div className="absolute right-0 top-0 transform translate-x-2 -translate-y-1">
          <div className="w-5 h-5 bg-white border-2 border-pink-400 rounded-full shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {showInfo && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-800 mb-2 flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            덕질 포인트 계산법
          </h5>
          <div className="text-sm text-blue-700 space-y-1">
            <div className="flex justify-between">
              <span>• 영상 추가</span>
              <span className="font-medium">+5점</span>
            </div>
            <div className="flex justify-between">
              <span>• 하트 누르기</span>
              <span className="font-medium">+2점</span>
            </div>
            <div className="flex justify-between">
              <span>• 러브트리 생성</span>
              <span className="font-medium">+10점</span>
            </div>
            <div className="pt-2 mt-2 border-t border-blue-300">
              <span className="text-purple-700 font-medium">💝 100점 달성 시 완전한 덕후!</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// 현재 빠진 것 컴포넌트
const CurrentCrushSection = memo(() => {
  const [showAll, setShowAll] = useState(false);
  
  const crushes = [
    { name: "이준영", status: "사랑함", date: "2024.01.15", progress: 85, emoji: "💕" },
    { name: "정국", status: "좋아함", date: "2024.01.10", progress: 65, emoji: "💙" },
    { name: "금성제", status: "관심있음", date: "2024.01.05", progress: 45, emoji: "💜" }
  ];

  return (
    <div className="card-soft rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700 flex items-center">
          <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mr-2">
            <Heart className="w-3 h-3 text-white" />
          </div>
          현재 빠져있는 것
        </h4>
        <button 
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-pink-600 hover:text-pink-800 font-medium transition-colors"
        >
          {showAll ? '접기' : '더보기'}
        </button>
      </div>
      
      {!showAll ? (
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center border-2 border-white shadow-md">
              <span className="text-lg">{crushes[0].emoji}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-pink-400 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">1</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-800">{crushes[0].name}</p>
            <p className="text-sm text-gray-600">{crushes[0].status}</p>
            <p className="text-xs text-gray-500">{crushes[0].date} 입덕</p>
          </div>
          <div className="text-right">
            <div className="w-12 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-400 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${crushes[0].progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 mt-1">{crushes[0].progress}%</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {crushes.map((crush, index) => (
            <div key={crush.name} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover-lift">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-sm">{crush.emoji}</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{index + 1}</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-sm">{crush.name}</p>
                <p className="text-xs text-gray-600">{crush.date} 입덕 · 진행률 {crush.progress}%</p>
              </div>
              <div className="text-right">
                <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-400 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${crush.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// 쇼츠 그리드 컴포넌트
const ShortsGridSection = memo(() => {
  const [showAll, setShowAll] = useState(false);
  
  const shorts = [
    { id: 1, artist: "정국", title: "정국 보컬 모음", creator: "@jungkook_vocal", likes: "1.2k", gradient: "from-purple-500 to-pink-500", icon: "🎤" },
    { id: 2, artist: "금성제", title: "약한영웅 금성제", creator: "@weak_hero_fan", likes: "856", gradient: "from-orange-500 to-red-500", icon: "🥊" },
    { id: 3, artist: "필릭스", title: "필릭스 댄스 모음", creator: "@felix_dance", likes: "2.1k", gradient: "from-blue-500 to-purple-500", icon: "✨" }
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-bold text-gray-800 flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
            <Play className="w-3 h-3 text-white" />
          </div>
          <span>맞춤 추천 쇼츠</span>
          <Badge className="badge-hot text-xs">HOT</Badge>
        </h4>
        <button 
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-gray-600 hover:text-gray-800 underline transition-colors"
        >
          {showAll ? '접기' : '더보기'}
        </button>
      </div>
      
      <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
        <p className="text-xs text-purple-700 flex items-center">
          <Sparkles className="w-3 h-3 mr-1" />
          <strong>이준영</strong> 취향과 <strong>K-pop 보컬</strong> 선호도를 바탕으로 추천
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {shorts.slice(0, showAll ? shorts.length : 3).map((short) => (
          <div key={short.id} className="relative group cursor-pointer hover-lift">
            <div className={`aspect-[9/16] bg-gradient-to-br ${short.gradient} rounded-xl overflow-hidden shadow-lg`}>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                  <Play className="w-6 h-6 text-white ml-1" />
                </div>
              </div>
              
              <div className="absolute top-3 left-3 right-3 text-center">
                <div className="text-3xl mb-1">{short.icon}</div>
                <div className="text-white font-bold text-sm drop-shadow-lg">{short.artist}</div>
              </div>
              
              <div className="absolute bottom-2 left-2 right-2">
                <div className="flex items-center space-x-1 text-white mb-1">
                  <Heart className="w-3 h-3 fill-current text-red-400" />
                  <span className="text-xs font-medium">{short.likes}</span>
                </div>
                <p className="text-xs text-white/90 font-medium truncate">{short.title}</p>
                <p className="text-xs text-white/70 truncate">{short.creator}</p>
              </div>

              <div className="absolute top-2 right-2">
                <Badge className="badge-new text-xs">NEW</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  // 스크롤 위치 복원
  const { saveScrollPosition } = useScrollRestoration();

  const { data: loveTrees, isLoading: loveTreesLoading } = useQuery({
    queryKey: queryKeys.loveTrees(),
    staleTime: 2 * 60 * 1000,
  });

  const { data: loveTreeItems } = useQuery({
    queryKey: queryKeys.loveTreeItems(loveTrees?.[0]?.id!),
    enabled: !!loveTrees?.[0]?.id,
    staleTime: 5 * 60 * 1000,
  });

  const currentLoveTree = loveTrees?.[0];

  if (!user) {
    return (
      <div className="min-h-screen bg-soft-gradient flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="text-6xl">🌸</div>
          <h1 className="text-2xl font-bold text-gray-800">러브트리에 오신 것을 환영합니다</h1>
          <p className="text-gray-600">사랑에 빠지는 순간을 기록하고 공유해보세요</p>
          <Button onClick={() => window.location.href = '/api/login'} className="btn-gradient-primary">
            시작하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-gradient custom-scrollbar">
      <OptimizedHeader />
      
      <main className="max-w-md mx-auto pb-20">
        <div className="px-4 py-4">
          <div className="card-elevated rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-lg">🌳</span>
                </div>
                <span>나의 러브트리</span>
              </h3>
              <Badge variant="outline" className="bg-pink-50 text-pink-600 border-pink-300">
                첫 단계
              </Badge>
            </div>
            
            <ProgressSection />
            <CurrentCrushSection />
            <ShortsGridSection />
            
            <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl p-6 border border-white/50 shadow-inner">
              <div className="absolute top-4 right-4">
                <Button 
                  size="sm" 
                  className="btn-gradient-primary text-xs"
                  onClick={() => setLocation(`/love-tree/${currentLoveTree?.id || 1}`)}
                >
                  🖥️ 전체화면
                </Button>
              </div>
              
              <div className="relative w-full h-64 flex items-center justify-center">
                <div className="text-6xl">🌸</div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-gray-600 text-sm mt-8">첫 번째 러브트리를 만들어보세요!</p>
                  <Button className="btn-gradient-primary mt-2" size="sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    시작하기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-divider"></div>

        <div className="px-4 space-y-6">
          <div className="card-soft rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <span>인기 카테고리</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "K-pop", icon: "🎤", count: "1.2K", color: "from-pink-400 to-purple-500" },
                { name: "드라마", icon: "📺", count: "890", color: "from-blue-400 to-cyan-500" },
                { name: "아이돌", icon: "✨", count: "2.1K", color: "from-purple-400 to-pink-500" },
                { name: "애니메이션", icon: "🎨", count: "645", color: "from-orange-400 to-red-500" }
              ].map((category) => (
                <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-3">
                    <div className={`w-8 h-8 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mb-2`}>
                      <span className="text-lg">{category.icon}</span>
                    </div>
                    <h4 className="font-semibold text-gray-800">{category.name}</h4>
                    <p className="text-sm text-gray-600">{category.count}개 러브트리</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="card-soft rounded-xl p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2 mb-4">
              <Crown className="w-5 h-5 text-purple-600" />
              <span>공식 러브트리</span>
              <Badge className="badge-official">OFFICIAL</Badge>
            </h3>
            <div className="space-y-3">
              {[
                { title: "NewJeans 완벽 입덕 루트", artist: "NewJeans", views: "128K", thumbnail: "🐰" },
                { title: "BTS 입문자 가이드", artist: "BTS", views: "256K", thumbnail: "💜" }
              ].map((tree, idx) => (
                <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-lg">
                        {tree.thumbnail}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm">{tree.title}</h4>
                        <p className="text-xs text-gray-600">{tree.artist} • {tree.views} 조회</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}