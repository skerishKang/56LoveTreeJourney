import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, TreePine, User, Hash, Filter, X, Clock, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { Link } from "wouter";
import type { LoveTree, User as UserType } from "@/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResults {
  loveTrees: LoveTree[];
  users: UserType[];
  tags: { name: string; count: number }[];
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const debouncedQuery = useDebounce(searchQuery, 300);

  // 검색 결과 가져오기
  const { data: searchResults, isLoading } = useQuery<SearchResults>({
    queryKey: ["/api/search", debouncedQuery, selectedCategory],
    queryFn: async () => {
      if (!debouncedQuery) return { loveTrees: [], users: [], tags: [] };
      
      const params = new URLSearchParams({
        q: debouncedQuery,
        ...(selectedCategory && { category: selectedCategory }),
      });
      
      const response = await fetch(`/api/search?${params}`, {
        credentials: "include",
      });
      
      if (!response.ok) throw new Error("Search failed");
      return response.json();
    },
    enabled: debouncedQuery.length >= 2,
  });

  // 최근 검색어
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : [];
  });

  const saveRecentSearch = useCallback((query: string) => {
    if (!query) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  }, [recentSearches]);

  const categories = [
    "K-pop", "드라마", "애니메이션", "게임", "스포츠", "영화", "유튜버", "기타"
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      saveRecentSearch(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedCategory(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold">검색</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* 검색 입력 */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="러브트리, 사용자, 태그 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
              autoFocus
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </form>

          {/* 카테고리 필터 */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap"
                onClick={() => setSelectedCategory(
                  selectedCategory === category ? null : category
                )}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* 검색 결과 */}
          {searchQuery ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="trees">러브트리</TabsTrigger>
                <TabsTrigger value="users">사용자</TabsTrigger>
                <TabsTrigger value="tags">태그</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[400px] mt-4">
                <TabsContent value="all" className="space-y-4">
                  {/* 러브트리 결과 */}
                  {searchResults?.loveTrees && searchResults.loveTrees.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">러브트리</h3>
                      <div className="space-y-2">
                        {searchResults.loveTrees.slice(0, 3).map((tree) => (
                          <LoveTreeResult key={tree.id} tree={tree} onClose={onClose} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 사용자 결과 */}
                  {searchResults?.users && searchResults.users.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">사용자</h3>
                      <div className="space-y-2">
                        {searchResults.users.slice(0, 3).map((user) => (
                          <UserResult key={user.id} user={user} onClose={onClose} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 태그 결과 */}
                  {searchResults?.tags && searchResults.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">태그</h3>
                      <div className="flex flex-wrap gap-2">
                        {searchResults.tags.slice(0, 10).map((tag) => (
                          <Badge
                            key={tag.name}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => {
                              setSearchQuery(`#${tag.name}`);
                              onClose();
                            }}
                          >
                            #{tag.name} ({tag.count})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="trees">
                  <div className="space-y-2">
                    {searchResults?.loveTrees?.map((tree) => (
                      <LoveTreeResult key={tree.id} tree={tree} onClose={onClose} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="users">
                  <div className="space-y-2">
                    {searchResults?.users?.map((user) => (
                      <UserResult key={user.id} user={user} onClose={onClose} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="tags">
                  <div className="flex flex-wrap gap-2">
                    {searchResults?.tags?.map((tag) => (
                      <Badge
                        key={tag.name}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => {
                          setSearchQuery(`#${tag.name}`);
                          onClose();
                        }}
                      >
                        #{tag.name} ({tag.count})
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          ) : (
            <div className="space-y-4">
              {/* 최근 검색어 */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      최근 검색
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem("recentSearches");
                      }}
                    >
                      모두 지우기
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <Badge
                        key={search}
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => setSearchQuery(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* 인기 검색어 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 flex items-center mb-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  인기 검색어
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["뉴진스", "스트레이키즈", "NCT", "세븐틴", "에스파"].map((term) => (
                    <Badge
                      key={term}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => setSearchQuery(term)}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 러브트리 검색 결과 컴포넌트
function LoveTreeResult({ tree, onClose }: { tree: LoveTree; onClose: () => void }) {
  return (
    <Link href={`/love-tree/${tree.id}`} onClick={onClose}>
      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center text-white">
          <TreePine className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-800 dark:text-gray-200">{tree.title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {tree.category} · {tree.itemCount}개 항목
          </p>
        </div>
        <Badge variant="outline">{tree.isCompleted ? "완성" : "진행중"}</Badge>
      </div>
    </Link>
  );
}

// 사용자 검색 결과 컴포넌트
function UserResult({ user, onClose }: { user: UserType; onClose: () => void }) {
  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white">
        <User className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-800 dark:text-gray-200">
          {user.firstName || user.email?.split('@')[0]}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
      </div>
      <Badge variant="outline">{user.propagatorRank || "새싹"}</Badge>
    </div>
  );
}