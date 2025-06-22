
import { StockCard } from './StockCard';

const watchlistStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
];

export const WatchlistSection = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Your Watchlist</h2>
        <span className="text-sm text-muted-foreground">Live prices • Auto-refresh</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {watchlistStocks.map((stock) => (
          <StockCard
            key={stock.symbol}
            symbol={stock.symbol}
            companyName={stock.name}
            onClick={() => {
              console.log(`Selected ${stock.symbol}`);
            }}
          />
        ))}
      </div>
    </div>
  );
};
