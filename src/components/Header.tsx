import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Menu, X, LogIn, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const equipmentServices = [
  { name: "Dry Van", path: "/services/dry-van" },
  { name: "Reefer", path: "/services/reefer" },
  { name: "Flatbed", path: "/services/flatbed" },
  { name: "Box Truck", path: "/services/box-truck" },
  { name: "Sprinter Van", path: "/services/sprinter-van" },
  { name: "Hazmat/Fuel", path: "/services/hazmat" },
];

const logisticsServices = [
  { name: "Full Truckload (FTL)", path: "/services/ftl" },
  { name: "Less Than Truckload (LTL)", path: "/services/ltl" },
  { name: "3PL Services", path: "/services/3pl" },
  { name: "Warehousing", path: "/services/warehousing" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "shadow-[var(--shadow-float)]"
          : ""
      }`}
    >
      {/* Top info bar — slim, gradient background */}
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

      {/* Main navigation — glassmorphism on scroll */}
      <nav
        className={`px-4 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-[hsl(220_85%_15%/0.95)] backdrop-blur-xl"
            : "py-4 bg-[hsl(220_85%_15%)]"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center">
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
            <Link
              to="/about"
              className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              About
            </Link>

            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                Services
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    servicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${
                  servicesOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }`}
              >
                <div className="w-80 bg-[hsl(225_97%_4%/0.92)] backdrop-blur-2xl rounded-xl p-4 shadow-[var(--shadow-float)]">
                  {/* Equipment */}
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[hsl(var(--accent))] mb-2 px-2">
                    Equipment
                  </p>
                  <div className="grid grid-cols-2 gap-0.5 mb-3">
                    {equipmentServices.map((s) => (
                      <Link
                        key={s.path}
                        to={s.path}
                        className="px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        {s.name}
                      </Link>
                    ))}
                  </div>

                  {/* Logistics */}
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[hsl(var(--accent))] mb-2 px-2">
                    Logistics
                  </p>
                  <div className="grid grid-cols-1 gap-0.5">
                    {logisticsServices.map((s) => (
                      <Link
                        key={s.path}
                        to={s.path}
                        className="px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        {s.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/resources"
              className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Resources
            </Link>
            <Link
              to="/careers"
              className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Careers
            </Link>
            <Link
              to="/contact"
              className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Contact
            </Link>

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

        {/* Mobile menu — full-width glassmorphism panel */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileMenuOpen ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-1">
            <Link
              to="/about"
              className="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>

            <div className="px-4 py-2">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[hsl(var(--accent))] mb-2">
                Equipment
              </p>
              {equipmentServices.map((s) => (
                <Link
                  key={s.path}
                  to={s.path}
                  className="block py-2 pl-3 text-sm text-white/60 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {s.name}
                </Link>
              ))}
            </div>

            <div className="px-4 py-2">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[hsl(var(--accent))] mb-2">
                Logistics
              </p>
              {logisticsServices.map((s) => (
                <Link
                  key={s.path}
                  to={s.path}
                  className="block py-2 pl-3 text-sm text-white/60 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {s.name}
                </Link>
              ))}
            </div>

            <Link
              to="/resources"
              className="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Resources
            </Link>
            <Link
              to="/careers"
              className="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Careers
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/faq"
              className="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
