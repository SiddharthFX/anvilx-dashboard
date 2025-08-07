import AnvilXNavbar from "@/components/AnvilXNavbar";
import AnvilXSidebar from "@/components/AnvilXSidebar";
import DashboardCards from "@/components/DashboardCards";
import BlocksTable from "@/components/BlocksTable";
import ConnectionModal from "@/components/ConnectionModal";

import { useAnvil } from "@/contexts/AnvilContext";

const Index = () => {
  const { state } = useAnvil();

  return (
    <div className="min-h-screen bg-[hsl(var(--dashboard-bg))]">
      {/* Navigation */}
      <AnvilXNavbar />
      
      <div className="flex">
        {/* Sidebar */}
        <AnvilXSidebar />
        
        {/* Main Content */}
        <main className="flex-1 transition-all duration-300 p-8 space-y-8 animate-fade-in" style={{ marginLeft: 'var(--sidebar-width, 256px)' }}>
          {/* Welcome Section */}
          <div className="space-y-6">
            <div className="modern-card p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-hsl(var(--dashboard-accent))/10 to-transparent rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold text-gradient mb-2">
                      Welcome to AnvilX
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      Your premium Foundry Anvil node monitor
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`status-indicator ${state.isConnected ? 'status-online' : 'status-offline'}`}></div>
                    <span className="text-sm font-medium">
                      {state.isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                    <ConnectionModal />
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="glass-accent p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-hsl(var(--dashboard-accent))/10 flex items-center justify-center">
                        <span className="text-[hsl(var(--dashboard-accent))] text-xl">⚡</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold font-mono">{state.network?.blockNumber || 0}</p>
                        <p className="text-xs text-muted-foreground">Latest Block</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-accent p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <span className="text-blue-500 text-xl">💰</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold font-mono">{state.network?.gasPrice ? `${(Number(state.network.gasPrice) / 1e9).toFixed(1)}` : '0'}</p>
                        <p className="text-xs text-muted-foreground">Gas Price (Gwei)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-accent p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <span className="text-green-500 text-xl">🏦</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold font-mono">{state.accounts.length}</p>
                        <p className="text-xs text-muted-foreground">Accounts</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-accent p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <span className="text-purple-500 text-xl">📊</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold font-mono">{state.transactions.length}</p>
                        <p className="text-xs text-muted-foreground">Transactions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Metrics */}
            <div className="xl:col-span-2 space-y-6">
              <DashboardCards />
            </div>
            
            {/* Right Column - Activity */}
            <div className="space-y-6">
              <BlocksTable />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
