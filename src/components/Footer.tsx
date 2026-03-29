import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/lovable-uploads/d409271f-b234-4ccb-a60d-5adacce24eb6.png" alt="DeMar Transportation" className="h-12 w-12" />
              <div>
                <h3 className="text-xl font-bold">DeMar Transportation</h3>
                <p className="text-primary-foreground/80 text-sm">Professional Freight Transportation</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              DeMar Transportation is a US-based freight carrier providing safe, 
              reliable, and competitive transportation solutions across America.
            </p>
            <Button variant="cta" size="lg">
              Get Quote Now
            </Button>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>Dry Van</li>
              <li>Reefer (Temperature Controlled)</li>
              <li>Flatbed</li>
              <li>Box Truck</li>
              <li>Sprinter Van</li>
              <li>Hazmat/Fuel</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-primary-foreground/80">
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
                <span>US Based Operations</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>24/7 Service Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © {new Date().getFullYear()} DeMar Transportation. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-primary-foreground/60">
              <a href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="/support" className="hover:text-accent transition-colors">Terms of Service</a>
              <a href="https://www.carriersource.io/carriers/demar-transportation-4392091" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">DOT Information</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;