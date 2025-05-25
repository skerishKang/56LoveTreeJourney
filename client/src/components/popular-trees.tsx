import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Heart, Share2, Users, Trophy, Calendar, Flame } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export default function PopularTrees() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: popularTrees, isLoading } = useQuery({
    queryKey: ["/api/love-trees/popular"],
    queryFn: () => api.getPopularLoveTrees(5),
  });

  const followLoveTree = useMutation({
    mutationFn: (loveTreeId: number) => api.followLoveTree(loveTreeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/love-trees/popular"] });
      toast({
        title: "따라하기 시작! 🌱",
        description: "이 러브트리를 따라 시작해보세요.",
      });
    },
    onError: () => {
      toast({
        title: "오류",
        description: "따라하기에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">인기 러브트리 🔥</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                  <div className="w-16 h-8 bg-gray-200 rounded" />
                </div>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="w-full h-12 bg-gray-200 rounded" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (!popularTrees || !Array.isArray(popularTrees) || popularTrees.length === 0) {
    // 예시 인기 러브트리들 (여러 유저들의 다양한 러브트리)
    const exampleTrees = [
      {
        id: 1,
        title: "뉴진스 하니 입덕기",
        category: "K-pop",
        targetPerson: "뉴진스 하니",
        user: { firstName: "민지팬", email: "minji@example.com", profileImageUrl: null },
        itemCount: 12,
        likeCount: 234,
        isCompleted: true,
        createdAt: "2024-01-15T10:30:00Z",
        period: "이주의 러브트리"
      },
      {
        id: 2,
        title: "스트레이키즈 현진 러브트리",
        category: "K-pop", 
        targetPerson: "스트레이키즈 현진",
        user: { firstName: "하늘", email: "sky@example.com", profileImageUrl: null },
        itemCount: 8,
        likeCount: 189,
        isCompleted: false,
        createdAt: "2024-01-20T14:20:00Z",
        period: "이달의 러브트리"
      },
      {
        id: 3,
        title: "약한영웅 이준영 입덕",
        category: "드라마",
        targetPerson: "약한영웅 이준영",
        user: { firstName: "소라", email: "sora@example.com", profileImageUrl: null },
        itemCount: 15,
        likeCount: 167,
        isCompleted: true,
        createdAt: "2024-01-18T09:15:00Z",
        period: "이주의 러브트리"
      },
      {
        id: 4,
        title: "아이브 장원영 매력 발견",
        category: "K-pop",
        targetPerson: "아이브 장원영",
        user: { firstName: "별빛", email: "star@example.com", profileImageUrl: null },
        itemCount: 10,
        likeCount: 145,
        isCompleted: false,
        createdAt: "2024-01-22T16:45:00Z",
        period: "이달의 러브트리"
      },
      {
        id: 5,
        title: "선재 업고 튀어 변우석",
        category: "드라마",
        targetPerson: "변우석",
        user: { firstName: "달님", email: "moon@example.com", profileImageUrl: null },
        itemCount: 13,
        likeCount: 198,
        isCompleted: true,
        createdAt: "2024-01-25T11:30:00Z",
        period: "이달의 러브트리"
      }
    ];

    return (
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">인기 러브트리 🔥</h3>
          <Button variant="ghost" className="text-love-pink text-sm font-medium">
            전체보기
          </Button>
        </div>
        <div className="space-y-3">
          {exampleTrees.map((tree: any, index: number) => (
            <Card key={tree.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-love-pink/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-love-pink to-purple-500 rounded-full border-2 border-tree-green flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                    {tree.user?.firstName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-800 truncate">
                        @{tree.user?.firstName || tree.user?.email?.split('@')[0] || 'user'}
                      </p>
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                        {tree.period}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {tree.category} 러브트리
                    </p>
                    {tree.targetPerson && (
                      <p className="text-xs text-love-pink truncate">
                        👤 {tree.targetPerson}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <h4 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
                    {tree.title}
                  </h4>

                  {/* 러브트리 진행 단계 표시 */}
                  <div className="flex space-x-1 mb-2">
                    {Array.from({ length: Math.min(tree.itemCount, 5) }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-full border-2 ${
                          i < 3 
                            ? "bg-love-pink border-love-pink text-white" 
                            : "bg-gray-100 border-gray-300"
                        } flex items-center justify-center text-xs font-bold`}
                      >
                        {i + 1}
                      </div>
                    ))}
                    {tree.itemCount > 5 && (
                      <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center text-xs font-bold text-gray-500">
                        +{tree.itemCount - 5}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-love-pink" />
                      <span>{tree.likeCount || 0}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-tree-green" />
                      <span>{tree.itemCount || 0}</span>
                    </span>
                    {tree.isCompleted && (
                      <span className="flex items-center space-x-1">
                        <Trophy className="w-4 h-4 text-sparkle-gold" />
                      </span>
                    )}
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => followLoveTree.mutate(tree.id)}
                    disabled={followLoveTree.isPending}
                    className="bg-love-pink/10 text-love-pink hover:bg-love-pink hover:text-white border-love-pink/30 text-xs font-medium px-3"
                    variant="outline"
                  >
                    따라하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">인기 러브트리</span>
          <Flame className="w-5 h-5 text-orange-500" />
        </h3>
        <Button variant="ghost" className="text-love-pink text-sm font-medium">
          전체보기
        </Button>
      </div>

      <div className="space-y-3">
        {popularTrees && popularTrees.map((tree: any, index: number) => (
          <Card key={tree.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-love-pink/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                {tree.user?.profileImageUrl ? (
                  <img
                    src={tree.user.profileImageUrl}
                    alt={tree.user.firstName || "User"}
                    className="w-10 h-10 rounded-full border-2 border-tree-green object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full border-2 border-tree-green flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    @{tree.user?.firstName || tree.user?.email?.split('@')[0] || 'user'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {tree.category} 러브트리
                  </p>
                  {tree.targetPerson && (
                    <p className="text-xs text-love-pink truncate">
                      👤 {tree.targetPerson}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  {tree.isCompleted ? (
                    <div>
                      <Badge className="bg-sparkle-gold/20 text-sparkle-gold border-sparkle-gold/30 mb-1">
                        완성
                      </Badge>
                      {tree.totalDuration && (
                        <p className="text-xs text-gray-500">
                          {Math.floor(tree.totalDuration / 24)}일만에
                        </p>
                      )}
                    </div>
                  ) : (
                    <Badge variant="outline" className="bg-tree-green/10 text-tree-green border-tree-green/30">
                      진행중
                    </Badge>
                  )}
                </div>
              </div>
              
              <h4 className="font-medium text-gray-800 mb-3 truncate">
                {tree.title}
              </h4>
              
              {/* Content thumbnails - placeholder grid */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative">
                    {i <= 3 ? (
                      <div className="w-full h-12 bg-gradient-to-br from-love-pink/20 to-tree-green/20 rounded flex items-center justify-center">
                        <Heart className="w-3 h-3 text-love-pink/60" />
                      </div>
                    ) : (
                      <div className="w-full h-12 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">
                          +{tree.itemCount > 3 ? tree.itemCount - 3 : 0}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-3 text-gray-600">
                  <span className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-love-pink" />
                    <span>{tree.likeCount || 0}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-tree-green" />
                    <span>{tree.itemCount || 0}</span>
                  </span>
                  {tree.isCompleted && (
                    <span className="flex items-center space-x-1">
                      <Trophy className="w-4 h-4 text-sparkle-gold" />
                    </span>
                  )}
                </div>
                <Button 
                  size="sm"
                  onClick={() => followLoveTree.mutate(tree.id)}
                  disabled={followLoveTree.isPending}
                  className="bg-love-pink/10 text-love-pink hover:bg-love-pink hover:text-white border-love-pink/30 text-xs font-medium px-3"
                  variant="outline"
                >
                  {followLoveTree.isPending ? "처리중..." : "따라하기"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
