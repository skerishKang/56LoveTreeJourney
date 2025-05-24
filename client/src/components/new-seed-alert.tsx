import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, Heart } from "lucide-react";

export default function NewSeedAlert() {
  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
    queryFn: () => api.getNotifications(3),
  });

  const newSeedlingNotifications = notifications?.filter((n: any) => 
    n.type === 'new_seedling' && !n.isRead
  ) || [];

  if (newSeedlingNotifications.length === 0) {
    return null;
  }

  const notification = newSeedlingNotifications[0];

  return (
    <section className="px-4 py-2">
      <Card className="bg-gradient-to-r from-sparkle-gold/20 to-tree-green/20 border border-sparkle-gold/30">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sparkle-gold rounded-full flex items-center justify-center animate-sparkle">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 flex items-center">
                새싹이 첫 영상을 올렸어요! 
                <Heart className="w-4 h-4 ml-1 text-love-pink animate-pulse-love" />
              </p>
              <p className="text-xs text-gray-600">
                {notification.message}
              </p>
            </div>
            <Button 
              size="sm"
              className="bg-tree-green/20 text-tree-green hover:bg-tree-green hover:text-white border-tree-green/30"
              variant="outline"
            >
              추천하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
