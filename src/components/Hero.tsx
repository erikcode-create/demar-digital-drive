import { Button } from "@/components/ui/button";
import { ChevronDown, Shield, Clock, Users, Truck, ArrowRight } from "lucide-react";
import heroTruck from "@/assets/hero-truck-plain.jpg";
import { Link } from "react-router-dom";

const stats = [
  { value: "10+", label: "Equipment Types" },
  { value: "24/7", label: "Availability" },
  { value: "48", label: "States Covered" },
];

const features = [
  {
    icon: Shield,
    title: "Safety First",
    desc: "DOT compliant with excellent safety ratings",
  },
  {
    icon: Clock,
    title: "24/7 Service",
    desc: "Round-the-clock transportation solutions",
  },
  {
    icon: Users,
    title: "US-Based Team",
    desc: "English-speaking, US-based drivers and dispatch",
  },
];

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with parallax-style layering */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${heroTruck})` }}
      >
        {/* Gradient overlay — editorial tonal depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(225_97%_4%/0.92)] via-[hsl(220_85%_15%/0.85)] to-[hsl(225_97%_4%/0.88)]" />
        {/* Subtle grid pattern for texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Content — intentional asymmetry */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-24">
        <div className="max-w-5xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-white/5 backdrop-blur-sm">
            <Truck className="h-4 w-4 text-[hsl(var(--accent))]" />
            <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
              Asset-Based Carrier & Licensed Broker
            </span>
          </div>

          {/* Headline — editorial, asymmetric, large */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-8">
            Driven by
            <br />
            <span className="text-[hsl(var(--accent))]">Purpose.</span>
            <br />
            <span className="text-white/40">Delivering Results.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-xl mb-10 leading-relaxed">
            Nationwide freight transportation with our own fleet and extended carrier
            network. One call connects you to every solution.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Button variant="hero" size="xl" asChild>
              <Link to="/quote" className="group">
                Request a Quote
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="xl"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-sm"
            >
              <a href="tel:+17752304767">Call (775) 230-4767</a>
            </Button>
          </div>

          {/* Stats bar — tonal surface */}
          <div className="flex flex-wrap gap-8 md:gap-16 pb-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-[hsl(var(--accent))] tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs tracking-[0.15em] uppercase text-white/40 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature cards — floating on the right side for desktop */}
        <div className="lg:absolute lg:bottom-24 lg:right-8 xl:right-16 lg:w-80 mt-12 lg:mt-0">
          <div className="flex flex-row lg:flex-col gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex-1 lg:flex-none p-5 rounded-xl bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 group"
              >
                <f.icon className="h-8 w-8 text-[hsl(var(--accent))] mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="flex flex-col items-center">
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2">
            Explore
          </span>
          <ChevronDown className="h-5 w-5 text-white/30" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
