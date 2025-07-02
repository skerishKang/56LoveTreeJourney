import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useGlobalScrollRestoration } from "@/hooks/useScrollRestoration";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { SkipLink } from "@/hooks/useAccessibility";
import { Suspense, lazy } from "react";

// 코드 분할을 통한 동적 임포트
const Landing = lazy(() => import("@/pages/landing"));
const Home = lazy(() => import("@/pages/home"));
const Discover = lazy(() => import("@/pages/discover"));
const Community = lazy(() => import("@/pages/community"));
const Profile = lazy(() => import("@/pages/profile"));
const ProfileEdit = lazy(() => import("@/pages/profile-edit"));
const AddContent = lazy(() => import("@/pages/add-content"));
const CategoryHub = lazy(() => import("@/pages/category-hub"));
const LoveTreeTemplates = lazy(() => import("@/pages/love-tree-templates-new"));
const CommunityTrackerPage = lazy(() => import("@/pages/community-tracker-page"));
const GoodsCollectionPage = lazy(() => import("@/pages/goods-collection-page"));
const FanActivitiesPage = lazy(() => import("@/pages/fan-activities-page"));
const SubscriptionManagerPage = lazy(() => import("@/pages/subscription-manager-page"));
const PopularLoveTrees = lazy(() => import("@/pages/popular-love-trees"));
const InteractiveLoveTree = lazy(() => import("@/pages/interactive-love-tree"));
const ReactFlowLoveTree = lazy(() => import("@/pages/reactflow-love-tree"));
const TreeShapedLoveTree = lazy(() => import("@/pages/tree-shaped-love-tree"));
const IdolFaceMosaic = lazy(() => import("@/pages/idol-face-mosaic"));
const PropagatorSubscription = lazy(() => import("@/pages/propagator-subscription"));
const ShortsPage = lazy(() => import("@/pages/shorts"));
const LoveTreeFullscreen = lazy(() => import("@/pages/love-tree-fullscreen"));
const NotFound = lazy(() => import("@/pages/not-found"));

// 로딩 컴포넌트 최적화
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center animate-spin mb-4 mx-auto">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <span className="text-2xl">💕</span>
          </div>
        </div>
        <p className="text-gray-600">로딩 중...</p>
      </div>
    </div>
  );
}

// 페이지별 로딩 컴포넌트
function PageLoadingSpinner() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full animate-pulse mb-2 mx-auto">
          <span className="text-sm">💕</span>
        </div>
        <p className="text-gray-500 text-sm">페이지 로딩 중...</p>
      </div>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // 전역 스크롤 위치 복원
  useGlobalScrollRestoration();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Switch>
        {!isAuthenticated ? (
          <Route path="/" component={Landing} />
        ) : (
          <>
            <Route path="/" component={Home} />
            <Route path="/add" component={AddContent} />
            <Route path="/templates" component={LoveTreeTemplates} />
            <Route path="/community" component={Community} />
            <Route path="/profile" component={Profile} />
            <Route path="/profile/edit" component={ProfileEdit} />
            <Route path="/categories" component={CategoryHub} />
            <Route path="/community-tracker" component={CommunityTrackerPage} />
            <Route path="/goods-collection" component={GoodsCollectionPage} />
            <Route path="/fan-activities" component={FanActivitiesPage} />
            <Route path="/subscription-manager" component={SubscriptionManagerPage} />
            <Route path="/popular-love-trees" component={PopularLoveTrees} />
            <Route path="/interactive-tree" component={InteractiveLoveTree} />
            <Route path="/reactflow-tree" component={ReactFlowLoveTree} />
            <Route path="/tree-shaped" component={TreeShapedLoveTree} />
            <Route path="/idol-mosaic" component={IdolFaceMosaic} />
            <Route path="/propagator-subscription" component={PropagatorSubscription} />
            <Route path="/shorts" component={ShortsPage} />
            <Route path="/love-tree/:id" component={LoveTreeFullscreen} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* 접근성 스킵 링크 */}
        <SkipLink href="#main-content">메인 컨텐츠로 이동</SkipLink>
        
        <div id="main-content">
          <Router />
        </div>
        
        <Toaster />
        
        {/* 성능 모니터 (개발 모드에서만 표시) */}
        <PerformanceMonitor />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;