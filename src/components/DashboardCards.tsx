import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Layers, Fuel, WifiOff } from "lucide-react";
import { useAnvil } from "@/contexts/AnvilContext";

interface MetricCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  gradient?: boolean;
  trend?: string;
}

const MetricCard = ({ title, value, subtext, icon: Icon, gradient = false, trend }: MetricCardProps) => {
  const getIconColor = () => {
    switch (title) {
      case 'Current Block': return 'icon-blue';
      case 'Chain ID': return 'icon-green';
      case 'Accounts': return 'icon-purple';
      case 'Gas Price': return 'icon-orange';
      default: return 'icon-teal';
    }
  };

  return (
    <Card 
      className="p-6 glass-card shadow-glass hover-lift cursor-pointer transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className={`h-6 w-6 ${getIconColor()}`} />
        {trend && (
          <span className="text-sm font-medium text-[hsl(var(--status-online))]">
            {trend}
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          {title}
        </h3>
        <p className="text-3xl font-bold font-mono text-foreground">
          {value}
        </p>
        <p className="text-sm text-muted-foreground">
          {subtext}
        </p>
      </div>
    </Card>
  );
};

const DashboardCards = () => {
  const { state } = useAnvil();

  if (!state.isConnected) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 glass-card border-dashed border-muted/30">
          <div className="flex items-center justify-center h-24">
            <div className="text-center">
              <WifiOff className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Not connected</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 glass-card border-dashed border-muted/30">
          <div className="flex items-center justify-center h-24">
            <p className="text-sm text-muted-foreground">Connect to view metrics</p>
          </div>
        </Card>
        <Card className="p-6 glass-card border-dashed border-muted/30">
          <div className="flex items-center justify-center h-24">
            <p className="text-sm text-muted-foreground">Connect to view metrics</p>
          </div>
        </Card>
        <Card className="p-6 glass-card border-dashed border-muted/30">
          <div className="flex items-center justify-center h-24">
            <p className="text-sm text-muted-foreground">Connect to view metrics</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Current Block"
        value={state.network?.blockNumber.toLocaleString() || "0"}
        subtext="Latest block height"
        icon={Layers}
        gradient={true}
      />
      
      <MetricCard
        title="Chain ID"
        value={state.network?.chainId.toString() || "31337"}
        subtext={state.network?.name || "Anvil Local"}
        icon={TrendingUp}
      />
      
      <MetricCard
        title="Accounts"
        value={state.accounts.length.toString()}
        subtext="Pre-funded accounts"
        icon={Users}
      />
      
      <MetricCard
        title="Gas Price"
        value={parseFloat(state.network?.gasPrice || "0").toFixed(1)}
        subtext="Gwei average"
        icon={Fuel}
      />
    </div>
  );
};

export default DashboardCards;