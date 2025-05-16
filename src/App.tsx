import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Tables from "@/pages/Tables";
import Orders from "@/pages/Orders";
import Kitchen from "@/pages/Kitchen";
import Reservations from "@/pages/Reservations";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import FinancesRestaurant from "./pages/FinancesRestaurant";
import FinancesRental from "./pages/FinancesRental";
import Inventory from "./pages/Inventory";
import Rentals from "./pages/Rentals";
import Employees from "./pages/Employees";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";
import { DatabaseTest } from './components/DatabaseTest';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/tables" element={<AppLayout><Tables /></AppLayout>} />
            <Route path="/orders" element={<AppLayout><Orders /></AppLayout>} />
            <Route path="/kitchen" element={<AppLayout><Kitchen /></AppLayout>} />
            <Route path="/reservations" element={<AppLayout><Reservations /></AppLayout>} />
            <Route path="/finances/restaurant" element={<AppLayout><FinancesRestaurant /></AppLayout>} />
            <Route path="/finances/rental" element={<AppLayout><FinancesRental /></AppLayout>} />
            <Route path="/inventory" element={<AppLayout><Inventory /></AppLayout>} />
            <Route path="/rentals" element={<AppLayout><Rentals /></AppLayout>} />
            <Route path="/employees" element={<AppLayout><Employees /></AppLayout>} />
            <Route path="/customers" element={<AppLayout><Customers /></AppLayout>} />
            <Route path="/settings" element={<AppLayout><Settings><DatabaseTest /></Settings></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
