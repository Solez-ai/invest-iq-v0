
import { TrendingUp, TrendingDown } from 'lucide-react';
import { StockQuote } from '@/utils/finnhubAPI';
import { cn } from '@/lib/utils';

interface StockCardPriceProps {
  quote: StockQuote;
  currencySymbol: string;
  priceChanged: 'up' | 'down' | null;
  liveUpdatesEnabled: boolean;
}

export const StockCardPrice = ({ quote, currencySymbol, priceChanged, liveUpdatesEnabled }: StockCardPriceProps) => {
  const isPositive = quote.dp >= 0;
  const changeColor = isPositive ? 'profit' : 'loss';

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className={cn(
          "text-2xl font-bold text-foreground transition-colors duration-500",
          // Only apply price change colors when live updates are enabled
          liveUpdatesEnabled && priceChanged === 'up' && "text-green-500",
          liveUpdatesEnabled && priceChanged === 'down' && "text-red-500"
        )}>
          {currencySymbol}{quote.c.toFixed(2)}
        </span>
        <div className={cn("flex items-center", changeColor)}>
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <span className={changeColor}>
          {isPositive ? '+' : ''}{quote.d.toFixed(2)}
        </span>
        <span className={changeColor}>
          {isPositive ? '+' : ''}{quote.dp.toFixed(2)}%
        </span>
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>H: {currencySymbol}{quote.h.toFixed(2)}</span>
        <span>L: {currencySymbol}{quote.l.toFixed(2)}</span>
      </div>
    </div>
  );
};
