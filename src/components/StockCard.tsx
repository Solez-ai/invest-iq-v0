
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { finnhubAPI, type StockQuote } from '@/utils/finnhubAPI';
import { cn } from '@/lib/utils';

interface StockCardProps {
  symbol: string;
  companyName?: string;
  onClick?: () => void;
}

export const StockCard = ({ symbol, companyName, onClick }: StockCardProps) => {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        // For demo, use mock data
        const data = finnhubAPI.getMockQuote(symbol);
        setQuote(data);
      } catch (error) {
        console.error('Error fetching quote:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchQuote, 30000);
    return () => clearInterval(interval);
  }, [symbol]);

  if (loading) {
    return (
      <div className="glass-card p-4 animate-pulse">
        <div className="h-4 bg-white/20 rounded mb-2"></div>
        <div className="h-6 bg-white/20 rounded mb-1"></div>
        <div className="h-4 bg-white/20 rounded w-20"></div>
      </div>
    );
  }

  if (!quote) return null;

  const isPositive = quote.dp >= 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const glowClass = isPositive ? 'glow-green' : 'glow-red';

  return (
    <div 
      className={cn(
        "glass-card p-4 cursor-pointer transition-all duration-200 hover:scale-105",
        glowClass
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg text-white">{symbol}</h3>
          {companyName && (
            <p className="text-sm text-gray-400 truncate">{companyName}</p>
          )}
        </div>
        <div className={cn("flex items-center", changeColor)}>
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-white">
            ${quote.c.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className={changeColor}>
            {isPositive ? '+' : ''}{quote.d.toFixed(2)}
          </span>
          <span className={changeColor}>
            {isPositive ? '+' : ''}{quote.dp.toFixed(2)}%
          </span>
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>H: ${quote.h.toFixed(2)}</span>
          <span>L: ${quote.l.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
