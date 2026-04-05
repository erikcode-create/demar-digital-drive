import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  "Competitive rates, no hidden fees",
  "English-speaking drivers & dispatch",
  "Nationwide coverage, 48 contiguous states",
  "MC + Broker dual authority",
  "Real-time communication",
  "DOT compliant operations",
];

const About = () => {
  return (
    <>
      {/* About content */}
      <section id="about" className="py-space-2xl bg-[hsl(var(--surface))]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-space-xl items-start">
            {/* Left — content (3/5) */}
            <div className="lg:col-span-3">
              <h2 className="font-serif text-heading text-primary mb-space-lg">
                One Partner for All Your Freight
              </h2>

              <p className="text-body text-muted-foreground leading-relaxed mb-space-md">
                DeMar Transportation combines the reliability of an asset-based
                carrier with the capacity flexibility of a licensed broker.
                Professional communication, competitive rates, and a team that
                answers the phone.
              </p>

              <p className="text-body text-muted-foreground leading-relaxed mb-space-lg">
                Whether you need a single dry van or a complex multi-modal
                solution, we handle the logistics so you can focus on your
                business.
              </p>

              {/* Pull quote */}
              <div className="border-l-4 border-accent pl-space-md py-space-sm mb-space-xl">
                <p className="font-serif text-subheading italic text-primary">
                  "We don't oversell. We deliver. Your freight is our reputation."
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start gap-space-md">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/quote" className="group">
                    Request a Quote
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <a
                  href="tel:+17752304767"
                  className="inline-flex items-center gap-2 text-body font-medium text-primary hover:text-accent transition-colors py-2"
                >
                  Call (775) 230-4767
                </a>
              </div>
            </div>

            {/* Right — feature checklist (2/5) */}
            <div className="lg:col-span-2">
              <div className="space-y-space-sm">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-body text-primary">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-space-xl bg-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-heading text-accent-foreground mb-space-md">
            Ready to Ship?
          </h2>
          <p className="text-body text-accent-foreground/70 mb-space-lg max-w-md mx-auto">
            Get a free quote in minutes. One call connects you to our fleet and
            network.
          </p>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            asChild
          >
            <Link to="/quote" className="group">
              Request a Quote
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default About;
