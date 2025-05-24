import RecommendedShorts from "@/components/recommended-shorts";

export default function ShortsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-love-pink/5 via-white to-tree-green/5 pb-20">
      <div className="container mx-auto px-4 pt-6">
        <RecommendedShorts />
      </div>
    </div>
  );
}