import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MessageCircle, Share2, Camera, Video, Music, Hash, X, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PostWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (postData: any) => void;
}

export default function PostWriteModal({ isOpen, onClose, onSubmit }: PostWriteModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("");
  const [activityType, setActivityType] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const { toast } = useToast();

  const platforms = [
    { name: "Instagram", icon: "📷", color: "from-pink-500 to-purple-500" },
    { name: "TikTok", icon: "🎵", color: "from-black to-pink-500" },
    { name: "YouTube", icon: "📺", color: "from-red-500 to-red-600" },
    { name: "Twitter", icon: "🐦", color: "from-blue-400 to-blue-500" },
    { name: "Facebook", icon: "👥", color: "from-blue-600 to-blue-700" },
    { name: "Discord", icon: "💬", color: "from-indigo-500 to-purple-600" }
  ];

  const activityTypes = [
    { name: "게시물", icon: "📝" },
    { name: "댓글", icon: "💬" },
    { name: "좋아요", icon: "❤️" },
    { name: "공유", icon: "🔄" },
    { name: "팔로우", icon: "👥" },
    { name: "스토리", icon: "📸" }
  ];

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!title.trim() || !platform || !activityType) {
      toast({
        title: "입력 오류",
        description: "제목, 플랫폼, 활동 유형을 모두 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    const postData = {
      title: title.trim(),
      content: content.trim(),
      platform,
      activityType,
      tags,
      likeCount: Math.floor(Math.random() * 100),
      commentCount: Math.floor(Math.random() * 20),
      isPopular: tags.includes("핫토픽") || Math.random() > 0.7
    };

    onSubmit?.(postData);
    
    // 폼 초기화
    setTitle("");
    setContent("");
    setPlatform("");
    setActivityType("");
    setTags([]);
    setCurrentTag("");
    
    toast({
      title: "게시물 작성 완료! ✨",
      description: "커뮤니티에 새로운 활동이 추가되었어요!",
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span>새 게시물 작성</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 제목 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">제목</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시물 제목을 입력하세요..."
              className="w-full"
            />
          </div>

          {/* 플랫폼 선택 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">플랫폼</label>
            <div className="grid grid-cols-3 gap-2">
              {platforms.map((p) => (
                <Card 
                  key={p.name}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    platform === p.name 
                      ? 'ring-2 ring-purple-500 bg-gradient-to-r ' + p.color + ' text-white' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setPlatform(p.name)}
                >
                  <CardContent className="p-3 text-center">
                    <div className="text-lg mb-1">{p.icon}</div>
                    <div className="text-xs font-medium">{p.name}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 활동 유형 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">활동 유형</label>
            <div className="grid grid-cols-3 gap-2">
              {activityTypes.map((type) => (
                <Card 
                  key={type.name}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    activityType === type.name 
                      ? 'ring-2 ring-purple-500 bg-purple-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setActivityType(type.name)}
                >
                  <CardContent className="p-3 text-center">
                    <div className="text-lg mb-1">{type.icon}</div>
                    <div className="text-xs font-medium">{type.name}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 내용 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">내용 (선택사항)</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="게시물 내용을 입력하세요..."
              rows={3}
            />
          </div>

          {/* 태그 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">태그</label>
            <div className="flex space-x-2 mb-3">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="태그 입력..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button onClick={addTag} size="sm" variant="outline">
                <Hash className="w-4 h-4" />
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline"
                    className="flex items-center space-x-1 bg-purple-50 text-purple-700"
                  >
                    <span>#{tag}</span>
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              💡 #핫토픽 태그를 추가하면 실시간 피드에 노출됩니다!
            </p>
          </div>

          {/* 미리보기 */}
          {title && platform && activityType && (
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>미리보기</span>
                </h4>
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <span>{platforms.find(p => p.name === platform)?.icon}</span>
                    <Badge variant="outline" className="text-xs">{platform}</Badge>
                    <Badge variant="outline" className="text-xs">{activityType}</Badge>
                  </div>
                  <h5 className="font-medium text-sm">{title}</h5>
                  {content && <p className="text-xs text-gray-600 mt-1">{content}</p>}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 액션 버튼 */}
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              취소
            </Button>
            <Button 
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              게시하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}