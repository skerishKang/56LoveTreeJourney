import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Star, Users, Calendar, Tv, Maximize2, Plus } from "lucide-react";
import { Link } from "wouter";

interface DramaNode {
  id: number;
  title: string;
  type: string;
  genre: string;
  episode?: string;
  rating?: number;
  watchTime?: string;
  x: number;
  y: number;
  connections: number[];
  color: string;
  isAddicted: boolean;
  emotionalImpact: number;
  isRecommended?: boolean;
}

interface DramaLoveTreeProps {
  items?: any[];
}

export default function DramaLoveTree({ items }: DramaLoveTreeProps) {
  if (!items || items.length === 0) {
    // 이준영 입덕 여정 (약한영웅 → 다른 작품들)
    const exampleNodes: DramaNode[] = [
      // 첫 만남
      {
        id: 1,
        title: "약한영웅 Class 1 - 금성제 역할",
        type: "웹드라마",
        genre: "액션",
        episode: "EP 1-8",
        rating: 9.2,
        x: 8,
        y: 45,
        connections: [2],
        color: "#DC2626",
        isAddicted: false,
        emotionalImpact: 40,
      },
      // 배우에 대한 관심 증가
      {
        id: 2,
        title: "이준영 인터뷰 영상들",
        type: "예능",
        genre: "토크",
        watchTime: "2시간",
        x: 25,
        y: 50,
        connections: [3, 4],
        color: "#7C3AED",
        isAddicted: false,
        emotionalImpact: 60,
      },
      // 다른 작품 탐색
      {
        id: 3,
        title: "이준영 출연 다른 드라마 검색",
        type: "검색",
        genre: "정보",
        x: 45,
        y: 30,
        connections: [5],
        color: "#2563EB",
        isAddicted: false,
        emotionalImpact: 50,
        isRecommended: true,
      },
      // 팬 콘텐츠 발견
      {
        id: 4,
        title: "팬 편집 영상 & 팬 계정 팔로우",
        type: "SNS",
        genre: "팬 콘텐츠",
        x: 45,
        y: 70,
        connections: [6],
        color: "#DB2777",
        isAddicted: true,
        emotionalImpact: 80,
      },
      // 필모그래피 탐험
      {
        id: 5,
        title: "과거 작품 - '연애혁명' 정주행",
        type: "웹드라마",
        genre: "로맨스",
        episode: "EP 1-16",
        rating: 8.8,
        x: 65,
        y: 25,
        connections: [7],
        color: "#F59E0B",
        isAddicted: true,
        emotionalImpact: 85,
      },
      // 덕질 본격 시작
      {
        id: 6,
        title: "이준영 공식 팬카페 가입",
        type: "커뮤니티",
        genre: "팬 활동",
        x: 65,
        y: 75,
        connections: [8],
        color: "#10B981",
        isAddicted: true,
        emotionalImpact: 90,
      },
      // 최신 작품 추적
      {
        id: 7,
        title: "신작 '모범택시 3' 출연 소식",
        type: "드라마",
        genre: "액션",
        episode: "방영 예정",
        x: 85,
        y: 35,
        connections: [9],
        color: "#8B5CF6",
        isAddicted: true,
        emotionalImpact: 95,
        isRecommended: true,
      },
      // 굿즈 구매
      {
        id: 8,
        title: "포토북 & 굿즈 구매",
        type: "굿즈",
        genre: "소장품",
        x: 85,
        y: 65,
        connections: [9],
        color: "#059669",
        isAddicted: true,
        emotionalImpact: 85,
      },
      // 완전 입덕
      {
        id: 9,
        title: "팬미팅 참여 & 사진 촬영",
        type: "오프라인",
        genre: "팬미팅",
        watchTime: "3시간",
        x: 95,
        y: 50,
        connections: [],
        color: "#DC2626",
        isAddicted: true,
        emotionalImpact: 100,
      }
    ];

    return (
      <div className="bg-white rounded-2xl border border-pink-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <h3 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
              🎬 드라마 입덕 러브트리
            </h3>
            <p className="text-sm text-gray-600">이준영 입덕부터 열렬한 팬까지의 여정!</p>
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
                <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                  🎬 드라마 입덕 러브트리 - 전체 화면
                </h2>
                <div className="relative h-full bg-gradient-to-br from-pink-50 via-white to-red-50 rounded-2xl overflow-hidden">
                  <DramaRenderer nodes={exampleNodes} isLargeView={true} />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="relative h-96 overflow-hidden bg-gradient-to-br from-pink-50 via-white to-red-50 rounded-2xl">
          <DramaRenderer nodes={exampleNodes} isLargeView={false} />
        </div>
        
        {/* 입덕 과정 단계 범례 */}
        <div className="mt-6 space-y-4">
          <h4 className="text-lg font-bold text-gray-800 text-center">💝 입덕 과정 단계</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-xl">
              <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">웹드라마</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-xl">
              <div className="w-4 h-4 bg-purple-600 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">예능</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-xl">
              <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">정보</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-pink-50 rounded-xl">
              <div className="w-4 h-4 bg-pink-600 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">팬 콘텐츠</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-xl">
              <div className="w-4 h-4 bg-yellow-600 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">로맨스</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-xl">
              <div className="w-4 h-4 bg-green-600 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">팬 활동</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-indigo-50 rounded-xl">
              <div className="w-4 h-4 bg-indigo-600 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">액션</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-emerald-50 rounded-xl">
              <div className="w-4 h-4 bg-emerald-600 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">굿즈</span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-pink-100 to-red-100 rounded-2xl text-center border-2 border-pink-200">
          <p className="text-lg text-gray-800 mb-4 font-semibold">
            💕 배우/캐릭터 입덕의 모든 과정!
          </p>
          <p className="text-sm text-gray-600 mb-4">
            첫 작품 만남부터 열렬한 팬이 되기까지<br />
            감정적 몰입도와 팬 활동의 변화를 추적
          </p>
          <Button className="bg-gradient-to-r from-pink-600 to-red-600 text-white shadow-xl px-8 py-3">
            <Plus className="w-5 h-5 mr-2" />
            입덕 여정 만들기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-pink-200 p-6">
      <p className="text-center text-gray-600">실제 시청 데이터로 구현 예정</p>
    </div>
  );
}

// 드라마 입덕 렌더러 컴포넌트
function DramaRenderer({ nodes, isLargeView }: { nodes: DramaNode[], isLargeView: boolean }) {
  const [draggedNodes, setDraggedNodes] = useState<DramaNode[]>(nodes);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraggedNodes(nodes);
  }, [nodes]);

  const getGenreColor = (genre: string) => {
    switch (genre) {
      case "액션": return "#DC2626";
      case "토크": return "#7C3AED";
      case "정보": return "#2563EB";
      case "팬 콘텐츠": return "#DB2777";
      case "로맨스": return "#F59E0B";
      case "팬 활동": return "#10B981";
      case "소장품": return "#059669";
      case "팬미팅": return "#DC2626";
      default: return "#6B7280";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "웹드라마": return "🎭";
      case "예능": return "🎙️";
      case "검색": return "🔍";
      case "SNS": return "📱";
      case "커뮤니티": return "👥";
      case "드라마": return "📺";
      case "굿즈": return "🛍️";
      case "오프라인": return "🎪";
      default: return "🎬";
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
            
            // 감정적 몰입도에 따른 선 굵기
            const strokeWidth = Math.max(3, node.emotionalImpact / 20);
            
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
                  stroke={getGenreColor(target.genre)}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  className={target.isAddicted ? "animate-pulse" : ""}
                  style={{
                    filter: target.isAddicted ? 'drop-shadow(0 0 8px currentColor)' : 'none'
                  }}
                />
                {/* 추천 효과 */}
                {target.isRecommended && (
                  <path
                    d={path}
                    stroke="url(#loveGradient)"
                    strokeWidth={strokeWidth - 1}
                    fill="none"
                    strokeLinecap="round"
                    className="animate-pulse"
                    strokeDasharray="6,3"
                  />
                )}
              </g>
            );
          })
        )}
        
        <defs>
          <linearGradient id="loveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DB2777" />
            <stop offset="50%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
      </svg>

      {/* 드라마 입덕 노드들 */}
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
              ${node.isAddicted ? 'ring-3 ring-pink-400 ring-offset-2' : 'border-2 border-gray-200'}
              ${node.isRecommended ? 'shadow-red-400/50' : ''}
            `}
            style={cardSize}
          >
            <div className="w-full h-full flex items-center justify-center text-gray-700 relative overflow-hidden bg-gradient-to-br from-white to-gray-50">
              <div className="relative z-10 text-center p-3 pointer-events-none">
                <div className={`${isLargeView ? 'text-2xl' : 'text-xl'} mb-2`}>
                  {getTypeIcon(node.type)}
                </div>
                <div className={`${isLargeView ? 'text-sm' : 'text-xs'} font-bold leading-tight text-gray-800 mb-1`}>
                  {node.title.length > (isLargeView ? 22 : 16) ? node.title.slice(0, isLargeView ? 22 : 16) + '...' : node.title}
                </div>
                <div className="text-xs text-gray-600">{node.type}</div>
                {node.rating && (
                  <div className="text-xs font-bold text-yellow-600 mt-1">⭐ {node.rating}</div>
                )}
              </div>
              
              {/* 중독 상태 표시 */}
              {node.isAddicted && (
                <div className="absolute -top-3 -right-3 z-40 pointer-events-none">
                  <div className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-xl border-2 border-white animate-pulse">
                    <Heart className="w-3 h-3" />
                  </div>
                </div>
              )}
              
              {/* 추천 표시 */}
              {node.isRecommended && (
                <div className="absolute -top-3 -left-3 z-40 pointer-events-none">
                  <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-xl border-2 border-white">
                    추천
                  </div>
                </div>
              )}

              {/* 재생 버튼 */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className={`${isLargeView ? 'w-12 h-12' : 'w-8 h-8'} bg-pink-600 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform`}>
                  <Tv className={`${isLargeView ? 'w-6 h-6' : 'w-4 h-4'} text-white`} />
                </div>
              </div>

              {/* 감정적 몰입도 표시 */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center z-30 pointer-events-none">
                <Heart className="w-3 h-3 mr-1 text-pink-400" />
                {node.emotionalImpact}%
              </div>
            </div>
          </div>

          {/* 상세 툴팁 */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/95 text-white text-xs rounded-lg p-4 whitespace-nowrap pointer-events-none z-50 shadow-xl">
            <div className="font-semibold text-sm mb-1">{node.title}</div>
            <div className="text-gray-300 mb-2">{node.type} • {node.genre}</div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3 text-pink-400" />
                <span>몰입도 {node.emotionalImpact}%</span>
              </div>
              {node.isAddicted && (
                <span className="text-pink-400 text-xs">💕 중독됨</span>
              )}
              {node.rating && (
                <span className="text-yellow-400 text-xs">⭐ {node.rating}</span>
              )}
              {node.episode && (
                <span className="text-gray-400 text-xs">📺 {node.episode}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}