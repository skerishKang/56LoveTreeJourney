import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Play, Edit3, Scissors, Save, Download, Sparkles, Heart, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoEditorProps {
  videoUrl?: string;
  onSave: (editedData: any) => void;
}

export default function VideoEditor({ videoUrl, onSave }: VideoEditorProps) {
  const { toast } = useToast();
  const [editedTitle, setEditedTitle] = useState("내가 편집한 영상");
  const [startTime, setStartTime] = useState([0]);
  const [endTime, setEndTime] = useState([100]);
  const [volume, setVolume] = useState([80]);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedMoments, setSelectedMoments] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const heartMoments = [
    { time: "0:15", label: "첫 등장 💕", description: "처음 나왔을 때 심쿵!" },
    { time: "1:23", label: "미소 🥰", description: "이 미소 때문에 빠짐" },
    { time: "2:45", label: "댄스 🔥", description: "이 춤이 레전드" },
    { time: "3:12", label: "윙크 😉", description: "심장 정지 순간" },
    { time: "4:30", label: "보컬 🎵", description: "목소리가 천사" }
  ];

  const videoFilters = [
    { name: "빈티지", icon: "🌅", description: "따뜻한 필름 느낌" },
    { name: "드림", icon: "✨", description: "몽환적인 분위기" },
    { name: "러블리", icon: "💕", description: "핑크빛 로맨틱" },
    { name: "시네마", icon: "🎬", description: "영화 같은 느낌" },
    { name: "네온", icon: "🌈", description: "화려한 네온 효과" }
  ];

  const handleSaveEdit = () => {
    const editedData = {
      title: editedTitle,
      startTime: startTime[0],
      endTime: endTime[0],
      volume: volume[0],
      isMuted,
      heartMoments: selectedMoments,
      customNote,
      filters: selectedFilters,
      editedAt: new Date().toISOString()
    };

    onSave(editedData);
    
    toast({
      title: "편집 완료! 🎬",
      description: "내 마음대로 편집한 영상이 저장되었어요!",
    });
    
    setIsOpen(false);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          variant="outline"
          className="text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white"
        >
          <Edit3 className="w-4 h-4 mr-1" />
          내 마음대로 편집
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <span>영상 편집하기 - 내 마음대로! 💕</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 영상 미리보기 */}
          <Card>
            <CardContent className="p-4">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="text-center">
                  <Play className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                  <p className="text-lg font-medium text-gray-700">{editedTitle}</p>
                  <p className="text-sm text-gray-500">편집 미리보기</p>
                </div>
                
                {/* 필터 오버레이 */}
                {selectedFilters.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none">
                    {selectedFilters.includes("빈티지") && <div className="absolute inset-0 bg-orange-200/30"></div>}
                    {selectedFilters.includes("드림") && <div className="absolute inset-0 bg-purple-200/30"></div>}
                    {selectedFilters.includes("러블리") && <div className="absolute inset-0 bg-pink-200/30"></div>}
                    {selectedFilters.includes("시네마") && <div className="absolute inset-0 bg-gray-900/20"></div>}
                    {selectedFilters.includes("네온") && <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 to-pink-200/30"></div>}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 기본 편집 옵션 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">기본 편집</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">제목 수정</label>
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="내가 만드는 특별한 제목..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">시작 시간 (%)</label>
                  <Slider
                    value={startTime}
                    onValueChange={setStartTime}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">{startTime[0]}% 지점부터 시작</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">종료 시간 (%)</label>
                  <Slider
                    value={endTime}
                    onValueChange={setEndTime}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">{endTime[0]}% 지점에서 종료</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">볼륨</label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={5}
                  disabled={isMuted}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {isMuted ? "음소거" : `볼륨 ${volume[0]}%`}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 심쿵 포인트 선택 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span>심쿵 포인트 마킹</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">특별히 심쿵했던 순간들을 표시해보세요!</p>
              <div className="grid grid-cols-1 gap-3">
                {heartMoments.map((moment, index) => (
                  <div
                    key={index}
                    onClick={() => toggleMoment(moment.time)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedMoments.includes(moment.time)
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">{moment.label}</div>
                        <div className="text-sm text-gray-600">{moment.description}</div>
                      </div>
                      <div className="text-sm font-mono text-gray-500">{moment.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 필터 효과 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">필터 효과</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {videoFilters.map((filter, index) => (
                  <div
                    key={index}
                    onClick={() => toggleFilter(filter.name)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-center ${
                      selectedFilters.includes(filter.name)
                        ? "border-purple-300 bg-purple-50"
                        : "border-gray-200 hover:border-purple-200"
                    }`}
                  >
                    <div className="text-2xl mb-2">{filter.icon}</div>
                    <div className="font-medium text-gray-800">{filter.name}</div>
                    <div className="text-xs text-gray-600">{filter.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 개인 메모 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">나만의 메모</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="이 영상에 대한 특별한 생각이나 느낌을 적어보세요..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* 저장 버튼 */}
          <div className="flex space-x-3">
            <Button 
              onClick={handleSaveEdit}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
            >
              <Save className="w-4 h-4 mr-2" />
              편집 저장하기
            </Button>
            
            <Button 
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              다운로드
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}