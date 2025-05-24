import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MessageCircle, Heart, TrendingUp, Plus, ExternalLink, Calendar, Users } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

interface CommunityActivity {
  id: number;
  platform: string;
  activityType: string;
  title: string;
  url?: string;
  content?: string;
  likeCount: number;
  commentCount: number;
  isPopular: boolean;
  createdAt: string;
}

export default function CommunityTracker() {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/community-activities"],
    enabled: !!user,
  });

  const addActivityMutation = useMutation({
    mutationFn: async (newActivity: any) => {
      const response = await fetch("/api/community-activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newActivity),
      });
      if (!response.ok) throw new Error("Failed to add activity");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community-activities"] });
      setIsAddDialogOpen(false);
    },
  });

  const platforms = [
    { name: "더쿠", icon: "💬", color: "bg-pink-100 text-pink-800" },
    { name: "여시", icon: "👭", color: "bg-purple-100 text-purple-800" },
    { name: "디시인사이드", icon: "🎮", color: "bg-blue-100 text-blue-800" },
    { name: "인벤", icon: "⚔️", color: "bg-green-100 text-green-800" },
    { name: "네이트 판", icon: "📰", color: "bg-orange-100 text-orange-800" },
    { name: "루리웹", icon: "🎯", color: "bg-red-100 text-red-800" },
  ];

  const activityTypes = [
    { name: "게시글", icon: "📝" },
    { name: "댓글", icon: "💬" },
    { name: "좋아요", icon: "❤️" },
    { name: "공유", icon: "🔄" },
  ];

  const getPlatformStyle = (platform: string) => {
    const found = platforms.find(p => p.name === platform);
    return found ? found.color : "bg-gray-100 text-gray-800";
  };

  const getPlatformIcon = (platform: string) => {
    const found = platforms.find(p => p.name === platform);
    return found ? found.icon : "💭";
  };

  const getActivityIcon = (activityType: string) => {
    const found = activityTypes.find(a => a.name === activityType);
    return found ? found.icon : "📱";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-love-pink to-love-dark bg-clip-text text-transparent">
            💬 커뮤니티 활동 트래커
          </h2>
          <p className="text-gray-600 mt-1">입덕 후 커뮤니티에서의 활동을 기록해보세요</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-love-pink to-love-dark text-white">
              <Plus className="w-4 h-4 mr-2" />
              활동 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>새 커뮤니티 활동 추가</DialogTitle>
            </DialogHeader>
            <AddActivityForm onSubmit={addActivityMutation.mutate} />
          </DialogContent>
        </Dialog>
      </div>

      {/* 플랫폼별 요약 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {platforms.map(platform => {
          const platformActivities = activities?.filter((a: CommunityActivity) => a.platform === platform.name) || [];
          const totalEngagement = platformActivities.reduce((sum: number, a: CommunityActivity) => sum + a.likeCount + a.commentCount, 0);
          
          return (
            <Card key={platform.name} className="text-center p-4 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-2">{platform.icon}</div>
              <div className="font-semibold text-sm">{platform.name}</div>
              <div className="text-xs text-gray-600 mt-1">
                {platformActivities.length}개 활동
              </div>
              <div className="text-xs text-gray-500">
                💖 {totalEngagement} 반응
              </div>
            </Card>
          );
        })}
      </div>

      {/* 활동 목록 */}
      <div className="space-y-4">
        {activities && activities.length > 0 ? (
          activities.map((activity: CommunityActivity) => (
            <Card key={activity.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{getPlatformIcon(activity.platform)}</span>
                      <Badge className={getPlatformStyle(activity.platform)}>
                        {activity.platform}
                      </Badge>
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <span>{getActivityIcon(activity.activityType)}</span>
                        <span>{activity.activityType}</span>
                      </Badge>
                      {activity.isPopular && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                          🔥 인기글
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{activity.title}</h3>
                    
                    {activity.content && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {activity.content}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span>{activity.likeCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4 text-blue-400" />
                        <span>{activity.commentCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(activity.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {activity.url && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={activity.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="text-center p-12">
            <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              아직 커뮤니티 활동이 없어요
            </h3>
            <p className="text-gray-500 mb-6">
              입덕 후 처음 참여한 커뮤니티 활동을 기록해보세요!
            </p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-love-pink to-love-dark text-white">
                  첫 활동 추가하기
                </Button>
              </DialogTrigger>
            </Dialog>
          </Card>
        )}
      </div>
    </div>
  );
}

// 활동 추가 폼 컴포넌트
function AddActivityForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    platform: "",
    activityType: "",
    title: "",
    url: "",
    content: "",
    likeCount: 0,
    commentCount: 0,
    isPopular: false,
  });

  const platforms = ["더쿠", "여시", "디시인사이드", "인벤", "네이트 판", "루리웹"];
  const activityTypes = ["게시글", "댓글", "좋아요", "공유"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>플랫폼</Label>
          <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="플랫폼 선택" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map(platform => (
                <SelectItem key={platform} value={platform}>{platform}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>활동 유형</Label>
          <Select value={formData.activityType} onValueChange={(value) => setFormData(prev => ({ ...prev, activityType: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="활동 유형 선택" />
            </SelectTrigger>
            <SelectContent>
              {activityTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>제목</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="활동 제목을 입력하세요"
          required
        />
      </div>

      <div>
        <Label>URL (선택사항)</Label>
        <Input
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          placeholder="링크가 있다면 입력하세요"
        />
      </div>

      <div>
        <Label>내용 (선택사항)</Label>
        <Textarea
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="활동 내용을 간단히 설명해주세요"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>좋아요 수</Label>
          <Input
            type="number"
            value={formData.likeCount}
            onChange={(e) => setFormData(prev => ({ ...prev, likeCount: parseInt(e.target.value) || 0 }))}
            min="0"
          />
        </div>
        
        <div>
          <Label>댓글 수</Label>
          <Input
            type="number"
            value={formData.commentCount}
            onChange={(e) => setFormData(prev => ({ ...prev, commentCount: parseInt(e.target.value) || 0 }))}
            min="0"
          />
        </div>
      </div>

      <Button type="submit" className="w-full bg-gradient-to-r from-love-pink to-love-dark text-white">
        활동 추가하기
      </Button>
    </form>
  );
}