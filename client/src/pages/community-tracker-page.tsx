import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import CommunityTracker from "@/components/community-tracker";
import BottomNavigation from "@/components/bottom-navigation";

export default function CommunityTrackerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-love-light via-white to-love-light">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-love-pink/20">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-800">커뮤니티 활동</h1>
              <p className="text-sm text-gray-600">SNS 팬 커뮤니티 활동을 관리해보세요</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-20">
        <CommunityTracker />
      </main>

      <BottomNavigation />
    </div>
  );
}