import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Package, Snowflake, Building, Car, Wrench, Container, Layers, Network, Warehouse } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      icon: <Package className="h-8 w-8" />,
      title: "Dry Van",
      slug: "dry-van",
      description: "Standard enclosed trailers for general freight and cargo protection from weather elements."
    },
    {
      icon: <Snowflake className="h-8 w-8" />,
      title: "Reefer",
      slug: "reefer",
      description: "Temperature-controlled transportation for perishable goods and sensitive materials."
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Flatbed",
      slug: "flatbed",
      description: "Open trailers for oversized loads, construction materials, and heavy equipment."
    },
    {
      icon: <Building className="h-8 w-8" />,
      title: "Box Truck",
      slug: "box-truck",
      description: "Smaller loads and local deliveries with flexible scheduling options."
    },
    {
      icon: <Car className="h-8 w-8" />,
      title: "Sprinter Van",
      slug: "sprinter-van",
      description: "Expedited delivery for time-sensitive smaller shipments and express cargo."
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Hazmat/Fuel",
      slug: "hazmat",
      description: "Specialized handling of hazardous materials with certified drivers and equipment."
    },
    {
      icon: <Container className="h-8 w-8" />,
      title: "Full Truckload",
      slug: "ftl",
      description: "Dedicated trailers for shipments over 10,000 lbs with direct, no-stop delivery."
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: "LTL Shipping",
      slug: "ltl",
      description: "Cost-effective less-than-truckload shipping for smaller freight and partial loads."
    },
    {
      icon: <Network className="h-8 w-8" />,
      title: "3PL Services",
      slug: "3pl",
      description: "Full-service third-party logistics with freight management and supply chain solutions."
    },
    {
      icon: <Warehouse className="h-8 w-8" />,
      title: "Warehousing",
      slug: "warehousing",
      description: "Nationwide warehousing and distribution with inventory management and fulfillment."
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
            <Link key={service.title} to={`/services/${service.slug}`}>
              <Card
                className="hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:scale-105 animate-scale-in bg-card h-full"
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
            </Link>
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