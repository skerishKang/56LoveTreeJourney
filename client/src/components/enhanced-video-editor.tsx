import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Play, Edit3, Scissors, Save, Download, Sparkles, Heart, Volume2, VolumeX, Pause, RotateCcw, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnhancedVideoEditorProps {
  videoUrl?: string;
  onSave: (editedData: any) => void;
}

export default function EnhancedVideoEditor({ videoUrl, onSave }: EnhancedVideoEditorProps) {
  const { toast } = useToast();
  const [editedTitle, setEditedTitle] = useState("내가 편집한 영상");
  const [startTime, setStartTime] = useState([0]);
  const [endTime, setEndTime] = useState([100]);
  const [volume, setVolume] = useState([80]);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedMoments, setSelectedMoments] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const heartMoments = [
    { time: "0:15", label: "첫 등장", emoji: "💕", description: "처음 나왔을 때 심쿵!" },
    { time: "1:23", label: "미소", emoji: "🥰", description: "이 미소 때문에 빠짐" },
    { time: "2:45", label: "댄스", emoji: "🔥", description: "이 춤이 레전드" },
    { time: "3:12", label: "윙크", emoji: "😉", description: "심장 정지 순간" },
    { time: "4:30", label: "보컬", emoji: "🎵", description: "목소리가 천사" }
  ];

  const videoFilters = [
    { name: "빈티지", emoji: "🌅", color: "from-orange-400 to-yellow-400", description: "따뜻한 필름 느낌" },
    { name: "드림", emoji: "✨", color: "from-purple-400 to-pink-400", description: "몽환적인 분위기" },
    { name: "러블리", emoji: "💕", color: "from-pink-400 to-rose-400", description: "핑크빛 로맨틱" },
    { name: "시네마", emoji: "🎬", color: "from-gray-600 to-gray-800", description: "영화 같은 느낌" },
    { name: "네온", emoji: "🌈", color: "from-cyan-400 to-purple-400", description: "화려한 네온 효과" }
  ];

  const handleSaveEdit = () => {
    const editedData = {
      title: editedTitle,
      startTime: startTime[0],
      endTime: endTime[0],
      volume: volume[0],
      heartMoments: selectedMoments,
      filters: selectedFilters,
      timestamp: new Date().toISOString()
    };

    onSave(editedData);
    
    toast({
      title: "🎉 편집 완료!",
      description: `"${editedTitle}" 영상이 성공적으로 편집되었습니다!`,
    });
  };

  const toggleMoment = (moment: string) => {
    setSelectedMoments(prev => 
      prev.includes(moment) 
        ? prev.filter(m => m !== moment)
        : [...prev, moment]
    );
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-200">
      {/* 헤더 */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center space-x-2">
          <Edit3 className="w-6 h-6 text-pink-500" />
          <span>영상 편집 스튜디오</span>
        </h2>
        <p className="text-gray-600 mt-2">내 마음대로 자르고, 필터 적용하고, 심쿵 포인트를 마킹해보세요! 🎬✨</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 영상 미리보기 영역 */}
        <div className="space-y-4">
          <Card className="border-pink-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Play className="w-5 h-5 text-pink-500" />
                <span>영상 미리보기</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* 가상 영상 플레이어 */}
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20"></div>
                <div className="text-center text-white z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 mx-auto">
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                  </div>
                  <p className="text-sm opacity-80">영상이 여기에 표시됩니다</p>
                </div>
                
                {/* 필터 미리보기 오버레이 */}
                {selectedFilters.length > 0 && (
                  <div className="absolute inset-0 bg-gradient-to-br opacity-30"
                       style={{
                         background: selectedFilters.includes('러블리') ? 'linear-gradient(to bottom right, #f472b6, #ec4899)' :
                                   selectedFilters.includes('빈티지') ? 'linear-gradient(to bottom right, #fb923c, #fbbf24)' :
                                   selectedFilters.includes('드림') ? 'linear-gradient(to bottom right, #a855f7, #ec4899)' :
                                   'transparent'
                       }}>
                  </div>
                )}
              </div>

              {/* 재생 컨트롤 */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-center space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="border-pink-200 hover:bg-pink-50"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" size="sm" className="border-pink-200 hover:bg-pink-50">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                {/* 진행 바 */}
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1:23</span>
                    <span>4:30</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 영상 제목 편집 */}
          <Card className="border-pink-200">
            <CardContent className="pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">영상 제목</label>
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="편집된 영상의 제목을 입력하세요"
                className="border-pink-200 focus:border-pink-400"
              />
            </CardContent>
          </Card>
        </div>

        {/* 편집 도구 영역 */}
        <div className="space-y-4">
          {/* 자르기 도구 */}
          <Card className="border-pink-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Scissors className="w-5 h-5 text-pink-500" />
                <span>영상 자르기</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">시작 시간</label>
                <Slider
                  value={startTime}
                  onValueChange={setStartTime}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 mt-1">{startTime[0]}초</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">끝 시간</label>
                <Slider
                  value={endTime}
                  onValueChange={setEndTime}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 mt-1">{endTime[0]}초</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>볼륨</span>
                </label>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={isMuted}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">{isMuted ? '음소거' : `${volume[0]}%`}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-xs border-pink-200"
                  >
                    {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 심쿵 포인트 마킹 */}
          <Card className="border-pink-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Heart className="w-5 h-5 text-pink-500" />
                <span>심쿵 포인트 마킹</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {heartMoments.map((moment) => (
                  <div
                    key={moment.time}
                    onClick={() => toggleMoment(moment.time)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedMoments.includes(moment.time)
                        ? 'border-pink-400 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-200 hover:bg-pink-25'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{moment.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-800">{moment.label}</span>
                          <Badge variant="outline" className="text-xs">{moment.time}</Badge>
                        </div>
                        <p className="text-xs text-gray-600">{moment.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 필터 효과 */}
          <Card className="border-pink-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
                <span>필터 효과</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {videoFilters.map((filter) => (
                  <div
                    key={filter.name}
                    onClick={() => toggleFilter(filter.name)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedFilters.includes(filter.name)
                        ? 'border-pink-400 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-200'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-8 h-8 bg-gradient-to-r ${filter.color} rounded-full mx-auto mb-2 flex items-center justify-center`}>
                        <span className="text-white text-sm">{filter.emoji}</span>
                      </div>
                      <div className="text-sm font-medium text-gray-800">{filter.name}</div>
                      <div className="text-xs text-gray-600">{filter.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 하단 액션 버튼 */}
      <div className="mt-6 flex justify-center space-x-3">
        <Button
          onClick={handleSaveEdit}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-2"
        >
          <Save className="w-4 h-4 mr-2" />
          편집 저장
        </Button>
        
        <Button variant="outline" className="border-pink-200 hover:bg-pink-50">
          <Download className="w-4 h-4 mr-2" />
          다운로드
        </Button>
        
        <Button variant="outline" className="border-pink-200 hover:bg-pink-50">
          <Share2 className="w-4 h-4 mr-2" />
          공유하기
        </Button>
      </div>

      {/* 선택된 항목 요약 */}
      {(selectedMoments.length > 0 || selectedFilters.length > 0) && (
        <div className="mt-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
          <h4 className="font-medium text-gray-800 mb-2">선택된 편집 옵션</h4>
          <div className="flex flex-wrap gap-2">
            {selectedMoments.map((moment) => (
              <Badge key={moment} variant="secondary" className="bg-pink-100 text-pink-700">
                💕 {moment}
              </Badge>
            ))}
            {selectedFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="bg-purple-100 text-purple-700">
                ✨ {filter}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}