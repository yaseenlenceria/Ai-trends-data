import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DataProvider } from "@/context/DataContext";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import Home from "@/pages/Home";
import Tool from "@/pages/Tool";
import Submit from "@/pages/Submit";
import Categories from "@/pages/Categories";
import Search from "@/pages/Search";
import Sponsors from "@/pages/Sponsors";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tool/:slug" component={Tool} />
      <Route path="/submit" component={Submit} />
      <Route path="/categories" component={Categories} />
      <Route path="/search" component={Search} />
      <Route path="/sponsors" component={Sponsors} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <DataProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Router />
              </main>
              <MobileNav />
            </div>
            <Toaster />
          </DataProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
