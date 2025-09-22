import AnvilXNavbar from "@/components/AnvilXNavbar";
import AnvilXSidebar from "@/components/AnvilXSidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Search, FileCode, Eye, Copy, ExternalLink, Code, Zap, Hash, Calendar, User, Database, Settings, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAnvil } from "@/contexts/AnvilContext";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

// Real-time contracts will be discovered by scanning recent blocks

interface ContractDetails {
  address: string;
  name: string;
  deployer: string;
  deploymentTx: string;
  blockNumber: number;
  timestamp: string;
  verified: boolean;
  type: string;
  bytecode: string;
  gasUsed: string;
  gasPrice: string;
  gasLimit: string;
  txFee: string;
  txFeeUSD: string;
  nonce: number;
  inputData: string;
  contractSize: number;
  constructorArgs: string;
  events: any[];
  balance: string;
  txCount: number;
  // Additional developer details
  storageRoot: string;
  codeHash: string;
  isContract: boolean;
  deploymentCost: string;
  gasEfficiency: number;
  optimizationLevel: string;
  compilerVersion: string;
  sourceCode: string;
  abi: any[];
  verifiedSource: string;
}

const ContractsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contracts, setContracts] = useState<ContractDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ContractDetails | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [verifyAddress, setVerifyAddress] = useState("");
  const [verifyName, setVerifyName] = useState("");
  const [verifyAbi, setVerifyAbi] = useState("");
  const [verifySource, setVerifySource] = useState("");
  const [verifyCompiler, setVerifyCompiler] = useState("Solidity 0.8.x");
  const [verifyOptimization, setVerifyOptimization] = useState(true);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Debug logging for state changes
  useEffect(() => {
    console.log('Modal state changed:', { isDetailsOpen, selectedContract: !!selectedContract, detailsLoading });
  }, [isDetailsOpen, selectedContract, detailsLoading]);
  const { toast } = useToast();
  const { state } = useAnvil();
  const isConnected = state.isConnected;
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Deployed Contracts | AnvilX";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      const m = document.createElement('meta');
      m.name = 'description';
      m.content = 'View deployed smart contracts on your local Anvil blockchain node.';
      document.head.appendChild(m);
    } else {
      metaDesc.setAttribute('content', 'View deployed smart contracts on your local Anvil blockchain node.');
    }
    const link = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', window.location.origin + '/contracts');
    if (!link.parentElement) document.head.appendChild(link);
  }, []);

  // Enhanced contract scanning with detailed information
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
        const results: ContractDetails[] = [];

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

                  // Calculate gas costs
                  const gasUsed = receipt.gasUsed?.toString() || '0';
                  const gasPrice = tx.gasPrice?.toString() || '0';
                  const gasLimit = tx.gasLimit?.toString() || '0';
                  const txFee = ethers.formatEther(BigInt(gasUsed) * BigInt(gasPrice));
                  
                  // Get contract balance and transaction count
                  const balance = await provider.getBalance(contractAddr);
                  const txCount = await provider.getTransactionCount(contractAddr);
                  
                  // Calculate additional developer metrics
                  const deploymentCost = txFee;
                  const gasEfficiency = parseFloat(gasUsed) / parseFloat(gasLimit) * 100;
                  const codeHash = ethers.keccak256(code);
                  
                  // Try to detect compiler version and optimization from bytecode
                  const compilerVersion = detectCompilerVersion(code);
                  const optimizationLevel = detectOptimizationLevel(code);

                  results.push({
                    address: contractAddr,
                    name: 'Unknown',
                    deployer: tx.from,
                    deploymentTx: tx.hash,
                    blockNumber: receipt.blockNumber,
                    timestamp: new Date((block.timestamp || 0) * 1000).toLocaleString(),
                    verified: false,
                    type: 'Contract',
                    bytecode: code,
                    gasUsed: gasUsed,
                    gasPrice: gasPrice,
                    gasLimit: gasLimit,
                    txFee: txFee,
                    txFeeUSD: '0', // Would need price API
                    nonce: tx.nonce,
                    inputData: tx.data || '0x',
                    contractSize: Math.ceil(code.length / 2), // Approximate size in bytes
                    constructorArgs: tx.data || '0x',
                    events: receipt.logs || [],
                    balance: ethers.formatEther(balance),
                    txCount: txCount,
                    // Additional developer details
                    storageRoot: receipt.logsBloom || '0x',
                    codeHash: codeHash,
                    isContract: true,
                    deploymentCost: deploymentCost,
                    gasEfficiency: gasEfficiency,
                    optimizationLevel: optimizationLevel,
                    compilerVersion: compilerVersion,
                    sourceCode: '',
                    abi: [],
                    verifiedSource: '',
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
        let unique = results.filter((c) => {
          if (seen.has(c.address)) return false;
          seen.add(c.address);
          return true;
        });
        // Apply stored verifications from localStorage
        try {
          const storedStr = localStorage.getItem('verifiedContracts');
          if (storedStr) {
            const saved = JSON.parse(storedStr || '{}');
            unique = unique.map((c) => {
              const meta = saved[c.address];
              if (meta) {
                return {
                  ...c,
                  verified: true,
                  name: meta.name || c.name,
                  abi: Array.isArray(meta.abi) ? meta.abi : [],
                  sourceCode: meta.source || c.sourceCode,
                  compilerVersion: meta.compiler || c.compilerVersion,
                  optimizationLevel: meta.optimization ? 'Optimized' : c.optimizationLevel,
                } as any;
              }
              return c;
            });
          }
        } catch {}
        console.log('Found contracts:', unique.length, unique);
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

  const openContractDetails = async (contract: ContractDetails) => {
    console.log('Opening contract details for:', contract.address);
    setSelectedContract(contract);
    setIsDetailsOpen(true);
    setDetailsLoading(true);
    
    try {
      // Fetch additional real-time data
      if (state.provider) {
        const provider = state.provider as ethers.JsonRpcProvider;
        const [balance, txCount, code] = await Promise.all([
          provider.getBalance(contract.address),
          provider.getTransactionCount(contract.address),
          provider.getCode(contract.address)
        ]);
        
        setSelectedContract(prev => prev ? {
          ...prev,
          balance: ethers.formatEther(balance),
          txCount: txCount,
          bytecode: code
        } : null);
      }
    } catch (error) {
      console.error('Error fetching contract details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contract details",
        variant: "destructive"
      });
    } finally {
      setDetailsLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatGasPrice = (gasPrice: string) => {
    const gwei = ethers.formatUnits(gasPrice, 'gwei');
    return `${parseFloat(gwei).toFixed(2)} Gwei`;
  };

  const openVerifyModal = () => {
    const defaultContract = contracts.find((c) => !c.verified) || contracts[0];
    setVerifyAddress(defaultContract?.address || "");
    setVerifyName(defaultContract?.name || "");
    setVerifyAbi("");
    setVerifySource("");
    setVerifyCompiler(detectCompilerVersion(defaultContract?.bytecode || "") || "Solidity 0.8.x");
    setVerifyOptimization(true);
    setVerifyError(null);
    setIsVerifyOpen(true);
  };

  const handleVerifySave = () => {
    try {
      setVerifyError(null);
      if (!verifyAddress) throw new Error('Please select a contract address');
      let abiParsed: any[] = [];
      if (verifyAbi.trim().length > 0) {
        abiParsed = JSON.parse(verifyAbi);
        if (!Array.isArray(abiParsed)) throw new Error('ABI must be a JSON array');
      }
      const storeRaw = localStorage.getItem('verifiedContracts');
      const store = storeRaw ? JSON.parse(storeRaw) : {};
      store[verifyAddress] = {
        name: verifyName,
        abi: abiParsed,
        source: verifySource,
        compiler: verifyCompiler,
        optimization: verifyOptimization,
        timestamp: Date.now(),
      };
      localStorage.setItem('verifiedContracts', JSON.stringify(store));

      setContracts((prev) => prev.map((c) => c.address === verifyAddress ? {
        ...c,
        verified: true,
        name: verifyName || c.name,
        abi: abiParsed,
        sourceCode: verifySource,
        compilerVersion: verifyCompiler,
        optimizationLevel: verifyOptimization ? 'Optimized' : c.optimizationLevel,
      } : c));

      setSelectedContract((prev) => prev && prev.address === verifyAddress ? {
        ...prev,
        verified: true,
        name: verifyName || prev.name,
        abi: [] as any[],
        sourceCode: verifySource,
        compilerVersion: verifyCompiler,
        optimizationLevel: verifyOptimization ? 'Optimized' : prev.optimizationLevel,
      } : prev);

      toast({ title: 'Verified', description: 'Contract marked as verified locally.' });
      setIsVerifyOpen(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Verification failed';
      setVerifyError(msg);
      toast({ title: 'Verification error', description: msg, variant: 'destructive' });
    }
  };

  // Helper functions for contract analysis
  const detectCompilerVersion = (bytecode: string): string => {
    // This is a simplified detection - in a real implementation you'd use more sophisticated analysis
    if (bytecode.includes('6080604052')) {
      return 'Solidity 0.8.x';
    } else if (bytecode.includes('6060604052')) {
      return 'Solidity 0.7.x';
    } else if (bytecode.includes('6060604052')) {
      return 'Solidity 0.6.x';
    }
    return 'Unknown';
  };

  const detectOptimizationLevel = (bytecode: string): string => {
    // Simplified optimization detection based on bytecode patterns
    const size = bytecode.length / 2;
    if (size < 1000) return 'High';
    if (size < 5000) return 'Medium';
    return 'Low';
  };

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.3);
        }

        /* Horizontal no-scrollbar utility */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
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
                onClick={openVerifyModal}
              >
                <Eye className="mr-2 h-4 w-4" />
                Verify Contract
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
              <p className="text-muted-foreground mb-4">
                No contract deployments detected on this network
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  const testContract: ContractDetails = {
                    address: '0x1234567890123456789012345678901234567890',
                    name: 'Test Contract',
                    deployer: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
                    deploymentTx: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd',
                    blockNumber: 12345,
                    timestamp: new Date().toLocaleString(),
                    verified: false,
                    type: 'Contract',
                    bytecode: '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220f8b42a4e3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b64736f6c63430008110033',
                    gasUsed: '100000',
                    gasPrice: '20000000000',
                    gasLimit: '200000',
                    txFee: '0.002',
                    txFeeUSD: '0',
                    nonce: 0,
                    inputData: '0x',
                    contractSize: 1000,
                    constructorArgs: '0x',
                    events: [],
                    balance: '0.1',
                    txCount: 1,
                    storageRoot: '0x',
                    codeHash: '0x',
                    isContract: true,
                    deploymentCost: '0.002',
                    gasEfficiency: 50,
                    optimizationLevel: 'Medium',
                    compilerVersion: 'Solidity 0.8.x',
                    sourceCode: '',
                    abi: [],
                    verifiedSource: '',
                  };
                  openContractDetails(testContract);
                }}
              >
                <FileCode className="mr-2 h-4 w-4" />
                Test Contract Modal
              </Button>
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
                        {contract.verified ? (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 inline-flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                            Unverified
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors"
                          onClick={() => {
                            console.log('Button clicked for contract:', contract.address);
                            openContractDetails(contract);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            </Card>
          )}

          {/* Contract Details Modal */}
          <Dialog open={isDetailsOpen} onOpenChange={(open) => {
            console.log('Dialog onOpenChange:', open);
            setIsDetailsOpen(open);
            if (!open) {
              setSelectedContract(null);
              setDetailsLoading(false);
            }
          }}>
            <DialogContent className="max-w-4xl h-[85vh] max-h-[90vh] overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 border-0 shadow-2xl backdrop-blur-sm flex flex-col px-4 sm:px-6">
              <DialogHeader className="border-b border-border/50 pb-4 mb-6 flex-shrink-0">
                <DialogTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileCode className="h-6 w-6 text-primary" />
                  </div>
                  Contract Details
                </DialogTitle>
              </DialogHeader>
              
              {detailsLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto mb-6"></div>
                      <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-2 border-primary/30"></div>
                    </div>
                    <p className="text-muted-foreground font-medium">Loading contract details...</p>
                    <p className="text-xs text-muted-foreground mt-2">Fetching real-time data</p>
                  </div>
                </div>
              ) : selectedContract ? (
                 <Tabs defaultValue="overview" className="w-full flex flex-col h-full min-h-0">
                   <div className="flex-shrink-0 mb-4 overflow-x-auto no-scrollbar">
                     <TabsList className="inline-flex min-w-full bg-muted/30 p-1 rounded-xl border border-border/50 gap-1">
                       <TabsTrigger value="overview" className="px-3 sm:px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-lg transition-all whitespace-nowrap">Overview</TabsTrigger>
                       <TabsTrigger value="code" className="px-3 sm:px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-lg transition-all whitespace-nowrap">Code</TabsTrigger>
                       <TabsTrigger value="analytics" className="px-3 sm:px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-lg transition-all whitespace-nowrap">Analytics</TabsTrigger>
                       <TabsTrigger value="transactions" className="px-3 sm:px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-lg transition-all whitespace-nowrap">Transactions</TabsTrigger>
                       <TabsTrigger value="events" className="px-3 sm:px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-lg transition-all whitespace-nowrap">Events</TabsTrigger>
                     </TabsList>
                   </div>
                  
                   <TabsContent value="overview" className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar min-h-0">
                     {/* Basic Information */}
                     <Card className="p-6 bg-gradient-to-br from-background to-muted/20 border border-border/50 shadow-lg">
                       <h3 className="text-lg font-semibold mb-6 flex items-center gap-3 text-primary">
                         <div className="p-2 rounded-lg bg-primary/10">
                           <Hash className="h-4 w-4" />
                         </div>
                         Contract Information
                       </h3>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-4">
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Contract Address</label>
                              <div className="flex items-center gap-2 min-w-0">
                                <code className="text-sm bg-muted px-3 py-2 rounded-md font-mono truncate flex-1">
                                 {selectedContract.address}
                               </code>
                               <Button
                                 size="sm"
                                 variant="ghost"
                                 onClick={() => copyToClipboard(selectedContract.address, "Contract address")}
                                 className="h-8 w-8 p-0 flex-shrink-0 hover:bg-primary/10"
                               >
                                 <Copy className="h-4 w-4" />
                               </Button>
                             </div>
                           </div>
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Deployer</label>
                              <div className="flex items-center gap-2 min-w-0">
                                <code className="text-sm bg-muted px-3 py-2 rounded-md font-mono truncate flex-1">
                                 {selectedContract.deployer}
                               </code>
                               <Button
                                 size="sm"
                                 variant="ghost"
                                 onClick={() => copyToClipboard(selectedContract.deployer, "Deployer address")}
                                 className="h-8 w-8 p-0 flex-shrink-0 hover:bg-primary/10"
                               >
                                 <Copy className="h-4 w-4" />
                               </Button>
                             </div>
                           </div>
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Block Number</label>
                             <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">#{selectedContract.blockNumber}</p>
                           </div>
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Contract Balance</label>
                             <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">{selectedContract.balance} ETH</p>
                           </div>
                         </div>
                         <div className="space-y-4">
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Contract Name</label>
                             <p className="text-sm bg-muted px-3 py-2 rounded-md">{selectedContract.name}</p>
                           </div>
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Deployment Transaction</label>
                              <div className="flex items-center gap-2 min-w-0">
                                <code className="text-sm bg-muted px-3 py-2 rounded-md font-mono truncate flex-1">
                                 {selectedContract.deploymentTx}
                               </code>
                               <Button
                                 size="sm"
                                 variant="ghost"
                                 onClick={() => copyToClipboard(selectedContract.deploymentTx, "Deployment transaction")}
                                 className="h-8 w-8 p-0 flex-shrink-0 hover:bg-primary/10"
                               >
                                 <Copy className="h-4 w-4" />
                               </Button>
                             </div>
                           </div>
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Deployment Time</label>
                             <p className="text-sm bg-muted px-3 py-2 rounded-md">{selectedContract.timestamp}</p>
                           </div>
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Transaction Count</label>
                             <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">{selectedContract.txCount}</p>
                           </div>
                         </div>
                       </div>
                    </Card>

                                         {/* Gas & Transaction Details */}
                     <Card className="p-6 bg-gradient-to-br from-background to-muted/20 border border-border/50 shadow-lg">
                       <h3 className="text-lg font-semibold mb-6 flex items-center gap-3 text-primary">
                         <div className="p-2 rounded-lg bg-primary/10">
                           <Zap className="h-4 w-4" />
                         </div>
                         Gas & Transaction Details
                       </h3>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-4">
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Gas Used</label>
                             <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">{parseInt(selectedContract.gasUsed).toLocaleString()}</p>
                           </div>
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Gas Price</label>
                             <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">{formatGasPrice(selectedContract.gasPrice)}</p>
                           </div>
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Nonce</label>
                             <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">{selectedContract.nonce}</p>
                           </div>
                         </div>
                         <div className="space-y-4">
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Gas Limit</label>
                             <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">{parseInt(selectedContract.gasLimit).toLocaleString()}</p>
                           </div>
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Transaction Fee</label>
                             <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">{parseFloat(selectedContract.txFee).toFixed(6)} ETH</p>
                           </div>
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Contract Size</label>
                             <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">{formatBytes(selectedContract.contractSize)}</p>
                           </div>
                         </div>
                       </div>
                    </Card>

                                         {/* Constructor Arguments */}
                     <Card className="p-6 bg-gradient-to-br from-background to-muted/20 border border-border/50 shadow-lg">
                       <h3 className="text-lg font-semibold mb-6 flex items-center gap-3 text-primary">
                         <div className="p-2 rounded-lg bg-primary/10">
                           <Settings className="h-4 w-4" />
                         </div>
                         Constructor Arguments
                       </h3>
                                             <div className="space-y-3">
                         <label className="text-sm font-medium text-muted-foreground block">Input Data</label>
                          <div className="flex items-start gap-3 min-w-0">
                           <Textarea
                             value={selectedContract.inputData}
                             readOnly
                              className="font-mono text-xs h-24 resize-none flex-1 bg-muted border-0 min-w-0"
                           />
                           <Button
                             size="sm"
                             variant="ghost"
                             onClick={() => copyToClipboard(selectedContract.inputData, "Input data")}
                             className="h-8 w-8 p-0 flex-shrink-0 hover:bg-primary/10 mt-1"
                           >
                             <Copy className="h-4 w-4" />
                           </Button>
                         </div>
                       </div>
                    </Card>
                  </TabsContent>
                  
                   <TabsContent value="code" className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar min-h-0">
                     <Card className="p-6 bg-gradient-to-br from-background to-muted/20 border border-border/50 shadow-lg">
                       <h3 className="text-lg font-semibold mb-6 flex items-center gap-3 text-primary">
                         <div className="p-2 rounded-lg bg-primary/10">
                           <Code className="h-4 w-4" />
                         </div>
                         Contract Bytecode
                       </h3>
                                             <div className="space-y-4">
                         <div className="flex items-center justify-between">
                           <label className="text-sm font-medium text-muted-foreground">Bytecode (Hex)</label>
                           <div className="flex items-center gap-3">
                             <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                               {formatBytes(selectedContract.bytecode.length / 2)} bytes
                             </span>
                             <Button
                               size="sm"
                               variant="ghost"
                               onClick={() => copyToClipboard(selectedContract.bytecode, "Bytecode")}
                               className="h-8 w-8 p-0 hover:bg-primary/10"
                             >
                               <Copy className="h-4 w-4" />
                             </Button>
                           </div>
                         </div>
                         <Textarea
                           value={selectedContract.bytecode}
                           readOnly
                           className="font-mono text-xs h-80 resize-none bg-muted border-0"
                           placeholder="Contract bytecode will appear here..."
                         />
                       </div>
                    </Card>
                                     </TabsContent>
                   
                    <TabsContent value="analytics" className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar min-h-0">
                     {/* Developer Analytics */}
                     <Card className="p-6 bg-gradient-to-br from-background to-muted/20 border border-border/50 shadow-lg">
                       <h3 className="text-lg font-semibold mb-6 flex items-center gap-3 text-primary">
                         <div className="p-2 rounded-lg bg-primary/10">
                           <Settings className="h-4 w-4" />
                         </div>
                         Developer Analytics
                       </h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-4">
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Compiler Version</label>
                             <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">{selectedContract.compilerVersion}</p>
                           </div>
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Optimization Level</label>
                             <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">{selectedContract.optimizationLevel}</p>
                           </div>
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Gas Efficiency</label>
                             <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">{selectedContract.gasEfficiency.toFixed(2)}%</p>
                           </div>
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Code Hash</label>
                              <div className="flex items-center gap-2 min-w-0">
                                <code className="text-xs bg-muted px-3 py-2 rounded-md flex-1 font-mono truncate">
                                 {selectedContract.codeHash.slice(0, 20)}...
                               </code>
                               <Button
                                 size="sm"
                                 variant="ghost"
                                 onClick={() => copyToClipboard(selectedContract.codeHash, "Code hash")}
                                 className="h-8 w-8 p-0 flex-shrink-0 hover:bg-primary/10"
                               >
                                 <Copy className="h-4 w-4" />
                               </Button>
                             </div>
                           </div>
                         </div>
                         <div className="space-y-4">
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Deployment Cost</label>
                             <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">{parseFloat(selectedContract.deploymentCost).toFixed(6)} ETH</p>
                           </div>
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Contract Size</label>
                             <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">{formatBytes(selectedContract.contractSize)}</p>
                           </div>
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Storage Root</label>
                              <div className="flex items-center gap-2 min-w-0">
                                <code className="text-xs bg-muted px-3 py-2 rounded-md flex-1 font-mono truncate">
                                 {selectedContract.storageRoot.slice(0, 20)}...
                               </code>
                               <Button
                                 size="sm"
                                 variant="ghost"
                                 onClick={() => copyToClipboard(selectedContract.storageRoot, "Storage root")}
                                 className="h-8 w-8 p-0 flex-shrink-0 hover:bg-primary/10"
                               >
                                 <Copy className="h-4 w-4" />
                               </Button>
                             </div>
                           </div>
                           <div>
                             <label className="text-sm font-medium text-muted-foreground mb-2 block">Is Contract</label>
                             <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">{selectedContract.isContract ? 'Yes' : 'No'}</p>
                           </div>
                         </div>
                       </div>
                     </Card>

                     {/* Gas Analysis */}
                     <Card className="p-6 bg-gradient-to-br from-background to-muted/20 border border-border/50 shadow-lg">
                       <h3 className="text-lg font-semibold mb-6 flex items-center gap-3 text-primary">
                         <div className="p-2 rounded-lg bg-primary/10">
                           <Zap className="h-4 w-4" />
                         </div>
                         Gas Analysis
                       </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-6 bg-gradient-to-br from-primary/5 via-primary/5 to-purple-400/10 rounded-xl border border-primary/15">
                            <div className="text-3xl font-bold text-primary mb-2">
                             {parseInt(selectedContract.gasUsed).toLocaleString()}
                           </div>
                            <div className="text-sm text-muted-foreground font-medium">Gas Used</div>
                         </div>
                          <div className="p-6 bg-gradient-to-br from-blue-500/5 via-sky-400/5 to-cyan-400/10 rounded-xl border border-blue-500/15">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                             {parseInt(selectedContract.gasLimit).toLocaleString()}
                           </div>
                            <div className="text-sm text-muted-foreground font-medium">Gas Limit</div>
                         </div>
                          <div className="p-6 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-emerald-400/10 rounded-xl border border-emerald-500/15">
                            <div className="text-3xl font-bold text-emerald-600 mb-2">
                             {selectedContract.gasEfficiency.toFixed(1)}%
                           </div>
                            <div className="text-sm text-muted-foreground font-medium">Efficiency</div>
                         </div>
                       </div>
                       <div className="mt-6">
                         <div className="flex justify-between text-sm text-muted-foreground mb-3">
                           <span className="font-medium">Gas Usage Efficiency</span>
                           <span className="font-bold text-primary">{selectedContract.gasEfficiency.toFixed(1)}%</span>
                         </div>
                          <div className="w-full bg-muted/40 rounded-full h-3 overflow-hidden">
                           <div 
                              className="bg-gradient-to-r from-primary/50 to-purple-500/50 h-3 rounded-full transition-all duration-500 ease-out"
                             style={{ width: `${Math.min(selectedContract.gasEfficiency, 100)}%` }}
                           ></div>
                         </div>
                       </div>
                     </Card>
                   </TabsContent>
                   
                                       <TabsContent value="transactions" className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar min-h-0">
                     <Card className="p-6 bg-gradient-to-br from-background to-muted/20 border border-border/50 shadow-lg">
                       <h3 className="text-lg font-semibold mb-6 flex items-center gap-3 text-primary">
                         <div className="p-2 rounded-lg bg-primary/10">
                           <Database className="h-4 w-4" />
                         </div>
                         Recent Transactions
                       </h3>
                      <p className="text-muted-foreground">
                        Transaction history feature coming soon. Currently showing deployment transaction.
                      </p>
                                             <div className="mt-4 p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border border-border/50">
                          <div className="flex items-center justify-between gap-3 min-w-0">
                            <div className="min-w-0">
                              <p className="font-mono text-sm font-medium text-primary truncate">{selectedContract.deploymentTx}</p>
                             <p className="text-xs text-muted-foreground mt-1">Deployment Transaction</p>
                           </div>
                           <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Deploy</Badge>
                         </div>
                       </div>
                    </Card>
                  </TabsContent>
                  
                                      <TabsContent value="events" className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar min-h-0">
                     <Card className="p-6 bg-gradient-to-br from-background to-muted/20 border border-border/50 shadow-lg">
                       <h3 className="text-lg font-semibold mb-6 flex items-center gap-3 text-primary">
                         <div className="p-2 rounded-lg bg-primary/10">
                           <Calendar className="h-4 w-4" />
                         </div>
                         Contract Events
                       </h3>
                      {selectedContract.events.length > 0 ? (
                                                 <div className="space-y-3">
                           {selectedContract.events.map((event, index) => (
                             <div key={index} className="p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                               <p className="font-mono text-sm font-medium text-primary">{event.topics?.[0] || 'Unknown Event'}</p>
                               <p className="text-xs text-muted-foreground mt-1">Event #{index + 1}</p>
                             </div>
                           ))}
                         </div>
                      ) : (
                        <p className="text-muted-foreground">No events found for this contract.</p>
                      )}
                    </Card>
                                     </TabsContent>
                 </Tabs>
               ) : (
                 <div className="flex-1 flex items-center justify-center">
                   <div className="text-center">
                     <div className="p-4 rounded-full bg-muted/50 mx-auto mb-6 w-16 h-16 flex items-center justify-center">
                       <FileCode className="h-8 w-8 text-muted-foreground" />
                     </div>
                     <p className="text-muted-foreground font-medium">No contract selected</p>
                     <p className="text-xs text-muted-foreground mt-2">Select a contract to view details</p>
                   </div>
                 </div>
               )}
             </DialogContent>
           </Dialog>

          {/* Verify Contract Modal */}
          <Dialog open={isVerifyOpen} onOpenChange={setIsVerifyOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Verify Contract</DialogTitle>
              </DialogHeader>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Contract Address</Label>
                    <Select value={verifyAddress} onValueChange={setVerifyAddress}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select contract" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-auto">
                        {contracts.map((c) => (
                          <SelectItem key={c.address} value={c.address}>{c.address}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Contract Name</Label>
                    <Input value={verifyName} onChange={(e) => setVerifyName(e.target.value)} placeholder="MyContract" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Compiler</Label>
                    <Select value={verifyCompiler} onValueChange={setVerifyCompiler}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Solidity 0.8.x">Solidity 0.8.x</SelectItem>
                        <SelectItem value="Solidity 0.7.x">Solidity 0.7.x</SelectItem>
                        <SelectItem value="Solidity 0.6.x">Solidity 0.6.x</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between pt-6">
                    <div>
                      <Label className="mr-3">Optimization</Label>
                    </div>
                    <Switch checked={verifyOptimization} onCheckedChange={setVerifyOptimization} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>ABI (optional)</Label>
                  <Textarea className="font-mono text-xs h-28" placeholder="[ ... ]" value={verifyAbi} onChange={(e) => setVerifyAbi(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Source Code (optional)</Label>
                  <Textarea className="font-mono text-xs h-40" placeholder="// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n..." value={verifySource} onChange={(e) => setVerifySource(e.target.value)} />
                </div>

                {verifyError && (
                  <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-2 rounded">{verifyError}</div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => setIsVerifyOpen(false)}>Cancel</Button>
                  <Button onClick={handleVerifySave}>Save Verification</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
    </>
  );
};

export default ContractsPage;