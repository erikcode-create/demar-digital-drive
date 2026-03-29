import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import QuoteRequest from "./pages/QuoteRequest";
import CustomerPortal from "./pages/CustomerPortal";
import Privacy from "./pages/Privacy";
import Support from "./pages/Support";

// Lazy-loaded pages for code splitting
const AboutPage = lazy(() => import("./pages/AboutPage"));
const Careers = lazy(() => import("./pages/Careers"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const DryVan = lazy(() => import("./pages/services/DryVan"));
const Reefer = lazy(() => import("./pages/services/Reefer"));
const Flatbed = lazy(() => import("./pages/services/Flatbed"));
const BoxTruck = lazy(() => import("./pages/services/BoxTruck"));
const SprinterVan = lazy(() => import("./pages/services/SprinterVan"));
const Hazmat = lazy(() => import("./pages/services/Hazmat"));
const ThirdPartyLogistics = lazy(() => import("./pages/services/ThirdPartyLogistics"));
const Warehousing = lazy(() => import("./pages/services/Warehousing"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/services/dry-van" element={<DryVan />} />
              <Route path="/services/reefer" element={<Reefer />} />
              <Route path="/services/flatbed" element={<Flatbed />} />
              <Route path="/services/box-truck" element={<BoxTruck />} />
              <Route path="/services/sprinter-van" element={<SprinterVan />} />
              <Route path="/services/hazmat" element={<Hazmat />} />
              <Route path="/quote" element={<QuoteRequest />} />
              <Route path="/portal" element={<CustomerPortal />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/support" element={<Support />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
