import AnvilXNavbar from "@/components/AnvilXNavbar";
import AnvilXSidebar from "@/components/AnvilXSidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ArrowRightLeft, CheckCircle, Clock, AlertCircle, WifiOff } from "lucide-react";
import { useState } from "react";
import { useAnvil } from "@/contexts/AnvilContext";

const TransactionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { state } = useAnvil();

  const filteredTransactions = state.transactions.filter(tx => 
    tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tx.to && tx.to.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    total: state.transactions.length,
    successful: state.transactions.filter(tx => tx.status === "success").length,
    pending: state.transactions.filter(tx => tx.status === "pending").length,
    failed: state.transactions.filter(tx => tx.status === "failed").length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
    switch (status) {
      case "success":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
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
                  Transactions
                </h1>
                <p className="text-muted-foreground mt-1">
                  Monitor all transactions on your Anvil node
                </p>
              </div>
            </div>

            <Card className="glass-card shadow-glass">
              <div className="p-12 text-center">
                <WifiOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Not connected to node</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect to view transactions data
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
                Transactions
              </h1>
              <p className="text-muted-foreground mt-1">
                Monitor all transactions on your Anvil node
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 glass-card shadow-glass hover-lift">
              <div className="flex items-center gap-3">
                <ArrowRightLeft className="h-8 w-8 icon-blue" />
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total Transactions</p>
                  <p className="text-2xl font-bold font-mono">{stats.total}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 glass-card shadow-glass hover-lift">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 icon-green" />
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Successful</p>
                  <p className="text-2xl font-bold font-mono text-foreground">{stats.successful}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 glass-card shadow-glass hover-lift">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 icon-orange" />
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold font-mono text-foreground">{stats.pending}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 glass-card shadow-glass hover-lift">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 icon-red" />
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Failed</p>
                  <p className="text-2xl font-bold font-mono text-foreground">{stats.failed}</p>
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
                  placeholder="Search by transaction hash, from, or to address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                Filter
              </Button>
            </div>
          </Card>

          {/* Transactions Table */}
          <Card className="glass-card shadow-glass">
            <div className="p-6 border-b border-border/50">
              <h2 className="text-xl font-semibold font-mono">Recent Transactions</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Showing {filteredTransactions.length} transactions
              </p>
            </div>
            
            <div className="overflow-x-auto">
              {filteredTransactions.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No transactions available</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead className="font-semibold text-foreground">Hash</TableHead>
                      <TableHead className="font-semibold text-foreground">Block</TableHead>
                      <TableHead className="font-semibold text-foreground">From</TableHead>
                      <TableHead className="font-semibold text-foreground">To</TableHead>
                      <TableHead className="font-semibold text-foreground">Value</TableHead>
                      <TableHead className="font-semibold text-foreground">Gas</TableHead>
                      <TableHead className="font-semibold text-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((tx) => (
                      <TableRow 
                        key={tx.hash} 
                        className="hover:bg-muted/50 border-border cursor-pointer transition-colors"
                      >
                        <TableCell>
                          <code className="text-xs text-primary">
                            {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            #{tx.blockNumber}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs text-muted-foreground">
                            {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                          </code>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs text-muted-foreground">
                            {tx.to ? `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}` : 'Contract Creation'}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-sm">
                            {parseFloat(tx.value).toFixed(4)} ETH
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-mono text-sm">{parseFloat(tx.gasUsed).toFixed(2)} Gwei</div>
                            <div className="text-xs text-muted-foreground">{parseFloat(tx.gasPrice).toFixed(2)} gwei</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(tx.status)}
                            <Badge variant={getStatusVariant(tx.status)} className="capitalize">
                              {tx.status}
                            </Badge>
                          </div>
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

export default TransactionsPage;