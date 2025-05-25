import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Play, Sparkles, Crown, Youtube, Instagram, Music, BookOpen, Edit3, Gauge, Camera, Filter, Scissors, MessageCircle, Plus, Star, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import EnhancedVideoEditor from "./enhanced-video-editor";
import EnhancedLoveGauge from "./enhanced-love-gauge";
import DiaryLoveTree from "./diary-love-tree";

interface EnhancedLoveTreeProps {
  loveTreeId: number;
}

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

export default function EnhancedLoveTree({ loveTreeId }: EnhancedLoveTreeProps) {
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [viewMode, setViewMode] = useState<'mindmap' | 'diary' | 'editor'>('mindmap');
  const [showLoveGauge, setShowLoveGauge] = useState(false);
  const [showVideoEditor, setShowVideoEditor] = useState(false);
  const [nodes, setNodes] = useState<TreeNode[]>([]);

  const { data: items } = useQuery({
    queryKey: ["/api/love-trees", loveTreeId, "items"],
  });

  useEffect(() => {
    if (items && items.length > 0) {
      const processedNodes = items.map((item: any, index: number) => ({
        id: item.id,
        title: item.title || `영상 ${index + 1}`,
        platform: item.platform || "YouTube",
        thumbnailUrl: item.thumbnailUrl,
        contentUrl: item.contentUrl,
        category: getCategoryFromContent(item.title, item.description),
        x: 100 + (index % 4) * 120,
        y: 100 + Math.floor(index / 4) * 100,
        connections: getConnectionsForItem(item, items),
        color: getCategoryColor(getCategoryFromContent(item.title, item.description)),
        isFirstContent: index === 0,
        likeCount: item.likeCount || 0,
        isShining: item.isRecommended || false
      }));
      setNodes(processedNodes);
    }
  }, [items]);

  const getCategoryFromContent = (title: string, description: string) => {
    const content = `${title} ${description}`.toLowerCase();
    if (content.includes('dance') || content.includes('댄스') || content.includes('안무')) return 'dance';
    if (content.includes('vocal') || content.includes('보컬') || content.includes('노래')) return 'vocal';
    if (content.includes('cute') || content.includes('귀여') || content.includes('애교')) return 'cute';
    if (content.includes('sexy') || content.includes('섹시') || content.includes('멋짐')) return 'sexy';
    return 'general';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "cute": return "#FFD93D";
      case "sexy": return "#FF6B9D";
      case "dance": return "#4ECDC4";
      case "vocal": return "#A78BFA";
      default: return "#94A3B8";
    }
  };

  const getConnectionsForItem = (item: any, allItems: any[]) => {
    return allItems
      .filter(other => other.id !== item.id && (
        other.platform === item.platform ||
        other.title.includes(item.title.split(' ')[0])
      ))
      .map(other => other.id)
      .slice(0, 2);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "youtube":
        return <Youtube className="w-3 h-3 text-red-500" />;
      case "instagram":
        return <Instagram className="w-3 h-3 text-pink-500" />;
      case "tiktok":
        return <Music className="w-3 h-3 text-black" />;
      default:
        return <Play className="w-3 h-3 text-gray-500" />;
    }
  };

  // 뷰 모드별 렌더링
  if (viewMode === 'diary') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-love-pink" />
            <span>다이어리 뷰</span>
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('mindmap')}
          >
            마인드맵으로 돌아가기
          </Button>
        </div>
        <DiaryLoveTree loveTreeId={loveTreeId} items={items} />
      </div>
    );
  }

  if (showVideoEditor && selectedNode) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md rounded-lg border border-pink-200">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center space-x-2">
            <Edit3 className="w-5 h-5 text-pink-500" />
            <span>영상 편집 - {selectedNode.title}</span>
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowVideoEditor(false);
              setSelectedNode(null);
            }}
            className="border-pink-200 hover:bg-pink-50"
          >
            편집 완료
          </Button>
        </div>
        <EnhancedVideoEditor 
          videoUrl={selectedNode.contentUrl} 
          onSave={(editedData) => {
            console.log('영상 편집 완료:', editedData);
            setShowVideoEditor(false);
            setSelectedNode(null);
          }} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 🎯 상단 컨트롤 바 - 실제로 작동하는 기능들! */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-800">🌟 러브트리 뷰</h3>
          <Badge variant="outline" className="bg-love-pink/10 text-love-pink border-love-pink/20">
            {items?.length || 0}개 콘텐츠
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* 폴인럽 게이지 토글 버튼 */}
          <Button
            variant={showLoveGauge ? "default" : "outline"}
            size="sm"
            onClick={() => setShowLoveGauge(!showLoveGauge)}
            className="flex items-center space-x-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
          >
            <Gauge className="w-4 h-4" />
            <span>폴인럽 게이지</span>
          </Button>
          
          {/* 다이어리 뷰 버튼 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('diary')}
            className="flex items-center space-x-1 border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <BookOpen className="w-4 h-4" />
            <span>다이어리 뷰</span>
          </Button>
        </div>
      </div>

      {/* 🌸 폴인럽 게이지 (토글 가능) */}
      {showLoveGauge && (
        <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
          <div className="flex items-center space-x-2 mb-3">
            <Gauge className="w-5 h-5 text-pink-500" />
            <h4 className="font-semibold text-gray-800">폴인럽 게이지</h4>
          </div>
          <EnhancedLoveGauge loveTreeId={loveTreeId} />
        </div>
      )}

      {/* 🎨 마인드맵 뷰 - 핑크 테마 */}
      <div className="relative w-full h-96 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 rounded-2xl overflow-hidden border border-pink-200"
           style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
        
        {/* SVG for connections */}
        <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          {nodes.map(node => 
            node.connections.map(targetId => {
              const targetNode = nodes.find(n => n.id === targetId);
              if (!targetNode) return null;

              return (
                <line
                  key={`${node.id}-${targetId}`}
                  x1={node.x + 40}
                  y1={node.y + 40}
                  x2={targetNode.x + 40}
                  y2={targetNode.y + 40}
                  stroke={node.color}
                  strokeWidth="2"
                  strokeOpacity="0.6"
                  className="drop-shadow-sm"
                />
              );
            })
          )}
        </svg>

        {/* 영상 노드들 - 원형 디자인 */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute w-16 h-16 cursor-pointer group"
            style={{ left: node.x, top: node.y }}
            onClick={() => setSelectedNode(node)}
          >
            <div className="relative w-full h-full rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110 border-4 border-white"
                 style={{ backgroundColor: node.color }}>
              
              {/* 원형 노드 내용 */}
              {node.thumbnailUrl ? (
                <img
                  src={node.thumbnailUrl}
                  alt={node.title}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  {getPlatformIcon(node.platform)}
                </div>
              )}

              {/* 플랫폼 아이콘 - 더 작고 예쁘게 */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100">
                {getPlatformIcon(node.platform)}
              </div>

              {/* 첫 번째 콘텐츠 크라운 */}
              {node.isFirstContent && (
                <div className="absolute -top-2 -left-2">
                  <Crown className="w-5 h-5 text-sparkle-gold animate-sparkle" />
                </div>
              )}

              {/* 추천 영상 반짝임 효과 */}
              {node.isShining && (
                <div className="absolute -inset-1">
                  <Sparkles className="w-4 h-4 text-white absolute top-0 right-0 animate-sparkle" />
                  <Sparkles className="w-3 h-3 text-white absolute bottom-1 left-1 animate-sparkle" style={{ animationDelay: "0.5s" }} />
                </div>
              )}

              {/* 좋아요 수 */}
              {node.likeCount > 0 && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-love-pink text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{node.likeCount}</span>
                  </div>
                </div>
              )}

              {/* 호버 툴팁 */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {node.title}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* 카테고리 범례 */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs border border-gray-200">
          <h4 className="font-medium mb-2 text-gray-700">카테고리</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FFD93D" }}></div>
              <span>귀여움</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FF6B9D" }}></div>
              <span>섹시함</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#4ECDC4" }}></div>
              <span>댄스</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#A78BFA" }}></div>
              <span>보컬</span>
            </div>
          </div>
        </div>

        {/* 🎬 선택된 노드 세부 정보 + 편집 기능 */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 right-4">
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-love-pink/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800 flex items-center space-x-2">
                      <span>{selectedNode.title}</span>
                      {selectedNode.isFirstContent && <Crown className="w-4 h-4 text-sparkle-gold" />}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {selectedNode.platform} • {selectedNode.category}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedNode.contentUrl && (
                      <Button size="sm" className="text-xs bg-love-pink hover:bg-love-pink/90">
                        <Play className="w-3 h-3 mr-1" />
                        보기
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedNode(null)}
                      className="text-xs"
                    >
                      닫기
                    </Button>
                  </div>
                </div>
                
                {/* 🎨 편집 도구 버튼들 */}
                <div className="flex items-center space-x-2 pt-2 border-t border-gray-200">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowVideoEditor(true)}
                    className="text-xs flex items-center space-x-1 border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>영상 편집</span>
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs flex items-center space-x-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Scissors className="w-3 h-3" />
                    <span>자르기</span>
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs flex items-center space-x-1 border-green-200 text-green-600 hover:bg-green-50"
                  >
                    <Filter className="w-3 h-3" />
                    <span>필터</span>
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs flex items-center space-x-1 border-pink-200 text-pink-600 hover:bg-pink-50"
                  >
                    <Heart className="w-3 h-3" />
                    <span>심쿵 포인트</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 빈 상태일 때 안내 메시지 */}
        {(!items || items.length === 0) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Sparkles className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">아직 추가된 콘텐츠가 없어요</p>
              <p className="text-xs">첫 번째 영상을 추가해보세요!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}