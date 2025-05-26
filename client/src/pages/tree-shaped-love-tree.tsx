import React, { useState, useEffect } from 'react';
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
  Star,
  Sparkles,
  Trophy,
  Youtube,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface VideoFruit {
  id: string;
  title: string;
  description: string;
  youtubeUrl?: string;
  category: string;
  stage: string;
  likeCount: number;
  commentCount: number;
  color: string;
  position: { x: number; y: number };
  branchAngle: number;
  emotion: string;
  timeStamp?: string; // "5초~7초" 같은 하이라이트 구간
}

export default function TreeShapedLoveTree() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoDescription, setNewVideoDescription] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoEmotion, setNewVideoEmotion] = useState("");
  const [newVideoTimeStamp, setNewVideoTimeStamp] = useState("");
  const [treeCompleted, setTreeCompleted] = useState(false);
  const [showGoldenEffect, setShowGoldenEffect] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoFruit | null>(null);

  // YouTube URL에서 비디오 ID 추출
  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // 영상 재생 함수
  const playVideo = (fruit: VideoFruit) => {
    setSelectedVideo(fruit);
    setShowVideoPlayer(true);
  };

  // 러브트리 영상들 (나무의 열매)
  const [videoFruits, setVideoFruits] = useState<VideoFruit[]>([
    {
      id: '1',
      title: "이 눈빛에 첫 빠짐 💕",
      description: "정국이 눈빛 레전드 순간",
      youtubeUrl: "https://www.youtube.com/watch?v=3y-O-4IL-PU",
      category: "귀여움",
      stage: "첫만남",
      likeCount: 89,
      commentCount: 12,
      color: "#FFD93D",
      position: { x: 450, y: 200 },
      branchAngle: -30,
      emotion: "어떻게 저런 눈빛일 수가 있지? 💘",
      timeStamp: "0:05~0:07"
    },
    {
      id: '2',
      title: "저 목소리는 반칙이야 🎤",
      description: "라이브 무대에서의 감동",
      category: "보컬",
      stage: "감탄",
      likeCount: 156,
      commentCount: 23,
      color: "#FF6B9D",
      position: { x: 350, y: 280 },
      branchAngle: -60,
      emotion: "목소리가 천사야... 이게 실화?",
      timeStamp: "1:20~1:35"
    },
    {
      id: '3',
      title: "이 춤선 뭐야... 🕺",
      description: "댄스 실력에 완전 놀람",
      category: "댄스",
      stage: "빠짐",
      likeCount: 234,
      commentCount: 34,
      color: "#4ECDC4",
      position: { x: 550, y: 280 },
      branchAngle: 30,
      emotion: "춤신춤왕이야!! 완전 멋져 ✨",
      timeStamp: "2:10~2:25"
    },
    {
      id: '4',
      title: "예능감도 완벽해 😄",
      description: "웃음 포인트 발견",
      category: "예능",
      stage: "애정",
      likeCount: 178,
      commentCount: 28,
      color: "#F39C12",
      position: { x: 300, y: 380 },
      branchAngle: -90,
      emotion: "웃기기까지 해?? 완벽남이네",
      timeStamp: "3:45~4:00"
    },
    {
      id: '5',
      title: "콘서트는 레전드 ✨",
      description: "완전한 입덕의 순간",
      category: "콘서트",
      stage: "완전빠짐",
      likeCount: 389,
      commentCount: 67,
      color: "#E74C3C",
      position: { x: 600, y: 380 },
      branchAngle: 60,
      emotion: "이제 돌아갈 수 없어... 완전 덕후됨 🔥",
      timeStamp: "전체 영상"
    },
  ]);

  // 덕후됨 처리 (전도사 포인트 지급)
  const convertMutation = useMutation({
    mutationFn: (data: { loveTreeId: number; conversionType: string }) =>
      apiRequest(`/api/love-trees/${data.loveTreeId}/convert`, "POST", { 
        conversionType: data.conversionType 
      }),
    onSuccess: () => {
      toast({
        title: "덕후 인증 완료! 🎉",
        description: "전도사에게 포인트가 지급되었어요!",
      });
    },
  });

  // 새 영상 추가 (나무에 열매 달기)
  const addNewVideoFruit = () => {
    if (!newVideoTitle.trim()) return;

    // 나무 가지 위치 계산 (자연스러운 나무 모양)
    const branchCount = videoFruits.length;
    const baseAngle = (branchCount * 40) - 120; // -120도부터 시작해서 40도씩 증가
    const distance = 120 + (branchCount * 20); // 거리도 점점 멀어짐
    
    const angle = (baseAngle * Math.PI) / 180;
    const newPosition = {
      x: 450 + Math.cos(angle) * distance,
      y: 400 + Math.sin(angle) * distance
    };

    const newFruit: VideoFruit = {
      id: `fruit-${Date.now()}`,
      title: newVideoTitle,
      description: newVideoDescription,
      youtubeUrl: newVideoUrl,
      category: "새영상",
      stage: "추가됨",
      likeCount: Math.floor(Math.random() * 50),
      commentCount: Math.floor(Math.random() * 20),
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      position: newPosition,
      branchAngle: baseAngle,
      emotion: newVideoEmotion,
      timeStamp: newVideoTimeStamp
    };

    setVideoFruits(prev => [...prev, newFruit]);
    
    setNewVideoTitle("");
    setNewVideoDescription("");
    setNewVideoUrl("");
    setNewVideoEmotion("");
    setNewVideoTimeStamp("");
    setIsAddingVideo(false);

    toast({
      title: "새 열매가 달렸어요! 🍎",
      description: "러브트리가 더욱 풍성해졌습니다!",
    });
  };

  // 러브트리 완성 처리
  const completeTree = () => {
    setTreeCompleted(true);
    setShowGoldenEffect(true);
    
    setTimeout(() => setShowGoldenEffect(false), 3000);
    
    toast({
      title: "🎉 러브트리 완성! 🎉",
      description: "황금 러브트리가 완성되었어요! 이제 진짜 덕후네요 ✨",
    });
  };

  // SVG 나무 줄기와 가지 그리기
  const renderTreeStructure = () => (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    >
      {/* 나무 줄기 */}
      <path
        d="M 450 600 Q 445 500 450 400 Q 455 300 450 200"
        stroke="#8B4513"
        strokeWidth="8"
        fill="none"
        className="drop-shadow-md"
      />
      
      {/* 뿌리 */}
      <path
        d="M 430 600 Q 400 620 370 630 M 470 600 Q 500 620 530 630 M 450 600 Q 450 640 450 660"
        stroke="#654321"
        strokeWidth="4"
        fill="none"
      />

      {/* 각 영상으로 향하는 가지들 */}
      {videoFruits.map((fruit) => (
        <g key={fruit.id}>
          {/* 가지 */}
          <path
            d={`M 450 400 Q ${450 + (fruit.position.x - 450) * 0.5} ${400 + (fruit.position.y - 400) * 0.3} ${fruit.position.x} ${fruit.position.y}`}
            stroke="#228B22"
            strokeWidth="3"
            fill="none"
            className="drop-shadow-sm"
          />
          
          {/* 나뭇잎 */}
          <ellipse
            cx={fruit.position.x - 10}
            cy={fruit.position.y - 5}
            rx="8"
            ry="4"
            fill="#90EE90"
            className="animate-pulse"
          />
          <ellipse
            cx={fruit.position.x + 10}
            cy={fruit.position.y - 8}
            rx="6"
            ry="3"
            fill="#98FB98"
            className="animate-pulse"
          />
        </g>
      ))}
    </svg>
  );

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-gradient-to-b from-sky-200 via-green-100 to-green-200">
      {/* 배경 요소들 */}
      <div className="absolute inset-0">
        {/* 구름들 */}
        <div className="absolute top-10 left-20 text-4xl animate-float">☁️</div>
        <div className="absolute top-16 right-32 text-3xl animate-float-delay">⛅</div>
        <div className="absolute top-8 left-1/2 text-5xl animate-float">☁️</div>
        
        {/* 새들 */}
        <div className="absolute top-20 right-20 text-2xl animate-bounce">🐦</div>
        <div className="absolute top-32 left-10 text-xl animate-bounce-delay">🕊️</div>
      </div>

      {/* 상단 헤더 */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="rounded-full bg-white/90 backdrop-blur-sm">
              <Home className="w-5 h-5" />
            </Button>
          </Link>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
            <h1 className="font-bold text-gray-800">🌳 정국 러브트리</h1>
            <p className="text-xs text-gray-600">나만의 입덕 과정을 나무에 기록해보세요!</p>
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
            열매 추가
          </Button>

          {/* 완성 버튼 */}
          <Button 
            size="sm"
            onClick={completeTree}
            disabled={treeCompleted}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full"
          >
            <Trophy className="w-4 h-4 mr-1" />
            {treeCompleted ? "완성됨" : "완성하기"}
          </Button>
        </div>
      </div>

      {/* 나무 구조 SVG */}
      {renderTreeStructure()}

      {/* 중앙 아이돌 (나무 중심) */}
      <div 
        className={`absolute z-20 transform -translate-x-1/2 -translate-y-1/2 ${showGoldenEffect ? 'animate-ping' : ''}`}
        style={{ left: '450px', top: '400px' }}
      >
        <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center text-4xl relative overflow-hidden transition-all duration-1000 ${
          treeCompleted 
            ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 border-yellow-300 shadow-2xl shadow-yellow-400/50' 
            : 'bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 border-white shadow-xl'
        }`}>
          <span className="relative z-10">🐰</span>
          
          {/* 완성시 황금 반짝이 효과 */}
          {treeCompleted && (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/70 to-orange-400/70 rounded-full animate-pulse"></div>
              <div className="absolute -inset-2 bg-yellow-400/30 rounded-full animate-ping"></div>
            </>
          )}
          
          {/* 왕관 */}
          <div className="absolute -top-3 -right-1 bg-yellow-400 rounded-full p-1 border-2 border-white">
            <Crown className="w-4 h-4 text-yellow-700" />
          </div>
        </div>
        
        {/* 이름표 */}
        <div className="absolute top-28 left-1/2 transform -translate-x-1/2 text-center bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <h2 className="font-bold text-lg text-gray-800">정국 🐰</h2>
          <p className="text-sm text-gray-600">BTS 황금막내</p>
          {treeCompleted && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs mt-1 animate-pulse">
              러브트리 완성! ✨
            </Badge>
          )}
        </div>
      </div>

      {/* 영상 열매들 */}
      {videoFruits.map((fruit) => (
        <div
          key={fruit.id}
          className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 animate-bounce-slow"
          style={{ 
            left: `${fruit.position.x}px`, 
            top: `${fruit.position.y}px`,
            animationDelay: `${Math.random() * 2}s`
          }}
        >
          <Card 
            className="w-40 h-32 hover:shadow-xl transition-all duration-300 border-2 cursor-pointer hover:scale-105"
            style={{ borderColor: fruit.color }}
            onClick={() => playVideo(fruit)}
          >
            <CardContent className="p-2 h-full flex flex-col">
              {/* 썸네일 */}
              <div 
                className="w-full h-16 rounded flex items-center justify-center text-white mb-1 relative group"
                style={{ backgroundColor: fruit.color }}
              >
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                
                {/* YouTube 아이콘 */}
                {fruit.youtubeUrl && (
                  <div className="absolute top-1 right-1">
                    <Youtube className="w-3 h-3 text-red-500 bg-white rounded-sm p-0.5" />
                  </div>
                )}
                
                {/* 좋아요/댓글 */}
                <div className="absolute bottom-1 right-1 flex items-center space-x-1 text-xs">
                  <div className="flex items-center space-x-1 bg-black/70 rounded-full px-1">
                    <Heart className="w-2 h-2 text-red-400" />
                    <span className="text-xs">{fruit.likeCount}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-black/70 rounded-full px-1">
                    <MessageCircle className="w-2 h-2 text-blue-400" />
                    <span className="text-xs">{fruit.commentCount}</span>
                  </div>
                </div>
                
                {/* 카테고리 태그 */}
                <div className="absolute top-1 left-1">
                  <Badge className="text-xs bg-white/90 text-gray-800">
                    #{fruit.category}
                  </Badge>
                </div>
              </div>
              
              {/* 제목 */}
              <h4 className="font-bold text-xs text-gray-800 line-clamp-1 mb-1">
                {fruit.title}
              </h4>
              
              {/* 감정 표현 */}
              <p className="text-xs text-gray-600 line-clamp-1 italic">
                "{fruit.emotion}"
              </p>
              
              {/* 타임스탬프 */}
              {fruit.timeStamp && (
                <Badge className="text-xs mt-1 bg-blue-100 text-blue-800">
                  ⏰ {fruit.timeStamp}
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* 빠짐 버튼 */}
          <Button
            size="sm"
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full px-3"
            onClick={() => convertMutation.mutate({ loveTreeId: 1, conversionType: "single_video" })}
          >
            <Heart className="w-3 h-3 mr-1" />
            나도 빠짐!
          </Button>
        </div>
      ))}

      {/* 영상 추가 모달 */}
      <Dialog open={isAddingVideo} onOpenChange={setIsAddingVideo}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5 text-green-500" />
              <span>나무에 새 열매 달기 🍎</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">영상 제목</label>
              <Input
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                placeholder="어떤 영상인가요?"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">YouTube URL (선택)</label>
              <Input
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">하이라이트 구간 (선택)</label>
              <Input
                value={newVideoTimeStamp}
                onChange={(e) => setNewVideoTimeStamp(e.target.value)}
                placeholder="예: 1:20~1:35, 2:05~2:10"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">내 감정 표현</label>
              <Textarea
                value={newVideoEmotion}
                onChange={(e) => setNewVideoEmotion(e.target.value)}
                placeholder="이 순간에 느낀 감정을 써주세요... 예: 어떻게 저런 눈빛일 수가 있지? 💘"
                rows={3}
              />
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setIsAddingVideo(false)} className="flex-1">
                취소
              </Button>
              <Button 
                onClick={addNewVideoFruit}
                disabled={!newVideoTitle.trim()}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                열매 달기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* YouTube 영상 재생 모달 */}
      <Dialog open={showVideoPlayer} onOpenChange={setShowVideoPlayer}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Youtube className="w-5 h-5 text-red-500" />
              <span>{selectedVideo?.title}</span>
              {selectedVideo?.timeStamp && (
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  ⏰ {selectedVideo.timeStamp}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedVideo && (
            <div className="space-y-4">
              {/* YouTube 영상 플레이어 */}
              {selectedVideo.youtubeUrl && extractYouTubeId(selectedVideo.youtubeUrl) ? (
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${extractYouTubeId(selectedVideo.youtubeUrl)}?autoplay=1&start=${
                      selectedVideo.timeStamp?.includes('~') 
                        ? parseInt(selectedVideo.timeStamp.split('~')[0].split(':').reduce((acc, time) => (60 * acc) + +time, 0).toString()) 
                        : 0
                    }`}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div 
                  className="w-full h-64 rounded-lg flex items-center justify-center text-white relative"
                  style={{ backgroundColor: selectedVideo.color }}
                >
                  <div className="text-center">
                    <Play className="w-16 h-16 mx-auto mb-2" />
                    <p className="text-lg font-medium">영상 미리보기</p>
                    <p className="text-sm opacity-80">YouTube URL을 추가하면 실제 영상을 재생할 수 있어요</p>
                  </div>
                </div>
              )}

              {/* 감정 표현 */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>내 감정 표현</span>
                </h4>
                <p className="text-gray-700 italic">"{selectedVideo.emotion}"</p>
              </div>

              {/* 실시간 댓글 섹션 */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="border-b border-gray-200 p-4">
                  <h4 className="font-medium text-gray-800 flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                    <span>실시간 댓글 ({selectedVideo.commentCount})</span>
                    <Badge className="bg-green-100 text-green-800 text-xs">LIVE</Badge>
                  </h4>
                </div>
                
                {/* 댓글 목록 */}
                <div className="max-h-48 overflow-y-auto p-4 space-y-3">
                  {[
                    { user: "민지팬", message: "이 부분 진짜 심쿵이야 💕", time: "방금", avatar: "👑" },
                    { user: "하늘별", message: "정국이 눈빛 레전드다...", time: "1분 전", avatar: "🌟" },
                    { user: "소라공주", message: "나도 이 순간에 빠졌어 ㅠㅠ", time: "2분 전", avatar: "🌊" },
                    { user: "별빛나라", message: "이 영상으로 입덕했어요!", time: "3분 전", avatar: "✨" }
                  ].map((comment, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm">
                        {comment.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-800 text-sm">{comment.user}</span>
                          <span className="text-xs text-gray-500">{comment.time}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* 댓글 입력 */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm">
                      😊
                    </div>
                    <div className="flex-1 flex space-x-2">
                      <Input 
                        placeholder={`"${selectedVideo.title}"에 대한 생각을 남겨보세요...`}
                        className="flex-1"
                      />
                      <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 ml-11">
                    💡 댓글 작성시 3포인트 적립! 같은 덕후들과 이야기해보세요 ✨
                  </p>
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => convertMutation.mutate({ loveTreeId: 1, conversionType: "single_video" })}
                  >
                    <Heart className="w-4 h-4 mr-1 text-red-500" />
                    나도 빠짐! ({selectedVideo.likeCount})
                  </Button>
                  
                  {selectedVideo.youtubeUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(selectedVideo.youtubeUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      YouTube에서 보기
                    </Button>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setShowVideoPlayer(false)}
                >
                  닫기
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 진행률 표시 */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
        <h4 className="text-sm font-medium text-gray-800 mb-2">🌳 러브트리 진행률</h4>
        <div className="w-48 bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((videoFruits.length / 10) * 100, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-600">
          {videoFruits.length}/10 열매 완성 
          {videoFruits.length >= 10 && "🎉 완성 가능!"}
        </p>
      </div>

      {/* 전체 완성 버튼 */}
      {videoFruits.length >= 5 && !treeCompleted && (
        <div className="absolute bottom-4 right-4">
          <Button
            onClick={() => convertMutation.mutate({ loveTreeId: 1, conversionType: "tree_complete" })}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full px-6 py-3 text-lg animate-pulse"
          >
            <Heart className="w-5 h-5 mr-2" />
            완전 덕후됨! 인증하기 🔥
          </Button>
        </div>
      )}
    </div>
  );
}

// 애니메이션 CSS 추가
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes float-delay {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
  }
  
  @keyframes bounce-slow {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.05); }
  }
  
  @keyframes bounce-delay {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  
  .animate-float { animation: float 3s ease-in-out infinite; }
  .animate-float-delay { animation: float-delay 4s ease-in-out infinite; }
  .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
  .animate-bounce-delay { animation: bounce-delay 2.5s ease-in-out infinite; }
`;
document.head.appendChild(style);