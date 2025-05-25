import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  Bug, 
  Heart, 
  Star, 
  Crown, 
  Trophy, 
  MessageSquare, 
  LogOut, 
  User, 
  Moon, 
  Sun, 
  Volume2,
  Lock,
  Mail,
  Instagram,
  MessageCircle,
  Github,
  ChevronRight,
  Award,
  Sparkles,
  Target,
  Gift
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsMenu({ isOpen, onClose }: SettingsMenuProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const { toast } = useToast();

  // 성취배지 데이터
  const achievements = [
    { 
      id: 1, 
      name: "첫 트리", 
      icon: "🌱", 
      description: "첫 번째 러브트리 생성", 
      unlocked: true,
      condition: "러브트리 1개 생성",
      rarity: "common"
    },
    { 
      id: 2, 
      name: "완성자", 
      icon: "🏆", 
      description: "러브트리 완성하기", 
      unlocked: true,
      condition: "러브트리 10개 영상 추가",
      rarity: "uncommon"
    },
    { 
      id: 3, 
      name: "추천왕", 
      icon: "👑", 
      description: "많은 추천을 받은 러브트리", 
      unlocked: false,
      condition: "러브트리 100개 하트 받기",
      rarity: "rare"
    },
    { 
      id: 4, 
      name: "베테랑", 
      icon: "⭐", 
      description: "오랫동안 활동한 사용자", 
      unlocked: false,
      condition: "30일 연속 접속",
      rarity: "epic"
    },
    { 
      id: 5, 
      name: "인플루언서", 
      icon: "💎", 
      description: "많은 팔로워를 보유", 
      unlocked: false,
      condition: "팔로워 500명 달성",
      rarity: "legendary"
    },
    { 
      id: 6, 
      name: "레전드 가드너", 
      icon: "🌟", 
      description: "최고 등급 가드너", 
      unlocked: false,
      condition: "가드너 포인트 10,000점",
      rarity: "legendary"
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-700 border-gray-200";
      case "uncommon": return "bg-green-100 text-green-700 border-green-200";
      case "rare": return "bg-blue-100 text-blue-700 border-blue-200";
      case "epic": return "bg-purple-100 text-purple-700 border-purple-200";
      case "legendary": return "bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleSupportContact = (type: string) => {
    toast({
      title: `${type} 요청`,
      description: "곧 고객센터 페이지로 이동합니다!",
    });
  };

  const handleLogout = () => {
    toast({
      title: "로그아웃 되었습니다",
      description: "안전하게 로그아웃되었어요. 다시 만나요! 👋",
    });
    // 실제 로그아웃 로직 추가
  };

  const menuSections = [
    {
      id: "profile",
      title: "프로필",
      icon: <User className="w-5 h-5" />,
      items: [
        { label: "프로필 편집", action: () => toast({ title: "프로필 편집", description: "프로필 편집 페이지로 이동합니다!" }) },
        { label: "성취배지", action: () => setActiveSection("achievements") },
        { label: "내 러브트리", action: () => toast({ title: "내 러브트리", description: "내 러브트리 목록을 확인하세요!" }) }
      ]
    },
    {
      id: "settings",
      title: "설정",
      icon: <Settings className="w-5 h-5" />,
      items: [
        { label: "알림 설정", toggle: { value: notifications, onChange: setNotifications } },
        { label: "다크모드", toggle: { value: darkMode, onChange: setDarkMode } },
        { label: "사운드 효과", toggle: { value: soundEffects, onChange: setSoundEffects } },
        { label: "개인정보 보호", action: () => setActiveSection("privacy") }
      ]
    },
    {
      id: "support",
      title: "고객지원",
      icon: <HelpCircle className="w-5 h-5" />,
      items: [
        { label: "공지사항", action: () => setActiveSection("announcements") },
        { label: "사용방법", action: () => setActiveSection("tutorial") },
        { label: "고객센터", action: () => handleSupportContact("고객센터") },
        { label: "버그 신고", action: () => handleSupportContact("버그 신고") },
        { label: "기능 요청", action: () => handleSupportContact("기능 요청") }
      ]
    },
    {
      id: "about",
      title: "정보",
      icon: <Heart className="w-5 h-5" />,
      items: [
        { label: "러브트리 소개", action: () => setActiveSection("about") },
        { label: "이용약관", action: () => setActiveSection("terms") },
        { label: "개인정보처리방침", action: () => setActiveSection("privacy-policy") },
        { label: "버전 정보", action: () => toast({ title: "러브트리 v1.0.0", description: "최신 버전을 사용 중입니다! 🎉" }) }
      ]
    }
  ];

  const renderMainMenu = () => (
    <div className="space-y-6">
      {/* 사용자 정보 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl">
              🌸
            </div>
            <div>
              <h3 className="font-bold text-gray-800">러브트리 가드너</h3>
              <p className="text-sm text-gray-600">새싹 가드너 · 레벨 1</p>
              <div className="flex items-center space-x-1 mt-1">
                <Badge className="bg-gray-100 text-gray-700 text-xs">첫 트리</Badge>
                <Badge className="bg-green-100 text-green-700 text-xs">완성자</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 메뉴 섹션들 */}
      {menuSections.map((section) => (
        <div key={section.id}>
          <div className="flex items-center space-x-2 mb-3">
            {section.icon}
            <h4 className="font-bold text-gray-800">{section.title}</h4>
          </div>
          <div className="space-y-1">
            {section.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={item.action}
              >
                <span className="text-gray-700">{item.label}</span>
                <div className="flex items-center space-x-2">
                  {item.toggle ? (
                    <Switch
                      checked={item.toggle.value}
                      onCheckedChange={item.toggle.onChange}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* SNS 연결 */}
      <div>
        <h4 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <span>SNS 연결</span>
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" size="sm" className="flex flex-col items-center p-3 h-auto">
            <Instagram className="w-5 h-5 mb-1" />
            <span className="text-xs">인스타그램</span>
          </Button>
          <Button variant="outline" size="sm" className="flex flex-col items-center p-3 h-auto">
            <MessageCircle className="w-5 h-5 mb-1" />
            <span className="text-xs">카카오톡</span>
          </Button>
          <Button variant="outline" size="sm" className="flex flex-col items-center p-3 h-auto">
            <Github className="w-5 h-5 mb-1" />
            <span className="text-xs">Github</span>
          </Button>
        </div>
      </div>

      {/* 로그아웃 */}
      <Button
        variant="outline"
        onClick={handleLogout}
        className="w-full border-red-200 text-red-600 hover:bg-red-50"
      >
        <LogOut className="w-4 h-4 mr-2" />
        로그아웃
      </Button>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => setActiveSection(null)} className="p-0">
          ← 뒤로가기
        </Button>
        <h3 className="font-bold text-gray-800">성취배지</h3>
        <div></div>
      </div>

      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200">
        <div className="text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <h4 className="font-bold text-gray-800">성취도 현황</h4>
          <p className="text-sm text-gray-600 mt-1">
            {achievements.filter(a => a.unlocked).length}/{achievements.length} 달성
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full" 
              style={{ width: `${(achievements.filter(a => a.unlocked).length / achievements.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className={achievement.unlocked ? "border-green-200" : "border-gray-200"}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`text-2xl ${achievement.unlocked ? "" : "grayscale opacity-50"}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h5 className="font-bold text-gray-800">{achievement.name}</h5>
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                    {achievement.unlocked && (
                      <Badge className="bg-green-100 text-green-700">달성</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <p className="text-xs text-blue-600 mt-1">조건: {achievement.condition}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-500" />
            <span>설정</span>
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          {activeSection === "achievements" ? renderAchievements() : renderMainMenu()}
        </div>
      </DialogContent>
    </Dialog>
  );
}