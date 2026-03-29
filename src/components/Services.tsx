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
    description: "Standard enclosed trailers for general freight and cargo protection.",
  },
  {
    icon: Snowflake,
    title: "Reefer",
    slug: "reefer",
    description: "Temperature-controlled transport for perishable goods.",
  },
  {
    icon: Truck,
    title: "Flatbed",
    slug: "flatbed",
    description: "Open trailers for oversized loads and heavy equipment.",
  },
  {
    icon: Building,
    title: "Box Truck",
    slug: "box-truck",
    description: "Smaller loads and local deliveries with flexible scheduling.",
  },
  {
    icon: Car,
    title: "Sprinter Van",
    slug: "sprinter-van",
    description: "Expedited delivery for time-sensitive smaller shipments.",
  },
  {
    icon: Wrench,
    title: "Hazmat/Fuel",
    slug: "hazmat",
    description: "Certified handling of hazardous materials and fuel transport.",
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
    icon: Network,
    title: "3PL Services",
    slug: "3pl",
    description: "Full-service logistics with freight and supply chain management.",
  },
  {
    icon: Warehouse,
    title: "Warehousing",
    slug: "warehousing",
    description: "Nationwide warehousing, distribution, and fulfillment.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 md:py-32 bg-[hsl(var(--surface))]">
      <div className="container mx-auto px-4">
        {/* Section header — editorial asymmetry */}
        <div className="max-w-2xl mb-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
            Our Services
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-[hsl(var(--primary))] leading-tight tracking-tight mb-4">
            Full-spectrum freight
            <br />
            <span className="text-[hsl(var(--muted-foreground))]">under one roof.</span>
          </h2>
          <p className="text-base text-[hsl(var(--muted-foreground))] max-w-lg leading-relaxed">
            From dry van to hazmat, FTL to warehousing — one partner for every
            shipping need across the nation.
          </p>
        </div>

        {/* Service cards — grid with tonal layering (no borders) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-16">
          {services.map((service) => (
            <Link key={service.slug} to={`/services/${service.slug}`} className="group">
              <div className="h-full p-6 rounded-xl bg-[hsl(var(--surface-low))] hover:bg-white hover:shadow-[var(--shadow-float)] transition-all duration-300">
                <service.icon className="h-7 w-7 text-[hsl(var(--accent))] mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-sm font-semibold text-[hsl(var(--primary))] mb-2 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed mb-3">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[hsl(var(--accent-foreground))] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
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
