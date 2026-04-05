import { Button } from "@/components/ui/button";
import {
  Truck,
  Package,
  Snowflake,
  Building,
  Car,
  Wrench,
  Container,
  Layers,
  Network,
  Warehouse,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Package,
    title: "Dry Van",
    slug: "dry-van",
    description: "Standard enclosed trailers for general freight and cargo protection across all 48 states.",
  },
  {
    icon: Snowflake,
    title: "Reefer",
    slug: "reefer",
    description: "Temperature-controlled transport for perishable goods with real-time monitoring.",
  },
  {
    icon: Truck,
    title: "Flatbed",
    slug: "flatbed",
    description: "Open trailers for oversized loads and heavy equipment.",
  },
  {
    icon: Container,
    title: "Full Truckload",
    slug: "ftl",
    description: "Dedicated trailers for 10,000+ lb shipments, direct delivery.",
  },
  {
    icon: Layers,
    title: "LTL Shipping",
    slug: "ltl",
    description: "Cost-effective less-than-truckload for smaller freight.",
  },
  {
    icon: Building,
    title: "Box Truck",
    slug: "box-truck",
    description: "Smaller loads and local deliveries.",
  },
  {
    icon: Car,
    title: "Sprinter Van",
    slug: "sprinter-van",
    description: "Expedited small shipments.",
  },
  {
    icon: Wrench,
    title: "Hazmat/Fuel",
    slug: "hazmat",
    description: "Certified hazardous materials.",
  },
  {
    icon: Network,
    title: "3PL Services",
    slug: "3pl",
    description: "Full logistics management.",
  },
  {
    icon: Warehouse,
    title: "Warehousing",
    slug: "warehousing",
    description: "Storage and fulfillment.",
  },
];

// Tier splits: indices 0-1 large, 2-4 medium, 5-9 compact
const large = services.slice(0, 2);
const medium = services.slice(2, 5);
const compact = services.slice(5);

const Services = () => {
  return (
    <section id="services" className="py-space-2xl bg-[hsl(var(--surface))]">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="max-w-2xl mb-space-xl">
          <h2 className="font-serif text-heading text-primary mb-space-sm">
            Full-Spectrum Freight, One Partner
          </h2>
          <p className="font-sans text-body text-muted-foreground max-w-lg">
            From dry van to hazmat, FTL to warehousing. Every shipping solution
            under one roof.
          </p>
        </div>

        {/* Large cards — top tier */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mb-space-md">
          {large.map((service) => (
            <Link key={service.slug} to={`/services/${service.slug}`} className="group">
              <div className="h-full p-space-lg rounded-[var(--radius)] bg-[hsl(var(--surface-low))] hover:shadow-[var(--shadow-float)] transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-space-md">
                  <service.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-serif text-subheading text-primary mb-space-sm">
                  {service.title}
                </h3>
                <p className="text-body text-muted-foreground leading-relaxed mb-space-md">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-1 text-caption font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Medium cards — second tier */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md mb-space-md">
          {medium.map((service) => (
            <Link key={service.slug} to={`/services/${service.slug}`} className="group">
              <div className="h-full p-space-lg rounded-[var(--radius)] bg-[hsl(var(--surface-low))] hover:shadow-[var(--shadow-float)] transition-all duration-300">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-space-sm">
                  <service.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-serif text-subheading text-primary mb-1">
                  {service.title}
                </h3>
                <p className="text-caption text-muted-foreground leading-relaxed mb-space-sm">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-1 text-caption font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Compact cards — third tier */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-space-sm mb-space-xl">
          {compact.map((service) => (
            <Link key={service.slug} to={`/services/${service.slug}`} className="group">
              <div className="h-full p-space-md rounded-[var(--radius)] bg-[hsl(var(--surface-low))] hover:shadow-[var(--shadow-float)] transition-all duration-300 text-center">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 mb-space-xs">
                  <service.icon className="h-4 w-4 text-accent" />
                </div>
                <h3 className="text-sm font-bold text-primary">
                  {service.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Button asChild variant="hero" size="xl">
            <Link to="/quote" className="group">
              Get a Free Quote
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
