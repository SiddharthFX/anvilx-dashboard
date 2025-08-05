import { 
  LayoutDashboard, 
  Users, 
  Blocks, 
  ArrowRightLeft, 
  FileCode, 
  Wrench,
  ChevronLeft
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Overview", path: "/" },
  { icon: Users, label: "Accounts", path: "/accounts" },
  { icon: Blocks, label: "Blocks", path: "/blocks" },
  { icon: ArrowRightLeft, label: "Transactions", path: "/transactions" },
  { icon: FileCode, label: "Contracts", path: "/contracts" },
  { icon: Wrench, label: "Tools", path: "/tools" },
];

const AnvilXSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className={`glass-card border-r border-border/50 transition-all duration-300 flex flex-col ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Collapse Toggle */}
      <div className="p-4 border-b border-border/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-start"
        >
          <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          {!collapsed && <span className="ml-2 text-sm">Collapse</span>}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.label}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start h-11 transition-all duration-200 ${
                isActive 
                  ? 'bg-foreground/10 text-foreground border border-foreground/20' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border/50">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium font-mono">AnvilX</p>
            <p>Foundry Monitor</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnvilXSidebar;