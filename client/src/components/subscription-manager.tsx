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
import { Plus, Smartphone, Calendar as CalendarIcon, DollarSign, Star, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { format, differenceInDays, addDays, addMonths, addYears } from "date-fns";

interface Subscription {
  id: number;
  platform: string;
  artist: string;
  subscriptionType: string;
  startDate: string;
  endDate: string;
  monthlyFee: number;
  isActive: boolean;
  notes: string;
  createdAt: string;
}

export default function SubscriptionManager() {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("전체");

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["/api/subscriptions"],
    enabled: !!user,
  });

  const addSubscriptionMutation = useMutation({
    mutationFn: async (newSubscription: any) => {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSubscription),
      });
      if (!response.ok) throw new Error("Failed to add subscription");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
      setIsAddDialogOpen(false);
    },
  });

  const toggleSubscriptionMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) throw new Error("Failed to update subscription");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
    },
  });

  const platforms = [
    { name: "버블", icon: "💬", color: "bg-pink-100 text-pink-800", description: "아티스트와 직접 소통" },
    { name: "위버스", icon: "🌟", color: "bg-purple-100 text-purple-800", description: "글로벌 팬 플랫폼" },
    { name: "팬클럽", icon: "💝", color: "bg-red-100 text-red-800", description: "공식 팬클럽" },
    { name: "유니버스", icon: "🌌", color: "bg-blue-100 text-blue-800", description: "팬 소통 앱" },
    { name: "V LIVE+", icon: "📹", color: "bg-green-100 text-green-800", description: "프리미엄 콘텐츠" },
  ];

  const getPlatformStyle = (platform: string) => {
    const found = platforms.find(p => p.name === platform);
    return found ? found.color : "bg-gray-100 text-gray-800";
  };

  const getPlatformIcon = (platform: string) => {
    const found = platforms.find(p => p.name === platform);
    return found ? found.icon : "📱";
  };

  const getSubscriptionStatus = (subscription: Subscription) => {
    if (!subscription.isActive) return { status: "중단", color: "text-gray-500", bgColor: "bg-gray-100" };
    
    const today = new Date();
    const endDate = new Date(subscription.endDate);
    const daysLeft = differenceInDays(endDate, today);
    
    if (daysLeft < 0) return { status: "만료", color: "text-red-600", bgColor: "bg-red-100" };
    if (daysLeft <= 7) return { status: "곧 만료", color: "text-orange-600", bgColor: "bg-orange-100" };
    return { status: "활성", color: "text-green-600", bgColor: "bg-green-100" };
  };

  const filteredSubscriptions = subscriptions?.filter((sub: Subscription) => {
    if (filterStatus === "전체") return true;
    if (filterStatus === "활성") return sub.isActive && new Date(sub.endDate) > new Date();
    if (filterStatus === "만료 임박") {
      const daysLeft = differenceInDays(new Date(sub.endDate), new Date());
      return sub.isActive && daysLeft <= 7 && daysLeft >= 0;
    }
    if (filterStatus === "중단") return !sub.isActive;
    return true;
  }) || [];

  const monthlyTotal = subscriptions?.filter((sub: Subscription) => sub.isActive && new Date(sub.endDate) > new Date())
    .reduce((sum: number, sub: Subscription) => sum + (sub.monthlyFee || 0), 0) || 0;

  const activeCount = subscriptions?.filter((sub: Subscription) => sub.isActive && new Date(sub.endDate) > new Date()).length || 0;
  const expiringSoon = subscriptions?.filter((sub: Subscription) => {
    const daysLeft = differenceInDays(new Date(sub.endDate), new Date());
    return sub.isActive && daysLeft <= 7 && daysLeft >= 0;
  }).length || 0;

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
            📱 구독 서비스 관리
          </h2>
          <p className="text-gray-600 mt-1">버블, 위버스 등 구독 서비스를 체계적으로 관리해보세요</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-love-pink to-love-dark text-white">
              <Plus className="w-4 h-4 mr-2" />
              구독 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 구독 서비스 추가</DialogTitle>
            </DialogHeader>
            <AddSubscriptionForm onSubmit={addSubscriptionMutation.mutate} />
          </DialogContent>
        </Dialog>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50">
          <Smartphone className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <div className="text-2xl font-bold text-purple-600">{activeCount}</div>
          <div className="text-sm text-gray-600">활성 구독</div>
        </Card>
        
        <Card className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-orange-600" />
          <div className="text-2xl font-bold text-orange-600">{expiringSoon}</div>
          <div className="text-sm text-gray-600">만료 임박</div>
        </Card>
        
        <Card className="text-center p-4 bg-gradient-to-r from-green-50 to-teal-50">
          <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-green-600">₩{monthlyTotal.toLocaleString()}</div>
          <div className="text-sm text-gray-600">월 구독료</div>
        </Card>
        
        <Card className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <Star className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold text-blue-600">{subscriptions?.length || 0}</div>
          <div className="text-sm text-gray-600">총 구독 이력</div>
        </Card>
      </div>

      {/* 상태 필터 */}
      <div className="flex flex-wrap gap-2">
        {["전체", "활성", "만료 임박", "중단"].map(status => (
          <Button
            key={status}
            variant={filterStatus === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus(status)}
            className={filterStatus === status ? "bg-gradient-to-r from-love-pink to-love-dark text-white" : ""}
          >
            {status}
          </Button>
        ))}
      </div>

      {/* 구독 목록 */}
      <div className="space-y-4">
        {filteredSubscriptions.length > 0 ? (
          filteredSubscriptions.map((subscription: Subscription) => {
            const statusInfo = getSubscriptionStatus(subscription);
            const daysLeft = differenceInDays(new Date(subscription.endDate), new Date());
            
            return (
              <Card key={subscription.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <span className="text-3xl">{getPlatformIcon(subscription.platform)}</span>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className={getPlatformStyle(subscription.platform)}>
                            {subscription.platform}
                          </Badge>
                          <Badge className={`${statusInfo.bgColor} ${statusInfo.color}`}>
                            {statusInfo.status}
                          </Badge>
                          {subscription.subscriptionType && (
                            <Badge variant="outline">{subscription.subscriptionType}</Badge>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-1">{subscription.artist}</h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>시작: {new Date(subscription.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>종료: {new Date(subscription.endDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>₩{subscription.monthlyFee.toLocaleString()}/월</span>
                          </div>
                          {subscription.isActive && daysLeft >= 0 && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{daysLeft}일 남음</span>
                            </div>
                          )}
                        </div>
                        
                        {subscription.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{subscription.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <Switch
                        checked={subscription.isActive}
                        onCheckedChange={(checked) => 
                          toggleSubscriptionMutation.mutate({ id: subscription.id, isActive: checked })
                        }
                      />
                      <span className="text-xs text-gray-500">
                        {subscription.isActive ? "활성화" : "비활성화"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="text-center p-12">
            <Smartphone className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              아직 구독 서비스가 없어요
            </h3>
            <p className="text-gray-500 mb-6">
              버블이나 위버스 같은 구독 서비스를 추가해서 관리해보세요!
            </p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-love-pink to-love-dark text-white">
                  첫 구독 추가하기
                </Button>
              </DialogTrigger>
            </Dialog>
          </Card>
        )}
      </div>
    </div>
  );
}

// 구독 추가 폼 컴포넌트
function AddSubscriptionForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    platform: "",
    artist: "",
    subscriptionType: "",
    startDate: new Date(),
    endDate: addMonths(new Date(), 1),
    monthlyFee: 0,
    isActive: true,
    notes: "",
  });

  const platforms = ["버블", "위버스", "팬클럽", "유니버스", "V LIVE+"];
  const subscriptionTypes = ["월구독", "3개월", "6개월", "년구독", "평생"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      startDate: formData.startDate.toISOString(),
      endDate: formData.endDate.toISOString(),
    });
  };

  const handleSubscriptionTypeChange = (type: string) => {
    setFormData(prev => ({ ...prev, subscriptionType: type }));
    
    // 구독 유형에 따라 종료일 자동 설정
    const start = formData.startDate;
    let end = new Date(start);
    
    switch (type) {
      case "월구독":
        end = addMonths(start, 1);
        break;
      case "3개월":
        end = addMonths(start, 3);
        break;
      case "6개월":
        end = addMonths(start, 6);
        break;
      case "년구독":
        end = addYears(start, 1);
        break;
      case "평생":
        end = addYears(start, 100); // 100년 후로 설정
        break;
    }
    
    setFormData(prev => ({ ...prev, endDate: end }));
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
          <Label>구독 유형</Label>
          <Select value={formData.subscriptionType} onValueChange={handleSubscriptionTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="구독 유형 선택" />
            </SelectTrigger>
            <SelectContent>
              {subscriptionTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>아티스트</Label>
        <Input
          value={formData.artist}
          onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
          placeholder="구독하는 아티스트명을 입력하세요"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>시작일</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(formData.startDate, "yyyy-MM-dd")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => date && setFormData(prev => ({ ...prev, startDate: date }))}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label>종료일</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(formData.endDate, "yyyy-MM-dd")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => date && setFormData(prev => ({ ...prev, endDate: date }))}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <Label>월 구독료</Label>
        <Input
          type="number"
          value={formData.monthlyFee}
          onChange={(e) => setFormData(prev => ({ ...prev, monthlyFee: parseInt(e.target.value) || 0 }))}
          placeholder="0"
          min="0"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
        <Label>활성화 상태</Label>
      </div>

      <div>
        <Label>메모 (선택사항)</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="특별한 혜택이나 추가 정보가 있다면 적어주세요"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full bg-gradient-to-r from-love-pink to-love-dark text-white">
        구독 추가하기
      </Button>
    </form>
  );
}