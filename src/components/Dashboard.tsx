
import { useState, useEffect } from 'react';
import { StockCard } from './StockCard';
import { AssetSection } from './AssetSection';
import { TrendingUp, DollarSign, Activity, BarChart3, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { finnhubAPI } from '@/utils/finnhubAPI';

const watchlistStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
];

const assetCategories = {
  us: {
    title: 'U.S. Stocks',
    icon: '🇺🇸',
    assets: ['AAPL', 'GOOGL', 'TSLA', 'MSFT', 'NVDA', 'AMZN', 'META', 'NFLX', 'AMD', 'INTC']
  },
  global: {
    title: 'Global Stocks',
    icon: '🌍',
    assets: ['NS:RELIANCE', 'NS:TCS', 'TSE:7203', 'LON:SHEL', 'EPA:MC', 'FRA:SAP', 'TSE:6758', 'HKG:700', 'NS:INFY', 'TSE:9984']
  },
  etfs: {
    title: 'ETFs',
    icon: '📦',
    assets: ['SPY', 'QQQ', 'VTI', 'IWM', 'EFA', 'GLD', 'TLT', 'XLF', 'XLE', 'XLK']
  },
  crypto: {
    title: 'Cryptocurrency',
    icon: '₿',
    assets: ['BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 'BINANCE:ADAUSDT', 'BINANCE:DOTUSDT', 'BINANCE:LINKUSDT', 'BINANCE:LTCUSDT', 'BINANCE:XRPUSDT', 'BINANCE:BNBUSDT', 'BINANCE:SOLUSDT', 'BINANCE:MATICUSDT']
  }
};

export const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    try {
      const results = await finnhubAPI.searchSymbols(query);
      setSearchResults(results.slice(0, 10));
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  const marketStats = [
    {
      title: 'Portfolio Value',
      value: '$127,450.32',
      change: '+2.4%',
      positive: true,
      icon: DollarSign,
    },
    {
      title: 'Today\'s P&L',
      value: '+$2,847.60',
      change: '+1.8%',
      positive: true,
      icon: TrendingUp,
    },
    {
      title: 'Active Positions',
      value: '12',
      change: '+2 new',
      positive: true,
      icon: Activity,
    },
    {
      title: 'Market Status',
      value: 'OPEN',
      change: 'NYSE',
      positive: true,
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back to Invest IQ
          </h1>
          <p className="text-muted-foreground">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} • {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="glass-card p-4">
          <div className="text-center">
            <div className="text-2xl font-bold profit">+2.4%</div>
            <div className="text-sm text-muted-foreground">Portfolio Today</div>
          </div>
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon className="h-5 w-5 text-primary" />
                <span className={`text-sm ${stat.positive ? 'profit' : 'loss'}`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stocks, ETFs, crypto..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch(e.target.value);
            }}
            className="pl-10 bg-background/50 border-border text-foreground placeholder-muted-foreground"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-lg border border-border z-10 max-h-60 overflow-y-auto">
              {searchResults.map((result: any, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                  onClick={() => {
                    setSearchTerm('');
                    setSearchResults([]);
                  }}
                >
                  <div className="text-foreground font-medium">{result.symbol}</div>
                  <div className="text-muted-foreground text-sm">{result.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass-card p-1 grid w-full grid-cols-5">
          <TabsTrigger value="all" className="text-foreground data-[state=active]:bg-accent">All</TabsTrigger>
          <TabsTrigger value="us" className="text-foreground data-[state=active]:bg-accent">🇺🇸 US</TabsTrigger>
          <TabsTrigger value="global" className="text-foreground data-[state=active]:bg-accent">🌍 Global</TabsTrigger>
          <TabsTrigger value="etfs" className="text-foreground data-[state=active]:bg-accent">📦 ETFs</TabsTrigger>
          <TabsTrigger value="crypto" className="text-foreground data-[state=active]:bg-accent">₿ Crypto</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-8">
          {Object.entries(assetCategories).map(([key, category]) => (
            <AssetSection
              key={key}
              title={category.title}
              icon={category.icon}
              assets={category.assets}
              type={key}
            />
          ))}
        </TabsContent>

        {Object.entries(assetCategories).map(([key, category]) => (
          <TabsContent key={key} value={key} className="mt-6">
            <AssetSection
              title={category.title}
              icon={category.icon}
              assets={category.assets}
              type={key}
              showAll={true}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Your Watchlist */}
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

      {/* Market Insights */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Market Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">Today's Movers</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">NVDA</span>
                <span className="profit">+5.50%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">TSLA</span>
                <span className="profit">+5.47%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">GOOGL</span>
                <span className="profit">+0.83%</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">Market Sentiment</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Overall</span>
                <span className="profit font-medium">Bullish</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tech Sector</span>
                <span className="profit font-medium">Strong</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Volatility</span>
                <span className="neutral font-medium">Moderate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
