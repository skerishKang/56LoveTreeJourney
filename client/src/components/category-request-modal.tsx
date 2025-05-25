import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Send, Lightbulb, Heart } from "lucide-react";

interface CategoryRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryRequestModal({ isOpen, onClose }: CategoryRequestModalProps) {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      toast({
        title: "카테고리명을 입력해주세요",
        description: "새로운 카테고리의 이름이 필요해요!",
        variant: "destructive",
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "설명을 입력해주세요",
        description: "카테고리에 대한 간단한 설명이 필요해요!",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // API 호출 (실제 구현 시 추가)
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 로딩

      toast({
        title: "카테고리 요청 완료! 🎉",
        description: "검토 후 빠른 시일 내에 추가해드릴게요!",
      });

      // 폼 초기화
      setCategoryName("");
      setDescription("");
      setReason("");
      onClose();
    } catch (error) {
      toast({
        title: "요청 실패",
        description: "다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestedCategories = [
    "웹툰/만화", "게임", "스포츠", "요리/푸드", "여행", "패션/뷰티", 
    "반려동물", "자동차", "기술/IT", "건강/피트니스", "독서/문학", "미술/디자인"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-blue-500" />
            <span>새 카테고리 요청</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 카테고리명 */}
          <div>
            <Label htmlFor="categoryName" className="text-sm font-medium">
              카테고리명 *
            </Label>
            <Input
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="예: 웹툰/만화"
              className="mt-1"
            />
          </div>

          {/* 설명 */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              카테고리 설명 *
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="이 카테고리가 어떤 콘텐츠를 다루는지 설명해주세요"
              className="mt-1 min-h-[80px]"
            />
          </div>

          {/* 요청 이유 */}
          <div>
            <Label htmlFor="reason" className="text-sm font-medium">
              요청 이유 (선택)
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="왜 이 카테고리가 필요한지 알려주세요"
              className="mt-1 min-h-[60px]"
            />
          </div>

          {/* 추천 카테고리 */}
          <div>
            <Label className="text-sm font-medium flex items-center space-x-1">
              <Lightbulb className="w-4 h-4" />
              <span>추천 카테고리</span>
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {suggestedCategories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  onClick={() => setCategoryName(category)}
                  className="text-xs h-7"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-start space-x-2">
              <Heart className="w-4 h-4 text-blue-500 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">카테고리 추가 기준</p>
                <ul className="text-xs space-y-1">
                  <li>• 많은 사용자가 관심 있어할 분야</li>
                  <li>• 러브트리로 표현하기 적합한 콘텐츠</li>
                  <li>• 기존 카테고리와 중복되지 않는 영역</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? "요청 중..." : "요청하기"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}