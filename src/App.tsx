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
const LTL = lazy(() => import("./pages/services/LTL"));
const FTL = lazy(() => import("./pages/services/FTL"));
const Resources = lazy(() => import("./pages/Resources"));
const FreightShippingCost = lazy(() => import("./pages/resources/FreightShippingCost"));
const HowToGetFreightQuote = lazy(() => import("./pages/resources/HowToGetFreightQuote"));
const HowToChooseFreightCarrier = lazy(() => import("./pages/resources/HowToChooseFreightCarrier"));
const DryVanVsReefer = lazy(() => import("./pages/resources/DryVanVsReefer"));
const FtlVsLtl = lazy(() => import("./pages/resources/FtlVsLtl"));
const HotShotVsFullTruckload = lazy(() => import("./pages/resources/HotShotVsFullTruckload"));
const TypesOfFreightTrailers = lazy(() => import("./pages/resources/TypesOfFreightTrailers"));
const HowToShipFreight = lazy(() => import("./pages/resources/HowToShipFreight"));
const HowToShipRefrigeratedGoods = lazy(() => import("./pages/resources/HowToShipRefrigeratedGoods"));
const HowToShipHazardousMaterials = lazy(() => import("./pages/resources/HowToShipHazardousMaterials"));
const OversizedLoadShipping = lazy(() => import("./pages/resources/OversizedLoadShipping"));
const FreightClassesExplained = lazy(() => import("./pages/resources/FreightClassesExplained"));
const BrokerVsCarrierVs3pl = lazy(() => import("./pages/resources/BrokerVsCarrierVs3pl"));
const FreightShippingGlossary = lazy(() => import("./pages/resources/FreightShippingGlossary"));
const SeasonalFreightShipping = lazy(() => import("./pages/resources/SeasonalFreightShipping"));
const Blog = lazy(() => import("./pages/Blog"));
const WhyFreightQuoteKeepsChanging = lazy(() => import("./pages/blog/WhyFreightQuoteKeepsChanging"));
const SmallBusinessFreightShipping = lazy(() => import("./pages/blog/SmallBusinessFreightShipping"));
const EmergencyExpeditedFreight = lazy(() => import("./pages/blog/EmergencyExpeditedFreight"));
const FreightDamagePrevention = lazy(() => import("./pages/blog/FreightDamagePrevention"));
const EcommerceFreightShipping = lazy(() => import("./pages/blog/EcommerceFreightShipping"));

const RealTimeFreightTracking = lazy(() => import("./pages/blog/RealTimeFreightTracking"));

const FoodBeverageFreightShipping = lazy(() => import("./pages/blog/FoodBeverageFreightShipping"));

const ReverseLogisticsReturnFreight = lazy(() => import("./pages/blog/ReverseLogisticsReturnFreight"));

const DedicatedFleetVsSpotMarket = lazy(() => import("./pages/blog/DedicatedFleetVsSpotMarket"));

const PartialTruckloadPtlShipping = lazy(() => import("./pages/blog/PartialTruckloadPtlShipping"));

const FreightShippingInsuranceCoverage = lazy(() => import("./pages/blog/FreightShippingInsuranceCoverage"));

const WhiteGloveFreightHandling = lazy(() => import("./pages/blog/WhiteGloveFreightHandling"));

const LastMileDeliveryFreightShipping = lazy(() => import("./pages/blog/LastMileDeliveryFreightShipping"));
const LtlFreightShippingNevada = lazy(() => import("./pages/blog/LtlFreightShippingNevada"));

const LtlVsFtlFreightShipping = lazy(() => import("./pages/blog/LtlVsFtlFreightShipping"));

const SupplyChainManagementSmallBusiness = lazy(() => import("./pages/blog/SupplyChainManagementSmallBusiness"));

const RefrigeratedFreightShippingGuide = lazy(() => import("./pages/blog/RefrigeratedFreightShippingGuide"));

const HazmatFreightShippingRequirementsCyud = lazy(() => import("./pages/blog/HazmatFreightShippingRequirementsCyud"));
const FreightShippingRenoNevada = lazy(() => import("./pages/blog/FreightShippingRenoNevada"));
const LtlFreightShippingGuide = lazy(() => import("./pages/blog/LtlFreightShippingGuide"));

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
              <Route path="/services/3pl" element={<ThirdPartyLogistics />} />
              <Route path="/services/warehousing" element={<Warehousing />} />
              <Route path="/services/ltl" element={<LTL />} />
              <Route path="/services/ftl" element={<FTL />} />
              <Route path="/quote" element={<QuoteRequest />} />
              <Route path="/portal" element={<CustomerPortal />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/support" element={<Support />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/freight-shipping-cost" element={<FreightShippingCost />} />
              <Route path="/resources/how-to-get-freight-quote" element={<HowToGetFreightQuote />} />
              <Route path="/resources/how-to-choose-freight-carrier" element={<HowToChooseFreightCarrier />} />
              <Route path="/resources/dry-van-vs-reefer" element={<DryVanVsReefer />} />
              <Route path="/resources/ftl-vs-ltl" element={<FtlVsLtl />} />
              <Route path="/resources/hot-shot-vs-full-truckload" element={<HotShotVsFullTruckload />} />
              <Route path="/resources/types-of-freight-trailers" element={<TypesOfFreightTrailers />} />
              <Route path="/resources/how-to-ship-freight" element={<HowToShipFreight />} />
              <Route path="/resources/how-to-ship-refrigerated-goods" element={<HowToShipRefrigeratedGoods />} />
              <Route path="/resources/how-to-ship-hazardous-materials" element={<HowToShipHazardousMaterials />} />
              <Route path="/resources/oversized-load-shipping" element={<OversizedLoadShipping />} />
              <Route path="/resources/freight-classes-explained" element={<FreightClassesExplained />} />
              <Route path="/resources/broker-vs-carrier-vs-3pl" element={<BrokerVsCarrierVs3pl />} />
              <Route path="/resources/freight-shipping-glossary" element={<FreightShippingGlossary />} />
              <Route path="/resources/seasonal-freight-shipping" element={<SeasonalFreightShipping />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/why-freight-quote-keeps-changing" element={<WhyFreightQuoteKeepsChanging />} />
              <Route path="/blog/small-business-freight-shipping" element={<SmallBusinessFreightShipping />} />
              <Route path="/blog/emergency-expedited-freight" element={<EmergencyExpeditedFreight />} />
              <Route path="/blog/freight-damage-prevention" element={<FreightDamagePrevention />} />
              <Route path="/blog/ecommerce-freight-shipping" element={<EcommerceFreightShipping />} />
              <Route path="/blog/real-time-freight-tracking" element={<RealTimeFreightTracking />} />
              <Route path="/blog/food-beverage-freight-shipping" element={<FoodBeverageFreightShipping />} />
              <Route path="/blog/reverse-logistics-return-freight" element={<ReverseLogisticsReturnFreight />} />
              <Route path="/blog/dedicated-fleet-vs-spot-market" element={<DedicatedFleetVsSpotMarket />} />
              <Route path="/blog/partial-truckload-ptl-shipping" element={<PartialTruckloadPtlShipping />} />
              <Route path="/blog/freight-shipping-insurance-coverage" element={<FreightShippingInsuranceCoverage />} />
              <Route path="/blog/white-glove-freight-handling" element={<WhiteGloveFreightHandling />} />
              <Route path="/blog/last-mile-delivery-freight-shipping" element={<LastMileDeliveryFreightShipping />} />
              <Route path="/blog/ltl-freight-shipping-nevada" element={<LtlFreightShippingNevada />} />
              <Route path="/blog/ltl-vs-ftl-freight-shipping" element={<LtlVsFtlFreightShipping />} />
              <Route path="/blog/supply-chain-management-small-business" element={<SupplyChainManagementSmallBusiness />} />
              <Route path="/blog/refrigerated-freight-shipping-guide" element={<RefrigeratedFreightShippingGuide />} />
              <Route path="/blog/hazmat-freight-shipping-requirements-cyud" element={<HazmatFreightShippingRequirementsCyud />} />
              <Route path="/blog/freight-shipping-reno-nevada" element={<FreightShippingRenoNevada />} />
              <Route path="/blog/ltl-freight-shipping-guide" element={<LtlFreightShippingGuide />} />
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
