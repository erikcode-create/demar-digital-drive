import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/demar-logo-official.png" alt="DeMar Transportation" className="h-12 w-12" />
              <div>
                <h3 className="text-xl font-bold">DeMar Transportation</h3>
                <p className="text-primary-foreground/80 text-sm">Professional Freight Transportation</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              DeMar Transportation is a US-based freight carrier providing safe,
              reliable, and competitive transportation solutions across America.
            </p>
            <Button variant="cta" size="lg" asChild>
              <Link to="/quote">Get Quote Now</Link>
            </Button>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><Link to="/services/dry-van" className="hover:text-accent transition-colors">Dry Van</Link></li>
              <li><Link to="/services/reefer" className="hover:text-accent transition-colors">Reefer (Temperature Controlled)</Link></li>
              <li><Link to="/services/flatbed" className="hover:text-accent transition-colors">Flatbed</Link></li>
              <li><Link to="/services/box-truck" className="hover:text-accent transition-colors">Box Truck</Link></li>
              <li><Link to="/services/sprinter-van" className="hover:text-accent transition-colors">Sprinter Van</Link></li>
              <li><Link to="/services/hazmat" className="hover:text-accent transition-colors">Hazmat/Fuel</Link></li>
              <li><Link to="/services/ftl" className="hover:text-accent transition-colors">Full Truckload (FTL)</Link></li>
              <li><Link to="/services/ltl" className="hover:text-accent transition-colors">LTL Shipping</Link></li>
              <li><Link to="/services/3pl" className="hover:text-accent transition-colors">3PL Services</Link></li>
              <li><Link to="/services/warehousing" className="hover:text-accent transition-colors">Warehousing</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-primary-foreground/80">
              <a href="tel:+17752304767" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Phone className="h-4 w-4" />
                <span>(775) 230-4767</span>
              </a>
              <a href="mailto:info@DeMarTransportation.com" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Mail className="h-4 w-4" />
                <span>info@DeMarTransportation.com</span>
              </a>
              <Link to="/contact" className="flex items-center gap-2 hover:text-accent transition-colors">
                <MapPin className="h-4 w-4" />
                <span>10471 Double R Blvd, Reno, NV 89521</span>
              </Link>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>24/7 Service Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="border-t border-primary-foreground/20 pt-8 mb-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-primary-foreground/80">
            <Link to="/about" className="hover:text-accent transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-accent transition-colors">Contact</Link>
            <Link to="/careers" className="hover:text-accent transition-colors">Careers</Link>
            <Link to="/faq" className="hover:text-accent transition-colors">FAQ</Link>
            <Link to="/quote" className="hover:text-accent transition-colors">Get a Quote</Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © {new Date().getFullYear()} DeMar Transportation. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-primary-foreground/60">
              <Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
              <Link to="/support" className="hover:text-accent transition-colors">Terms of Service</Link>
              <a href="https://www.carriersource.io/carriers/demar-transportation-4392091" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">DOT Information</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;