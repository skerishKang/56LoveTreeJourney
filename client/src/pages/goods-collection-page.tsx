import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import GoodsCollection from "@/components/goods-collection";
import BottomNavigation from "@/components/bottom-navigation";

export default function GoodsCollectionPage() {
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
              <h1 className="text-lg font-bold text-gray-800">굿즈 컬렉션</h1>
              <p className="text-sm text-gray-600">소중한 굿즈를 체계적으로 관리해보세요</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-20">
        <GoodsCollection />
      </main>

      <BottomNavigation />
    </div>
  );
}