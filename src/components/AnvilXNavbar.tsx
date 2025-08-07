import { Search, Settings, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AnvilXNavbar = () => {
  return (
    <nav className="h-16 glass-card border-b border-border/50 flex items-center justify-between px-6 shadow-glass">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search blocks, transactions..." 
            className="pl-10 glass-accent border-border/50"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">

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