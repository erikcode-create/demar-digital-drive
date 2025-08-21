import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";


const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground shadow-[var(--shadow-hero)]">
      {/* Top bar with contact info */}
      <div className="bg-primary/90 py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>(775) 230-4767</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>info@DeMarTransportation.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>US Based</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="nav" size="sm">Login</Button>
            <Button variant="nav" size="sm">Track Shipment</Button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="py-4 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/d409271f-b234-4ccb-a60d-5adacce24eb6.png" alt="DeMar Transportation logo" className="h-12 w-12" />
            <div>
              <h1 className="text-xl font-bold">DeMar Transportation</h1>
              <p className="text-sm text-primary-foreground/80">Professional Freight Transportation</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <a href="#services" className="hover:text-accent transition-colors font-medium">Services</a>
            <a href="#about" className="hover:text-accent transition-colors font-medium">About</a>
            <a href="#contact" className="hover:text-accent transition-colors font-medium">Contact</a>
            <Button variant="cta" size="lg" asChild>
              <Link to="/quote">Request Quote</Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;