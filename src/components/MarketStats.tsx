
import { TrendingUp, DollarSign, Activity, BarChart3 } from 'lucide-react';

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

export const MarketStats = () => {
  return (
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
  );
};
