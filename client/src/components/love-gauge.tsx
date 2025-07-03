import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, Search, Sparkles, Crown, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoveGaugeProps {
  loveTreeId: number;
  artist?: string;
}

export default function LoveGauge({ loveTreeId, artist }: LoveGaugeProps) {
  const { toast } = useToast();
  const [currentStage, setCurrentStage] = useState("썸");
  const [timeSpent, setTimeSpent] = useState(0); // minutes
  const [searchCount, setSearchCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const { data: gaugeData } = useQuery({
    queryKey: [`/api/love-trees/${loveTreeId}/gauge`],
    queryFn: async () => {
      const response = await fetch(`/api/love-trees/${loveTreeId}/gauge`);
      if (!response.ok) return { timeSpent: 0, searchCount: 0, stage: "썸" };
      return response.json();
    },
  });

  useEffect(() => {
    if (gaugeData) {
      setTimeSpent(gaugeData.timeSpent || 0);
      setSearchCount(gaugeData.searchCount || 0);
      setCurrentStage(gaugeData.stage || "썸");
    }
  }, [gaugeData]);

  const stages = [
    { name: "썸", minTime: 0, maxTime: 100, color: "bg-pink-400", description: "설레는 시작" },
    { name: "폴인럽", minTime: 101, maxTime: 300, color: "bg-red-500", description: "완전히 빠져버림" },
    { name: "최애", minTime: 301, maxTime: 999, color: "bg-purple-600", description: "영원한 사랑" }
  ];

  const getCurrentStageInfo = () => {
    return stages.find(stage => stage.name === currentStage) || stages[0];
  };

  const getProgressPercentage = () => {
    const stageInfo = getCurrentStageInfo();
    const progress = Math.min(100, (timeSpent / stageInfo.maxTime) * 100);
    return progress;
  };

  const handleManualComplete = () => {
    if (timeSpent >= getCurrentStageInfo().minTime) {
      setIsComplete(true);
      
      // 특별 이벤트 발생!
      toast({
        title: `🎉 ${artist} ${currentStage} 단계 완료!`,
        description: "축하해요! 특별한 메시지가 도착했어요!",
        duration: 5000,
      });

      // 다음 단계로 진급
      const currentIndex = stages.findIndex(s => s.name === currentStage);
      if (currentIndex < stages.length - 1) {
        setCurrentStage(stages[currentIndex + 1].name);
      }
      
      // 특별 이벤트 사운드나 애니메이션 효과
      celebrateStageComplete();
    }
  };

  const celebrateStageComplete = () => {
    // 축하 효과 (실제로는 사운드나 애니메이션)
    const celebration = document.createElement('div');
    celebration.innerHTML = '🎊✨💕';
    celebration.style.position = 'fixed';
    celebration.style.top = '50%';
    celebration.style.left = '50%';
    celebration.style.transform = 'translate(-50%, -50%)';
    celebration.style.fontSize = '4rem';
    celebration.style.zIndex = '9999';
    celebration.style.animation = 'bounce 2s ease-in-out';
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
      document.body.removeChild(celebration);
    }, 2000);
  };

  const addSearchActivity = () => {
    setSearchCount(prev => prev + 1);
    setTimeSpent(prev => prev + 5); // 검색 1회당 5분 추가
    
    toast({
      title: "활동 기록됨! 📱",
      description: "검색 활동이 폴인럽 게이지에 반영되었어요!",
    });
  };

  const stageInfo = getCurrentStageInfo();
  const progressPercentage = getProgressPercentage();

  return (
    <Card className="bg-gradient-to-br from-love-pink/10 via-white to-love-dark/10 border-love-pink/30">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Heart className="w-6 h-6 text-love-pink animate-pulse" />
          <span className="text-xl font-bold bg-gradient-to-r from-love-pink to-love-dark bg-clip-text text-transparent">
            {artist} 폴인럽 게이지
          </span>
          <Heart className="w-6 h-6 text-love-pink animate-pulse" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 현재 단계 */}
        <div className="text-center">
          <Badge 
            className={`${stageInfo.color} text-white px-4 py-2 text-lg font-bold shadow-lg`}
          >
            {currentStage} 단계
          </Badge>
          <p className="text-sm text-gray-600 mt-2">{stageInfo.description}</p>
        </div>

        {/* 진행률 바 */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">진행률</span>
            <span className="font-bold text-love-pink">
              {timeSpent}시간 / {stageInfo.maxTime}시간
            </span>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="h-4 bg-gray-200"
          />
          
          <div className="text-center">
            <span className="text-2xl font-bold text-love-pink">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>

        {/* 활동 통계 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/50 rounded-lg p-3 text-center border border-love-pink/20">
            <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <div className="text-lg font-bold text-gray-800">{timeSpent}시간</div>
            <div className="text-xs text-gray-600">시청 시간</div>
          </div>
          
          <div className="bg-white/50 rounded-lg p-3 text-center border border-love-pink/20">
            <Search className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <div className="text-lg font-bold text-gray-800">{searchCount}회</div>
            <div className="text-xs text-gray-600">검색 횟수</div>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-3">
          <Button 
            onClick={addSearchActivity}
            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:opacity-90"
          >
            <Search className="w-4 h-4 mr-2" />
            검색 활동 추가 (+5분)
          </Button>
          
          {progressPercentage >= 80 && (
            <Button 
              onClick={handleManualComplete}
              className="w-full bg-gradient-to-r from-love-pink to-love-dark hover:opacity-90 animate-pulse"
            >
              <Crown className="w-4 h-4 mr-2" />
              이 단계 완료하기! 🎉
            </Button>
          )}
        </div>

        {/* 다음 단계 미리보기 */}
        {currentStage !== "최애" && (
          <div className="bg-gradient-to-r from-sparkle-gold/20 to-tree-green/20 rounded-lg p-4 text-center">
            <Sparkles className="w-6 h-6 mx-auto mb-2 text-sparkle-gold" />
            <p className="text-sm text-gray-700 mb-2">다음 단계:</p>
            <Badge className="bg-sparkle-gold text-white">
              {stages[stages.findIndex(s => s.name === currentStage) + 1]?.name}
            </Badge>
            <p className="text-xs text-gray-600 mt-2">
              {timeSpent >= 80 ? "곧 진급 가능해요!" : `아직 ${Math.max(0, 100 - timeSpent)}시간 더 필요해요`}
            </p>
          </div>
        )}

        {/* 달성 시 특별 메시지 */}
        {isComplete && (
          <div className="bg-gradient-to-r from-love-pink to-love-dark rounded-lg p-4 text-center text-white animate-bounce">
            <Trophy className="w-8 h-8 mx-auto mb-2" />
            <p className="font-bold">축하해요! 🎊</p>
            <p className="text-sm opacity-90">
              "{artist}님이 말해요: 감사해요~ 💕"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}