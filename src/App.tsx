import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnvilProvider } from "@/contexts/AnvilContext";
import Index from "./pages/Index";
import AccountsPage from "./pages/AccountsPage";
import BlocksPage from "./pages/BlocksPage";
import TransactionsPage from "./pages/TransactionsPage";
import ContractsPage from "./pages/ContractsPage";
import ToolsPage from "./pages/ToolsPage";
import Playground from "./pages/Playground";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AnvilProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/blocks" element={<BlocksPage />} />
<Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/contracts" element={<ContractsPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/playground" element={<Playground />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AnvilProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
