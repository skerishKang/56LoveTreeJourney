import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Play, 
  Heart, 
  Save, 
  Trash2, 
  Move,
  Link,
  Settings,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2
} from "lucide-react";

interface VideoNode {
  id: string;
  title: string;
  thumbnail: string;
  platform: string;
  url: string;
  category: string;
  description: string;
  tags: string[];
  x: number;
  y: number;
  connections: string[];
}

interface Connection {
  from: string;
  to: string;
  color: string;
}

interface InteractiveMindmapProps {
  loveTreeId: number;
  isEditable?: boolean;
}

export default function InteractiveMindmap({ loveTreeId, isEditable = true }: InteractiveMindmapProps) {
  const [nodes, setNodes] = useState<VideoNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // 새 영상 추가 폼
  const [newVideo, setNewVideo] = useState({
    title: "",
    url: "",
    platform: "YouTube",
    category: "귀여움",
    description: "",
    tags: [] as string[],
  });

  // 카테고리별 색상
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "귀여움": return "#FCD34D"; // yellow
      case "섹시함": return "#F472B6"; // pink
      case "댄스": return "#34D399"; // green
      case "보컬": return "#A78BFA"; // purple
      default: return "#94A3B8"; // gray
    }
  };

  // 영상 노드 추가
  const addVideoNode = () => {
    if (!newVideo.title || !newVideo.url) return;

    const newNode: VideoNode = {
      id: `node-${Date.now()}`,
      title: newVideo.title,
      thumbnail: `https://img.youtube.com/vi/${extractYouTubeId(newVideo.url)}/mqdefault.jpg`,
      platform: newVideo.platform,
      url: newVideo.url,
      category: newVideo.category,
      description: newVideo.description,
      tags: newVideo.tags,
      x: 100 + nodes.length * 50,
      y: 100 + nodes.length * 50,
      connections: [],
    };

    setNodes(prev => [...prev, newNode]);
    setNewVideo({
      title: "",
      url: "",
      platform: "YouTube",
      category: "귀여움",
      description: "",
      tags: [],
    });
    setShowAddPanel(false);
  };

  // YouTube ID 추출
  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : "dQw4w9WgXcQ"; // 기본값
  };

  // 노드 드래그 시작
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (!isEditable) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setDraggedNode(nodeId);
    setDragOffset({
      x: e.clientX - rect.left - node.x * canvasScale,
      y: e.clientY - rect.top - node.y * canvasScale,
    });

    e.preventDefault();
  };

  // 노드 드래그
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggedNode || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = (e.clientX - rect.left - dragOffset.x) / canvasScale;
    const newY = (e.clientY - rect.top - dragOffset.y) / canvasScale;

    setNodes(prev => prev.map(node => 
      node.id === draggedNode 
        ? { ...node, x: Math.max(0, newX), y: Math.max(0, newY) }
        : node
    ));
  }, [draggedNode, dragOffset, canvasScale]);

  // 드래그 종료
  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
  }, []);

  // 이벤트 리스너 등록
  useEffect(() => {
    if (draggedNode) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedNode, handleMouseMove, handleMouseUp]);

  // 연결 시작
  const startConnection = (nodeId: string) => {
    if (!isEditable) return;
    setIsConnecting(true);
    setConnectFrom(nodeId);
  };

  // 연결 완료
  const completeConnection = (toNodeId: string) => {
    if (!isConnecting || !connectFrom || connectFrom === toNodeId) {
      setIsConnecting(false);
      setConnectFrom(null);
      return;
    }

    const fromNode = nodes.find(n => n.id === connectFrom);
    const toNode = nodes.find(n => n.id === toNodeId);
    
    if (fromNode && toNode) {
      const newConnection: Connection = {
        from: connectFrom,
        to: toNodeId,
        color: getCategoryColor(fromNode.category),
      };

      setConnections(prev => [...prev, newConnection]);
      setNodes(prev => prev.map(node => 
        node.id === connectFrom 
          ? { ...node, connections: [...node.connections, toNodeId] }
          : node
      ));
    }

    setIsConnecting(false);
    setConnectFrom(null);
  };

  // 연결선 렌더링
  const renderConnections = () => {
    return connections.map((conn, index) => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      
      if (!fromNode || !toNode) return null;

      const x1 = fromNode.x + 100; // 노드 중심
      const y1 = fromNode.y + 60;
      const x2 = toNode.x + 100;
      const y2 = toNode.y + 60;

      return (
        <line
          key={`${conn.from}-${conn.to}-${index}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={conn.color}
          strokeWidth="3"
          strokeDasharray="5,5"
          opacity="0.7"
        />
      );
    });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* 메인 캔버스 */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          ref={canvasRef}
          className="absolute inset-0 cursor-move"
          style={{ 
            transform: `scale(${canvasScale}) translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
            transformOrigin: '0 0'
          }}
        >
          {/* 연결선 SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: '200%', minHeight: '200%' }}>
            {renderConnections()}
          </svg>

          {/* 영상 노드들 */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute cursor-pointer transition-all duration-200 ${
                selectedNode === node.id ? 'ring-4 ring-blue-400 scale-105' : ''
              } ${
                isConnecting && connectFrom !== node.id ? 'ring-2 ring-green-300 animate-pulse' : ''
              }`}
              style={{ 
                left: node.x, 
                top: node.y,
                transform: draggedNode === node.id ? 'scale(1.1)' : 'scale(1)'
              }}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              onClick={() => {
                if (isConnecting) {
                  completeConnection(node.id);
                } else {
                  setSelectedNode(selectedNode === node.id ? null : node.id);
                }
              }}
            >
              <Card className="w-48 h-32 hover:shadow-lg transition-shadow">
                <CardContent className="p-3">
                  <div className="relative">
                    {/* 썸네일 */}
                    <div className="w-full h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg overflow-hidden mb-2">
                      <img 
                        src={node.thumbnail} 
                        alt={node.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'%3E%3Crect width='200' height='120' fill='%23f3f4f6'/%3E%3Ctext x='100' y='60' text-anchor='middle' dy='0.3em' font-family='sans-serif' font-size='14' fill='%236b7280'%3E영상%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-6 h-6 text-white opacity-80" />
                      </div>
                    </div>

                    {/* 제목 */}
                    <h3 className="text-sm font-medium text-gray-800 truncate">{node.title}</h3>
                    
                    {/* 카테고리 뱃지 */}
                    <Badge 
                      className="text-xs mt-1" 
                      style={{ backgroundColor: getCategoryColor(node.category), color: 'white' }}
                    >
                      {node.category}
                    </Badge>

                    {/* 액션 버튼들 */}
                    {isEditable && (
                      <div className="absolute top-1 right-1 flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-6 h-6 p-0 bg-white/80 hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            startConnection(node.id);
                          }}
                        >
                          <Link className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* 캔버스 컨트롤 */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          <Button
            size="sm"
            onClick={() => setCanvasScale(prev => Math.min(prev + 0.1, 2))}
            className="w-10 h-10 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => setCanvasScale(prev => Math.max(prev - 0.1, 0.5))}
            className="w-10 h-10 p-0"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <div className="text-xs text-center px-2 py-1 bg-white rounded">
            {Math.round(canvasScale * 100)}%
          </div>
        </div>

        {/* 연결 모드 표시 */}
        {isConnecting && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <Link className="w-4 h-4" />
              <span>연결할 영상을 클릭하세요</span>
            </div>
          </div>
        )}
      </div>

      {/* 오른쪽 패널 */}
      <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
        <div className="space-y-4">
          {/* 영상 추가 버튼 */}
          <Button
            onClick={() => setShowAddPanel(!showAddPanel)}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            영상 추가
          </Button>

          {/* 영상 추가 폼 */}
          {showAddPanel && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <div>
                  <label className="text-sm font-medium">영상 제목</label>
                  <Input
                    value={newVideo.title}
                    onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="영상 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">YouTube URL</label>
                  <Input
                    value={newVideo.url}
                    onChange={(e) => setNewVideo(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">카테고리</label>
                  <select
                    value={newVideo.category}
                    onChange={(e) => setNewVideo(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="귀여움">귀여움</option>
                    <option value="섹시함">섹시함</option>
                    <option value="댄스">댄스</option>
                    <option value="보컬">보컬</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">설명</label>
                  <Textarea
                    value={newVideo.description}
                    onChange={(e) => setNewVideo(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="이 영상에 대한 설명을 적어보세요"
                    rows={3}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button onClick={addVideoNode} className="flex-1">
                    추가
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddPanel(false)}>
                    취소
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 노드 정보 */}
          {selectedNode && (
            <Card>
              <CardContent className="p-4">
                {(() => {
                  const node = nodes.find(n => n.id === selectedNode);
                  if (!node) return null;
                  
                  return (
                    <div className="space-y-3">
                      <h3 className="font-bold text-gray-800">{node.title}</h3>
                      <Badge style={{ backgroundColor: getCategoryColor(node.category), color: 'white' }}>
                        {node.category}
                      </Badge>
                      {node.description && (
                        <p className="text-sm text-gray-600">{node.description}</p>
                      )}
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Play className="w-3 h-3 mr-1" />
                          재생
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Heart className="w-3 h-3 mr-1" />
                          좋아요
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* 도움말 */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-800 mb-2">💡 사용법</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• 영상 추가 후 드래그로 위치 조정</li>
                <li>• 🔗 버튼으로 영상들 연결</li>
                <li>• 캔버스 확대/축소 가능</li>
                <li>• 영상 클릭으로 상세 정보 확인</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}