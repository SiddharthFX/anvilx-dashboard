import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Layers, Fuel } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  gradient?: boolean;
  trend?: string;
}

const MetricCard = ({ title, value, subtext, icon: Icon, gradient = false, trend }: MetricCardProps) => {
  return (
    <Card 
      className={`p-8 hover-glass cursor-pointer ${
        gradient ? 'glass-primary text-white border-0' : 'glass-card'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className={`h-6 w-6 ${gradient ? 'text-white/90' : 'text-primary'}`} />
        {trend && (
          <span className={`text-sm font-medium ${gradient ? 'text-white/80' : 'text-success'}`}>
            {trend}
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className={`text-sm font-medium ${gradient ? 'text-white/80' : 'text-muted-foreground'}`}>
          {title}
        </h3>
        <p className={`text-3xl font-bold font-space-grotesk ${gradient ? 'text-white' : 'text-foreground'}`}>
          {value}
        </p>
        <p className={`text-sm ${gradient ? 'text-white/70' : 'text-muted-foreground'}`}>
          {subtext}
        </p>
      </div>
    </Card>
  );
};

const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Current Block"
        value="18,429,571"
        subtext="Latest block height"
        icon={Layers}
        gradient={true}
        trend="+0.2%"
      />
      
      <MetricCard
        title="Chain ID"
        value="1"
        subtext="Ethereum Mainnet"
        icon={TrendingUp}
      />
      
      <MetricCard
        title="Accounts"
        value="10"
        subtext="Local accounts available"
        icon={Users}
      />
      
      <MetricCard
        title="Gas Price"
        value="23.4"
        subtext="Gwei average"
        icon={Fuel}
        trend="-5.2%"
      />
    </div>
  );
};

export default DashboardCards;