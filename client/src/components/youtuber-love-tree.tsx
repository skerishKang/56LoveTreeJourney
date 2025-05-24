import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Play, Bell, ThumbsUp, MessageCircle, Share2, Maximize2, Plus } from "lucide-react";
import { Link } from "wouter";

interface YouTuberNode {
  id: number;
  title: string;
  channel: string;
  category: string;
  viewCount?: string;
  duration?: string;
  x: number;
  y: number;
  connections: number[];
  color: string;
  isSubscribed: boolean;
  engagementLevel: number;
  isRecommended?: boolean;
}

interface YouTuberLoveTreeProps {
  items?: any[];
}

export default function YouTuberLoveTree({ items }: YouTuberLoveTreeProps) {
  if (!items || items.length === 0) {
    // 침착맨 구독 여정 예시
    const exampleNodes: YouTuberNode[] = [
      // 첫 영상
      {
        id: 1,
        title: "침착맨 게임 리뷰 첫 시청",
        channel: "침착맨",
        category: "게임",
        viewCount: "150만회",
        duration: "15:23",
        x: 8,
        y: 45,
        connections: [2],
        color: "#FF6B6B",
        isSubscribed: false,
        engagementLevel: 30,
      },
      // 관련 영상 시청
      {
        id: 2,
        title: "토크쇼 게스트 출연분",
        channel: "침착맨",
        category: "토크",
        viewCount: "80만회",
        x: 25,
        y: 50,
        connections: [3, 4],
        color: "#4ECDC4",
        isSubscribed: false,
        engagementLevel: 50,
      },
      // 다른 채널 발견
      {
        id: 3,
        title: "관련 채널 - 김성회의 G식백과",
        channel: "김성회의 G식백과",
        category: "예능",
        viewCount: "200만회",
        x: 45,
        y: 30,
        connections: [5],
        color: "#FFD93D",
        isSubscribed: false,
        engagementLevel: 40,
        isRecommended: true,
      },
      // 더 많은 침착맨 영상
      {
        id: 4,
        title: "침착맨 일상 브이로그",
        channel: "침착맨",
        category: "일상",
        viewCount: "120만회",
        x: 45,
        y: 70,
        connections: [6],
        color: "#9B59B6",
        isSubscribed: false,
        engagementLevel: 70,
      },
      // 구독 결정
      {
        id: 5,
        title: "김성회 채널 구독",
        channel: "김성회의 G식백과",
        category: "구독",
        x: 65,
        y: 25,
        connections: [7],
        color: "#FF4081",
        isSubscribed: true,
        engagementLevel: 85,
      },
      // 침착맨 구독
      {
        id: 6,
        title: "침착맨 채널 구독 + 알림설정",
        channel: "침착맨",
        category: "구독",
        x: 65,
        y: 75,
        connections: [8],
        color: "#FF4081",
        isSubscribed: true,
        engagementLevel: 90,
      },
      // 확장된 시청
      {
        id: 7,
        title: "추천 알고리즘으로 더 많은 채널 발견",
        channel: "여러 채널",
        category: "확장",
        x: 85,
        y: 35,
        connections: [9],
        color: "#8B5CF6",
        isSubscribed: false,
        engagementLevel: 60,
        isRecommended: true,
      },
      // 정기 시청자
      {
        id: 8,
        title: "매일 새 영상 시청하는 정기 시청자",
        channel: "침착맨",
        category: "정착",
        x: 85,
        y: 65,
        connections: [9],
        color: "#059669",
        isSubscribed: true,
        engagementLevel: 95,
      },
      // 커뮤니티 참여
      {
        id: 9,
        title: "댓글 작성 & 커뮤니티 탭 참여",
        channel: "침착맨",
        category: "소통",
        x: 95,
        y: 50,
        connections: [],
        color: "#DC2626",
        isSubscribed: true,
        engagementLevel: 100,
      }
    ];

    return (
      <div className="bg-white rounded-2xl border border-red-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <h3 className="text-xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent mb-2">
              📺 유튜버 구독 러브트리
            </h3>
            <p className="text-sm text-gray-600">첫 시청부터 열렬한 구독자까지의 여정!</p>
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
                <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                  📺 유튜버 구독 러브트리 - 전체 화면
                </h2>
                <div className="relative h-full bg-gradient-to-br from-red-50 via-white to-purple-50 rounded-2xl overflow-hidden">
                  <YouTuberRenderer nodes={exampleNodes} isLargeView={true} />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="relative h-96 overflow-hidden bg-gradient-to-br from-red-50 via-white to-purple-50 rounded-2xl">
          <YouTuberRenderer nodes={exampleNodes} isLargeView={false} />
        </div>
        
        {/* 구독 여정 단계 범례 */}
        <div className="mt-6 space-y-4">
          <h4 className="text-lg font-bold text-gray-800 text-center">🎬 구독 여정 단계</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-xl">
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">게임</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-teal-50 rounded-xl">
              <div className="w-4 h-4 bg-teal-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">토크</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-xl">
              <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">예능</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-xl">
              <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">일상</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-pink-50 rounded-xl">
              <div className="w-4 h-4 bg-pink-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">구독</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-indigo-50 rounded-xl">
              <div className="w-4 h-4 bg-indigo-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">확장</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-xl">
              <div className="w-4 h-4 bg-green-600 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">정착</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-xl">
              <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">소통</span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-red-100 to-purple-100 rounded-2xl text-center border-2 border-red-200">
          <p className="text-lg text-gray-800 mb-4 font-semibold">
            📈 구독자가 되는 과정을 분석!
          </p>
          <p className="text-sm text-gray-600 mb-4">
            첫 영상 시청부터 열렬한 팬이 되기까지<br />
            알고리즘과 추천의 힘을 시각화해보세요
          </p>
          <Button className="bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-xl px-8 py-3">
            <Plus className="w-5 h-5 mr-2" />
            구독 여정 만들기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-red-200 p-6">
      <p className="text-center text-gray-600">실제 시청 데이터로 구현 예정</p>
    </div>
  );
}

// 유튜버 구독 렌더러 컴포넌트
function YouTuberRenderer({ nodes, isLargeView }: { nodes: YouTuberNode[], isLargeView: boolean }) {
  const [draggedNodes, setDraggedNodes] = useState<YouTuberNode[]>(nodes);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraggedNodes(nodes);
  }, [nodes]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "게임": return "#FF6B6B";
      case "토크": return "#4ECDC4";
      case "예능": return "#FFD93D";
      case "일상": return "#9B59B6";
      case "구독": return "#FF4081";
      case "확장": return "#8B5CF6";
      case "정착": return "#059669";
      case "소통": return "#DC2626";
      default: return "#6B7280";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "게임": return "🎮";
      case "토크": return "🎙️";
      case "예능": return "😂";
      case "일상": return "📱";
      case "구독": return "🔔";
      case "확장": return "🌐";
      case "정착": return "⭐";
      case "소통": return "💬";
      default: return "📺";
    }
  };

  const cardSize = isLargeView ? { width: '200px', height: '120px' } : { width: '150px', height: '90px' };

  const handleMouseDown = (e: React.MouseEvent, nodeId: number) => {
    e.preventDefault();
    setIsDragging(true);
    setDraggedId(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedId || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(5, Math.min(95, x));
    const clampedY = Math.max(5, Math.min(95, y));

    setDraggedNodes(prev => 
      prev.map(node => 
        node.id === draggedId 
          ? { ...node, x: clampedX, y: clampedY }
          : node
      )
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedId(null);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'default' }}
    >
      {/* 연결선들 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {draggedNodes.map(node =>
          node.connections.map(targetId => {
            const target = draggedNodes.find(n => n.id === targetId);
            if (!target) return null;
            
            const startX = node.x;
            const startY = node.y;
            const endX = target.x;
            const endY = target.y;
            
            // 참여도에 따른 선 굵기
            const strokeWidth = Math.max(3, node.engagementLevel / 20);
            
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
                  strokeWidth={strokeWidth + 2}
                  fill="none"
                  strokeLinecap="round"
                  transform="translate(2, 2)"
                />
                {/* 메인 곡선 */}
                <path
                  d={path}
                  stroke={getCategoryColor(target.category)}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  className={target.isRecommended ? "animate-pulse" : ""}
                  style={{
                    filter: target.isSubscribed ? 'drop-shadow(0 0 8px currentColor)' : 'none'
                  }}
                />
                {/* 추천 알고리즘 효과 */}
                {target.isRecommended && (
                  <path
                    d={path}
                    stroke="url(#recommendGradient)"
                    strokeWidth={strokeWidth - 1}
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
          <linearGradient id="recommendGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="50%" stopColor="#4ECDC4" />
            <stop offset="100%" stopColor="#9B59B6" />
          </linearGradient>
        </defs>
      </svg>

      {/* 유튜브 영상 노드들 */}
      {draggedNodes.map((node) => (
        <div
          key={node.id}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 hover:z-50 select-none ${
            draggedId === node.id ? 'cursor-grabbing z-50' : 'cursor-grab'
          }`}
          style={{ 
            left: `${node.x}%`, 
            top: `${node.y}%`,
            zIndex: draggedId === node.id ? 50 : 10
          }}
          onMouseDown={(e) => handleMouseDown(e, node.id)}
        >
          <div 
            className={`relative bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-2xl
              ${node.isSubscribed ? 'ring-3 ring-red-400 ring-offset-2' : 'border-2 border-gray-200'}
              ${node.isRecommended ? 'shadow-purple-400/50' : ''}
            `}
            style={cardSize}
          >
            <div className="w-full h-full flex items-center justify-center text-gray-700 relative overflow-hidden bg-gradient-to-br from-white to-gray-50">
              <div className="relative z-10 text-center p-3 pointer-events-none">
                <div className={`${isLargeView ? 'text-2xl' : 'text-xl'} mb-2`}>
                  {getCategoryIcon(node.category)}
                </div>
                <div className={`${isLargeView ? 'text-sm' : 'text-xs'} font-bold leading-tight text-gray-800 mb-1`}>
                  {node.title.length > (isLargeView ? 22 : 16) ? node.title.slice(0, isLargeView ? 22 : 16) + '...' : node.title}
                </div>
                <div className="text-xs text-gray-600">{node.channel}</div>
                {node.viewCount && (
                  <div className="text-xs text-gray-500 mt-1">{node.viewCount}</div>
                )}
              </div>
              
              {/* 구독 상태 표시 */}
              {node.isSubscribed && (
                <div className="absolute -top-3 -right-3 z-40 pointer-events-none">
                  <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-xl border-2 border-white">
                    <Bell className="w-3 h-3" />
                  </div>
                </div>
              )}
              
              {/* 추천 알고리즘 표시 */}
              {node.isRecommended && (
                <div className="absolute -top-3 -left-3 z-40 pointer-events-none">
                  <div className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-xl border-2 border-white animate-pulse">
                    AI
                  </div>
                </div>
              )}

              {/* 재생 버튼 */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className={`${isLargeView ? 'w-12 h-12' : 'w-8 h-8'} bg-red-600 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform`}>
                  <Play className={`${isLargeView ? 'w-6 h-6' : 'w-4 h-4'} text-white ml-0.5`} fill="white" />
                </div>
              </div>

              {/* 참여도 표시 */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center z-30 pointer-events-none">
                <ThumbsUp className="w-3 h-3 mr-1" />
                {node.engagementLevel}%
              </div>
            </div>
          </div>

          {/* 상세 툴팁 */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/95 text-white text-xs rounded-lg p-4 whitespace-nowrap pointer-events-none z-50 shadow-xl">
            <div className="font-semibold text-sm mb-1">{node.title}</div>
            <div className="text-gray-300 mb-2">{node.channel} • {node.category}</div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <ThumbsUp className="w-3 h-3" />
                <span>참여도 {node.engagementLevel}%</span>
              </div>
              {node.isSubscribed && (
                <span className="text-red-400 text-xs">🔔 구독중</span>
              )}
              {node.isRecommended && (
                <span className="text-purple-400 text-xs">🤖 AI 추천</span>
              )}
              {node.viewCount && (
                <span className="text-gray-400 text-xs">👁️ {node.viewCount}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}