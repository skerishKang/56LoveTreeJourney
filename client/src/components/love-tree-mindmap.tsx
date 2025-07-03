import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, Play, MessageCircle, Share2, Maximize2, X } from "lucide-react";

interface LoveTreeNode {
  id: number;
  title: string;
  type: string;
  description?: string;
  thumbnailUrl?: string;
  x: number;
  y: number;
  connections: number[];
  color: string;
  category: string;
  stage: string;
  likeCount?: number;
  commentCount?: number;
}

interface LoveTreeMindmapProps {
  loveTree: any;
  items?: any[];
  isFullscreen?: boolean;
  onClose?: () => void;
}

export default function LoveTreeMindmap({ loveTree, items = [], isFullscreen = false, onClose }: LoveTreeMindmapProps) {
  const [selectedNode, setSelectedNode] = useState<LoveTreeNode | null>(null);

  // 카테고리별 색상 매핑
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "귀여움": "#FCD34D", // 연한 노란색
      "섹시함": "#FF6B9D", // 핑크색
      "댄스": "#4ECDC4", // 민트색
      "보컬": "#9B59B6", // 보라색
      "비주얼": "#E74C3C", // 빨간색
      "예능": "#F39C12", // 주황색
      "기타": "#95A5A6"  // 회색
    };
    return colors[category] || colors["기타"];
  };

  // 노드 생성 (다이아몬드 레이아웃)
  const generateNodes = (): LoveTreeNode[] => {
    if (!items || items.length === 0) {
      // 예시 데이터로 마인드맵 구조 보여주기
      return [
        {
          id: 1,
          title: "첫 영상 발견",
          type: "video",
          description: "운명적인 첫 만남",
          x: 50,
          y: 50,
          connections: [2, 3],
          color: getCategoryColor("귀여움"),
          category: "귀여움",
          stage: "썸",
          likeCount: 12,
          commentCount: 3
        },
        {
          id: 2,
          title: "무대 영상",
          type: "video",
          description: "댄스 실력에 감탄",
          x: 25,
          y: 25,
          connections: [1, 4],
          color: getCategoryColor("댄스"),
          category: "댄스",
          stage: "설렘",
          likeCount: 25,
          commentCount: 7
        },
        {
          id: 3,
          title: "예능 출연",
          type: "video",
          description: "예능감 폭발",
          x: 75,
          y: 25,
          connections: [1, 5],
          color: getCategoryColor("예능"),
          category: "예능",
          stage: "설렘",
          likeCount: 18,
          commentCount: 5
        },
        {
          id: 4,
          title: "라이브 무대",
          type: "video",
          description: "라이브 실력 확인",
          x: 25,
          y: 75,
          connections: [2, 6],
          color: getCategoryColor("보컬"),
          category: "보컬",
          stage: "빠짐",
          likeCount: 42,
          commentCount: 12
        },
        {
          id: 5,
          title: "브이로그",
          type: "video",
          description: "일상의 모습",
          x: 75,
          y: 75,
          connections: [3, 6],
          color: getCategoryColor("귀여움"),
          category: "귀여움",
          stage: "빠짐",
          likeCount: 33,
          commentCount: 8
        },
        {
          id: 6,
          title: "콘서트 직캠",
          type: "video",
          description: "최애가 확정된 순간",
          x: 50,
          y: 90,
          connections: [4, 5],
          color: getCategoryColor("비주얼"),
          category: "비주얼",
          stage: "완전빠짐",
          likeCount: 89,
          commentCount: 23
        }
      ];
    }

    // 실제 아이템 데이터를 노드로 변환
    return items.map((item, index) => ({
      id: item.id,
      title: item.title || `영상 ${index + 1}`,
      type: item.type || "video",
      description: item.description,
      thumbnailUrl: item.thumbnailUrl,
      x: 20 + (index % 3) * 30,
      y: 20 + Math.floor(index / 3) * 25,
      connections: index > 0 ? [items[index - 1].id] : [],
      color: getCategoryColor(item.category || "기타"),
      category: item.category || "기타",
      stage: item.stage?.name || "썸",
      likeCount: item.likeCount || 0,
      commentCount: item.commentCount || 0
    }));
  };

  const nodes = generateNodes();

  // 연결선 그리기 함수
  const renderConnections = () => {
    return nodes.map(node => 
      node.connections.map(connectionId => {
        const targetNode = nodes.find(n => n.id === connectionId);
        if (!targetNode) return null;

        const startX = node.x;
        const startY = node.y;
        const endX = targetNode.x;
        const endY = targetNode.y;

        return (
          <line
            key={`${node.id}-${connectionId}`}
            x1={`${startX}%`}
            y1={`${startY}%`}
            x2={`${endX}%`}
            y2={`${endY}%`}
            stroke={node.color}
            strokeWidth={isFullscreen ? "3" : "2"}
            strokeOpacity="0.6"
            className="drop-shadow-sm"
          />
        );
      })
    ).flat();
  };

  // 노드 클릭 핸들러
  const handleNodeClick = (node: LoveTreeNode) => {
    setSelectedNode(node);
  };

  return (
    <>
      <div className={`relative ${isFullscreen ? 'h-screen w-screen bg-gradient-to-br from-love-light via-white to-love-light dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20' : 'h-96 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-purple-900/20'} rounded-xl overflow-hidden transition-colors`}>
        {/* 전체화면 헤더 */}
        {isFullscreen && (
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{loveTree?.title || "러브트리"}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">{loveTree?.category} • {nodes.length}개 영상</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* SVG로 연결선과 노드 그리기 */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          {/* 연결선 */}
          <g>
            {renderConnections()}
          </g>
        </svg>

        {/* 노드들 */}
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          {nodes.map((node) => (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
              }}
              onClick={() => handleNodeClick(node)}
            >
              <Card 
                className={`hover:shadow-lg transition-all duration-300 hover:scale-110 ${
                  isFullscreen ? 'w-24 h-24 sm:w-32 sm:h-32' : 'w-16 h-16 sm:w-20 sm:h-20'
                }`}
                style={{ borderColor: node.color, borderWidth: '2px' }}
              >
                <CardContent className="p-1.5 sm:p-2 h-full flex flex-col items-center justify-center text-center">
                  {/* 영상 썸네일 또는 아이콘 */}
                  <div 
                    className={`${isFullscreen ? 'w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2' : 'w-5 h-5 sm:w-6 sm:h-6 mb-0.5 sm:mb-1'} rounded-full flex items-center justify-center text-white font-bold`}
                    style={{ backgroundColor: node.color }}
                  >
                    <Play className={`${isFullscreen ? 'w-3 h-3 sm:w-4 sm:h-4' : 'w-2.5 h-2.5 sm:w-3 sm:h-3'}`} />
                  </div>
                  
                  {/* 제목 */}
                  <h4 className={`font-medium text-gray-800 line-clamp-2 ${isFullscreen ? 'text-[10px] sm:text-xs' : 'text-[8px] sm:text-[10px]'}`}>
                    {node.title}
                  </h4>
                  
                  {/* 단계 뱃지 */}
                  <Badge 
                    variant="outline" 
                    className={`mt-0.5 sm:mt-1 ${isFullscreen ? 'text-[8px] sm:text-[10px]' : 'text-[7px] sm:text-[8px]'}`}
                    style={{ borderColor: node.color, color: node.color }}
                  >
                    {node.stage}
                  </Badge>

                  {/* 전체화면에서만 좋아요/댓글 표시 */}
                  {isFullscreen && (
                    <div className="flex items-center space-x-2 mt-1 text-[10px] text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-2 h-2" />
                        <span>{node.likeCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-2 h-2" />
                        <span>{node.commentCount}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* HOT 뱃지 (인기 노드) */}
              {(node.likeCount || 0) > 30 && (
                <Badge className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-amber-100 to-orange-500 text-white text-[7px] sm:text-[8px] px-0.5 sm:px-1">
                  🔥
                </Badge>
              )}
            </div>
          ))}
        </div>

        {/* 전체화면 버튼 */}
        {!isFullscreen && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 z-10"
            onClick={() => {/* 전체화면 모달 열기 */}}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        )}

        {/* 범례 */}
        {isFullscreen && (
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
            <h4 className="text-sm font-medium mb-2">카테고리</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {["귀여움", "섹시함", "댄스", "보컬"].map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getCategoryColor(category) }}
                  ></div>
                  <span>{category}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 노드 상세 정보 모달 */}
      <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: selectedNode?.color }}
              >
                <Play className="w-3 h-3" />
              </div>
              <span>{selectedNode?.title}</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedNode && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge style={{ backgroundColor: selectedNode.color, color: 'white' }}>
                  {selectedNode.category}
                </Badge>
                <Badge variant="outline">
                  {selectedNode.stage}
                </Badge>
              </div>
              
              {selectedNode.description && (
                <p className="text-sm text-gray-600">{selectedNode.description}</p>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span>{selectedNode.likeCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                    <span>{selectedNode.commentCount}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Share2 className="w-4 h-4 mr-1" />
                  공유
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}