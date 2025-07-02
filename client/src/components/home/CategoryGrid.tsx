import { Heart, Users, Gamepad2, Gift, Smartphone, ChevronRight, Crown, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
  color: string;
  count: number;
  trend: "up" | "down" | "stable";
}

interface CategoryGridProps {
  categories: Category[];
  showAllCategories: boolean;
  onToggleCategories: () => void;
  onCategorySelect: (categoryId: number) => void;
  onCategoryRequest: () => void;
}

const defaultCategories: Category[] = [
  { id: 1, name: "아이돌", icon: <Crown className="w-5 h-5" />, color: "bg-pink-100 text-pink-600", count: 1234, trend: "up" },
  { id: 2, name: "연예인", icon: <Sparkles className="w-5 h-5" />, color: "bg-purple-100 text-purple-600", count: 856, trend: "up" },
  { id: 3, name: "게임", icon: <Gamepad2 className="w-5 h-5" />, color: "bg-blue-100 text-blue-600", count: 642, trend: "stable" },
  { id: 4, name: "애니", icon: <Heart className="w-5 h-5" />, color: "bg-red-100 text-red-600", count: 789, trend: "up" },
  { id: 5, name: "굿즈", icon: <Gift className="w-5 h-5" />, color: "bg-green-100 text-green-600", count: 456, trend: "down" },
  { id: 6, name: "앱", icon: <Smartphone className="w-5 h-5" />, color: "bg-yellow-100 text-yellow-600", count: 234, trend: "stable" },
];

export default function CategoryGrid({
  categories = defaultCategories,
  showAllCategories,
  onToggleCategories,
  onCategorySelect,
  onCategoryRequest
}: CategoryGridProps) {
  const displayedCategories = showAllCategories ? categories : categories.slice(0, 6);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">카테고리</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleCategories}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {showAllCategories ? "접기" : "더보기"}
          <ChevronRight className={`ml-1 w-4 h-4 transition-transform ${showAllCategories ? "rotate-90" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {displayedCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md"
            >
              <div className={`${category.color} p-4 text-center h-24 flex flex-col justify-center items-center`}>
                <div className="mb-2">{category.icon}</div>
                <div className="text-xs font-medium">{category.name}</div>
              </div>
              
              {/* Trend Badge */}
              <div className="absolute top-1 right-1">
                <Badge 
                  variant="secondary" 
                  className={`text-xs px-1.5 py-0.5 ${
                    category.trend === "up" 
                      ? "bg-green-100 text-green-600" 
                      : category.trend === "down" 
                      ? "bg-red-100 text-red-600" 
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {category.count}
                </Badge>
              </div>
            </div>
          ))}
          
          {/* Add Category Button */}
          <div
            onClick={onCategoryRequest}
            className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            <div className="bg-gray-100 text-gray-500 p-4 text-center h-24 flex flex-col justify-center items-center border-2 border-dashed border-gray-300 hover:border-gray-400">
              <div className="mb-2">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-xs font-medium">요청하기</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}