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
    <div className={`bg-card border-r border-border transition-all duration-300 flex flex-col ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Collapse Toggle */}
      <div className="p-4 border-b border-border">
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
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                  : 'hover:bg-secondary/80'
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
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">Node Info</p>
            <p>Local Development</p>
            <p>Version 2.14.1</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnvilXSidebar;