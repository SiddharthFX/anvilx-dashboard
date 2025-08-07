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
import React from "react";
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

  const getIconColor = (index: number) => {
    const colors = ['icon-blue', 'icon-green', 'icon-purple', 'icon-orange', 'icon-red', 'icon-teal'];
    return colors[index % colors.length];
  };

  // Update CSS variable for main content margin
  React.useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', collapsed ? '64px' : '256px');
  }, [collapsed]);

  return (
    <div className={`modern-card border-r border-border/50 transition-all duration-300 flex flex-col h-screen fixed left-0 top-0 z-50 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-hsl(var(--dashboard-accent))/20 flex items-center justify-center">
                <span className="text-[hsl(var(--dashboard-accent))] font-bold text-lg">A</span>
              </div>
              <div>
                <h2 className="font-bold text-foreground">AnvilX</h2>
                <p className="text-xs text-muted-foreground">Foundry Monitor</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Collapse Toggle */}
      <div className="px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-start glass-accent"
        >
          <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          {!collapsed && <span className="ml-2 text-sm">Collapse</span>}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.label}
              variant="ghost"
              className={`w-full justify-start h-12 transition-all duration-200 rounded-xl ${
                isActive 
                  ? 'bg-hsl(var(--dashboard-accent))/10 text-[hsl(var(--dashboard-accent))] border border-hsl(var(--dashboard-accent))/20 shadow-lg' 
                  : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-[hsl(var(--dashboard-accent))]' : getIconColor(index)}`} />
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
          <div className="glass-accent p-3 rounded-xl">
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground">AnvilX v1.0</p>
              <p className="mt-1">Foundry Monitor</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnvilXSidebar;