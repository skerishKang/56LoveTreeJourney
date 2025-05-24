import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Heart } from "lucide-react";

export default function RecommendedShorts() {
  // Mock data for demonstration - in real app this would come from API
  const shorts = [
    {
      id: 1,
      title: "정국 첫 솔로곡",
      author: "@army_forever",
      likes: 1200,
      thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=400&fit=crop",
    },
    {
      id: 2,
      title: "필릭스 브이로그",
      author: "@stay_with_skz",
      likes: 856,
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=400&fit=crop",
    },
    {
      id: 3,
      title: "민지 댄스 챌린지",
      author: "@newjeans_fan",
      likes: 2100,
      thumbnail: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=300&h=400&fit=crop",
    },
  ];

  return (
    <section className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">추천 쇼츠</span>
          <span className="text-xl animate-sparkle">💫</span>
        </h3>
        <Button variant="ghost" className="text-love-pink text-sm font-medium">
          더보기
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {shorts.map((short) => (
          <div key={short.id} className="group cursor-pointer">
            <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-200 mb-2">
              <img 
                src={short.thumbnail}
                alt={short.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              
              <div className="absolute bottom-2 left-2 right-2">
                <div className="flex items-center space-x-1 text-white text-xs">
                  <Heart className="w-3 h-3 animate-sparkle" />
                  <span>{short.likes > 1000 ? `${(short.likes/1000).toFixed(1)}k` : short.likes}</span>
                </div>
              </div>
              
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Play className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-700 font-medium truncate">
              {short.title}
            </p>
            <p className="text-xs text-gray-500">
              {short.author}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
