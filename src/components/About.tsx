import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Phone, ArrowRight, Truck, Shield, HeadphonesIcon, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import ApplyToDriveForm from "./ApplyToDriveForm";

const differentiators = [
  {
    icon: Truck,
    title: "Asset-Based Fleet",
    desc: "Our own trucks on the road means committed capacity and service control.",
  },
  {
    icon: Shield,
    title: "Safety First",
    desc: "DOT compliance, excellent safety ratings, and certified drivers.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 US-Based Team",
    desc: "English-speaking dispatch that answers your call — day or night.",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    desc: "Competitive rates with no hidden fees on every load.",
  },
];

const features = [
  "Competitive rates — no hidden fees",
  "English-speaking drivers & dispatch",
  "Nationwide coverage, 50 states",
  "MC + Broker dual authority",
  "Real-time communication",
  "DOT compliant operations",
];

const About = () => {
  return (
    <>
      {/* Why Choose Us — dark section */}
      <section className="py-24 md:py-32 bg-[hsl(225_97%_4%)] relative overflow-hidden">
        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mb-16">
            <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
              Why Choose Us
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
              The reliability of an asset carrier.
              <br />
              <span className="text-white/40">The flexibility of a broker.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {differentiators.map((d) => (
              <div
                key={d.title}
                className="p-6 rounded-xl bg-white/5 hover:bg-white/8 transition-all duration-300 group"
              >
                <d.icon className="h-8 w-8 text-[hsl(var(--accent))] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-base font-semibold text-white mb-2">{d.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About + Apply section */}
      <section id="about" className="py-24 md:py-32 bg-[hsl(var(--surface))]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left — content */}
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                About DeMar
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] leading-tight tracking-tight mb-6">
                One partner for all your
                <br />
                freight needs.
              </h2>

              {/* Quote — tonal layering, no border-left */}
              <div className="p-6 rounded-xl bg-[hsl(var(--surface-low))] mb-8">
                <p className="text-lg italic text-[hsl(var(--primary))] font-medium leading-relaxed">
                  "We don't oversell. We deliver. Your freight is our reputation."
                </p>
              </div>

              <p className="text-base text-[hsl(var(--muted-foreground))] mb-8 leading-relaxed">
                DeMar Transportation combines the reliability of an asset-based carrier
                with the capacity flexibility of a licensed broker. Professional
                communication, competitive rates, and a team that answers the phone.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-[hsl(var(--accent))] flex-shrink-0" />
                    <span className="text-sm text-[hsl(var(--primary))]">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="hero" size="lg" asChild>
                  <a href="tel:+17752304767" className="group">
                    <Phone className="h-4 w-4 mr-2" />
                    Call (775) 230-4767
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="border-[hsl(var(--primary))] text-[hsl(var(--primary))]" asChild>
                  <Link to="/quote" className="group">
                    Request Quote
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right — Apply form */}
            <div>
              <Card className="shadow-[var(--shadow-float)] bg-white rounded-xl overflow-hidden">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-[hsl(var(--primary))] mb-6 text-center tracking-tight">
                    Apply to Drive
                  </h3>
                  <ApplyToDriveForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner — accent color */}
      <section className="py-16 bg-[hsl(var(--accent))]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
            Ready to Ship?
          </h2>
          <p className="text-base text-[hsl(var(--primary))]/70 mb-8 max-w-md mx-auto">
            Get a free quote in minutes. One call connects you to our fleet and network.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]/90 font-semibold"
              asChild
            >
              <Link to="/quote" className="group">
                Request a Quote
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10"
              asChild
            >
              <a href="tel:+17752304767">
                <Phone className="mr-2 h-4 w-4" />
                (775) 230-4767
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
