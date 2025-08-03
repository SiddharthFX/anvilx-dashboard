import AnvilXNavbar from "@/components/AnvilXNavbar";
import AnvilXSidebar from "@/components/AnvilXSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye, EyeOff, Wallet } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Anvil default accounts with private keys
const anvilAccounts = [
  {
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    balance: "10000.000000000000000000",
    index: 0,
  },
  {
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    balance: "10000.000000000000000000",
    index: 1,
  },
  {
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    privateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
    balance: "10000.000000000000000000",
    index: 2,
  },
  {
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    privateKey: "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
    balance: "10000.000000000000000000",
    index: 3,
  },
  {
    address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    privateKey: "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
    balance: "10000.000000000000000000",
    index: 4,
  },
  {
    address: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    privateKey: "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba",
    balance: "10000.000000000000000000",
    index: 5,
  },
  {
    address: "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
    privateKey: "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e",
    balance: "10000.000000000000000000",
    index: 6,
  },
  {
    address: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
    privateKey: "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356",
    balance: "10000.000000000000000000",
    index: 7,
  },
  {
    address: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
    privateKey: "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97",
    balance: "10000.000000000000000000",
    index: 8,
  },
  {
    address: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
    privateKey: "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
    balance: "10000.000000000000000000",
    index: 9,
  },
];

const AccountsPage = () => {
  const [hiddenKeys, setHiddenKeys] = useState<Set<number>>(new Set(Array.from({length: 10}, (_, i) => i)));
  const { toast } = useToast();

  const toggleKeyVisibility = (index: number) => {
    const newHidden = new Set(hiddenKeys);
    if (newHidden.has(index)) {
      newHidden.delete(index);
    } else {
      newHidden.add(index);
    }
    setHiddenKeys(newHidden);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
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
                Anvil Accounts
              </h1>
              <p className="text-muted-foreground mt-1">
                Pre-funded development accounts from Anvil node
              </p>
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              <Wallet className="mr-2 h-3 w-3" />
              {anvilAccounts.length} Accounts Loaded
            </Badge>
          </div>

          <div className="grid gap-4">
            {anvilAccounts.map((account) => (
              <Card key={account.index} className="p-6 hover-lift transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    {/* Account Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                          {account.index}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">Account #{account.index}</h3>
                          <p className="text-sm text-muted-foreground">Anvil Development Account</p>
                        </div>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        {account.balance} ETH
                      </Badge>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
                        <code className="flex-1 text-sm font-mono text-foreground">
                          {account.address}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(account.address, "Address")}
                          className="h-8 w-8 p-0 hover:bg-background"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Private Key */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Private Key</label>
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
                        <code className="flex-1 text-sm font-mono text-foreground">
                          {hiddenKeys.has(account.index) 
                            ? "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••" 
                            : account.privateKey
                          }
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleKeyVisibility(account.index)}
                          className="h-8 w-8 p-0 hover:bg-background"
                        >
                          {hiddenKeys.has(account.index) ? (
                            <Eye className="h-3 w-3" />
                          ) : (
                            <EyeOff className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(account.privateKey, "Private Key")}
                          className="h-8 w-8 p-0 hover:bg-background"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountsPage;