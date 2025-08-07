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
      className="p-6 modern-card hover:shadow-premium cursor-pointer transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between mb-6">
        <div className={`p-3 rounded-xl bg-gradient-to-br from-${getIconColor().replace('icon-', '')}-100 to-${getIconColor().replace('icon-', '')}-50`}>
          <Icon className={`h-6 w-6 ${getIconColor()}`} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
            <span>↗</span>
            {trend}
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </h3>
        <p className="text-3xl font-bold text-foreground">
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
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6 modern-card border-dashed border-muted/50">
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <WifiOff className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground font-medium">Connect to Node</p>
                <p className="text-xs text-muted-foreground/70 mt-1">View real-time metrics</p>
              </div>
            </div>
          </Card>
        ))}
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