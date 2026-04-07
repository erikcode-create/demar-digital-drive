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
  FileCheck,
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
    desc: "Full compliance with all Department of Transportation regulations, inspections, and safety requirements. USDOT 4392091.",
  },
];

const fleet = [
  { name: "Dry Vans", desc: "Standard enclosed trailers for palletized freight, boxed goods, and general merchandise.", link: "/services/dry-van" },
  { name: "Reefers", desc: "Temperature-controlled refrigerated trailers for perishable goods and pharmaceuticals.", link: "/services/reefer" },
  { name: "Flatbeds", desc: "Open-deck trailers for construction materials, machinery, steel, and oversized loads.", link: "/services/flatbed" },
  { name: "Box Trucks", desc: "Medium-duty trucks for local and regional deliveries and smaller shipments.", link: "/services/box-truck" },
  { name: "Sprinter Vans", desc: "Expedited delivery vehicles for time-critical, smaller shipments.", link: "/services/sprinter-van" },
  { name: "Hazmat Equipment", desc: "Specially equipped vehicles with hazmat-endorsed drivers for regulated materials.", link: "/services/hazmat" },
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

const services = [
  { name: "Dry Van Shipping", link: "/services/dry-van" },
  { name: "Reefer / Refrigerated Freight", link: "/services/reefer" },
  { name: "Flatbed Shipping", link: "/services/flatbed" },
  { name: "Box Truck Delivery", link: "/services/box-truck" },
  { name: "Sprinter Van / Expedited", link: "/services/sprinter-van" },
  { name: "Hazmat Freight", link: "/services/hazmat" },
  { name: "Full Truckload (FTL)", link: "/services/ftl" },
  { name: "Less Than Truckload (LTL)", link: "/services/ltl" },
  { name: "3PL / Third-Party Logistics", link: "/services/3pl" },
  { name: "Warehousing", link: "/services/warehousing" },
];

const AboutPage = () => {
  useEffect(() => {
    document.title = "About DeMar Transportation | Freight Carrier in Reno, NV | USDOT 4392091";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'About DeMar Transportation, a freight carrier headquartered in Reno, NV. USDOT 4392091. Motor Carrier and Freight Broker authority, own fleet, 10 service types, 24/7 dispatch, and nationwide US coverage.');
    }
  }, []);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DeMar Transportation",
    "url": "https://demartransportation.com",
    "logo": "https://demartransportation.com/logo.png",
    "description": "US-based freight carrier and broker headquartered in Reno, Nevada. USDOT 4392091. Motor Carrier and Freight Broker authority with nationwide coverage across all 48 contiguous states.",
    "telephone": "+1-775-230-4767",
    "email": "info@DeMarTransportation.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "10471 Double R Blvd",
      "addressLocality": "Reno",
      "addressRegion": "NV",
      "postalCode": "89521",
      "addressCountry": "US",
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States",
    },
    "sameAs": [],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+1-775-230-4767",
        "contactType": "sales",
        "availableLanguage": "English",
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "07:00",
          "closes": "18:00",
        },
      },
      {
        "@type": "ContactPoint",
        "telephone": "+1-775-230-4767",
        "contactType": "customer service",
        "availableLanguage": "English",
        "description": "24/7 Dispatch",
      },
    ],
    "hasCredential": [
      {
        "@type": "DefinedTerm",
        "name": "USDOT Number",
        "termCode": "4392091",
      },
    ],
    "knowsAbout": [
      "Freight Shipping",
      "Trucking",
      "Logistics",
      "Dry Van Shipping",
      "Refrigerated Freight",
      "Flatbed Shipping",
      "Hazmat Freight",
      "LTL Shipping",
      "FTL Shipping",
      "3PL Services",
      "Warehousing",
    ],
  };

  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
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
                  USDOT 4392091 | Reno, NV
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                About DeMar
                <br />
                <span className="text-white/40">Transportation</span>
              </h1>
              <p className="text-lg text-white/60 max-w-2xl leading-relaxed mb-4">
                A federally authorized Motor Carrier and Freight Broker headquartered in Reno, Nevada. We operate our own fleet, manage 10 distinct service types, and dispatch 24/7 to move freight across all 48 contiguous states.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <FileCheck className="h-4 w-4 text-[hsl(var(--accent))]" />
                  <span>USDOT 4392091</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Shield className="h-4 w-4 text-[hsl(var(--accent))]" />
                  <span>MC and Broker Authority</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Clock className="h-4 w-4 text-[hsl(var(--accent))]" />
                  <span>24/7 Dispatch</span>
                </div>
              </div>
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
                  DeMar Transportation is a United States-based freight carrier headquartered in Reno, Nevada. We hold both Motor Carrier (MC) and Freight Broker authority under USDOT number 4392091, which means we are federally authorized to both haul freight on our own trucks and arrange shipments through our vetted carrier network.
                </p>
                <p>
                  We provide 10 distinct freight services: dry van, refrigerated (reefer), flatbed, box truck, sprinter van/expedited, hazmat, full truckload (FTL), less than truckload (LTL), third-party logistics (3PL), and warehousing. This range of services allows us to handle nearly any shipping requirement a business encounters, from a single pallet to a full 53-foot trailer.
                </p>
                <p>
                  Our office at 10471 Double R Blvd in Reno is open Monday through Friday, 7:00 AM to 6:00 PM PST, with dispatch available 24 hours a day, 7 days a week. Freight moves on its own schedule, and our dispatch team matches that pace.
                </p>
                <p>
                  As an asset-based carrier with full-service logistics capabilities, DeMar Transportation handles your freight with a single point of contact from pickup to delivery. Whether we move your load on our own equipment or through our carrier network, you get the same level of accountability, transparent pricing, and clear communication.
                </p>
              </div>
            </div>
          </section>

          {/* Authority and Credentials */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="container mx-auto max-w-5xl">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Credentials
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                Federal Authority and Compliance
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl leading-relaxed">
                DeMar Transportation operates under federal authority issued by the FMCSA. Our credentials are publicly verifiable through the FMCSA SAFER system.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 rounded-xl bg-white shadow-[var(--shadow-card)]">
                  <div className="p-2.5 rounded-lg bg-[hsl(var(--surface-low))] inline-block mb-3">
                    <FileCheck className="h-5 w-5 text-[hsl(var(--accent))]" />
                  </div>
                  <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-2">USDOT 4392091</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                    Registered with the Federal Motor Carrier Safety Administration. Our USDOT number is publicly searchable and verifiable.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-white shadow-[var(--shadow-card)]">
                  <div className="p-2.5 rounded-lg bg-[hsl(var(--surface-low))] inline-block mb-3">
                    <Truck className="h-5 w-5 text-[hsl(var(--accent))]" />
                  </div>
                  <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-2">Motor Carrier Authority</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                    Authorized to transport freight using our own fleet of trucks across all 48 contiguous states.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-white shadow-[var(--shadow-card)]">
                  <div className="p-2.5 rounded-lg bg-[hsl(var(--surface-low))] inline-block mb-3">
                    <Globe className="h-5 w-5 text-[hsl(var(--accent))]" />
                  </div>
                  <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-2">Freight Broker Authority</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                    Licensed to arrange freight shipments through our vetted network of partner carriers nationwide.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Mission and Values */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
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

          {/* What Makes DeMar Different */}
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

          {/* Services Overview */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="container mx-auto max-w-5xl">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                What We Haul
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                10 Freight Services Under One Roof
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl leading-relaxed">
                Rather than specializing in a single mode, DeMar Transportation covers the full spectrum of freight shipping. One carrier, one point of contact, every service type your supply chain requires.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {services.map((s) => (
                  <Link key={s.name} to={s.link} className="p-4 rounded-xl bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)] transition-all duration-300 flex items-center gap-3 group">
                    <CheckCircle className="h-4 w-4 text-[hsl(var(--accent))] flex-shrink-0" />
                    <span className="text-sm font-medium text-[hsl(var(--primary))] group-hover:text-[hsl(var(--accent))] transition-colors">{s.name}</span>
                    <ArrowRight className="h-3 w-3 text-[hsl(var(--muted-foreground))] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
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
                    Nationwide Coverage from Reno, Nevada
                  </h2>
                  <div className="space-y-4 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-xl">
                    <p>
                      DeMar Transportation serves all 48 contiguous states with reliable freight shipping services. Whether your shipment originates on the West Coast, moves through the Midwest, or delivers to the Eastern Seaboard, our network ensures coverage wherever your freight needs to go.
                    </p>
                    <p>
                      Our Reno, Nevada headquarters sits at the intersection of I-80 and US-395, providing direct access to California markets, Pacific Northwest corridors, and eastbound routes through the Mountain West. This location puts us within a single-day drive of major distribution hubs in Sacramento, the San Francisco Bay Area, Salt Lake City, and Portland.
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
                6 equipment types to match the specific requirements of your freight. Each vehicle class is maintained to DOT standards and operated by trained, qualified drivers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {fleet.map((v) => (
                  <Link key={v.name} to={v.link} className="p-5 rounded-xl bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)] transition-all duration-300 group">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--accent))] mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-semibold text-[hsl(var(--primary))] mb-1 group-hover:text-[hsl(var(--accent))] transition-colors">{v.name}</h3>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{v.desc}</p>
                      </div>
                    </div>
                  </Link>
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
                  Safety is embedded in every aspect of our operations. Your freight represents your livelihood, and our drivers share the road with families every day. That dual responsibility drives our commitment. As a USDOT-registered carrier (4392091), our safety record and compliance status are publicly accessible through the FMCSA SAFER system.
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
                  These are not aspirational goals. They are daily operational requirements enforced across our entire fleet.
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
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[hsl(var(--primary))]">
                        10471 Double R Blvd, Reno, NV 89521
                      </p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Office: Mon-Fri, 7:00 AM - 6:00 PM PST
                      </p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Dispatch: Available 24/7
                      </p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Phone: <a href="tel:+17752304767" className="text-[hsl(var(--accent))] hover:underline">(775) 230-4767</a>
                      </p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Email: <a href="mailto:info@DeMarTransportation.com" className="text-[hsl(var(--accent))] hover:underline">info@DeMarTransportation.com</a>
                      </p>
                    </div>
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