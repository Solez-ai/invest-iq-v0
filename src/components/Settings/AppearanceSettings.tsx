
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface AppearanceSettingsProps {
  isDarkMode: boolean;
  onThemeChange: (checked: boolean) => void;
  saving: boolean;
}

export const AppearanceSettings = ({ isDarkMode, onThemeChange, saving }: AppearanceSettingsProps) => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        {isDarkMode ? <Moon className="h-5 w-5 text-purple-400" /> : <Sun className="h-5 w-5 text-yellow-500" />}
        <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-foreground">Dark Mode</label>
            <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
          </div>
          <Switch 
            checked={isDarkMode} 
            onCheckedChange={onThemeChange}
            disabled={saving}
          />
        </div>
      </div>
    </div>
  );
};
