
import { Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface NotificationSettingsProps {
  notifications: boolean;
  onNotificationsChange: (enabled: boolean) => void;
  saving: boolean;
}

export const NotificationSettings = ({ notifications, onNotificationsChange, saving }: NotificationSettingsProps) => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-5 w-5 text-blue-400" />
        <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-foreground">Price Alerts</label>
            <p className="text-xs text-muted-foreground">Get notified when stocks hit your target prices</p>
          </div>
          <Switch 
            checked={notifications} 
            onCheckedChange={onNotificationsChange}
            disabled={saving}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-foreground">Market News</label>
            <p className="text-xs text-muted-foreground">Receive breaking market news notifications</p>
          </div>
          <Switch checked={true} />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-foreground">AI Insights</label>
            <p className="text-xs text-muted-foreground">Get AI-powered market insights and recommendations</p>
          </div>
          <Switch checked={true} />
        </div>
      </div>
    </div>
  );
};
