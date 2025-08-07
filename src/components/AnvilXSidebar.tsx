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
    <div className={`glass-card border-r border-border/50 transition-all duration-300 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-glass ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Collapse Toggle */}
      <div className={`${collapsed ? 'p-2' : 'p-4'} border-b border-border/50`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full ${collapsed ? 'justify-center px-0' : 'justify-start'}`}
        >
          <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          {!collapsed && <span className="ml-2 text-sm">Collapse</span>}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className={`flex-1 ${collapsed ? 'p-2' : 'p-4'} space-y-2`}>
        {sidebarItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.label}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full h-11 transition-all duration-200 ${
                collapsed ? 'justify-center px-0' : 'justify-start'
              } ${
                isActive 
                  ? 'bg-foreground/10 text-foreground border border-foreground/20' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className={`h-5 w-5 ${getIconColor(index)} ${collapsed ? '' : 'mr-0'}`} />
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