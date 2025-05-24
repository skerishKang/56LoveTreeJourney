import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Heart, Users, TrendingUp } from "lucide-react";
import { User } from "@shared/schema";

interface PropagatorStatsProps {
  user: User;
}

export default function PropagatorStats({ user }: PropagatorStatsProps) {
  const getRankIcon = (rank: string) => {
    switch (rank) {
      case "마스터":
        return <Crown className="w-5 h-5 text-sparkle-gold" />;
      case "전도사":
        return <Heart className="w-5 h-5 text-love-pink" />;
      default:
        return <Users className="w-5 h-5 text-tree-green" />;
    }
  };

  const getRankBadgeStyle = (rank: string) => {
    switch (rank) {
      case "마스터":
        return "bg-gradient-to-r from-sparkle-gold to-yellow-600 text-black";
      case "전도사":
        return "bg-gradient-to-r from-love-pink to-love-dark text-white";
      default:
        return "bg-gradient-to-r from-tree-green to-green-600 text-white";
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-love-pink/20 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-gray-800">
          {getRankIcon(user.propagatorRank || "새싹")}
          <span>자빠돌이 스테이터스</span>
          <Badge className={`ml-auto ${getRankBadgeStyle(user.propagatorRank || "새싹")}`}>
            {user.propagatorRank || "새싹"}
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