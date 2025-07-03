import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Share2, Instagram, MessageCircle, Copy, Heart, Star } from "lucide-react";

interface SNSShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  loveTree: any;
}

export default function SNSShareModal({ isOpen, onClose, loveTree }: SNSShareModalProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const shareUrl = `${window.location.origin}/love-tree/${loveTree?.id}`;
  const shareText = `${loveTree?.title || '내 러브트리'}를 확인해보세요! 🌸✨ #러브트리 #입덕 #K팝`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast({
        title: "링크 복사 완료! 📋",
        description: "러브트리 링크가 클립보드에 복사되었어요!",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "링크 복사에 실패했어요. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  const handleInstagramShare = () => {
    const instagramUrl = `https://www.instagram.com/`;
    window.open(instagramUrl, '_blank');
    toast({
      title: "인스타그램 열기 📸",
      description: "인스타그램에서 스토리나 피드에 공유해보세요!",
    });
  };

  const handleKakaoTalk = () => {
    const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(kakaoUrl, '_blank');
    toast({
      title: "카카오톡 공유 💛",
      description: "카카오톡으로 러브트리를 공유해보세요!",
    });
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
    toast({
      title: "X(트위터) 공유 🐦",
      description: "X에서 러브트리를 공유해보세요!",
    });
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
    toast({
      title: "페이스북 공유 👥",
      description: "페이스북에서 러브트리를 공유해보세요!",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-blue-500" />
            <span>러브트리 공유하기</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 러브트리 미리보기 */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl">
                🌸
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{loveTree?.title || '내 러브트리'}</h4>
                <p className="text-sm text-gray-600">{loveTree?.category || 'K-pop'} 러브트리</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Heart className="w-3 h-3 text-red-400" />
                  <span className="text-xs text-gray-500">많은 사람들이 이 러브트리를 좋아할 거예요!</span>
                </div>
              </div>
            </div>
          </div>

          {/* SNS 공유 버튼들 */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleInstagramShare}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Instagram className="w-4 h-4 mr-2" />
              인스타그램
            </Button>

            <Button
              onClick={handleKakaoTalk}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-800"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              카카오톡
            </Button>

            <Button
              onClick={handleTwitterShare}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <span className="text-sm mr-2">𝕏</span>
              X (트위터)
            </Button>

            <Button
              onClick={handleFacebookShare}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <span className="text-sm mr-2">f</span>
              페이스북
            </Button>
          </div>

          {/* 링크 복사 */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">또는 링크 복사해서 공유하기</p>
            <div className="flex space-x-2">
              <div className="flex-1 p-2 bg-gray-50 rounded border text-sm text-gray-600 truncate">
                {shareUrl}
              </div>
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className={`${isCopied ? 'bg-green-50 border-green-200 text-green-600' : ''}`}
              >
                <Copy className="w-4 h-4 mr-1" />
                {isCopied ? '복사됨!' : '복사'}
              </Button>
            </div>
          </div>

          {/* 공유 팁 */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-start space-x-2">
              <Star className="w-4 h-4 text-blue-500 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">공유 팁!</p>
                <p>친구들이 당신의 러브트리를 보고 같은 인물에 빠지면 자빠돌이/꼬돌이 점수가 올라가요! 🎯</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}