import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TreePine, Heart } from "lucide-react";

interface LoveTreeProgressProps {
  loveTree: any;
}

export default function LoveTreeProgress({ loveTree }: LoveTreeProgressProps) {
  const { data: items } = useQuery({
    queryKey: ["/api/love-trees", loveTree.id, "items"],
    queryFn: () => api.getLoveTreeItems(loveTree.id),
  });

  const { data: stages } = useQuery({
    queryKey: ["/api/stages"],
    queryFn: api.getStages,
  });

  const currentStage = stages?.find((stage: any) => 
    items?.some((item: any) => item.stageId === stage.id)
  ) || stages?.[0];

  const currentStageItems = items?.filter((item: any) => 
    item.stageId === currentStage?.id
  ) || [];

  const progress = currentStage ? 
    Math.min((currentStageItems.length / currentStage.maxItems) * 100, 100) : 0;

  const firstContent = items?.find((item: any) => item.isFirstContent);

  return (
    <section className="px-4 py-6 sparkle-bg">
      <Card className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-love-pink/10">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <TreePine className="w-5 h-5 mr-2 text-tree-green" />
              나의 러브트리
            </h2>
            {currentStage && (
              <Badge 
                variant="outline" 
                className="bg-tree-green/10 text-tree-green border-tree-green/30"
              >
                {currentStage.name} 단계
              </Badge>
            )}
          </div>
          
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>진행률</span>
              <span>
                {currentStageItems.length}/{currentStage?.maxItems || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-love-pink to-tree-green h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Current focus */}
          <div className="bg-diary-beige rounded-xl p-3">
            <p className="text-sm text-gray-700 mb-2">현재 빠져있는 것</p>
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-love-pink/20 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-love-pink" />
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {loveTree.targetPerson || loveTree.title}
                </p>
                <p className="text-xs text-gray-600">
                  {firstContent ? 
                    `${Math.floor((Date.now() - new Date(firstContent.createdAt).getTime()) / (1000 * 60 * 60 * 24))}일 전부터` :
                    '시작됨'
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
