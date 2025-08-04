import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Plug, AlertTriangle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAnvil } from "@/contexts/AnvilContext";

const ConnectionModal = () => {
  const { state, connect, disconnect, setRpcUrl: setContextRpcUrl, setPrivateKey: setContextPrivateKey } = useAnvil();
  const [localRpcUrl, setLocalRpcUrl] = useState(state.rpcUrl);
  const [localPrivateKey, setLocalPrivateKey] = useState(state.privateKey);
  const [isOpen, setIsOpen] = useState(false);

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
      // Just test the connection without saving
      const testProvider = new (await import('ethers')).ethers.JsonRpcProvider(localRpcUrl);
      await testProvider.getBlockNumber();
      alert('Connection test successful!');
    } catch (error) {
      alert('Connection test failed: ' + (error as Error).message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="hover:bg-secondary">
          {state.isConnected ? (
            <CheckCircle className="mr-2 h-4 w-4 text-success" />
          ) : (
            <Settings className="mr-2 h-4 w-4" />
          )}
          {state.isConnected ? 'Connected' : 'Connection Settings'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-space-grotesk">
            <Plug className="h-5 w-5 text-primary" />
            Node Connection
            {state.isConnected && (
              <span className="text-sm text-success font-normal">Connected</span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Connection Status */}
          {state.isConnected && (
            <Card className="p-4 bg-success/5 border-success/20">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium text-success">Connected to Anvil</p>
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
            <Input
              id="rpc-url"
              value={localRpcUrl}
              onChange={(e) => setLocalRpcUrl(e.target.value)}
              placeholder="http://127.0.0.1:8545"
              className="font-mono text-sm"
              disabled={state.isConnecting}
            />
            <p className="text-xs text-muted-foreground">
              Your local Ethereum node RPC endpoint
            </p>
          </div>

          {/* Private Key Section */}
          <div className="space-y-3">
            <Label htmlFor="private-key" className="text-sm font-medium">
              Private Key (Optional)
            </Label>
            <Input
              id="private-key"
              type="password"
              value={localPrivateKey}
              onChange={(e) => setLocalPrivateKey(e.target.value)}
              placeholder="0x..."
              className="font-mono text-sm"
              disabled={state.isConnecting}
            />
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

          {/* Quick Presets */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quick Presets</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocalRpcUrl("http://127.0.0.1:8545")}
                className="text-xs"
                disabled={state.isConnecting}
              >
                Anvil Default
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocalRpcUrl("http://127.0.0.1:7545")}
                className="text-xs"
                disabled={state.isConnecting}
              >
                Ganache
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocalRpcUrl("http://127.0.0.1:9545")}
                className="text-xs"
                disabled={state.isConnecting}
              >
                Hardhat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocalRpcUrl("http://127.0.0.1:3334")}
                className="text-xs"
                disabled={state.isConnecting}
              >
                Custom
              </Button>
            </div>
          </div>

          {/* Connection Actions */}
          <div className="flex gap-3 pt-4">
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
              disabled={state.isConnecting || !localRpcUrl}
            >
              Test Connection
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