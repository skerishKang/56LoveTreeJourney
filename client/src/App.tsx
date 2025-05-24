import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Discover from "@/pages/discover";
import Community from "@/pages/community";
import Profile from "@/pages/profile";
import AddContent from "@/pages/add-content";
import CategoryHub from "@/pages/category-hub";
import LoveTreeTemplates from "@/pages/love-tree-templates";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-soft-pink flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-love-pink to-tree-green rounded-full flex items-center justify-center animate-pulse mb-4 mx-auto">
            <span className="text-2xl">💕</span>
          </div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
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
          <Route path="/categories" component={CategoryHub} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
