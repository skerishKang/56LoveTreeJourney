import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, Calendar, Users, Heart, Share2, Target, Award, Clock, Star } from "lucide-react";

interface MyRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyRecordsModal({ isOpen, onClose }: MyRecordsModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "achievements">("overview");

  // 예시 내 기록 데이터
  const myStats = {
    totalConversions: 0,
    monthlyConversions: 0,
    rank: "새싹 자빠돌이",
    trustScore: 0,
    joinDate: "2025-01-25",
    bestMonth: "아직 없음",
    mostPopularTree: "아직 없음"
  };

  const recentHistory = [
    { date: "2025-01-25", action: "자빠돌이 시스템 가입", target: "-", result: "가입 완료", points: "+10" },
    { date: "2025-01-25", action: "첫 러브트리 생성", target: "내 첫 트리", result: "생성 완료", points: "+5" },
  ];

  const achievements = [
    { 
      id: 1, 
      title: "첫 걸음", 
      description: "자빠돌이 시스템에 가입하기", 
      icon: "🎯", 
      unlocked: true, 
      date: "2025-01-25",
      reward: "+10 신뢰도"
    },
    { 
      id: 2, 
      title: "첫 트리", 
      description: "첫 번째 러브트리 만들기", 
      icon: "🌱", 
      unlocked: true, 
      date: "2025-01-25",
      reward: "+5 신뢰도"
    },
    { 
      id: 3, 
      title: "입덕 유도자", 
      description: "첫 번째 사람 입덕시키기", 
      icon: "💕", 
      unlocked: false, 
      date: null,
      reward: "+20 신뢰도"
    },
    { 
      id: 4, 
      title: "소셜 마스터", 
      description: "SNS에서 10번 공유하기", 
      icon: "📱", 
      unlocked: false, 
      date: null,
      reward: "+15 신뢰도"
    },
    { 
      id: 5, 
      title: "인플루언서", 
      description: "5명 이상 입덕시키기", 
      icon: "⭐", 
      unlocked: false, 
      date: null,
      reward: "+50 신뢰도"
    },
    { 
      id: 6, 
      title: "레전드", 
      description: "20명 이상 입덕시키기", 
      icon: "👑", 
      unlocked: false, 
      date: null,
      reward: "+100 신뢰도"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <span>내 기록</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 탭 버튼들 */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <Button
              size="sm"
              variant={activeTab === "overview" ? "default" : "ghost"}
              onClick={() => setActiveTab("overview")}
              className={`flex-1 ${activeTab === "overview" ? "bg-white shadow-sm" : ""}`}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              개요
            </Button>
            <Button
              size="sm"
              variant={activeTab === "history" ? "default" : "ghost"}
              onClick={() => setActiveTab("history")}
              className={`flex-1 ${activeTab === "history" ? "bg-white shadow-sm" : ""}`}
            >
              <Clock className="w-4 h-4 mr-1" />
              히스토리
            </Button>
            <Button
              size="sm"
              variant={activeTab === "achievements" ? "default" : "ghost"}
              onClick={() => setActiveTab("achievements")}
              className={`flex-1 ${activeTab === "achievements" ? "bg-white shadow-sm" : ""}`}
            >
              <Award className="w-4 h-4 mr-1" />
              성취
            </Button>
          </div>

          {/* 내용 */}
          <div className="max-h-[400px] overflow-y-auto">
            {activeTab === "overview" && (
              <div className="space-y-4">
                {/* 현재 상태 */}
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-2">
                        🌱
                      </div>
                      <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white">
                        {myStats.rank}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{myStats.totalConversions}</div>
                        <div className="text-sm text-gray-600">총 입덕시킨 수</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{myStats.trustScore}</div>
                        <div className="text-sm text-gray-600">신뢰도 점수</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{myStats.monthlyConversions}</div>
                        <div className="text-sm text-gray-600">이번 달</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">42위</div>
                        <div className="text-sm text-gray-600">현재 순위</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 상세 정보 */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-gray-800 mb-3">📊 상세 정보</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">가입일</span>
                        <span className="font-medium">{myStats.joinDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">최고 기록 월</span>
                        <span className="font-medium">{myStats.bestMonth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">인기 러브트리</span>
                        <span className="font-medium">{myStats.mostPopularTree}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 다음 목표 */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-gray-800 mb-3">🎯 다음 목표</h4>
                    <div className="space-y-3">
                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">중급 자빠돌이까지</span>
                          <span className="text-xs text-gray-500">5명 필요</span>
                        </div>
                        <div className="w-full bg-yellow-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "0%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-3">
                <h4 className="font-bold text-gray-800">📅 최근 활동</h4>
                {recentHistory.map((item, index) => (
                  <div key={index} className="bg-white border border-gray-100 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">{item.action}</div>
                        <div className="text-sm text-gray-500">{item.date}</div>
                        {item.target !== "-" && (
                          <div className="text-xs text-blue-600">대상: {item.target}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">{item.result}</div>
                        <div className="text-xs text-green-500">{item.points}</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {recentHistory.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>아직 활동 기록이 없어요</p>
                    <p className="text-sm">러브트리를 공유해서 첫 기록을 만들어보세요!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "achievements" && (
              <div className="space-y-3">
                <h4 className="font-bold text-gray-800">🏆 성취 목록</h4>
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`border rounded-lg p-3 ${
                      achievement.unlocked 
                        ? "bg-green-50 border-green-200" 
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`text-2xl ${achievement.unlocked ? "" : "grayscale"}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h5 className="font-bold text-gray-800">{achievement.title}</h5>
                          {achievement.unlocked && (
                            <Badge className="bg-green-500 text-white text-xs">달성</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-blue-600">{achievement.reward}</span>
                          {achievement.date && (
                            <span className="text-xs text-gray-500">{achievement.date}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}