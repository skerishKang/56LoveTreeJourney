import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Trophy, Medal, Star, Target, Heart } from "lucide-react";

interface PropagatorStats {
  id: number;
  userId: string;
  totalConversions: number;
  monthlyConversions: number;
  rank: string;
  trustScore: number;
  lastUpdated: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  };
}

export default function PropagatorRankings() {
  const { data: rankings, isLoading } = useQuery<PropagatorStats[]>({
    queryKey: ["/api/propagator-rankings"],
  });

  const getRankIcon = (position: number) => {
    if (position === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (position === 2) return <Trophy className="w-6 h-6 text-gray-400" />;
    if (position === 3) return <Medal className="w-6 h-6 text-orange-500" />;
    return <Star className="w-5 h-5 text-blue-500" />;
  };

  const getRankColor = (rank: string) => {
    if (rank.includes("레전드")) return "bg-gradient-to-r from-purple-500 to-pink-500";
    if (rank.includes("마스터")) return "bg-gradient-to-r from-blue-500 to-purple-500";
    if (rank.includes("베테랑")) return "bg-gradient-to-r from-green-500 to-blue-500";
    if (rank.includes("중급")) return "bg-gradient-to-r from-yellow-500 to-orange-500";
    return "bg-gradient-to-r from-gray-400 to-gray-500";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          🎯 자빠돌이/꼬돌이 순위
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          추천 러브트리로 다른 사람들을 입덕시킨 횟수 순위입니다!
        </p>
      </div>

      {rankings?.map((user, index) => (
        <Card 
          key={user.id} 
          className={`relative overflow-hidden ${
            index < 3 ? 'border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50' : ''
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              {/* 순위 아이콘 */}
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md">
                {getRankIcon(index + 1)}
                <span className="text-xs font-bold absolute bottom-0 right-0 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {index + 1}
                </span>
              </div>

              {/* 프로필 이미지 */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  {user.user.firstName?.[0] || user.user.email?.[0] || "?"}
                </div>
              </div>

              {/* 사용자 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-bold text-gray-800 truncate">
                    {user.user.firstName || user.user.email?.split('@')[0] || "익명"}
                  </h3>
                  <Badge className={`text-white text-xs ${getRankColor(user.rank)}`}>
                    {user.rank}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3 text-red-500" />
                    <span>총 {user.totalConversions}명 입덕</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3 text-blue-500" />
                    <span>이달 {user.monthlyConversions}명</span>
                  </div>
                </div>
              </div>

              {/* 신뢰도 점수 */}
              <div className="flex-shrink-0 text-right">
                <div className="text-lg font-bold text-purple-600">
                  {user.trustScore.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">신뢰도</div>
              </div>
            </div>

            {/* 특별 효과 - 상위 3위 */}
            {index < 3 && (
              <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
                {index === 0 && <Crown className="w-full h-full text-yellow-500" />}
                {index === 1 && <Trophy className="w-full h-full text-gray-400" />}
                {index === 2 && <Medal className="w-full h-full text-orange-500" />}
              </div>
            )}
          </CardContent>
        </Card>
      )) || (
        <div className="text-center py-8 text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>아직 자빠돌이/꼬돌이 순위가 없습니다.</p>
          <p className="text-sm mt-2">러브트리를 추천해서 다른 사람들을 입덕시켜보세요!</p>
        </div>
      )}

      {/* 등급 설명 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-sm flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>자빠돌이/꼬돌이 등급 시스템</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">새싹 자빠돌이</span>
            <span className="text-gray-500">0-4명 입덕</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-orange-600">중급 자빠돌이</span>
            <span className="text-gray-500">5-19명 입덕</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-600">베테랑 자빠돌이</span>
            <span className="text-gray-500">20-49명 입덕</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-purple-600">마스터 자빠돌이</span>
            <span className="text-gray-500">50-99명 입덕</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-pink-600">레전드 자빠돌이</span>
            <span className="text-gray-500">100명 이상 입덕</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}