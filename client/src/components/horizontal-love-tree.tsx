import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Heart, Sparkles, Play, Plus } from "lucide-react";
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

interface HorizontalLoveTreeProps {
  items?: any[];
}

export default function HorizontalLoveTree({ items }: HorizontalLoveTreeProps) {
  if (!items || items.length === 0) {
    // Felix 입덕 과정 가로형 마인드맵 예시
    // 트리 가지 형태로 배치 - 중앙에서 시작해서 가지가 뻗어나가는 형태
    const exampleNodes: TreeNode[] = [
      {
        id: 1,
        title: "Felix Deep Voice Compilation",
        platform: "YouTube",
        category: "보컬",
        x: 15, // 시작점
        y: 45,
        connections: [2],
        color: "#9B59B6",
        isFirstContent: true,
        likeCount: 342,
      },
      {
        id: 2,
        title: "Stray Kids - God's Menu MV",
        platform: "YouTube", 
        category: "댄스",
        x: 35, // 주 줄기
        y: 50,
        connections: [3, 4, 5],
        color: "#4ECDC4",
        isFirstContent: false,
        likeCount: 1560,
      },
      {
        id: 3,
        title: "Felix Baking Brownies",
        platform: "YouTube",
        category: "귀여움", 
        x: 55, // 위쪽 가지
        y: 25,
        connections: [6],
        color: "#FFD93D",
        isFirstContent: false,
        likeCount: 892,
        isShining: true
      },
      {
        id: 4,
        title: "Stray Kids - MANIAC",
        platform: "YouTube",
        category: "섹시함",
        x: 55, // 아래쪽 가지
        y: 75,
        connections: [7],
        color: "#FF6B9D",
        isFirstContent: false,
        likeCount: 2030,
      },
      {
        id: 5,
        title: "Felix ASMR Voice",
        platform: "YouTube",
        category: "보컬",
        x: 55, // 중간 가지
        y: 50,
        connections: [],
        color: "#9B59B6",
        isFirstContent: false,
        likeCount: 756,
      },
      {
        id: 6,
        title: "Felix TikTok Moments",
        platform: "TikTok",
        category: "귀여움",
        x: 75, // 위쪽 끝 가지
        y: 15,
        connections: [],
        color: "#FFD93D", 
        isFirstContent: false,
        likeCount: 567,
      },
      {
        id: 7,
        title: "SKZ Concert Fancam",
        platform: "YouTube",
        category: "댄스",
        x: 75, // 아래쪽 끝 가지
        y: 85,
        connections: [],
        color: "#4ECDC4",
        isFirstContent: false,
        likeCount: 1284,
      }
    ];

    return (
      <div className="bg-white rounded-2xl border border-love-pink/20 p-6 shadow-lg">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-love-pink to-love-dark bg-clip-text text-transparent mb-2">
            🌳 Felix 입덕 러브트리
          </h3>
          <p className="text-sm text-gray-600">이런 식으로 당신만의 가로형 러브트리가 만들어져요!</p>
        </div>
        
        <div className="relative h-96 overflow-hidden bg-gradient-to-r from-soft-pink via-white to-love-pink/10 rounded-2xl border-2 border-dashed border-love-pink/30">
          {/* 아름다운 곡선 연결선들 */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {exampleNodes.map(node =>
              node.connections.map(targetId => {
                const target = exampleNodes.find(n => n.id === targetId);
                if (!target) return null;
                
                // 자연스러운 나무 가지 모양 곡선
                const startX = node.x;
                const startY = node.y;
                const endX = target.x;
                const endY = target.y;
                
                // 나무 가지처럼 자연스러운 곡선을 위한 제어점
                const midX = startX + (endX - startX) * 0.7;
                const branchOffset = (endY - startY) * 0.3;
                
                const path = `M ${startX}% ${startY}% 
                            Q ${midX}% ${startY}% ${midX}% ${startY + branchOffset}%
                            Q ${midX}% ${endY}% ${endX}% ${endY}%`;
                
                return (
                  <path
                    key={`${node.id}-${targetId}`}
                    d={path}
                    stroke="url(#treeGradient)"
                    strokeWidth="6"
                    fill="none"
                    className="drop-shadow-md"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              })
            )}
            
            <defs>
              <linearGradient id="treeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B4513" />
                <stop offset="30%" stopColor="#A0522D" />
                <stop offset="70%" stopColor="#CD853F" />
                <stop offset="100%" stopColor="#DEB887" />
              </linearGradient>
            </defs>
          </svg>

          {/* YouTube 스타일 영상 카드들 */}
          {exampleNodes.map((node) => (
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
                className={`relative bg-white rounded-2xl shadow-xl border-3 border-white overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:rotate-1
                  ${node.isFirstContent ? 'ring-3 ring-sparkle-gold ring-offset-4 animate-pulse' : ''}
                  ${node.isShining ? 'shadow-love-pink/60 shadow-2xl' : ''}
                `}
                style={{ width: '160px', height: '100px' }}
              >
                {/* 영상 썸네일 영역 */}
                <div 
                  className="w-full h-full flex items-center justify-center text-white relative overflow-hidden"
                  style={{ backgroundColor: node.color }}
                >
                  {/* 그라데이션 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40" />
                  
                  {/* 메인 콘텐츠 */}
                  <div className="relative z-10 text-center p-3">
                    <div className="text-3xl mb-2">📹</div>
                    <div className="text-xs font-bold leading-tight">
                      {node.title.length > 18 ? node.title.slice(0, 18) + '...' : node.title}
                    </div>
                  </div>
                  
                  {/* YouTube 재생 버튼 */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white ml-1" fill="white" />
                    </div>
                  </div>
                  
                  {/* 플랫폼 배지 */}
                  <div className="absolute top-3 left-3 z-30">
                    <Badge className="text-xs bg-black/80 text-white border-none px-3 py-1 font-bold">
                      {node.platform}
                    </Badge>
                  </div>
                  
                  {/* 카테고리 표시 */}
                  <div className="absolute top-3 right-3 z-30">
                    <div 
                      className="w-5 h-5 rounded-full border-3 border-white shadow-lg"
                      style={{ backgroundColor: node.color }}
                    />
                  </div>
                  
                  {/* 좋아요 수 */}
                  <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-3 py-1 rounded-full flex items-center z-30 font-bold">
                    <Heart className="w-3 h-3 mr-1 text-red-400" />
                    {node.likeCount.toLocaleString()}
                  </div>
                  
                  {/* 첫 콘텐츠 왕관 */}
                  {node.isFirstContent && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-40">
                      <Crown className="w-6 h-6 text-sparkle-gold drop-shadow-lg animate-bounce" />
                      <div className="text-xs text-sparkle-gold font-bold text-center mt-1">첫 영상</div>
                    </div>
                  )}
                  
                  {/* 반짝이는 효과 */}
                  {node.isShining && (
                    <div className="absolute -top-2 -right-2 z-40">
                      <Sparkles className="w-5 h-5 text-yellow-300 animate-bounce" />
                      <div className="absolute -bottom-6 -right-2 text-xs text-yellow-600 font-bold whitespace-nowrap">
                        ✨ 핫한 영상!
                      </div>
                    </div>
                  )}
                </div>

                {/* 하단 정보 영역 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 z-30">
                  <div className="text-white text-xs font-bold leading-tight mb-1">
                    {node.title.length > 22 ? node.title.slice(0, 22) + '...' : node.title}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-xs">{node.category}</span>
                    <div className="flex items-center space-x-1 text-xs">
                      <Heart className="w-3 h-3 text-red-400" />
                      <span className="text-white font-bold">{node.likeCount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 상세 호버 툴팁 */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/95 text-white text-sm rounded-xl p-4 whitespace-nowrap pointer-events-none z-50 shadow-2xl">
                <div className="font-bold text-base mb-2">{node.title}</div>
                <div className="text-gray-300 mb-3">{node.platform} • {node.category}</div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="font-bold">{node.likeCount.toLocaleString()}</span>
                  </div>
                  {node.isShining && (
                    <span className="text-yellow-300 text-sm font-bold">✨ 다른 분도 추천한 영상!</span>
                  )}
                  {node.isFirstContent && (
                    <span className="text-sparkle-gold text-sm font-bold">👑 입덕 시작점</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* 중앙 안내 메시지 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-30">
            <div className="text-center text-gray-500">
              <Heart className="w-12 h-12 mx-auto mb-3 text-love-pink/50" />
              <p className="text-lg font-medium">당신만의 입덕 과정이 여기에!</p>
              <p className="text-sm mt-1">영상을 추가하면 자동으로 연결됩니다</p>
            </div>
          </div>
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

        {/* 액션 버튼 */}
        <div className="mt-8 p-6 bg-gradient-to-r from-love-pink/10 via-tree-green/10 to-love-dark/10 rounded-2xl text-center border-2 border-love-pink/20">
          <p className="text-lg text-gray-800 mb-4 font-semibold">
            💡 이런 아름다운 가로형 마인드맵이 자동으로 만들어져요!
          </p>
          <p className="text-sm text-gray-600 mb-4">
            YouTube, TikTok, Instagram 등의 영상을 추가하면<br />
            곡선으로 연결된 예쁜 입덕 과정 트리가 완성됩니다
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

  // 실제 데이터가 있을 때의 처리 로직
  return (
    <div className="bg-white rounded-xl border border-love-pink/20 p-6">
      <p className="text-center text-gray-600">실제 콘텐츠로 가로형 마인드맵 구현 예정</p>
    </div>
  );
}