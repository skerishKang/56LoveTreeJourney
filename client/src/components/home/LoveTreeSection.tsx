import { useState } from "react";
import { Share2, Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionContainer from "./SectionContainer";
import ViewModeToggle from "./ViewModeToggle";
import LoveTreeTimeline from "@/components/love-tree-timeline";
import LoveTreeMindmap from "@/components/love-tree-mindmap";
import EnhancedLoveTree from "@/components/enhanced-love-tree";

interface LoveTreeSectionProps {
  viewMode: "timeline" | "mindmap";
  onViewModeChange: (mode: "timeline" | "mindmap") => void;
  onFullscreen: () => void;
  onShare: () => void;
  onAddContent: () => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function LoveTreeSection({
  viewMode,
  onViewModeChange,
  onFullscreen,
  onShare,
  onAddContent,
  isCollapsed = false,
  onToggle
}: LoveTreeSectionProps) {
  const headerActions = (
    <>
      <ViewModeToggle 
        viewMode={viewMode} 
        onViewModeChange={onViewModeChange}
        className="hidden sm:flex"
      />
      
      <Button variant="outline" size="sm" onClick={onAddContent}>
        <Plus className="w-4 h-4 mr-1" />
        추가
      </Button>
      
      <Button variant="outline" size="sm" onClick={onShare}>
        <Share2 className="w-4 h-4 mr-1" />
        공유
      </Button>
      
      <Button variant="outline" size="sm" onClick={onFullscreen}>
        <Play className="w-4 h-4 mr-1" />
        전체화면
      </Button>
    </>
  );

  return (
    <SectionContainer
      id="myLoveTree"
      title="나의 러브트리"
      isCollapsible
      isCollapsed={isCollapsed}
      onToggle={onToggle}
      headerActions={headerActions}
      className="mb-6"
    >
      {/* Mobile View Mode Toggle */}
      <div className="sm:hidden mb-4">
        <ViewModeToggle 
          viewMode={viewMode} 
          onViewModeChange={onViewModeChange}
        />
      </div>

      {/* Love Tree Content */}
      <div className="space-y-4">
        {viewMode === "timeline" ? (
          <LoveTreeTimeline />
        ) : (
          <div className="space-y-4">
            <LoveTreeMindmap />
            <EnhancedLoveTree />
          </div>
        )}
      </div>
    </SectionContainer>
  );
}