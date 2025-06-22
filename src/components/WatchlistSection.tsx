
import { StockCard } from './StockCard';
import { StockQuote } from '@/utils/finnhubAPI';

interface WatchlistSectionProps {
  quotes?: Record<string, StockQuote>;
  isRealTime?: boolean;
}

const watchlistStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
];

export const WatchlistSection = ({ quotes = {}, isRealTime = false }: WatchlistSectionProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Your Watchlist</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Live prices • Auto-refresh</span>
          {isRealTime && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600">Live</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {watchlistStocks.map((stock) => (
          <StockCard
            key={stock.symbol}
            symbol={stock.symbol}
            companyName={stock.name}
            quote={quotes[stock.symbol]}
            isRealTime={isRealTime}
            onClick={() => {
              console.log(`Selected ${stock.symbol}`);
            }}
          />
        ))}
      </div>
    </div>
  );
};
