import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, X, Crown, Star, Heart, Sparkles, Zap, Shield, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const plans = [
    {
      id: "free",
      name: "프리 가드너",
      price: "무료",
      period: "",
      icon: "🌱",
      color: "from-gray-400 to-gray-500",
      borderColor: "border-gray-200",
      bgColor: "bg-gray-50",
      features: [
        { text: "러브트리 5개까지 생성", included: true },
        { text: "기본 템플릿 사용", included: true },
        { text: "SNS 공유 기능", included: true },
        { text: "커뮤니티 참여", included: true },
        { text: "기본 가드너 포인트", included: true },
        { text: "광고 표시", included: true, isNegative: true },
        { text: "프리미엄 템플릿", included: false },
        { text: "무제한 러브트리", included: false },
        { text: "우선 고객지원", included: false },
        { text: "독점 배지", included: false }
      ],
      popular: false
    },
    {
      id: "premium",
      name: "프리미엄 가드너",
      price: "$9.99",
      period: "/월",
      icon: "⭐",
      color: "from-blue-500 to-purple-500",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50",
      features: [
        { text: "러브트리 25개까지 생성", included: true },
        { text: "모든 템플릿 사용", included: true },
        { text: "고급 편집 도구", included: true },
        { text: "광고 없는 경험", included: true },
        { text: "프리미엄 스티커팩", included: true },
        { text: "우선 고객지원", included: true },
        { text: "독점 배지 'Premium'", included: true },
        { text: "베타 기능 먼저 체험", included: true },
        { text: "상세 분석 리포트", included: true },
        { text: "무제한 러브트리", included: false }
      ],
      popular: true
    },
    {
      id: "pro",
      name: "프로 가드너",
      price: "$19.99",
      period: "/월",
      icon: "👑",
      color: "from-yellow-500 to-orange-500",
      borderColor: "border-yellow-200",
      bgColor: "bg-yellow-50",
      features: [
        { text: "무제한 러브트리 생성", included: true },
        { text: "모든 프리미엄 기능", included: true },
        { text: "AI 추천 시스템", included: true },
        { text: "독점 테마 & 효과", included: true },
        { text: "고급 분석 대시보드", included: true },
        { text: "1:1 전용 지원", included: true },
        { text: "독점 배지 'Pro Master'", included: true },
        { text: "월간 특별 이벤트", included: true },
        { text: "콘텐츠 제작자 지원", included: true },
        { text: "API 액세스 권한", included: true }
      ],
      popular: false
    }
  ];

  const handleSubscribe = async (planId: string) => {
    if (planId === "free") {
      toast({
        title: "이미 무료 플랜을 이용 중입니다! 🌱",
        description: "프리미엄 기능이 필요하시면 유료 플랜을 선택해보세요!",
      });
      return;
    }

    setIsProcessing(true);
    setSelectedPlan(planId);

    try {
      // 구독 처리 로직 (실제 구현 시 Stripe 연동)
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "구독 완료! 🎉",
        description: `${plans.find(p => p.id === planId)?.name} 플랜이 활성화되었습니다!`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "구독 실패",
        description: "다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <Crown className="w-6 h-6 text-yellow-500" />
              <span className="text-xl">러브트리 구독 플랜</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">당신에게 맞는 플랜을 선택하세요! 🌸</p>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[70vh]">
          {/* 플랜 비교 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative ${plan.borderColor} ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      인기
                    </Badge>
                  </div>
                )}

                <CardHeader className={`text-center ${plan.bgColor} rounded-t-lg`}>
                  <div className="text-4xl mb-2">{plan.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                  <div className="text-3xl font-bold text-gray-900">
                    {plan.price}
                    <span className="text-sm font-normal text-gray-600">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {feature.included ? (
                          <Check className={`w-4 h-4 ${feature.isNegative ? 'text-orange-500' : 'text-green-500'}`} />
                        ) : (
                          <X className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={`text-sm ${
                          feature.included 
                            ? feature.isNegative 
                              ? 'text-orange-600' 
                              : 'text-gray-700'
                            : 'text-gray-400'
                        }`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isProcessing && selectedPlan === plan.id}
                    className={`w-full ${
                      plan.id === 'free' 
                        ? 'bg-gray-500 hover:bg-gray-600' 
                        : `bg-gradient-to-r ${plan.color} hover:opacity-90`
                    }`}
                  >
                    {isProcessing && selectedPlan === plan.id ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        처리 중...
                      </div>
                    ) : plan.id === 'free' ? (
                      '현재 플랜'
                    ) : (
                      '구독하기'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 추가 혜택 안내 */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200 mb-6">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center">
              <Gift className="w-5 h-5 mr-2 text-pink-500" />
              특별 혜택
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-pink-500 mt-0.5" />
                <div>
                  <p className="font-medium">7일 무료 체험</p>
                  <p className="text-gray-600">프리미엄 기능을 무료로 체험해보세요</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">언제든 취소 가능</p>
                  <p className="text-gray-600">부담 없이 시작하고 언제든 취소하세요</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Zap className="w-4 h-4 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium">즉시 적용</p>
                  <p className="text-gray-600">구독 즉시 모든 기능을 사용할 수 있어요</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Heart className="w-4 h-4 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium">가족 공유</p>
                  <p className="text-gray-600">Pro 플랜은 최대 5명까지 공유 가능</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-800">자주 묻는 질문</h4>
            <div className="space-y-2 text-sm">
              <details className="bg-gray-50 rounded-lg p-3">
                <summary className="font-medium cursor-pointer">구독을 취소하면 어떻게 되나요?</summary>
                <p className="text-gray-600 mt-2">구독 취소 시점까지 모든 프리미엄 기능을 사용할 수 있으며, 기존 러브트리는 그대로 유지됩니다.</p>
              </details>
              <details className="bg-gray-50 rounded-lg p-3">
                <summary className="font-medium cursor-pointer">플랜을 언제든 변경할 수 있나요?</summary>
                <p className="text-gray-600 mt-2">네! 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다.</p>
              </details>
              <details className="bg-gray-50 rounded-lg p-3">
                <summary className="font-medium cursor-pointer">결제 방법은 무엇이 있나요?</summary>
                <p className="text-gray-600 mt-2">신용카드, 체크카드, PayPal, Apple Pay, Google Pay를 지원합니다.</p>
              </details>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}