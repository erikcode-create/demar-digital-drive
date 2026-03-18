import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";


const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground shadow-[var(--shadow-hero)]">
      {/* Top bar with contact info */}
      <div className="bg-primary/90 py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 md:gap-6">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">(775) 230-4767</span>
              <span className="sm:hidden">Call Us</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>info@DeMarTransportation.com</span>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>US Based</span>
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
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/d409271f-b234-4ccb-a60d-5adacce24eb6.png" alt="DeMar Transportation logo" className="h-8 w-8 md:h-12 md:w-12" />
            <div>
              <h1 className="text-lg md:text-xl font-bold">DeMar Transportation</h1>
              <p className="text-xs md:text-sm text-primary-foreground/80 hidden sm:block">Professional Freight Transportation</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-8">
            <a href="#services" className="hidden md:block hover:text-accent transition-colors font-medium">Services</a>
            <a href="#about" className="hidden md:block hover:text-accent transition-colors font-medium">About</a>
            <a href="#contact" className="hidden md:block hover:text-accent transition-colors font-medium">Contact</a>
            <Button variant="cta" size="sm" className="md:size-lg" asChild>
              <Link to="/quote">
                <span className="hidden sm:inline">Request Quote</span>
                <span className="sm:hidden">Quote</span>
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;