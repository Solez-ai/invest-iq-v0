
import { Star, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StockCardHeaderProps {
  symbol: string;
  companyName?: string;
  assetType?: string;
  isRealTime?: boolean;
  liveUpdatesEnabled: boolean;
  isPinned: boolean;
  isInWatchlist: boolean;
  onTogglePin: (e: React.MouseEvent) => void;
  onToggleWatchlist: (e: React.MouseEvent) => void;
}

const getAssetIcon = (assetType?: string) => {
  if (assetType === 'us') return '🇺🇸';
  if (assetType === 'global') return '🌍';
  if (assetType === 'etfs') return '📦';
  if (assetType === 'crypto') return '₿';
  return '';
};

export const StockCardHeader = ({
  symbol,
  companyName,
  assetType,
  isRealTime,
  liveUpdatesEnabled,
  isPinned,
  isInWatchlist,
  onTogglePin,
  onToggleWatchlist
}: StockCardHeaderProps) => {
  return (
    <>
      {/* Real-time indicator - only show when both isRealTime and liveUpdatesEnabled */}
      {isRealTime && liveUpdatesEnabled && (
        <div className="absolute top-1 left-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      )}
      
      {/* Asset Type Icon */}
      {assetType && (
        <div className="absolute top-2 left-2 text-xs">
          {getAssetIcon(assetType)}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="absolute top-2 right-2 flex gap-1">
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-6 w-6 p-0 hover:bg-accent",
            isPinned ? "text-yellow-500" : "text-muted-foreground"
          )}
          onClick={onTogglePin}
        >
          <Star className="h-3 w-3" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-6 w-6 p-0 hover:bg-accent",
            isInWatchlist ? "text-red-500" : "text-green-500"
          )}
          onClick={onToggleWatchlist}
        >
          {isInWatchlist ? (
            <Minus className="h-3 w-3" />
          ) : (
            <Plus className="h-3 w-3" />
          )}
        </Button>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-foreground">{symbol.replace(/^[A-Z]+:/, '')}</h3>
            {companyName && (
              <p className="text-sm text-muted-foreground truncate">{companyName}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
