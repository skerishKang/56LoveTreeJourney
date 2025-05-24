import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import BottomNavigation from "@/components/bottom-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Heart, Users, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: popularTrees, isLoading } = useQuery({
    queryKey: ["/api/love-trees/popular"],
    queryFn: () => api.getPopularLoveTrees(20),
  });

  const filteredTrees = popularTrees?.filter((tree: any) =>
    tree.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tree.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tree.targetPerson?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-soft-pink">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-love-pink/20 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-lg font-bold text-gray-800 mb-3">발견하기</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="러브트리 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full border-gray-200"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-20">
        {/* Categories */}
        <section className="px-4 py-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-tree-green" />
            인기 카테고리
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {["K-pop", "드라마", "애니메이션", "유튜버", "배우", "게임"].map((category) => (
              <Button
                key={category}
                variant="outline"
                className="h-12 border-love-pink/30 hover:bg-love-pink/10 hover:border-love-pink"
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Popular Love Trees */}
        <section className="px-4 py-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-love-pink" />
            인기 러브트리
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="w-full h-12 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTrees?.map((tree: any) => (
                <Card key={tree.id} className="border-gray-100 hover:border-love-pink/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      {tree.user.profileImageUrl ? (
                        <img
                          src={tree.user.profileImageUrl}
                          alt={tree.user.firstName || "User"}
                          className="w-12 h-12 rounded-full border-2 border-tree-green object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-300 rounded-full border-2 border-tree-green"></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {tree.user.firstName || tree.user.email} • {tree.category}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {tree.title}
                        </p>
                        {tree.targetPerson && (
                          <p className="text-xs text-tree-green">
                            {tree.targetPerson}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-tree-green">
                          {tree.isCompleted ? "완성" : "진행중"}
                        </p>
                        {tree.totalDuration && (
                          <p className="text-xs text-gray-500">
                            {Math.floor(tree.totalDuration / 24)}일만에
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm mb-3">
                      <div className="flex items-center space-x-3 text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-4 h-4 text-love-pink" />
                          <span>{tree.likeCount}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-tree-green" />
                          <span>{tree.itemCount}</span>
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-love-pink/10 text-love-pink hover:bg-love-pink hover:text-white border-love-pink/30"
                        variant="outline"
                      >
                        따라하기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {searchQuery && filteredTrees?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">검색 결과가 없습니다.</p>
            </div>
          )}
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}
