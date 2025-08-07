import { Settings, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const AnvilXNavbar = () => {
  return (
    <nav className="h-16 glass-card border-b border-border/50 flex items-center justify-end px-6 shadow-glass">

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