import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Plus, 
  Heart, 
  MessageCircle, 
  Share2, 
  Edit3, 
  Youtube, 
  Instagram, 
  Music, 
  Sparkles, 
  Target, 
  Clock,
  Star,
  Gift,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContinueLoveTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  loveTree: any;
}

export default function ContinueLoveTreeModal({ isOpen, onClose, loveTree }: ContinueLoveTreeModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddVideo, setShowAddVideo] = useState(false);
  const { toast } = useToast();

  // 현재 러브트리 진행 상황
  const currentProgress = {
    totalVideos: 12,
    currentVideos: 7,
    completionRate: 58,
    lastActivity: "2일 전",
    category: "K-pop",
    title: loveTree?.title || "NewJeans 입덕 과정",
    nextSuggestions: [
      { title: "NewJeans - Get Up", platform: "YouTube", thumbnail: "🎵", recommended: true },
      { title: "하니 브이로그", platform: "YouTube", thumbnail: "📹", recommended: false },
      { title: "민지 인스타 라이브", platform: "Instagram", thumbnail: "📱", recommended: true },
      { title: "NewJeans - ETA", platform: "YouTube", thumbnail: "🎵", recommended: false }
    ]
  };

  const recentActivities = [
    { action: "영상 추가", title: "NewJeans - Super Shy", time: "2일 전", points: "+5 가드너 포인트" },
    { action: "하트 누르기", title: "다니엘 팬캠", time: "3일 전", points: "+2 가드너 포인트" },
    { action: "댓글 작성", title: "혜인 직캠", time: "5일 전", points: "+3 가드너 포인트" }
  ];

  const handleAddVideo = (suggestion: any) => {
    toast({
      title: "영상 추가됨! 🎉",
      description: `"${suggestion.title}"이 러브트리에 추가되었어요! +5 가드너 포인트 획득!`,
    });
    
    // 가드너 포인트 애니메이션 효과
    setTimeout(() => {
      toast({
        title: "⭐ 가드너 포인트 +5",
        description: "영상 추가로 포인트를 획득했어요!",
      });
    }, 1000);
  };

  const handleLikeVideo = (videoTitle: string) => {
    toast({
      title: "❤️ 하트 누르기 완료!",
      description: `"${videoTitle}"에 하트를 눌렀어요! +2 가드너 포인트 획득!`,
    });
  };

  const handleComment = (videoTitle: string) => {
    toast({
      title: "💬 댓글 작성 완료!",
      description: `"${videoTitle}"에 댓글을 작성했어요! +3 가드너 포인트 획득!`,
    });
  };

  const handleShareTree = () => {
    toast({
      title: "🌸 러브트리 공유 완료!",
      description: "친구들이 이 러브트리를 보고 입덕하면 자빠돌이 포인트가 올라가요!",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-pink-500" />
            <span>러브트리 계속 만들기</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* 현재 진행 상황 */}
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{currentProgress.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className="bg-pink-100 text-pink-700">{currentProgress.category}</Badge>
                    <span className="text-sm text-gray-600">마지막 활동: {currentProgress.lastActivity}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">{currentProgress.completionRate}%</div>
                  <div className="text-xs text-gray-600">완성도</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>진행률 ({currentProgress.currentVideos}/{currentProgress.totalVideos} 영상)</span>
                  <span className="text-pink-600 font-medium">{currentProgress.completionRate}%</span>
                </div>
                <Progress value={currentProgress.completionRate} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowAddVideo(true)}
                  className="flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>영상 추가</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleShareTree}
                  className="flex items-center space-x-1"
                >
                  <Share2 className="w-4 h-4" />
                  <span>공유하기</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>편집</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 추천 영상 */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span>다음에 추가할 영상 추천</span>
            </h4>
            <div className="space-y-3">
              {currentProgress.nextSuggestions.map((suggestion, index) => (
                <Card key={index} className={`${suggestion.recommended ? 'border-blue-200 bg-blue-50' : 'border-gray-100'}`}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
                          {suggestion.thumbnail}
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-800">{suggestion.title}</h5>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {suggestion.platform === "YouTube" ? (
                                <Youtube className="w-3 h-3 mr-1" />
                              ) : (
                                <Instagram className="w-3 h-3 mr-1" />
                              )}
                              {suggestion.platform}
                            </Badge>
                            {suggestion.recommended && (
                              <Badge className="bg-blue-100 text-blue-700 text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                추천
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm"
                          onClick={() => handleLikeVideo(suggestion.title)}
                          variant="ghost"
                          className="p-2"
                        >
                          <Heart className="w-4 h-4 text-red-500" />
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleComment(suggestion.title)}
                          variant="ghost"
                          className="p-2"
                        >
                          <MessageCircle className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleAddVideo(suggestion)}
                          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          추가
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 최근 활동 */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-500" />
              <span>최근 활동</span>
            </h4>
            <div className="space-y-2">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">{activity.action}</div>
                    <div className="text-sm text-gray-600">{activity.title}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    <Gift className="w-3 h-3 mr-1" />
                    {activity.points}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* 가드너 포인트 현황 */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-800 flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span>가드너 포인트 현황</span>
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    영상 추가, 하트 누르기, 댓글 작성으로 포인트를 모아보세요!
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">240P</div>
                  <div className="text-xs text-gray-600">현재 포인트</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
                <div className="text-center p-2 bg-white rounded">
                  <div className="font-bold text-blue-600">+5P</div>
                  <div className="text-gray-600">영상 추가</div>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <div className="font-bold text-red-600">+2P</div>
                  <div className="text-gray-600">하트 누르기</div>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <div className="font-bold text-green-600">+3P</div>
                  <div className="text-gray-600">댓글 작성</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 완성 목표 */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-yellow-600" />
              <h4 className="font-bold text-yellow-800">완성 목표</h4>
            </div>
            <p className="text-sm text-yellow-700 mb-3">
              5개 영상만 더 추가하면 러브트리가 완성돼요! 완성하면 특별 배지를 받을 수 있어요! 🏆
            </p>
            <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
              <Star className="w-4 h-4 mr-2" />
              완성하러 가기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}