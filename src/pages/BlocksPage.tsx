import AnvilXNavbar from "@/components/AnvilXNavbar";
import AnvilXSidebar from "@/components/AnvilXSidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Clock, Blocks, Fuel, Users } from "lucide-react";
import { useState } from "react";

// Generate realistic Anvil block data
const generateBlocks = () => {
  const blocks = [];
  const baseTimestamp = Date.now();
  
  for (let i = 50; i >= 1; i--) {
    blocks.push({
      number: i,
      hash: `0x${Math.random().toString(16).substring(2, 18)}${"a".repeat(48)}`,
      timestamp: new Date(baseTimestamp - (i * 12000)).toLocaleString(),
      miner: "0x0000000000000000000000000000000000000000",
      txCount: Math.floor(Math.random() * 5),
      gasUsed: (Math.random() * 21000 + 21000).toFixed(0),
      gasLimit: "30000000",
      size: (Math.random() * 1000 + 500).toFixed(0),
    });
  }
  
  return blocks.reverse();
};

const BlocksPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [blocks] = useState(generateBlocks());

  const filteredBlocks = blocks.filter(block => 
    block.number.toString().includes(searchTerm) ||
    block.hash.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalBlocks: blocks.length,
    avgBlockTime: "12.0s",
    avgGasUsed: "15,432",
    latestBlock: blocks[blocks.length - 1]?.number || 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <AnvilXNavbar />
      
      <div className="flex">
        <AnvilXSidebar />
        
        <main className="flex-1 p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-space-grotesk text-foreground">
                Blocks Explorer
              </h1>
              <p className="text-muted-foreground mt-1">
                Browse and search through Anvil blockchain blocks
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 gradient-card-purple text-white border-0">
              <div className="flex items-center gap-3">
                <Blocks className="h-8 w-8 text-white/90" />
                <div>
                  <p className="text-white/80 text-sm font-medium">Latest Block</p>
                  <p className="text-2xl font-bold font-space-grotesk">{stats.latestBlock}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-card shadow-premium">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Avg Block Time</p>
                  <p className="text-2xl font-bold font-space-grotesk text-foreground">{stats.avgBlockTime}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-card shadow-premium">
              <div className="flex items-center gap-3">
                <Fuel className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Avg Gas Used</p>
                  <p className="text-2xl font-bold font-space-grotesk text-foreground">{stats.avgGasUsed}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-card shadow-premium">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total Blocks</p>
                  <p className="text-2xl font-bold font-space-grotesk text-foreground">{stats.totalBlocks}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Search */}
          <Card className="p-6">
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
          <Card>
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold font-space-grotesk">Recent Blocks</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Showing {filteredBlocks.length} blocks
              </p>
            </div>
            
            <div className="overflow-x-auto">
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
                        {block.timestamp}
                      </TableCell>
                      <TableCell>
                        <Badge variant={block.txCount > 0 ? "default" : "secondary"} className="font-mono">
                          {block.txCount}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs text-muted-foreground">
                          {block.miner.slice(0, 10)}...
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-mono text-sm">{parseInt(block.gasUsed).toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {((parseInt(block.gasUsed) / parseInt(block.gasLimit)) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {parseInt(block.size).toLocaleString()} bytes
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default BlocksPage;