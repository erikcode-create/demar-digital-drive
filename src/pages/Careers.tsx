import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApplyToDriveForm from "@/components/ApplyToDriveForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Truck,
  Phone,
  MapPin,
  CheckCircle,
  DollarSign,
  Shield,
  Heart,
  Clock,
  Fuel,
  Headphones,
  CreditCard,
  Monitor,
  Snowflake,
  ArrowRight,
} from "lucide-react";

const whyDrive = [
  {
    icon: DollarSign,
    title: "Competitive Pay",
    desc: "We offer industry-competitive per-mile rates that reflect the skill, responsibility, and professionalism our drivers bring to every load. Your paycheck reflects the value you deliver, not the bare minimum the market will tolerate. Weekly settlements mean you are never waiting to get paid.",
  },
  {
    icon: Truck,
    title: "Consistent Freight",
    desc: "Our established shipper relationships and nationwide service area mean steady loads and minimal deadhead miles. We keep our drivers moving with freight that makes sense for your route, your schedule, and your earnings. No sitting around waiting for dispatch to find your next load.",
  },
  {
    icon: Heart,
    title: "Respect for Drivers",
    desc: "We built DeMar Transportation on the principle that drivers deserve to be treated as skilled professionals. When you call dispatch, a real person answers who knows your name and your situation. Your feedback matters. Your home time matters. Your career matters.",
  },
  {
    icon: Shield,
    title: "Modern Equipment",
    desc: "Our fleet is well-maintained and regularly updated. You will drive reliable, clean, professionally equipped trucks with ELD systems, modern safety features, and comfortable cabs. We invest in our equipment because we invest in our drivers.",
  },
];

const openings = [
  {
    tag: "OTR",
    title: "OTR CDL-A Driver",
    desc: (
      <>
        Over-the-road positions hauling{" "}
        <Link to="/services/dry-van" className="text-[hsl(var(--accent))] hover:underline">dry van</Link>{" "}
        and{" "}
        <Link to="/services/reefer" className="text-[hsl(var(--accent))] hover:underline">reefer</Link>{" "}
        freight across the continental United States. Consistent miles, competitive per-mile pay, and scheduled home time. Ideal for experienced drivers who enjoy long-haul routes and maximizing earnings.
      </>
    ),
  },
  {
    tag: "Regional",
    title: "Regional CDL-A Driver",
    desc: "Regional routes with more predictable schedules and regular home time. Service established lanes within designated multi-state regions. A strong option for drivers who want steady miles without extended time away from home.",
  },
  {
    tag: "Flatbed",
    title: "Flatbed CDL-A Driver",
    desc: (
      <>
        Haul{" "}
        <Link to="/services/flatbed" className="text-[hsl(var(--accent))] hover:underline">flatbed freight</Link>{" "}
        including construction materials, steel, lumber, machinery, and oversized loads. Requires experience with tarping, chaining, strapping, and securement. Premium pay rates reflect the specialized skill set required.
      </>
    ),
  },
  {
    tag: "Hazmat/Tanker",
    title: "Hazmat/Tanker CDL-A Driver",
    desc: "Transport hazardous materials and tanker loads with full regulatory compliance. Must hold current H, N, or X endorsements. This specialized role commands top-tier compensation and is suited for drivers with hazmat experience and an impeccable safety record.",
  },
];

const requirements = [
  "Valid Class A Commercial Driver's License (CDL-A)",
  "Clean Motor Vehicle Record (MVR)",
  "Minimum 1 year of verifiable OTR or regional driving experience",
  "Pass current DOT physical examination",
  "Pass pre-employment drug screening and random testing compliance",
  "No DUI/DWI convictions in the past 5 years",
  "Ability to pass a comprehensive background check",
  "Must be at least 21 years of age",
];

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Per-Mile Pay",
    desc: "Industry-leading rates that reward your experience and miles driven.",
  },
  {
    icon: CreditCard,
    title: "Weekly Settlements",
    desc: "Get paid every week with reliable, on-time direct deposit. No waiting around.",
  },
  {
    icon: Fuel,
    title: "Fuel Cards",
    desc: "Company fuel cards with access to nationwide fuel networks and discounted rates.",
  },
  {
    icon: Monitor,
    title: "ELD Equipped Trucks",
    desc: "Modern electronic logging devices on every truck for compliant, hassle-free record keeping.",
  },
  {
    icon: Headphones,
    title: "24/7 Dispatch Support",
    desc: "Live dispatch support available any time of day or night. You are never on your own out there.",
  },
  {
    icon: Snowflake,
    title: "Year-Round Freight",
    desc: "Steady loads through every season. Our shipper relationships keep you moving all year.",
  },
];

const Careers = () => {
  useEffect(() => {
    document.title =
      "CDL-A Truck Driving Jobs | Careers at DeMar Transportation | Reno, NV";
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
                  Now Hiring CDL-A Drivers
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                Drive with
                <br />
                <span className="text-white/40">DeMar Transportation</span>
              </h1>
              <p className="text-lg text-white/60 max-w-2xl leading-relaxed mb-8">
                Join a carrier that values its drivers. Competitive pay,
                consistent freight, modern equipment, and a team that treats
                you like a professional -- because you are one.
              </p>
              <a href="#apply">
                <Button
                  size="lg"
                  className="bg-[hsl(var(--accent))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--accent))]/90 font-semibold"
                >
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </section>

          {/* Why Drive for DeMar */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="container mx-auto max-w-5xl">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Why DeMar
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                Why Drive for DeMar?
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-12 max-w-2xl leading-relaxed">
                At DeMar Transportation, drivers are not a number on a
                spreadsheet. You are the backbone of our business, and we
                build our company around making sure you succeed on the road
                and at home.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {whyDrive.map((v) => (
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

          {/* Current Openings — dark section */}
          <section className="py-20 px-4 bg-[hsl(225_97%_4%)] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }} />
            <div className="container mx-auto max-w-5xl relative z-10">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Open Positions
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                Current Openings
              </h2>
              <p className="text-base text-white/50 mb-12 max-w-2xl leading-relaxed">
                We are actively hiring experienced CDL-A drivers for multiple
                positions. Find the role that fits your experience and
                lifestyle, then apply below.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {openings.map((o) => (
                  <div key={o.title} className="p-6 rounded-xl bg-white/5 hover:bg-white/8 transition-all duration-300 group">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[hsl(var(--accent))]/15 text-xs font-semibold text-[hsl(var(--accent))]">
                        {o.tag}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-white/60">
                        Full-Time
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">{o.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed mb-4">{o.desc}</p>
                    <a href="#apply">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Apply for This Position
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Requirements */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="container mx-auto max-w-5xl">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Qualifications
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                Driver Requirements
              </h2>
              <div className="max-w-3xl">
                <p className="text-base text-[hsl(var(--muted-foreground))] mb-8 leading-relaxed">
                  To drive for DeMar Transportation, candidates must meet the
                  following minimum qualifications. These standards ensure the
                  safety of our drivers, our customers' freight, and the
                  motoring public.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {requirements.map((req) => (
                    <div key={req} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--accent))] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">{req}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-6 italic">
                  Additional endorsements (Hazmat, Tanker, Doubles/Triples)
                  are preferred for specialized positions and may qualify for
                  premium pay rates.
                </p>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="container mx-auto max-w-5xl">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Compensation
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                Driver Benefits
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-12 max-w-2xl leading-relaxed">
                We believe that taking care of our drivers is not a perk -- it
                is a business requirement. When our drivers succeed, our
                customers succeed.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {benefits.map((b) => (
                  <div key={b.title} className="p-5 rounded-xl bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)] transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-[hsl(var(--surface-low))]">
                        <b.icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[hsl(var(--primary))] mb-1">{b.title}</h3>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{b.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Base of Operations */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="container mx-auto max-w-5xl">
              <div className="p-8 md:p-12 rounded-xl bg-white shadow-[var(--shadow-float)]">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="p-4 rounded-xl bg-[hsl(var(--surface-low))]">
                    <MapPin className="h-10 w-10 text-[hsl(var(--accent))]" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
                      Base of Operations: Reno, Nevada
                    </h2>
                    <p className="text-base text-[hsl(var(--muted-foreground))] mb-4 leading-relaxed max-w-xl">
                      Our headquarters at 10471 Double R Blvd, Reno, NV 89521
                      sits at the intersection of major West Coast freight
                      lanes. Reno's strategic location offers quick access to
                      California distribution centers, Pacific Northwest
                      markets, and transcontinental corridors heading east.
                      For drivers based in the Reno-Sparks metro area, this
                      means more home time and less deadhead to your first
                      pickup.
                    </p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                      We hire drivers from across the country. Whether you
                      live near our Reno headquarters or operate from another
                      region, we have routes and freight that work for your
                      location.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Application Form */}
          <section id="apply" className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="container mx-auto max-w-3xl">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4 text-center">
                Get Started
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4 text-center">
                Apply to Drive with DeMar
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-8 max-w-xl mx-auto text-center leading-relaxed">
                Ready to join a carrier that puts drivers first? Complete the
                application below and our recruiting team will be in touch
                within 24-48 hours to discuss next steps.
              </p>
              <div className="rounded-xl bg-white shadow-[var(--shadow-float)] p-6">
                <ApplyToDriveForm />
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-[hsl(var(--accent))]">
            <div className="container mx-auto max-w-5xl text-center px-4">
              <h2 className="text-2xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
                Questions? Talk to Our Recruiting Team
              </h2>
              <p className="text-base text-[hsl(var(--primary))]/70 mb-8 max-w-2xl mx-auto">
                If you have questions about open positions, pay, routes, or
                anything else, call us directly. Our team is here to help you
                make the right decision for your driving career.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]/90 font-semibold"
                  asChild
                >
                  <a href="tel:+17752304767">
                    <Phone className="mr-2 h-4 w-4" />
                    (775) 230-4767
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10"
                  asChild
                >
                  <a href="mailto:info@DeMarTransportation.com">
                    info@DeMarTransportation.com
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

export default Careers;
