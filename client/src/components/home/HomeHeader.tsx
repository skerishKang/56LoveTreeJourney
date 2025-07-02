import { Search, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HomeHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSettingsClick: () => void;
  userName?: string;
}

export default function HomeHeader({ 
  searchQuery, 
  setSearchQuery, 
  onSettingsClick,
  userName = "Guest" 
}: HomeHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between p-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">LT</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">LoveTree</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search love trees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onSettingsClick}>
            <Settings className="w-5 h-5" />
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-2 ml-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <span className="text-sm font-medium hidden sm:block">{userName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}