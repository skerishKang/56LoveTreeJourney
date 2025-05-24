import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sprout, Heart, Plus, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NewSeedAlert() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);
  const [recommendForm, setRecommendForm] = useState({
    title: "",
    contentUrl: "",
    platform: "YouTube",
    description: ""
  });

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
    queryFn: () => api.getNotifications(3),
  });

  const addRecommendation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/items/${data.itemId}/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to add recommendation");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "추천 영상 등록 완료! ✨",
        description: "새싹에게 다음 영상을 추천했어요!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      setIsRecommendOpen(false);
      setRecommendForm({ title: "", contentUrl: "", platform: "YouTube", description: "" });
    },
  });

  const newSeedlingNotifications = notifications?.filter((n: any) => 
    n.type === 'new_seedling' && !n.isRead
  ) || [];

  if (newSeedlingNotifications.length === 0) {
    return null;
  }

  const notification = newSeedlingNotifications[0];

  const handleRecommendSubmit = () => {
    if (!recommendForm.title || !recommendForm.contentUrl) {
      toast({
        title: "입력 정보를 확인해주세요",
        description: "제목과 영상 URL을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    addRecommendation.mutate({
      itemId: notification.relatedItemId,
      ...recommendForm,
    });
  };

  return (
    <section className="px-4 py-2">
      <Card className="bg-gradient-to-r from-sparkle-gold/20 to-tree-green/20 border border-sparkle-gold/30 animate-pulse">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sparkle-gold rounded-full flex items-center justify-center animate-bounce">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 flex items-center">
                🌱 새싹이 첫 영상을 올렸어요! 
                <Sparkles className="w-4 h-4 ml-1 text-sparkle-gold animate-spin" />
              </p>
              <p className="text-xs text-gray-600">
                {notification.message}
              </p>
              <p className="text-xs text-sparkle-gold font-medium mt-1">
                💡 다음 영상을 추천해서 가드너 포인트를 획득하세요!
              </p>
            </div>
            
            <Dialog open={isRecommendOpen} onOpenChange={setIsRecommendOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-sparkle-gold to-tree-green hover:opacity-90 text-white shadow-xl border-none animate-pulse"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  추천하기
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-sparkle-gold" />
                    <span>새싹에게 다음 영상 추천하기</span>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">영상 제목</Label>
                    <Input
                      id="title"
                      value={recommendForm.title}
                      onChange={(e) => setRecommendForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="추천할 영상의 제목을 입력하세요"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contentUrl">영상 URL</Label>
                    <Input
                      id="contentUrl"
                      value={recommendForm.contentUrl}
                      onChange={(e) => setRecommendForm(prev => ({ ...prev, contentUrl: e.target.value }))}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">추천 이유</Label>
                    <Textarea
                      id="description"
                      value={recommendForm.description}
                      onChange={(e) => setRecommendForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="왜 이 영상을 추천하는지 설명해주세요"
                      rows={3}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleRecommendSubmit}
                    disabled={addRecommendation.isPending}
                    className="w-full bg-gradient-to-r from-sparkle-gold to-tree-green hover:opacity-90"
                  >
                    {addRecommendation.isPending ? "추천 중..." : "✨ 추천 영상 등록"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
