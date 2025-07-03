import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TrendingUp, DollarSign, FileText, Users, Building, CheckCircle, Maximize2, Plus } from "lucide-react";
import { Link } from "wouter";

interface InvestmentNode {
  id: number;
  title: string;
  stage: string;
  description?: string;
  amount?: string;
  duration?: string;
  x: number;
  y: number;
  connections: number[];
  color: string;
  isDecision: boolean;
  confidence: number;
  isSuccessful?: boolean;
}

interface InvestmentLoveTreeProps {
  items?: any[];
}

export default function InvestmentLoveTree({ items }: InvestmentLoveTreeProps) {
  if (!items || items.length === 0) {
    // 투자 결정 과정 예시 - 10일만에 100억 성사!
    const exampleNodes: InvestmentNode[] = [
      // 첫 브리핑
      {
        id: 1,
        title: "스타트업 피치 브리핑",
        stage: "첫 접촉",
        description: "AI 기반 핀테크 솔루션",
        x: 8,
        y: 45,
        connections: [2],
        color: "#3B82F6",
        isDecision: true,
        confidence: 30,
      },
      // 관심 증가
      {
        id: 2,
        title: "시장 분석 자료 검토",
        stage: "초기 관심",
        description: "TAM 50조원 시장",
        x: 25,
        y: 50,
        connections: [3, 4],
        color: "#10B981",
        isDecision: false,
        confidence: 50,
      },
      // 심화 조사
      {
        id: 3,
        title: "경쟁사 분석",
        stage: "실사",
        description: "차별화 요소 확인",
        x: 45,
        y: 30,
        connections: [5],
        color: "#F59E0B",
        isDecision: false,
        confidence: 65,
      },
      // 팀 분석
      {
        id: 4,
        title: "창업팀 백그라운드 조사",
        stage: "실사",
        description: "카카오 출신 CTO",
        x: 45,
        y: 70,
        connections: [6],
        color: "#F59E0B",
        isDecision: false,
        confidence: 75,
      },
      // 미팅 단계
      {
        id: 5,
        title: "1차 투자자 미팅",
        stage: "미팅",
        description: "비즈니스 모델 심화 논의",
        amount: "Series A 목표",
        x: 65,
        y: 25,
        connections: [7],
        color: "#8B5CF6",
        isDecision: true,
        confidence: 80,
      },
      // 제품 데모
      {
        id: 6,
        title: "제품 데모 및 Q&A",
        stage: "미팅",
        description: "실제 고객 사례 확인",
        x: 65,
        y: 75,
        connections: [8],
        color: "#8B5CF6",
        isDecision: false,
        confidence: 85,
      },
      // 회사 방문
      {
        id: 7,
        title: "회사 방문 및 팀 미팅",
        stage: "현장 실사",
        description: "개발팀 역량 직접 확인",
        x: 85,
        y: 35,
        connections: [9],
        color: "#EF4444",
        isDecision: true,
        confidence: 90,
      },
      // 재무 검토
      {
        id: 8,
        title: "재무제표 및 성장률 분석",
        stage: "현장 실사",
        description: "월 30% 성장률 확인",
        x: 85,
        y: 65,
        connections: [9],
        color: "#EF4444",
        isDecision: false,
        confidence: 95,
      },
      // 최종 결정
      {
        id: 9,
        title: "투자 결정 및 계약",
        stage: "투자 성사",
        description: "100억원 투자 완료",
        amount: "100억원",
        duration: "10일",
        x: 95,
        y: 50,
        connections: [],
        color: "#059669",
        isDecision: true,
        confidence: 100,
        isSuccessful: true,
      }
    ];

    return (
      <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
              💰 투자 결정 러브트리
            </h3>
            <p className="text-sm text-gray-600">10일만에 100억 투자 성사까지의 여정!</p>
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
                <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  💰 투자 결정 러브트리 - 전체 화면
                </h2>
                <div className="relative h-full bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-2xl overflow-hidden">
                  <InvestmentRenderer nodes={exampleNodes} isLargeView={true} />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="relative h-96 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-2xl">
          <InvestmentRenderer nodes={exampleNodes} isLargeView={false} />
        </div>
        
        {/* 투자 단계 범례 */}
        <div className="mt-6 space-y-4">
          <h4 className="text-lg font-bold text-gray-800 text-center">📊 투자 결정 단계</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-xl">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">첫 접촉</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-xl">
              <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">초기 관심</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-amber-50 rounded-xl">
              <div className="w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">실사</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-xl">
              <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">미팅</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-xl">
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="text-gray-700 font-semibold text-xs">현장 실사</span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-green-100 rounded-2xl text-center border-2 border-blue-200">
          <p className="text-lg text-gray-800 mb-4 font-semibold">
            💡 투자 결정의 모든 과정을 시각화!
          </p>
          <p className="text-sm text-gray-600 mb-4">
            첫 브리핑부터 최종 투자까지<br />
            신뢰도 변화와 핵심 결정 포인트를 한눈에!
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-xl px-8 py-3">
            <Plus className="w-5 h-5 mr-2" />
            투자 여정 만들기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-blue-200 p-6">
      <p className="text-center text-gray-600">실제 투자 데이터로 구현 예정</p>
    </div>
  );
}

// 투자 결정 렌더러 컴포넌트
function InvestmentRenderer({ nodes, isLargeView }: { nodes: InvestmentNode[], isLargeView: boolean }) {
  const [draggedNodes, setDraggedNodes] = useState<InvestmentNode[]>(nodes);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraggedNodes(nodes);
  }, [nodes]);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "첫 접촉": return "#3B82F6";
      case "초기 관심": return "#10B981";
      case "실사": return "#F59E0B";
      case "미팅": return "#8B5CF6";
      case "현장 실사": return "#EF4444";
      case "투자 성사": return "#059669";
      default: return "#6B7280";
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "첫 접촉": return "📊";
      case "초기 관심": return "🔍";
      case "실사": return "📋";
      case "미팅": return "🤝";
      case "현장 실사": return "🏢";
      case "투자 성사": return "💰";
      default: return "📈";
    }
  };

  const cardSize = isLargeView ? { width: '220px', height: '140px' } : { width: '160px', height: '100px' };

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
            
            // 투자 신뢰도에 따른 선 굵기
            const strokeWidth = Math.max(3, node.confidence / 20);
            
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
                  stroke={getStageColor(target.stage)}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  style={{
                    filter: target.isSuccessful ? 'drop-shadow(0 0 8px currentColor)' : 'none'
                  }}
                />
                {/* 성공한 투자 특별 효과 */}
                {target.isSuccessful && (
                  <path
                    d={path}
                    stroke="url(#successGradient)"
                    strokeWidth={strokeWidth - 1}
                    fill="none"
                    strokeLinecap="round"
                    className="animate-pulse"
                    strokeDasharray="10,5"
                  />
                )}
              </g>
            );
          })
        )}
        
        <defs>
          <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#6EE7B7" />
          </linearGradient>
        </defs>
      </svg>

      {/* 투자 결정 노드들 */}
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
              ${node.isDecision ? 'ring-3 ring-blue-400 ring-offset-2' : 'border-2 border-gray-200'}
              ${node.isSuccessful ? 'ring-3 ring-green-400 ring-offset-2 shadow-green-400/50 animate-pulse' : ''}
            `}
            style={cardSize}
          >
            <div className="w-full h-full flex items-center justify-center text-gray-700 relative overflow-hidden bg-gradient-to-br from-white to-gray-50">
              <div className="relative z-10 text-center p-3 pointer-events-none">
                <div className={`${isLargeView ? 'text-2xl' : 'text-xl'} mb-2`}>
                  {getStageIcon(node.stage)}
                </div>
                <div className={`${isLargeView ? 'text-sm' : 'text-xs'} font-bold leading-tight text-gray-800 mb-1`}>
                  {node.title.length > (isLargeView ? 25 : 18) ? node.title.slice(0, isLargeView ? 25 : 18) + '...' : node.title}
                </div>
                <div className="text-xs text-gray-600">{node.stage}</div>
                {node.amount && (
                  <div className="text-xs font-bold text-green-600 mt-1">{node.amount}</div>
                )}
              </div>
              
              {/* 결정 포인트 표시 */}
              {node.isDecision && (
                <div className="absolute -top-3 -right-3 z-40 pointer-events-none">
                  <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-xl border-2 border-white">
                    결정
                  </div>
                </div>
              )}
              
              {/* 성공 표시 */}
              {node.isSuccessful && (
                <div className="absolute -top-3 -left-3 z-40 pointer-events-none">
                  <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-xl border-2 border-white animate-bounce">
                    ✓ 성사
                  </div>
                </div>
              )}

              {/* 신뢰도 표시 */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center z-30 pointer-events-none">
                <TrendingUp className="w-3 h-3 mr-1" />
                {node.confidence}%
              </div>
            </div>
          </div>

          {/* 상세 툴팁 */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/95 text-white text-xs rounded-lg p-4 whitespace-nowrap pointer-events-none z-50 shadow-xl">
            <div className="font-semibold text-sm mb-1">{node.title}</div>
            <div className="text-gray-300 mb-2">{node.stage}</div>
            {node.description && (
              <div className="text-gray-300 mb-2">{node.description}</div>
            )}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>신뢰도 {node.confidence}%</span>
              </div>
              {node.isDecision && (
                <span className="text-blue-400 text-xs">🎯 핵심 결정점</span>
              )}
              {node.amount && (
                <span className="text-green-400 text-xs">💰 {node.amount}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}