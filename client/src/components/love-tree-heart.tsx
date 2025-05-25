import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Plus, Star, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoveTreeHeartProps {
  loveTreeId: number;
  initialLikes?: number;
  initialIsLiked?: boolean;
  showFullActions?: boolean;
}

export default function LoveTreeHeart({ 
  loveTreeId, 
  initialLikes = 0, 
  initialIsLiked = false,
  showFullActions = true 
}: LoveTreeHeartProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const { toast } = useToast();

  const handleLike = () => {
    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? likes + 1 : likes - 1;
    
    setIsLiked(newIsLiked);
    setLikes(newLikes);
    
    if (newIsLiked) {
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
      
      toast({
        title: "❤️ 러브트리에 하트를 눌렀어요!",
        description: "+2 가드너 포인트 획득! 💎",
      });
    } else {
      toast({
        title: "하트를 취소했어요",
        description: "언제든 다시 하트를 눌러보세요! 💕",
      });
    }
  };

  const handleComment = () => {
    toast({
      title: "💬 댓글 작성 완료!",
      description: "+3 가드너 포인트 획득! 💎",
    });
  };

  const handleAddVideo = () => {
    toast({
      title: "🎬 영상 추가 완료!",
      description: "+5 가드너 포인트 획득! 💎",
    });
  };

  return (
    <div className="relative">
      {/* 하트 애니메이션 */}
      {showHeartAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="animate-bounce">
            <Heart className="w-16 h-16 text-red-500 fill-current animate-pulse" />
          </div>
          {/* 하트 파티클 효과 */}
          <div className="absolute">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${Math.random() * 60 - 30}px`,
                  top: `${Math.random() * 60 - 30}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1s'
                }}
              >
                <Heart className="w-4 h-4 text-red-400 fill-current" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 액션 버튼들 */}
      <div className="flex items-center space-x-2">
        {/* 하트 버튼 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`relative ${isLiked ? 'text-red-500' : 'text-gray-600'} hover:text-red-500 transition-colors`}
        >
          <Heart 
            className={`w-5 h-5 ${isLiked ? 'fill-current' : ''} ${showHeartAnimation ? 'animate-pulse' : ''}`} 
          />
          <span className="ml-1 text-sm font-medium">{likes}</span>
        </Button>

        {showFullActions && (
          <>
            {/* 댓글 버튼 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComment}
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="ml-1 text-sm">댓글</span>
            </Button>

            {/* 영상 추가 버튼 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddVideo}
              className="text-gray-600 hover:text-green-500 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="ml-1 text-sm">영상</span>
            </Button>
          </>
        )}
      </div>

      {/* 포인트 획득 안내 */}
      {showFullActions && (
        <div className="mt-2 text-xs text-gray-500 bg-green-50 rounded p-2 border border-green-200">
          <div className="flex items-center space-x-1 mb-1">
            <Gift className="w-3 h-3 text-green-600" />
            <span className="font-medium text-green-700">가드너 포인트 획득!</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>하트 누르기</span>
              <span className="font-medium text-green-600">+2P</span>
            </div>
            <div className="flex justify-between">
              <span>댓글 작성</span>
              <span className="font-medium text-green-600">+3P</span>
            </div>
            <div className="flex justify-between">
              <span>영상 추가</span>
              <span className="font-medium text-green-600">+5P</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}