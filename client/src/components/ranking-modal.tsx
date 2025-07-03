import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Crown, Star, TrendingUp, Calendar, Users, Target } from "lucide-react";

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RankingModal({ isOpen, onClose }: RankingModalProps) {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "allTime">("weekly");

  // 예시 순위 데이터
  const rankings = {
    weekly: [
      { rank: 1, username: "민지팬", conversions: 15, rank_badge: "레전드 자빠돌이", avatar: "👑", trend: "+3" },
      { rank: 2, username: "하늘별", conversions: 12, rank_badge: "마스터 자빠돌이", avatar: "🌟", trend: "+1" },
      { rank: 3, username: "소라공주", conversions: 10, rank_badge: "베테랑 자빠돌이", avatar: "🌊", trend: "-1" },
      { rank: 4, username: "별빛나라", conversions: 8, rank_badge: "중급 자빠돌이", avatar: "✨", trend: "+2" },
      { rank: 5, username: "달님이", conversions: 6, rank_badge: "중급 자빠돌이", avatar: "🌙", trend: "0" },
      { rank: 6, username: "꽃잎아", conversions: 5, rank_badge: "새싹 자빠돌이", avatar: "🌸", trend: "+4" },
      { rank: 7, username: "구름이", conversions: 4, rank_badge: "새싹 자빠돌이", avatar: "☁️", trend: "-2" },
      { rank: 8, username: "바람돌이", conversions: 3, rank_badge: "새싹 자빠돌이", avatar: "🍃", trend: "+1" },
    ],
    monthly: [
      { rank: 1, username: "하늘별", conversions: 45, rank_badge: "레전드 자빠돌이", avatar: "🌟", trend: "+1" },
      { rank: 2, username: "민지팬", conversions: 42, rank_badge: "레전드 자빠돌이", avatar: "👑", trend: "-1" },
      { rank: 3, username: "별빛나라", conversions: 38, rank_badge: "마스터 자빠돌이", avatar: "✨", trend: "+2" },
      { rank: 4, username: "소라공주", conversions: 35, rank_badge: "마스터 자빠돌이", avatar: "🌊", trend: "-1" },
      { rank: 5, username: "달님이", conversions: 28, rank_badge: "베테랑 자빠돌이", avatar: "🌙", trend: "+3" },
    ],
    allTime: [
      { rank: 1, username: "민지팬", conversions: 156, rank_badge: "레전드 자빠돌이", avatar: "👑", trend: "👑" },
      { rank: 2, username: "하늘별", conversions: 142, rank_badge: "레전드 자빠돌이", avatar: "🌟", trend: "🥈" },
      { rank: 3, username: "별빛나라", conversions: 128, rank_badge: "레전드 자빠돌이", avatar: "✨", trend: "🥉" },
      { rank: 4, username: "소라공주", conversions: 115, rank_badge: "마스터 자빠돌이", avatar: "🌊", trend: "🏅" },
      { rank: 5, username: "달님이", conversions: 98, rank_badge: "마스터 자빠돌이", avatar: "🌙", trend: "🏅" },
    ]
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-amber-500" />;
    if (rank === 2) return <Trophy className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-500" />;
    return <Star className="w-4 h-4 text-blue-500" />;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-amber-100 to-amber-500";
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-400";
    if (rank === 3) return "bg-gradient-to-r from-orange-400 to-orange-500";
    return "bg-gradient-to-r from-blue-400 to-blue-500";
  };

  const getBadgeColor = (badge: string) => {
    if (badge.includes("레전드")) return "bg-gradient-to-r from-purple-500 to-pink-500";
    if (badge.includes("마스터")) return "bg-gradient-to-r from-blue-500 to-purple-500";
    if (badge.includes("베테랑")) return "bg-gradient-to-r from-green-500 to-blue-500";
    if (badge.includes("중급")) return "bg-gradient-to-r from-amber-500 to-orange-500";
    return "bg-gradient-to-r from-gray-400 to-gray-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>자빠돌이/꼬돌이 순위</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 탭 버튼들 */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <Button
              size="sm"
              variant={activeTab === "weekly" ? "default" : "ghost"}
              onClick={() => setActiveTab("weekly")}
              className={`flex-1 ${activeTab === "weekly" ? "bg-white shadow-sm" : ""}`}
            >
              <Calendar className="w-4 h-4 mr-1" />
              주간
            </Button>
            <Button
              size="sm"
              variant={activeTab === "monthly" ? "default" : "ghost"}
              onClick={() => setActiveTab("monthly")}
              className={`flex-1 ${activeTab === "monthly" ? "bg-white shadow-sm" : ""}`}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              월간
            </Button>
            <Button
              size="sm"
              variant={activeTab === "allTime" ? "default" : "ghost"}
              onClick={() => setActiveTab("allTime")}
              className={`flex-1 ${activeTab === "allTime" ? "bg-white shadow-sm" : ""}`}
            >
              <Crown className="w-4 h-4 mr-1" />
              전체
            </Button>
          </div>

          {/* 순위 리스트 */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {rankings[activeTab].map((user, index) => (
              <div
                key={user.rank}
                className={`flex items-center space-x-3 p-3 rounded-lg border ${
                  user.rank <= 3 ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200" : "bg-white border-gray-100"
                }`}
              >
                {/* 순위 */}
                <div className={`w-8 h-8 ${getRankColor(user.rank)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                  {user.rank}
                </div>

                {/* 아바타 */}
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg">
                  {user.avatar}
                </div>

                {/* 사용자 정보 */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-800">@{user.username}</span>
                    {user.rank <= 3 && getRankIcon(user.rank)}
                  </div>
                  <Badge className={`${getBadgeColor(user.rank_badge)} text-white text-xs mt-1`}>
                    {user.rank_badge}
                  </Badge>
                </div>

                {/* 입덕시킨 수 */}
                <div className="text-center">
                  <div className="font-bold text-lg text-gray-800">{user.conversions}</div>
                  <div className="text-xs text-gray-500">입덕시킴</div>
                </div>

                {/* 순위 변동 */}
                <div className="text-center min-w-[40px]">
                  <div className={`text-sm font-medium ${
                    user.trend.includes("+") ? "text-green-600" : 
                    user.trend.includes("-") ? "text-red-600" : 
                    "text-gray-500"
                  }`}>
                    {user.trend === "0" ? "-" : user.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 내 순위 표시 */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                42
              </div>
              <div className="flex-1">
                <div className="font-bold text-blue-800">내 순위</div>
                <div className="text-sm text-blue-600">새싹 자빠돌이 · 0명 입덕시킴</div>
              </div>
              <div className="text-center">
                <Target className="w-5 h-5 text-blue-500 mx-auto" />
                <div className="text-xs text-blue-600 mt-1">목표: 상위 30위</div>
              </div>
            </div>
          </div>

          {/* 순위 업 팁 */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-3 border border-pink-200">
            <div className="text-sm text-gray-700">
              <p className="font-medium text-pink-700 mb-2">🎯 순위 올리는 방법</p>
              <div className="space-y-1">
                <p>• 매력적인 러브트리를 만들어 공유하기</p>
                <p>• SNS에서 적극적으로 홍보하기</p>
                <p>• 친구들이 관심 있어할 콘텐츠 큐레이션</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}