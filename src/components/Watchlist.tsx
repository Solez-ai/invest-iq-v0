
import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StockCard } from './StockCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserWatchlist } from '@/hooks/useUserWatchlist';
import { useAuth } from '@/hooks/useAuth';

export const Watchlist = () => {
  const { user } = useAuth();
  const { watchlist, loading, addToWatchlist, removeFromWatchlist } = useUserWatchlist();
  const [searchTerm, setSearchTerm] = useState('');
  const [newSymbol, setNewSymbol] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const getAssetIcon = (type: string | null) => {
    switch (type) {
      case 'Common Stock': return '🇺🇸';
      case 'global': return '🌍';
      case 'ETP': return '📦';
      case 'crypto': return '₿';
      default: return '🇺🇸';
    }
  };

  const normalizeType = (type: string | null) => {
    if (!type) return 'us';
    if (type.includes('Common Stock')) return 'us';
    if (type.includes('ETP')) return 'etfs';
    if (type.includes('crypto')) return 'crypto';
    return 'global';
  };

  const filteredWatchlist = watchlist.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (stock.company_name && stock.company_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const normalizedType = normalizeType(stock.asset_type);
    const matchesFilter = activeFilter === 'all' || normalizedType === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const groupedWatchlist = filteredWatchlist.reduce((groups, stock) => {
    const type = normalizeType(stock.asset_type);
    if (!groups[type]) groups[type] = [];
    groups[type].push(stock);
    return groups;
  }, {} as Record<string, typeof watchlist>);

  const handleAddStock = async () => {
    if (newSymbol.trim()) {
      const symbol = newSymbol.toUpperCase();
      let type = 'Common Stock';
      let name = `${symbol} Inc.`;
      
      // Determine type based on symbol pattern
      if (symbol.includes(':')) {
        if (symbol.startsWith('BINANCE:')) {
          type = 'crypto';
          name = symbol.replace('BINANCE:', '').replace('USDT', '');
        } else {
          type = 'global';
        }
      } else if (['SPY', 'QQQ', 'VTI', 'IWM', 'EFA', 'GLD', 'TLT'].includes(symbol)) {
        type = 'ETP';
        name = `${symbol} ETF`;
      }
      
      const success = await addToWatchlist(symbol, name, type);
      if (success) {
        setNewSymbol('');
      }
    }
  };

  const getTypeCounts = () => {
    return {
      all: watchlist.length,
      us: watchlist.filter(s => normalizeType(s.asset_type) === 'us').length,
      global: watchlist.filter(s => normalizeType(s.asset_type) === 'global').length,
      etfs: watchlist.filter(s => normalizeType(s.asset_type) === 'etfs').length,
      crypto: watchlist.filter(s => normalizeType(s.asset_type) === 'crypto').length,
    };
  };

  const counts = getTypeCounts();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
          <p className="text-muted-foreground">Please sign in to access your watchlist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Watchlist</h1>
          <p className="text-muted-foreground">Track your favorite assets with real-time data</p>
        </div>
        <div className="glass-card p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{watchlist.length}</div>
            <div className="text-sm text-muted-foreground">Tracked Assets</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your watchlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 border-border text-foreground placeholder-muted-foreground"
            />
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add symbol (e.g., AAPL, NS:RELIANCE)"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddStock()}
              className="bg-background/50 border-border text-foreground placeholder-muted-foreground"
            />
            <Button
              onClick={handleAddStock}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
        <TabsList className="glass-card p-1 grid w-full grid-cols-5">
          <TabsTrigger value="all" className="text-foreground data-[state=active]:bg-accent">
            All ({counts.all})
          </TabsTrigger>
          <TabsTrigger value="us" className="text-foreground data-[state=active]:bg-accent">
            🇺🇸 US ({counts.us})
          </TabsTrigger>
          <TabsTrigger value="global" className="text-foreground data-[state=active]:bg-accent">
            🌍 Global ({counts.global})
          </TabsTrigger>
          <TabsTrigger value="etfs" className="text-foreground data-[state=active]:bg-accent">
            📦 ETFs ({counts.etfs})
          </TabsTrigger>
          <TabsTrigger value="crypto" className="text-foreground data-[state=active]:bg-accent">
            ₿ Crypto ({counts.crypto})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-6">
          {loading ? (
            <div className="glass-card p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your watchlist...</p>
            </div>
          ) : Object.entries(groupedWatchlist).map(([type, stocks]) => (
            <div key={type}>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <span>{getAssetIcon(type)}</span>
                {type === 'us' && 'U.S. Stocks'}
                {type === 'global' && 'Global Stocks'}
                {type === 'etfs' && 'ETFs'}
                {type === 'crypto' && 'Cryptocurrency'}
                <span className="text-sm text-muted-foreground">({stocks.length})</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {stocks.map((stock) => (
                  <div key={stock.id} className="relative group">
                    <StockCard
                      symbol={stock.symbol}
                      companyName={stock.company_name || undefined}
                      assetType={normalizeType(stock.asset_type)}
                      onClick={() => {
                        console.log(`Viewing details for ${stock.symbol}`);
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600"
                      onClick={() => removeFromWatchlist(stock.symbol)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {['us', 'global', 'etfs', 'crypto'].map((type) => (
          <TabsContent key={type} value={type} className="mt-6">
            {loading ? (
              <div className="glass-card p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your watchlist...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {groupedWatchlist[type]?.map((stock) => (
                  <div key={stock.id} className="relative group">
                    <StockCard
                      symbol={stock.symbol}
                      companyName={stock.company_name || undefined}
                      assetType={normalizeType(stock.asset_type)}
                      onClick={() => {
                        console.log(`Viewing details for ${stock.symbol}`);
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600"
                      onClick={() => removeFromWatchlist(stock.symbol)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )) || (
                  <div className="col-span-full glass-card p-8 text-center">
                    <p className="text-muted-foreground">No {type} assets in your watchlist</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* No results */}
      {!loading && filteredWatchlist.length === 0 && watchlist.length > 0 && (
        <div className="glass-card p-8 text-center">
          <p className="text-muted-foreground mb-4">No assets match your search</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setActiveFilter('all');
            }}
            className="border-border text-foreground hover:bg-accent"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Empty watchlist */}
      {!loading && watchlist.length === 0 && (
        <div className="glass-card p-8 text-center">
          <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Your watchlist is empty</h3>
          <p className="text-muted-foreground mb-4">Start by adding some stocks to track</p>
        </div>
      )}

      {/* Market Summary */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Market Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold profit">+1.2%</div>
            <div className="text-sm text-muted-foreground">S&P 500</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold profit">+0.8%</div>
            <div className="text-sm text-muted-foreground">NASDAQ</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold loss">-0.3%</div>
            <div className="text-sm text-muted-foreground">DOW</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold profit">+2.1%</div>
            <div className="text-sm text-muted-foreground">Crypto Market</div>
          </div>
        </div>
      </div>
    </div>
  );
};
