import { ReactNode } from "react";
import { GripVertical, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SectionContainerProps {
  id: string;
  title: string;
  children: ReactNode;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  onToggle?: () => void;
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent, sectionId: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, targetSectionId: string) => void;
  className?: string;
  headerActions?: ReactNode;
}

export default function SectionContainer({
  id,
  title,
  children,
  isCollapsible = false,
  isCollapsed = false,
  onToggle,
  isDraggable = false,
  onDragStart,
  onDragOver,
  onDrop,
  className = "",
  headerActions
}: SectionContainerProps) {
  return (
    <Card 
      className={`transition-all duration-200 ${className}`}
      draggable={isDraggable}
      onDragStart={isDraggable ? (e) => onDragStart?.(e, id) : undefined}
      onDragOver={isDraggable ? onDragOver : undefined}
      onDrop={isDraggable ? (e) => onDrop?.(e, id) : undefined}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          {isDraggable && (
            <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
          )}
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </div>
        
        <div className="flex items-center space-x-2">
          {headerActions}
          
          {isCollapsible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              <ChevronRight 
                className={`w-4 h-4 transition-transform ${isCollapsed ? "" : "rotate-90"}`} 
              />
            </Button>
          )}
        </div>
      </CardHeader>
      
      {!isCollapsed && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  );
}