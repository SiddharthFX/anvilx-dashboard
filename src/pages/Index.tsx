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
        <main className="flex-1 p-8 space-y-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-space-grotesk text-foreground">
                Dashboard Overview
              </h1>
              <p className="text-muted-foreground mt-1">
                Monitor your Ethereum node performance and blockchain data
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
