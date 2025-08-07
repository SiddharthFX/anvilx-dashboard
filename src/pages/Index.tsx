import AnvilXNavbar from "@/components/AnvilXNavbar";
import AnvilXSidebar from "@/components/AnvilXSidebar";
import DashboardCards from "@/components/DashboardCards";
import BlocksTable from "@/components/BlocksTable";
import ConnectionModal from "@/components/ConnectionModal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <AnvilXNavbar />
      
      <div className="flex">
        {/* Sidebar */}
        <AnvilXSidebar />
        
        {/* Main Content */}
        <main className="flex-1 transition-all duration-300 p-8 space-y-8" style={{ marginLeft: 'var(--sidebar-width, 256px)' }}>
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome to AnvilX
            </h1>
            <p className="text-lg text-muted-foreground">
              Foundry Anvil Node Monitor & Analytics Dashboard
            </p>
          </div>

          {/* Connection Status & Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-3">
              <div className="px-4 py-2 bg-accent/20 text-accent-foreground rounded-full text-sm font-medium">
                Node Monitor
              </div>
              <div className="px-4 py-2 bg-secondary/50 text-secondary-foreground rounded-full text-sm font-medium">
                Real-time Data
              </div>
            </div>
            <ConnectionModal />
          </div>

          {/* Metrics Grid */}
          <DashboardCards />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Latest Blocks - Takes 2 columns */}
            <div className="lg:col-span-2">
              <BlocksTable />
            </div>
            
            {/* Quick Actions Panel */}
            <div className="space-y-6">
              <div className="modern-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full p-3 text-left bg-accent/10 hover:bg-accent/20 rounded-xl transition-colors">
                    <div className="text-sm font-medium text-foreground">Deploy Contract</div>
                    <div className="text-xs text-muted-foreground">Deploy smart contracts</div>
                  </button>
                  <button className="w-full p-3 text-left bg-secondary/30 hover:bg-secondary/40 rounded-xl transition-colors">
                    <div className="text-sm font-medium text-foreground">Send Transaction</div>
                    <div className="text-xs text-muted-foreground">Execute transactions</div>
                  </button>
                  <button className="w-full p-3 text-left bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors">
                    <div className="text-sm font-medium text-foreground">View Accounts</div>
                    <div className="text-xs text-muted-foreground">Manage wallets</div>
                  </button>
                </div>
              </div>

              <div className="modern-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Network Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Connection</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sync Status</span>
                    <span className="text-sm font-medium text-green-600">Synced</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Peers</span>
                    <span className="text-sm font-medium">8 connected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
