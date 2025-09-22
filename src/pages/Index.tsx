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
        <main className="flex-1 transition-all duration-300 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8" style={{ marginLeft: 'var(--sidebar-width, 256px)' }}>
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-mono text-foreground">
                AnvilX Dashboard
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Foundry Anvil Node Monitor
              </p>
            </div>
            <ConnectionModal />
          </div>

          {/* Metrics Cards */}
          <DashboardCards />

          {/* Latest Blocks Table */}
          <BlocksTable />
        </main>
      </div>
    </div>
  );
};

export default Index;
