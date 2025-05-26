import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Compass, Plus, Users, User, Sparkles, Play } from "lucide-react";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "홈" },
    { path: "/community", icon: Users, label: "커뮤니티" },
    { path: "/reactflow-tree", icon: Plus, label: "추가", isSpecial: true },
    { path: "/templates", icon: Sparkles, label: "템플릿" },
    { path: "/profile", icon: User, label: "프로필" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            if (item.isSpecial) {
              return (
                <Button
                  key={item.path}
                  onClick={() => setLocation(item.path)}
                  className="w-12 h-12 bg-gradient-to-r from-love-pink to-tree-green hover:opacity-90 rounded-full shadow-lg p-0"
                >
                  <Icon className="w-6 h-6 text-white" />
                </Button>
              );
            }

            return (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => setLocation(item.path)}
                className={`flex flex-col items-center space-y-1 py-2 px-3 h-auto ${
                  isActive ? "text-love-pink" : "text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
