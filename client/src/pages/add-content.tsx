import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import BottomNavigation from "@/components/bottom-navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Youtube, Instagram, Music, Link } from "lucide-react";

export default function AddContent() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<"select-tree" | "add-content">("select-tree");
  const [selectedLoveTreeId, setSelectedLoveTreeId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contentType: "youtube",
    contentUrl: "",
    platform: "YouTube",
    stageId: 1,
    isFirstContent: false,
  });

  const { data: loveTrees } = useQuery({
    queryKey: ["/api/love-trees"],
    queryFn: api.getLoveTrees,
  });

  const { data: stages } = useQuery({
    queryKey: ["/api/stages"],
    queryFn: api.getStages,
  });

  const createLoveTree = useMutation({
    mutationFn: (data: any) => api.createLoveTree(data),
    onSuccess: (newTree) => {
      setSelectedLoveTreeId(newTree.id);
      setStep("add-content");
      queryClient.invalidateQueries({ queryKey: ["/api/love-trees"] });
      toast({
        title: "러브트리 생성 완료! 🌱",
        description: "첫 번째 콘텐츠를 추가해보세요.",
      });
    },
    onError: () => {
      toast({
        title: "오류",
        description: "러브트리 생성에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  const addContent = useMutation({
    mutationFn: ({ loveTreeId, data }: { loveTreeId: number; data: any }) =>
      api.createLoveTreeItem(loveTreeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/love-trees"] });
      toast({
        title: "콘텐츠 추가 완료! ✨",
        description: "러브트리에 새로운 순간이 기록되었습니다.",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "오류",
        description: "콘텐츠 추가에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  const handleCreateNewTree = (data: any) => {
    createLoveTree.mutate(data);
  };

  const handleAddContent = () => {
    if (!selectedLoveTreeId) return;

    const order = Math.floor(Math.random() * 1000); // Simple ordering
    addContent.mutate({
      loveTreeId: selectedLoveTreeId,
      data: {
        ...formData,
        order,
        reachedAt: new Date(),
      },
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "youtube":
        return <Youtube className="w-5 h-5 text-red-500" />;
      case "instagram":
        return <Instagram className="w-5 h-5 text-pink-500" />;
      case "tiktok":
        return <Music className="w-5 h-5 text-black" />;
      default:
        return <Link className="w-5 h-5 text-gray-500" />;
    }
  };

  if (step === "select-tree") {
    return (
      <div className="min-h-screen bg-soft-pink">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-love-pink/20 sticky top-0 z-50">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="mr-3"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold text-gray-800">러브트리 선택</h1>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-md mx-auto px-4 py-6 pb-20">
          {/* Existing Love Trees */}
          {loveTrees && loveTrees.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                기존 러브트리에 추가
              </h2>
              <div className="space-y-3">
                {loveTrees
                  .filter((tree: any) => !tree.isCompleted)
                  .map((tree: any) => (
                    <Card
                      key={tree.id}
                      className="cursor-pointer border-gray-200 hover:border-love-pink transition-colors"
                      onClick={() => {
                        setSelectedLoveTreeId(tree.id);
                        setStep("add-content");
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800">{tree.title}</h3>
                            <p className="text-sm text-gray-600">{tree.category}</p>
                            {tree.targetPerson && (
                              <p className="text-sm text-love-pink">👤 {tree.targetPerson}</p>
                            )}
                          </div>
                          <Plus className="w-6 h-6 text-tree-green" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </section>
          )}

          {/* Create New Love Tree */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              새 러브트리 만들기
            </h2>
            <NewLoveTreeForm onSubmit={handleCreateNewTree} isLoading={createLoveTree.isPending} />
          </section>
        </main>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-pink">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-love-pink/20 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep("select-tree")}
            className="mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-gray-800">콘텐츠 추가</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 py-6 pb-20">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-800">새로운 순간 기록</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                placeholder="예: 첫 번째 뮤직비디오"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                placeholder="이 순간에 대한 감정이나 생각을 적어보세요..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="platform">플랫폼</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    platform: value,
                    contentType: value.toLowerCase(),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YouTube">
                    <div className="flex items-center space-x-2">
                      <Youtube className="w-4 h-4 text-red-500" />
                      <span>YouTube</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Instagram">
                    <div className="flex items-center space-x-2">
                      <Instagram className="w-4 h-4 text-pink-500" />
                      <span>Instagram</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="TikTok">
                    <div className="flex items-center space-x-2">
                      <Music className="w-4 h-4 text-black" />
                      <span>TikTok</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contentUrl">링크 (선택사항)</Label>
              <Input
                id="contentUrl"
                placeholder="https://..."
                value={formData.contentUrl}
                onChange={(e) => setFormData({ ...formData, contentUrl: e.target.value })}
              />
            </div>

            {stages && (
              <div>
                <Label htmlFor="stage">단계</Label>
                <Select
                  value={formData.stageId.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, stageId: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage: any) => (
                      <SelectItem key={stage.id} value={stage.id.toString()}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFirstContent"
                checked={formData.isFirstContent}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isFirstContent: !!checked })
                }
              />
              <Label htmlFor="isFirstContent" className="text-sm">
                첫 번째 콘텐츠입니다 🌱
              </Label>
            </div>

            <Button
              onClick={handleAddContent}
              disabled={!formData.title || addContent.isPending}
              className="w-full bg-gradient-to-r from-love-pink to-tree-green hover:opacity-90"
            >
              {addContent.isPending ? "추가 중..." : "콘텐츠 추가"}
            </Button>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
}

function NewLoveTreeForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    targetPerson: "",
    isPublic: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">러브트리 제목</Label>
            <Input
              id="title"
              placeholder="예: BTS 입덕 러브트리"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">카테고리</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="K-pop">K-pop</SelectItem>
                <SelectItem value="드라마">드라마</SelectItem>
                <SelectItem value="애니메이션">애니메이션</SelectItem>
                <SelectItem value="유튜버">유튜버</SelectItem>
                <SelectItem value="배우">배우</SelectItem>
                <SelectItem value="게임">게임</SelectItem>
                <SelectItem value="기타">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="targetPerson">입덕 대상 (선택사항)</Label>
            <Input
              id="targetPerson"
              placeholder="예: BTS 정국, 스트레이키즈 필릭스"
              value={formData.targetPerson}
              onChange={(e) => setFormData({ ...formData, targetPerson: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isPublic: !!checked })
              }
            />
            <Label htmlFor="isPublic" className="text-sm">
              공개 러브트리로 만들기
            </Label>
          </div>

          <Button
            type="submit"
            disabled={!formData.title || !formData.category || isLoading}
            className="w-full bg-gradient-to-r from-love-pink to-tree-green hover:opacity-90"
          >
            {isLoading ? "생성 중..." : "러브트리 만들기"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
