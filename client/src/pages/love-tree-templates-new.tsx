import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Play, BookOpen, Heart, Sparkles, Star, Crown, Target, Gamepad2, Music } from "lucide-react";
import { Link, useLocation } from "wouter";
import BottomNavigation from "@/components/bottom-navigation";

export default function LoveTreeTemplates() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("popular");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 템플릿 선택 핸들러
  const handleTemplateSelect = async (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsLoading(true);
    
    // 로딩 시뮬레이션 (1초)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 러브트리 편집 페이지로 이동
    setLocation(`/love-tree/${templateId}`);
    
    setIsLoading(false);
    setSelectedTemplate(null);
  };

  const templates = [
    {
      id: "investment",
      name: "투자 결정 여정",
      description: "신중한 투자 결정까지의 과정을 추적해요",
      icon: "💎",
      gradient: "from-emerald-400 via-teal-400 to-cyan-400",
      bgGradient: "from-emerald-50 to-teal-50",
      borderColor: "border-emerald-200",
      category: "business",
      examples: ["스타트업 투자", "부동산 분석", "주식 연구"]
    },
    {
      id: "youtuber",
      name: "크리에이터 발견",
      description: "좋아하는 유튜버를 찾아가는 여정",
      icon: "🎬",
      gradient: "from-rose-400 via-pink-400 to-purple-400",
      bgGradient: "from-rose-50 to-pink-50",
      borderColor: "border-rose-200",
      category: "entertainment",
      examples: ["게임 채널", "요리 ASMR", "브이로그"]
    },
    {
      id: "learning",
      name: "학습 성장 트리",
      description: "새로운 기술을 마스터하는 과정",
      icon: "🌟",
      gradient: "from-violet-400 via-purple-400 to-indigo-400",
      bgGradient: "from-violet-50 to-purple-50",
      borderColor: "border-violet-200",
      category: "education",
      examples: ["프로그래밍", "디자인", "언어학습"]
    },
    {
      id: "game",
      name: "게임 입문 여정",
      description: "새로운 게임에 빠져드는 과정",
      icon: "🎮",
      gradient: "from-blue-400 via-indigo-400 to-purple-400",
      bgGradient: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
      category: "gaming",
      examples: ["RPG 게임", "FPS 게임", "인디 게임"]
    },
    {
      id: "music",
      name: "음악 발견 여정",
      description: "새로운 아티스트나 장르를 발견하는 과정",
      icon: "🎵",
      gradient: "from-orange-400 via-amber-400 to-amber-400",
      bgGradient: "from-orange-50 to-amber-50",
      borderColor: "border-orange-200",
      category: "music",
      examples: ["K-pop 입덕", "재즈 탐험", "클래식 입문"]
    },
    {
      id: "hobby",
      name: "취미 발견 트리",
      description: "새로운 취미를 시작하는 여정",
      icon: "🎨",
      gradient: "from-pink-400 via-rose-400 to-red-400",
      bgGradient: "from-pink-50 to-rose-50",
      borderColor: "border-pink-200",
      category: "lifestyle",
      examples: ["사진 촬영", "요리", "독서"]
    }
  ];

  const categories = [
    { id: "popular", name: "인기", icon: "🔥" },
    { id: "entertainment", name: "엔터테인먼트", icon: "🎭" },
    { id: "education", name: "학습", icon: "📚" },
    { id: "business", name: "비즈니스", icon: "💼" },
    { id: "lifestyle", name: "라이프스타일", icon: "✨" },
    { id: "gaming", name: "게임", icon: "🎮" },
    { id: "music", name: "음악", icon: "🎵" }
  ];

  const filteredTemplates = selectedCategory === "popular" 
    ? templates.slice(0, 4) 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-love-light via-white to-love-light">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-love-pink/20">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-800">러브트리 템플릿</h1>
            <div></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pb-20 space-y-6">
        {/* Hero Section */}
        <Card className="bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 border-pink-200 mt-4">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3">🌸</div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">당신만의 러브트리를 시작하세요</h2>
            <p className="text-sm text-gray-600">다양한 템플릿으로 쉽고 빠르게 러브트리를 만들어보세요</p>
          </CardContent>
        </Card>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">카테고리</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 ${
                  selectedCategory === category.id 
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white" 
                    : "text-gray-600"
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              {categories.find(c => c.id === selectedCategory)?.name} 템플릿
            </h3>
            <Badge variant="outline" className="text-xs">
              {filteredTemplates.length}개
            </Badge>
          </div>

          <div className="space-y-4">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id} 
                className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${template.borderColor} group ${
                  selectedTemplate === template.id ? 'ring-2 ring-pink-500 scale-105' : ''
                } ${
                  isLoading && selectedTemplate === template.id ? 'opacity-80' : ''
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <CardContent className="p-0 overflow-hidden">
                  {/* Template Header */}
                  <div className={`bg-gradient-to-r ${template.bgGradient} p-4 relative`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-14 h-14 bg-gradient-to-r ${template.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-lg">{template.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-6 h-6 text-gray-600" />
                      </div>
                    </div>
                  </div>

                  {/* Template Content */}
                  <div className="p-4">
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2">예시 사용 사례:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.examples.map((example, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="text-xs bg-white"
                          >
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>인기</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>추천</span>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        className={`bg-gradient-to-r ${template.gradient} hover:opacity-90 text-white`}
                        disabled={isLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateSelect(template.id);
                        }}
                      >
                        {isLoading && selectedTemplate === template.id ? (
                          <>
                            <div className="w-4 h-4 mr-1 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            로딩중...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-1" />
                            시작하기
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-indigo-200">
          <CardContent className="p-6 text-center">
            <Crown className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">커스텀 템플릿 요청</h3>
            <p className="text-sm text-gray-600 mb-4">
              원하는 템플릿이 없나요? 새로운 템플릿을 요청해보세요!
            </p>
            <Button 
              variant="outline" 
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <Target className="w-4 h-4 mr-2" />
              템플릿 요청하기
            </Button>
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="p-4">
            <h4 className="font-bold text-emerald-800 mb-2 flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              러브트리 템플릿의 장점
            </h4>
            <div className="space-y-2 text-sm text-emerald-700">
              <p>• 빠른 시작: 미리 구성된 템플릿으로 즉시 시작</p>
              <p>• 체계적 관리: 단계별로 정리된 구조</p>
              <p>• 맞춤 설정: 자신만의 스타일로 커스터마이징</p>
              <p>• 공유 가능: 완성된 러브트리를 친구들과 공유</p>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
}