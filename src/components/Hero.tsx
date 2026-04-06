import { Button } from "@/components/ui/button";
import { Shield, Clock, Users, Truck, ArrowRight, Package, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const trustItems = [
  { icon: Package, label: "10+ Equipment Types" },
  { icon: Clock, label: "24/7 Availability" },
  { icon: MapPin, label: "48 States Covered" },
  { icon: Shield, label: "Safety First" },
  { icon: Phone, label: "24/7 Service" },
  { icon: Users, label: "US-Based Team" },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 py-space-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-space-xl items-center min-h-[70vh]">
          {/* Left — editorial text block (3/5 width) */}
          <div className="lg:col-span-3">
            {/* Badge */}
            <span className="inline-block text-caption font-sans font-medium tracking-[0.15em] uppercase text-muted-foreground mb-space-lg">
              Asset-Based Carrier &amp; Licensed Broker
            </span>

            {/* Headline */}
            <h1 className="font-serif text-display text-primary mb-space-lg text-balance">
              Driven by{" "}
              <span className="text-accent">Purpose.</span>
              <br />
              Delivering Results.
            </h1>

            <p className="font-sans text-body text-muted-foreground max-w-xl mb-space-xl leading-relaxed">
              Nationwide freight transportation with our own fleet and extended
              carrier network. One call connects you to every solution.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-space-md mb-space-lg">
              <Button variant="hero" size="xl" asChild>
                <Link to="/quote" className="group">
                  Request a Quote
                  <ArrowRight aria-hidden="true" className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <a
                href="tel:+17752304767"
                className="inline-flex items-center gap-2 text-body font-medium text-primary hover:text-accent transition-colors py-3"
              >
                <Phone aria-hidden="true" className="h-4 w-4" />
                Call (775) 230-4767
              </a>
            </div>
          </div>

          {/* Right — geometric accent (2/5 width) */}
          <div className="hidden lg:block lg:col-span-2 relative">
            <div className="aspect-square max-w-md ml-auto relative">
              {/* Layered geometric shapes */}
              <div className="absolute inset-0 rounded-[2rem] bg-primary rotate-3 opacity-90" />
              <div className="absolute inset-4 rounded-[1.5rem] bg-[hsl(220_85%_15%)] -rotate-2" />
              <div className="absolute inset-8 rounded-[1rem] bg-accent/10 rotate-1 flex items-center justify-center">
                <Truck aria-hidden="true" className="h-24 w-24 text-accent/40" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="bg-[hsl(var(--surface-low))] border-t border-border">
        <div className="container mx-auto px-4 py-space-md">
          <div className="flex flex-wrap justify-center lg:justify-between gap-space-md lg:gap-space-sm">
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2 px-3 py-1">
                <item.icon aria-hidden="true" className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-caption font-sans text-muted-foreground whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
