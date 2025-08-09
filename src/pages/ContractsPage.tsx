import AnvilXNavbar from "@/components/AnvilXNavbar";
import AnvilXSidebar from "@/components/AnvilXSidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileCode, Eye, Copy, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAnvil } from "@/contexts/AnvilContext";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

// Real-time contracts will be discovered by scanning recent blocks


const ContractsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { state } = useAnvil();
  const isConnected = state.isConnected;
  const navigate = useNavigate();

  // Scan recent blocks for contract creation transactions
  useEffect(() => {
    const scanContracts = async () => {
      if (!state.provider || !isConnected) {
        setContracts([]);
        return;
      }
      setLoading(true);
      try {
        const provider = state.provider as ethers.JsonRpcProvider;
        const latest = await provider.getBlockNumber();
        const from = Math.max(0, latest - 249); // scan last 250 blocks
        const results: any[] = [];

        // Batch fetch blocks with transactions
        const batchSize = 10;
        for (let start = latest; start >= from; start -= batchSize) {
          const end = Math.max(from, start - batchSize + 1);
          const promises: Promise<ethers.Block | null>[] = [] as any;
          for (let b = start; b >= end; b--) {
            promises.push(provider.getBlock(b, true));
          }
          const blocks = await Promise.all(promises);
          for (const block of blocks) {
            if (!block) continue;
            const txs = block.transactions;
            for (const txHash of txs) {
              if (typeof txHash !== 'string') continue;
              const tx = await provider.getTransaction(txHash);
              if (!tx) continue;
              if (tx.to === null) {
                // Contract creation
                try {
                  const receipt = await provider.getTransactionReceipt(tx.hash);
                  if (!receipt) continue;
                  const contractAddr = receipt.contractAddress;
                  if (!contractAddr) continue;
                  // Ensure code exists
                  const code = await provider.getCode(contractAddr);
                  if (!code || code === '0x') continue;
                  results.push({
                    address: contractAddr,
                    name: 'Unknown',
                    deployer: tx.from,
                    deploymentTx: tx.hash,
                    blockNumber: receipt.blockNumber,
                    timestamp: new Date((block.timestamp || 0) * 1000).toLocaleString(),
                    verified: false,
                    type: 'Contract',
                  });
                } catch (e) {
                  console.warn('Scan error', e);
                }
              }
            }
          }
        }
        // Deduplicate by address (latest first)
        const seen = new Set<string>();
        const unique = results.filter((c) => {
          if (seen.has(c.address)) return false;
          seen.add(c.address);
          return true;
        });
        setContracts(unique);
      } catch (err) {
        console.error(err);
        toast({ title: 'Scan failed', description: err instanceof Error ? err.message : 'Unknown error', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    scanContracts();
    // re-scan when new blocks fetched by context
  }, [isConnected, state.provider, state.blocks]);

  const filteredContracts = contracts.filter(contract => 
    contract.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: contracts.length,
    verified: contracts.filter(c => c.verified).length,
    unverified: contracts.filter(c => !c.verified).length,
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AnvilXNavbar />
      
      <div className="flex">
        <AnvilXSidebar />
        
        <main className="flex-1 transition-all duration-300 p-8 space-y-8" style={{ marginLeft: 'var(--sidebar-width, 256px)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-mono text-foreground">
                Smart Contracts
              </h1>
              <p className="text-muted-foreground mt-1">
                Deployed contracts on your Anvil node
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="glass-card border-border/50"
                onClick={() => toast({ title: "Coming Soon", description: "Contract verification feature is in development" })}
              >
                <Eye className="mr-2 h-4 w-4" />
                Verify Contract
              </Button>
<Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => navigate('/playground')}
              >
                <FileCode className="mr-2 h-4 w-4" />
                Deploy Contract
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 glass-card shadow-glass hover-lift">
              <div className="flex items-center gap-3">
                <FileCode className="h-8 w-8 icon-purple" />
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total Contracts</p>
                  <p className="text-2xl font-bold font-mono text-foreground">{stats.total}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 glass-card shadow-glass hover-lift">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <span className="text-green-500 text-lg">✓</span>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Verified</p>
                  <p className="text-2xl font-bold font-mono text-foreground">{stats.verified}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 glass-card shadow-glass hover-lift">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <span className="text-orange-500 text-lg">?</span>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Unverified</p>
                  <p className="text-2xl font-bold font-mono text-foreground">{stats.unverified}</p>
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
                  placeholder="Search by contract address, name, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-accent border-border/50"
                />
              </div>
              <Button variant="outline" className="glass-accent border-border/50">
                Filter by Type
              </Button>
            </div>
          </Card>

          {!isConnected ? (
            <Card className="p-12 glass-card shadow-glass text-center">
              <FileCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Connection</h3>
              <p className="text-muted-foreground">
                Connect to your Anvil node to view deployed contracts
              </p>
            </Card>
          ) : contracts.length === 0 ? (
            <Card className="p-12 glass-card shadow-glass text-center">
              <FileCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Contracts Found</h3>
              <p className="text-muted-foreground">
                No contract deployments detected on this network
              </p>
            </Card>
          ) : (
            /* Contracts Table */
            <Card className="glass-card shadow-glass">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold font-mono">Deployed Contracts</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Showing {filteredContracts.length} contracts
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="font-semibold text-foreground">Contract</TableHead>
                    <TableHead className="font-semibold text-foreground">Address</TableHead>
                    <TableHead className="font-semibold text-foreground">Type</TableHead>
                    <TableHead className="font-semibold text-foreground">Deployer</TableHead>
                    <TableHead className="font-semibold text-foreground">Block</TableHead>
                    <TableHead className="font-semibold text-foreground">Status</TableHead>
                    <TableHead className="font-semibold text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => (
                    <TableRow 
                      key={contract.address} 
                      className="hover:bg-muted/50 border-border transition-colors"
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold text-foreground">{contract.name}</div>
                          <div className="text-xs text-muted-foreground">{contract.timestamp}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-primary">
                            {contract.address.slice(0, 6)}...{contract.address.slice(-4)}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(contract.address, "Contract address")}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {contract.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs text-muted-foreground">
                          {contract.deployer.slice(0, 6)}...{contract.deployer.slice(-4)}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          #{contract.blockNumber}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={contract.verified ? "default" : "secondary"}>
                          {contract.verified ? "Verified" : "Unverified"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default ContractsPage;