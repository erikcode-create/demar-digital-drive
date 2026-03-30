import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Menu, X, LogIn, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";

/* ── Data ─────────────────────────────────────────────────────────── */

const equipmentServices = [
  { name: "Dry Van", desc: "Enclosed trailers for standard dry freight", path: "/services/dry-van" },
  { name: "Reefer", desc: "Temperature-controlled for perishable cargo", path: "/services/reefer" },
  { name: "Flatbed", desc: "Open deck for oversized & heavy loads", path: "/services/flatbed" },
  { name: "Box Truck", desc: "Mid-size enclosed for regional deliveries", path: "/services/box-truck" },
  { name: "Sprinter Van", desc: "Expedited small-shipment delivery", path: "/services/sprinter-van" },
  { name: "Hazmat", desc: "DOT-compliant hazardous materials transport", path: "/services/hazmat" },
];

const solutionsServices = [
  { name: "Full Truckload (FTL)", desc: "Dedicated capacity for large shipments", path: "/services/ftl" },
  { name: "Less Than Truckload (LTL)", desc: "Cost-effective shared trailer space", path: "/services/ltl" },
  { name: "3PL Services", desc: "End-to-end logistics management", path: "/services/3pl" },
  { name: "Warehousing", desc: "Scalable storage & distribution", path: "/services/warehousing" },
];

const guidesResources = [
  { name: "How Much Does Freight Cost?", desc: "2026 pricing guide with per-mile rates", path: "/resources/freight-shipping-cost" },
  { name: "How to Get a Freight Quote", desc: "Step-by-step guide to requesting quotes", path: "/resources/how-to-get-freight-quote" },
  { name: "FTL vs LTL: How to Choose", desc: "Find the right method for your load", path: "/resources/ftl-vs-ltl" },
  { name: "How to Choose a Carrier", desc: "Checklist for evaluating freight carriers", path: "/resources/how-to-choose-freight-carrier" },
  { name: "Freight Classes Explained", desc: "NMFC classes and how they affect pricing", path: "/resources/freight-classes-explained" },
  { name: "Types of Freight Trailers", desc: "Compare every trailer type side by side", path: "/resources/types-of-freight-trailers" },
];

const learnResources = [
  { name: "How to Ship Freight", desc: "Complete beginner's shipping walkthrough", path: "/resources/how-to-ship-freight" },
  { name: "Dry Van vs Reefer", desc: "Which trailer fits your cargo?", path: "/resources/dry-van-vs-reefer" },
  { name: "Hot Shot vs Full Truckload", desc: "Speed vs cost trade-offs explained", path: "/resources/hot-shot-vs-full-truckload" },
  { name: "Shipping Refrigerated Goods", desc: "Cold chain best practices", path: "/resources/how-to-ship-refrigerated-goods" },
  { name: "Shipping Hazardous Materials", desc: "DOT regulations & compliance", path: "/resources/how-to-ship-hazardous-materials" },
  { name: "Broker vs Carrier vs 3PL", desc: "Understand who does what", path: "/resources/broker-vs-carrier-vs-3pl" },
  { name: "Seasonal Freight Shipping", desc: "Navigate peak season pricing", path: "/resources/seasonal-freight-shipping" },
  { name: "Freight Shipping Glossary", desc: "50+ logistics terms defined", path: "/resources/freight-shipping-glossary" },
  { name: "Oversized Load Shipping", desc: "Permits, pilots & regulations", path: "/resources/oversized-load-shipping" },
];

const companyLinks = [
  { name: "About Us", desc: "Our story, mission & values", path: "/about" },
  { name: "Careers", desc: "Join the DeMar team", path: "/careers" },
  { name: "Contact", desc: "Get in touch with our team", path: "/contact" },
  { name: "FAQ", desc: "Frequently asked questions", path: "/faq" },
];

/* ── Types ────────────────────────────────────────────────────────── */

type MegaPanel = "services" | "resources" | "company" | null;

/* ── Component ────────────────────────────────────────────────────── */

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activePanel, setActivePanel] = useState<MegaPanel>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mega menu on route change via click
  const closeMega = useCallback(() => setActivePanel(null), []);
  const closeMobile = useCallback(() => {
    setMobileMenuOpen(false);
    setMobileAccordion(null);
  }, []);

  const handleEnter = useCallback((panel: MegaPanel) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActivePanel(panel);
  }, []);

  const handleLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setActivePanel(null), 150);
  }, []);

  const toggleMobileAccordion = (key: string) => {
    setMobileAccordion((prev) => (prev === key ? null : key));
  };

  /* ── Shared sub-components ────────────────────────────────────── */

  const MegaItem = ({ name, desc, path }: { name: string; desc: string; path: string }) => (
    <Link
      to={path}
      onClick={closeMega}
      className="group block px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
    >
      <span className="text-sm font-medium text-white group-hover:text-white transition-colors">{name}</span>
      <span className="block text-xs text-white/50 mt-0.5 leading-snug">{desc}</span>
    </Link>
  );

  const ColumnLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[hsl(var(--accent))] mb-2 px-3">
      {children}
    </p>
  );

  const NavTrigger = ({ label, panel }: { label: string; panel: MegaPanel }) => (
    <div
      onMouseEnter={() => handleEnter(panel)}
      onMouseLeave={handleLeave}
    >
      <button
        className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
          activePanel === panel
            ? "text-white bg-white/5"
            : "text-white/80 hover:text-white hover:bg-white/5"
        }`}
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            activePanel === panel ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );

  /* ── Mega panels ──────────────────────────────────────────────── */

  const panelBase =
    "absolute top-full left-0 right-0 transition-all duration-200 pointer-events-none";
  const panelInner =
    "container mx-auto bg-[hsl(225_97%_4%)] border border-white/10 rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-auto";
  const panelVisible = "opacity-100 visible translate-y-0";
  const panelHidden = "opacity-0 invisible -translate-y-2";

  const ServicesMega = (
    <div
      className={`${panelBase} pt-2 ${activePanel === "services" ? panelVisible : panelHidden}`}
      onMouseEnter={() => handleEnter("services")}
      onMouseLeave={handleLeave}
    >
      <div className={panelInner}>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <ColumnLabel>Equipment</ColumnLabel>
            <div className="grid grid-cols-1 gap-0.5">
              {equipmentServices.map((s) => (
                <MegaItem key={s.path} {...s} />
              ))}
            </div>
          </div>
          <div>
            <ColumnLabel>Solutions</ColumnLabel>
            <div className="grid grid-cols-1 gap-0.5">
              {solutionsServices.map((s) => (
                <MegaItem key={s.path} {...s} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ResourcesMega = (
    <div
      className={`${panelBase} pt-2 ${activePanel === "resources" ? panelVisible : panelHidden}`}
      onMouseEnter={() => handleEnter("resources")}
      onMouseLeave={handleLeave}
    >
      <div className={panelInner}>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <ColumnLabel>Guides</ColumnLabel>
            <div className="grid grid-cols-1 gap-0.5">
              {guidesResources.map((r) => (
                <MegaItem key={r.path} {...r} />
              ))}
            </div>
          </div>
          <div>
            <ColumnLabel>Learn</ColumnLabel>
            <div className="grid grid-cols-1 gap-0.5">
              {learnResources.map((r) => (
                <MegaItem key={r.path} {...r} />
              ))}
            </div>
            <div className="mt-3 px-3">
              <Link
                to="/resources"
                onClick={closeMega}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--accent))] hover:text-white transition-colors"
              >
                View All Resources
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CompanyMega = (
    <div
      className={`${panelBase} pt-2 ${activePanel === "company" ? panelVisible : panelHidden}`}
      onMouseEnter={() => handleEnter("company")}
      onMouseLeave={handleLeave}
    >
      <div className={`${panelInner} max-w-sm`}>
        <ColumnLabel>Company</ColumnLabel>
        <div className="grid grid-cols-1 gap-0.5">
          {companyLinks.map((c) => (
            <MegaItem key={c.path} {...c} />
          ))}
        </div>
      </div>
    </div>
  );

  /* ── Mobile accordion section ─────────────────────────────────── */

  const MobileSection = ({
    label,
    sectionKey,
    children,
  }: {
    label: string;
    sectionKey: string;
    children: React.ReactNode;
  }) => (
    <div>
      <button
        onClick={() => toggleMobileAccordion(sectionKey)}
        className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            mobileAccordion === sectionKey ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          mobileAccordion === sectionKey ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pl-4 pb-2">{children}</div>
      </div>
    </div>
  );

  const MobileLinkItem = ({ name, desc, path }: { name: string; desc: string; path: string }) => (
    <Link
      to={path}
      onClick={closeMobile}
      className="block px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
    >
      <span className="text-sm text-white/80">{name}</span>
      <span className="block text-xs text-white/40 mt-0.5">{desc}</span>
    </Link>
  );

  const MobileSectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[hsl(var(--accent))] mb-1 mt-2 px-3">
      {children}
    </p>
  );

  /* ── Render ───────────────────────────────────────────────────── */

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-[var(--shadow-float)]" : ""
      }`}
    >
      {/* Top info bar */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
        }`}
      >
        <div className="bg-[hsl(225_97%_4%)] py-2 px-4">
          <div className="container mx-auto flex justify-between items-center text-xs tracking-wide text-white/70">
            <div className="flex items-center gap-6">
              <a
                href="tel:+17752304767"
                className="flex items-center gap-2 hover:text-[hsl(var(--accent))] transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">(775) 230-4767</span>
                <span className="sm:hidden">Call</span>
              </a>
              <a
                href="mailto:info@DeMarTransportation.com"
                className="hidden md:flex items-center gap-2 hover:text-[hsl(var(--accent))] transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>info@DeMarTransportation.com</span>
              </a>
              <div className="hidden lg:flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>Reno, NV</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://portal.demartransportation.com"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Login</span>
              </a>
              <span className="hidden sm:inline text-white/30">|</span>
              <span className="hidden sm:inline hover:text-white transition-colors cursor-pointer">
                Track Shipment
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav
        className={`px-4 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-[hsl(220_85%_15%/0.95)] backdrop-blur-xl"
            : "py-4 bg-[hsl(220_85%_15%)]"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center relative">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/demar-logo-official.png"
              alt="DeMar Transportation logo"
              className={`transition-all duration-300 ${
                scrolled ? "h-8 w-8" : "h-10 w-10 md:h-12 md:w-12"
              }`}
            />
            <div>
              <span className="text-lg md:text-xl font-bold text-white tracking-tight">
                DeMar
                <span className="text-[hsl(var(--accent))]"> Transportation</span>
              </span>
              <p className="text-[10px] md:text-xs text-white/50 tracking-[0.15em] uppercase hidden sm:block">
                Professional Freight Solutions
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            <NavTrigger label="Services" panel="services" />
            <NavTrigger label="Resources" panel="resources" />

            <Link
              to="/blog"
              onMouseEnter={() => handleEnter(null)}
              className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Insights
            </Link>

            <NavTrigger label="Company" panel="company" />

            <div className="ml-4">
              <Button variant="cta" size="sm" asChild>
                <Link to="/quote" className="font-semibold tracking-wide">
                  Request Quote
                </Link>
              </Button>
            </div>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-3 lg:hidden">
            <Button variant="cta" size="sm" asChild>
              <Link to="/quote">Quote</Link>
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white/80 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Desktop mega menu panels (rendered inside nav for positioning) */}
        <div className="hidden lg:block relative">
          {ServicesMega}
          {ResourcesMega}
          {CompanyMega}
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileMenuOpen ? "max-h-[2000px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-1">
            {/* Services accordion */}
            <MobileSection label="Services" sectionKey="services">
              <MobileSectionLabel>Equipment</MobileSectionLabel>
              {equipmentServices.map((s) => (
                <MobileLinkItem key={s.path} {...s} />
              ))}
              <MobileSectionLabel>Solutions</MobileSectionLabel>
              {solutionsServices.map((s) => (
                <MobileLinkItem key={s.path} {...s} />
              ))}
            </MobileSection>

            {/* Resources accordion */}
            <MobileSection label="Resources" sectionKey="resources">
              <MobileSectionLabel>Guides</MobileSectionLabel>
              {guidesResources.map((r) => (
                <MobileLinkItem key={r.path} {...r} />
              ))}
              <MobileSectionLabel>Learn</MobileSectionLabel>
              {learnResources.slice(0, 4).map((r) => (
                <MobileLinkItem key={r.path} {...r} />
              ))}
              <Link
                to="/resources"
                onClick={closeMobile}
                className="block px-3 py-2.5 text-sm font-medium text-[hsl(var(--accent))] hover:text-white transition-colors"
              >
                View All Resources &rarr;
              </Link>
            </MobileSection>

            {/* Insights (simple link) */}
            <Link
              to="/blog"
              className="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={closeMobile}
            >
              Insights
            </Link>

            {/* Company accordion */}
            <MobileSection label="Company" sectionKey="company">
              {companyLinks.map((c) => (
                <MobileLinkItem key={c.path} {...c} />
              ))}
            </MobileSection>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
