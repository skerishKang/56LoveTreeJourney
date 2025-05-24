import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Target, TrendingUp, Award, Brain, Lightbulb, Maximize2, Plus } from "lucide-react";
import { Link } from "wouter";

interface LearningNode {
  id: number;
  title: string;
  method: string;
  category: string;
  duration?: string;
  score?: number;
  improvement?: string;
  x: number;
  y: number;
  connections: number[];
  color: string;
  isBreakthrough: boolean;
  effectiveness: number;
  isGoalAchieved?: boolean;
}

interface LearningLoveTreeProps {
  items?: any[];
}

export default function LearningLoveTree({ items }: LearningLoveTreeProps) {
  if (!items || items.length === 0) {
    // 공부 방법 발견부터 성적 향상까지의 여정
    const exampleNodes: LearningNode[] = [
      // 기존 방법
      {
        id: 1,
        title: "전통적인 암기 위주 공부",
        method: "암기",
        category: "기존 방법",
        duration: "3개월",
        score: 65,
        x: 8,
        y: 45,
        connections: [2],
        color: "#6B7280",
        isBreakthrough: false,
        effectiveness: 30,
      },
      // 문제 인식
      {
        id: 2,
        title: "성적 정체 - 새로운 방법 필요",
        method: "성찰",
        category: "문제 인식",
        duration: "1주",
        x: 25,
        y: 50,
        connections: [3, 4],
        color: "#EF4444",
        isBreakthrough: false,
        effectiveness: 40,
      },
      // 새로운 방법 탐색
      {
        id: 3,
        title: "유튜브 '공부의 신' 채널 발견",
        method: "온라인 학습",
        category: "방법 탐색",
        duration: "2주",
        x: 45,
        y: 30,
        connections: [5],
        color: "#3B82F6",
        isBreakthrough: true,
        effectiveness: 60,
      },
      // 멘토 찾기
      {
        id: 4,
        title: "선배 멘토링 시작",
        method: "멘토링",
        category: "방법 탐색",
        x: 45,
        y: 70,
        connections: [6],
        color: "#8B5CF6",
        isBreakthrough: false,
        effectiveness: 70,
      },
      // 포모도로 기법 적용
      {
        id: 5,
        title: "포모도로 기법 + 액티브 리콜",
        method: "시간 관리",
        category: "실행",
        duration: "1개월",
        score: 75,
        improvement: "+10점",
        x: 65,
        y: 25,
        connections: [7],
        color: "#10B981",
        isBreakthrough: true,
        effectiveness: 80,
      },
      // 마인드맵 활용
      {
        id: 6,
        title: "마인드맵으로 개념 연결",
        method: "시각화",
        category: "실행",
        duration: "3주",
        score: 78,
        improvement: "+13점",
        x: 65,
        y: 75,
        connections: [8],
        color: "#F59E0B",
        isBreakthrough: true,
        effectiveness: 85,
      },
      // 실전 적용
      {
        id: 7,
        title: "모의고사 집중 풀이",
        method: "실전 연습",
        category: "실전 적용",
        duration: "2개월",
        score: 82,
        improvement: "+17점",
        x: 85,
        y: 35,
        connections: [9],
        color: "#DC2626",
        isBreakthrough: false,
        effectiveness: 90,
      },
      // 약점 보완
      {
        id: 8,
        title: "오답노트 체계적 관리",
        method: "약점 분석",
        category: "실전 적용",
        duration: "1개월",
        score: 85,
        improvement: "+20점",
        x: 85,
        y: 65,
        connections: [9],
        color: "#7C2D12",
        isBreakthrough: true,
        effectiveness: 95,
      },
      // 목표 달성
      {
        id: 9,
        title: "목표 성적 달성! (90점)",
        method: "통합",
        category: "목표 달성",
        duration: "6개월",
        score: 90,
        improvement: "+25점",
        x: 95,
        y: 50,
        connections: [],
        color: "#059669",
        isBreakthrough: true,
        effectiveness: 100,
        isGoalAchieved: true,
      }
    ];

    return (
      <div className="bg-white rounded-2xl border border-green-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              📚 학습 과정 러브트리
            </h3>
            <p className="text-sm text-gray-600">공부법 발견부터 성적 향상까지의 성장 과정!</p>
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
                <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  📚 학습 과정 러브트리 - 전체 화면
                </h2>
                <div className="relative h-full bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-2xl overflow-hidden">
                  <LearningRenderer nodes={exampleNodes} isLargeView={true} />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="relative h-96 overflow-hidden bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-2xl">
          <LearningRenderer nodes={exampleNodes} isLargeView={false} />
        </div>
        
        {/* 학습 과정 단계 범례 */}
        <div className="mt-6 space-y-4">
          <h4 className="text-lg font-bold text-gray-800 text-center">🎯 학습 성장 단계</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
              <div className="w-4 h-4 bg-gray-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">기존 방법</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-xl">
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">문제 인식</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-xl">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">방법 탐색</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-xl">
              <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">실행</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-xl">
              <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">실전 적용</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-emerald-50 rounded-xl">
              <div className="w-4 h-4 bg-emerald-600 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">목표 달성</span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl text-center border-2 border-green-200">
          <p className="text-lg text-gray-800 mb-4 font-semibold">
            🧠 학습 성장의 모든 과정을 추적!
          </p>
          <p className="text-sm text-gray-600 mb-4">
            기존 방법의 한계부터 새로운 학습법 발견, <br />
            실제 성적 향상까지의 전체 여정을 시각화
          </p>
          <Button className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-xl px-8 py-3">
            <Plus className="w-5 h-5 mr-2" />
            학습 여정 만들기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-green-200 p-6">
      <p className="text-center text-gray-600">실제 학습 데이터로 구현 예정</p>
    </div>
  );
}

// 학습 과정 렌더러 컴포넌트
function LearningRenderer({ nodes, isLargeView }: { nodes: LearningNode[], isLargeView: boolean }) {
  const [draggedNodes, setDraggedNodes] = useState<LearningNode[]>(nodes);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraggedNodes(nodes);
  }, [nodes]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "기존 방법": return "#6B7280";
      case "문제 인식": return "#EF4444";
      case "방법 탐색": return "#3B82F6";
      case "실행": return "#10B981";
      case "실전 적용": return "#F59E0B";
      case "목표 달성": return "#059669";
      default: return "#6B7280";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "기존 방법": return "📖";
      case "문제 인식": return "🤔";
      case "방법 탐색": return "🔍";
      case "실행": return "⚡";
      case "실전 적용": return "🎯";
      case "목표 달성": return "🏆";
      default: return "📚";
    }
  };

  const cardSize = isLargeView ? { width: '220px', height: '130px' } : { width: '160px', height: '95px' };

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
            
            // 효과성에 따른 선 굵기
            const strokeWidth = Math.max(3, node.effectiveness / 20);
            
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
                  className={target.isBreakthrough ? "animate-pulse" : ""}
                  style={{
                    filter: target.isGoalAchieved ? 'drop-shadow(0 0 12px currentColor)' : 'none'
                  }}
                />
                {/* 돌파구 효과 */}
                {target.isBreakthrough && (
                  <path
                    d={path}
                    stroke="url(#breakthroughGradient)"
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
          <linearGradient id="breakthroughGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>

      {/* 학습 과정 노드들 */}
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
              ${node.isBreakthrough ? 'ring-3 ring-blue-400 ring-offset-2' : 'border-2 border-gray-200'}
              ${node.isGoalAchieved ? 'ring-3 ring-green-400 ring-offset-2 shadow-green-400/50 animate-pulse' : ''}
            `}
            style={cardSize}
          >
            <div className="w-full h-full flex items-center justify-center text-gray-700 relative overflow-hidden bg-gradient-to-br from-white to-gray-50">
              <div className="relative z-10 text-center p-3 pointer-events-none">
                <div className={`${isLargeView ? 'text-2xl' : 'text-xl'} mb-2`}>
                  {getCategoryIcon(node.category)}
                </div>
                <div className={`${isLargeView ? 'text-sm' : 'text-xs'} font-bold leading-tight text-gray-800 mb-1`}>
                  {node.title.length > (isLargeView ? 25 : 18) ? node.title.slice(0, isLargeView ? 25 : 18) + '...' : node.title}
                </div>
                <div className="text-xs text-gray-600">{node.method}</div>
                {node.score && (
                  <div className="text-xs font-bold text-blue-600 mt-1">{node.score}점</div>
                )}
                {node.improvement && (
                  <div className="text-xs font-bold text-green-600">{node.improvement}</div>
                )}
              </div>
              
              {/* 돌파구 표시 */}
              {node.isBreakthrough && (
                <div className="absolute -top-3 -right-3 z-40 pointer-events-none">
                  <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-xl border-2 border-white">
                    <Lightbulb className="w-3 h-3" />
                  </div>
                </div>
              )}
              
              {/* 목표 달성 표시 */}
              {node.isGoalAchieved && (
                <div className="absolute -top-3 -left-3 z-40 pointer-events-none">
                  <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-xl border-2 border-white animate-bounce">
                    <Award className="w-3 h-3" />
                  </div>
                </div>
              )}

              {/* 효과성 표시 */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center z-30 pointer-events-none">
                <Brain className="w-3 h-3 mr-1" />
                {node.effectiveness}%
              </div>
            </div>
          </div>

          {/* 상세 툴팁 */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/95 text-white text-xs rounded-lg p-4 whitespace-nowrap pointer-events-none z-50 shadow-xl">
            <div className="font-semibold text-sm mb-1">{node.title}</div>
            <div className="text-gray-300 mb-2">{node.method} • {node.category}</div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Brain className="w-3 h-3" />
                <span>효과성 {node.effectiveness}%</span>
              </div>
              {node.isBreakthrough && (
                <span className="text-blue-400 text-xs">💡 돌파구</span>
              )}
              {node.score && (
                <span className="text-blue-400 text-xs">📊 {node.score}점</span>
              )}
              {node.improvement && (
                <span className="text-green-400 text-xs">📈 {node.improvement}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}