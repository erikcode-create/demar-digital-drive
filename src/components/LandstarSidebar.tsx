import { useState } from "react";
import { 
  ChevronDown, 
  ChevronRight,
  Truck,
  Package,
  MapPin,
  Users,
  FileText,
  Phone,
  Building,
  ShieldCheck,
  Clock,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const LandstarSidebar = () => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const handleMouseEnter = (section: string) => {
    setHoveredSection(section);
  };

  const handleMouseLeave = () => {
    setHoveredSection(null);
  };

  const menuSections = [
    {
      id: "services",
      icon: <Truck className="h-5 w-5" />,
      title: "Transportation Services",
      items: [
        { title: "Dry Van", description: "Standard enclosed trailer service" },
        { title: "Reefer", description: "Temperature controlled shipping" },
        { title: "Flatbed", description: "Open deck transportation" },
        { title: "Box Truck", description: "Local and regional delivery" },
        { title: "Sprinter Van", description: "Expedited small shipments" },
        { title: "Hazmat/Fuel", description: "Specialized hazardous materials" }
      ]
    },
    {
      id: "tracking",
      icon: <Package className="h-5 w-5" />,
      title: "Track & Manage",
      items: [
        { title: "Track Shipment", description: "Real-time shipment tracking" },
        { title: "Delivery Updates", description: "Live delivery notifications" },
        { title: "Proof of Delivery", description: "Electronic delivery confirmation" },
        { title: "Shipment History", description: "View past shipments" }
      ]
    },
    {
      id: "company",
      icon: <Building className="h-5 w-5" />,
      title: "Company Information",
      items: [
        { title: "About DeMar", description: "Our company story and values" },
        { title: "Safety Record", description: "DOT compliance and safety stats" },
        { title: "Coverage Area", description: "Service territory map" },
        { title: "Fleet Information", description: "Our trucks and equipment" }
      ]
    },
    {
      id: "resources",
      icon: <FileText className="h-5 w-5" />,
      title: "Resources & Tools",
      items: [
        { title: "Get Quote", description: "Request shipping quote" },
        { title: "Rate Calculator", description: "Estimate shipping costs" },
        { title: "Shipping Guide", description: "How to prepare shipments" },
        { title: "Insurance Info", description: "Cargo protection details" }
      ]
    },
    {
      id: "support",
      icon: <Phone className="h-5 w-5" />,
      title: "Customer Support",
      items: [
        { title: "Contact Us", description: "Get in touch with our team" },
        { title: "Emergency Line", description: "24/7 emergency support" },
        { title: "Customer Portal", description: "Account management" },
        { title: "FAQ", description: "Frequently asked questions" }
      ]
    }
  ];

  return (
    <>
      {/* Main Sidebar */}
      <div className="fixed left-0 top-0 h-full w-16 bg-primary/95 backdrop-blur-sm z-50 overflow-y-auto shadow-2xl"
           onMouseLeave={handleMouseLeave}>
        <div className="p-2">
          {/* Header - Hidden in compact mode */}
          <div className="mb-4 pb-2 border-b border-primary-foreground/20">
            <div className="text-center">
              <Truck className="h-6 w-6 text-accent mx-auto" />
            </div>
          </div>

          {/* Menu Sections */}
          <div className="space-y-2">
            {menuSections.map((section) => (
              <div
                key={section.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(section.id)}
              >
                <Card className="bg-primary-foreground/5 border-primary-foreground/10">
                  <CardContent className="p-0">
                    <Button
                      variant="ghost"
                      className={`w-full justify-center p-2 h-auto text-primary-foreground hover:bg-primary-foreground/10 ${
                        hoveredSection === section.id ? 'bg-primary-foreground/10' : ''
                      }`}
                    >
                      <div className="text-accent">
                        {section.icon}
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mega Menu Panel */}
      {hoveredSection && (
        <div
          className="fixed left-16 top-0 h-full w-72 bg-background border-l border-border z-40 shadow-xl animate-slide-in-right"
          onMouseEnter={() => setHoveredSection(hoveredSection)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="p-6">
            {(() => {
              const section = menuSections.find(s => s.id === hoveredSection);
              if (!section) return null;
              
              return (
                <>
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                    <div className="text-primary">
                      {section.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                  </div>
                  
                  <div className="grid gap-4">
                    {section.items.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border hover:shadow-md cursor-pointer transition-all group hover:bg-muted/50"
                      >
                        <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors mb-2">
                          {item.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
};

export default LandstarSidebar;