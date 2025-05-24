import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Play, Sparkles, Crown, Youtube, Instagram, Music, BookOpen, Edit3, Gauge } from "lucide-react";
import { useState, useEffect } from "react";
import VideoEditor from "./video-editor";
import LoveGauge from "./love-gauge";
import DiaryLoveTree from "./diary-love-tree";

interface LoveTreeMindmapProps {
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
  isShining?: boolean; // 다른 사람이 같은 영상 올렸을 때
}

export default function LoveTreeMindmap({ loveTreeId }: LoveTreeMindmapProps) {
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [viewMode, setViewMode] = useState<'mindmap' | 'diary' | 'editor'>('mindmap');
  const [showLoveGauge, setShowLoveGauge] = useState(false);
  const [nodes, setNodes] = useState<TreeNode[]>([]);

  const { data: items } = useQuery({
    queryKey: ["/api/love-trees", loveTreeId, "items"],
    queryFn: () => api.getLoveTreeItems(loveTreeId),
  });

  useEffect(() => {
    if (items) {
      // Convert items to tree nodes with positioning
      const convertedNodes: TreeNode[] = items.map((item: any, index: number) => {
        const angle = (index * 60) * (Math.PI / 180); // 60도씩 분산
        const radius = 150 + (index % 3) * 80; // 계층별 거리
        
        return {
          id: item.id,
          title: item.title,
          platform: item.platform,
          thumbnailUrl: item.thumbnailUrl,
          contentUrl: item.contentUrl,
          category: getCategoryFromContent(item.title, item.description),
          x: Math.cos(angle) * radius + 250, // 중심점 250,250
          y: Math.sin(angle) * radius + 250,
          connections: getConnectionsForItem(item, items),
          color: getCategoryColor(item.title, item.description),
          isFirstContent: item.isFirstContent,
          likeCount: item.likeCount || 0,
          isShining: Math.random() > 0.7 // 임시로 랜덤하게 반짝이게
        };
      });
      setNodes(convertedNodes);
    }
  }, [items]);

  const getCategoryFromContent = (title: string, description?: string) => {
    const content = (title + " " + (description || "")).toLowerCase();
    if (content.includes("귀여") || content.includes("큐트") || content.includes("애교")) return "cute";
    if (content.includes("섹시") || content.includes("성숙") || content.includes("매력")) return "sexy";
    if (content.includes("댄스") || content.includes("춤") || content.includes("퍼포먼스")) return "dance";
    if (content.includes("보컬") || content.includes("노래") || content.includes("음성")) return "vocal";
    return "general";
  };

  const getCategoryColor = (title: string, description?: string) => {
    const category = getCategoryFromContent(title, description);
    switch (category) {
      case "cute": return "#FFD93D"; // 노란색
      case "sexy": return "#FF6B9D"; // 핑크색
      case "dance": return "#4ECDC4"; // 민트색
      case "vocal": return "#A78BFA"; // 보라색
      default: return "#94A3B8"; // 회색
    }
  };

  const getConnectionsForItem = (item: any, allItems: any[]) => {
    // 연관성 기반으로 연결 (같은 플랫폼, 비슷한 제목 등)
    return allItems
      .filter(other => other.id !== item.id && (
        other.platform === item.platform ||
        other.title.includes(item.title.split(' ')[0])
      ))
      .map(other => other.id)
      .slice(0, 2); // 최대 2개 연결
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

  const renderConnections = () => {
    return nodes.map(node => 
      node.connections.map(targetId => {
        const targetNode = nodes.find(n => n.id === targetId);
        if (!targetNode) return null;

        return (
          <line
            key={`${node.id}-${targetId}`}
            x1={node.x + 30} // 노드 중심에서 시작
            y1={node.y + 30}
            x2={targetNode.x + 30}
            y2={targetNode.y + 30}
            stroke={node.color}
            strokeWidth="3"
            strokeDasharray={node.isShining ? "5,5" : "none"}
            className={node.isShining ? "animate-pulse" : ""}
            style={{
              filter: node.isShining ? "drop-shadow(0 0 8px currentColor)" : "none"
            }}
          />
        );
      })
    ).flat();
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-soft-pink via-white to-diary-beige rounded-2xl overflow-hidden border border-love-pink/20">
      {/* SVG for connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {renderConnections()}
      </svg>

      {/* Tree nodes */}
      <div className="relative w-full h-full" style={{ zIndex: 2 }}>
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
              node.isShining ? "animate-pulse-love" : ""
            }`}
            style={{
              left: node.x,
              top: node.y,
              zIndex: selectedNode?.id === node.id ? 10 : 2
            }}
            onClick={() => setSelectedNode(node)}
          >
            <div
              className={`w-16 h-16 rounded-xl shadow-lg border-2 border-white relative group hover:scale-110 transition-transform ${
                node.isFirstContent ? "ring-2 ring-sparkle-gold ring-offset-2" : ""
              }`}
              style={{
                backgroundColor: node.color,
                boxShadow: node.isShining ? `0 0 20px ${node.color}` : "0 4px 12px rgba(0,0,0,0.15)"
              }}
            >
              {/* Thumbnail or placeholder */}
              {node.thumbnailUrl ? (
                <img
                  src={node.thumbnailUrl}
                  alt={node.title}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {getPlatformIcon(node.platform)}
                </div>
              )}

              {/* Platform icon overlay */}
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
                {getPlatformIcon(node.platform)}
              </div>

              {/* First content crown */}
              {node.isFirstContent && (
                <div className="absolute -top-2 -left-2">
                  <Crown className="w-5 h-5 text-sparkle-gold animate-sparkle" />
                </div>
              )}

              {/* Shining effect */}
              {node.isShining && (
                <div className="absolute -inset-1">
                  <Sparkles className="w-4 h-4 text-white absolute top-0 right-0 animate-sparkle" />
                  <Sparkles className="w-3 h-3 text-white absolute bottom-1 left-1 animate-sparkle" style={{ animationDelay: "0.5s" }} />
                </div>
              )}

              {/* Like count */}
              {node.likeCount > 0 && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-love-pink text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{node.likeCount}</span>
                  </div>
                </div>
              )}

              {/* Hover tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {node.title}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs">
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

      {/* Selected node details */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">{selectedNode.title}</h4>
                  <p className="text-xs text-gray-600">
                    {selectedNode.platform} • {selectedNode.category}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedNode.contentUrl && (
                    <Button size="sm" className="text-xs">
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}