import AnvilXNavbar from "@/components/AnvilXNavbar";
import AnvilXSidebar from "@/components/AnvilXSidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileCode, Eye, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Sample deployed contracts on Anvil
const deployedContracts = [
  {
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    name: "SimpleStorage",
    deployer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    deploymentTx: "0x123...abc",
    blockNumber: 2,
    timestamp: new Date(Date.now() - 3600000).toLocaleString(),
    verified: true,
    type: "Storage Contract",
    bytecode: "0x608060405234801561001057600080fd5b5061012c806100206000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80632e64cec11460375780636057361d14604c575b600080fd5b60005460405190815260200160405180910390f35b605c6057366004605e565b600055565b005b600080fd5b60008060408385031215607057600080fd5b50359250602001356040850152565b00fea26469706673582212208a",
  },
  {
    address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    name: "ERC20Token",
    deployer: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    deploymentTx: "0x456...def",
    blockNumber: 5,
    timestamp: new Date(Date.now() - 7200000).toLocaleString(),
    verified: true,
    type: "ERC-20 Token",
    bytecode: "0x608060405234801561001057600080fd5b5060405161080638038061080683398101604081905261002f916100be565b600061003b838261015c565b50600161004883826101...",
  },
  {
    address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    name: "Marketplace",
    deployer: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    deploymentTx: "0x789...ghi",
    blockNumber: 8,
    timestamp: new Date(Date.now() - 10800000).toLocaleString(),
    verified: false,
    type: "NFT Marketplace",
    bytecode: "0x6080604052348015600f57600080fd5b50600436106100cf5760003560e01c80636352211e1161008c5780636352211e1461...",
  },
  {
    address: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    name: "Governance",
    deployer: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    deploymentTx: "0xabc...jkl",
    blockNumber: 12,
    timestamp: new Date(Date.now() - 14400000).toLocaleString(),
    verified: true,
    type: "DAO Governance",
    bytecode: "0x608060405234801561001057600080fd5b50600436106101735760003560e01c80636fcfff45116100de5780636fcfff45...",
  },
];

const ContractsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contracts] = useState(deployedContracts);
  const { toast } = useToast();

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
        
        <main className="flex-1 p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-space-grotesk text-foreground">
                Smart Contracts
              </h1>
              <p className="text-muted-foreground mt-1">
                Deployed contracts on your Anvil node
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <FileCode className="mr-2 h-4 w-4" />
              Deploy Contract
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 gradient-card-purple text-white border-0">
              <div className="flex items-center gap-3">
                <FileCode className="h-8 w-8 text-white/90" />
                <div>
                  <p className="text-white/80 text-sm font-medium">Total Contracts</p>
                  <p className="text-2xl font-bold font-space-grotesk">{stats.total}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-card shadow-premium">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                  <span className="text-success text-lg">✓</span>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Verified</p>
                  <p className="text-2xl font-bold font-space-grotesk text-foreground">{stats.verified}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-card shadow-premium">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
                  <span className="text-warning text-lg">?</span>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Unverified</p>
                  <p className="text-2xl font-bold font-space-grotesk text-foreground">{stats.unverified}</p>
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
                  placeholder="Search by contract address, name, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                Filter by Type
              </Button>
            </div>
          </Card>

          {/* Contracts Table */}
          <Card>
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold font-space-grotesk">Deployed Contracts</h2>
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
        </main>
      </div>
    </div>
  );
};

export default ContractsPage;