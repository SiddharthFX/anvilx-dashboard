import { Search, Settings, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AnvilXNavbar = () => {
  return (
    <nav className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
      {/* Logo and App Name */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-card-purple rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <h1 className="text-xl font-space-grotesk font-semibold text-foreground">
          AnvilX
        </h1>
        <span className="text-sm text-muted-foreground font-medium">
          Ethereum Node Viewer
        </span>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search transactions, blocks, addresses..." 
            className="pl-10 bg-secondary/50 border-border focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Network Status & Actions */}
      <div className="flex items-center gap-4">
        {/* Network Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20">
          <span className="status-indicator status-online"></span>
          <span className="text-sm font-medium text-success">Connected</span>
          <span className="text-xs text-muted-foreground">Mainnet</span>
        </div>

        {/* Action Buttons */}
        <Button variant="ghost" size="sm" className="h-9 w-9">
          <Bell className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="sm" className="h-9 w-9">
          <Settings className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="sm" className="h-9 w-9">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
};

export default AnvilXNavbar;