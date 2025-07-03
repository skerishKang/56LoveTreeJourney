import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, MessageCircle, Share2, Search, Filter, Star, TrendingUp, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import BottomNavigation from "@/components/bottom-navigation";
import LoveTreeMindmap from "@/components/love-tree-mindmap";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function PopularLoveTrees() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortBy, setSortBy] = useState("인기순");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLoveTree, setSelectedLoveTree] = useState<any>(null);
  const [showMindmap, setShowMindmap] = useState(false);

  // 인기 러브트리 데이터 (예시)
  const popularTrees = [
    {
      id: 1,
      title: "NewJeans 입덕 여정",
      creator: "민지러버",
      category: "K-POP",
      thumbnail: "🐰",
      description: "하니의 귀여운 모습에 반해서 시작된 뉴진스 입덕기",
      likeCount: 1247,
      commentCount: 89,
      viewCount: 5832,
      videoCount: 12,
      completionRate: 100,
      tags: ["뉴진스", "민지", "하니", "귀여움"],
      createdAt: "2025-01-20",
      isHot: true,
      difficulty: "쉬움"
    },
    {
      id: 2,
      title: "아이브 댄스 마스터 과정",
      creator: "아이브댄서",
      category: "K-POP",
      thumbnail: "💃",
      description: "Love Dive부터 I AM까지 아이브 댄스 완전정복",
      likeCount: 892,
      commentCount: 67,
      viewCount: 3456,
      videoCount: 18,
      completionRate: 95,
      tags: ["아이브", "댄스", "안유진", "장원영"],
      createdAt: "2025-01-18",
      isHot: false,
      difficulty: "보통"
    },
    {
      id: 3,
      title: "스트레이 키즈 랩 분석",
      creator: "방찬이형",
      category: "K-POP",
      thumbnail: "🎤",
      description: "창빈의 랩 스킬에 감탄하며 시작된 스키즈 덕질",
      likeCount: 756,
      commentCount: 45,
      viewCount: 2789,
      videoCount: 15,
      completionRate: 88,
      tags: ["스트레이키즈", "창빈", "랩", "3RACHA"],
      createdAt: "2025-01-15",
      isHot: true,
      difficulty: "어려움"
    },
    {
      id: 4,
      title: "드라마 OST 입덕기",
      creator: "드라마홀릭",
      category: "드라마",
      thumbnail: "🎭",
      description: "눈물의 여왕 OST에서 시작된 한국 드라마 사랑",
      likeCount: 634,
      commentCount: 32,
      viewCount: 1892,
      videoCount: 8,
      completionRate: 75,
      tags: ["드라마", "OST", "눈물의여왕", "김수현"],
      createdAt: "2025-01-12",
      isHot: false,
      difficulty: "쉬움"
    },
    {
      id: 5,
      title: "일본 애니메이션 탐험",
      creator: "오타쿠왕",
      category: "애니메이션",
      thumbnail: "🌸",
      description: "귀멸의 칼날부터 시작된 일본 애니 세계 탐험기",
      likeCount: 543,
      commentCount: 28,
      viewCount: 1567,
      videoCount: 22,
      completionRate: 92,
      tags: ["애니메이션", "귀멸의칼날", "일본", "만화"],
      createdAt: "2025-01-10",
      isHot: false,
      difficulty: "보통"
    }
  ];

  const categories = ["전체", "K-POP", "드라마", "애니메이션", "영화", "유튜버"];
  const sortOptions = ["인기순", "최신순", "좋아요순", "댓글순", "완성도순"];

  const filteredTrees = popularTrees.filter(tree => {
    const matchesCategory = selectedCategory === "전체" || tree.category === selectedCategory;
    const matchesSearch = tree.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tree.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "쉬움": return "bg-green-100 text-green-700";
      case "보통": return "bg-amber-50 text-amber-700";
      case "어려움": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleTreeClick = (tree: any) => {
    setSelectedLoveTree(tree);
    setShowMindmap(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-love-light via-white to-love-light">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-love-pink/20">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-800">주목받는 러브트리</h1>
                <p className="text-sm text-gray-600">인기 러브트리를 둘러보세요 ✨</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              {filteredTrees.length}개
            </Badge>
          </div>

          {/* 검색 */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="러브트리 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 필터 */}
          <div className="flex space-x-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pb-20">
        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="grid">그리드 보기</TabsTrigger>
            <TabsTrigger value="list">리스트 보기</TabsTrigger>
          </TabsList>

          <TabsContent value="grid">
            <div className="grid grid-cols-1 gap-4">
              {filteredTrees.map((tree) => (
                <Card 
                  key={tree.id} 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleTreeClick(tree)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                        {tree.thumbnail}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-bold text-gray-800 line-clamp-1">{tree.title}</h3>
                          {tree.isHot && (
                            <Badge className="bg-gradient-to-r from-amber-100 to-orange-500 text-white text-xs">
                              🔥 HOT
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{tree.description}</p>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs">{tree.category}</Badge>
                          <Badge className={`text-xs ${getDifficultyColor(tree.difficulty)}`}>
                            {tree.difficulty}
                          </Badge>
                          <span className="text-xs text-gray-500">by {tree.creator}</span>
                        </div>

                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3 text-red-400" />
                            <span>{tree.likeCount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-3 h-3 text-blue-400" />
                            <span>{tree.commentCount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3 text-green-400" />
                            <span>{tree.viewCount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-amber-400" />
                            <span>{tree.completionRate}%</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {tree.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs bg-purple-50 text-purple-600">
                              #{tag}
                            </Badge>
                          ))}
                          {tree.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{tree.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <div className="space-y-3">
              {filteredTrees.map((tree) => (
                <Card 
                  key={tree.id} 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleTreeClick(tree)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center text-lg">
                        {tree.thumbnail}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-800">{tree.title}</h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Heart className="w-3 h-3 text-red-400" />
                            <span>{tree.likeCount}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">by {tree.creator}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">{tree.category}</Badge>
                          <span className="text-xs text-gray-500">{tree.videoCount}개 영상</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* 검색 결과 없음 */}
        {filteredTrees.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">검색 결과가 없어요</h3>
            <p className="text-sm text-gray-500 mb-4">
              다른 키워드로 검색해보거나 카테고리를 변경해보세요
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("전체");
              }}
            >
              필터 초기화
            </Button>
          </div>
        )}

        {/* 하단 안내 */}
        <Card className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800 mb-2">더 많은 러브트리를 찾고 계신가요?</h4>
            <p className="text-sm text-gray-600 mb-3">
              🔍 돋보기로 검색하거나 새로운 러브트리를 만들어보세요!
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Search className="w-4 h-4 mr-1" />
                고급 검색
              </Button>
              <Button size="sm" className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                <Star className="w-4 h-4 mr-1" />
                내 러브트리 만들기
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />

      {/* 러브트리 상세 마인드맵 모달 */}
      <Dialog open={showMindmap} onOpenChange={setShowMindmap}>
        <DialogContent className="max-w-full max-h-full w-screen h-screen p-0 border-0">
          {selectedLoveTree && (
            <LoveTreeMindmap 
              loveTree={selectedLoveTree}
              items={[]} // 실제 데이터 연결 시 아이템 전달
              isFullscreen={true}
              onClose={() => setShowMindmap(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}