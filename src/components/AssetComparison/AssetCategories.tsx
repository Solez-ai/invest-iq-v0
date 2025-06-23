
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';

interface AssetCategory {
  label: string;
  icon: string;
  assets: string[];
}

interface AssetCategoriesProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  filteredAssets: { [key: string]: AssetCategory };
  getAssetName: (symbol: string) => string;
  handleDragStart: (e: React.DragEvent, symbol: string, type: string) => void;
}

const assetCategories = {
  us: {
    label: 'US Stocks',
    icon: '🇺🇸',
    assets: ['AAPL', 'GOOGL', 'TSLA', 'MSFT', 'NVDA', 'AMZN', 'META', 'NFLX']
  },
  global: {
    label: 'Global Stocks',
    icon: '🌍',
    assets: ['NS:RELIANCE', 'NS:TCS', 'TSE:7203', 'LON:SHEL', 'EPA:MC']
  },
  etfs: {
    label: 'ETFs',
    icon: '📦',
    assets: ['SPY', 'QQQ', 'VTI', 'IWM', 'EFA', 'GLD', 'TLT']
  },
  crypto: {
    label: 'Cryptocurrency',
    icon: '₿',
    assets: ['BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 'BINANCE:ADAUSDT']
  }
};

export const AssetCategories = ({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  filteredAssets,
  getAssetName,
  handleDragStart
}: AssetCategoriesProps) => {
  return (
    <div className="glass-card p-4">
      <h2 className="text-lg font-semibold text-foreground mb-4">Select Assets</h2>
      
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-background/50 border-border"
        />
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-4 mb-4">
          {Object.entries(assetCategories).map(([key, category]) => (
            <TabsTrigger key={key} value={key} className="text-xs">
              {category.icon}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(filteredAssets).map(([key, category]) => (
          <TabsContent key={key} value={key}>
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
              {category.assets.map((symbol) => (
                <div
                  key={symbol}
                  draggable
                  onDragStart={(e) => handleDragStart(e, symbol, key)}
                  className="glass-card p-3 cursor-grab hover:scale-105 transition-transform active:cursor-grabbing"
                >
                  <div className="text-sm font-medium text-foreground">{symbol}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {getAssetName(symbol)}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export { assetCategories };
