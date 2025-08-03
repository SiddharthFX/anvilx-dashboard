import AnvilXNavbar from "@/components/AnvilXNavbar";
import AnvilXSidebar from "@/components/AnvilXSidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ArrowRightLeft, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";

// Generate realistic Anvil transaction data
const generateTransactions = () => {
  const transactions = [];
  const accounts = [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  ];
  
  for (let i = 0; i < 25; i++) {
    const from = accounts[Math.floor(Math.random() * accounts.length)];
    let to = accounts[Math.floor(Math.random() * accounts.length)];
    while (to === from) {
      to = accounts[Math.floor(Math.random() * accounts.length)];
    }
    
    transactions.push({
      hash: `0x${Math.random().toString(16).substring(2, 18)}${"a".repeat(48)}`,
      block: Math.floor(Math.random() * 50) + 1,
      from,
      to,
      value: (Math.random() * 10).toFixed(4),
      gasUsed: Math.floor(Math.random() * 21000 + 21000),
      gasPrice: "20",
      status: Math.random() > 0.05 ? "success" : Math.random() > 0.5 ? "pending" : "failed",
      timestamp: new Date(Date.now() - Math.random() * 86400000).toLocaleString(),
      type: Math.random() > 0.7 ? "Contract Call" : "Transfer",
    });
  }
  
  return transactions.sort((a, b) => b.block - a.block);
};

const TransactionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions] = useState(generateTransactions());

  const filteredTransactions = transactions.filter(tx => 
    tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: transactions.length,
    successful: transactions.filter(tx => tx.status === "success").length,
    pending: transactions.filter(tx => tx.status === "pending").length,
    failed: transactions.filter(tx => tx.status === "failed").length,
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

  return (
    <div className="min-h-screen bg-background">
      <AnvilXNavbar />
      
      <div className="flex">
        <AnvilXSidebar />
        
        <main className="flex-1 p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-space-grotesk text-foreground">
                Transactions
              </h1>
              <p className="text-muted-foreground mt-1">
                Monitor all transactions on your Anvil node
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 gradient-card-purple text-white border-0">
              <div className="flex items-center gap-3">
                <ArrowRightLeft className="h-8 w-8 text-white/90" />
                <div>
                  <p className="text-white/80 text-sm font-medium">Total Transactions</p>
                  <p className="text-2xl font-bold font-space-grotesk">{stats.total}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-card shadow-premium">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-success" />
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Successful</p>
                  <p className="text-2xl font-bold font-space-grotesk text-foreground">{stats.successful}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-card shadow-premium">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-warning" />
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold font-space-grotesk text-foreground">{stats.pending}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-card shadow-premium">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Failed</p>
                  <p className="text-2xl font-bold font-space-grotesk text-foreground">{stats.failed}</p>
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
          <Card>
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold font-space-grotesk">Recent Transactions</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Showing {filteredTransactions.length} transactions
              </p>
            </div>
            
            <div className="overflow-x-auto">
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
                          #{tx.block}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs text-muted-foreground">
                          {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                        </code>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs text-muted-foreground">
                          {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">
                          {tx.value} ETH
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-mono text-sm">{tx.gasUsed.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">{tx.gasPrice} gwei</div>
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
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default TransactionsPage;