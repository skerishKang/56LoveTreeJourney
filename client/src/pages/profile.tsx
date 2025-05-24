import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import BottomNavigation from "@/components/bottom-navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, TreePine, Users, Settings, LogOut, Trophy, Calendar } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  const { data: loveTrees } = useQuery({
    queryKey: ["/api/love-trees"],
    queryFn: api.getLoveTrees,
  });

  const completedTrees = loveTrees?.filter((tree: any) => tree.isCompleted) || [];
  const activeTrees = loveTrees?.filter((tree: any) => !tree.isCompleted) || [];

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-soft-pink">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-love-pink/20 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">프로필</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-20">
        {/* Profile Header */}
        <section className="px-4 py-6 sparkle-bg">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-love-pink/10">
            <div className="text-center">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-4 border-tree-green mx-auto mb-4 object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-300 rounded-full border-4 border-tree-green mx-auto mb-4"></div>
              )}
              
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {user?.firstName || user?.email?.split('@')[0] || "러브트리 유저"}
              </h2>
              
              {user?.email && (
                <p className="text-sm text-gray-600 mb-4">{user.email}</p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-love-pink">{completedTrees.length}</p>
                  <p className="text-xs text-gray-600">완성한 트리</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-tree-green">{activeTrees.length}</p>
                  <p className="text-xs text-gray-600">진행중인 트리</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-sparkle-gold">
                    {user?.createdAt ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                  </p>
                  <p className="text-xs text-gray-600">활동일</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Love Trees */}
        <section className="px-4 py-4">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">진행중</TabsTrigger>
              <TabsTrigger value="completed">완성</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4 mt-4">
              {activeTrees.length === 0 ? (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="text-center py-8">
                    <TreePine className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">아직 진행중인 러브트리가 없어요</p>
                    <Button className="bg-love-pink hover:bg-love-pink/90">
                      첫 번째 러브트리 만들기
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                activeTrees.map((tree: any) => (
                  <Card key={tree.id} className="border-gray-100">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">{tree.title}</h3>
                          <p className="text-sm text-gray-600">{tree.category}</p>
                        </div>
                        <Badge variant="outline" className="bg-tree-green/10 text-tree-green border-tree-green/30">
                          진행중
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {tree.targetPerson && (
                        <p className="text-sm text-love-pink mb-2">👤 {tree.targetPerson}</p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(tree.createdAt).toLocaleDateString()}
                        </span>
                        <Button variant="outline" size="sm" className="text-tree-green border-tree-green/30">
                          계속하기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 mt-4">
              {completedTrees.length === 0 ? (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="text-center py-8">
                    <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">완성한 러브트리가 없어요</p>
                  </CardContent>
                </Card>
              ) : (
                completedTrees.map((tree: any) => (
                  <Card key={tree.id} className="border-gray-100">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">{tree.title}</h3>
                          <p className="text-sm text-gray-600">{tree.category}</p>
                        </div>
                        <Badge className="bg-sparkle-gold/20 text-sparkle-gold border-sparkle-gold/30">
                          완성
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {tree.targetPerson && (
                        <p className="text-sm text-love-pink mb-2">👤 {tree.targetPerson}</p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center">
                          <Trophy className="w-4 h-4 mr-1" />
                          {tree.totalDuration ? `${Math.floor(tree.totalDuration / 24)}일만에 완성` : '완성됨'}
                        </span>
                        <Button variant="outline" size="sm" className="text-love-pink border-love-pink/30">
                          공유하기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </section>

        {/* Achievement Section */}
        <section className="px-4 py-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-sparkle-gold" />
            성취 배지
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { name: "첫 트리", icon: "🌱", earned: true },
              { name: "완성자", icon: "🏆", earned: completedTrees.length > 0 },
              { name: "추천왕", icon: "💝", earned: false },
              { name: "베테랑", icon: "👑", earned: false },
            ].map((badge) => (
              <div
                key={badge.name}
                className={`text-center p-3 rounded-xl border-2 ${
                  badge.earned
                    ? "bg-gradient-to-br from-sparkle-gold/20 to-love-pink/20 border-sparkle-gold/30"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <p className={`text-xs font-medium ${badge.earned ? "text-gray-800" : "text-gray-500"}`}>
                  {badge.name}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}
