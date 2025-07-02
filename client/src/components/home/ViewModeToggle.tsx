import { Map, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewModeToggleProps {
  viewMode: "timeline" | "mindmap";
  onViewModeChange: (mode: "timeline" | "mindmap") => void;
  className?: string;
}

export default function ViewModeToggle({ 
  viewMode, 
  onViewModeChange, 
  className = "" 
}: ViewModeToggleProps) {
  return (
    <div className={`flex bg-gray-100 rounded-lg p-1 ${className}`}>
      <Button
        variant={viewMode === "mindmap" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("mindmap")}
        className="flex-1 flex items-center justify-center space-x-2"
      >
        <Map className="w-4 h-4" />
        <span>마인드맵</span>
      </Button>
      
      <Button
        variant={viewMode === "timeline" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("timeline")}
        className="flex-1 flex items-center justify-center space-x-2"
      >
        <List className="w-4 h-4" />
        <span>타임라인</span>
      </Button>
    </div>
  );
}