import AnvilXNavbar from "@/components/AnvilXNavbar";
import AnvilXSidebar from "@/components/AnvilXSidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Clock, Blocks, Fuel, Users, WifiOff } from "lucide-react";
import { useState } from "react";
import { useAnvil } from "@/contexts/AnvilContext";

const BlocksPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { state } = useAnvil();

  const filteredBlocks = state.blocks.filter(block => 
    block.number.toString().includes(searchTerm) ||
    block.hash.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalBlocks: state.blocks.length,
    avgBlockTime: "12.0s",
    avgGasUsed: state.blocks.length > 0 ? 
      (state.blocks.reduce((acc, block) => acc + parseFloat(block.gasUsed), 0) / state.blocks.length).toFixed(0) : "0",
    latestBlock: state.network?.blockNumber || 0,
  };

  if (!state.isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <AnvilXNavbar />
        
        <div className="flex">
          <AnvilXSidebar />
          
          <main className="flex-1 transition-all duration-300 p-8 space-y-8" style={{ marginLeft: 'var(--sidebar-width, 256px)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold font-mono text-foreground">
                  Blocks Explorer
                </h1>
                <p className="text-muted-foreground mt-1">
                  Browse and search through Anvil blockchain blocks
                </p>
              </div>
            </div>

            <Card className="glass-card shadow-glass">
              <div className="p-12 text-center">
                <WifiOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Not connected to node</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect to view blocks data
                </p>
              </div>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AnvilXNavbar />
      
      <div className="flex">
        <AnvilXSidebar />
        
        <main className="flex-1 transition-all duration-300 p-8 space-y-8" style={{ marginLeft: 'var(--sidebar-width, 256px)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-mono text-foreground">
                Blocks Explorer
              </h1>
              <p className="text-muted-foreground mt-1">
                Browse and search through Anvil blockchain blocks
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 glass-card shadow-glass hover-lift">
              <div className="flex items-center gap-3">
                <Blocks className="h-8 w-8 icon-blue" />
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Latest Block</p>
                  <p className="text-2xl font-bold font-mono">{stats.latestBlock}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 glass-card shadow-glass hover-lift">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 icon-green" />
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Avg Block Time</p>
                  <p className="text-2xl font-bold font-mono text-foreground">{stats.avgBlockTime}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 glass-card shadow-glass hover-lift">
              <div className="flex items-center gap-3">
                <Fuel className="h-8 w-8 icon-orange" />
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Avg Gas Used</p>
                  <p className="text-2xl font-bold font-mono text-foreground">{stats.avgGasUsed} Gwei</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 glass-card shadow-glass hover-lift">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 icon-purple" />
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total Blocks</p>
                  <p className="text-2xl font-bold font-mono text-foreground">{stats.totalBlocks}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Search */}
          <Card className="p-6 glass-card shadow-glass">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by block number or hash..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                Advanced Search
              </Button>
            </div>
          </Card>

          {/* Blocks Table */}
          <Card className="glass-card shadow-glass">
            <div className="p-6 border-b border-border/50">
              <h2 className="text-xl font-semibold font-mono">Recent Blocks</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Showing {filteredBlocks.length} blocks
              </p>
            </div>
            
            <div className="overflow-x-auto">
              {filteredBlocks.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No blocks available</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead className="font-semibold text-foreground">Block</TableHead>
                      <TableHead className="font-semibold text-foreground">Timestamp</TableHead>
                      <TableHead className="font-semibold text-foreground">Transactions</TableHead>
                      <TableHead className="font-semibold text-foreground">Miner</TableHead>
                      <TableHead className="font-semibold text-foreground">Gas Used</TableHead>
                      <TableHead className="font-semibold text-foreground">Size</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBlocks.map((block) => (
                      <TableRow 
                        key={block.number} 
                        className="hover:bg-muted/50 border-border cursor-pointer transition-colors"
                      >
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-mono text-sm font-medium text-primary">
                              #{block.number}
                            </div>
                            <div className="font-mono text-xs text-muted-foreground truncate max-w-[120px]">
                              {block.hash}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(block.timestamp * 1000).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={block.txCount > 0 ? "default" : "secondary"} className="font-mono">
                            {block.txCount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs text-muted-foreground">
                            {block.miner.slice(0, 10)}...{block.miner.slice(-6)}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-mono text-sm">{parseFloat(block.gasUsed).toFixed(2)} Gwei</div>
                            <div className="text-xs text-muted-foreground">
                              of {parseFloat(block.gasLimit).toFixed(2)} Gwei
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {block.size.toLocaleString()} bytes
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default BlocksPage;