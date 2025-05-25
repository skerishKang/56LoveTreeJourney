import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Settings, 
  Crown, 
  Star, 
  Heart, 
  Trophy, 
  Calendar, 
  Clock, 
  Gift, 
  Target, 
  TrendingUp,
  Play,
  Edit3,
  Share2,
  Award,
  Sparkles,
  Users,
  MessageCircle,
  Plus
} from "lucide-react";
import SettingsMenu from "@/components/settings-menu";
import SubscriptionModal from "@/components/subscription-modal";
import ContinueLoveTreeModal from "@/components/continue-love-tree-modal";
import LoveTreeMindmap from "@/components/love-tree-mindmap";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BottomNavigation from "@/components/bottom-navigation";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showContinueTree, setShowContinueTree] = useState(false);
  const [selectedLoveTree, setSelectedLoveTree] = useState<any>(null);
  const [showMindmap, setShowMindmap] = useState(false);
  const [mindmapLoveTree, setMindmapLoveTree] = useState<any>(null);

  // 사용자 통계 데이터
  const userStats = {
    gardenerLevel: "새싹 가드너",
    gardenerPoints: 240,
    nextLevelPoints: 500,
    totalLoveTrees: 3,
    completedTrees: 1,
    totalLikes: 45,
    totalComments: 12,
    joinDate: "2025-01-25",
    watchTime: "2시간 34분",
    propagatorRank: "새싹 자빠돌이",
    conversions: 0,
    trustScore: 15
  };

  // 내 러브트리 목록
  const myLoveTrees = [
    {
      id: 1,
      title: "NewJeans 입덕 과정",
      category: "K-pop",
      progress: 70,
      status: "진행중",
      lastUpdated: "2일 전",
      videoCount: 7,
      likes: 23,
      thumbnail: "🐰"
    },
    {
      id: 2,
      title: "금성제 매력 발견",
      category: "드라마",
      progress: 100,
      status: "완성",
      lastUpdated: "1주 전",
      videoCount: 12,
      likes: 156,
      thumbnail: "🥊"
    },
    {
      id: 3,
      title: "IVE 노래 모음",
      category: "K-pop",
      progress: 40,
      status: "진행중",
      lastUpdated: "5일 전",
      videoCount: 4,
      likes: 8,
      thumbnail: "✨"
    }
  ];

  // 성취배지
  const achievements = [
    { name: "첫 트리", icon: "🌱", unlocked: true, description: "첫 번째 러브트리 생성" },
    { name: "완성자", icon: "🏆", unlocked: true, description: "러브트리 완성하기" },
    { name: "추천왕", icon: "👑", unlocked: false, description: "100개 하트 받기" },
    { name: "베테랑", icon: "⭐", unlocked: false, description: "30일 연속 접속" }
  ];

  const handleContinueTree = (tree: any) => {
    setSelectedLoveTree(tree);
    setShowContinueTree(true);
  };

  const handleShareTree = (tree: any) => {
    toast({
      title: "러브트리 공유 완료! 🌸",
      description: `"${tree.title}"이 공유되었어요!`,
    });
  };

  const progressPercentage = (userStats.gardenerPoints / userStats.nextLevelPoints) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-love-light via-white to-love-light">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-love-pink/20">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">프로필</h1>
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pb-20 space-y-6">
        {/* 프로필 카드 */}
        <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">
                🌸
              </div>
              <h2 className="text-xl font-bold text-gray-800">Hye-Rim</h2>
              <p className="text-gray-600">{user?.email || "muphobia2@gmail.com"}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => window.location.href = '/profile/edit'}
              >
                <Edit3 className="w-4 h-4 mr-1" />
                프로필 편집
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <div className="text-2xl font-bold text-pink-600">{userStats.totalLoveTrees}</div>
                <div className="text-xs text-gray-600">러브 트리</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{userStats.conversions}</div>
                <div className="text-xs text-gray-600">전파/입덕 트리</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{userStats.totalLikes}</div>
                <div className="text-xs text-gray-600">받은 하트</div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                onClick={() => setShowSubscription(true)}
              >
                <Crown className="w-4 h-4 mr-2" />
                프리미엄 구독하기
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">무료 플랜: 러브트리 5개까지</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 가드너 레벨 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>러브트리 가드너</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Badge className="bg-gray-100 text-gray-700 mb-2">{userStats.gardenerLevel}</Badge>
                <p className="text-sm text-gray-600">{userStats.gardenerPoints}/{userStats.nextLevelPoints} 포인트</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">{userStats.gardenerPoints}P</div>
                <div className="text-xs text-gray-500">현재 포인트</div>
              </div>
            </div>
            
            <Progress value={progressPercentage} className="h-2" />
            
            <div className="text-center">
              <p className="text-xs text-gray-600">
                정원사까지 {userStats.nextLevelPoints - userStats.gardenerPoints}포인트 더 필요해요!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 내 러브트리 목록 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
                <span>내 러브트리</span>
              </div>
              <Badge variant="outline">{myLoveTrees.length}개</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {myLoveTrees.map((tree) => (
              <Card key={tree.id} className="border border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
                      {tree.thumbnail}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-800">{tree.title}</h4>
                        <Badge 
                          className={tree.status === "완성" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}
                        >
                          {tree.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{tree.category} • {tree.videoCount}개 영상</p>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">진행률</span>
                        <span className="text-xs font-medium">{tree.progress}%</span>
                      </div>
                      <Progress value={tree.progress} className="h-1 mb-2" />
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{tree.lastUpdated}</span>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3 text-red-400" />
                          <span>{tree.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-3">
                    {tree.status === "진행중" ? (
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500"
                        onClick={() => {
                          setMindmapLoveTree(tree);
                          setShowMindmap(true);
                        }}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        계속하기
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 bg-green-50 text-green-700 hover:bg-green-100"
                        onClick={() => {
                          setMindmapLoveTree(tree);
                          setShowMindmap(true);
                        }}
                      >
                        <Trophy className="w-4 h-4 mr-1" />
                        완성됨
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleShareTree(tree)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="border-dashed border-2 border-gray-200 hover:border-pink-300 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">새 러브트리 만들기</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* 성취배지 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span>성취 배지</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className={`text-center p-3 rounded-lg border ${
                    achievement.unlocked 
                      ? "bg-yellow-50 border-yellow-200" 
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className={`text-2xl mb-1 ${achievement.unlocked ? "" : "grayscale opacity-50"}`}>
                    {achievement.icon}
                  </div>
                  <p className="text-xs font-medium text-gray-700">{achievement.name}</p>
                  {achievement.unlocked && (
                    <Badge className="bg-green-500 text-white text-xs mt-1">달성</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 자빠돌이/꼬돌이 현황 */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span>자빠돌이/꼬돌이 현황</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-blue-600">{userStats.conversions}명</div>
              <p className="text-sm text-gray-600">입덕시킨 사람 수</p>
              <Badge className="bg-gray-100 text-gray-700 mt-2">{userStats.propagatorRank}</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div className="bg-white rounded p-3">
                <div className="font-bold text-green-600">{userStats.trustScore}</div>
                <div className="text-gray-600">신뢰도 점수</div>
              </div>
              <div className="bg-white rounded p-3">
                <div className="font-bold text-purple-600">42위</div>
                <div className="text-gray-600">현재 순위</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 통계 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span>활동 통계</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">가입일</span>
                <span className="font-medium">{userStats.joinDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">총 시청시간</span>
                <span className="font-medium">{userStats.watchTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">받은 하트</span>
                <span className="font-medium">{userStats.totalLikes}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">작성 댓글</span>
                <span className="font-medium">{userStats.totalComments}개</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />

      {/* 모달들 */}
      <SettingsMenu 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      
      <SubscriptionModal 
        isOpen={showSubscription}
        onClose={() => setShowSubscription(false)}
      />
      
      <ContinueLoveTreeModal 
        isOpen={showContinueTree}
        onClose={() => setShowContinueTree(false)}
        loveTree={selectedLoveTree}
      />

      {/* 러브트리 마인드맵 전체화면 모달 */}
      <Dialog open={showMindmap} onOpenChange={setShowMindmap}>
        <DialogContent className="max-w-full max-h-full w-screen h-screen p-0 border-0">
          {mindmapLoveTree && (
            <LoveTreeMindmap 
              loveTree={mindmapLoveTree}
              items={[]} // 실제 데이터 연결 시 아이템 전달
              isFullscreen={true}
              onClose={() => setShowMindmap(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}