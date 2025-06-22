
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Menu,
  ChartCandlestick,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ activeSection, onSectionChange, isCollapsed, onToggle }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'watchlist', label: 'Watchlist', icon: ChartCandlestick },
    { id: 'diary', label: 'Diary', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={cn(
      "glass-card h-full flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IQ</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Invest IQ
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2 hover:bg-white/10"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-12 transition-all duration-200",
                  isCollapsed ? "px-3" : "px-4",
                  isActive 
                    ? "bg-gradient-to-r from-green-400/20 to-blue-500/20 text-green-400 border border-green-400/30" 
                    : "hover:bg-white/10 text-gray-300 hover:text-white"
                )}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className={cn(
                  "h-5 w-5",
                  isCollapsed ? "mx-auto" : "mr-3"
                )} />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-gray-400 text-center">
            Real-time market data
          </p>
        </div>
      )}
    </div>
  );
};
