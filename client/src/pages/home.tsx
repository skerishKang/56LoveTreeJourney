import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import BottomNavigation from "@/components/bottom-navigation";
import LoveTreeProgress from "@/components/love-tree-progress";
import NewSeedAlert from "@/components/new-seed-alert";
import RecommendedShorts from "@/components/recommended-shorts";
import LoveTreeTimeline from "@/components/love-tree-timeline";
import PopularTrees from "@/components/popular-trees";
import { Heart, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user } = useAuth();
  
  const { data: loveTrees, isLoading: loveTreesLoading } = useQuery({
    queryKey: ["/api/love-trees"],
    queryFn: api.getLoveTrees,
  });

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
    queryFn: () => api.getNotifications(5),
  });

  const currentLoveTree = loveTrees?.[0]; // Most recent love tree

  return (
    <div className="min-h-screen bg-soft-pink">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-love-pink/20 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-love-pink to-tree-green rounded-full flex items-center justify-center animate-float">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-800">러브트리</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              {notifications?.some((n: any) => !n.isRead) && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-love-pink rounded-full animate-sparkle"></span>
              )}
            </Button>
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border-2 border-tree-green object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-tree-green"></div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-20">
        {/* Love Tree Progress */}
        {currentLoveTree && (
          <LoveTreeProgress loveTree={currentLoveTree} />
        )}

        {/* New Seed Alert */}
        <NewSeedAlert />

        {/* Recommended Shorts */}
        <RecommendedShorts />

        {/* My Love Tree Timeline */}
        {currentLoveTree && (
          <LoveTreeTimeline loveTreeId={currentLoveTree.id} />
        )}

        {/* Popular Trees */}
        <PopularTrees />
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Floating Action Button */}
      <Button className="fixed bottom-24 right-4 w-14 h-14 bg-sparkle-gold hover:bg-sparkle-gold/90 rounded-full shadow-lg z-30 animate-float">
        <Heart className="w-6 h-6 text-white" />
      </Button>
    </div>
  );
}
