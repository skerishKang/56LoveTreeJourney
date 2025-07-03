import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Crown, Trophy, Medal, Star, Target, Heart, TrendingUp, Users, Calendar, Share2, BarChart3 } from "lucide-react";
import { useState } from "react";
import SNSShareModal from "./sns-share-modal";
import RankingModal from "./ranking-modal";
import MyRecordsModal from "./my-records-modal";

interface PropagatorStats {
  totalConversions: number;
  monthlyConversions: number;
  rank: string;
  trustScore: number;
}

export default function PropagatorDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [showRecordsModal, setShowRecordsModal] = useState(false);

  // 내 자빠돌이 통계 가져오기
  const { data: myStats, isLoading } = useQuery<PropagatorStats>({
    queryKey: ["/api/propagator-stats"],
    enabled: !!user,
  });

  // 변환 추적 (누군가 내 추천으로 입덕했을 때)
  const trackConversionMutation = useMutation({
    mutationFn: (data: { convertedUserId: string; loveTreeId: number; conversionType: string }) =>
      apiRequest("/api/track-conversion", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/propagator-stats"] });
    },
  });

  const getRankIcon = (rank: string) => {
    if (rank.includes("레전드")) return <Crown className="w-6 h-6 text-purple-500" />;
    if (rank.includes("마스터")) return <Trophy className="w-6 h-6 text-blue-500" />;
    if (rank.includes("베테랑")) return <Medal className="w-6 h-6 text-green-500" />;
    if (rank.includes("중급")) return <Star className="w-6 h-6 text-yellow-500" />;
    return <Target className="w-6 h-6 text-gray-500" />;
  };

  const getRankColor = (rank: string) => {
    if (rank.includes("레전드")) return "from-purple-500 to-pink-500";
    if (rank.includes("마스터")) return "from-blue-500 to-purple-500";
    if (rank.includes("베테랑")) return "from-green-500 to-blue-500";
    if (rank.includes("중급")) return "from-yellow-500 to-orange-500";
    return "from-gray-400 to-gray-500";
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = myStats || {
    totalConversions: 0,
    monthlyConversions: 0,
    rank: "새싹 자빠돌이",
    trustScore: 0
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className={`bg-gradient-to-r ${getRankColor(stats.rank)} text-white`}>
        <CardTitle className="flex items-center space-x-3">
          {getRankIcon(stats.rank)}
          <div>
            <h3 className="text-lg font-bold">🎯 자빠돌이/꼬돌이 시스템</h3>
            <p className="text-sm opacity-90">추천한 러브트리로 다른 사람을 입덕시킨 영향력 순위</p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* 현재 등급 */}
        <div className="text-center">
          <Badge className={`bg-gradient-to-r ${getRankColor(stats.rank)} text-white text-lg px-4 py-2`}>
            {stats.rank}
          </Badge>
          <p className="text-sm text-gray-600 mt-2">현재 등급</p>
        </div>

        {/* 통계 그리드 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Heart className="w-5 h-5 text-red-500 mr-1" />
              <span className="text-2xl font-bold text-gray-800">{stats.totalConversions}</span>
            </div>
            <p className="text-sm text-gray-600">총 입덕시킨 횟수</p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-blue-500 mr-1" />
              <span className="text-2xl font-bold text-gray-800">{stats.monthlyConversions}</span>
            </div>
            <p className="text-sm text-gray-600">이번 달 입덕</p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-500 mr-1" />
              <span className="text-2xl font-bold text-gray-800">{stats.trustScore}</span>
            </div>
            <p className="text-sm text-gray-600">신뢰도 점수</p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-orange-500 mr-1" />
              <span className="text-2xl font-bold text-gray-800">
                {stats.totalConversions > 0 ? Math.round(stats.trustScore / stats.totalConversions) : 0}
              </span>
            </div>
            <p className="text-sm text-gray-600">평균 영향력</p>
          </div>
        </div>

        {/* 다음 등급까지 진행률 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">다음 등급까지</span>
            <span className="text-sm text-gray-500">
              {(() => {
                if (stats.rank.includes("새싹")) return `${Math.max(0, 5 - stats.totalConversions)}명 더 필요`;
                if (stats.rank.includes("중급")) return `${Math.max(0, 20 - stats.totalConversions)}명 더 필요`;
                if (stats.rank.includes("베테랑")) return `${Math.max(0, 50 - stats.totalConversions)}명 더 필요`;
                if (stats.rank.includes("마스터")) return `${Math.max(0, 100 - stats.totalConversions)}명 더 필요`;
                return "최고 등급 달성!";
              })()}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`bg-gradient-to-r ${getRankColor(stats.rank)} h-3 rounded-full transition-all duration-500`}
              style={{ 
                width: `${(() => {
                  if (stats.rank.includes("새싹")) return Math.min(100, (stats.totalConversions / 5) * 100);
                  if (stats.rank.includes("중급")) return Math.min(100, ((stats.totalConversions - 5) / 15) * 100);
                  if (stats.rank.includes("베테랑")) return Math.min(100, ((stats.totalConversions - 20) / 30) * 100);
                  if (stats.rank.includes("마스터")) return Math.min(100, ((stats.totalConversions - 50) / 50) * 100);
                  return 100;
                })()}%`
              }}
            />
          </div>
        </div>

        {/* 등급별 혜택 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3">🎁 등급별 혜택</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">새싹 자빠돌이 (0-4명)</span>
              <span className="text-green-600">기본 배지</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">중급 자빠돌이 (5-19명)</span>
              <span className="text-blue-600">특별 배지 + 우선 추천</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">베테랑 자빠돌이 (20-49명)</span>
              <span className="text-purple-600">VIP 배지 + 전용 기능</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">마스터 자빠돌이 (50-99명)</span>
              <span className="text-pink-600">마스터 배지 + 특별 권한</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">레전드 자빠돌이 (100명+)</span>
              <span className="text-yellow-600">전설 배지 + 모든 혜택</span>
            </div>
          </div>
        </div>

        {/* 추천 설명 */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            러브트리 추천하는 방법
          </h4>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• 내 러브트리를 다른 사람에게 공유</p>
            <p>• 공유받은 사람이 같은 인물에 빠지면 자동으로 입덕 카운트</p>
            <p>• 더 많이 입덕시킬수록 등급 상승!</p>
          </div>
        </div>

        {/* 행동 버튼들 */}
        <div className="space-y-3">
          <Button 
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            onClick={() => setShowShareModal(true)}
          >
            <Share2 className="w-4 h-4 mr-2" />
            내 러브트리 공유하기
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowRankingModal(true)}
            >
              <Trophy className="w-4 h-4 mr-1" />
              순위 보기
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowRecordsModal(true)}
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              내 기록
            </Button>
          </div>
        </div>
      </CardContent>

      {/* 모달들 */}
      <SNSShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        loveTree={{ id: 1, title: "내 첫 번째 러브트리", category: "K-pop" }}
      />
      
      <RankingModal 
        isOpen={showRankingModal}
        onClose={() => setShowRankingModal(false)}
      />
      
      <MyRecordsModal 
        isOpen={showRecordsModal}
        onClose={() => setShowRecordsModal(false)}
      />
    </Card>
  );
}