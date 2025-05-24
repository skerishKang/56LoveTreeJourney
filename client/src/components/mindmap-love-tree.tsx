import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Crown, Heart, Sparkles, Play, Plus, Maximize2 } from "lucide-react";
import { Link } from "wouter";

interface TreeNode {
  id: number;
  title: string;
  platform: string;
  thumbnailUrl?: string;
  contentUrl?: string;
  category: string;
  x: number;
  y: number;
  connections: number[];
  color: string;
  isFirstContent: boolean;
  likeCount: number;
  isShining?: boolean;
}

interface MindmapLoveTreeProps {
  items?: any[];
}

export default function MindmapLoveTree({ items }: MindmapLoveTreeProps) {
  if (!items || items.length === 0) {
    // 첨부 이미지처럼 자유도가 있는 마인드맵 예시
    const exampleNodes: TreeNode[] = [
      // 시작점 (왼쪽)
      {
        id: 1,
        title: "Felix Deep Voice Compilation",
        platform: "YouTube",
        category: "보컬",
        x: 8,
        y: 45,
        connections: [2],
        color: "#9B59B6",
        isFirstContent: true,
        likeCount: 342,
      },
      // 중심 허브
      {
        id: 2,
        title: "Stray Kids - God's Menu",
        platform: "YouTube", 
        category: "댄스",
        x: 35,
        y: 50,
        connections: [3, 4, 5],
        color: "#4ECDC4",
        isFirstContent: false,
        likeCount: 1560,
      },
      // 위쪽 가지
      {
        id: 3,
        title: "Felix Baking Brownies",
        platform: "YouTube",
        category: "귀여움", 
        x: 65,
        y: 20,
        connections: [6],
        color: "#FFD93D",
        isFirstContent: false,
        likeCount: 892,
        isShining: true
      },
      // 중간 가지
      {
        id: 4,
        title: "Felix ASMR Voice",
        platform: "YouTube",
        category: "보컬",
        x: 70,
        y: 50,
        connections: [],
        color: "#9B59B6",
        isFirstContent: false,
        likeCount: 756,
      },
      // 아래쪽 가지
      {
        id: 5,
        title: "Stray Kids - MANIAC",
        platform: "YouTube",
        category: "섹시함",
        x: 60,
        y: 80,
        connections: [7],
        color: "#FF6B9D",
        isFirstContent: false,
        likeCount: 2030,
      },
      // 위쪽 끝
      {
        id: 6,
        title: "Felix TikTok Dance",
        platform: "TikTok",
        category: "댄스",
        x: 85,
        y: 15,
        connections: [],
        color: "#4ECDC4", 
        isFirstContent: false,
        likeCount: 567,
      },
      // 아래쪽 끝
      {
        id: 7,
        title: "SKZ Concert Fancam",
        platform: "YouTube",
        category: "댄스",
        x: 85,
        y: 85,
        connections: [],
        color: "#4ECDC4",
        isFirstContent: false,
        likeCount: 1284,
      }
    ];

    return (
      <div className="bg-white rounded-2xl border border-love-pink/20 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <h3 className="text-xl font-bold bg-gradient-to-r from-love-pink to-love-dark bg-clip-text text-transparent mb-2">
              🌳 Felix 입덕 러브트리
            </h3>
            <p className="text-sm text-gray-600">자유로운 마인드맵 형태로 연결된 입덕 과정!</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Maximize2 className="w-4 h-4" />
                <span>큰 화면으로</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl w-full h-[90vh] p-8">
              <div className="h-full">
                <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-love-pink to-love-dark bg-clip-text text-transparent">
                  🌳 Felix 입덕 러브트리 - 전체 화면
                </h2>
                <div className="relative h-full bg-gradient-to-br from-soft-pink via-white to-love-pink/10 rounded-2xl overflow-hidden">
                  <MindmapRenderer nodes={exampleNodes} isLargeView={true} />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="relative h-96 overflow-hidden bg-gradient-to-br from-soft-pink via-white to-love-pink/10 rounded-2xl">
          <MindmapRenderer nodes={exampleNodes} isLargeView={false} />
        </div>
        
        {/* 카테고리 범례 */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-xl">
            <div className="w-5 h-5 bg-yellow-400 rounded-full border-2 border-white shadow-md"></div>
            <span className="text-gray-700 font-semibold text-sm">귀여움</span>
          </div>
          <div className="flex items-center space-x-3 p-2 bg-pink-50 rounded-xl">
            <div className="w-5 h-5 bg-love-pink rounded-full border-2 border-white shadow-md"></div>
            <span className="text-gray-700 font-semibold text-sm">섹시함</span>
          </div>
          <div className="flex items-center space-x-3 p-2 bg-teal-50 rounded-xl">
            <div className="w-5 h-5 bg-tree-green rounded-full border-2 border-white shadow-md"></div>
            <span className="text-gray-700 font-semibold text-sm">댄스</span>
          </div>
          <div className="flex items-center space-x-3 p-2 bg-purple-50 rounded-xl">
            <div className="w-5 h-5 bg-purple-500 rounded-full border-2 border-white shadow-md"></div>
            <span className="text-gray-700 font-semibold text-sm">보컬</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-love-pink/10 to-love-dark/10 rounded-2xl text-center border-2 border-love-pink/20">
          <p className="text-lg text-gray-800 mb-4 font-semibold">
            💡 이런 자유로운 마인드맵이 자동으로 만들어져요!
          </p>
          <p className="text-sm text-gray-600 mb-4">
            첨부해주신 이미지처럼 자연스러운 곡선으로 연결된<br />
            아름다운 입덕 과정 마인드맵이 완성됩니다
          </p>
          <Link href="/add">
            <Button className="bg-gradient-to-r from-love-pink via-tree-green to-love-dark hover:opacity-90 text-white shadow-xl text-lg px-8 py-3">
              <Plus className="w-5 h-5 mr-2" />
              첫 콘텐츠 추가하기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-love-pink/20 p-6">
      <p className="text-center text-gray-600">실제 콘텐츠로 마인드맵 구현 예정</p>
    </div>
  );
}

// 마인드맵 렌더러 컴포넌트
function MindmapRenderer({ nodes, isLargeView }: { nodes: TreeNode[], isLargeView: boolean }) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "귀여움": return "#FFD93D";
      case "섹시함": return "#FF6B9D"; 
      case "댄스": return "#4ECDC4";
      case "보컬": return "#9B59B6";
      default: return "#8B4513";
    }
  };

  const cardSize = isLargeView ? { width: '200px', height: '120px' } : { width: '140px', height: '90px' };

  return (
    <>
      {/* 연결선들 */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        {nodes.map(node =>
          node.connections.map(targetId => {
            const target = nodes.find(n => n.id === targetId);
            if (!target) return null;
            
            const startX = node.x;
            const startY = node.y;
            const endX = target.x;
            const endY = target.y;
            
            // 첨부 이미지처럼 자연스러운 곡선 생성
            const controlX1 = startX + (endX - startX) * 0.3;
            const controlY1 = startY + (endY - startY) * 0.1;
            const controlX2 = startX + (endX - startX) * 0.7;
            const controlY2 = endY + (startY - endY) * 0.1;
            
            const path = `M ${startX}% ${startY}% C ${controlX1}% ${controlY1}% ${controlX2}% ${controlY2}% ${endX}% ${endY}%`;
            
            return (
              <g key={`${node.id}-${targetId}`}>
                {/* 그림자 */}
                <path
                  d={path}
                  stroke="#00000015"
                  strokeWidth={isLargeView ? "8" : "6"}
                  fill="none"
                  strokeLinecap="round"
                  transform="translate(2, 2)"
                />
                {/* 메인 곡선 */}
                <path
                  d={path}
                  stroke={getCategoryColor(target.category)}
                  strokeWidth={isLargeView ? "6" : "4"}
                  fill="none"
                  strokeLinecap="round"
                  className={target.isShining ? "animate-pulse" : ""}
                  style={{
                    filter: target.isShining ? 'drop-shadow(0 0 8px currentColor)' : 'none'
                  }}
                />
                {/* 반짝이는 효과 */}
                {target.isShining && (
                  <path
                    d={path}
                    stroke="url(#sparkleGradient)"
                    strokeWidth={isLargeView ? "3" : "2"}
                    fill="none"
                    strokeLinecap="round"
                    className="animate-pulse"
                    strokeDasharray="8,4"
                  />
                )}
              </g>
            );
          })
        )}
        
        <defs>
          <linearGradient id="sparkleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FF69B4" />
          </linearGradient>
        </defs>
      </svg>

      {/* 영상 카드들 */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-300 hover:z-50"
          style={{ 
            left: `${node.x}%`, 
            top: `${node.y}%`,
            zIndex: 10
          }}
        >
          <div 
            className={`relative bg-white rounded-xl shadow-xl border-2 border-white overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-2xl
              ${node.isFirstContent ? 'ring-3 ring-sparkle-gold ring-offset-2 animate-pulse' : ''}
              ${node.isShining ? 'shadow-love-pink/60 shadow-2xl' : ''}
            `}
            style={cardSize}
          >
            <div className="w-full h-full flex items-center justify-center text-gray-700 relative overflow-hidden bg-gradient-to-br from-white to-gray-100">
              <div className="relative z-10 text-center p-3">
                <div className={`${isLargeView ? 'text-3xl' : 'text-2xl'} mb-2`}>📹</div>
                <div className={`${isLargeView ? 'text-sm' : 'text-xs'} font-bold leading-tight text-gray-800`}>
                  {node.title.length > (isLargeView ? 20 : 15) ? node.title.slice(0, isLargeView ? 20 : 15) + '...' : node.title}
                </div>
                <div className="text-xs text-gray-600 mt-1">{node.platform}</div>
              </div>
              
              {/* YouTube 재생 버튼 */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className={`${isLargeView ? 'w-14 h-14' : 'w-10 h-10'} bg-red-600 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform`}>
                  <Play className={`${isLargeView ? 'w-7 h-7' : 'w-5 h-5'} text-white ml-0.5`} fill="white" />
                </div>
              </div>
              
              {/* 첫 콘텐츠 왕관 */}
              {node.isFirstContent && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-40">
                  <Crown className={`${isLargeView ? 'w-6 h-6' : 'w-4 h-4'} text-sparkle-gold drop-shadow-lg animate-bounce`} />
                </div>
              )}
              
              {/* 반짝이는 효과 */}
              {node.isShining && (
                <div className="absolute -top-2 -right-2 z-40">
                  <Sparkles className={`${isLargeView ? 'w-5 h-5' : 'w-4 h-4'} text-yellow-300 animate-bounce`} />
                </div>
              )}

              {/* 좋아요 수 */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center z-30">
                <Heart className="w-3 h-3 mr-1 text-red-400" />
                {node.likeCount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* 상세 툴팁 */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/95 text-white text-xs rounded-lg p-4 whitespace-nowrap pointer-events-none z-50 shadow-xl">
            <div className="font-semibold text-sm mb-1">{node.title}</div>
            <div className="text-gray-300 mb-2">{node.platform} • {node.category}</div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3 text-red-400" />
                <span>{node.likeCount.toLocaleString()}</span>
              </div>
              {node.isShining && (
                <span className="text-yellow-300 text-xs">✨ 다른 분도 추천!</span>
              )}
              {node.isFirstContent && (
                <span className="text-sparkle-gold text-xs">👑 입덕 시작점</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}