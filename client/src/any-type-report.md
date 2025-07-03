# TypeScript 'any' Type Usage Report

## Summary
This report identifies all TypeScript files in the 56LoveTreeJourney/client/src directory that contain 'any' type annotations, sorted by occurrence count.

## Files with 'any' Type Annotations (Highest to Lowest)

### 1. `/pages/add-content.tsx` - 7 occurrences
- Line 45: `mutationFn: (data: any) => api.createLoveTree(data)`
- Line 65: `mutationFn: ({ loveTreeId, data }: { loveTreeId: number; data: any }) =>`
- Line 84: `const handleCreateNewTree = (data: any) => {`
- Line 143: `.filter((tree: any) => !tree.isCompleted)`
- Line 144: `.map((tree: any) => (`
- Line 290: `{stages.map((stage: any) => (`
- Line 333: `onSubmit: (data: any) => void;`

### 2. `/lib/api.ts` - 5 occurrences
- Line 9: `createLoveTree: (data: any) => apiRequest("POST", "/api/love-trees", data)`
- Line 17: `createLoveTreeItem: (loveTreeId: number, data: any) =>`
- Line 26: `createComment: (itemId: number, data: any) =>`
- Line 36: `createRecommendation: (itemId: number, data: any) =>`
- Line 38: `selectRecommendation: (recommendationId: number, data: any) =>`

### 3. `/components/love-tree-progress.tsx` - 5 occurrences
- Line 8: `loveTree: any;`
- Line 22: `const currentStage = stages?.find((stage: any) =>`
- Line 23: `items?.some((item: any) => item.stageId === stage.id)`
- Line 26: `const currentStageItems = items?.filter((item: any) =>`
- Line 33: `const firstContent = items?.find((item: any) => item.isFirstContent);`

### 4. `/pages/reactflow-love-tree.tsx` - 4 occurrences
- Line 36: `const VideoNode = ({ data }: { data: any }) => {`
- Line 94: `const IdolNode = ({ data }: { data: any }) => {`
- Line 379: `nodeStrokeColor={(n: any) => {`
- Line 383: `nodeColor={(n: any) => {`

### 5. `/components/official-love-tree.tsx` - 4 occurrences

### 6. `/services/loveTreeService.ts` - 3 occurrences

### 7. `/lib/queryClient.ts` - 3 occurrences

### 8. `/components/tag-filter.tsx` - 3 occurrences

### 9. `/components/diary-love-tree.tsx` - 3 occurrences

### 10. `/components/PerformanceMonitor.tsx` - 3 occurrences

## Files with 2 occurrences each:
- `/pages/profile.tsx`
- `/pages/love-tree-fullscreen.tsx`
- `/pages/discover.tsx`
- `/lib/api-cache.ts`
- `/components/subscription-manager.tsx`
- `/components/popular-trees.tsx`
- `/components/new-seed-alert.tsx`
- `/components/love-tree-mindmap.tsx`
- `/components/goods-collection.tsx`
- `/components/fan-activity-journal.tsx`
- `/components/enhanced-love-tree.tsx`
- `/components/continue-love-tree-modal.tsx`
- `/components/community-tracker.tsx`

## Files with 1 occurrence each:
- `/pages/popular-love-trees.tsx`
- `/pages/interactive-love-tree.tsx`
- `/pages/idol-face-mosaic.tsx`
- `/pages/community.tsx`
- `/pages/community-tracker-page.tsx`
- `/components/youtuber-love-tree.tsx`
- `/components/video-editor.tsx`
- `/components/sns-share-modal.tsx`
- `/components/recommended-shorts.tsx`
- `/components/post-write-modal.tsx`
- `/components/mindmap-love-tree.tsx`
- `/components/love-tree-timeline.tsx`
- `/components/learning-love-tree.tsx`
- `/components/lazy-image.tsx`
- `/components/investment-love-tree.tsx`
- `/components/horizontal-love-tree.tsx`
- `/components/enhanced-video-editor.tsx`
- `/components/drama-love-tree.tsx`

## Common Patterns of 'any' Usage:
1. **API Data Types**: Many occurrences are in API-related functions where data types from external sources are not properly typed
2. **Array Operations**: `.filter()`, `.map()`, `.find()` callbacks often use `any` for array elements
3. **Event Handlers and Props**: Component props and event handler parameters frequently use `any`
4. **Third-party Library Integration**: ReactFlow and other library callbacks use `any` parameters

## Recommendations:
1. Create proper TypeScript interfaces for API responses and data structures
2. Define types for commonly used entities like `LoveTree`, `Stage`, `Item`, etc.
3. Replace `any` in array operations with specific types
4. Use generics for reusable components and functions
5. Consider using `unknown` instead of `any` where type safety is needed but the exact type varies