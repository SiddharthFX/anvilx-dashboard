import { Search, Settings, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AnvilXNavbar = () => {
  return (
    <nav className="h-16 glass-nav flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Logo and App Name */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 glass-primary rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">A</span>
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
            className="pl-10 glass-card border-white/20 focus:ring-primary/30 backdrop-blur-md"
          />
        </div>
      </div>

      {/* Network Status & Actions */}
      <div className="flex items-center gap-4">
        {/* Network Status */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-success/30">
          <span className="status-indicator status-online"></span>
          <span className="text-sm font-medium text-success">Connected</span>
          <span className="text-xs text-muted-foreground">Anvil Local</span>
        </div>

        {/* Action Buttons */}
        <Button variant="ghost" size="sm" className="h-10 w-10 glass-card hover:glass-primary transition-all duration-300">
          <Bell className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="sm" className="h-10 w-10 glass-card hover:glass-primary transition-all duration-300">
          <Settings className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="sm" className="h-10 w-10 glass-card hover:glass-primary transition-all duration-300">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
};

export default AnvilXNavbar;