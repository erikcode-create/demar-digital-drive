import { 
  Home, 
  Truck, 
  Package, 
  MapPin, 
  Users, 
  FileText, 
  Mail, 
  Phone,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: "Home", href: "#home" },
    { icon: Truck, label: "Services", href: "#services" },
    { icon: Package, label: "Track Shipment", href: "#track" },
    { icon: MapPin, label: "Coverage Area", href: "#coverage" },
    { icon: Users, label: "About Us", href: "#about" },
    { icon: FileText, label: "Get Quote", href: "#quote" },
    { icon: Mail, label: "Contact", href: "#contact" },
    { icon: Phone, label: "Call Now", href: "tel:7752304767" },
    { icon: Settings, label: "Services", href: "#services-detail" }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-primary/95 backdrop-blur-sm z-50 flex flex-col items-center py-4 shadow-2xl">
      <TooltipProvider>
        <div className="flex flex-col gap-2">
          {menuItems.map((item, index) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 text-primary-foreground hover:bg-primary-foreground/10 hover:text-accent transition-all duration-200 rounded-full"
                  onClick={() => {
                    if (item.href.startsWith('#')) {
                      const element = document.querySelector(item.href);
                      element?.scrollIntoView({ behavior: 'smooth' });
                    } else if (item.href.startsWith('tel:')) {
                      window.location.href = item.href;
                    }
                  }}
                >
                  <item.icon className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-primary text-primary-foreground">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default Sidebar;