
import { DollarSign, Zap } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MarketDataSettingsProps {
  currency: string;
  liveUpdates: boolean;
  onCurrencyChange: (currency: string) => void;
  onLiveUpdatesChange: (enabled: boolean) => void;
  saving: boolean;
}

export const MarketDataSettings = ({ 
  currency, 
  liveUpdates, 
  onCurrencyChange, 
  onLiveUpdatesChange, 
  saving 
}: MarketDataSettingsProps) => {
  return (
    <>
      {/* Market Data */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-green-400" />
          <h2 className="text-xl font-semibold text-foreground">Market Data</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Primary Currency
            </label>
            <Select 
              value={currency} 
              onValueChange={onCurrencyChange}
              disabled={saving}
            >
              <SelectTrigger className="w-full bg-background/50 border-border text-foreground hover:bg-background/70 focus:ring-primary">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-xl border-border shadow-2xl">
                <SelectItem value="USD" className="text-foreground hover:bg-accent focus:bg-accent">USD - US Dollar</SelectItem>
                <SelectItem value="EUR" className="text-foreground hover:bg-accent focus:bg-accent">EUR - Euro</SelectItem>
                <SelectItem value="GBP" className="text-foreground hover:bg-accent focus:bg-accent">GBP - British Pound</SelectItem>
                <SelectItem value="INR" className="text-foreground hover:bg-accent focus:bg-accent">INR - Indian Rupee</SelectItem>
                <SelectItem value="CAD" className="text-foreground hover:bg-accent focus:bg-accent">CAD - Canadian Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground">Live Updates</label>
              <p className="text-xs text-muted-foreground">Real-time price updates every 15 seconds</p>
            </div>
            <Switch 
              checked={liveUpdates} 
              onCheckedChange={onLiveUpdatesChange}
              disabled={saving}
            />
          </div>
        </div>
      </div>

      {/* Real-Time Features */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-yellow-400" />
          <h2 className="text-xl font-semibold text-foreground">Real-Time Features</h2>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-accent/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${liveUpdates ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium text-foreground">
                Live Updates: {liveUpdates ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {liveUpdates 
                ? 'Your dashboard and watchlist are receiving real-time price updates every 15 seconds.'
                : 'Enable Live Updates to get real-time price data automatically.'
              }
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
