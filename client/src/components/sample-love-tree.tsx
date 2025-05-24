import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Heart, Sparkles, Music, Eye, MessageCircle, Play } from "lucide-react";

export default function SampleLoveTree() {
  // 예시 러브트리 데이터 - 실제 K-pop 입덕 과정
  const sampleNodes = [
    {
      id: 1,
      title: "스트레이 키즈 - God's Menu",
      platform: "YouTube",
      category: "댄스",
      x: 50,
      y: 20,
      color: "#4ECDC4",
      isFirst: true,
      likeCount: 128,
      connections: [2, 3],
      description: "첫 영상! 춤이 너무 멋있어서 충격"
    },
    {
      id: 2,
      title: "필릭스 귀여운 순간 모음",
      platform: "TikTok",
      category: "귀여움",
      x: 20,
      y: 60,
      color: "#FFD93D",
      likeCount: 89,
      connections: [4],
      description: "목소리가 너무 깊어서 반전 매력"
    },
    {
      id: 3,
      title: "스트레이 키즈 - MANIAC",
      platform: "YouTube",
      category: "섹시함",
      x: 80,
      y: 60,
      color: "#FF6B9D",
      likeCount: 156,
      connections: [5],
      description: "이 곡으로 완전히 빠져버림"
    },
    {
      id: 4,
      title: "필릭스 브이로그",
      platform: "YouTube",
      category: "보컬",
      x: 35,
      y: 90,
      color: "#9B59B6",
      likeCount: 67,
      connections: [],
      description: "일상이 이렇게 힐링될 줄이야"
    },
    {
      id: 5,
      title: "스트레이 키즈 콘서트 직캠",
      platform: "YouTube",
      category: "댄스",
      x: 65,
      y: 90,
      color: "#4ECDC4",
      likeCount: 203,
      isShining: true,
      connections: [],
      description: "다른 분도 올리신 영상! 반짝반짝✨"
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "귀여움": return <Heart className="w-3 h-3" />;
      case "섹시함": return <Sparkles className="w-3 h-3" />;
      case "댄스": return <Music className="w-3 h-3" />;
      case "보컬": return <Crown className="w-3 h-3" />;
      default: return <Play className="w-3 h-3" />;
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-love-pink/20 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-gray-800">
          <Sparkles className="w-5 h-5 text-love-pink" />
          <span>러브트리 예시 - 스트레이 키즈 입덕기</span>
          <Badge className="bg-gradient-to-r from-love-pink to-love-dark text-white ml-auto">
            예시
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="relative h-64 bg-gradient-to-br from-soft-pink to-white rounded-xl border-2 border-dashed border-love-pink/30 overflow-hidden">
          {/* 연결선 그리기 */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {sampleNodes.map(node =>
              node.connections.map(targetId => {
                const target = sampleNodes.find(n => n.id === targetId);
                if (!target) return null;
                return (
                  <line
                    key={`${node.id}-${targetId}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${target.x}%`}
                    y2={`${target.y}%`}
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                );
              })
            )}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B9D" />
                <stop offset="100%" stopColor="#523344" />
              </linearGradient>
            </defs>
          </svg>

          {/* 노드들 */}
          {sampleNodes.map(node => (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ 
                left: `${node.x}%`, 
                top: `${node.y}%`,
                zIndex: 2
              }}
            >
              {/* 노드 원 */}
              <div 
                className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white relative ${
                  node.isFirst ? 'ring-2 ring-sparkle-gold ring-offset-2' : ''
                } ${
                  node.isShining ? 'animate-pulse shadow-love-pink/50 shadow-lg' : ''
                }`}
                style={{ backgroundColor: node.color }}
              >
                {node.isFirst && <Crown className="w-3 h-3 text-sparkle-gold absolute -top-6" />}
                {getCategoryIcon(node.category)}
                {node.isShining && <Sparkles className="w-2 h-2 text-yellow-300 absolute -top-1 -right-1 animate-bounce" />}
              </div>

              {/* 호버 툴팁 */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs rounded-lg p-2 whitespace-nowrap pointer-events-none">
                <div className="font-semibold">{node.title}</div>
                <div className="text-gray-300">{node.description}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs bg-white/20 border-white/30">
                    {node.category}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3 text-red-400" />
                    <span>{node.likeCount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* 중앙 안내 텍스트 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
            <div className="text-center text-gray-400 text-sm">
              <Heart className="w-6 h-6 mx-auto mb-2 text-love-pink/50" />
              <p>이런 식으로 러브트리가 만들어져요!</p>
              <p className="text-xs mt-1">영상을 추가하면 자동으로 연결됩니다</p>
            </div>
          </div>
        </div>

        {/* 범례 */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-sparkle-gold rounded-full"></div>
            <span className="text-gray-600">귀여움</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-love-pink rounded-full"></div>
            <span className="text-gray-600">섹시함</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-tree-green rounded-full"></div>
            <span className="text-gray-600">댄스</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">보컬</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-love-pink/10 to-love-dark/10 rounded-xl">
          <p className="text-xs text-gray-600 text-center">
            💡 콘텐츠를 추가하면 이런 예쁜 마인드맵이 자동으로 만들어져요!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}