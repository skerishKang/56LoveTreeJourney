import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Sparkles, Camera, Edit3, Sticker, Palette, Crown, Play } from "lucide-react";
import LoveGauge from "./love-gauge";

interface DiaryLoveTreeProps {
  loveTreeId: number;
  items?: any[];
}

export default function DiaryLoveTree({ loveTreeId, items }: DiaryLoveTreeProps) {
  const [selectedSticker, setSelectedSticker] = useState("");
  const [diaryTheme, setDiaryTheme] = useState("pink");

  const stickers = ["💕", "✨", "🌟", "🎀", "🌸", "💖", "🦋", "🌙", "☁️", "🌈"];
  const themes = [
    { name: "pink", colors: "from-pink-100 to-rose-200", label: "핑크 드림" },
    { name: "purple", colors: "from-purple-100 to-indigo-200", label: "보라 환상" },
    { name: "mint", colors: "from-emerald-100 to-teal-200", label: "민트 프레시" },
    { name: "sunset", colors: "from-orange-100 to-pink-200", label: "석양 로맨스" }
  ];

  const getCurrentTheme = () => themes.find(t => t.name === diaryTheme) || themes[0];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getCurrentTheme().colors} p-4 pb-20`}>
      {/* 다이어리 헤더 */}
      <div className="text-center mb-6 relative">
        <div className="inline-block bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl border-2 border-white/50">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-love-pink to-love-dark bg-clip-text text-transparent">
            💕 My Love Tree Diary 💕
          </h1>
          <p className="text-sm text-gray-600 mt-1">사랑에 빠지는 순간들을 기록해요</p>
        </div>
        
        {/* 떠다니는 스티커들 */}
        <div className="absolute -top-2 -left-4 text-2xl animate-bounce" style={{ animationDelay: '0s' }}>🌟</div>
        <div className="absolute -top-4 -right-2 text-xl animate-bounce" style={{ animationDelay: '1s' }}>💖</div>
        <div className="absolute -bottom-2 left-8 text-lg animate-bounce" style={{ animationDelay: '2s' }}>✨</div>
      </div>

      {/* 테마 선택 */}
      <div className="mb-6">
        <Card className="bg-white/70 backdrop-blur-sm border-white/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Palette className="w-5 h-5 text-love-pink" />
              <span className="font-medium text-gray-700">다이어리 테마</span>
            </div>
            <div className="flex space-x-3 overflow-x-auto">
              {themes.map((theme) => (
                <Button
                  key={theme.name}
                  variant={diaryTheme === theme.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDiaryTheme(theme.name)}
                  className={`whitespace-nowrap ${
                    diaryTheme === theme.name 
                      ? "bg-love-pink text-white" 
                      : "bg-white/80 text-gray-700 hover:bg-love-pink/20"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${theme.colors} mr-2 border border-white`}></div>
                  {theme.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 폴인럽 게이지 */}
      <div className="mb-6">
        <LoveGauge loveTreeId={loveTreeId} artist="정국" />
      </div>

      {/* 다이어리 페이지들 */}
      <div className="space-y-6">
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <DiaryPage 
              key={item.id} 
              item={item} 
              index={index}
              stickers={stickers}
              theme={getCurrentTheme()}
            />
          ))
        ) : (
          <DiaryPage 
            item={{
              id: 1,
              title: "첫 만남 💕",
              platform: "YouTube",
              category: "귀여움",
              isFirstContent: true,
              likeCount: 0
            }}
            index={0}
            stickers={stickers}
            theme={getCurrentTheme()}
            isExample={true}
          />
        )}
      </div>

      {/* 플로팅 액션 버튼 */}
      <div className="fixed bottom-24 right-6 space-y-3">
        <Button
          size="lg"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-love-pink to-love-dark shadow-2xl hover:scale-110 transition-transform"
        >
          <Camera className="w-6 h-6" />
        </Button>
        
        <Button
          size="lg"
          variant="outline"
          className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm border-love-pink/30 hover:scale-110 transition-transform"
        >
          <Edit3 className="w-6 h-6 text-love-pink" />
        </Button>
      </div>
    </div>
  );
}

interface DiaryPageProps {
  item: any;
  index: number;
  stickers: string[];
  theme: any;
  isExample?: boolean;
}

function DiaryPage({ item, index, stickers, theme, isExample = false }: DiaryPageProps) {
  const [pageStickers, setPageStickers] = useState<{emoji: string, x: number, y: number}[]>([]);
  const [showStickers, setShowStickers] = useState(false);

  const addSticker = (emoji: string) => {
    const newSticker = {
      emoji,
      x: Math.random() * 80 + 10, // 10-90% 범위
      y: Math.random() * 60 + 20, // 20-80% 범위
    };
    setPageStickers(prev => [...prev, newSticker]);
    setShowStickers(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "귀여움": return "border-yellow-300 bg-yellow-50";
      case "섹시함": return "border-pink-300 bg-pink-50";
      case "댄스": return "border-emerald-300 bg-emerald-50";
      case "보컬": return "border-purple-300 bg-purple-50";
      default: return "border-gray-300 bg-gray-50";
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/60 shadow-xl overflow-hidden relative">
      {/* 다이어리 페이지 번호 */}
      <div className="absolute top-4 right-4 bg-love-pink text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
        {index + 1}
      </div>

      {/* 스티커들 */}
      {pageStickers.map((sticker, idx) => (
        <div
          key={idx}
          className="absolute text-2xl z-10 animate-pulse cursor-pointer"
          style={{ 
            left: `${sticker.x}%`, 
            top: `${sticker.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {sticker.emoji}
        </div>
      ))}

      <CardContent className="p-6 relative">
        {/* 첫 영상 크라운 */}
        {item.isFirstContent && (
          <div className="absolute -top-2 left-6 z-20">
            <Crown className="w-8 h-8 text-sparkle-gold drop-shadow-lg animate-bounce" />
            <div className="text-xs text-sparkle-gold font-bold text-center mt-1">첫사랑</div>
          </div>
        )}

        {/* 메인 콘텐츠 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 영상 썸네일 영역 */}
          <div className="md:col-span-1">
            <div className={`aspect-video rounded-xl border-4 ${getCategoryColor(item.category)} relative overflow-hidden group cursor-pointer`}>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                  <p className="text-sm font-medium text-gray-700">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.platform}</p>
                </div>
              </div>
              
              {/* 호버 재생 버튼 */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              </div>

              {/* 하트 카운트 */}
              <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
                <span className="text-xs font-medium">{item.likeCount || 0}</span>
              </div>
            </div>

            {/* 카테고리 배지 */}
            <div className="mt-3 text-center">
              <Badge variant="outline" className={getCategoryColor(item.category)}>
                {item.category}
              </Badge>
            </div>
          </div>

          {/* 다이어리 작성 영역 */}
          <div className="md:col-span-2 space-y-4">
            {/* 날짜와 감정 */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                📅 {new Date().toLocaleDateString('ko-KR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'long'
                })}
              </div>
              <div className="flex space-x-1">
                {["😍", "🥰", "😭", "🔥", "💕"].map((emotion, idx) => (
                  <span key={idx} className="text-lg cursor-pointer hover:scale-125 transition-transform">
                    {emotion}
                  </span>
                ))}
              </div>
            </div>

            {/* 다이어리 내용 */}
            <div className="bg-gradient-to-r from-love-pink/5 to-love-dark/5 rounded-lg p-4 border-2 border-dashed border-love-pink/30">
              <h3 className="font-bold text-gray-800 mb-2">💭 오늘의 심쿵 포인트</h3>
              {isExample ? (
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• 정국이 웃는 모습이 너무 사랑스러워... 💕</p>
                  <p>• 이 영상 보고 완전 심쿵했어 🥰</p>
                  <p>• 앞으로 더 많은 영상 찾아봐야겠어!</p>
                </div>
              ) : (
                <textarea 
                  className="w-full h-20 bg-transparent border-none resize-none focus:outline-none placeholder-gray-400"
                  placeholder="이 영상을 보고 느낀 감정을 자유롭게 적어보세요..."
                />
              )}
            </div>

            {/* 액션 버튼들 */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Dialog open={showStickers} onOpenChange={setShowStickers}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-love-pink border-love-pink hover:bg-love-pink hover:text-white">
                      <Sticker className="w-4 h-4 mr-1" />
                      스티커
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
                    <div className="grid grid-cols-5 gap-3 p-4">
                      {stickers.map((sticker, idx) => (
                        <button
                          key={idx}
                          onClick={() => addSticker(sticker)}
                          className="text-3xl hover:scale-125 transition-transform p-2 rounded-lg hover:bg-gray-100"
                        >
                          {sticker}
                        </button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button size="sm" variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white">
                  <Sparkles className="w-4 h-4 mr-1" />
                  특별한 순간
                </Button>
              </div>

              <div className="text-xs text-gray-500">
                💝 소중한 기억으로 저장됨
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}