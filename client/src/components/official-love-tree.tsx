import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Crown, Verified, Play, Heart, Users, TrendingUp, Star, Copy, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OfficialLoveTreeProps {
  artistName: string;
  agencyName?: string;
}

export default function OfficialLoveTree({ artistName, agencyName }: OfficialLoveTreeProps) {
  const { toast } = useToast();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const { data: officialPaths } = useQuery({
    queryKey: [`/api/official-paths/${artistName}`],
    queryFn: async () => {
      // 실제 API 대신 예시 데이터
      return [
        {
          id: 1,
          title: "정국 공식 입덕 루트 💜",
          agency: "BIGHIT MUSIC",
          isVerified: true,
          difficulty: "초보자",
          estimatedTime: "3시간",
          completionRate: 89,
          followers: 12450,
          videos: [
            { title: "정국 - Seven (Official MV)", stage: "첫만남", views: "2.1억회", heartMoments: ["0:45", "2:30"] },
            { title: "정국 - 3D (Official MV)", stage: "관심증가", views: "8900만회", heartMoments: ["1:20", "2:15"] },
            { title: "정국 황금막내 모먼트 모음", stage: "빠져들기", views: "560만회", heartMoments: ["0:30", "4:45"] },
            { title: "정국 라이브 무대 레전드", stage: "완전입덕", views: "1200만회", heartMoments: ["1:10", "3:20"] }
          ]
        },
        {
          id: 2,
          title: "정국 보컬 중심 러브트리 🎵",
          agency: "ARMY 큐레이션",
          isVerified: false,
          difficulty: "중급자",
          estimatedTime: "5시간",
          completionRate: 76,
          followers: 8930,
          videos: [
            { title: "정국 커버곡 모음", stage: "첫만남", views: "890만회", heartMoments: ["2:15"] },
            { title: "정국 라이브 보컬 레전드", stage: "관심증가", views: "1.2억회", heartMoments: ["1:30", "3:45"] },
            { title: "정국 고음 모먼트", stage: "빠져들기", views: "670만회", heartMoments: ["0:50", "2:20"] }
          ]
        }
      ];
    },
  });

  const handleFollowPath = (pathId: number) => {
    toast({
      title: "공식 러브트리 팔로우! 🌟",
      description: "이제 이 루트를 따라 차근차근 입덕해보세요!",
    });
  };

  const handleCopyPath = (path: any) => {
    const pathText = `${path.title}\n${path.videos.map((v: any) => `• ${v.title}`).join('\n')}`;
    navigator.clipboard.writeText(pathText);
    
    toast({
      title: "러브트리 복사 완료! 📋",
      description: "친구들에게 공유해서 함께 입덕시켜보세요!",
    });
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="text-center bg-gradient-to-r from-love-pink/10 to-love-dark/10 rounded-2xl p-6">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <Building2 className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">{artistName} 공식 러브트리</h2>
          <Verified className="w-8 h-8 text-blue-500" />
        </div>
        <p className="text-gray-600">
          기획사와 전문 팬들이 큐레이션한 완벽한 입덕 루트를 따라해보세요! 🎯
        </p>
        {agencyName && (
          <Badge className="mt-3 bg-blue-500 text-white">
            {agencyName} 인증됨 ✓
          </Badge>
        )}
      </div>

      {/* 공식 러브트리 목록 */}
      <div className="grid gap-6">
        {officialPaths?.map((path: any) => (
          <Card key={path.id} className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center space-x-2">
                    <span>{path.title}</span>
                    {path.isVerified && <Verified className="w-5 h-5 text-blue-500" />}
                  </CardTitle>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Building2 className="w-4 h-4" />
                      <span>{path.agency}</span>
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {path.difficulty}
                    </Badge>
                    <span>{path.estimatedTime}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{path.completionRate}%</div>
                  <div className="text-xs text-gray-500">완주율</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* 통계 */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 rounded-lg p-3">
                  <Users className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                  <div className="text-lg font-bold text-blue-600">{path.followers.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">팔로워</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <Play className="w-5 h-5 mx-auto mb-1 text-green-500" />
                  <div className="text-lg font-bold text-green-600">{path.videos.length}개</div>
                  <div className="text-xs text-gray-600">영상</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-3">
                  <TrendingUp className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                  <div className="text-lg font-bold text-amber-600">급상승</div>
                  <div className="text-xs text-gray-600">인기도</div>
                </div>
              </div>

              {/* 영상 미리보기 */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-800">입덕 로드맵 미리보기</h4>
                <div className="grid gap-2">
                  {path.videos.slice(0, 3).map((video: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                      <div className="text-lg">
                        {index === 0 ? "🌱" : index === 1 ? "🌿" : index === 2 ? "🌳" : "🏆"}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{video.title}</div>
                        <div className="text-xs text-gray-500 flex items-center space-x-2">
                          <span>{video.stage}</span>
                          <span>•</span>
                          <span>{video.views}</span>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <Heart className="w-3 h-3 text-red-500" />
                            <span>{video.heartMoments.length}개 포인트</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {path.videos.length > 3 && (
                    <div className="text-center text-sm text-gray-500">
                      +{path.videos.length - 3}개 더 있음
                    </div>
                  )}
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex space-x-3">
                <Button 
                  onClick={() => handleFollowPath(path.id)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90"
                >
                  <Star className="w-4 h-4 mr-2" />
                  이 루트로 입덕하기
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => handleCopyPath(path)}
                  className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  복사
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      className="text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      공유
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>러브트리 공유하기</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        친구들을 {artistName}의 매력에 빠뜨려보세요!
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {["카카오톡", "인스타그램", "트위터", "링크복사"].map((platform) => (
                          <Button key={platform} variant="outline" className="h-12">
                            {platform}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* 성공 스토리 */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  <span className="font-medium text-gray-800">성공 후기</span>
                </div>
                <div className="text-sm text-gray-600">
                  "이 루트 따라하다가 진짜 입덕했어요! 특히 3번째 영상에서 완전히 넘어갔네요 💕"
                  <div className="text-xs text-gray-500 mt-1">- 새싹가드너 ⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 공식 러브트리 신청 */}
      <Card className="border-2 border-dashed border-love-pink/50 bg-gradient-to-r from-love-pink/5 to-love-dark/5">
        <CardContent className="p-6 text-center">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-love-pink" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">공식 러브트리 등록 신청</h3>
          <p className="text-gray-600 mb-4">
            기획사나 공식 팬클럽이라면 검증된 러브트리를 등록하여<br />
            새로운 팬들에게 완벽한 입덕 가이드를 제공해보세요!
          </p>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div>✓ 검증된 콘텐츠로만 구성</div>
            <div>✓ 단계별 체계적인 입덕 로드맵</div>
            <div>✓ 공식 인증 마크 획득</div>
            <div>✓ 전용 분석 도구 제공</div>
          </div>
          <Button className="bg-gradient-to-r from-love-pink to-love-dark hover:opacity-90">
            <Verified className="w-4 h-4 mr-2" />
            공식 등록 신청하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}