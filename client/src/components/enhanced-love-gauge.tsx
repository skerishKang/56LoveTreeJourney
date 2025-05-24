import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, Search, Sparkles, Crown, Trophy, Zap, Star, Fire } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnhancedLoveGaugeProps {
  loveTreeId: number;
  artist?: string;
}

export default function EnhancedLoveGauge({ loveTreeId, artist = "아티스트" }: EnhancedLoveGaugeProps) {
  const { toast } = useToast();
  const [currentStage, setCurrentStage] = useState("썸");
  const [timeSpent, setTimeSpent] = useState(0);
  const [searchCount, setSearchCount] = useState(0);
  const [loveScore, setLoveScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const { data: gaugeData } = useQuery({
    queryKey: [`/api/love-trees/${loveTreeId}/gauge`],
    queryFn: async () => {
      const response = await fetch(`/api/love-trees/${loveTreeId}/gauge`);
      if (!response.ok) return { timeSpent: 0, searchCount: 0, stage: "썸", loveScore: 0 };
      return response.json();
    },
  });

  useEffect(() => {
    if (gaugeData) {
      setTimeSpent(gaugeData.timeSpent || Math.floor(Math.random() * 120) + 30);
      setSearchCount(gaugeData.searchCount || Math.floor(Math.random() * 50) + 10);
      setCurrentStage(gaugeData.stage || "썸");
      setLoveScore(gaugeData.loveScore || Math.floor(Math.random() * 85) + 15);
    }
  }, [gaugeData]);

  const stages = [
    { 
      name: "썸", 
      minScore: 0, 
      maxScore: 30, 
      color: "from-pink-400 to-pink-500", 
      emoji: "💗",
      description: "설레는 시작",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    },
    { 
      name: "폴인럽", 
      minScore: 31, 
      maxScore: 70, 
      color: "from-red-400 to-pink-600", 
      emoji: "❤️‍🔥",
      description: "완전히 빠져버림",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    { 
      name: "최애", 
      minScore: 71, 
      maxScore: 100, 
      color: "from-purple-500 to-pink-500", 
      emoji: "💜",
      description: "영원한 사랑",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  ];

  const getCurrentStageInfo = () => {
    return stages.find(stage => 
      loveScore >= stage.minScore && loveScore <= stage.maxScore
    ) || stages[0];
  };

  const getNextStageInfo = () => {
    const currentIndex = stages.findIndex(stage => 
      loveScore >= stage.minScore && loveScore <= stage.maxScore
    );
    return stages[currentIndex + 1] || null;
  };

  const calculateLoveScore = () => {
    const timeWeight = Math.min(timeSpent / 100, 1) * 40; // 최대 40점
    const searchWeight = Math.min(searchCount / 30, 1) * 30; // 최대 30점
    const randomFactor = Math.random() * 30; // 최대 30점
    return Math.floor(timeWeight + searchWeight + randomFactor);
  };

  const handleMeasureLove = () => {
    setIsAnimating(true);
    const newScore = calculateLoveScore();
    
    setTimeout(() => {
      setLoveScore(newScore);
      setTimeSpent(prev => prev + Math.floor(Math.random() * 10) + 5);
      setSearchCount(prev => prev + Math.floor(Math.random() * 3) + 1);
      
      const newStage = stages.find(stage => 
        newScore >= stage.minScore && newScore <= stage.maxScore
      );
      
      if (newStage && newStage.name !== currentStage) {
        setCurrentStage(newStage.name);
        toast({
          title: `🎉 단계 업그레이드!`,
          description: `${newStage.emoji} ${newStage.name} 단계에 도달했습니다!`,
        });
      }
      
      setIsAnimating(false);
    }, 2000);

    toast({
      title: "💕 폴인럽 측정 중...",
      description: "당신의 사랑 지수를 분석하고 있어요!",
    });
  };

  const currentStageInfo = getCurrentStageInfo();
  const nextStageInfo = getNextStageInfo();
  const progressInStage = ((loveScore - currentStageInfo.minScore) / (currentStageInfo.maxScore - currentStageInfo.minScore)) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* 메인 게이지 카드 */}
      <Card className={`${currentStageInfo.borderColor} ${currentStageInfo.bgColor} border-2`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Heart className="w-6 h-6 text-pink-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                폴인럽 게이지
              </span>
            </div>
            <p className="text-sm text-gray-600 font-normal">{artist}에 대한 당신의 사랑 지수를 측정해보세요!</p>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 현재 단계 표시 */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-4xl">{currentStageInfo.emoji}</span>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{currentStageInfo.name}</h3>
                <p className="text-sm text-gray-600">{currentStageInfo.description}</p>
              </div>
            </div>
            
            {/* 사랑 점수 */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white rounded-full border-2 border-pink-200">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span className="font-bold text-lg text-gray-800">
                {isAnimating ? "측정 중..." : `${loveScore}점`}
              </span>
            </div>
          </div>

          {/* 진행률 바 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">현재 단계 진행률</span>
              <span className="text-sm text-gray-600">{Math.round(progressInStage)}%</span>
            </div>
            
            <div className="relative">
              <Progress 
                value={isAnimating ? 50 : progressInStage} 
                className={`h-3 ${isAnimating ? 'animate-pulse' : ''}`}
              />
              <div 
                className={`absolute top-0 left-0 h-3 bg-gradient-to-r ${currentStageInfo.color} rounded-full transition-all duration-1000`}
                style={{ width: `${isAnimating ? 50 : progressInStage}%` }}
              />
            </div>
            
            {nextStageInfo && (
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  다음 단계: {nextStageInfo.emoji} {nextStageInfo.name} ({nextStageInfo.minScore}점 필요)
                </p>
              </div>
            )}
          </div>

          {/* 측정 버튼 */}
          <div className="text-center">
            <Button
              onClick={handleMeasureLove}
              disabled={isAnimating}
              className={`bg-gradient-to-r ${currentStageInfo.color} hover:opacity-90 text-white px-6 py-2 text-lg font-medium ${
                isAnimating ? 'animate-pulse' : ''
              }`}
            >
              {isAnimating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>측정 중...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>사랑 지수 측정하기</span>
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 상세 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-pink-200">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">총 시청 시간</p>
                <p className="text-lg font-bold text-gray-800">{timeSpent}분</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">검색 횟수</p>
                <p className="text-lg font-bold text-gray-800">{searchCount}회</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">예상 등급</p>
                <p className="text-lg font-bold text-gray-800">
                  {loveScore >= 90 ? "S급 팬" : 
                   loveScore >= 70 ? "A급 팬" : 
                   loveScore >= 50 ? "B급 팬" : "C급 팬"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 단계별 안내 */}
      <Card className="border-pink-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-pink-500" />
            <span>폴인럽 단계 안내</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stages.map((stage, index) => (
              <div
                key={stage.name}
                className={`p-4 rounded-lg border-2 ${
                  currentStageInfo.name === stage.name 
                    ? `${stage.borderColor} ${stage.bgColor}` 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="text-center space-y-2">
                  <span className="text-2xl">{stage.emoji}</span>
                  <h4 className="font-bold text-gray-800">{stage.name}</h4>
                  <p className="text-xs text-gray-600">{stage.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {stage.minScore}-{stage.maxScore}점
                  </Badge>
                  {currentStageInfo.name === stage.name && (
                    <div className="mt-2">
                      <Badge className={`bg-gradient-to-r ${stage.color} text-white`}>
                        현재 단계
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 재미있는 팁 */}
      <Card className="border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50">
        <CardContent className="pt-4">
          <div className="flex items-start space-x-3">
            <Fire className="w-5 h-5 text-pink-500 mt-1" />
            <div>
              <h4 className="font-medium text-gray-800 mb-1">💡 폴인럽 가속화 팁</h4>
              <p className="text-sm text-gray-600">
                더 많은 영상을 시청하고, 관련 검색을 늘리고, 러브트리에 영상을 추가하면 
                사랑 지수가 더 빠르게 상승해요! {currentStageInfo.emoji}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}