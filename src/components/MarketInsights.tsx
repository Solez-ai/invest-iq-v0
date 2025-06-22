
export const MarketInsights = () => {
  return (
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
  );
};
