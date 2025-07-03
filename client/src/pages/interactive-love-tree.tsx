import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
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
  Send,
  Crown,
  Star,
  Save,
  Upload
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { saveLoveTree, addComment, subscribeToComments, updateUserPoints } from "@/services/loveTreeService";

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
  const [isLoading, setIsLoading] = useState(false);
  const [currentTreeId, setCurrentTreeId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 중앙 최애 정보
  const [centerIdol, setCenterIdol] = useState({
    name: "정국",
    group: "BTS",
    image: "🐰",
    description: "황금막내의 매력에 빠져보세요",
    totalVideos: 6,
    totalLikes: 524
  });

  // 러브트리 노드들 (중앙을 기준으로 원형 배치)
  const [nodes, setNodes] = useState<VideoNode[]>([
    {
      id: 1,
      title: "이 눈빛에 빠졌어 💕",
      description: "첫 입덕 영상",
      x: 400,
      y: 150,
      connections: [0], // 0은 중앙 아이돌
      color: "#FFD93D",
      category: "귀여움",
      stage: "첫만남",
      likeCount: 89,
      commentCount: 12,
      isNew: false
    },
    {
      id: 2,
      title: "저 목소리는 반칙이야 🎤",
      description: "라이브 무대의 감동",
      x: 600,
      y: 250,
      connections: [0],
      color: "#FF6B9D",
      category: "섹시함",
      stage: "감탄",
      likeCount: 156,
      commentCount: 23,
      isNew: false
    },
    {
      id: 3,
      title: "이 춤선 뭐야... 🕺",
      description: "댄스 실력에 놀람",
      x: 650,
      y: 400,
      connections: [0],
      color: "#4ECDC4",
      category: "댄스",
      stage: "빠짐",
      likeCount: 234,
      commentCount: 34,
      isNew: false
    },
    {
      id: 4,
      title: "예능감도 완벽해 😄",
      description: "웃음 포인트 발견",
      x: 500,
      y: 550,
      connections: [0],
      color: "#F39C12",
      category: "예능",
      stage: "애정",
      likeCount: 178,
      commentCount: 28,
      isNew: false
    },
    {
      id: 5,
      title: "일상도 완벽남 📹",
      description: "브이로그의 매력",
      x: 300,
      y: 550,
      connections: [0],
      color: "#9B59B6",
      category: "일상",
      stage: "애정",
      likeCount: 145,
      commentCount: 19,
      isNew: false
    },
    {
      id: 6,
      title: "콘서트는 레전드 ✨",
      description: "완전한 입덕 순간",
      x: 150,
      y: 400,
      connections: [0],
      color: "#E74C3C",
      category: "콘서트",
      stage: "완전빠짐",
      likeCount: 389,
      commentCount: 67,
      isNew: false
    },
    {
      id: 7,
      title: "팬서비스 천재 💖",
      description: "팬들을 향한 사랑",
      x: 150,
      y: 250,
      connections: [0],
      color: "#1ABC9C",
      category: "팬서비스",
      stage: "완전빠짐",
      likeCount: 267,
      commentCount: 45,
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

  // 연결선 그리기 (중앙 아이돌을 기준으로)
  const renderConnections = () => {
    const centerX = 400;
    const centerY = 350;
    
    return nodes.map(node => {
      return (
        <motion.line
          key={`connection-${node.id}`}
          x1={centerX}
          y1={centerY}
          x2={node.x}
          y2={node.y}
          stroke={node.color}
          strokeWidth="4"
          strokeOpacity="0.7"
          strokeDasharray="0"
          className="drop-shadow-lg"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))',
          }}
        />
      );
    });
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
  const addNewVideo = async (title: string, description: string) => {
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
    
    // Firebase에 영상 추가 기록 (사용자가 Firebase 설정을 완료했을 때만)
    if (user?.id && currentTreeId) {
      try {
        await updateUserPoints(user.id, 5, 'videoAdd'); // 영상 추가시 5포인트
        toast({
          title: "영상이 추가되었어요! ✨ (+5P)",
          description: "다른 영상과 연결하려면 영상을 드래그해보세요!",
        });
      } catch (error) {
        // Firebase 설정이 없어도 로컬에서는 정상 작동
        toast({
          title: "영상이 추가되었어요! ✨",
          description: "다른 영상과 연결하려면 영상을 드래그해보세요!",
        });
      }
    } else {
      toast({
        title: "영상이 추가되었어요! ✨",
        description: "다른 영상과 연결하려면 영상을 드래그해보세요!",
      });
    }
  };

  // 러브트리 저장하기
  const saveLoveTreeToFirebase = async () => {
    if (!user?.id || nodes.length === 0) {
      toast({
        title: "저장할 수 없어요",
        description: "로그인하고 최소 1개 이상의 영상을 추가해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const treeData = {
        centerIdol,
        nodes,
        title: `${centerIdol.name} 러브트리`,
        category: "K-POP",
        description: `${centerIdol.description}`,
        nodeCount: nodes.length
      };

      // Firebase 연동 시도
      const treeId = await saveLoveTree(user.id, treeData);
      setCurrentTreeId(treeId);
      
      toast({
        title: "러브트리가 저장되었어요! 🌸",
        description: "이제 다른 사람들과 공유할 수 있어요!",
      });
    } catch (error) {
      toast({
        title: "Firebase 설정이 필요해요",
        description: "Firebase 연동을 위해 API 키를 설정해주세요!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 실시간 댓글 보내기
  const sendComment = async () => {
    if (!newComment.trim() || !user?.id || !currentTreeId) return;

    try {
      await addComment(
        currentTreeId, 
        user.id, 
        newComment, 
        user.firstName || user.email?.split('@')[0] || '익명'
      );
      setNewComment("");
      
      // 댓글 작성시 포인트 지급
      await updateUserPoints(user.id, 3, 'comment');
      
      toast({
        title: "댓글이 전송되었어요! 💬 (+3P)",
        description: "다른 팬들과 소통해보세요!",
      });
    } catch (error) {
      // Firebase 없이도 로컬에서 댓글 시뮬레이션
      const newCommentObj: Comment = {
        id: Date.now(),
        user: user.firstName || '나',
        message: newComment,
        timestamp: new Date().toLocaleTimeString(),
        nodeId: 0
      };
      
      setRealTimeComments(prev => [newCommentObj, ...prev.slice(0, 4)]);
      setNewComment("");
      
      toast({
        title: "댓글이 전송되었어요! 💬",
        description: "Firebase 연동 시 실시간으로 공유됩니다!",
      });
    }
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

        <div className="flex items-center space-x-2">
          {/* 저장 버튼 */}
          <Button 
            size="sm"
            onClick={saveLoveTreeToFirebase}
            disabled={isLoading || nodes.length === 0}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
          </Button>

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

        {/* 중앙 최애 아이돌 */}
        <motion.div
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: '400px', top: '350px' }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.5 }}
        >
          <motion.div
            className="relative"
            animate={{ rotate: [0, 2, -2, 2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 rounded-full border-8 border-white shadow-2xl flex items-center justify-center text-6xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-purple-500/20 rounded-full animate-pulse"></div>
              <span className="relative z-10">{centerIdol.image}</span>
              
              {/* 왕관 아이콘 */}
              <div className="absolute -top-3 -right-1 bg-yellow-400 rounded-full p-1 border-2 border-white">
                <Crown className="w-4 h-4 text-amber-700" />
              </div>
              
              {/* 하트 애니메이션 */}
              <motion.div
                className="absolute -top-2 -left-2"
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              </motion.div>
            </div>
            
            {/* 이름과 정보 */}
            <div className="absolute top-36 left-1/2 transform -translate-x-1/2 text-center bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg min-w-max">
              <h2 className="font-bold text-lg text-gray-800">{centerIdol.name}</h2>
              <p className="text-sm text-gray-600">{centerIdol.group}</p>
              <p className="text-xs text-gray-500 mt-1">{centerIdol.description}</p>
              <div className="flex items-center justify-center space-x-3 mt-2 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Video className="w-3 h-3" />
                  <span>{centerIdol.totalVideos}개</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3 text-red-400" />
                  <span>{centerIdol.totalLikes}</span>
                </div>
              </div>
            </div>

            {/* 빛나는 효과 */}
            <div className="absolute inset-0 rounded-full animate-ping bg-gradient-to-r from-pink-400 to-purple-500 opacity-20"></div>
          </motion.div>
        </motion.div>

        {/* 비디오 노드들 */}
        <AnimatePresence>
          {nodes.map((node, index) => (
            <motion.div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.1, y: -10 }}
              onClick={() => setSelectedNode(node)}
              onDoubleClick={(e) => handleNodeDoubleClick(node, e)}
            >
              <Card 
                className={`w-48 h-36 hover:shadow-2xl transition-all duration-300 ${
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
                    className="w-full h-20 rounded-lg flex items-center justify-center text-white mb-2 relative overflow-hidden"
                    style={{ backgroundColor: node.color }}
                  >
                    <Play className="w-8 h-8" />
                    
                    {/* YouTube 스타일 썸네일 효과 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20"></div>
                    
                    {/* 좋아요/댓글 오버레이 */}
                    <div className="absolute bottom-2 right-2 flex items-center space-x-2 text-xs">
                      <div className="flex items-center space-x-1 bg-black/70 rounded-full px-2 py-1">
                        <Heart className="w-3 h-3 text-red-400" />
                        <span>{node.likeCount}</span>
                      </div>
                      <div className="flex items-center space-x-1 bg-black/70 rounded-full px-2 py-1">
                        <MessageCircle className="w-3 h-3 text-blue-400" />
                        <span>{node.commentCount}</span>
                      </div>
                    </div>
                    
                    {/* 카테고리 태그 */}
                    <div className="absolute top-2 left-2">
                      <Badge 
                        className="text-xs bg-white/90 text-gray-800"
                      >
                        #{node.category}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* 제목과 설명 */}
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-gray-800 line-clamp-2 mb-1">
                      {node.title}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {node.description}
                    </p>
                  </div>
                  
                  {/* 단계 뱃지 */}
                  <Badge 
                    variant="outline" 
                    className="text-xs mt-2 self-start"
                    style={{ borderColor: node.color, color: node.color }}
                  >
                    {node.stage}
                  </Badge>
                </CardContent>
              </Card>

              {/* 플러스 버튼 (호버시 표시) */}
              <motion.div
                className="absolute -top-3 -right-3"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  size="sm"
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg hover:shadow-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNodeDoubleClick(node, e as any);
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </motion.div>

              {/* 인기 뱃지 */}
              {node.likeCount > 200 && (
                <motion.div
                  className="absolute -top-2 -left-2"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Badge className="bg-gradient-to-r from-amber-100 to-orange-500 text-white text-xs px-2">
                    🔥 HOT
                  </Badge>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 추가 영상 버튼 (빈 공간에) */}
        <motion.div
          className="absolute left-96 top-96 transform -translate-x-1/2 -translate-y-1/2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 border-4 border-white/50"
            onClick={() => setIsAddingVideo(true)}
          >
            <Plus className="w-10 h-10" />
          </Button>
          <p className="text-center text-sm text-gray-600 mt-3 font-medium bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1">
            영상 추가하기
          </p>
        </motion.div>
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
          <Card className="bg-gradient-to-r from-amber-100 to-orange-500 text-white shadow-xl animate-bounce">
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

      {/* 실시간 댓글 입력창 */}
      <div className="absolute bottom-4 right-4 w-80">
        <Card className="bg-white/95 backdrop-blur-sm border-pink-200">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 mb-2">
              <MessageCircle className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-800">실시간 덕후들과 소통하기</span>
              <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs">
                LIVE
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="이 러브트리 어때요? 댓글 남겨보세요..."
                className="flex-1 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && sendComment()}
              />
              <Button 
                size="sm" 
                onClick={sendComment}
                disabled={!newComment.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 댓글 작성시 3포인트 적립! 다른 덕후들과 최애에 대해 이야기해보세요 ✨
            </p>
          </CardContent>
        </Card>
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