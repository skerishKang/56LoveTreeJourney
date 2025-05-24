import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { Heart, MessageCircle, Plus, X, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface LoveTreeFullscreenProps {
  loveTreeId?: number;
}

export default function LoveTreeFullscreen() {
  const [, params] = useRoute("/love-tree/:id");
  const [, setLocation] = useLocation();
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [isAddingText, setIsAddingText] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoReview, setNewVideoReview] = useState("");
  const [newTextContent, setNewTextContent] = useState("");

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
        date: "2024.01.15",
        isRewatched: true,
        x: 50,
        y: 30,
        color: "#FF6B9D"
      },
      {
        id: 2,
        title: "크루즈 수영장",
        thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg",
        review: "크루즈와 파트리끄 수영장씬 진짜 이뻐💎 천만원 걸게 파트리끄한테!",
        likes: 18,
        date: "2024.01.12",
        isRewatched: false,
        x: 30,
        y: 60,
        color: "#4ECDC4"
      },
      {
        id: 3,
        title: "마누 미소",
        thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg",
        review: "마누 보고파다💕 흰피부에 이렇게 꽂힐줄이야~ 수염으로 가리지마 이쁜 얼굴 드러내야지✨",
        likes: 31,
        date: "2024.01.10",
        isRewatched: true,
        x: 70,
        y: 50,
        color: "#A8E6CF"
      }
    ],
    texts: [
      {
        id: 1,
        content: "르세라핌 처음 본 순간부터 심장이 뛰었어요 💗",
        x: 15,
        y: 25,
        color: "#FFD93D"
      }
    ]
  };

  const [videos, setVideos] = useState(loveTreeData.videos);
  const [texts, setTexts] = useState(loveTreeData.texts);

  const handleAddVideo = () => {
    if (newVideoUrl && newVideoReview) {
      const newVideo = {
        id: videos.length + 1,
        title: "새 영상",
        thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg",
        review: newVideoReview,
        likes: 0,
        date: new Date().toLocaleDateString('ko-KR'),
        isRewatched: false,
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      };
      setVideos([...videos, newVideo]);
      setNewVideoUrl("");
      setNewVideoReview("");
      setIsAddingVideo(false);
    }
  };

  const handleAddText = () => {
    if (newTextContent) {
      const newText = {
        id: texts.length + 1,
        content: newTextContent,
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      };
      setTexts([...texts, newText]);
      setNewTextContent("");
      setIsAddingText(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 z-50">
      {/* 헤더 */}
      <div className="absolute top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setLocation("/")}
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
      <div className="absolute inset-0 pt-20 pb-4 px-4">
        <div className="relative w-full h-full max-w-7xl mx-auto">
          {/* 연결선들 */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {videos.map((video, index) => (
              videos.slice(index + 1).map(nextVideo => (
                <path
                  key={`${video.id}-${nextVideo.id}`}
                  d={`M ${video.x}% ${video.y}% Q ${(video.x + nextVideo.x) / 2}% ${(video.y + nextVideo.y) / 2 - 5}% ${nextVideo.x}% ${nextVideo.y}%`}
                  stroke="#E2E8F0"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  className="opacity-60"
                />
              ))
            ))}
          </svg>

          {/* 영상 노드들 */}
          {videos.map((video) => (
            <div
              key={video.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${video.x}%`, top: `${video.y}%` }}
            >
              {/* 영상 카드 */}
              <div className="bg-white rounded-xl shadow-lg p-4 min-w-[280px] max-w-[320px] border-2 hover:shadow-xl transition-all duration-300"
                   style={{ borderColor: video.color }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: video.color }}></div>
                    <span className="font-medium text-gray-800">{video.title}</span>
                    {video.isRewatched && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">재시청</span>}
                  </div>
                  <span className="text-xs text-gray-500">{video.date}</span>
                </div>
                
                {/* 썸네일 */}
                <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-white ml-1"></div>
                  </div>
                </div>
                
                {/* 감상 리뷰 */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700 leading-relaxed max-h-20 overflow-y-auto">
                    {video.review}
                  </p>
                </div>
                
                {/* 하트 & 댓글 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{video.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">5</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* 텍스트 노드들 */}
          {texts.map((text) => (
            <div
              key={text.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${text.x}%`, top: `${text.y}%` }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3 max-w-[200px] border-l-4"
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
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">영상 추가하기</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">영상 URL</label>
                <input
                  type="text"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="유튜브 링크를 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">감상 후기</label>
                <Textarea
                  value={newVideoReview}
                  onChange={(e) => setNewVideoReview(e.target.value)}
                  placeholder="이 영상을 보고 어떤 기분이었는지 생생하게 적어보세요..."
                  className="w-full h-24 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setIsAddingVideo(false)}>
                취소
              </Button>
              <Button onClick={handleAddVideo} className="bg-pink-500 hover:bg-pink-600">
                추가하기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 텍스트 추가 모달 */}
      {isAddingText && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">텍스트 추가하기</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
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
                추가하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}