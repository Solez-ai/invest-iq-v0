
interface DashboardHeaderProps {
  currentTime: Date;
}

export const DashboardHeader = ({ currentTime }: DashboardHeaderProps) => {
  return (
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
  );
};
