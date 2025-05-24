import BottomNavigation from "@/components/bottom-navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Users, TrendingUp, Clock } from "lucide-react";

export default function Community() {
  return (
    <div className="min-h-screen bg-soft-pink">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-love-pink/20 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-lg font-bold text-gray-800">커뮤니티</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-20">
        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mx-4 my-4">
            <TabsTrigger value="trending">인기</TabsTrigger>
            <TabsTrigger value="recent">최신</TabsTrigger>
            <TabsTrigger value="following">팔로잉</TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="px-4 space-y-4">
            {/* Trending Topic */}
            <Card className="border-sparkle-gold/20 bg-gradient-to-r from-sparkle-gold/10 to-love-pink/10">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-sparkle-gold" />
                  <h3 className="font-semibold text-gray-800">오늘의 핫토픽</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">
                  #스트레이키즈_필릭스 입덕 러시가 몰려오고 있어요! 🔥
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-tree-green/20 text-tree-green">
                    #K-pop
                  </Badge>
                  <Badge variant="secondary" className="bg-love-pink/20 text-love-pink">
                    #스트레이키즈
                  </Badge>
                  <span className="text-xs text-gray-500">234명 참여</span>
                </div>
              </CardContent>
            </Card>

            {/* Community Posts */}
            <div className="space-y-4">
              {[
                {
                  user: "kpop_lover_123",
                  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
                  title: "BTS 입덕 완료! 7일만에 러브트리 완성했어요 💜",
                  content: "처음엔 그냥 친구가 추천해서 본 영상이었는데... 이제 완전 Army가 되어버렸네요 ㅠㅠ",
                  category: "K-pop",
                  likes: 127,
                  comments: 23,
                  time: "2시간 전",
                  tags: ["#BTS", "#입덕완료"]
                },
                {
                  user: "drama_addict",
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                  title: "약한영웅 이준영 러브트리 공유해요!",
                  content: "금성제 역할로 완전 빠져서 배우까지 팬이 되었어요. 다음 작품도 기대돼요!",
                  category: "드라마",
                  likes: 89,
                  comments: 16,
                  time: "4시간 전",
                  tags: ["#약한영웅", "#이준영"]
                }
              ].map((post, index) => (
                <Card key={index} className="border-gray-100">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={post.avatar}
                        alt={post.user}
                        className="w-10 h-10 rounded-full border-2 border-tree-green object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800">{post.user}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {post.category}
                          </Badge>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {post.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    <h4 className="font-medium text-gray-800 mb-2">{post.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{post.content}</p>

                    <div className="flex items-center space-x-2 mb-3">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-love-pink/20 text-love-pink">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <button className="flex items-center space-x-1 hover:text-love-pink transition-colors">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-tree-green transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-sparkle-gold transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                      <Button size="sm" variant="outline" className="text-tree-green border-tree-green/30 hover:bg-tree-green hover:text-white">
                        러브트리 보기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="px-4">
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">최신 포스트가 곧 업데이트됩니다!</p>
            </div>
          </TabsContent>

          <TabsContent value="following" className="px-4">
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">팔로우한 사용자의 활동이 여기에 표시됩니다!</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  );
}
