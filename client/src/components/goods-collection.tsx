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
import { Plus, ShoppingBag, Star, Calendar as CalendarIcon, Package, Heart, Coins, Image } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

interface GoodsItem {
  id: number;
  category: string;
  itemName: string;
  artist: string;
  price: number;
  purchaseDate: string;
  platform: string;
  condition: string;
  rarity: string;
  imageUrl?: string;
  notes?: string;
  isWishlist: boolean;
  createdAt: string;
}

export default function GoodsCollection() {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");

  const { data: goods, isLoading } = useQuery({
    queryKey: ["/api/goods-collection"],
    enabled: !!user,
  });

  const addGoodsMutation = useMutation({
    mutationFn: async (newGoods: any) => {
      const response = await fetch("/api/goods-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGoods),
      });
      if (!response.ok) throw new Error("Failed to add goods");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goods-collection"] });
      setIsAddDialogOpen(false);
    },
  });

  const categories = [
    { name: "앨범", icon: "💿", color: "bg-purple-100 text-purple-800" },
    { name: "포토카드", icon: "📷", color: "bg-pink-100 text-pink-800" },
    { name: "의류", icon: "👕", color: "bg-blue-100 text-blue-800" },
    { name: "액세서리", icon: "💎", color: "bg-green-100 text-green-800" },
    { name: "문구류", icon: "✏️", color: "bg-amber-100 text-amber-800" },
    { name: "기타", icon: "🎁", color: "bg-gray-100 text-gray-800" },
  ];

  const rarityColors = {
    "일반": "bg-gray-100 text-gray-800",
    "한정판": "bg-amber-100 text-amber-800",
    "사인": "bg-red-100 text-red-800",
    "희귀": "bg-purple-100 text-purple-800",
  };

  const getCategoryStyle = (category: string) => {
    const found = categories.find(c => c.name === category);
    return found ? found.color : "bg-gray-100 text-gray-800";
  };

  const getCategoryIcon = (category: string) => {
    const found = categories.find(c => c.name === category);
    return found ? found.icon : "📦";
  };

  const filteredGoods = goods?.filter((item: GoodsItem) => 
    selectedCategory === "전체" || item.category === selectedCategory
  ) || [];

  const totalValue = goods?.reduce((sum: number, item: GoodsItem) => 
    !item.isWishlist ? sum + (item.price || 0) : sum, 0
  ) || 0;

  const wishlistCount = goods?.filter((item: GoodsItem) => item.isWishlist).length || 0;
  const ownedCount = goods?.filter((item: GoodsItem) => !item.isWishlist).length || 0;

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
            🛒 굿즈 컬렉션
          </h2>
          <p className="text-gray-600 mt-1">소중한 굿즈 컬렉션을 정리하고 관리해보세요</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-love-pink to-love-dark text-white">
              <Plus className="w-4 h-4 mr-2" />
              굿즈 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 굿즈 추가</DialogTitle>
            </DialogHeader>
            <AddGoodsForm onSubmit={addGoodsMutation.mutate} />
          </DialogContent>
        </Dialog>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50">
          <Package className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <div className="text-2xl font-bold text-purple-600">{ownedCount}</div>
          <div className="text-sm text-gray-600">보유 굿즈</div>
        </Card>
        
        <Card className="text-center p-4 bg-gradient-to-r from-amber-50 to-orange-50">
          <Heart className="w-8 h-8 mx-auto mb-2 text-orange-600" />
          <div className="text-2xl font-bold text-orange-600">{wishlistCount}</div>
          <div className="text-sm text-gray-600">위시리스트</div>
        </Card>
        
        <Card className="text-center p-4 bg-gradient-to-r from-green-50 to-teal-50">
          <Coins className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-green-600">₩{totalValue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">총 구매 금액</div>
        </Card>
        
        <Card className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <Star className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold text-blue-600">
            {goods?.filter((item: GoodsItem) => item.rarity !== "일반").length || 0}
          </div>
          <div className="text-sm text-gray-600">특별 아이템</div>
        </Card>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === "전체" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("전체")}
          className={selectedCategory === "전체" ? "bg-gradient-to-r from-love-pink to-love-dark text-white" : ""}
        >
          전체
        </Button>
        {categories.map(category => (
          <Button
            key={category.name}
            variant={selectedCategory === category.name ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.name)}
            className={selectedCategory === category.name ? "bg-gradient-to-r from-love-pink to-love-dark text-white" : ""}
          >
            <span className="mr-1">{category.icon}</span>
            {category.name}
          </Button>
        ))}
      </div>

      {/* 굿즈 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoods.length > 0 ? (
          filteredGoods.map((item: GoodsItem) => (
            <Card key={item.id} className={`hover:shadow-lg transition-shadow ${item.isWishlist ? 'border-amber-300 bg-amber-50/30' : ''}`}>
              <CardContent className="p-6">
                {item.isWishlist && (
                  <Badge className="mb-3 bg-amber-100 text-amber-800">
                    💝 위시리스트
                  </Badge>
                )}
                
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                  <div>
                    <Badge className={getCategoryStyle(item.category)}>
                      {item.category}
                    </Badge>
                    {item.rarity !== "일반" && (
                      <Badge className={`ml-2 ${rarityColors[item.rarity as keyof typeof rarityColors]}`}>
                        {item.rarity}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {item.imageUrl && (
                  <div className="mb-4 bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">이미지</span>
                  </div>
                )}
                
                <h3 className="font-semibold text-lg mb-2">{item.itemName}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.artist}</p>
                
                {!item.isWishlist && (
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>구매가격:</span>
                      <span className="font-semibold">₩{item.price?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>구매일:</span>
                      <span>{new Date(item.purchaseDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>구매처:</span>
                      <span>{item.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>상태:</span>
                      <span>{item.condition}</span>
                    </div>
                  </div>
                )}
                
                {item.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{item.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="text-center p-12">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                아직 굿즈가 없어요
              </h3>
              <p className="text-gray-500 mb-6">
                첫 굿즈를 추가해서 컬렉션을 시작해보세요!
              </p>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-love-pink to-love-dark text-white">
                    첫 굿즈 추가하기
                  </Button>
                </DialogTrigger>
              </Dialog>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// 굿즈 추가 폼 컴포넌트
function AddGoodsForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    category: "",
    itemName: "",
    artist: "",
    price: 0,
    purchaseDate: new Date(),
    platform: "",
    condition: "",
    rarity: "일반",
    imageUrl: "",
    notes: "",
    isWishlist: false,
  });

  const categories = ["앨범", "포토카드", "의류", "액세서리", "문구류", "기타"];
  const conditions = ["새상품", "거의 새것", "중고 양호", "중고"];
  const rarities = ["일반", "한정판", "사인", "희귀"];
  const platforms = ["공식몰", "위버스샵", "음반 매장", "온라인쇼핑몰", "중고거래", "직거래"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      purchaseDate: formData.purchaseDate.toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          checked={formData.isWishlist}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isWishlist: checked }))}
        />
        <Label>위시리스트 아이템</Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>카테고리</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>희귀도</Label>
          <Select value={formData.rarity} onValueChange={(value) => setFormData(prev => ({ ...prev, rarity: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {rarities.map(rarity => (
                <SelectItem key={rarity} value={rarity}>{rarity}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>아이템명</Label>
        <Input
          value={formData.itemName}
          onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
          placeholder="굿즈 이름을 입력하세요"
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

      {!formData.isWishlist && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>가격</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                min="0"
              />
            </div>
            
            <div>
              <Label>구매일</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.purchaseDate, "yyyy-MM-dd")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.purchaseDate}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, purchaseDate: date }))}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>구매처</Label>
              <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="구매처 선택" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map(platform => (
                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>상태</Label>
              <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map(condition => (
                    <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}

      <div>
        <Label>이미지 URL (선택사항)</Label>
        <Input
          value={formData.imageUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
          placeholder="이미지 링크가 있다면 입력하세요"
        />
      </div>

      <div>
        <Label>메모 (선택사항)</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="특별한 의미나 추가 정보가 있다면 적어주세요"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full bg-gradient-to-r from-love-pink to-love-dark text-white">
        굿즈 추가하기
      </Button>
    </form>
  );
}