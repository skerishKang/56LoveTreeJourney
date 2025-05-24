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
              onClick={() => handleTagClick(0)}
              variant="ghost"
              className="w-full text-gray-500 hover:bg-gray-100"
            >
              모든 태그 보기
            </Button>
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