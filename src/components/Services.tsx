import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Package, Snowflake, Building, Car, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      icon: <Package className="h-8 w-8" />,
      title: "Dry Van",
      description: "Standard enclosed trailers for general freight and cargo protection from weather elements."
    },
    {
      icon: <Snowflake className="h-8 w-8" />,
      title: "Reefer",
      description: "Temperature-controlled transportation for perishable goods and sensitive materials."
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Flatbed",
      description: "Open trailers for oversized loads, construction materials, and heavy equipment."
    },
    {
      icon: <Building className="h-8 w-8" />,
      title: "Box Truck",
      description: "Smaller loads and local deliveries with flexible scheduling options."
    },
    {
      icon: <Car className="h-8 w-8" />,
      title: "Sprinter Van",
      description: "Expedited delivery for time-sensitive smaller shipments and express cargo."
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Hazmat/Fuel",
      description: "Specialized handling of hazardous materials with certified drivers and equipment."
    }
  ];

  return (
    <section id="services" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            The Services We Provide
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We provide a comprehensive variety of transportation services to meet all your freight needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <Card 
              key={service.title} 
              className="hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:scale-105 animate-scale-in bg-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 text-accent">
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-bold text-primary">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="hero" size="xl" className="animate-pulse-glow">
            <Link to="/quote">Get Quote for Your Shipment</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;