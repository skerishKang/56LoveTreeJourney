import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart, TreePine, Sparkles, Users } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-soft-pink dark:bg-gray-900 sparkle-bg transition-colors">
      {/* Header */}
      <header className="px-4 py-4 sm:py-6 text-center">
        <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-love-pink to-tree-green rounded-full flex items-center justify-center animate-float">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">러브트리</h1>
        </div>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">LOVE TREE</p>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">사랑에 빠지는 순간을 간직하다</p>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-6 sm:py-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-6 sm:mb-8">
            <div className="relative inline-block">
              <TreePine className="w-20 h-20 sm:w-24 sm:h-24 text-tree-green animate-pulse-love" />
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-sparkle-gold absolute -top-1 -right-1 sm:-top-2 sm:-right-2 animate-sparkle" />
            </div>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">
            당신의 입덕 순간을<br />
            특별하게 기록해보세요
          </h2>
          
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">
            K-pop, 드라마, 애니메이션까지<br />
            사랑에 빠지는 모든 순간을<br />
            나만의 러브트리로 만들어보세요 💕
          </p>

          <Button 
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-love-pink to-tree-green hover:opacity-90 text-white font-medium py-2.5 sm:py-3 rounded-2xl text-base sm:text-lg shadow-lg animate-grow"
          >
            시작하기
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-6 sm:py-8">
        <div className="max-w-md mx-auto space-y-3 sm:space-y-4">
          <Card className="border-love-pink/20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-love-pink/20 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-love-pink" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base">입덕 과정 기록</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                첫 영상부터 완전히 빠지기까지의 모든 과정을 단계별로 기록해보세요
              </p>
            </CardContent>
          </Card>

          <Card className="border-tree-green/20 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-tree-green/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-tree-green" />
                </div>
                <h3 className="font-semibold text-gray-800">추천 시스템</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                다른 유저들이 추천하는 다음 단계 콘텐츠로 더 깊이 빠져보세요
              </p>
            </CardContent>
          </Card>

          <Card className="border-sparkle-gold/20 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-sparkle-gold/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-sparkle-gold" />
                </div>
                <h3 className="font-semibold text-gray-800">커뮤니티 공유</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                완성된 러브트리를 공유하고 다른 사람들의 입덕 루트를 구경해보세요
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💕 사랑에 빠지는 순간을 함께 나누어요 💕
        </p>
      </footer>
    </div>
  );
}
