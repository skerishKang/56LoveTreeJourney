import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Play, 
  Heart, 
  MessageCircle, 
  Share2, 
  X, 
  Map, 
  Home,
  Sparkles,
  Video,
  Camera,
  Music,
  Zap,
  Bell,
  Send
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface VideoNode {
  id: number;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  duration?: string;
  x: number;
  y: number;
  connections: number[];
  color: string;
  category: string;
  stage: string;
  likeCount: number;
  commentCount: number;
  isNew?: boolean;
}

interface Comment {
  id: number;
  user: string;
  message: string;
  timestamp: string;
  nodeId: number;
}

export default function InteractiveLoveTree() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [viewportX, setViewportX] = useState(0);
  const [viewportY, setViewportY] = useState(0);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedNode, setSelectedNode] = useState<VideoNode | null>(null);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [newVideoPosition, setNewVideoPosition] = useState({ x: 0, y: 0 });
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [realTimeComments, setRealTimeComments] = useState<Comment[]>([]);
  const [showCommentNotification, setShowCommentNotification] = useState(false);
  const [newComment, setNewComment] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // 튜토리얼 러브트리 노드들 (더 간단하고 직관적으로)
  const [nodes, setNodes] = useState<VideoNode[]>([
    {
      id: 1,
      title: "첫 만남 💕",
      description: "운명적인 첫 영상",
      x: 400,
      y: 300,
      connections: [2, 3],
      color: "#FFB6C1",
      category: "썸",
      stage: "시작",
      likeCount: 42,
      commentCount: 8,
      isNew: false
    },
    {
      id: 2,
      title: "무대 직캠 🎭",
      description: "실력에 감탄",
      x: 200,
      y: 200,
      connections: [1, 4],
      color: "#87CEEB",
      category: "댄스",
      stage: "관심",
      likeCount: 67,
      commentCount: 12,
      isNew: false
    },
    {
      id: 3,
      title: "예능 모음 😄",
      description: "웃음 포인트 발견",
      x: 600,
      y: 200,
      connections: [1, 5],
      color: "#98FB98",
      category: "예능",
      stage: "관심",
      likeCount: 54,
      commentCount: 15,
      isNew: false
    },
    {
      id: 4,
      title: "라이브 영상 🎤",
      description: "진짜 실력 확인",
      x: 100,
      y: 400,
      connections: [2, 6],
      color: "#DDA0DD",
      category: "보컬",
      stage: "빠짐",
      likeCount: 89,
      commentCount: 23,
      isNew: false
    },
    {
      id: 5,
      title: "브이로그 📹",
      description: "일상의 매력",
      x: 700,
      y: 400,
      connections: [3, 6],
      color: "#F0E68C",
      category: "일상",
      stage: "빠짐",
      likeCount: 76,
      commentCount: 18,
      isNew: false
    },
    {
      id: 6,
      title: "콘서트 직캠 ✨",
      description: "완전한 입덕 순간",
      x: 400,
      y: 500,
      connections: [4, 5],
      color: "#FF6347",
      category: "콘서트",
      stage: "완전빠짐",
      likeCount: 156,
      commentCount: 34,
      isNew: false
    }
  ]);

  // 실시간 댓글 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
        const comments = [
          "저도 이 영상에서 입덕했어요! 💕",
          "진짜 레전드 영상이에요 ㅠㅠ",
          "이 부분 몇 번을 돌려봤는지 몰라요",
          "같은 최애다!!! 😍",
          "이 영상 덕분에 덕후됐네요 ㅋㅋ"
        ];
        
        const newComment: Comment = {
          id: Date.now(),
          user: `덕후${Math.floor(Math.random() * 999)}`,
          message: comments[Math.floor(Math.random() * comments.length)],
          timestamp: new Date().toLocaleTimeString(),
          nodeId: randomNode.id
        };

        setRealTimeComments(prev => [newComment, ...prev.slice(0, 4)]);
        setShowCommentNotification(true);
        
        setTimeout(() => setShowCommentNotification(false), 3000);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [nodes]);

  // 연결선 그리기
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
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke={node.color}
            strokeWidth="3"
            strokeOpacity="0.6"
            className="drop-shadow-sm"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
          />
        );
      })
    ).flat();
  };

  // 노드 더블클릭으로 영상 추가
  const handleNodeDoubleClick = (node: VideoNode, event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setNewVideoPosition({
        x: node.x + 150,
        y: node.y + 100
      });
      setIsAddingVideo(true);
    }
  };

  // 빈 공간 더블클릭으로 영상 추가
  const handleCanvasDoubleClick = (event: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (event.clientX - rect.left - viewportX) / scale;
      const y = (event.clientY - rect.top - viewportY) / scale;
      setNewVideoPosition({ x, y });
      setIsAddingVideo(true);
    }
  };

  // 새 영상 추가
  const addNewVideo = (title: string, description: string) => {
    const newNode: VideoNode = {
      id: Date.now(),
      title,
      description,
      x: newVideoPosition.x,
      y: newVideoPosition.y,
      connections: [],
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      category: "새영상",
      stage: "추가됨",
      likeCount: 0,
      commentCount: 0,
      isNew: true
    };

    setNodes(prev => [...prev, newNode]);
    setIsAddingVideo(false);
    
    toast({
      title: "영상이 추가되었어요! ✨",
      description: "다른 영상과 연결하려면 영상을 드래그해보세요!",
    });
  };

  // 뷰포트 이동 (WASD 키보드 컨트롤)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const speed = 50;
      switch(e.key.toLowerCase()) {
        case 'w':
          setViewportY(prev => prev + speed);
          break;
        case 's':
          setViewportY(prev => prev - speed);
          break;
        case 'a':
          setViewportX(prev => prev + speed);
          break;
        case 'd':
          setViewportX(prev => prev - speed);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* 상단 헤더 */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="rounded-full bg-white/90 backdrop-blur-sm">
              <Home className="w-5 h-5" />
            </Button>
          </Link>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
            <h1 className="font-bold text-gray-800">💕 내 러브트리</h1>
            <p className="text-xs text-gray-600">영상을 더블클릭해서 추가해보세요!</p>
          </div>
        </div>

        {/* 미니맵 토글 */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowMiniMap(!showMiniMap)}
          className="rounded-full bg-white/90 backdrop-blur-sm"
        >
          <Map className="w-5 h-5" />
        </Button>
      </div>

      {/* 메인 캔버스 */}
      <div 
        ref={containerRef}
        className="w-full h-full cursor-pointer relative"
        onDoubleClick={handleCanvasDoubleClick}
        style={{
          transform: `translate(${viewportX}px, ${viewportY}px) scale(${scale})`,
          transformOrigin: '0 0'
        }}
      >
        {/* SVG 연결선 */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ width: '2000px', height: '2000px' }}
        >
          <g>
            {renderConnections()}
          </g>
        </svg>

        {/* 비디오 노드들 */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`,
            }}
            onClick={() => setSelectedNode(node)}
            onDoubleClick={(e) => handleNodeDoubleClick(node, e)}
          >
            <Card 
              className={`w-40 h-32 hover:shadow-xl transition-all duration-300 hover:scale-110 group-hover:-translate-y-2 ${
                node.isNew ? 'ring-2 ring-yellow-400 animate-pulse' : ''
              }`}
              style={{ 
                borderColor: node.color, 
                borderWidth: '3px',
                backgroundColor: 'white'
              }}
            >
              <CardContent className="p-3 h-full flex flex-col">
                {/* 썸네일 영역 */}
                <div 
                  className="w-full h-16 rounded-lg flex items-center justify-center text-white mb-2 relative"
                  style={{ backgroundColor: node.color }}
                >
                  <Play className="w-6 h-6" />
                  
                  {/* 좋아요/댓글 오버레이 */}
                  <div className="absolute bottom-1 right-1 flex items-center space-x-1 text-xs">
                    <div className="flex items-center space-x-1 bg-black/50 rounded px-1">
                      <Heart className="w-2 h-2" />
                      <span>{node.likeCount}</span>
                    </div>
                  </div>
                </div>
                
                {/* 제목 */}
                <h4 className="font-bold text-xs text-gray-800 line-clamp-2 flex-1">
                  {node.title}
                </h4>
                
                {/* 단계 뱃지 */}
                <Badge 
                  variant="outline" 
                  className="text-xs mt-1"
                  style={{ borderColor: node.color, color: node.color }}
                >
                  {node.stage}
                </Badge>
              </CardContent>
            </Card>

            {/* 플러스 버튼 (호버시 표시) */}
            <Button
              size="sm"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                handleNodeDoubleClick(node, e as any);
              }}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        ))}

        {/* 중앙 + 버튼 (새 러브트리 시작) */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Button
            size="lg"
            className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
            onClick={() => setIsAddingVideo(true)}
          >
            <Plus className="w-8 h-8" />
          </Button>
          <p className="text-center text-sm text-gray-600 mt-2 font-medium">
            러브트리 시작하기
          </p>
        </div>
      </div>

      {/* 미니맵 */}
      {showMiniMap && (
        <div className="absolute top-20 right-4 w-48 h-32 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 p-2">
          <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 rounded relative overflow-hidden">
            {/* 미니맵 노드들 */}
            {nodes.map(node => (
              <div
                key={node.id}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: node.color,
                  left: `${(node.x / 2000) * 100}%`,
                  top: `${(node.y / 2000) * 100}%`
                }}
              />
            ))}
            
            {/* 현재 뷰포트 표시 */}
            <div 
              className="absolute border-2 border-red-500 bg-red-500/20"
              style={{
                left: `${(-viewportX / 2000) * 100}%`,
                top: `${(-viewportY / 2000) * 100}%`,
                width: '25%',
                height: '25%'
              }}
            />
          </div>
          <p className="text-xs text-gray-600 text-center mt-1">지도 (WASD로 이동)</p>
        </div>
      )}

      {/* 실시간 댓글 알림 */}
      {showCommentNotification && realTimeComments.length > 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-xl animate-bounce">
            <CardContent className="p-3 flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <div>
                <p className="text-sm font-medium">새 댓글 알림! 💬</p>
                <p className="text-xs opacity-90">{realTimeComments[0].user}: {realTimeComments[0].message}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 실시간 댓글 목록 */}
      <div className="absolute bottom-20 left-4 max-w-80 space-y-2">
        {realTimeComments.slice(0, 3).map((comment) => (
          <Card key={comment.id} className="bg-white/90 backdrop-blur-sm animate-slide-in">
            <CardContent className="p-2 flex items-start space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {comment.user[0]}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-800">{comment.user}</p>
                <p className="text-xs text-gray-600">{comment.message}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-400">{comment.timestamp}</span>
                  <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                    <Send className="w-3 h-3 mr-1" />
                    답글
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 컨트롤 가이드 */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
        <p className="text-xs font-medium text-gray-800 mb-2">🎮 컨트롤</p>
        <div className="space-y-1 text-xs text-gray-600">
          <p>• 더블클릭: 영상 추가</p>
          <p>• WASD: 화면 이동</p>
          <p>• 드래그: 영상 연결</p>
          <p>• 클릭: 영상 상세보기</p>
        </div>
      </div>

      {/* 영상 추가 모달 */}
      <Dialog open={isAddingVideo} onOpenChange={setIsAddingVideo}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Video className="w-5 h-5 text-purple-500" />
              <span>새 영상 추가</span>
            </DialogTitle>
          </DialogHeader>
          
          <AddVideoForm onSubmit={addNewVideo} onCancel={() => setIsAddingVideo(false)} />
        </DialogContent>
      </Dialog>

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
              <p className="text-sm text-gray-600">{selectedNode.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span>{selectedNode.likeCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4 text-blue-400" />
                  <span>{selectedNode.commentCount}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                  <Play className="w-4 h-4 mr-1" />
                  영상 보기
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 영상 추가 폼 컴포넌트
function AddVideoForm({ onSubmit, onCancel }: { onSubmit: (title: string, description: string) => void; onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">영상 제목</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="영상 제목을 입력하세요..."
          className="w-full"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">설명 (선택사항)</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="이 영상에 대한 설명을 써주세요..."
          rows={3}
        />
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          취소
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          추가하기
        </Button>
      </div>
    </div>
  );
}