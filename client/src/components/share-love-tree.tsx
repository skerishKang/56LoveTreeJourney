import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Share2, Copy, MessageCircle, Heart, Link } from "lucide-react";
import { SiX, SiFacebook, SiInstagram } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { LoveTree } from "@shared/schema";

interface ShareLoveTreeProps {
  loveTree: LoveTree;
  trigger?: React.ReactNode;
}

export default function ShareLoveTree({ loveTree, trigger }: ShareLoveTreeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const shareUrl = `${window.location.origin}/share/${loveTree.id}`;
  const shareText = `나의 ${loveTree.targetPerson || '최애'} 입덕 과정을 러브트리로 만들어봤어요! 🌳💕`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "링크 복사 완료!",
        description: "러브트리 링크가 클립보드에 복사되었어요",
      });
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "링크 복사에 실패했어요. 다시 시도해주세요",
        variant: "destructive",
      });
    }
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareToKakao = () => {
    // KakaoTalk 공유 API 연동 (실제 구현시 KakaoTalk SDK 필요)
    toast({
      title: "카카오톡 공유",
      description: "카카오톡 공유 기능은 준비 중이에요!",
    });
  };

  const shareToInstagram = () => {
    // Instagram은 직접 공유 URL이 없어서 클립보드 복사
    copyToClipboard();
    toast({
      title: "인스타그램 공유",
      description: "링크가 복사되었어요! 인스타그램에 붙여넣기 해주세요",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/90 hover:bg-white border-love-pink/30 text-love-pink hover:text-love-pink"
          >
            <Share2 className="w-4 h-4 mr-2" />
            공유하기
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-soft-pink/95 backdrop-blur-sm border-love-pink/20">
        <DialogHeader>
          <DialogTitle className="text-center text-gray-800 flex items-center justify-center space-x-2">
            <Heart className="w-5 h-5 text-love-pink" />
            <span>러브트리 공유하기</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 러브트리 정보 */}
          <div className="text-center p-4 bg-white/80 rounded-2xl">
            <h3 className="font-semibold text-gray-800 mb-1">{loveTree.title}</h3>
            <p className="text-sm text-gray-600">
              {loveTree.targetPerson && `${loveTree.targetPerson}에 대한 `}입덕 과정을 공유해보세요!
            </p>
          </div>

          {/* 소셜 미디어 버튼들 */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 text-center">소셜 미디어로 공유하기</p>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={shareToTwitter}
                className="bg-black hover:bg-gray-800 text-white"
              >
                <SiX className="w-4 h-4 mr-2" />
                X (트위터)
              </Button>
              
              <Button
                onClick={shareToFacebook}
                className="bg-[#4267B2] hover:bg-[#365899] text-white"
              >
                <SiFacebook className="w-4 h-4 mr-2" />
                페이스북
              </Button>
              
              <Button
                onClick={shareToKakao}
                className="bg-[#FEE500] hover:bg-[#e6ce00] text-black"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                카카오톡
              </Button>
              
              <Button
                onClick={shareToInstagram}
                className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white"
              >
                <SiInstagram className="w-4 h-4 mr-2" />
                인스타그램
              </Button>
            </div>
          </div>

          {/* 링크 복사 */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 text-center">링크 복사하기</p>
            
            <div className="flex space-x-2">
              <div className="flex-1 p-3 bg-white/80 rounded-xl text-sm text-gray-600 font-mono truncate">
                {shareUrl}
              </div>
              <Button
                onClick={copyToClipboard}
                className="bg-tree-green hover:bg-tree-green/90 text-white"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 공유 효과 설명 */}
          <div className="text-center p-3 bg-sparkle-gold/10 rounded-xl">
            <p className="text-xs text-gray-600">
              💡 공유하면 전도사 포인트를 획득할 수 있어요!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}