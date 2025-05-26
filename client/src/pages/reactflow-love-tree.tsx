import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Play, 
  Heart, 
  MessageCircle, 
  Home,
  Save,
  Crown,
  Star
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

// 커스텀 비디오 노드 컴포넌트
const VideoNode = ({ data }: { data: any }) => {
  return (
    <Card 
      className="w-48 h-36 hover:shadow-xl transition-all duration-300 border-2"
      style={{ borderColor: data.color }}
    >
      <CardContent className="p-3 h-full flex flex-col">
        {/* 썸네일 영역 */}
        <div 
          className="w-full h-20 rounded-lg flex items-center justify-center text-white mb-2 relative overflow-hidden"
          style={{ backgroundColor: data.color }}
        >
          <Play className="w-8 h-8" />
          
          {/* 좋아요/댓글 오버레이 */}
          <div className="absolute bottom-2 right-2 flex items-center space-x-2 text-xs">
            <div className="flex items-center space-x-1 bg-black/70 rounded-full px-2 py-1">
              <Heart className="w-3 h-3 text-red-400" />
              <span>{data.likeCount}</span>
            </div>
            <div className="flex items-center space-x-1 bg-black/70 rounded-full px-2 py-1">
              <MessageCircle className="w-3 h-3 text-blue-400" />
              <span>{data.commentCount}</span>
            </div>
          </div>
          
          {/* 카테고리 태그 */}
          <div className="absolute top-2 left-2">
            <Badge className="text-xs bg-white/90 text-gray-800">
              #{data.category}
            </Badge>
          </div>
        </div>
        
        {/* 제목과 설명 */}
        <div className="flex-1">
          <h4 className="font-bold text-sm text-gray-800 line-clamp-2 mb-1">
            {data.title}
          </h4>
          <p className="text-xs text-gray-600 line-clamp-1">
            {data.description}
          </p>
        </div>
        
        {/* 단계 뱃지 */}
        <Badge 
          variant="outline" 
          className="text-xs mt-2 self-start"
          style={{ borderColor: data.color, color: data.color }}
        >
          {data.stage}
        </Badge>
      </CardContent>
    </Card>
  );
};

// 중앙 아이돌 노드 컴포넌트
const IdolNode = ({ data }: { data: any }) => {
  return (
    <div className="relative">
      <div className="w-32 h-32 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 rounded-full border-8 border-white shadow-2xl flex items-center justify-center text-6xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-purple-500/20 rounded-full animate-pulse"></div>
        <span className="relative z-10">{data.image}</span>
        
        {/* 왕관 아이콘 */}
        <div className="absolute -top-3 -right-1 bg-yellow-400 rounded-full p-1 border-2 border-white">
          <Crown className="w-4 h-4 text-yellow-700" />
        </div>
        
        {/* 하트 애니메이션 */}
        <div className="absolute -top-2 -left-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
        </div>
      </div>
      
      {/* 이름과 정보 */}
      <div className="absolute top-36 left-1/2 transform -translate-x-1/2 text-center bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg min-w-max">
        <h2 className="font-bold text-lg text-gray-800">{data.name}</h2>
        <p className="text-sm text-gray-600">{data.group}</p>
        <p className="text-xs text-gray-500 mt-1">{data.description}</p>
      </div>

      {/* 빛나는 효과 */}
      <div className="absolute inset-0 rounded-full animate-ping bg-gradient-to-r from-pink-400 to-purple-500 opacity-20"></div>
    </div>
  );
};

// 노드 타입 정의
const nodeTypes: NodeTypes = {
  videoNode: VideoNode,
  idolNode: IdolNode,
};

export default function ReactFlowLoveTree() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoDescription, setNewVideoDescription] = useState("");

  // 초기 노드들 (중앙 아이돌 + 주변 영상들)
  const initialNodes: Node[] = [
    {
      id: 'idol-center',
      type: 'idolNode',
      position: { x: 400, y: 300 },
      data: {
        name: "정국",
        group: "BTS",
        image: "🐰",
        description: "황금막내의 매력에 빠져보세요"
      },
      draggable: false,
    },
    {
      id: '1',
      type: 'videoNode',
      position: { x: 200, y: 100 },
      data: {
        title: "이 눈빛에 빠졌어 💕",
        description: "첫 입덕 영상",
        color: "#FFD93D",
        category: "귀여움",
        stage: "첫만남",
        likeCount: 89,
        commentCount: 12,
      },
    },
    {
      id: '2',
      type: 'videoNode',
      position: { x: 600, y: 150 },
      data: {
        title: "저 목소리는 반칙이야 🎤",
        description: "라이브 무대의 감동",
        color: "#FF6B9D",
        category: "섹시함",
        stage: "감탄",
        likeCount: 156,
        commentCount: 23,
      },
    },
    {
      id: '3',
      type: 'videoNode',
      position: { x: 750, y: 400 },
      data: {
        title: "이 춤선 뭐야... 🕺",
        description: "댄스 실력에 놀람",
        color: "#4ECDC4",
        category: "댄스",
        stage: "빠짐",
        likeCount: 234,
        commentCount: 34,
      },
    },
    {
      id: '4',
      type: 'videoNode',
      position: { x: 500, y: 600 },
      data: {
        title: "예능감도 완벽해 😄",
        description: "웃음 포인트 발견",
        color: "#F39C12",
        category: "예능",
        stage: "애정",
        likeCount: 178,
        commentCount: 28,
      },
    },
    {
      id: '5',
      type: 'videoNode',
      position: { x: 100, y: 500 },
      data: {
        title: "콘서트는 레전드 ✨",
        description: "완전한 입덕 순간",
        color: "#E74C3C",
        category: "콘서트",
        stage: "완전빠짐",
        likeCount: 389,
        commentCount: 67,
      },
    },
  ];

  // 초기 연결선들 (모든 영상이 중앙 아이돌과 연결)
  const initialEdges: Edge[] = [
    {
      id: 'e1-idol',
      source: '1',
      target: 'idol-center',
      style: { stroke: '#FFD93D', strokeWidth: 4 },
      animated: true,
    },
    {
      id: 'e2-idol',
      source: '2',
      target: 'idol-center',
      style: { stroke: '#FF6B9D', strokeWidth: 4 },
      animated: true,
    },
    {
      id: 'e3-idol',
      source: '3',
      target: 'idol-center',
      style: { stroke: '#4ECDC4', strokeWidth: 4 },
      animated: true,
    },
    {
      id: 'e4-idol',
      source: '4',
      target: 'idol-center',
      style: { stroke: '#F39C12', strokeWidth: 4 },
      animated: true,
    },
    {
      id: 'e5-idol',
      source: '5',
      target: 'idol-center',
      style: { stroke: '#E74C3C', strokeWidth: 4 },
      animated: true,
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 새 연결 생성
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // 새 영상 노드 추가
  const addNewVideoNode = () => {
    if (!newVideoTitle.trim()) return;

    const newNode: Node = {
      id: `video-${Date.now()}`,
      type: 'videoNode',
      position: { 
        x: 300 + Math.random() * 400, 
        y: 200 + Math.random() * 400 
      },
      data: {
        title: newVideoTitle,
        description: newVideoDescription,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        category: "새영상",
        stage: "추가됨",
        likeCount: Math.floor(Math.random() * 50),
        commentCount: Math.floor(Math.random() * 20),
      },
    };

    // 새 노드를 중앙 아이돌과 자동 연결
    const newEdge: Edge = {
      id: `e${newNode.id}-idol`,
      source: newNode.id,
      target: 'idol-center',
      style: { stroke: newNode.data.color, strokeWidth: 4 },
      animated: true,
    };

    setNodes((nds) => nds.concat(newNode));
    setEdges((eds) => eds.concat(newEdge));
    
    setNewVideoTitle("");
    setNewVideoDescription("");
    setIsAddingVideo(false);

    toast({
      title: "영상이 추가되었어요! ✨",
      description: "새로운 영상이 러브트리에 연결되었습니다!",
    });
  };

  return (
    <div className="h-screen w-screen">
      {/* 상단 헤더 */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="rounded-full bg-white/90 backdrop-blur-sm">
              <Home className="w-5 h-5" />
            </Button>
          </Link>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
            <h1 className="font-bold text-gray-800">💕 React Flow 러브트리</h1>
            <p className="text-xs text-gray-600">노드를 드래그하고 연결해보세요!</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* 영상 추가 버튼 */}
          <Button 
            size="sm"
            onClick={() => setIsAddingVideo(true)}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full"
          >
            <Plus className="w-4 h-4 mr-1" />
            영상 추가
          </Button>

          {/* 저장 버튼 */}
          <Button 
            size="sm"
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full"
          >
            <Save className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* React Flow 캔버스 */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        style={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <Controls 
          style={{
            bottom: 20,
            right: 20,
          }}
        />
        <MiniMap 
          style={{
            height: 120,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid #f06292',
          }}
          nodeStrokeColor={(n: any) => {
            if (n.type === 'idolNode') return '#ff6b9d';
            return n.data?.color || '#999';
          }}
          nodeColor={(n: any) => {
            if (n.type === 'idolNode') return '#ff6b9d';
            return n.data?.color || '#999';
          }}
          nodeBorderRadius={2}
        />
        <Background 
          color="#f0f0f0" 
          gap={20}
          style={{ opacity: 0.3 }}
        />
      </ReactFlow>

      {/* 영상 추가 모달 */}
      <Dialog open={isAddingVideo} onOpenChange={setIsAddingVideo}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5 text-purple-500" />
              <span>새 영상 추가</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">영상 제목</label>
              <Input
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                placeholder="영상 제목을 입력하세요..."
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">설명 (선택사항)</label>
              <Textarea
                value={newVideoDescription}
                onChange={(e) => setNewVideoDescription(e.target.value)}
                placeholder="이 영상에 대한 설명을 써주세요..."
                rows={3}
              />
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setIsAddingVideo(false)} className="flex-1">
                취소
              </Button>
              <Button 
                onClick={addNewVideoNode}
                disabled={!newVideoTitle.trim()}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white"
              >
                <Star className="w-4 h-4 mr-2" />
                추가하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 안내 메시지 */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 max-w-xs">
        <h4 className="text-sm font-medium text-gray-800 mb-2">🎮 사용법</h4>
        <div className="space-y-1 text-xs text-gray-600">
          <p>• 노드 드래그: 영상 위치 이동</p>
          <p>• 노드 연결: 핸들을 드래그해서 연결</p>
          <p>• 확대/축소: 마우스 휠 또는 컨트롤 버튼</p>
          <p>• 미니맵: 전체 러브트리 위치 확인</p>
        </div>
      </div>
    </div>
  );
}