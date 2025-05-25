import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tag, Filter, Heart, Sparkles, Music, Crown } from "lucide-react";
import { api } from "@/lib/api";

interface TagFilterProps {
  onTagSelect: (tagId: number | null) => void;
  selectedTag: number | null;
}

export default function TagFilter({ onTagSelect, selectedTag }: TagFilterProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showAllTagsModal, setShowAllTagsModal] = useState(false);

  const { data: tags } = useQuery({
    queryKey: ["/api/tags"],
  });

  const getTagIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("귀여움")) return <Heart className="w-3 h-3" />;
    if (lowerName.includes("섹시함")) return <Sparkles className="w-3 h-3" />;
    if (lowerName.includes("댄스")) return <Music className="w-3 h-3" />;
    if (lowerName.includes("보컬")) return <Crown className="w-3 h-3" />;
    return <Tag className="w-3 h-3" />;
  };

  const handleTagClick = (tagId: number) => {
    onTagSelect(selectedTag === tagId ? null : tagId);
    setIsDialogOpen(false);
  };

  const selectedTagData = tags?.find((tag: any) => tag.id === selectedTag);

  return (
    <div className="flex items-center space-x-2">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/90 hover:bg-white border-love-pink/30 text-gray-700"
          >
            <Filter className="w-4 h-4 mr-2" />
            태그 필터
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md bg-soft-pink/95 backdrop-blur-sm border-love-pink/20">
          <DialogHeader>
            <DialogTitle className="text-center text-gray-800 flex items-center justify-center space-x-2">
              <Tag className="w-5 h-5 text-love-pink" />
              <span>태그별 러브트리 만들기</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              같은 태그의 영상들만 모아서 특별한 러브트리를 완성해보세요!
            </p>

            <div className="grid grid-cols-2 gap-3">
              {tags?.map((tag: any) => (
                <Button
                  key={tag.id}
                  onClick={() => handleTagClick(tag.id)}
                  variant={selectedTag === tag.id ? "default" : "outline"}
                  className={`p-3 h-auto flex flex-col items-center space-y-2 ${
                    selectedTag === tag.id 
                      ? "bg-gradient-to-r from-love-pink to-love-dark text-white" 
                      : "hover:bg-love-pink/10"
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    {getTagIcon(tag.name)}
                    <span className="text-sm font-medium">{tag.name}</span>
                  </div>
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white/50"
                    style={{ backgroundColor: tag.color }}
                  />
                </Button>
              ))}
            </div>

            <Button
              onClick={() => setShowAllTagsModal(true)}
              variant="ghost"
              className="w-full text-gray-500 hover:bg-gray-100"
            >
              모든 태그 보기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 모든 태그 보기 모달 */}
      <Dialog open={showAllTagsModal} onOpenChange={setShowAllTagsModal}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto bg-soft-pink/95 backdrop-blur-sm border-love-pink/20">
          <DialogHeader>
            <DialogTitle className="text-center text-gray-800 flex items-center justify-center space-x-2">
              <Tag className="w-5 h-5 text-love-pink" />
              <span>모든 태그 컬렉션</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* 인기 태그 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                <span>🔥 인기 태그</span>
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {tags?.slice(0, 6).map((tag: any) => (
                  <Button
                    key={tag.id}
                    onClick={() => handleTagClick(tag.id)}
                    variant={selectedTag === tag.id ? "default" : "outline"}
                    size="sm"
                    className={`p-2 h-auto flex flex-col items-center space-y-1 ${
                      selectedTag === tag.id 
                        ? "bg-gradient-to-r from-love-pink to-love-dark text-white" 
                        : "hover:bg-love-pink/10"
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      {getTagIcon(tag.name)}
                      <span className="text-xs font-medium">{tag.name}</span>
                    </div>
                    <div 
                      className="w-3 h-3 rounded-full border border-white/50"
                      style={{ backgroundColor: tag.color }}
                    />
                  </Button>
                ))}
              </div>
            </div>

            {/* 감정 태그 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                <span>💕 감정 태그</span>
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {['귀여움', '섹시함', '청순함', '시크함', '발랄함', '우아함', '매력적', '사랑스러움'].map((emotion, index) => (
                  <Button
                    key={emotion}
                    onClick={() => handleTagClick(100 + index)}
                    variant="outline"
                    size="sm"
                    className="p-2 text-xs hover:bg-pink-50"
                  >
                    {emotion}
                  </Button>
                ))}
              </div>
            </div>

            {/* 장르 태그 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                <span>🎵 장르 태그</span>
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {['댄스', '보컬', '랩', '밴드', '발라드', '록', '팝', 'R&B'].map((genre, index) => (
                  <Button
                    key={genre}
                    onClick={() => handleTagClick(200 + index)}
                    variant="outline"
                    size="sm"
                    className="p-2 text-xs hover:bg-blue-50"
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </div>

            {/* 활동 태그 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                <span>⭐ 활동 태그</span>
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {['드라마', '예능', '뮤비', '라이브', '인터뷰', '팬미팅', '콘서트', '브이로그'].map((activity, index) => (
                  <Button
                    key={activity}
                    onClick={() => handleTagClick(300 + index)}
                    variant="outline"
                    size="sm"
                    className="p-2 text-xs hover:bg-purple-50"
                  >
                    {activity}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 선택된 태그 표시 */}
      {selectedTagData && (
        <Badge 
          className="bg-gradient-to-r from-love-pink to-love-dark text-white"
          style={{ borderColor: selectedTagData.color }}
        >
          <div className="flex items-center space-x-1">
            {getTagIcon(selectedTagData.name)}
            <span>#{selectedTagData.name}</span>
          </div>
        </Badge>
      )}
    </div>
  );
}