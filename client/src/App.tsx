import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import Analysis from "@/pages/Analysis";
import Database from "@/pages/Database";
import MSE from "@/pages/MSE";
import About from "@/pages/About";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/Sidebar";

function Router() {
  return (
    <div className="flex h-screen bg-[var(--dark-bg)]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/analysis" component={Analysis} />
          <Route path="/database" component={Database} />
          <Route path="/mse" component={MSE} />
          <Route path="/about" component={About} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
