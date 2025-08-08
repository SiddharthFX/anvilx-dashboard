import { useState } from "react";
import { Settings, Bell, User, RefreshCcw, Plug, LogOut, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import ConnectionModal from "@/components/ConnectionModal";
import { useAnvil } from "@/contexts/AnvilContext";

const AnvilXNavbar = () => {
  const [connOpen, setConnOpen] = useState(false);
  const { state, disconnect, refreshData } = useAnvil();

  return (
    <nav className="h-16 glass-card border-b border-border/50 flex items-center justify-end px-6 shadow-glass">
      <TooltipProvider>
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9" aria-label="Notifications">
                    <Bell className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Notifications</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="min-w-56">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-3 text-sm text-muted-foreground">
                No new notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9" aria-label="Settings">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Settings</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="min-w-56">
              <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setConnOpen(true)}>
                <Plug className="mr-2 h-4 w-4" />
                Node Connection…
              </DropdownMenuItem>
              <DropdownMenuItem onClick={refreshData}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Account */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9" aria-label="Account">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Account</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="min-w-56">
              <DropdownMenuLabel className="flex items-center gap-2">
                <UserCircle2 className="h-4 w-4" />
                {state.signer ? "Signer connected" : "Viewer mode"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/accounts">Accounts</Link>
              </DropdownMenuItem>
              {state.isConnected ? (
                <DropdownMenuItem onClick={disconnect}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Disconnect
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => setConnOpen(true)}>
                  <Plug className="mr-2 h-4 w-4" />
                  Connect
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Controlled Connection Modal */}
        <ConnectionModal open={connOpen} onOpenChange={setConnOpen} showTrigger={false} />
      </TooltipProvider>
    </nav>
  );
};

export default AnvilXNavbar;
