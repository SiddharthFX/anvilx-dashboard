import AnvilXNavbar from "@/components/AnvilXNavbar";
import AnvilXSidebar from "@/components/AnvilXSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye, EyeOff, Wallet, WifiOff } from "lucide-react";
import { useState } from "react";
import { useAnvil } from "@/contexts/AnvilContext";
import { useToast } from "@/hooks/use-toast";

const AccountsPage = () => {
  const { state } = useAnvil();
  const { toast } = useToast();
  const [visibleKeys, setVisibleKeys] = useState<Set<number>>(new Set());

  const toggleKeyVisibility = (index: number) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(index)) {
      newVisibleKeys.delete(index);
    } else {
      newVisibleKeys.add(index);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AnvilXNavbar />
      
      <div className="flex">
        <AnvilXSidebar />
        
        <main className="flex-1 transition-all duration-300 p-8 space-y-8" style={{ marginLeft: 'var(--sidebar-width, 256px)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-space-grotesk text-foreground">
                Accounts
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your pre-funded Anvil development accounts
              </p>
            </div>
          </div>

          {!state.isConnected ? (
            <Card className="p-12 text-center">
              <WifiOff className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Not Connected</h2>
              <p className="text-muted-foreground">
                Connect to your Anvil node to view and manage accounts
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {state.accounts.map((account, index) => (
                <Card key={account.address} className="p-6 hover-lift transition-all">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                          <Wallet className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Account #{index}</h3>
                          <Badge variant="outline" className="text-xs">
                            {account.nonce} txns
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Balance</p>
                      <p className="text-2xl font-bold font-mono">
                        {parseFloat(account.balance).toFixed(4)} ETH
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Address</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(account.address, "Address")}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <code className="block p-2 bg-muted rounded text-xs break-all">
                        {account.address}
                      </code>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AccountsPage;