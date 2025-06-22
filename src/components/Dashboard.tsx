
import { useState, useEffect } from 'react';
import { StockCard } from './StockCard';
import { TrendingUp, DollarSign, Activity, BarChart3 } from 'lucide-react';

const watchlistStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
];

export const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back to Invest IQ
          </h1>
          <p className="text-gray-400">
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
            <div className="text-2xl font-bold text-green-400">+2.4%</div>
            <div className="text-sm text-gray-400">Portfolio Today</div>
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
                <Icon className="h-5 w-5 text-blue-400" />
                <span className={`text-sm ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">
                  {stat.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Watchlist */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Your Watchlist</h2>
          <span className="text-sm text-gray-400">Live prices • Auto-refresh</span>
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
        <h2 className="text-xl font-semibold text-white mb-4">Market Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Today's Movers</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">NVDA</span>
                <span className="text-green-400">+5.50%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">TSLA</span>
                <span className="text-green-400">+5.47%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">GOOGL</span>
                <span className="text-green-400">+0.83%</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Market Sentiment</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Overall</span>
                <span className="text-green-400 font-medium">Bullish</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Tech Sector</span>
                <span className="text-green-400 font-medium">Strong</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Volatility</span>
                <span className="text-blue-400 font-medium">Moderate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
