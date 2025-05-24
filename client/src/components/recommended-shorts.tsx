import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, Heart, MessageSquare, Plus, Star, Crown, User, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface ShortsVideo {
  id: number;
  title: string;
  thumbnail: string;
  url: string;
  artist: string;
  category: string;
  uploaderId: string;
  uploader: {
    id: string;
    firstName: string | null;
    profileImageUrl: string | null;
    propagatorRank: string | null;
  };
  recommendations: number;
  avgRating: number;
  stage: string;
  isPopular: boolean;
  createdAt: string;
}

export default function RecommendedShorts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newShort, setNewShort] = useState({
    title: "",
    url: "",
    artist: "",
    category: "K-pop",
    stage: "썸",
    review: "",
    rating: 5
  });

  const categories = ["전체", "K-pop", "드라마", "애니메이션", "게임", "요리", "댄스"];

  const { data: shorts, isLoading } = useQuery({
    queryKey: ["/api/shorts", selectedCategory],
    queryFn: async () => {
      const params = selectedCategory !== "전체" ? `?category=${selectedCategory}` : "";
      const response = await fetch(`/api/shorts${params}`);
      if (!response.ok) throw new Error('Failed to fetch shorts');
      return response.json();
    },
  });

  const addShort = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/shorts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to add short");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "쇼츠 영상이 등록되었어요! 🎬",
        description: "다른 가드너들이 추천을 남길 수 있어요!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/shorts"] });
      setIsAddOpen(false);
      setNewShort({ title: "", url: "", artist: "", category: "K-pop", stage: "썸", review: "", rating: 5 });
    },
  });

  const recommendShort = useMutation({
    mutationFn: async ({ shortId, review, rating }: { shortId: number; review: string; rating: number }) => {
      const response = await fetch(`/api/shorts/${shortId}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, rating }),
      });
      if (!response.ok) throw new Error("Failed to recommend short");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "추천 완료! ⭐",
        description: "다른 가드너들에게 도움이 될 거예요!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/shorts"] });
    },
  });

  const handleAddShort = () => {
    if (!newShort.title || !newShort.url || !newShort.artist) {
      toast({
        title: "필수 정보를 입력해주세요",
        description: "제목, URL, 아티스트를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    addShort.mutate(newShort);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "썸": return "bg-pink-100 text-pink-700 border-pink-300";
      case "폴인럽": return "bg-red-100 text-red-700 border-red-300";
      case "최애": return "bg-purple-100 text-purple-700 border-purple-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getRankIcon = (rank: string | null) => {
    switch (rank) {
      case "레전드 가드너": return <Crown className="w-4 h-4 text-gold-500" />;
      case "마스터 가드너": return <Crown className="w-4 h-4 text-purple-500" />;
      case "정원사": return <Star className="w-4 h-4 text-blue-500" />;
      default: return <User className="w-4 h-4 text-green-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">추천 쇼츠 영상 🎬</h2>
          <p className="text-gray-600 mt-1">가드너들이 추천하는 입덕 영상을 확인해보세요!</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-love-pink to-love-dark text-white">
              <Plus className="w-4 h-4 mr-2" />
              영상 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>새 쇼츠 영상 추가</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">제목</label>
                <Input
                  value={newShort.title}
                  onChange={(e) => setNewShort(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="영상 제목"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">URL</label>
                <Input
                  value={newShort.url}
                  onChange={(e) => setNewShort(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://youtube.com/shorts/..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">아티스트</label>
                  <Input
                    value={newShort.artist}
                    onChange={(e) => setNewShort(prev => ({ ...prev, artist: e.target.value }))}
                    placeholder="정국, 필릭스..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">카테고리</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={newShort.category}
                    onChange={(e) => setNewShort(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">입덕 단계</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={newShort.stage}
                  onChange={(e) => setNewShort(prev => ({ ...prev, stage: e.target.value }))}
                >
                  <option value="썸">썸 (1-100)</option>
                  <option value="폴인럽">폴인럽 (101-300)</option>
                  <option value="최애">최애 (301+)</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">한줄평</label>
                <Textarea
                  value={newShort.review}
                  onChange={(e) => setNewShort(prev => ({ ...prev, review: e.target.value }))}
                  placeholder="이 영상의 매력을 한줄로 표현해보세요"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">평점</label>
                <div className="flex space-x-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewShort(prev => ({ ...prev, rating: star }))}
                      className={`text-2xl ${star <= newShort.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handleAddShort}
                disabled={addShort.isPending}
                className="w-full bg-gradient-to-r from-love-pink to-love-dark"
              >
                {addShort.isPending ? "등록 중..." : "영상 등록"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? 
              "bg-love-pink text-white" : 
              "text-gray-600 hover:text-love-pink"
            }
          >
            {category}
          </Button>
        ))}
      </div>

      {/* 쇼츠 영상 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shorts?.map((short: ShortsVideo) => (
          <Card key={short.id} className="group hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-love-pink/50">
            <div className="relative">
              {/* 썸네일 */}
              <div className="aspect-[9/16] bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-4">
                    <Play className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                    <p className="text-sm font-medium text-gray-700">{short.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{short.artist}</p>
                  </div>
                </div>
                
                {/* 재생 버튼 오버레이 */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                </div>
                
                {/* 인기 배지 */}
                {short.isPopular && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-red-500 text-white">🔥 HOT</Badge>
                  </div>
                )}
                
                {/* 입덕 단계 */}
                <div className="absolute top-3 right-3">
                  <Badge variant="outline" className={getStageColor(short.stage)}>
                    {short.stage}
                  </Badge>
                </div>
              </div>
            </div>
            
            <CardContent className="p-4 space-y-3">
              {/* 업로더 정보 */}
              <div className="flex items-center space-x-3">
                <Link href={`/gardener/${short.uploader.id}`} className="flex items-center space-x-2 hover:text-love-pink transition-colors">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={short.uploader.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-love-pink/10 text-love-pink text-xs">
                      {getRankIcon(short.uploader.propagatorRank)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {short.uploader.firstName || "익명의 가드너"}
                  </span>
                </Link>
                
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Eye className="w-3 h-3" />
                  <span>{short.recommendations}명 추천</span>
                </div>
              </div>
              
              {/* 평점 */}
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={`text-lg ${i < Math.floor(short.avgRating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">({short.avgRating.toFixed(1)})</span>
              </div>
              
              {/* 액션 버튼 */}
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1 text-love-pink border-love-pink hover:bg-love-pink hover:text-white"
                  onClick={() => window.open(short.url, '_blank')}
                >
                  <Play className="w-4 h-4 mr-1" />
                  시청하기
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-tree-green border-tree-green hover:bg-tree-green hover:text-white">
                      <Heart className="w-4 h-4 mr-1" />
                      추천
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>영상 추천하기</DialogTitle>
                    </DialogHeader>
                    <RecommendForm 
                      shortId={short.id} 
                      onRecommend={(review, rating) => recommendShort.mutate({ shortId: short.id, review, rating })}
                      isPending={recommendShort.isPending}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {shorts?.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Play className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">아직 등록된 쇼츠 영상이 없어요</p>
          <p className="text-sm mt-1">첫 번째 영상을 추가해보세요!</p>
        </div>
      )}
    </div>
  );
}

function RecommendForm({ shortId, onRecommend, isPending }: { shortId: number; onRecommend: (review: string, rating: number) => void; isPending: boolean }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = () => {
    if (!review.trim()) return;
    onRecommend(review, rating);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">한줄평</label>
        <Textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="이 영상을 다른 가드너들에게 추천하는 이유를 알려주세요"
          rows={3}
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">평점</label>
        <div className="flex space-x-1 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ⭐
            </button>
          ))}
        </div>
      </div>
      
      <Button 
        onClick={handleSubmit}
        disabled={isPending || !review.trim()}
        className="w-full bg-gradient-to-r from-tree-green to-love-pink"
      >
        {isPending ? "추천 중..." : "추천 완료"}
      </Button>
    </div>
  );
}