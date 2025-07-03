import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Chrome, Youtube, Plus, Download, CheckCircle, Timer } from "lucide-react";
import { useState } from "react";

export default function YouTubeExtensionGuide() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const steps = [
    {
      icon: <Download className="w-6 h-6 text-love-pink" />,
      title: "1. 확장앱 설치",
      description: "Chrome 웹스토어에서 '러브트리 YouTube 연동' 확장앱을 설치하세요",
      status: "준비중",
      color: "bg-gradient-to-r from-love-pink/10 to-love-dark/10"
    },
    {
      icon: <Youtube className="w-6 h-6 text-red-500" />,
      title: "2. YouTube 연동",
      description: "YouTube에서 영상을 보다가 '💕 러브트리에 추가' 버튼을 클릭하세요",
      status: "자동",
      color: "bg-gradient-to-r from-red-500/10 to-pink-500/10"
    },
    {
      icon: <Plus className="w-6 h-6 text-tree-green" />,
      title: "3. 자동 추가",
      description: "영상이 자동으로 러브트리에 추가되고 메모를 남길 수 있어요",
      status: "원클릭",
      color: "bg-gradient-to-r from-tree-green/10 to-green-600/10"
    },
    {
      icon: <Timer className="w-6 h-6 text-sparkle-gold" />,
      title: "4. 시청 시간 측정",
      description: "하루 검색 시간과 시청 패턴을 자동으로 분석해요",
      status: "자동 측정",
      color: "bg-gradient-to-r from-sparkle-gold/10 to-yellow-600/10"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-love-dark" />,
      title: "5. 폴인럽 완성",
      description: "충분한 영상이 모이면 '완성' 버튼으로 폴인럽 단계로 업그레이드!",
      status: "수동",
      color: "bg-gradient-to-r from-love-dark/10 to-purple-600/10"
    }
  ];

  return (
    <>
      <Card className="bg-white/90 backdrop-blur-sm border-love-pink/20 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <Chrome className="w-5 h-5 text-love-pink" />
            <span>YouTube 확장앱 연동</span>
            <Badge className="bg-gradient-to-r from-love-pink to-love-dark text-white ml-auto">
              NEW
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              YouTube에서 보는 영상을 바로 러브트리에 추가하고 자동으로 입덕 과정을 기록해보세요!
            </p>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-love-pink to-love-dark hover:opacity-90 text-white">
                  <Chrome className="w-4 h-4 mr-2" />
                  확장앱 설치 가이드 보기
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-2xl bg-soft-pink/95 backdrop-blur-sm border-love-pink/20">
                <DialogHeader>
                  <DialogTitle className="text-center text-gray-800 flex items-center justify-center space-x-2">
                    <Youtube className="w-6 h-6 text-red-500" />
                    <span>YouTube 확장앱 연동 가이드</span>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {steps.map((step, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl ${step.color} border border-white/20`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {step.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800">{step.title}</h4>
                            <Badge 
                              variant="outline" 
                              className="text-xs bg-white/80 border-gray-300"
                            >
                              {step.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* 특별 기능 소개 */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-sparkle-gold/10 to-yellow-600/10 rounded-xl border border-white/20">
                    <h4 className="font-semibold text-gray-800 mb-2">🎯 스마트 기능들</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 영상 옆/밑/위에 겹쳐서 메모 작성 가능</li>
                      <li>• 하루 검색 시간 자동 측정</li>
                      <li>• 러브트리 완성도에 따른 하트 애니메이션</li>
                      <li>• 공개/비공개 설정으로 개인정보 보호</li>
                      <li>• 태그별 자동 분류 (#귀여움, #섹시함 등)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 text-white"
                    onClick={() => window.open('https://chrome.google.com/webstore', '_blank')}
                  >
                    <Chrome className="w-4 h-4 mr-2" />
                    Chrome 웹스토어 이동
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    나중에 설치하기
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
}