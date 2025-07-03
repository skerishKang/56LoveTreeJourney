import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Crown, Heart, Sparkles, Play, Plus, Maximize2, Star } from "lucide-react";
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
  isPopular?: boolean; // 여러 명이 같은 영상을 올렸을 때
}

interface MindmapLoveTreeProps {
  items?: any[];
}

export default function MindmapLoveTree({ items }: MindmapLoveTreeProps) {
  if (!items || items.length === 0) {
    // 실제 입덕 여정을 담은 마인드맵 예시
    const exampleNodes: TreeNode[] = [
      // 첫 영상 (입덕 시작점)
      {
        id: 1,
        title: "첫 만남 - Felix 저음 컴필레이션",
        platform: "YouTube",
        category: "보컬",
        x: 8,
        y: 45,
        connections: [2],
        color: "#9B59B6",
        isFirstContent: true,
        likeCount: 342,
      },
      // 주로 가는 채널 발견
      {
        id: 2,
        title: "Stray Kids - God's Menu MV",
        platform: "YouTube", 
        category: "댄스",
        x: 35,
        y: 50,
        connections: [3, 4, 5],
        color: "#4ECDC4",
        isFirstContent: false,
        likeCount: 1560,
      },
      // 다양한 플랫폼 탐색
      {
        id: 3,
        title: "Felix 베이킹 브이로그",
        platform: "YouTube",
        category: "귀여움", 
        x: 65,
        y: 20,
        connections: [6, 8],
        color: "#FFD93D",
        isFirstContent: false,
        likeCount: 892,
        isShining: true,
        isPopular: true
      },
      // 더 많은 영상 콘텐츠
      {
        id: 4,
        title: "Felix 솔로 무대 모음",
        platform: "YouTube",
        category: "댄스",
        x: 70,
        y: 50,
        connections: [9],
        color: "#4ECDC4",
        isFirstContent: false,
        likeCount: 756,
      },
      // 라이브 영상
      {
        id: 5,
        title: "Stray Kids V LIVE",
        platform: "V LIVE",
        category: "일상",
        x: 60,
        y: 80,
        connections: [7, 10],
        color: "#8A2BE2",
        isFirstContent: false,
        likeCount: 2030,
        isPopular: true
      },
      // 인스타 릴스
      {
        id: 6,
        title: "Felix 인스타 릴스",
        platform: "Instagram",
        category: "일상",
        x: 85,
        y: 15,
        connections: [],
        color: "#E1306C", 
        isFirstContent: false,
        likeCount: 567,
      },
      // 더 많은 뮤직비디오
      {
        id: 7,
        title: "Stray Kids - S-Class MV",
        platform: "YouTube",
        category: "뮤직비디오",
        x: 85,
        y: 85,
        connections: [],
        color: "#FF6B6B",
        isFirstContent: false,
        likeCount: 1284,
      },
      // TikTok 숏폼 영상
      {
        id: 8,
        title: "Felix 틱톡 댄스 챌린지",
        platform: "TikTok",
        category: "댄스",
        x: 90,
        y: 30,
        connections: [],
        color: "#4ECDC4",
        isFirstContent: false,
        likeCount: 3421,
      },
      // 예능 영상
      {
        id: 9,
        title: "Stray Kids 예능 출연",
        platform: "YouTube",
        category: "예능",
        x: 95,
        y: 55,
        connections: [],
        color: "#FFA500",
        isFirstContent: false,
        likeCount: 892,
      },
      // 라이브 공연 영상
      {
        id: 10,
        title: "Felix 라이브 공연 직캠",
        platform: "YouTube",
        category: "라이브",
        x: 90,
        y: 75,
        connections: [],
        color: "#9370DB",
        isFirstContent: false,
        likeCount: 1567,
      }
    ];

    return (
      <div className="bg-white rounded-2xl border border-love-pink/20 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <h3 className="text-xl font-bold bg-gradient-to-r from-love-pink to-love-dark bg-clip-text text-transparent mb-2">
              🌳 Felix 입덕 러브트리
            </h3>
            <p className="text-sm text-gray-600">드래그로 자유롭게 움직이는 마인드맵!</p>
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
        
        {/* 영상 콘텐츠 카테고리 범례 */}
        <div className="mt-6 space-y-4">
          <h4 className="text-lg font-bold text-gray-800 text-center">🎥 영상 콘텐츠 카테고리</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center space-x-2 p-3 bg-amber-50 rounded-xl">
              <div className="w-4 h-4 bg-amber-400 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">귀여움</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-pink-50 rounded-xl">
              <div className="w-4 h-4 bg-love-pink rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">섹시함</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-teal-50 rounded-xl">
              <div className="w-4 h-4 bg-tree-green rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">댄스</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-xl">
              <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">보컬</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-xl">
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">뮤직비디오</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-xl">
              <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">예능</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-indigo-50 rounded-xl">
              <div className="w-4 h-4 bg-indigo-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">라이브</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
              <div className="w-4 h-4 bg-gray-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">일상</span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-love-pink/10 to-love-dark/10 rounded-2xl text-center border-2 border-love-pink/20">
          <p className="text-lg text-gray-800 mb-4 font-semibold">
            🎥 영상으로 만드는 입덕 러브트리!
          </p>
          <p className="text-sm text-gray-600 mb-4">
            YouTube, TikTok, Instagram 등 다양한 영상 콘텐츠로<br />
            당신만의 입덕 과정 마인드맵을 완성해보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/add">
              <Button className="bg-gradient-to-r from-love-pink via-tree-green to-love-dark hover:opacity-90 text-white shadow-xl px-6 py-3">
                <Plus className="w-5 h-5 mr-2" />
                첫 영상 추가하기
              </Button>
            </Link>
          </div>
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

// 드래그 가능한 마인드맵 렌더러 컴포넌트
function MindmapRenderer({ nodes, isLargeView }: { nodes: TreeNode[], isLargeView: boolean }) {
  const [draggedNodes, setDraggedNodes] = useState<TreeNode[]>(nodes);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraggedNodes(nodes);
  }, [nodes]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "귀여움": return "#FCD34D";
      case "섹시함": return "#FF6B9D"; 
      case "댄스": return "#4ECDC4";
      case "보컬": return "#9B59B6";
      case "뮤직비디오": return "#FF6B6B";
      case "예능": return "#FFA500";
      case "라이브": return "#9370DB";
      case "일상": return "#E1306C";
      default: return "#8B4513";
    }
  };

  const getPlatformEmoji = (platform: string) => {
    switch (platform) {
      case "YouTube": return "📺";
      case "TikTok": return "🎵";
      case "Instagram": return "📷";
      case "Twitter": return "🐦";
      case "Facebook": return "👥";
      case "더쿠": return "💬";
      case "여시": return "👭";
      case "나무위키": return "📚";
      case "팬클럽": return "💝";
      case "위버스": return "🌟";
      case "온라인 쇼핑몰": return "🛒";
      default: return "📱";
    }
  };

  const cardSize = isLargeView ? { width: '200px', height: '120px' } : { width: '140px', height: '90px' };

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

    // 경계 체크
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
            
            // 자연스러운 곡선 생성
            const controlX1 = startX + (endX - startX) * 0.3;
            const controlY1 = startY + (endY - startY) * 0.1;
            const controlX2 = startX + (endX - startX) * 0.7;
            const controlY2 = endY + (startY - endY) * 0.1;
            
            const path = `M ${startX}% ${startY}% C ${controlX1}% ${controlY1}% ${controlX2}% ${controlY2}% ${endX}% ${endY}%`;
            
            // 인기 영상으로 연결되는 선은 초록색으로 강조
            const isPopularConnection = target.isPopular;
            const connectionColor = isPopularConnection ? "#10B981" : getCategoryColor(target.category);
            const strokeWidth = isPopularConnection ? (isLargeView ? "10" : "8") : (isLargeView ? "6" : "4");
            
            return (
              <g key={`${node.id}-${targetId}`}>
                {/* 그림자 */}
                <path
                  d={path}
                  stroke="#00000015"
                  strokeWidth={isLargeView ? "12" : "10"}
                  fill="none"
                  strokeLinecap="round"
                  transform="translate(2, 2)"
                />
                {/* 메인 곡선 */}
                <path
                  d={path}
                  stroke={connectionColor}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  className={target.isShining || isPopularConnection ? "animate-pulse" : ""}
                  style={{
                    filter: (target.isShining || isPopularConnection) ? 'drop-shadow(0 0 12px currentColor)' : 'none'
                  }}
                />
                {/* 인기 영상 특별 효과 */}
                {isPopularConnection && (
                  <>
                    {/* 초록색 외곽선 */}
                    <path
                      d={path}
                      stroke="#34D399"
                      strokeWidth={isLargeView ? "14" : "12"}
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.4"
                      className="animate-pulse"
                    />
                    {/* 반짝이는 점들 */}
                    <path
                      d={path}
                      stroke="url(#popularGradient)"
                      strokeWidth={isLargeView ? "4" : "3"}
                      fill="none"
                      strokeLinecap="round"
                      className="animate-bounce"
                      strokeDasharray="12,8"
                    />
                  </>
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
          <linearGradient id="popularGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="25%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#6EE7B7" />
            <stop offset="75%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>

      {/* 드래그 가능한 영상 카드들 */}
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
              ${node.isFirstContent ? 'ring-3 ring-sparkle-gold ring-offset-2 animate-pulse' : ''}
              ${node.isShining ? 'shadow-love-pink/60 shadow-2xl' : ''}
              ${node.isPopular ? 'border-4 border-green-400 ring-4 ring-green-200 ring-offset-2 shadow-green-400/50' : 'border-2 border-white'}
            `}
            style={cardSize}
          >
            <div className="w-full h-full flex items-center justify-center text-gray-700 relative overflow-hidden bg-gradient-to-br from-white to-gray-100">
              <div className="relative z-10 text-center p-3 pointer-events-none">
                <div className={`${isLargeView ? 'text-3xl' : 'text-2xl'} mb-2`}>
                  {getPlatformEmoji(node.platform)}
                </div>
                <div className={`${isLargeView ? 'text-sm' : 'text-xs'} font-bold leading-tight text-gray-800`}>
                  {node.title.length > (isLargeView ? 20 : 15) ? node.title.slice(0, isLargeView ? 20 : 15) + '...' : node.title}
                </div>
                <div className="text-xs text-gray-600 mt-1">{node.platform}</div>
              </div>
              
              {/* YouTube 재생 버튼 */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className={`${isLargeView ? 'w-14 h-14' : 'w-10 h-10'} bg-red-600 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform`}>
                  <Play className={`${isLargeView ? 'w-7 h-7' : 'w-5 h-5'} text-white ml-0.5`} fill="white" />
                </div>
              </div>
              
              {/* 첫 콘텐츠 왕관 */}
              {node.isFirstContent && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
                  <Crown className={`${isLargeView ? 'w-6 h-6' : 'w-4 h-4'} text-sparkle-gold drop-shadow-lg animate-bounce`} />
                </div>
              )}
              
              {/* 인기 영상 뱃지 */}
              {node.isPopular && (
                <div className="absolute -top-3 -right-3 z-40 pointer-events-none">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xl border-2 border-white animate-pulse">
                    🔥 HOT
                  </div>
                </div>
              )}
              
              {/* 반짝이는 효과 */}
              {node.isShining && !node.isPopular && (
                <div className="absolute -top-2 -right-2 z-40 pointer-events-none">
                  <Sparkles className={`${isLargeView ? 'w-5 h-5' : 'w-4 h-4'} text-amber-300 animate-bounce`} />
                </div>
              )}

              {/* 좋아요 수 */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center z-30 pointer-events-none">
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
              {node.isPopular && (
                <span className="text-green-400 text-xs font-bold">🔥 여러 명이 선택한 핫한 영상!</span>
              )}
              {node.isShining && !node.isPopular && (
                <span className="text-amber-300 text-xs">✨ 다른 분도 추천!</span>
              )}
              {node.isFirstContent && (
                <span className="text-sparkle-gold text-xs">👑 입덕 시작점</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}