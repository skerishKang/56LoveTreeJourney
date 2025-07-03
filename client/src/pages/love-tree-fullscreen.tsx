import { useState, useEffect, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { Heart, MessageCircle, Plus, X, Edit3, Play, Scissors, Clock, Zap, Video, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface LoveTreeFullscreenProps {
  loveTreeId?: number;
}

export default function LoveTreeFullscreen() {
  const [, params] = useRoute("/love-tree/:id");
  const [, setLocation] = useLocation();
  
  // 뒤로가기 핸들러
  const handleGoBack = () => {
    setLocation("/");
  };
  
  // 키보드 ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleGoBack();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [isAddingText, setIsAddingText] = useState(false);
  const [isVideoEditing, setIsVideoEditing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [draggedNode, setDraggedNode] = useState<any>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // 영상 추가 폼 상태
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoReview, setNewVideoReview] = useState("");
  const [newTextContent, setNewTextContent] = useState("");
  
  // 영상 편집 상태
  const [loveStruck, setLoveStruck] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [emotionIntensity, setEmotionIntensity] = useState([5]);
  const [loveReason, setLoveReason] = useState("");
  const [currentEditingVideo, setCurrentEditingVideo] = useState<any>(null);

  const loveTreeId = params?.id ? parseInt(params.id) : 1;

  // 예시 러브트리 데이터
  const loveTreeData = {
    id: loveTreeId,
    title: "👑 LE SSERAFIM 입덕기 💖",
    videos: [
      {
        id: 1,
        title: "금성제",
        thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg",
        review: "저번주 금요일에 3일 빠졌다가 어제 다시 금성제❤️‍🔥 발성 목소리 발음 욕의 찰짐 넘 좋아 진짜🩷",
        likes: 24,
        comments: 8,
        date: "2024.01.15",
        isRewatched: true,
        x: 400,
        y: 200,
        color: "#FF6B9D",
        loveStruck: true,
        loveTimestamp: "2:30",
        endTimestamp: "2:45",
        emotionIntensity: 9,
        loveReason: "발성이 너무 완벽해서 소름돋았어 ❤️‍🔥",
        gardenerLevel: "마스터"
      },
      {
        id: 2,
        title: "크루즈 수영장",
        thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg",
        review: "크루즈와 파트리끄 수영장씬 진짜 이뻐💎 천만원 걸게 파트리끄한테!",
        likes: 18,
        comments: 5,
        date: "2024.01.12",
        isRewatched: false,
        x: 200,
        y: 350,
        color: "#4ECDC4",
        loveStruck: true,
        loveTimestamp: "1:23",
        endTimestamp: "1:40",
        emotionIntensity: 7,
        loveReason: "수영장에서 웃는 모습이 천사같아서 💎",
        gardenerLevel: "새싹"
      },
      {
        id: 3,
        title: "마누 미소",
        thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg",
        review: "마누 보고파다💕 흰피부에 이렇게 꽂힐줄이야~ 수염으로 가리지마 이쁜 얼굴 드러내야지✨",
        likes: 31,
        comments: 12,
        date: "2024.01.10",
        isRewatched: true,
        x: 600,
        y: 300,
        color: "#A8E6CF",
        loveStruck: true,
        loveTimestamp: "0:15",
        endTimestamp: "0:25",
        emotionIntensity: 8,
        loveReason: "미소가 너무 예뻐서 심장이 뛰었어 💕",
        gardenerLevel: "정원사"
      }
    ],
    texts: [
      {
        id: 1,
        content: "르세라핌 처음 본 순간부터 심장이 뛰었어요 💗",
        x: 100,
        y: 150,
        color: "#FFD93D"
      }
    ],
    connections: [
      { from: 1, to: 2, color: "#FF6B9D" },
      { from: 2, to: 3, color: "#4ECDC4" },
      { from: 1, to: 3, color: "#A8E6CF" }
    ]
  };

  const [videos, setVideos] = useState(loveTreeData.videos);
  const [texts, setTexts] = useState(loveTreeData.texts);

  // 드래그 핸들러
  const handleMouseDown = (e: React.MouseEvent, node: any) => {
    e.preventDefault();
    setDraggedNode(node);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - node.x,
        y: e.clientY - rect.top - node.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;
      
      if (draggedNode.title) {
        // 영상 노드
        setVideos(prev => prev.map(v => 
          v.id === draggedNode.id ? { ...v, x: newX, y: newY } : v
        ));
      } else {
        // 텍스트 노드
        setTexts(prev => prev.map(t => 
          t.id === draggedNode.id ? { ...t, x: newX, y: newY } : t
        ));
      }
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
    setDragOffset({ x: 0, y: 0 });
  };

  // 하트 클릭 핸들러
  const handleLike = (videoId: number) => {
    setVideos(prev => prev.map(v => 
      v.id === videoId ? { ...v, likes: v.likes + 1 } : v
    ));
  };

  // 영상 편집 시작
  const startVideoEdit = (video: any) => {
    setCurrentEditingVideo(video);
    setLoveStruck(video.loveStruck || false);
    setStartTime(video.loveTimestamp || "");
    setEndTime(video.endTimestamp || "");
    setEmotionIntensity([video.emotionIntensity || 5]);
    setLoveReason(video.loveReason || "");
    setIsVideoEditing(true);
  };

  const handleAddVideo = () => {
    if (newVideoUrl && newVideoReview) {
      const newVideo = {
        id: videos.length + 1,
        title: "새 영상",
        thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg",
        review: newVideoReview,
        likes: 0,
        comments: 0,
        date: new Date().toLocaleDateString('ko-KR'),
        isRewatched: false,
        x: Math.random() * 400 + 200,
        y: Math.random() * 300 + 150,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        loveStruck: loveStruck,
        loveTimestamp: startTime,
        endTimestamp: endTime,
        emotionIntensity: emotionIntensity[0],
        loveReason: loveReason,
        gardenerLevel: "새싹"
      };
      setVideos([...videos, newVideo]);
      setNewVideoUrl("");
      setNewVideoReview("");
      setLoveStruck(false);
      setStartTime("");
      setEndTime("");
      setEmotionIntensity([5]);
      setLoveReason("");
      setIsAddingVideo(false);
    }
  };

  const handleSaveVideoEdit = () => {
    if (currentEditingVideo) {
      setVideos(prev => prev.map(v => 
        v.id === currentEditingVideo.id 
          ? { 
              ...v, 
              loveStruck, 
              loveTimestamp: startTime, 
              endTimestamp: endTime, 
              emotionIntensity: emotionIntensity[0], 
              loveReason 
            }
          : v
      ));
      setIsVideoEditing(false);
      setCurrentEditingVideo(null);
    }
  };

  const handleAddText = () => {
    if (newTextContent) {
      const newText = {
        id: texts.length + 1,
        content: newTextContent,
        x: Math.random() * 400 + 200,
        y: Math.random() * 300 + 150,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      };
      setTexts([...texts, newText]);
      setNewTextContent("");
      setIsAddingText(false);
    }
  };

  const getGardenerColor = (level: string) => {
    switch(level) {
      case "새싹": return "#4ADE80";
      case "정원사": return "#3B82F6";
      case "마스터": return "#8B5CF6";
      case "레전드": return "#F59E0B";
      default: return "#6B7280";
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 z-50">
      {/* 헤더 */}
      <div className="absolute top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleGoBack}
              className="fixed top-4 right-4 z-50 p-3 bg-white/90 hover:bg-white border border-gray-200 rounded-full transition-all shadow-lg hover:shadow-xl"
              title="닫기 (ESC)"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
            <button 
              onClick={handleGoBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">{loveTreeData.title}</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setIsAddingVideo(true)}
              size="sm"
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              영상 추가
            </Button>
            <Button
              onClick={() => setIsAddingText(true)}
              size="sm"
              variant="outline"
              className="border-gray-300"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              텍스트 추가
            </Button>
          </div>
        </div>
      </div>

      {/* 메인 러브트리 캔버스 */}
      <div 
        ref={canvasRef}
        className="absolute inset-0 pt-20 pb-4 px-4 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="relative w-full h-full max-w-7xl mx-auto">
          {/* 연결선들 */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {loveTreeData.connections.map((connection, index) => {
              const fromVideo = videos.find(v => v.id === connection.from);
              const toVideo = videos.find(v => v.id === connection.to);
              
              if (!fromVideo || !toVideo) return null;
              
              return (
                <path
                  key={`${connection.from}-${connection.to}`}
                  d={`M ${fromVideo.x + 140} ${fromVideo.y + 80} Q ${(fromVideo.x + toVideo.x) / 2 + 140} ${(fromVideo.y + toVideo.y) / 2 + 60} ${toVideo.x + 140} ${toVideo.y + 80}`}
                  stroke={getGardenerColor(fromVideo.gardenerLevel)}
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="8,4"
                  className="opacity-80"
                />
              );
            })}
          </svg>

          {/* 영상 노드들 */}
          {videos.map((video) => (
            <div
              key={video.id}
              className="absolute group cursor-move select-none"
              style={{ left: `${video.x}px`, top: `${video.y}px` }}
              onMouseDown={(e) => handleMouseDown(e, video)}
            >
              {/* 드래그 핸들 */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Move className="w-3 h-3 text-white" />
              </div>

              {/* 영상 편집 버튼 */}
              <button
                onClick={() => startVideoEdit(video)}
                className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <Scissors className="w-3 h-3 text-white" />
              </button>

              {/* 가드너 레벨 뱃지 */}
              <div 
                className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-full text-xs text-white font-medium"
                style={{ backgroundColor: getGardenerColor(video.gardenerLevel) }}
              >
                {video.gardenerLevel}
              </div>

              {/* 영상 카드 */}
              <div className="bg-white rounded-xl shadow-lg p-4 w-[280px] border-2 hover:shadow-xl transition-all duration-300"
                   style={{ borderColor: getGardenerColor(video.gardenerLevel) }}>
                
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: video.color }}></div>
                    <span className="font-medium text-gray-800">{video.title}</span>
                    {video.isRewatched && <Badge variant="secondary" className="text-xs">재시청</Badge>}
                  </div>
                  <span className="text-xs text-gray-500">{video.date}</span>
                </div>

                {/* 사랑에 빠진 순간 표시 */}
                {video.loveStruck && (
                  <div className="mb-3 p-2 bg-pink-50 rounded-lg border border-pink-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <Zap className="w-4 h-4 text-pink-500" />
                      <span className="text-sm font-medium text-pink-700">사랑에 빠진 순간!</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {video.loveTimestamp} - {video.endTimestamp}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      💕 강도: {video.emotionIntensity}/10
                    </div>
                  </div>
                )}
                
                {/* 썸네일 */}
                <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center relative">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-current" />
                  </div>
                  {video.loveStruck && (
                    <div className="absolute top-2 right-2 bg-pink-500 text-white px-2 py-1 rounded-full text-xs">
                      💝 {video.loveTimestamp}
                    </div>
                  )}
                </div>
                
                {/* 감상 리뷰 */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700 leading-relaxed max-h-20 overflow-y-auto">
                    {video.review}
                  </p>
                  {video.loveReason && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-pink-600 font-medium">
                        💝 {video.loveReason}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* 하트 & 댓글 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => handleLike(video.id)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{video.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{video.comments}</span>
                    </button>
                  </div>
                  <div className="text-xs text-gray-400">
                    감정 강도: {video.emotionIntensity}/10
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* 텍스트 노드들 */}
          {texts.map((text) => (
            <div
              key={text.id}
              className="absolute group cursor-move select-none"
              style={{ left: `${text.x}px`, top: `${text.y}px` }}
              onMouseDown={(e) => handleMouseDown(e, text)}
            >
              {/* 드래그 핸들 */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Move className="w-3 h-3 text-white" />
              </div>
              
              <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md p-3 max-w-[200px] border-l-4 hover:shadow-lg transition-all"
                   style={{ borderLeftColor: text.color }}>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {text.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 영상 추가 모달 */}
      {isAddingVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6 text-center">💖 영상 편집 스튜디오</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 영상 미리보기 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">📹 영상 미리보기</label>
                  <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">1:23</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">영상 URL</label>
                  <Input
                    type="text"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder="유튜브 링크를 입력하세요"
                  />
                </div>
              </div>

              {/* 영상 편집 도구들 */}
              <div className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-medium text-amber-800 mb-3">💝 영상 편집 - 이춘문 업리프트</h4>
                  
                  {/* 사랑에 빠진 순간 스위치 */}
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-gray-700">💕 사랑에 빠진 순간</label>
                    <Switch checked={loveStruck} onCheckedChange={setLoveStruck} />
                  </div>

                  {loveStruck && (
                    <div className="space-y-4 pl-4 border-l-2 border-pink-300">
                      {/* 타임스탬프 설정 */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-600">시작 시간</label>
                          <Input
                            type="text"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            placeholder="1:23"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">끝 시간</label>
                          <Input
                            type="text"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            placeholder="1:40"
                            className="text-sm"
                          />
                        </div>
                      </div>

                      {/* 감정 강도 슬라이더 */}
                      <div>
                        <label className="text-xs text-gray-600 mb-2 block">💖 감정 강도: {emotionIntensity[0]}/10</label>
                        <div className="px-2">
                          <Slider
                            value={emotionIntensity}
                            onValueChange={setEmotionIntensity}
                            max={10}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>😊</span>
                          <span>😍</span>
                          <span>🥰</span>
                          <span>😘</span>
                          <span>🤩</span>
                        </div>
                      </div>

                      {/* 사랑에 빠진 이유 */}
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">💝 사랑에 빠진 이유</label>
                        <Textarea
                          value={loveReason}
                          onChange={(e) => setLoveReason(e.target.value)}
                          placeholder="이 순간이 왜 특별한지 적어보세요..."
                          className="h-20 text-sm resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 심쿵 포인트 마킹 */}
                <div className="bg-pink-50 p-3 rounded-lg">
                  <h5 className="text-sm font-medium text-pink-700 mb-2">✨ 심쿵 포인트 마킹</h5>
                  <div className="flex flex-wrap gap-2">
                    {['0:15', '1:23', '2:45', '3:12'].map(time => (
                      <button
                        key={time}
                        className="px-2 py-1 bg-pink-100 text-pink-600 rounded text-xs hover:bg-pink-200"
                        onClick={() => setStartTime(time)}
                      >
                        💖 {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 감상 후기 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">📝 감상 후기</label>
              <Textarea
                value={newVideoReview}
                onChange={(e) => setNewVideoReview(e.target.value)}
                placeholder="이 영상을 보고 어떤 기분이었는지 생생하게 적어보세요..."
                className="w-full h-24 resize-none"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setIsAddingVideo(false)}>
                취소
              </Button>
              <Button onClick={handleAddVideo} className="bg-pink-500 hover:bg-pink-600">
                🌸 추가하기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 영상 편집 모달 */}
      {isVideoEditing && currentEditingVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6 text-center">✂️ 영상 편집 - {currentEditingVideo.title}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 영상 미리보기 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">📹 영상 미리보기</label>
                  <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">{startTime || "0:00"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">현재 설정</h5>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>🎬 구간: {startTime} - {endTime}</p>
                    <p>💕 강도: {emotionIntensity[0]}/10</p>
                    <p>🎯 사랑에 빠진 순간: {loveStruck ? '✅' : '❌'}</p>
                  </div>
                </div>
              </div>

              {/* 영상 편집 도구들 */}
              <div className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-medium text-amber-800 mb-3">💝 사랑에 빠진 순간 설정</h4>
                  
                  {/* 사랑에 빠진 순간 스위치 */}
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-gray-700">💕 사랑에 빠진 순간</label>
                    <Switch checked={loveStruck} onCheckedChange={setLoveStruck} />
                  </div>

                  {loveStruck && (
                    <div className="space-y-4 pl-4 border-l-2 border-pink-300">
                      {/* 타임스탬프 설정 */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-600">시작 시간</label>
                          <Input
                            type="text"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            placeholder="1:23"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">끝 시간</label>
                          <Input
                            type="text"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            placeholder="1:40"
                            className="text-sm"
                          />
                        </div>
                      </div>

                      {/* 감정 강도 슬라이더 */}
                      <div>
                        <label className="text-xs text-gray-600 mb-2 block">💖 감정 강도: {emotionIntensity[0]}/10</label>
                        <div className="px-2">
                          <Slider
                            value={emotionIntensity}
                            onValueChange={setEmotionIntensity}
                            max={10}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>😊</span>
                          <span>😍</span>
                          <span>🥰</span>
                          <span>😘</span>
                          <span>🤩</span>
                        </div>
                      </div>

                      {/* 사랑에 빠진 이유 */}
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">💝 사랑에 빠진 이유</label>
                        <Textarea
                          value={loveReason}
                          onChange={(e) => setLoveReason(e.target.value)}
                          placeholder="이 순간이 왜 특별한지 적어보세요..."
                          className="h-20 text-sm resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setIsVideoEditing(false)}>
                취소
              </Button>
              <Button onClick={handleSaveVideoEdit} className="bg-amber-500 hover:bg-yellow-600">
                ✂️ 편집 완료
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 텍스트 추가 모달 */}
      {isAddingText && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">✨ 텍스트 추가하기</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">💭 내용</label>
                <Textarea
                  value={newTextContent}
                  onChange={(e) => setNewTextContent(e.target.value)}
                  placeholder="생각이나 감정을 자유롭게 적어보세요..."
                  className="w-full h-24 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setIsAddingText(false)}>
                취소
              </Button>
              <Button onClick={handleAddText} className="bg-blue-500 hover:bg-blue-600">
                💭 추가하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}