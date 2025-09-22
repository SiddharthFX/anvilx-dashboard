import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, WifiOff, RefreshCw } from "lucide-react";
import { useAnvil } from "@/contexts/AnvilContext";
import { useNavigate } from "react-router-dom";

const formatTimestamp = (timestamp: number) => {
  const now = Date.now() / 1000;
  const diff = now - timestamp;
  
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const BlocksTable = () => {
  const { state, refreshData } = useAnvil();
  const navigate = useNavigate();

  const handleViewAllBlocks = () => {
    navigate('/blocks');
  };

  const handleRefresh = () => {
    refreshData();
  };

  if (!state.isConnected) {
    return (
      <Card className="glass-card shadow-glass">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold font-mono text-foreground">
                Latest Blocks
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Recent blocks on your node
              </p>
            </div>
          </div>
        </div>
        <div className="p-12 text-center">
          <WifiOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Not connected to node</p>
          <p className="text-sm text-muted-foreground mt-1">
            Connect to view blocks
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card shadow-glass hover-lift">
      <div className="p-4 sm:p-6 border-b border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold font-mono text-foreground">
              Latest Blocks
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Recent blocks on your node
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleViewAllBlocks} className="hidden sm:flex">
              View All Blocks
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleViewAllBlocks} className="sm:hidden">
              View All
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {state.blocks.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No blocks available</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2 sm:p-4 text-xs sm:text-sm font-medium text-muted-foreground">Block</th>
                <th className="text-left p-2 sm:p-4 text-xs sm:text-sm font-medium text-muted-foreground hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Age
                  </div>
                </th>
                <th className="text-left p-2 sm:p-4 text-xs sm:text-sm font-medium text-muted-foreground">Txns</th>
                <th className="text-left p-2 sm:p-4 text-xs sm:text-sm font-medium text-muted-foreground hidden lg:table-cell">Miner</th>
                <th className="text-left p-2 sm:p-4 text-xs sm:text-sm font-medium text-muted-foreground hidden md:table-cell">Gas Used</th>
                <th className="text-left p-2 sm:p-4 text-xs sm:text-sm font-medium text-muted-foreground hidden xl:table-cell">Hash</th>
              </tr>
            </thead>
            <tbody>
              {state.blocks.slice(0, 5).map((block) => (
                <tr 
                  key={block.number} 
                  className="border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/blocks`)}
                >
                  <td className="p-2 sm:p-4">
                    <div className="font-mono text-xs sm:text-sm font-medium text-primary">
                      #{block.number.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-2 sm:p-4 hidden sm:table-cell">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {formatTimestamp(block.timestamp)}
                    </span>
                  </td>
                  <td className="p-2 sm:p-4">
                    <span className="text-xs sm:text-sm font-medium">{block.txCount}</span>
                  </td>
                  <td className="p-2 sm:p-4 hidden lg:table-cell">
                    <span className="font-mono text-xs sm:text-sm text-muted-foreground">
                      {block.miner.slice(0, 10)}...{block.miner.slice(-6)}
                    </span>
                  </td>
                  <td className="p-2 sm:p-4 hidden md:table-cell">
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-medium">{parseFloat(block.gasUsed).toFixed(2)} Gwei</span>
                      <span className="text-xs text-muted-foreground">of {parseFloat(block.gasLimit).toFixed(2)} Gwei</span>
                    </div>
                  </td>
                  <td className="p-2 sm:p-4 hidden xl:table-cell">
                    <span className="font-mono text-xs sm:text-sm text-muted-foreground">
                      {block.hash.slice(0, 10)}...{block.hash.slice(-6)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
};

export default BlocksTable;