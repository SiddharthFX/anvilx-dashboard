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
import { Button } from "@/components/ui/button";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const sidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Users, label: "Accounts" },
  { icon: Blocks, label: "Blocks" },
  { icon: ArrowRightLeft, label: "Transactions" },
  { icon: FileCode, label: "Contracts" },
  { icon: Wrench, label: "Tools" },
];

const AnvilXSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

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
        {sidebarItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "secondary" : "ghost"}
            className={`w-full justify-start h-11 ${
              item.active 
                ? 'bg-primary/10 text-primary border border-primary/20' 
                : 'hover:bg-secondary/80'
            }`}
          >
            <item.icon className="h-5 w-5" />
            {!collapsed && (
              <span className="ml-3 font-medium">{item.label}</span>
            )}
          </Button>
        ))}
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