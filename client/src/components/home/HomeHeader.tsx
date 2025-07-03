import { Search, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";

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
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex items-center justify-between p-3 sm:p-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">LT</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 hidden sm:block">LoveTree</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <div className="relative">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 w-full text-sm sm:text-base bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <Button variant="ghost" size="sm" className="relative p-2 sm:p-2">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
          </Button>
          
          <ThemeToggle />
          
          <Button variant="ghost" size="sm" onClick={onSettingsClick} className="p-2 sm:p-2">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-1 sm:space-x-2 ml-1 sm:ml-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <span className="text-xs sm:text-sm font-medium hidden sm:block text-gray-900 dark:text-gray-100">{userName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}