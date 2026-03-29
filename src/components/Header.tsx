import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-primary-foreground shadow-[var(--shadow-hero)]">
      {/* Top bar with contact info */}
      <div className="bg-primary/90 py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 md:gap-6">
            <a href="tel:+17752304767" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">(775) 230-4767</span>
              <span className="sm:hidden">Call Us</span>
            </a>
            <a href="mailto:info@DeMarTransportation.com" className="hidden md:flex items-center gap-2 hover:text-accent transition-colors">
              <Mail className="h-4 w-4" />
              <span>info@DeMarTransportation.com</span>
            </a>
            <div className="hidden lg:flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Reno, NV</span>
            </div>
          </div>
          <div className="flex gap-2 md:gap-4">
            <Button variant="nav" size="sm" asChild>
              <a href="https://portal.demartransportation.com">
                <LogIn className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Login</span>
                <span className="sm:hidden">Login</span>
              </a>
            </Button>
            <Button variant="nav" size="sm" className="hidden sm:inline-flex">Track Shipment</Button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="py-4 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img src="/demar-logo-official.png" alt="DeMar Transportation logo" className="h-8 w-8 md:h-12 md:w-12" />
            <div>
              <span className="text-lg md:text-xl font-bold">DeMar Transportation</span>
              <p className="text-xs md:text-sm text-primary-foreground/80 hidden sm:block">Professional Freight Transportation</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/about" className="hover:text-accent transition-colors font-medium">About</Link>
            <div className="relative group">
              <span className="hover:text-accent transition-colors font-medium cursor-pointer">Services</span>
              <div className="absolute top-full left-0 mt-2 w-56 bg-primary border border-primary-foreground/20 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="py-2">
                  <Link to="/services/dry-van" className="block px-4 py-2 hover:bg-primary-foreground/10 hover:text-accent transition-colors">Dry Van</Link>
                  <Link to="/services/reefer" className="block px-4 py-2 hover:bg-primary-foreground/10 hover:text-accent transition-colors">Reefer</Link>
                  <Link to="/services/flatbed" className="block px-4 py-2 hover:bg-primary-foreground/10 hover:text-accent transition-colors">Flatbed</Link>
                  <Link to="/services/box-truck" className="block px-4 py-2 hover:bg-primary-foreground/10 hover:text-accent transition-colors">Box Truck</Link>
                  <Link to="/services/sprinter-van" className="block px-4 py-2 hover:bg-primary-foreground/10 hover:text-accent transition-colors">Sprinter Van</Link>
                  <Link to="/services/hazmat" className="block px-4 py-2 hover:bg-primary-foreground/10 hover:text-accent transition-colors">Hazmat/Fuel</Link>
                  <div className="border-t border-primary-foreground/20 my-1"></div>
                  <Link to="/services/ftl" className="block px-4 py-2 hover:bg-primary-foreground/10 hover:text-accent transition-colors">Full Truckload (FTL)</Link>
                  <Link to="/services/ltl" className="block px-4 py-2 hover:bg-primary-foreground/10 hover:text-accent transition-colors">Less Than Truckload (LTL)</Link>
                  <Link to="/services/3pl" className="block px-4 py-2 hover:bg-primary-foreground/10 hover:text-accent transition-colors">3PL Services</Link>
                  <Link to="/services/warehousing" className="block px-4 py-2 hover:bg-primary-foreground/10 hover:text-accent transition-colors">Warehousing</Link>
                </div>
              </div>
            </div>
            <Link to="/careers" className="hover:text-accent transition-colors font-medium">Careers</Link>
            <Link to="/contact" className="hover:text-accent transition-colors font-medium">Contact</Link>
            <Button variant="cta" size="sm" className="md:size-lg" asChild>
              <Link to="/quote">Request Quote</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <Button variant="cta" size="sm" asChild>
              <Link to="/quote">Quote</Link>
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:text-accent transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 border-t border-primary-foreground/20 pt-4 pb-2">
            <div className="flex flex-col gap-3">
              <Link to="/about" className="hover:text-accent transition-colors font-medium py-1" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <div className="font-medium py-1">Services</div>
              <div className="pl-4 flex flex-col gap-2">
                <Link to="/services/dry-van" className="hover:text-accent transition-colors text-sm py-1" onClick={() => setMobileMenuOpen(false)}>Dry Van</Link>
                <Link to="/services/reefer" className="hover:text-accent transition-colors text-sm py-1" onClick={() => setMobileMenuOpen(false)}>Reefer</Link>
                <Link to="/services/flatbed" className="hover:text-accent transition-colors text-sm py-1" onClick={() => setMobileMenuOpen(false)}>Flatbed</Link>
                <Link to="/services/box-truck" className="hover:text-accent transition-colors text-sm py-1" onClick={() => setMobileMenuOpen(false)}>Box Truck</Link>
                <Link to="/services/sprinter-van" className="hover:text-accent transition-colors text-sm py-1" onClick={() => setMobileMenuOpen(false)}>Sprinter Van</Link>
                <Link to="/services/hazmat" className="hover:text-accent transition-colors text-sm py-1" onClick={() => setMobileMenuOpen(false)}>Hazmat/Fuel</Link>
              </div>
              <Link to="/careers" className="hover:text-accent transition-colors font-medium py-1" onClick={() => setMobileMenuOpen(false)}>Careers</Link>
              <Link to="/contact" className="hover:text-accent transition-colors font-medium py-1" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              <Link to="/faq" className="hover:text-accent transition-colors font-medium py-1" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;