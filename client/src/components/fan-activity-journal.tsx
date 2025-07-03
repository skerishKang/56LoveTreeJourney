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
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Music, MapPin, Calendar as CalendarIcon, Star, Camera, Users, Coins, Heart, Sparkles } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

interface FanActivity {
  id: number;
  activityType: string;
  title: string;
  artist: string;
  venue: string;
  eventDate: string;
  cost: number;
  companions: string;
  photos: string[];
  review: string;
  rating: number;
  isSpecial: boolean;
  createdAt: string;
}

export default function FanActivityJournal() {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("전체");

  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/fan-activities"],
    enabled: !!user,
  });

  const addActivityMutation = useMutation({
    mutationFn: async (newActivity: any) => {
      const response = await fetch("/api/fan-activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newActivity),
      });
      if (!response.ok) throw new Error("Failed to add activity");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fan-activities"] });
      setIsAddDialogOpen(false);
    },
  });

  const activityTypes = [
    { name: "콘서트", icon: "🎤", color: "bg-purple-100 text-purple-800" },
    { name: "팬사인회", icon: "✍️", color: "bg-pink-100 text-pink-800" },
    { name: "팬미팅", icon: "👋", color: "bg-blue-100 text-blue-800" },
    { name: "성지순례", icon: "📍", color: "bg-green-100 text-green-800" },
    { name: "굿즈샵 방문", icon: "🛍️", color: "bg-amber-50 text-amber-800" },
    { name: "커피차 응원", icon: "☕", color: "bg-orange-100 text-orange-800" },
    { name: "기타", icon: "💝", color: "bg-gray-100 text-gray-800" },
  ];

  const getTypeStyle = (type: string) => {
    const found = activityTypes.find(t => t.name === type);
    return found ? found.color : "bg-gray-100 text-gray-800";
  };

  const getTypeIcon = (type: string) => {
    const found = activityTypes.find(t => t.name === type);
    return found ? found.icon : "🎪";
  };

  const filteredActivities = activities?.filter((activity: FanActivity) => 
    selectedType === "전체" || activity.activityType === selectedType
  ) || [];

  const totalCost = activities?.reduce((sum: number, activity: FanActivity) => sum + (activity.cost || 0), 0) || 0;
  const specialCount = activities?.filter((activity: FanActivity) => activity.isSpecial).length || 0;
  const averageRating = activities?.length > 0 ? 
    activities.reduce((sum: number, activity: FanActivity) => sum + (activity.rating || 0), 0) / activities.length : 0;

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
            🎪 팬 활동 일지
          </h2>
          <p className="text-gray-600 mt-1">특별했던 팬 활동 순간들을 기록해보세요</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-love-pink to-love-dark text-white">
              <Plus className="w-4 h-4 mr-2" />
              활동 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 팬 활동 추가</DialogTitle>
            </DialogHeader>
            <AddActivityForm onSubmit={addActivityMutation.mutate} />
          </DialogContent>
        </Dialog>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50">
          <Music className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <div className="text-2xl font-bold text-purple-600">{activities?.length || 0}</div>
          <div className="text-sm text-gray-600">총 활동</div>
        </Card>
        
        <Card className="text-center p-4 bg-gradient-to-r from-amber-50 to-orange-50">
          <Sparkles className="w-8 h-8 mx-auto mb-2 text-orange-600" />
          <div className="text-2xl font-bold text-orange-600">{specialCount}</div>
          <div className="text-sm text-gray-600">특별한 순간</div>
        </Card>
        
        <Card className="text-center p-4 bg-gradient-to-r from-green-50 to-teal-50">
          <Coins className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-green-600">₩{totalCost.toLocaleString()}</div>
          <div className="text-sm text-gray-600">총 투자 금액</div>
        </Card>
        
        <Card className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <Star className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold text-blue-600">{averageRating.toFixed(1)}</div>
          <div className="text-sm text-gray-600">평균 만족도</div>
        </Card>
      </div>

      {/* 활동 유형 필터 */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedType === "전체" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedType("전체")}
          className={selectedType === "전체" ? "bg-gradient-to-r from-love-pink to-love-dark text-white" : ""}
        >
          전체
        </Button>
        {activityTypes.map(type => (
          <Button
            key={type.name}
            variant={selectedType === type.name ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type.name)}
            className={selectedType === type.name ? "bg-gradient-to-r from-love-pink to-love-dark text-white" : ""}
          >
            <span className="mr-1">{type.icon}</span>
            {type.name}
          </Button>
        ))}
      </div>

      {/* 활동 타임라인 */}
      <div className="space-y-6">
        {filteredActivities.length > 0 ? (
          filteredActivities
            .sort((a: FanActivity, b: FanActivity) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
            .map((activity: FanActivity) => (
            <Card key={activity.id} className={`hover:shadow-lg transition-shadow ${activity.isSpecial ? 'border-amber-300 bg-gradient-to-r from-amber-50/50 to-orange-50/50' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{getTypeIcon(activity.activityType)}</span>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className={getTypeStyle(activity.activityType)}>
                          {activity.activityType}
                        </Badge>
                        {activity.isSpecial && (
                          <Badge className="bg-gradient-to-r from-amber-100 to-orange-500 text-white">
                            ✨ 특별한 순간
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-bold text-xl">{activity.title}</h3>
                      <p className="text-gray-600">{activity.artist}</p>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center space-x-1 mb-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{new Date(activity.eventDate).toLocaleDateString()}</span>
                    </div>
                    {activity.venue && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{activity.venue}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {activity.cost > 0 && (
                    <div className="flex items-center space-x-2">
                      <Coins className="w-4 h-4 text-green-600" />
                      <span className="text-sm">₩{activity.cost.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {activity.companions && (
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{activity.companions}</span>
                    </div>
                  )}
                  
                  {activity.rating > 0 && (
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-amber-600" />
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${star <= activity.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {activity.photos && activity.photos.length > 0 && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Camera className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">사진 {activity.photos.length}장</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {activity.photos.slice(0, 4).map((photo, index) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                          <Camera className="w-6 h-6 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activity.review && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-love-pink/10 to-love-dark/10 rounded-lg border-l-4 border-love-pink">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="w-4 h-4 text-love-pink" />
                      <span className="font-medium text-sm">후기</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{activity.review}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="text-center p-12">
            <Music className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              아직 팬 활동 기록이 없어요
            </h3>
            <p className="text-gray-500 mb-6">
              첫 콘서트나 팬미팅의 소중한 추억을 기록해보세요!
            </p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-love-pink to-love-dark text-white">
                  첫 활동 기록하기
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
    activityType: "",
    title: "",
    artist: "",
    venue: "",
    eventDate: new Date(),
    cost: 0,
    companions: "",
    photos: [] as string[],
    review: "",
    rating: 5,
    isSpecial: false,
  });

  const activityTypes = ["콘서트", "팬사인회", "팬미팅", "성지순례", "굿즈샵 방문", "커피차 응원", "기타"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      eventDate: formData.eventDate.toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          checked={formData.isSpecial}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isSpecial: checked }))}
        />
        <Label>특별한 순간으로 표시</Label>
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
        <Label>아티스트</Label>
        <Input
          value={formData.artist}
          onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
          placeholder="아티스트명을 입력하세요"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>장소</Label>
          <Input
            value={formData.venue}
            onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
            placeholder="장소를 입력하세요"
          />
        </div>
        
        <div>
          <Label>일정</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(formData.eventDate, "yyyy-MM-dd")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.eventDate}
                onSelect={(date) => date && setFormData(prev => ({ ...prev, eventDate: date }))}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>비용</Label>
          <Input
            type="number"
            value={formData.cost}
            onChange={(e) => setFormData(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
            placeholder="0"
            min="0"
          />
        </div>
        
        <div>
          <Label>동행자</Label>
          <Input
            value={formData.companions}
            onChange={(e) => setFormData(prev => ({ ...prev, companions: e.target.value }))}
            placeholder="혼자 또는 동행자명"
          />
        </div>
      </div>

      <div>
        <Label>만족도</Label>
        <div className="flex space-x-2 mt-2">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
              className="focus:outline-none"
            >
              <Star
                className={`w-6 h-6 ${star <= formData.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>후기</Label>
        <Textarea
          value={formData.review}
          onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
          placeholder="이 활동에 대한 소감이나 후기를 자유롭게 적어주세요"
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full bg-gradient-to-r from-love-pink to-love-dark text-white">
        활동 기록하기
      </Button>
    </form>
  );
}