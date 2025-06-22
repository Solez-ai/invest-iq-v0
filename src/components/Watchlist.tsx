
import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StockCard } from './StockCard';

const initialWatchlist = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
];

export const Watchlist = () => {
  const [watchlist, setWatchlist] = useState(initialWatchlist);
  const [searchTerm, setSearchTerm] = useState('');
  const [newSymbol, setNewSymbol] = useState('');

  const filteredWatchlist = watchlist.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStock = () => {
    if (newSymbol.trim() && !watchlist.find(stock => stock.symbol === newSymbol.toUpperCase())) {
      setWatchlist([...watchlist, { 
        symbol: newSymbol.toUpperCase(), 
        name: `${newSymbol.toUpperCase()} Inc.` 
      }]);
      setNewSymbol('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Your Watchlist</h1>
          <p className="text-gray-400">Track your favorite stocks with real-time data</p>
        </div>
        <div className="glass-card p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{watchlist.length}</div>
            <div className="text-sm text-gray-400">Tracked Assets</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search your watchlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60"
            />
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add symbol (e.g., AAPL)"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddStock()}
              className="bg-white/10 border-white/20 text-white placeholder-white/60"
            />
            <Button
              onClick={handleAddStock}
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Watchlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredWatchlist.map((stock) => (
          <StockCard
            key={stock.symbol}
            symbol={stock.symbol}
            companyName={stock.name}
            onClick={() => {
              console.log(`Viewing details for ${stock.symbol}`);
            }}
          />
        ))}
      </div>

      {/* No results */}
      {filteredWatchlist.length === 0 && (
        <div className="glass-card p-8 text-center">
          <p className="text-gray-400 mb-4">No stocks match your search</p>
          <Button
            variant="outline"
            onClick={() => setSearchTerm('')}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Clear Search
          </Button>
        </div>
      )}

      {/* Market Summary */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Market Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">+1.2%</div>
            <div className="text-sm text-gray-400">S&P 500</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">+0.8%</div>
            <div className="text-sm text-gray-400">NASDAQ</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">-0.3%</div>
            <div className="text-sm text-gray-400">DOW</div>
          </div>
        </div>
      </div>
    </div>
  );
};
