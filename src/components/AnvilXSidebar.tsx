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
    <div className={`glass-sidebar transition-all duration-300 flex flex-col ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Collapse Toggle */}
      <div className="p-4 border-b border-white/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-start glass-card hover:glass-primary transition-all duration-300"
        >
          <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          {!collapsed && <span className="ml-2 text-sm font-medium">Collapse</span>}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.label}
              variant="ghost"
              className={`w-full justify-start h-12 transition-all duration-300 mb-2 ${
                isActive 
                  ? 'glass-primary text-white shadow-lg scale-105' 
                  : 'glass-card hover:glass-primary hover:scale-105'
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
        <div className="p-4 border-t border-white/10">
          <div className="glass-card p-3 rounded-xl">
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Node Info</p>
              <p>Foundry Anvil</p>
              <p className="text-primary">Version 0.2.0</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnvilXSidebar;