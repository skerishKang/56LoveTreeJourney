import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import CommunityTracker from "@/components/community-tracker";
import BottomNavigation from "@/components/bottom-navigation";
import PostWriteModal from "@/components/post-write-modal";

export default function CommunityTrackerPage() {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const handlePostSubmit = (postData: any) => {
    console.log("새 게시물:", postData);
    // 실제 API 호출로 게시물 저장
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-love-light via-white to-love-light">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-love-pink/20">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-800">커뮤니티 활동</h1>
                <p className="text-sm text-gray-600">SNS 팬 커뮤니티 활동을 관리해보세요</p>
              </div>
            </div>
            <Button 
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              onClick={() => setIsWriteModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              글쓰기
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-20">
        <CommunityTracker />
      </main>

      <BottomNavigation />

      {/* 글쓰기 모달 */}
      <PostWriteModal 
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSubmit={handlePostSubmit}
      />
    </div>
  );
}