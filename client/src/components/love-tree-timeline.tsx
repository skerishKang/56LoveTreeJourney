import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Heart, MessageCircle, ArrowRight, Youtube, Instagram, Music, Plus, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface LoveTreeTimelineProps {
  loveTreeId: number;
}

export default function LoveTreeTimeline({ loveTreeId }: LoveTreeTimelineProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ["/api/love-trees", loveTreeId, "items"],
    queryFn: () => api.getLoveTreeItems(loveTreeId),
  });

  const toggleLike = useMutation({
    mutationFn: (itemId: number) => api.toggleLike(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/love-trees", loveTreeId, "items"] });
      toast({
        title: "좋아요 완료! 💕",
        description: "이 순간에 하트를 남겼습니다.",
      });
    },
    onError: () => {
      toast({
        title: "오류",
        description: "좋아요 처리에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "youtube":
        return <Youtube className="w-5 h-5 text-red-500" />;
      case "instagram":
        return <Instagram className="w-5 h-5 text-pink-500" />;
      case "tiktok":
        return <Music className="w-5 h-5 text-black" />;
      default:
        return <Youtube className="w-5 h-5 text-red-500" />;
    }
  };

  const getStageColor = (stageName: string) => {
    switch (stageName) {
      case "썸":
        return "bg-love-pink/20 text-love-pink";
      case "폴인럽":
        return "bg-tree-green/20 text-tree-green";
      case "완성":
        return "bg-sparkle-gold/20 text-sparkle-gold";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">나의 러브트리 타임라인 🌳</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-20 bg-gray-200 rounded-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (!items || items.length === 0) {
    return (
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">나의 러브트리 타임라인 🌳</h3>
          <Button className="bg-love-pink text-white px-3 py-1 rounded-full text-sm font-medium">
            <Plus className="w-4 h-4 mr-1" />
            추가
          </Button>
        </div>
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">아직 기록된 순간이 없어요</p>
            <Button className="bg-love-pink hover:bg-love-pink/90">
              첫 번째 순간 기록하기
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">나의 러브트리 타임라인 🌳</h3>
        <Button className="bg-love-pink text-white px-3 py-1 rounded-full text-sm font-medium">
          <Plus className="w-4 h-4 mr-1" />
          추가
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item: any) => (
          <Card key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-grow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-tree-green/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  {getPlatformIcon(item.platform)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs font-medium ${getStageColor(item.stage?.name || "")}`}
                      >
                        {item.isFirstContent ? "첫 영상" : item.stage?.name || "기타"}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {item.createdAt ? 
                          formatDistanceToNow(new Date(item.createdAt), { 
                            addSuffix: true, 
                            locale: ko 
                          }) : 
                          "방금 전"
                        }
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 p-1">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <h4 className="font-medium text-gray-800 mb-1">
                    {item.title}
                  </h4>
                  
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {item.description}
                    </p>
                  )}
                  
                  {/* Content Preview */}
                  {item.contentUrl && (
                    <div className="relative rounded-xl overflow-hidden mb-3">
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-32 object-cover"
                          onError={(e) => {
                            // Fallback to a default image if thumbnail fails
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=300&fit=crop";
                          }}
                        />
                      ) : (
                        <div className="w-full h-32 bg-gradient-to-br from-love-pink/20 to-tree-green/20 flex items-center justify-center">
                          {getPlatformIcon(item.platform)}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          {getPlatformIcon(item.platform)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Interaction buttons */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike.mutate(item.id)}
                      disabled={toggleLike.isPending}
                      className="flex items-center space-x-1 hover:text-love-pink transition-colors p-0"
                    >
                      <Heart className="w-4 h-4" />
                      <span>{item.likeCount || 0}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-1 hover:text-tree-green transition-colors p-0"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{item.commentCount || 0}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-1 hover:text-sparkle-gold transition-colors p-0"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>다음 추천</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Load more button */}
        <div className="text-center pt-4">
          <Button variant="ghost" className="text-tree-green font-medium text-sm">
            더 많은 타임라인 보기
          </Button>
        </div>
      </div>
    </section>
  );
}
