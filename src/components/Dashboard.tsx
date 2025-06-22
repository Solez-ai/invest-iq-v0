
import { useState, useEffect } from 'react';
import { AssetSection } from './AssetSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from './DashboardHeader';
import { MarketStats } from './MarketStats';
import { SearchBar } from './SearchBar';
import { WatchlistSection } from './WatchlistSection';
import { MarketInsights } from './MarketInsights';

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader currentTime={currentTime} />

      {/* Market Stats */}
      <MarketStats />

      {/* Search Bar */}
      <SearchBar />

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
      <WatchlistSection />

      {/* Market Insights */}
      <MarketInsights />
    </div>
  );
};
