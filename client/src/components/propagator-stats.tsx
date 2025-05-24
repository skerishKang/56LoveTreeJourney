import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Heart, Users, TrendingUp } from "lucide-react";
import { User } from "@shared/schema";

interface PropagatorStatsProps {
  user: User;
}

export default function PropagatorStats({ user }: PropagatorStatsProps) {
  const getRankInfo = (rank: string) => {
    switch (rank) {
      case "새싹 가드너":
        return { icon: "🌱", text: "새싹 가드너", color: "from-green-400 to-green-600", nextThreshold: 11 };
      case "정원사":
        return { icon: "🌿", text: "정원사", color: "from-blue-400 to-blue-600", nextThreshold: 51 };
      case "마스터 가드너":
        return { icon: "🌳", text: "마스터 가드너", color: "from-purple-400 to-purple-600", nextThreshold: 151 };
      case "레전드 가드너":
        return { icon: "🏆", text: "레전드 가드너", color: "from-yellow-400 to-yellow-600", nextThreshold: 999 };
      default:
        return { icon: "🌱", text: "새싹 가드너", color: "from-green-400 to-green-600", nextThreshold: 11 };
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-love-pink/20 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{getRankInfo(user.propagatorRank || "새싹 가드너").icon}</span>
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                러브트리 가드너
              </h3>
              <p className="text-sm text-gray-600">트리를 키우는 정원사 🌳</p>
            </div>
          </div>
          <Badge className={`bg-gradient-to-r ${getRankInfo(user.propagatorRank || "새싹 가드너").color} text-white border-none shadow-md font-bold`}>
            {getRankInfo(user.propagatorRank || "새싹 가드너").text}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 전도사 점수 */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-love-pink/10 to-love-dark/10 rounded-xl">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-love-pink" />
            <span className="text-sm font-medium text-gray-700">전도사 점수</span>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-love-pink to-love-dark bg-clip-text text-transparent">
            {user.propagatorScore?.toLocaleString() || 0}
          </span>
        </div>

        {/* 성공한 추천 */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-tree-green/10 to-green-600/10 rounded-xl">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-tree-green" />
            <span className="text-sm font-medium text-gray-700">성공한 추천</span>
          </div>
          <span className="text-lg font-bold text-tree-green">
            {user.successfulRecommendations || 0}
          </span>
        </div>

        {/* 총 시청 시간 */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-sparkle-gold/10 to-yellow-600/10 rounded-xl">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-sparkle-gold" />
            <span className="text-sm font-medium text-gray-700">총 시청 시간</span>
          </div>
          <span className="text-lg font-bold text-sparkle-gold">
            {Math.floor((user.totalWatchTime || 0) / 60)}시간
          </span>
        </div>

        {/* 다음 랭크까지 */}
        <div className="mt-4 p-3 bg-gradient-to-r from-love-pink/5 to-love-dark/5 rounded-xl">
          <p className="text-xs text-gray-600 text-center">
            💡 더 많은 사람들을 입덕시켜서 랭크를 올려보세요!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}