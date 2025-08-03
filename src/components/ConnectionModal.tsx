import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Plug, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

const ConnectionModal = () => {
  const [rpcUrl, setRpcUrl] = useState("http://localhost:8545");
  const [privateKey, setPrivateKey] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="hover:bg-secondary">
          <Settings className="mr-2 h-4 w-4" />
          Connection Settings
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-space-grotesk">
            <Plug className="h-5 w-5 text-primary" />
            Node Connection
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* RPC URL Section */}
          <div className="space-y-3">
            <Label htmlFor="rpc-url" className="text-sm font-medium">
              RPC Endpoint URL
            </Label>
            <Input
              id="rpc-url"
              value={rpcUrl}
              onChange={(e) => setRpcUrl(e.target.value)}
              placeholder="http://localhost:8545"
              className="font-mono text-sm"
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
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder="0x..."
              className="font-mono text-sm"
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
                onClick={() => setRpcUrl("http://localhost:8545")}
                className="text-xs"
              >
                Anvil Default
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRpcUrl("http://localhost:7545")}
                className="text-xs"
              >
                Ganache
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRpcUrl("http://localhost:9545")}
                className="text-xs"
              >
                Hardhat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRpcUrl("http://localhost:3334")}
                className="text-xs"
              >
                Custom
              </Button>
            </div>
          </div>

          {/* Connection Actions */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1 font-medium">
              <Plug className="mr-2 h-4 w-4" />
              Connect to Node
            </Button>
            <Button variant="outline" className="px-6">
              Test Connection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionModal;