import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Verify from "./pages/Verify";
import Compare from "./pages/Compare";
import History from "./pages/History";
import Statistics from "./pages/Statistics";
import Explore from "./pages/Explore";
import About from "./pages/About";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dogrula" element={<Verify />} />
            <Route path="/karsilastir" element={<Compare />} />
            <Route path="/gecmis" element={<History />} />
            <Route path="/istatistikler" element={<Statistics />} />
            <Route path="/kesfet" element={<Explore />} />
            <Route path="/hakkinda" element={<About />} />
            <Route path="/favoriler" element={<Favorites />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
