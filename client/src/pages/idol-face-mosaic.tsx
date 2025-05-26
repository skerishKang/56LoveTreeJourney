import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Home,
  Sparkles,
  Trophy,
  Crown,
  Heart,
  Share2,
  Download,
  Eye
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface CompletedLoveTree {
  id: number;
  title: string;
  userId: string;
  completedAt: string;
  videoCount: number;
  totalLikes: number;
  creatorName: string;
  thumbnailColor: string;
  category: string;
}

export default function IdolFaceMosaic() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedIdol, setSelectedIdol] = useState("정국");
  const [mosaicCompleted, setMosaicCompleted] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [mosaicProgress, setMosaicProgress] = useState(0);

  // 완성된 러브트리들 데이터 (실제로는 API에서 가져올 예정)
  const completedTrees: CompletedLoveTree[] = [
    { id: 1, title: "정국 첫입덕 스토리", userId: "user1", completedAt: "2024-01-15", videoCount: 8, totalLikes: 245, creatorName: "민지팬", thumbnailColor: "#FFD93D", category: "귀여움" },
    { id: 2, title: "황금막내의 보컬", userId: "user2", completedAt: "2024-01-16", videoCount: 12, totalLikes: 189, creatorName: "하늘별", thumbnailColor: "#FF6B9D", category: "보컬" },
    { id: 3, title: "정국 댄스 레전드", userId: "user3", completedAt: "2024-01-17", videoCount: 10, totalLikes: 312, creatorName: "소라공주", thumbnailColor: "#4ECDC4", category: "댄스" },
    { id: 4, title: "콘서트 감동 순간", userId: "user4", completedAt: "2024-01-18", videoCount: 15, totalLikes: 456, creatorName: "별빛나라", thumbnailColor: "#F39C12", category: "콘서트" },
    { id: 5, title: "예능 웃음 포인트", userId: "user5", completedAt: "2024-01-19", videoCount: 9, totalLikes: 178, creatorName: "달님이", thumbnailColor: "#E74C3C", category: "예능" },
    { id: 6, title: "정국 라이브 모음", userId: "user6", completedAt: "2024-01-20", videoCount: 11, totalLikes: 267, creatorName: "꽃잎아", thumbnailColor: "#9B59B6", category: "라이브" },
    { id: 7, title: "셀카 미모 정리", userId: "user7", completedAt: "2024-01-21", videoCount: 7, totalLikes: 334, creatorName: "구름이", thumbnailColor: "#27AE60", category: "비주얼" },
    { id: 8, title: "정국 팬서비스", userId: "user8", completedAt: "2024-01-22", videoCount: 13, totalLikes: 298, creatorName: "바람돌이", thumbnailColor: "#3498DB", category: "팬서비스" },
    { id: 9, title: "운동하는 정국", userId: "user9", completedAt: "2024-01-23", videoCount: 6, totalLikes: 145, creatorName: "눈송이", thumbnailColor: "#E67E22", category: "운동" },
    { id: 10, title: "정국 요리 모먼트", userId: "user10", completedAt: "2024-01-24", videoCount: 8, totalLikes: 201, creatorName: "햇살", thumbnailColor: "#8E44AD", category: "일상" },
    // 더 많은 트리들...
    { id: 11, title: "정국 패션 센스", userId: "user11", completedAt: "2024-01-25", videoCount: 9, totalLikes: 223, creatorName: "별똥별", thumbnailColor: "#F1C40F", category: "패션" },
    { id: 12, title: "정국 게임 방송", userId: "user12", completedAt: "2024-01-26", videoCount: 10, totalLikes: 156, creatorName: "무지개", thumbnailColor: "#1ABC9C", category: "게임" },
    { id: 13, title: "정국 브이앱 모음", userId: "user13", completedAt: "2024-01-27", videoCount: 12, totalLikes: 289, creatorName: "고양이", thumbnailColor: "#E91E63", category: "브이앱" },
    { id: 14, title: "정국 셀피 타임", userId: "user14", completedAt: "2024-01-28", videoCount: 5, totalLikes: 412, creatorName: "나비", thumbnailColor: "#673AB7", category: "셀피" },
    { id: 15, title: "정국 뒷모습도 완벽", userId: "user15", completedAt: "2024-01-29", videoCount: 7, totalLikes: 198, creatorName: "새싹", thumbnailColor: "#795548", category: "비주얼" },
  ];

  // 정국 얼굴 모자이크 격자 (15x20 = 300개 셀)
  const faceGrid = Array.from({ length: 15 }, (_, row) => 
    Array.from({ length: 20 }, (_, col) => ({
      row,
      col,
      isEye: (row >= 4 && row <= 6 && ((col >= 5 && col <= 7) || (col >= 12 && col <= 14))),
      isNose: (row >= 8 && row <= 9 && col >= 9 && col <= 10),
      isMouth: (row >= 11 && row <= 12 && col >= 7 && col <= 12),
      isFace: (row >= 2 && row <= 13 && col >= 3 && col <= 16),
      treeIndex: (row * 20 + col) % completedTrees.length
    }))
  );

  useEffect(() => {
    // 모자이크 진행률 계산
    const progress = Math.min((completedTrees.length / 300) * 100, 100);
    setMosaicProgress(progress);
    
    if (progress >= 80 && !mosaicCompleted) {
      setMosaicCompleted(true);
      toast({
        title: "🎉 정국 얼굴 모자이크 완성! 🎉",
        description: "전세계 아미들의 러브트리로 정국 얼굴이 완성되었어요!",
      });
    }
  }, [completedTrees.length, mosaicCompleted]);

  const getCellContent = (cell: any) => {
    const tree = completedTrees[cell.treeIndex];
    if (!tree) return null;

    return (
      <div 
        className="w-full h-full transition-all duration-500 hover:scale-110 hover:z-10 relative group cursor-pointer"
        style={{ backgroundColor: tree.thumbnailColor }}
        onClick={() => {
          toast({
            title: tree.title,
            description: `${tree.creatorName}님의 작품 • ${tree.videoCount}개 영상 • ❤️ ${tree.totalLikes}`,
          });
        }}
      >
        {/* 미니 러브트리 표현 */}
        <div className="absolute inset-1 flex items-center justify-center">
          <div className="text-xs text-white font-bold opacity-80">🌳</div>
        </div>
        
        {/* 호버시 정보 */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white text-xs p-1">
          <div className="font-bold truncate w-full text-center">{tree.title}</div>
          <div className="text-xs opacity-75">{tree.creatorName}</div>
          <div className="text-xs">❤️ {tree.totalLikes}</div>
        </div>
        
        {/* 중요 부위 강조 */}
        {cell.isEye && (
          <div className="absolute inset-0 bg-white/20 rounded-full"></div>
        )}
        {cell.isNose && (
          <div className="absolute inset-0 bg-pink-300/30"></div>
        )}
        {cell.isMouth && (
          <div className="absolute inset-0 bg-red-300/20 rounded-lg"></div>
        )}
      </div>
    );
  };

  const shareToSocialMedia = (platform: string) => {
    const shareText = `🌳 전세계 아미들의 러브트리로 완성된 정국 얼굴! ${completedTrees.length}개의 러브트리가 모여 만든 감동적인 모자이크 💜 #BTS #정국 #러브트리 #ARMY`;
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      instagram: `https://www.instagram.com/`,
      kakao: `https://story.kakao.com/`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`
    };
    
    window.open(urls[platform as keyof typeof urls], '_blank');
    
    toast({
      title: "공유하기 ✨",
      description: `${platform}으로 정국 모자이크를 공유했어요!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* 상단 헤더 */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-purple-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="rounded-full">
                <Home className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-bold text-xl text-gray-800 flex items-center space-x-2">
                <Crown className="w-6 h-6 text-yellow-500" />
                <span>정국 얼굴 모자이크</span>
              </h1>
              <p className="text-sm text-gray-600">전세계 아미들의 러브트리로 완성하는 정국 얼굴 🐰</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1">
              {completedTrees.length}/300 트리
            </Badge>
            <Button 
              size="sm"
              onClick={() => setShowShareModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
              <Share2 className="w-4 h-4 mr-1" />
              공유하기
            </Button>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">모자이크 완성도</span>
            <span className="text-sm text-gray-600">{mosaicProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000 relative overflow-hidden"
              style={{ width: `${mosaicProgress}%` }}
            >
              {mosaicCompleted && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/50 to-white/30 animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 메인 모자이크 */}
      <div className="p-4">
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-xl">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center space-x-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                <span>정국 🐰 Love Tree Mosaic</span>
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </h2>
              <p className="text-gray-600">
                각 작은 사각형은 한 명의 아미가 만든 러브트리예요. 마우스를 올려보세요! ✨
              </p>
            </div>

            {/* 모자이크 격자 */}
            <div className="flex justify-center">
              <div 
                className="grid gap-1 bg-gray-100 p-4 rounded-lg"
                style={{ 
                  gridTemplateColumns: 'repeat(20, 1fr)',
                  width: 'fit-content'
                }}
              >
                {faceGrid.flat().map((cell, index) => (
                  <div
                    key={index}
                    className={`w-6 h-6 ${!cell.isFace ? 'opacity-20' : ''} ${
                      mosaicCompleted ? 'animate-pulse' : ''
                    }`}
                  >
                    {cell.isFace ? getCellContent(cell) : (
                      <div className="w-full h-full bg-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 완성 메시지 */}
            {mosaicCompleted && (
              <div className="mt-8 text-center bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-6 border-2 border-yellow-300">
                <div className="text-4xl mb-3">🎉✨🎉</div>
                <h3 className="text-2xl font-bold text-orange-800 mb-2">
                  정국 얼굴 모자이크 완성!
                </h3>
                <p className="text-orange-700 mb-4">
                  전세계 {completedTrees.length}명의 아미들이 만든 러브트리로<br/>
                  우리 정국이 얼굴이 완성되었어요! 💜
                </p>
                
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={() => setShowShareModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    하이브에 보내기
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    이미지 저장
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 참여한 아미들 목록 */}
        <Card className="mt-6 bg-white/80 backdrop-blur-sm border-purple-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span>참여한 아미들</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedTrees.slice(0, 9).map((tree) => (
                <div 
                  key={tree.id}
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow"
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: tree.thumbnailColor }}
                  >
                    🌳
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm">{tree.title}</h4>
                    <p className="text-xs text-gray-600">{tree.creatorName} • ❤️ {tree.totalLikes}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {completedTrees.length > 9 && (
              <div className="text-center mt-4">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  더 많은 아미들 보기 (+{completedTrees.length - 9})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 공유 모달 */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Share2 className="w-5 h-5 text-blue-500" />
              <span>정국 모자이크 공유하기</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              전세계 아미들의 사랑으로 완성된 정국 얼굴을 공유해보세요! ✨
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => shareToSocialMedia('twitter')}
                className="bg-blue-400 hover:bg-blue-500 text-white"
              >
                𝕏 트위터
              </Button>
              <Button 
                onClick={() => shareToSocialMedia('instagram')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                📷 인스타그램
              </Button>
              <Button 
                onClick={() => shareToSocialMedia('kakao')}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-800"
              >
                💬 카카오톡
              </Button>
              <Button 
                onClick={() => shareToSocialMedia('facebook')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                📘 페이스북
              </Button>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-800 mb-2">하이브 공식 계정에 보내기</h4>
              <p className="text-xs text-gray-600 mb-3">
                완성된 모자이크를 하이브와 정국에게 보내서 감동을 전해보세요!
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                onClick={() => {
                  toast({
                    title: "하이브에 전송 완료! 📤",
                    description: "정국과 하이브가 아미들의 사랑을 확인했어요! 💜",
                  });
                  setShowShareModal(false);
                }}
              >
                <Trophy className="w-4 h-4 mr-2" />
                하이브 공식 계정에 보내기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}