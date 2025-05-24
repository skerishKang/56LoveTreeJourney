import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Play, BookOpen, Heart } from "lucide-react";
import { Link } from "wouter";

import InvestmentLoveTree from "@/components/investment-love-tree";
import YouTuberLoveTree from "@/components/youtuber-love-tree";
import LearningLoveTree from "@/components/learning-love-tree";
import DramaLoveTree from "@/components/drama-love-tree";

export default function LoveTreeTemplates() {
  const { user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates = [
    {
      id: "investment",
      name: "투자 결정 러브트리",
      icon: "💰",
      description: "첫 브리핑부터 투자 결정까지 - 신뢰도 변화와 핵심 결정 포인트 추적",
      color: "from-blue-600 to-green-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-green-50",
      component: InvestmentLoveTree,
      examples: ["스타트업 투자", "부동산 투자", "주식 투자"],
    },
    {
      id: "youtuber",
      name: "유튜버 구독 러브트리",
      icon: "📺",
      description: "첫 영상 시청부터 열렬한 구독자까지 - 알고리즘과 추천의 힘을 시각화",
      color: "from-red-600 to-purple-600",
      bgColor: "bg-gradient-to-br from-red-50 to-purple-50",
      component: YouTuberLoveTree,
      examples: ["침착맨", "게임 채널", "요리 채널"],
    },
    {
      id: "learning",
      name: "학습 과정 러브트리",
      icon: "📚",
      description: "공부법 발견부터 성적 향상까지 - 학습 성장의 모든 과정을 추적",
      color: "from-green-600 to-blue-600",
      bgColor: "bg-gradient-to-br from-green-50 to-blue-50",
      component: LearningLoveTree,
      examples: ["공부법 개선", "언어 학습", "기술 습득"],
    },
    {
      id: "drama",
      name: "드라마 입덕 러브트리",
      icon: "🎬",
      description: "첫 작품 만남부터 열렬한 팬까지 - 감정적 몰입도와 팬 활동 변화 추적",
      color: "from-pink-600 to-red-600",
      bgColor: "bg-gradient-to-br from-pink-50 to-red-50",
      component: DramaLoveTree,
      examples: ["배우 입덕", "드라마 입문", "애니 입문"],
    },
  ];

  if (selectedTemplate) {
    const template = templates.find(t => t.id === selectedTemplate);
    if (template) {
      const ComponentToRender = template.component;
      return (
        <div className="min-h-screen bg-gradient-to-br from-soft-pink via-white to-love-pink/10 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => setSelectedTemplate(null)}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                템플릿 목록으로 돌아가기
              </Button>
              <div className="text-center">
                <div className="text-6xl mb-4">{template.icon}</div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-love-pink to-love-dark bg-clip-text text-transparent mb-2">
                  {template.name}
                </h1>
                <p className="text-gray-600">{template.description}</p>
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
            🌟 러브트리 활용 템플릿
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            K-pop을 넘어 모든 분야의 "빠져드는 과정"을 시각화해보세요
          </p>
          
          {/* 활용 분야 설명 */}
          <Card className="max-w-4xl mx-auto mb-8 border-love-pink/20">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-3">💰</div>
                  <div className="text-lg font-semibold text-gray-800 mb-1">투자 결정</div>
                  <div className="text-sm text-gray-600">신뢰도 변화 추적</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-3">📺</div>
                  <div className="text-lg font-semibold text-gray-800 mb-1">구독 여정</div>
                  <div className="text-sm text-gray-600">알고리즘 분석</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-3">📚</div>
                  <div className="text-lg font-semibold text-gray-800 mb-1">학습 과정</div>
                  <div className="text-sm text-gray-600">성장 추적</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-3">🎬</div>
                  <div className="text-lg font-semibold text-gray-800 mb-1">입덕 과정</div>
                  <div className="text-sm text-gray-600">감정 변화</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 템플릿 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`${template.bgColor} border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {template.icon}
                </div>
                
                <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${template.color} bg-clip-text text-transparent`}>
                  {template.name}
                </h3>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {template.description}
                </p>
                
                <Button className={`bg-gradient-to-r ${template.color} text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 mb-6`}>
                  템플릿 체험하기
                </Button>
                
                {/* 활용 예시 */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-600 mb-2">활용 예시:</div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {template.examples.map((example, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 실제 활용 사례 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                실제 투자자 사례
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                "처음 브리핑 듣고 10일만에 100억 투자 결정! 각 단계별 신뢰도 변화를 시각화하니 
                의사결정 패턴을 명확히 파악할 수 있었어요."
              </p>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-semibold">- 벤처캐피털 대표</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-red-50 border-pink-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-pink-600" />
                학습자 성공 사례
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                "기존 암기 방식에서 포모도로+마인드맵으로 바꾸고 25점 상승! 
                어떤 방법이 효과적인지 한눈에 보이니까 동기부여도 확실히 달라져요."
              </p>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-semibold">- 수험생</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 하단 안내 */}
        <Card className="mt-12 bg-gradient-to-r from-love-pink/10 to-love-dark/10 border-love-pink/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              💡 모든 "빠져드는 과정"을 러브트리로!
            </h3>
            <p className="text-gray-600 leading-relaxed">
              K-pop 입덕부터 투자 결정, 학습 성장, 구독 여정까지...<br />
              인생의 모든 선택과 변화의 순간을 아름다운 마인드맵으로 기록하고 분석해보세요!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}