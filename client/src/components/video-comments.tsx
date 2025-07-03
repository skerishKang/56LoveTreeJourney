import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Send, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface VideoCommentsProps {
  itemId: number;
  className?: string;
}

interface Comment {
  id: number;
  content: string;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
    propagatorRank: string | null;
  };
}

export default function VideoComments({ itemId, className = "" }: VideoCommentsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const { data: comments, isLoading } = useQuery({
    queryKey: [`/api/items/${itemId}/comments`],
    queryFn: async () => {
      const response = await fetch(`/api/items/${itemId}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      return response.json();
    },
  });

  const addComment = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`/api/items/${itemId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("Failed to add comment");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "댓글이 등록되었어요! 💬",
        description: "다른 가드너들과 소통해보세요!",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/items/${itemId}/comments`] });
      setNewComment("");
    },
  });

  const handleSubmitComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "댓글을 입력해주세요",
        description: "내용을 입력한 후 등록해주세요.",
        variant: "destructive",
      });
      return;
    }

    addComment.mutate(newComment.trim());
  };

  const getRankBadgeColor = (rank: string | null) => {
    switch (rank) {
      case "새싹 가드너": return "bg-green-100 text-green-700 border-green-300";
      case "정원사": return "bg-blue-100 text-blue-700 border-blue-300";
      case "마스터 가드너": return "bg-purple-100 text-purple-700 border-purple-300";
      case "레전드 가드너": return "bg-gold-100 text-gold-700 border-gold-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 댓글 작성 */}
      <Card className="border-love-pink/20 bg-gradient-to-r from-love-pink/5 to-love-dark/5">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <MessageCircle className="w-5 h-5 text-love-pink" />
            <span className="font-medium text-gray-800">댓글 남기기</span>
          </div>
          <div className="flex space-x-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="이 영상에 대한 생각을 공유해보세요..."
              className="flex-1 resize-none border-gray-200 focus:border-love-pink"
              rows={3}
            />
            <Button
              onClick={handleSubmitComment}
              disabled={addComment.isPending || !newComment.trim()}
              className="bg-love-pink hover:bg-love-dark text-white self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 댓글 목록 */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            댓글 {comments?.length || 0}개
          </span>
        </div>

        {comments?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>첫 번째 댓글을 남겨보세요!</p>
          </div>
        ) : (
          comments?.map((comment: Comment) => (
            <Card key={comment.id} className="border-gray-100 hover:border-love-pink/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.user.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-love-pink/10 text-love-pink">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-800 text-sm">
                        {comment.user.firstName || "익명의 가드너"}
                      </span>
                      {comment.user.propagatorRank && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getRankBadgeColor(comment.user.propagatorRank)}`}
                        >
                          {comment.user.propagatorRank}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), { 
                          addSuffix: true, 
                          locale: ko 
                        })}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {comment.content}
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-500 hover:text-love-pink p-0 h-auto"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        <span className="text-xs">좋아요</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-500 hover:text-love-pink p-0 h-auto"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs">답글</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}