import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Shield,
  Truck,
  Phone,
  MapPin,
  CheckCircle,
  Target,
  Users,
  Clock,
  Award,
  Globe,
  ArrowRight,
} from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Safety First",
    desc: "Safety is not negotiable. From rigorous pre-trip inspections to ongoing driver training and full DOT compliance, we maintain the highest safety standards. Every driver, every truck, every load.",
  },
  {
    icon: Users,
    title: "Clear Communication",
    desc: "All of our drivers are English-speaking professionals who communicate clearly with shippers, receivers, and dispatch. Transparency drives trust.",
  },
  {
    icon: Target,
    title: "Competitive Pricing",
    desc: "With our own fleet and established carrier network, we keep rates competitive by eliminating unnecessary overhead. Transparent pricing without sacrificing quality.",
  },
  {
    icon: Clock,
    title: "Reliability",
    desc: "When we commit to a pickup time and delivery window, we honor it. Our dispatch team operates around the clock to monitor loads and keep your freight on schedule.",
  },
];

const differentiators = [
  {
    icon: Truck,
    title: "Asset-Based Carrier",
    desc: "Our own fleet combined with a vetted carrier network means reliable capacity and competitive rates.",
  },
  {
    icon: Users,
    title: "English-Speaking Drivers",
    desc: "Clear, professional communication at every pickup and delivery point across the country.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    desc: "Our dispatch team is available around the clock. Freight does not wait for business hours.",
  },
  {
    icon: Award,
    title: "DOT Compliant",
    desc: "Full compliance with all Department of Transportation regulations, inspections, and safety requirements.",
  },
];

const fleet = [
  { name: "Dry Vans", desc: "Standard enclosed trailers for palletized freight, boxed goods, and general merchandise." },
  { name: "Reefers", desc: "Temperature-controlled refrigerated trailers for perishable goods and pharmaceuticals." },
  { name: "Flatbeds", desc: "Open-deck trailers for construction materials, machinery, steel, and oversized loads." },
  { name: "Box Trucks", desc: "Medium-duty trucks for local and regional deliveries and smaller shipments." },
  { name: "Sprinter Vans", desc: "Expedited delivery vehicles for time-critical, smaller shipments." },
  { name: "Hazmat Equipment", desc: "Specially equipped vehicles with hazmat-endorsed drivers for regulated materials." },
];

const safetyItems = [
  "Full DOT compliance on every vehicle and driver",
  "Comprehensive driver training and ongoing education",
  "Rigorous preventive equipment maintenance schedules",
  "Mandatory pre-trip and post-trip vehicle inspections",
  "Electronic logging devices (ELD) on all trucks",
  "Drug and alcohol testing program compliance",
  "Hours of service monitoring and enforcement",
  "Accident prevention and defensive driving programs",
];

const AboutPage = () => {
  useEffect(() => {
    document.title = "About DeMar Transportation | US Freight Carrier Based in Reno, NV";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about DeMar Transportation, a US-based freight carrier headquartered in Reno, NV. MC & broker authority, own fleet, 24/7 dispatch, and nationwide coverage.');
    }
  }, []);

  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>
      <div>
        <Header />
        <main id="main-content">
          {/* Hero */}
          <section className="pt-32 pb-20 px-4 bg-[hsl(225_97%_4%)] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }} />
            <div className="container mx-auto max-w-5xl relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/5 backdrop-blur-sm">
                <Truck className="h-4 w-4 text-[hsl(var(--accent))]" />
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
                  US-Based Freight Carrier
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                DeMar
                <br />
                <span className="text-white/40">Transportation</span>
              </h1>
              <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
                Your freight partner for reliable, safe, and competitively priced shipping across the United States.
              </p>
            </div>
          </section>

          {/* Who We Are */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="container mx-auto max-w-5xl">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Who We Are
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                Company Overview
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl">
                <p>
                  DeMar Transportation is a United States-based freight carrier headquartered in Reno, Nevada. We provide comprehensive trucking and logistics services to shippers, manufacturers, distributors, and businesses of all sizes nationwide.
                </p>
                <p>
                  As an asset-based carrier with full-service logistics capabilities, DeMar Transportation handles your freight with a single point of contact from pickup to delivery. Whether we move your load on our own equipment or through our vetted carrier network, you get the same level of accountability, transparent pricing, and clear communication.
                </p>
                <p>
                  Our team understands that freight is the backbone of American commerce. Whether you need a single shipment moved across town or recurring lanes serviced coast to coast, DeMar Transportation delivers the capacity, reliability, and professionalism your supply chain demands.
                </p>
              </div>
            </div>
          </section>

          {/* Mission and Values */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="container mx-auto max-w-5xl">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Our Foundation
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                Mission and Values
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-12 max-w-2xl leading-relaxed">
                Every decision we make is guided by four core principles that define who we are and how we operate.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {values.map((v) => (
                  <div key={v.title} className="p-6 rounded-xl bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)] transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-lg bg-[hsl(var(--surface-low))]">
                        <v.icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-2">{v.title}</h3>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{v.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* What Makes DeMar Different — dark section */}
          <section className="py-20 px-4 bg-[hsl(225_97%_4%)] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }} />
            <div className="container mx-auto max-w-5xl relative z-10">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Our Edge
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-12">
                What Makes DeMar Different
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {differentiators.map((d) => (
                  <div key={d.title} className="p-6 rounded-xl bg-white/5 hover:bg-white/8 transition-all duration-300 group">
                    <d.icon className="h-8 w-8 text-[hsl(var(--accent))] mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-base font-semibold text-white mb-2">{d.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{d.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Nationwide Coverage */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="container mx-auto max-w-5xl">
              <div className="flex flex-col md:flex-row items-start gap-12">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="h-7 w-7 text-[hsl(var(--accent))]" />
                    <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))]">
                      Coverage
                    </p>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-6">
                    Nationwide Coverage
                  </h2>
                  <div className="space-y-4 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-xl">
                    <p>
                      DeMar Transportation serves all 48 contiguous states with reliable freight shipping solutions. Whether your shipment originates on the West Coast, moves through the Midwest, or delivers to the Eastern Seaboard, our network ensures coverage wherever your freight needs to go.
                    </p>
                    <p>
                      From our Reno, Nevada headquarters, we coordinate pickups and deliveries across major freight corridors, metropolitan distribution hubs, and rural delivery points.
                    </p>
                  </div>
                  <div className="mt-6">
                    <Button variant="outline" className="border-[hsl(var(--primary))] text-[hsl(var(--primary))]" asChild>
                      <Link to="/#services">
                        View Our Services
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Fleet */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="container mx-auto max-w-5xl">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Equipment
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                Our Fleet
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl leading-relaxed">
                A diverse, well-equipped fleet to handle any freight requirement.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {fleet.map((v) => (
                  <div key={v.name} className="p-5 rounded-xl bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)] transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--accent))] mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-semibold text-[hsl(var(--primary))] mb-1">{v.name}</h3>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{v.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Safety */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="container mx-auto max-w-5xl">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Safety
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                Our Commitment to Safety
              </h2>
              <div className="max-w-3xl">
                <p className="text-base text-[hsl(var(--muted-foreground))] mb-8 leading-relaxed">
                  Safety is embedded in every aspect of our operations. Your freight represents your livelihood, and our drivers share the road with families every day. That dual responsibility drives our commitment.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {safetyItems.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--accent))] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">{item}</p>
                    </div>
                  ))}
                </div>
                <p className="text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
                  These are not aspirational goals — they are daily operational requirements enforced across our entire fleet.
                </p>
              </div>
            </div>
          </section>

          {/* Headquarters */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="container mx-auto max-w-5xl">
              <div className="p-8 md:p-12 rounded-xl bg-white shadow-[var(--shadow-float)]">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="p-4 rounded-xl bg-[hsl(var(--surface-low))]">
                    <MapPin className="h-10 w-10 text-[hsl(var(--accent))]" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
                      Reno, Nevada Headquarters
                    </h2>
                    <p className="text-base text-[hsl(var(--muted-foreground))] mb-4 leading-relaxed max-w-xl">
                      Strategically located at the crossroads of major West Coast freight corridors. Reno provides efficient access to California, the Pacific Northwest, the Mountain West, and all points east.
                    </p>
                    <p className="text-sm font-medium text-[hsl(var(--primary))]">
                      10471 Double R Blvd, Reno, NV 89521
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-[hsl(var(--accent))]">
            <div className="container mx-auto max-w-5xl text-center px-4">
              <h2 className="text-2xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
                Ready to Ship with DeMar?
              </h2>
              <p className="text-base text-[hsl(var(--primary))]/70 mb-8 max-w-md mx-auto">
                Competitive rates with transparent pricing. Contact us today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]/90 font-semibold"
                  asChild
                >
                  <Link to="/quote" className="group">
                    Get a Free Quote
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
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;
