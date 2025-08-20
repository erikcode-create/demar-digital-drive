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
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
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
      <div className="fixed left-0 top-0 h-full w-80 bg-primary/95 backdrop-blur-sm z-50 overflow-y-auto shadow-2xl">
        <div className="p-4">
          {/* Header */}
          <div className="mb-6 pb-4 border-b border-primary-foreground/20">
            <h2 className="text-lg font-bold text-primary-foreground mb-2">Navigation Menu</h2>
            <p className="text-sm text-primary-foreground/70">Access all DeMar Transportation services</p>
          </div>

          {/* Menu Sections */}
          <div className="space-y-2">
            {menuSections.map((section) => (
              <Card key={section.id} className="bg-primary-foreground/5 border-primary-foreground/10 relative">
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    className={`w-full justify-between p-4 h-auto text-primary-foreground hover:bg-primary-foreground/10 ${
                      expandedSections.includes(section.id) ? 'bg-primary-foreground/10' : ''
                    }`}
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-accent">
                        {section.icon}
                      </div>
                      <span className="font-medium text-left">{section.title}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-accent" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions at Bottom */}
          <div className="mt-8 pt-6 border-t border-primary-foreground/20">
            <div className="space-y-3">
              <Button 
                variant="cta" 
                className="w-full justify-start animate-pulse-glow"
                onClick={() => window.location.href = 'tel:7752304767'}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call (775) 230-4767
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <FileText className="h-4 w-4 mr-2" />
                Request Quote
              </Button>
            </div>

            {/* Company Stats */}
            <div className="mt-6 p-4 bg-primary-foreground/5 rounded-lg">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-accent">14+</div>
                <div className="text-xs text-primary-foreground/70">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mega Menu Panels */}
      {expandedSections.map((sectionId) => {
        const section = menuSections.find(s => s.id === sectionId);
        if (!section) return null;
        
        return (
          <div
            key={sectionId}
            className="fixed left-80 top-0 h-full w-96 bg-background border-l border-border z-40 shadow-xl animate-slide-in-right"
          >
            <div className="p-6">
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
                    className="p-4 rounded-lg border hover:shadow-md cursor-pointer transition-all group"
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
            </div>
          </div>
        );
      })}

      {/* Overlay to close mega menu */}
      {expandedSections.length > 0 && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setExpandedSections([])}
        />
      )}
    </>
  );
};

export default LandstarSidebar;