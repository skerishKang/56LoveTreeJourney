import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, ShoppingBag, Music, Smartphone } from "lucide-react";
import { Link } from "wouter";

import CommunityTracker from "@/components/community-tracker";
import GoodsCollection from "@/components/goods-collection";
import FanActivityJournal from "@/components/fan-activity-journal";
import SubscriptionManager from "@/components/subscription-manager";

export default function CategoryHub() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: "community",
      name: "커뮤니티 활동",
      icon: "💬",
      description: "더쿠, 여시 등 커뮤니티에서의 활동을 추적해보세요",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-gradient-to-br from-pink-50 to-rose-50",
      component: CommunityTracker,
    },
    {
      id: "goods",
      name: "굿즈 컬렉션",
      icon: "🛒",
      description: "소중한 굿즈와 컬렉션을 체계적으로 관리해보세요",
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-violet-50",
      component: GoodsCollection,
    },
    {
      id: "activities",
      name: "팬 활동 일지",
      icon: "🎪",
      description: "콘서트, 팬사인회 등 특별한 순간들을 기록해보세요",
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
      component: FanActivityJournal,
    },
    {
      id: "subscriptions",
      name: "구독 서비스",
      icon: "📱",
      description: "버블, 위버스 등 구독 서비스를 통합 관리해보세요",
      color: "from-green-500 to-teal-500",
      bgColor: "bg-gradient-to-br from-green-50 to-teal-50",
      component: SubscriptionManager,
    },
  ];

  if (selectedCategory) {
    const category = categories.find(c => c.id === selectedCategory);
    if (category) {
      const ComponentToRender = category.component;
      return (
        <div className="min-h-screen bg-gradient-to-br from-soft-pink via-white to-love-pink/10 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => setSelectedCategory(null)}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                카테고리 목록으로 돌아가기
              </Button>
              <div className="text-center">
                <div className="text-6xl mb-4">{category.icon}</div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-love-pink to-love-dark bg-clip-text text-transparent mb-2">
                  {category.name}
                </h1>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>
            
            <ComponentToRender />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-pink via-white to-love-pink/10 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                홈으로
              </Button>
            </Link>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-love-pink to-love-dark bg-clip-text text-transparent mb-4">
            🌟 팬 활동 카테고리
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            러브트리에서 썸을 탄 후, 각 영역별로 전문화된 팬 활동을 관리해보세요
          </p>
          
          {/* 진행 과정 설명 */}
          <Card className="max-w-3xl mx-auto mb-8 border-love-pink/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-love-pink to-love-dark rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
                    1
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-1">러브트리</div>
                  <div className="text-sm text-gray-600">입덕 과정 (썸 단계)</div>
                </div>
                
                <div className="flex-1 h-1 bg-gradient-to-r from-love-pink to-love-dark rounded-full"></div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
                    2
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-1">전문 카테고리</div>
                  <div className="text-sm text-gray-600">깊은 팬 활동</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 카테고리 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`${category.bgColor} border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                
                <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                  {category.name}
                </h3>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {category.description}
                </p>
                
                <Button className={`bg-gradient-to-r ${category.color} text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
                  시작하기
                </Button>
                
                {/* 카테고리별 특징 */}
                <div className="mt-6 space-y-2">
                  {category.id === "community" && (
                    <div className="flex flex-wrap justify-center gap-2">
                      <Badge variant="secondary" className="text-xs">더쿠</Badge>
                      <Badge variant="secondary" className="text-xs">여시</Badge>
                      <Badge variant="secondary" className="text-xs">디시</Badge>
                    </div>
                  )}
                  {category.id === "goods" && (
                    <div className="flex flex-wrap justify-center gap-2">
                      <Badge variant="secondary" className="text-xs">앨범</Badge>
                      <Badge variant="secondary" className="text-xs">포토카드</Badge>
                      <Badge variant="secondary" className="text-xs">굿즈</Badge>
                    </div>
                  )}
                  {category.id === "activities" && (
                    <div className="flex flex-wrap justify-center gap-2">
                      <Badge variant="secondary" className="text-xs">콘서트</Badge>
                      <Badge variant="secondary" className="text-xs">팬사인회</Badge>
                      <Badge variant="secondary" className="text-xs">팬미팅</Badge>
                    </div>
                  )}
                  {category.id === "subscriptions" && (
                    <div className="flex flex-wrap justify-center gap-2">
                      <Badge variant="secondary" className="text-xs">버블</Badge>
                      <Badge variant="secondary" className="text-xs">위버스</Badge>
                      <Badge variant="secondary" className="text-xs">팬클럽</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 하단 안내 */}
        <Card className="mt-12 bg-gradient-to-r from-love-pink/10 to-love-dark/10 border-love-pink/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              💡 각 카테고리는 독립적으로 관리됩니다
            </h3>
            <p className="text-gray-600 leading-relaxed">
              러브트리에서 입덕이 확정되면, 이후의 깊은 팬 활동들은 각각의 전문 영역에서 체계적으로 관리할 수 있어요.<br />
              커뮤니티 참여부터 굿즈 수집, 오프라인 활동, 구독 서비스까지 모든 팬 라이프를 한 곳에서!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}