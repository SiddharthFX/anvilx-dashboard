import AnvilXNavbar from "@/components/AnvilXNavbar";
import AnvilXSidebar from "@/components/AnvilXSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye, EyeOff, Wallet, WifiOff, TrendingUp, Shield, Key, ExternalLink } from "lucide-react";
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

  const totalBalance = state.accounts.reduce((sum, account) => sum + parseFloat(account.balance), 0);
  const totalTransactions = state.accounts.reduce((sum, account) => sum + account.nonce, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <AnvilXNavbar />
      
      <div className="flex">
        <AnvilXSidebar />
        
        <main className="flex-1 transition-all duration-300 p-4 sm:p-6 lg:p-8 space-y-6" style={{ marginLeft: 'var(--sidebar-width, 256px)' }}>
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                                 <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono text-blue-600">
                   Accounts
                 </h1>
                <p className="text-lg text-muted-foreground">
                  Manage your pre-funded Anvil development accounts
                </p>
              </div>
              
              {state.isConnected && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Connected
                  </Badge>
                </div>
              )}
            </div>

            {/* Stats Cards */}
            {state.isConnected && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                        <p className="text-2xl font-bold font-mono">{totalBalance.toFixed(4)} ETH</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Accounts</p>
                        <p className="text-2xl font-bold">{state.accounts.length}</p>
                      </div>
                      <Wallet className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                        <p className="text-2xl font-bold">{totalTransactions}</p>
                      </div>
                      <ExternalLink className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Network</p>
                        <p className="text-2xl font-bold">Anvil</p>
                      </div>
                      <Shield className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Content Section */}
          {!state.isConnected ? (
            <Card className="p-16 text-center border-2 border-dashed border-muted-foreground/20">
              <div className="max-w-md mx-auto space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <WifiOff className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Not Connected</h2>
                  <p className="text-muted-foreground text-lg">
                    Connect to your Anvil node to view and manage accounts
                  </p>
                </div>
                <Button size="lg" className="mt-4">
                  Connect to Anvil
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Account Details</h2>
                <Badge variant="outline" className="text-sm">
                  {state.accounts.length} accounts available
                </Badge>
              </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {state.accounts.map((account, index) => (
                  <Card key={account.address} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Wallet className="h-6 w-6 text-primary-foreground" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Account #{index + 1}</CardTitle>
                            <Badge variant="secondary" className="text-xs">
                              {account.nonce} transactions
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                                             {/* Balance Section */}
                       <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                         <div className="flex items-center justify-between">
                           <div>
                             <p className="text-sm font-medium text-muted-foreground">Balance</p>
                             <p className="text-3xl font-bold font-mono text-blue-600">
                               {parseFloat(account.balance).toFixed(4)}
                             </p>
                             <p className="text-sm text-muted-foreground">ETH</p>
                           </div>
                           <TrendingUp className="h-8 w-8 text-blue-500" />
                         </div>
                       </div>

                                             {/* Address Section */}
                       <div className="space-y-4">
                         <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                               <Key className="h-4 w-4 text-white" />
                             </div>
                             <div>
                               <span className="text-sm font-semibold">Address</span>
                               <p className="text-xs text-muted-foreground">Public wallet address</p>
                             </div>
                           </div>
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => copyToClipboard(account.address, "Address")}
                             className="h-8 px-3 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-xs"
                           >
                             <Copy className="h-3 w-3 mr-1" />
                             Copy
                           </Button>
                         </div>
                         
                                                    <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50">
                             <div className="flex items-center justify-between mb-2">
                               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                 Ethereum Address
                               </span>
                               <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                             </div>
                             <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm">
                               <code className="block text-xs font-mono text-blue-700 break-all leading-relaxed">
                                 {account.address}
                               </code>
                             </div>
                           </div>
                       </div>

                                             {/* Private Key Section */}
                       {account.privateKey && (
                         <div className="space-y-4">
                           <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                               <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                                 <Shield className="h-4 w-4 text-white" />
                               </div>
                               <div>
                                 <span className="text-sm font-semibold">Private Key</span>
                                 <p className="text-xs text-muted-foreground">Keep this secure</p>
                               </div>
                             </div>
                             <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => toggleKeyVisibility(index)}
                                 className="h-8 px-3 border-red-200 hover:bg-red-50 hover:border-red-300 text-xs"
                               >
                                 {visibleKeys.has(index) ? (
                                   <>
                                     <EyeOff className="h-3 w-3 mr-1" />
                                     Hide
                                   </>
                                 ) : (
                                   <>
                                     <Eye className="h-3 w-3 mr-1" />
                                     Show
                                   </>
                                 )}
                               </Button>
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => copyToClipboard(account.privateKey!, "Private key")}
                                 className="h-8 px-3 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-xs"
                               >
                                 <Copy className="h-3 w-3 mr-1" />
                                 Copy
                               </Button>
                             </div>
                           </div>
                           
                           <div className="relative">
                             <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                               visibleKeys.has(index) 
                                 ? 'border-red-200 bg-red-50/50' 
                                 : 'border-gray-200 bg-gray-50/50'
                             }`}>
                               <div className="flex items-center justify-between mb-2">
                                 <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                   {visibleKeys.has(index) ? 'Private Key (Visible)' : 'Private Key (Hidden)'}
                                 </span>
                                 <div className="flex items-center gap-1">
                                   {visibleKeys.has(index) ? (
                                     <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                   ) : (
                                     <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                   )}
                                 </div>
                               </div>
                               
                                                                <div className="relative">
                                   {visibleKeys.has(index) ? (
                                     <div className="space-y-3">
                                       <div className="bg-white rounded-lg p-3 border border-red-200 shadow-sm">
                                         <code className="block text-xs font-mono text-red-700 break-all leading-relaxed">
                                           {account.privateKey}
                                         </code>
                                       </div>
                                       <div className="flex items-start gap-2 text-xs text-red-600">
                                         <Shield className="h-3 w-3 flex-shrink-0 mt-0.5" />
                                         <span>Private key is visible - keep secure</span>
                                       </div>
                                     </div>
                                   ) : (
                                     <div className="space-y-3">
                                       <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                                         <div className="flex flex-wrap gap-1">
                                           {Array.from({ length: 64 }, (_, i) => (
                                             <div key={i} className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                           ))}
                                         </div>
                                       </div>
                                       <div className="flex items-start gap-2 text-xs text-gray-500">
                                         <Eye className="h-3 w-3 flex-shrink-0 mt-0.5" />
                                         <span>Click "Show" to reveal private key</span>
                                       </div>
                                     </div>
                                   )}
                                 </div>
                             </div>
                             
                             {/* Security warning */}
                             {visibleKeys.has(index) && (
                               <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded-lg">
                                 <div className="flex items-start gap-2">
                                   <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                     <span className="text-white text-xs font-bold">!</span>
                                   </div>
                                   <div className="text-xs text-red-800">
                                     <p className="font-medium mb-1">Security Warning</p>
                                     <p>Never share your private key. Anyone with access to this key can control your account and funds.</p>
                                   </div>
                                 </div>
                               </div>
                             )}
                           </div>
                         </div>
                       )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AccountsPage;