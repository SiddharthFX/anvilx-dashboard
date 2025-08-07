import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, ExternalLink, Clock, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAnvil } from "@/contexts/AnvilContext";

const BlocksTable = () => {
  const { state } = useAnvil();
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString();
  };

  return (
    <div className="modern-card animate-slide-up" style={{ animationDelay: "400ms" }}>
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Hash className="h-4 w-4 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Recent Blocks</h2>
              <p className="text-sm text-muted-foreground">
                Latest blockchain activity
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            {state.blocks.length} blocks
          </Badge>
        </div>
      </div>

      <div className="p-6">
        {!state.isConnected ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Connection</h3>
            <p className="text-muted-foreground">
              Connect to your Anvil node to view blocks
            </p>
          </div>
        ) : state.blocks.length === 0 ? (
          <div className="text-center py-12">
            <Hash className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Blocks Found</h3>
            <p className="text-muted-foreground">
              Waiting for blockchain activity...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.blocks.slice(0, 5).map((block, index) => (
              <div key={block.hash} className="glass-accent p-4 rounded-xl hover-lift">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-hsl(var(--dashboard-accent))/10 flex items-center justify-center">
                      <span className="text-[hsl(var(--dashboard-accent))] font-mono font-bold text-sm">
                        #{block.number}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono text-foreground">
                          {block.hash.slice(0, 8)}...{block.hash.slice(-6)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(block.hash, "Block hash")}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatTimestamp(block.timestamp)}</span>
                        <span>•</span>
                        <span>{state.transactions.filter(tx => tx.blockNumber === block.number).length} transactions</span>
                        <span>•</span>
                        <span>{(Number(block.gasUsed) / 1000000).toFixed(2)}M gas</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {(Number(block.gasUsed) / Number(block.gasLimit) * 100).toFixed(1)}% full
                    </Badge>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlocksTable;