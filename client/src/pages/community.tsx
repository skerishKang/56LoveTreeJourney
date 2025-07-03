import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import BottomNavigation from "@/components/bottom-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, TrendingUp, Users, Sparkles, Plus, Send, Image, Video } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface CommunityPost {
  id: number;
  userId: string;
  content: string;
  imageUrl?: string;
  hashtags: string[];
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    profileImageUrl?: string;
  };
}

export default function Community() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState("");
  const [showPostForm, setShowPostForm] = useState(false);
  
  // 실제 API로 커뮤니티 게시물 가져오기 (현재는 빈 배열)
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/community-posts"],
    queryFn: () => api.getCommunityPosts?.() || Promise.resolve([]),
  });

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;
    
    // 실제 API 호출 구현 필요
    console.log("새 게시물:", newPost);
    setNewPost("");
    setShowPostForm(false);
  };

  const handleLike = (postId: number) => {
    // 실제 API 호출 구현 필요
    console.log("좋아요:", postId);
  };

  // 샘플 데이터 (실제 데이터가 없을 때만 표시)
  const samplePosts: CommunityPost[] = [
    {
      id: 1,
      userId: "user1",
      content: "뉴진스 새 앨범 진짜 대박이다 🔥 Get Up 무한반복 중... #뉴진스 #GetUp #KPOP",
      hashtags: ["뉴진스", "GetUp", "KPOP"],
      likeCount: 142,
      commentCount: 23,
      shareCount: 8,
      isLiked: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      user: {
        id: "user1",
        firstName: "민지",
        profileImageUrl: undefined
      }
    },
    {
      id: 2,
      userId: "user2", 
      content: "스트레이키즈 콘서트 다녀왔는데 진짜 미쳤다... 현실이 맞나 싶을 정도로 완벽했어 ㅠㅠ #스트레이키즈 #콘서트 #MANIAC",
      hashtags: ["스트레이키즈", "콘서트", "MANIAC"],
      likeCount: 89,
      commentCount: 17,
      shareCount: 12,
      isLiked: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      user: {
        id: "user2",
        firstName: "하늘",
        profileImageUrl: undefined
      }
    },
    {
      id: 3,
      userId: "user3",
      content: "아이브 신곡 I AM 뮤비 벌써 100만뷰 돌파! 안유진 비주얼 미쳤고 가을 노래로 딱이야 🍂 #IVE #IAM #안유진",
      hashtags: ["IVE", "IAM", "안유진"],
      likeCount: 234,
      commentCount: 45,
      shareCount: 19,
      isLiked: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      user: {
        id: "user3",
        firstName: "소라",
        profileImageUrl: undefined
      }
    }
  ];

  const displayPosts = posts.length > 0 ? posts : samplePosts;

  return (
    <div className="min-h-screen bg-soft-pink">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-love-pink/20 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-800 flex items-center">
              <Users className="w-5 h-5 mr-2 text-tree-green" />
              커뮤니티
            </h1>
            <Button
              onClick={() => setShowPostForm(!showPostForm)}
              className="bg-gradient-to-r from-love-pink to-tree-green text-white rounded-full px-4 py-2 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              글쓰기
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-20">
        {/* Post Form */}
        {showPostForm && (
          <section className="p-4">
            <Card className="bg-white border-love-pink/20">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-love-pink to-tree-green rounded-full flex items-center justify-center text-white font-bold">
                    {user?.firstName?.[0] || "🌱"}
                  </div>
                  <div className="flex-1">
                    <Textarea
                      placeholder="지금 무슨 생각을 하고 있나요? #해시태그 를 사용해서 공유해보세요!"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="border-none resize-none focus:ring-0 p-0 min-h-[80px]"
                      maxLength={280}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      <Image className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      <Video className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{newPost.length}/280</span>
                    <Button
                      onClick={handleSubmitPost}
                      disabled={!newPost.trim()}
                      className="bg-love-pink hover:bg-love-pink/90 text-white rounded-full px-4 py-1"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Community Stats & Hot Topics */}
        <section className="px-4 py-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gradient-to-br from-love-pink/10 to-love-pink/5 rounded-2xl p-4 text-center border border-love-pink/20">
              <div className="text-2xl font-bold text-love-pink">1.2K</div>
              <div className="text-xs text-gray-600">활성 가드너</div>
            </div>
            <div className="bg-gradient-to-br from-tree-green/10 to-tree-green/5 rounded-2xl p-4 text-center border border-tree-green/20">
              <div className="text-2xl font-bold text-tree-green">342</div>
              <div className="text-xs text-gray-600">오늘 새 글</div>
            </div>
            <div className="bg-gradient-to-br from-sparkle-gold/10 to-sparkle-gold/5 rounded-2xl p-4 text-center border border-sparkle-gold/20">
              <div className="text-2xl font-bold text-sparkle-gold">89</div>
              <div className="text-xs text-gray-600">HOT 러브트리</div>
            </div>
          </div>

          {/* Hot Topics */}
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-love-pink" />
            실시간 HOT 토픽
          </h2>
          <div className="space-y-3 mb-6">
            {[
              { topic: "#뉴진스컴백", posts: "2.3K", trend: "+15%", emoji: "🔥" },
              { topic: "#스트레이키즈", posts: "1.8K", trend: "+23%", emoji: "⚡" },
              { topic: "#아이브신곡", posts: "1.5K", trend: "+8%", emoji: "💖" },
              { topic: "#세븐틴콘서트", posts: "987", trend: "+12%", emoji: "🎵" },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{item.emoji}</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.topic}</h3>
                      <p className="text-sm text-gray-600">{item.posts} 게시물</p>
                    </div>
                  </div>
                  <Badge className="bg-love-pink/10 text-love-pink border-none">
                    {item.trend}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Hashtags */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {[
              "#러브트리", "#입덕", "#덕질", "#아이돌", "#K팝", "#드라마"
            ].map((hashtag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="whitespace-nowrap bg-gradient-to-r from-love-pink/10 to-tree-green/10 text-gray-700 hover:from-love-pink hover:to-tree-green hover:text-white cursor-pointer transition-all border-none"
              >
                {hashtag}
              </Badge>
            ))}
          </div>
        </section>

        {/* Featured Love Trees */}
        <section className="px-4 py-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-sparkle-gold" />
            주목받는 러브트리
          </h2>
          <div className="space-y-3 mb-6">
            {[
              { title: "뉴진스 입덕기", user: "민지팬", category: "K-pop", likes: 234, comments: 45, items: 12 },
              { title: "스트레이키즈 러브트리", user: "하늘", category: "K-pop", likes: 189, comments: 32, items: 8 },
              { title: "약한영웅 이준영 입덕", user: "소라", category: "드라마", likes: 167, comments: 28, items: 15 },
            ].map((tree, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-love-pink to-tree-green rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {tree.user[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-800">{tree.title}</h3>
                      <Badge variant="secondary" className="text-xs bg-sparkle-gold/10 text-sparkle-gold">{tree.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      by {tree.user} • {tree.items}개 콘텐츠
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-love-pink" />
                        <span>{tree.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4 text-tree-green" />
                        <span>{tree.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Share2 className="w-4 h-4 text-sparkle-gold" />
                        <span>공유</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Feed */}
        <section className="px-4 py-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-tree-green" />
            실시간 피드
          </h2>
          
          {posts.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">아직 게시물이 없어요</h3>
              <p className="text-gray-600 mb-4">첫 번째 게시물을 작성해서 커뮤니티를 활성화해보세요!</p>
              <Button
                onClick={() => setShowPostForm(true)}
                className="bg-gradient-to-r from-love-pink to-tree-green text-white"
              >
                첫 게시물 작성하기
              </Button>
            </div>
          )}
          
          <div className="space-y-4">
            {displayPosts.map((post: any) => (
              <Card key={post.id} className="bg-white hover:shadow-md transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-love-pink to-tree-green rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {post.user.firstName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{post.user.firstName}</h3>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(post.createdAt), { locale: ko, addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-gray-800 mb-3 whitespace-pre-wrap leading-relaxed">
                        {post.content}
                      </p>
                      
                      {/* 해시태그 */}
                      {post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.hashtags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs bg-tree-green/10 text-tree-green cursor-pointer"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* 상호작용 버튼 */}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-1 ${post.isLiked ? 'text-love-pink' : ''}`}
                        >
                          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                          <span>{post.likeCount}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.commentCount}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                          <Share2 className="w-4 h-4" />
                          <span>{post.shareCount}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Load More */}
        {displayPosts.length > 0 && (
          <section className="px-4 py-4">
            <Button variant="outline" className="w-full">
              더 많은 게시물 보기
            </Button>
          </section>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}