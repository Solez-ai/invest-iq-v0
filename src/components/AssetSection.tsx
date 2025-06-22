
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { StockCard } from './StockCard';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { StockQuote } from '@/utils/finnhubAPI';

interface AssetSectionProps {
  title: string;
  icon: string;
  assets: string[];
  type: string;
  showAll?: boolean;
  quotes?: Record<string, StockQuote>;
  isRealTime?: boolean;
}

export const AssetSection = ({ 
  title, 
  icon, 
  assets, 
  type, 
  showAll = false,
  quotes = {},
  isRealTime = false
}: AssetSectionProps) => {
  const [expanded, setExpanded] = useState(showAll);
  const [displayCount, setDisplayCount] = useState(showAll ? assets.length : 10);

  const visibleAssets = assets.slice(0, displayCount);

  const handleShowMore = () => {
    if (expanded) {
      setDisplayCount(10);
      setExpanded(false);
    } else {
      setDisplayCount(Math.min(displayCount + 10, assets.length));
      setExpanded(displayCount + 10 >= assets.length);
    }
  };

  const getAssetName = (symbol: string) => {
    // Convert symbols to readable names
    const nameMap: { [key: string]: string } = {
      // US Stocks
      'AAPL': 'Apple Inc.',
      'GOOGL': 'Alphabet Inc.',
      'TSLA': 'Tesla Inc.',
      'MSFT': 'Microsoft Corp.',
      'NVDA': 'NVIDIA Corp.',
      'AMZN': 'Amazon.com Inc.',
      'META': 'Meta Platforms',
      'NFLX': 'Netflix Inc.',
      'AMD': 'Advanced Micro Devices',
      'INTC': 'Intel Corp.',
      
      // Global Stocks
      'NS:RELIANCE': 'Reliance Industries',
      'NS:TCS': 'Tata Consultancy Services',
      'TSE:7203': 'Toyota Motor Corp',
      'LON:SHEL': 'Shell PLC',
      'EPA:MC': 'LVMH',
      'FRA:SAP': 'SAP SE',
      'TSE:6758': 'Sony Group Corp',
      'HKG:700': 'Tencent Holdings',
      'NS:INFY': 'Infosys Limited',
      'TSE:9984': 'SoftBank Group',
      
      // ETFs
      'SPY': 'SPDR S&P 500 ETF',
      'QQQ': 'Invesco QQQ Trust',
      'VTI': 'Vanguard Total Stock Market',
      'IWM': 'iShares Russell 2000',
      'EFA': 'iShares MSCI EAFE',
      'GLD': 'SPDR Gold Shares',
      'TLT': 'iShares 20+ Year Treasury',
      'XLF': 'Financial Select Sector',
      'XLE': 'Energy Select Sector',
      'XLK': 'Technology Select Sector',
      
      // Crypto
      'BINANCE:BTCUSDT': 'Bitcoin',
      'BINANCE:ETHUSDT': 'Ethereum',
      'BINANCE:ADAUSDT': 'Cardano',
      'BINANCE:DOTUSDT': 'Polkadot',
      'BINANCE:LINKUSDT': 'Chainlink',
      'BINANCE:LTCUSDT': 'Litecoin',
      'BINANCE:XRPUSDT': 'XRP',
      'BINANCE:BNBUSDT': 'Binance Coin',
      'BINANCE:SOLUSDT': 'Solana',
      'BINANCE:MATICUSDT': 'Polygon',
    };
    
    return nameMap[symbol] || symbol;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <span className="text-sm text-muted-foreground">({assets.length} assets)</span>
          {isRealTime && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600">Live</span>
            </div>
          )}
        </div>
        
        {!showAll && assets.length > 10 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleShowMore}
            className="border-border text-foreground hover:bg-accent"
          >
            {expanded ? (
              <>
                Show Less <ChevronUp className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {visibleAssets.map((symbol) => (
          <StockCard
            key={symbol}
            symbol={symbol}
            companyName={getAssetName(symbol)}
            assetType={type}
            quote={quotes[symbol]}
            isRealTime={isRealTime}
            onClick={() => {
              console.log(`Selected ${symbol} from ${type}`);
            }}
          />
        ))}
      </div>

      {visibleAssets.length === 0 && (
        <div className="glass-card p-8 text-center">
          <p className="text-muted-foreground">No assets available in this category</p>
        </div>
      )}
    </div>
  );
};
