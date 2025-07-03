import React, { useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Bell, 
  Heart, 
  Users, 
  Crown, 
  Star,
  Plus,
  Check,
  Sparkles,
  Trophy,
  MessageCircle,
  Home
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Propagator {
  id: string;
  name: string;
  email: string;
  totalConversions: number;
  rank: string;
  trustScore: number;
  recentTrees: string[];
  subscribers: number;
  isSubscribed: boolean;
  profileImage?: string;
  specialty: string[];
}

export default function PropagatorSubscription() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState("");

  // 인기 전도사들 데이터 (실제로는 API에서 가져올 예정)
  const topPropagators: Propagator[] = [
    {
      id: "user1",
      name: "민지팬",
      email: "minzi@example.com",
      totalConversions: 156,
      rank: "레전드 전도사",
      trustScore: 2340,
      recentTrees: ["정국 보컬 모음", "RM 랩 레전드", "지민 댄스 킬링파트"],
      subscribers: 1234,
      isSubscribed: false,
      specialty: ["BTS", "보컬", "감동"]
    },
    {
      id: "user2", 
      name: "하늘별",
      email: "star@example.com",
      totalConversions: 89,
      rank: "마스터 전도사",
      trustScore: 1780,
      recentTrees: ["뉴진스 하입보이", "아이브 러브다이브", "에스파 넥스트레벨"],
      subscribers: 856,
      isSubscribed: true,
      specialty: ["걸그룹", "댄스", "귀여움"]
    },
    {
      id: "user3",
      name: "소라공주", 
      email: "sora@example.com",
      totalConversions: 134,
      rank: "레전드 전도사",
      trustScore: 2010,
      recentTrees: ["스트레이키즈 신곡", "투모로우바이투게더", "엔하이픈 무대"],
      subscribers: 967,
      isSubscribed: false,
      specialty: ["4세대", "에너지", "무대"]
    },
    {
      id: "user4",
      name: "별빛나라",
      email: "light@example.com", 
      totalConversions: 78,
      rank: "베테랑 전도사",
      trustScore: 1456,
      recentTrees: ["블랙핑크 리사", "트와이스 나연", "레드벨벳 웬디"],
      subscribers: 654,
      isSubscribed: true,
      specialty: ["솔로", "비주얼", "보컬"]
    },
    {
      id: "user5",
      name: "달님이",
      email: "moon@example.com",
      totalConversions: 45,
      rank: "중급 전도사", 
      trustScore: 890,
      recentTrees: ["(여자)아이들 미연", "있지 예지", "케플러 샤오팅"],
      subscribers: 432,
      isSubscribed: false,
      specialty: ["신인", "센터", "매력"]
    }
  ];

  // 구독/구독취소 처리
  const subscribeMutation = useMutation({
    mutationFn: (propagatorId: string) =>
      apiRequest(`/api/propagators/${propagatorId}/subscribe`, "POST"),
    onSuccess: (_, propagatorId) => {
      // 로컬 상태 업데이트
      queryClient.invalidateQueries({ queryKey: ["/api/propagators"] });
      
      const propagator = topPropagators.find(p => p.id === propagatorId);
      toast({
        title: "구독 완료! 🎉",
        description: `${propagator?.name}님의 새로운 러브트리 소식을 받아보세요!`,
      });
    },
  });

  const getRankIcon = (rank: string) => {
    if (rank.includes("레전드")) return <Crown className="w-5 h-5 text-purple-500" />;
    if (rank.includes("마스터")) return <Trophy className="w-5 h-5 text-blue-500" />;
    if (rank.includes("베테랑")) return <Star className="w-5 h-5 text-green-500" />;
    return <Sparkles className="w-5 h-5 text-yellow-500" />;
  };

  const getRankColor = (rank: string) => {
    if (rank.includes("레전드")) return "from-purple-500 to-pink-500";
    if (rank.includes("마스터")) return "from-blue-500 to-purple-500";
    if (rank.includes("베테랑")) return "from-green-500 to-blue-500";
    return "from-yellow-500 to-orange-500";
  };

  const filteredPropagators = topPropagators.filter(propagator =>
    propagator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    propagator.specialty.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* 상단 헤더 */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-purple-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="rounded-full">
                <Home className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-bold text-xl text-gray-800 flex items-center space-x-2">
                <Bell className="w-6 h-6 text-purple-500" />
                <span>전도사 구독센터</span>
              </h1>
              <p className="text-sm text-gray-600">취향이 비슷한 전도사를 구독하고 새로운 러브트리 소식을 받아보세요! 📢</p>
            </div>
          </div>

          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1">
            구독중 {topPropagators.filter(p => p.isSubscribed).length}명
          </Badge>
        </div>

        {/* 검색바 */}
        <div className="mt-4 max-w-md">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="전도사나 관심사로 검색... (예: BTS, 댄스, 보컬)"
            className="w-full"
          />
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="p-4 space-y-6">
        {/* 내 구독 현황 */}
        <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span>내 구독 현황</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{topPropagators.filter(p => p.isSubscribed).length}</div>
                <p className="text-sm text-gray-600">구독중인 전도사</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">12</div>
                <p className="text-sm text-gray-600">이번 주 새 트리</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">34</div>
                <p className="text-sm text-gray-600">받은 알림</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 추천 전도사들 */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>인기 전도사들</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPropagators.map((propagator) => (
              <Card 
                key={propagator.id}
                className="hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-gray-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {propagator.name[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 flex items-center space-x-2">
                          <span>{propagator.name}</span>
                          {getRankIcon(propagator.rank)}
                        </h3>
                        <Badge className={`bg-gradient-to-r ${getRankColor(propagator.rank)} text-white text-xs`}>
                          {propagator.rank}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant={propagator.isSubscribed ? "outline" : "default"}
                      className={propagator.isSubscribed 
                        ? "border-green-300 text-green-700 hover:bg-green-50" 
                        : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                      }
                      onClick={() => subscribeMutation.mutate(propagator.id)}
                      disabled={subscribeMutation.isPending}
                    >
                      {propagator.isSubscribed ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          구독중
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          구독하기
                        </>
                      )}
                    </Button>
                  </div>

                  {/* 통계 */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{propagator.totalConversions}</div>
                      <p className="text-xs text-gray-600">입덕시킨 수</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-pink-600">{propagator.subscribers}</div>
                      <p className="text-xs text-gray-600">구독자</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{propagator.trustScore}</div>
                      <p className="text-xs text-gray-600">신뢰도</p>
                    </div>
                  </div>

                  {/* 전문 분야 */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">전문 분야</p>
                    <div className="flex flex-wrap gap-1">
                      {propagator.specialty.map((spec, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="text-xs border-purple-300 text-purple-700"
                        >
                          #{spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 최근 러브트리 */}
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-2">최근 러브트리</p>
                    <div className="space-y-1">
                      {propagator.recentTrees.slice(0, 2).map((tree, index) => (
                        <div key={index} className="text-xs text-gray-600 flex items-center space-x-1">
                          <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                          <span>{tree}</span>
                        </div>
                      ))}
                      {propagator.recentTrees.length > 2 && (
                        <p className="text-xs text-gray-500">+{propagator.recentTrees.length - 2}개 더</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 최근 알림 */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-blue-500" />
              <span>최근 알림</span>
              <Badge className="bg-green-100 text-green-800 text-xs">실시간</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  propagator: "하늘별",
                  message: "새로운 '아이브 안유진' 러브트리를 올렸어요!",
                  time: "5분 전",
                  type: "new_tree",
                  avatar: "🌟"
                },
                {
                  propagator: "별빛나라", 
                  message: "리사 솔로곡 러브트리가 100명 덕후 달성! 🎉",
                  time: "1시간 전",
                  type: "milestone",
                  avatar: "✨"
                },
                {
                  propagator: "민지팬",
                  message: "정국 Golden 앨범 러브트리 완성!",
                  time: "3시간 전", 
                  type: "completion",
                  avatar: "👑"
                }
              ].map((notification, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white">
                    {notification.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-800 text-sm">{notification.propagator}</span>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        {notification.type === 'new_tree' ? '새 트리' : 
                         notification.type === 'milestone' ? '달성' : '완성'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                  <Button size="sm" variant="ghost">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}