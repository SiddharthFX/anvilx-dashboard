import { useState, useEffect, ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Plug, AlertTriangle, CheckCircle, Copy, Eye, EyeOff, Link2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAnvil } from "@/contexts/AnvilContext";

type ConnectionModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
  trigger?: ReactNode;
};
const ConnectionModal = ({ open, onOpenChange, showTrigger = true, trigger }: ConnectionModalProps) => {
  const { state, connect, disconnect } = useAnvil();
  const [localRpcUrl, setLocalRpcUrl] = useState(state.rpcUrl);
  const [localPrivateKey, setLocalPrivateKey] = useState(state.privateKey);
  const [internalOpen, setInternalOpen] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange ?? setInternalOpen;

  useEffect(() => {
    setLocalRpcUrl(state.rpcUrl);
    setLocalPrivateKey(state.privateKey);
  }, [state.rpcUrl, state.privateKey]);

  const handleConnect = async () => {
    try {
      await connect(localRpcUrl, localPrivateKey || undefined);
      setIsOpen(false);
    } catch (error) {
      // Error is handled in the context
    }
  };

  const handleTestConnection = async () => {
    try {
      setIsTesting(true);
      const testProvider = new (await import('ethers')).ethers.JsonRpcProvider(localRpcUrl);
      await testProvider.getBlockNumber();
      alert('Connection test successful!');
    } catch (error) {
      alert('Connection test failed: ' + (error as Error).message);
    } finally {
      setIsTesting(false);
    }
  };

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {showTrigger && (
        <DialogTrigger asChild>
          {trigger ? (
            trigger
          ) : (
            <Button variant="outline" className="hover:bg-secondary">
              {state.isConnected ? (
                <CheckCircle className="mr-2 h-4 w-4 text-success" />
              ) : (
                <Settings className="mr-2 h-4 w-4" />
              )}
              {state.isConnected ? 'Connected' : 'Connection Settings'}
            </Button>
          )}
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-lg md:max-w-xl bg-gradient-to-br from-background via-background to-muted/30 border-0 shadow-2xl backdrop-blur-sm">
        <DialogHeader className="border-b border-border/50 pb-3 mb-4">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            <div className="p-2 rounded-lg bg-primary/10">
              <Plug className="h-5 w-5 text-primary" />
            </div>
            Node Connection
            {state.isConnected && (
              <span className="ml-1 rounded-full bg-green-500/10 text-green-600 text-xs px-2 py-0.5 border border-green-500/20">Connected</span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Connection Status */}
          {state.isConnected && (
            <Card className="p-4 bg-emerald-500/5 border-emerald-500/20">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-emerald-700">Connected to Anvil</p>
                  <p className="text-xs text-muted-foreground">
                    Chain ID: {state.network?.chainId} • Block: {state.network?.blockNumber}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* RPC URL Section */}
          <div className="space-y-3">
            <Label htmlFor="rpc-url" className="text-sm font-medium">
              RPC Endpoint URL
            </Label>
            <div className="relative">
              <Input
                id="rpc-url"
                value={localRpcUrl}
                onChange={(e) => setLocalRpcUrl(e.target.value)}
                placeholder="http://127.0.0.1:8545"
                className="font-mono text-sm pr-10"
                disabled={state.isConnecting}
              />
              <button
                type="button"
                aria-label="Copy RPC URL"
                onClick={() => copyToClipboard(localRpcUrl)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 hover:bg-primary/10"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your local Ethereum node RPC endpoint
            </p>
          </div>

          {/* Private Key Section */}
          <div className="space-y-3">
            <Label htmlFor="private-key" className="text-sm font-medium">
              Private Key (Optional)
            </Label>
            <div className="relative">
              <Input
                id="private-key"
                type={showPrivateKey ? 'text' : 'password'}
                value={localPrivateKey}
                onChange={(e) => setLocalPrivateKey(e.target.value)}
                placeholder="0x..."
                className="font-mono text-sm pr-20"
                disabled={state.isConnecting}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Toggle visibility"
                  onClick={() => setShowPrivateKey((v) => !v)}
                  className="rounded-md p-2 hover:bg-primary/10"
                >
                  {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {localPrivateKey && (
                  <button
                    type="button"
                    aria-label="Copy private key"
                    onClick={() => copyToClipboard(localPrivateKey)}
                    className="rounded-md p-2 hover:bg-primary/10"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <Card className="p-3 bg-warning/5 border-warning/20">
              <div className="flex gap-2">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                <div className="text-xs text-warning">
                  <p className="font-medium">Security Warning</p>
                  <p>Only use this for local development. Never enter mainnet private keys.</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Node Presets */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Node Options</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocalRpcUrl("http://127.0.0.1:8545")}
                className="text-xs justify-start"
                disabled={state.isConnecting}
              >
                <span className="inline-flex items-center gap-2"><Plug className="h-3 w-3" />Anvil (Default)</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocalRpcUrl("http://127.0.0.1:8011")}
                className="text-xs justify-start"
                disabled={state.isConnecting}
              >
                <span className="inline-flex items-center gap-2"><Link2 className="h-3 w-3" />Anvil zkSync</span>
              </Button>
              <div className="space-y-2 sm:col-span-2">
                <Input
                  placeholder="https://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY"
                  value={localRpcUrl.startsWith('https://eth-mainnet.g.alchemy.com') ? localRpcUrl : ''}
                  onChange={(e) => setLocalRpcUrl(e.target.value)}
                  className="text-xs"
                  disabled={state.isConnecting}
                />
                <p className="text-xs text-muted-foreground">Alchemy Node RPC URL</p>
              </div>
            </div>
          </div>

          {/* Connection Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {state.isConnected ? (
              <Button 
                variant="destructive" 
                className="flex-1 font-medium"
                onClick={disconnect}
              >
                Disconnect
              </Button>
            ) : (
              <Button 
                className="flex-1 font-medium"
                onClick={handleConnect}
                disabled={state.isConnecting || !localRpcUrl}
              >
                <Plug className="mr-2 h-4 w-4" />
                {state.isConnecting ? 'Connecting...' : 'Connect to Node'}
              </Button>
            )}
            <Button 
              variant="outline" 
              className="px-6"
              onClick={handleTestConnection}
              disabled={state.isConnecting || !localRpcUrl || isTesting}
            >
              {isTesting ? 'Testing…' : 'Test Connection'}
            </Button>
          </div>

          {/* Error Display */}
          {state.error && (
            <Card className="p-3 bg-destructive/5 border-destructive/20">
              <div className="flex gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <div className="text-xs text-destructive">
                  <p className="font-medium">Connection Error</p>
                  <p>{state.error}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionModal;