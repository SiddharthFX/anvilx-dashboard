import AnvilXNavbar from "@/components/AnvilXNavbar";
import AnvilXSidebar from "@/components/AnvilXSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench, 
  Terminal, 
  FileCode, 
  Zap, 
  Clock, 
  Database,
  Wallet,
  ArrowRightLeft,
  RefreshCw,
  Play,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ToolsPage = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const tools = [
    {
      id: "impersonate",
      name: "Impersonate Account",
      description: "Impersonate any account to test your contracts",
      icon: Wallet,
      category: "Account Management",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    {
      id: "mine-blocks",
      name: "Mine Blocks",
      description: "Manually mine blocks to advance the blockchain state",
      icon: Database,
      category: "Blockchain Control",
      color: "bg-green-500/10 text-green-500 border-green-500/20",
    },
    {
      id: "set-time",
      name: "Set Block Time",
      description: "Control the timestamp of the next block",
      icon: Clock,
      category: "Time Control",
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    },
    {
      id: "auto-mine",
      name: "Auto Mine Toggle",
      description: "Enable or disable automatic mining",
      icon: RefreshCw,
      category: "Mining Control",
      color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    },
    {
      id: "increase-time",
      name: "Increase Time",
      description: "Fast forward the blockchain time",
      icon: Zap,
      category: "Time Control",
      color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    },
    {
      id: "revert-snapshot",
      name: "Snapshot Management",
      description: "Create and revert to blockchain snapshots",
      icon: Database,
      category: "State Management",
      color: "bg-red-500/10 text-red-500 border-red-500/20",
    },
    {
      id: "send-transaction",
      name: "Send Raw Transaction",
      description: "Send a raw transaction to the network",
      icon: ArrowRightLeft,
      category: "Transaction Tools",
      color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    },
    {
      id: "decode-data",
      name: "Data Decoder",
      description: "Decode transaction data and logs",
      icon: FileCode,
      category: "Developer Tools",
      color: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    },
  ];

  const handleToolAction = async (toolId: string) => {
    setIsLoading(true);
    
    // Simulate tool execution
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Tool Executed",
      description: `${tools.find(t => t.id === toolId)?.name} executed successfully`,
    });
    
    setIsLoading(false);
  };

  const renderToolInterface = () => {
    if (!selectedTool) return null;

    const tool = tools.find(t => t.id === selectedTool);
    if (!tool) return null;

    switch (selectedTool) {
      case "impersonate":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="account">Account Address</Label>
              <Input 
                id="account"
                placeholder="0x..." 
                className="font-mono"
              />
            </div>
            <Button 
              onClick={() => handleToolAction(selectedTool)}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Wallet className="mr-2 h-4 w-4" />}
              Start Impersonation
            </Button>
          </div>
        );

      case "mine-blocks":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="block-count">Number of Blocks</Label>
              <Input 
                id="block-count"
                type="number" 
                placeholder="1" 
                defaultValue="1"
              />
            </div>
            <Button 
              onClick={() => handleToolAction(selectedTool)}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
              Mine Blocks
            </Button>
          </div>
        );

      case "set-time":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="timestamp">Timestamp (Unix)</Label>
              <Input 
                id="timestamp"
                type="number" 
                placeholder={Math.floor(Date.now() / 1000).toString()}
              />
            </div>
            <Button 
              onClick={() => handleToolAction(selectedTool)}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />}
              Set Block Time
            </Button>
          </div>
        );

      case "increase-time":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="time-increase">Seconds to Increase</Label>
              <Input 
                id="time-increase"
                type="number" 
                placeholder="3600" 
                defaultValue="3600"
              />
            </div>
            <Button 
              onClick={() => handleToolAction(selectedTool)}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
              Increase Time
            </Button>
          </div>
        );

      case "send-transaction":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="raw-tx">Raw Transaction Data</Label>
              <Textarea 
                id="raw-tx"
                placeholder="0x..." 
                className="font-mono min-h-[100px]"
              />
            </div>
            <Button 
              onClick={() => handleToolAction(selectedTool)}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRightLeft className="mr-2 h-4 w-4" />}
              Send Transaction
            </Button>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <Button 
              onClick={() => handleToolAction(selectedTool)}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
              Execute Tool
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AnvilXNavbar />
      
      <div className="flex">
        <AnvilXSidebar />
        
        <main className="flex-1 ml-64 p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-space-grotesk text-foreground">
                Anvil Tools
              </h1>
              <p className="text-muted-foreground mt-1">
                Powerful tools to control and test your local blockchain
              </p>
            </div>
          </div>

          {/* Warning Card */}
          <Card className="p-4 bg-warning/5 border-warning/20">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-warning">Development Environment</h3>
                <p className="text-xs text-warning/80">
                  These tools are for development and testing only. Never use them on production networks.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Tools List */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold font-space-grotesk">Available Tools</h2>
              
              <div className="grid gap-4">
                {tools.map((tool) => (
                  <Card 
                    key={tool.id} 
                    className={`p-6 cursor-pointer transition-all duration-200 hover-lift ${
                      selectedTool === tool.id ? 'ring-2 ring-primary shadow-lg' : ''
                    }`}
                    onClick={() => setSelectedTool(tool.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${tool.color}`}>
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-foreground">{tool.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {tool.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Tool Interface */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold font-space-grotesk">Tool Interface</h2>
              
              {selectedTool ? (
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${tools.find(t => t.id === selectedTool)?.color}`}>
                        {(() => {
                          const selectedToolData = tools.find(t => t.id === selectedTool);
                          if (selectedToolData?.icon) {
                            const IconComponent = selectedToolData.icon;
                            return <IconComponent className="h-5 w-5" />;
                          }
                          return null;
                        })()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {tools.find(t => t.id === selectedTool)?.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {tools.find(t => t.id === selectedTool)?.category}
                        </p>
                      </div>
                    </div>
                    
                    {renderToolInterface()}
                  </div>
                </Card>
              ) : (
                <Card className="p-8 text-center">
                  <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Select a Tool</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a tool from the left to start configuring and executing it.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ToolsPage;