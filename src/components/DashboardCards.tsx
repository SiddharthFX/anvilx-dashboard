import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, Blocks, ArrowRightLeft, Clock, TrendingUp } from "lucide-react";
import { useAnvil } from "@/contexts/AnvilContext";

const DashboardCards = () => {
  const { state } = useAnvil();

  const formatEther = (wei: string) => {
    try {
      const value = BigInt(wei);
      const ether = Number(value) / 1e18;
      return ether.toFixed(4);
    } catch {
      return "0.0000";
    }
  };

  const cards = [
    {
      title: "Network Activity",
      value: state.isConnected ? "Active" : "Inactive",
      subtext: state.network?.chainId ? `Chain ID: ${state.network.chainId}` : "Not connected",
      icon: Activity,
      color: "icon-green",
      trend: state.isConnected ? "+100%" : "0%",
      isConnected: state.isConnected
    },
    {
      title: "Active Accounts",
      value: state.accounts.length.toString(),
      subtext: `${state.accounts.filter(acc => BigInt(acc.balance) > 0).length} with balance`,
      icon: Users,
      color: "icon-blue",
      trend: "+12%",
      isConnected: state.isConnected
    },
    {
      title: "Latest Block",
      value: state.network?.blockNumber?.toString() || "0",
      subtext: `${state.blocks.length} blocks fetched`,
      icon: Blocks,
      color: "icon-purple",
      trend: "+5.2%",
      isConnected: state.isConnected
    },
    {
      title: "Transactions",
      value: state.transactions.length.toString(),
      subtext: "Total processed",
      icon: ArrowRightLeft,
      color: "icon-orange",
      trend: "+8.1%",
      isConnected: state.isConnected
    }
  ];

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="modern-card p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Performance Overview</h2>
            <p className="text-muted-foreground text-sm">Real-time blockchain metrics</p>
          </div>
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Live
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <div key={card.title} className="glass-accent p-4 rounded-xl hover-lift" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${card.isConnected ? 'bg-hsl(var(--dashboard-accent))/10' : 'bg-gray-500/10'} flex items-center justify-center`}>
                  <card.icon className={`h-5 w-5 ${card.isConnected ? card.color : 'text-gray-500'}`} />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${card.isConnected ? 'text-green-500 bg-green-500/10' : 'text-gray-500 bg-gray-500/10'}`}>
                  {card.trend}
                </span>
              </div>
              
              <div className="space-y-1">
                <p className="text-2xl font-bold font-mono">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.title}</p>
                <p className="text-xs text-muted-foreground/80">{card.subtext}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gas Tracker */}
        <div className="modern-card p-6 animate-scale-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <h3 className="font-semibold">Gas Tracker</h3>
              <p className="text-xs text-muted-foreground">Current network fees</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Gas Price</span>
              <span className="font-mono font-semibold">
                {state.network?.gasPrice ? `${(Number(state.network.gasPrice) / 1e9).toFixed(2)} Gwei` : "0 Gwei"}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: state.network?.gasPrice ? "45%" : "0%" }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low (1 Gwei)</span>
              <span>High (50 Gwei)</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="modern-card p-6 animate-scale-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold">Recent Activity</h3>
              <p className="text-xs text-muted-foreground">Last 5 minutes</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {state.transactions.slice(0, 3).map((tx, index) => (
              <div key={tx.hash} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono truncate">{tx.hash}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatEther(tx.value)} ETH
                  </p>
                </div>
              </div>
            ))}
            
            {state.transactions.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">No recent transactions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;