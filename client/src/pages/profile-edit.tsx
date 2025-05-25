import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Camera, Save, User, Mail, Calendar, Globe, Lock } from "lucide-react";
import BottomNavigation from "@/components/bottom-navigation";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function ProfileEdit() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    displayName: "Hye-Rim",
    bio: "K-pop과 드라마를 사랑하는 러브트리 가드너 🌸",
    location: "Seoul, Korea",
    website: "",
    isPublic: true,
    allowMessages: true,
    showActivity: true
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // API 호출 (실제 구현 시 추가)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "프로필 저장 완료! 🎉",
        description: "프로필이 성공적으로 업데이트되었어요!",
      });
    } catch (error) {
      toast({
        title: "저장 실패",
        description: "다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const profileEmojis = ["🌸", "💕", "⭐", "🎵", "🌟", "💎", "🦋", "🌺", "🎀", "✨"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-love-light via-white to-love-light">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-love-pink/20">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-800">프로필 편집</h1>
            <Button 
              onClick={handleSave}
              disabled={isLoading}
              size="sm"
              className="bg-gradient-to-r from-pink-500 to-purple-500"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pb-20 space-y-6">
        {/* 프로필 사진 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-pink-500" />
              <span>프로필 아바타</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">
                🌸
              </div>
              <p className="text-sm text-gray-600 mb-4">아바타를 선택하세요</p>
            </div>
            
            <div className="grid grid-cols-5 gap-3">
              {profileEmojis.map((emoji) => (
                <button
                  key={emoji}
                  className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 transition-transform"
                  onClick={() => toast({ title: "아바타 변경", description: `${emoji} 아바타로 변경되었어요!` })}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-500" />
              <span>기본 정보</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="displayName">표시 이름</Label>
              <Input
                id="displayName"
                value={profileData.displayName}
                onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                placeholder="표시할 이름을 입력하세요"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="bio">소개</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                placeholder="자신을 소개해보세요"
                className="mt-1 min-h-[80px]"
              />
              <p className="text-xs text-gray-500 mt-1">{profileData.bio.length}/150</p>
            </div>

            <div>
              <Label htmlFor="location">위치</Label>
              <Input
                id="location"
                value={profileData.location}
                onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                placeholder="위치를 입력하세요"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="website">웹사이트</Label>
              <Input
                id="website"
                value={profileData.website}
                onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* 계정 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-green-500" />
              <span>계정 정보</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>이메일</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                <p className="text-gray-600">{user?.email || "muphobia2@gmail.com"}</p>
                <p className="text-xs text-gray-500 mt-1">이메일은 변경할 수 없어요</p>
              </div>
            </div>

            <div>
              <Label>가입일</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                <p className="text-gray-600">2025년 1월 25일</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 개인정보 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-purple-500" />
              <span>개인정보 설정</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>공개 프로필</Label>
                <p className="text-sm text-gray-600">다른 사용자가 내 프로필을 볼 수 있어요</p>
              </div>
              <Switch
                checked={profileData.isPublic}
                onCheckedChange={(checked) => setProfileData({...profileData, isPublic: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>메시지 허용</Label>
                <p className="text-sm text-gray-600">다른 사용자가 메시지를 보낼 수 있어요</p>
              </div>
              <Switch
                checked={profileData.allowMessages}
                onCheckedChange={(checked) => setProfileData({...profileData, allowMessages: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>활동 표시</Label>
                <p className="text-sm text-gray-600">내 러브트리 활동을 다른 사람이 볼 수 있어요</p>
              </div>
              <Switch
                checked={profileData.showActivity}
                onCheckedChange={(checked) => setProfileData({...profileData, showActivity: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* 위험 구역 */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">위험 구역</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
              계정 비활성화
            </Button>
            <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
              계정 삭제
            </Button>
            <p className="text-xs text-gray-500">
              계정을 삭제하면 모든 러브트리와 데이터가 영구적으로 삭제됩니다.
            </p>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
}