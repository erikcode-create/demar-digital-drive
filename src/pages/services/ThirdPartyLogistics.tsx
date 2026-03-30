import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, ArrowRight, CheckCircle, Network, TrendingUp, BarChart3, Users, Globe, Boxes } from "lucide-react";

const ThirdPartyLogistics = () => {
  useEffect(() => {
    document.title = "Third-Party Logistics (3PL) Services | Freight Management | DeMar Transportation";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "DeMar Transportation provides full-service 3PL solutions including freight management, carrier sourcing, warehousing coordination, and supply chain visibility. One call handles everything. Get a free quote today.");
    }
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Third-Party Logistics (3PL) Services",
    "provider": {
      "@type": "LocalBusiness",
      "name": "DeMar Transportation",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "10471 Double R Blvd",
        "addressLocality": "Reno",
        "addressRegion": "NV",
        "postalCode": "89521",
        "addressCountry": "US"
      },
      "telephone": "(775) 230-4767",
      "email": "info@DeMarTransportation.com"
    },
    "serviceType": "Third-Party Logistics",
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "description": "Full-service third-party logistics (3PL) including freight management, carrier sourcing, warehousing coordination, real-time tracking, and supply chain optimization for businesses across the United States."
  };

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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://demartransportation.com/"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Services",
                    "item": "https://demartransportation.com/"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Third-Party Logistics (3PL)",
                    "item": "https://demartransportation.com/services/3pl"
                  }
                ]
              }),
            }}
          />

          {/* Hero */}
          <section className="pt-32 pb-20 px-4 bg-[hsl(225_97%_4%)] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }} />
            <div className="max-w-5xl mx-auto relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/5 backdrop-blur-sm">
                <Network className="h-4 w-4 text-[hsl(var(--accent))]" />
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
                  Full-Service Logistics
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                Third-Party
                <br />
                <span className="text-white/40">Logistics (3PL)</span>
              </h1>
              <p className="text-lg text-white/60 max-w-2xl mb-10 leading-relaxed">
                Simplify your supply chain with a single logistics partner. DeMar Transportation manages your freight, coordinates warehousing, and provides end-to-end visibility so you can focus on growing your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/quote" className="group">
                    Get a Free Quote
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="xl"
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                >
                  <a href="tel:+17752304767">
                    <Phone className="mr-2 h-5 w-5" /> (775) 230-4767
                  </a>
                </Button>
              </div>
            </div>
          </section>

          {/* What is 3PL */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Overview
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                What Is a Third-Party Logistics Provider?
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl">
                <p>
                  A third-party logistics provider, commonly referred to as a 3PL, is an outside company that manages some or all of your supply chain and shipping operations on your behalf. Instead of hiring your own fleet, negotiating with dozens of carriers, coordinating warehouse space, and tracking every shipment yourself, you hand those responsibilities to a 3PL partner who has the infrastructure, relationships, and technology to do it more efficiently.
                </p>
                <p>
                  For many businesses, logistics is essential but not their core competency. Managing freight in-house requires dedicated staff, carrier contracts, transportation management software, insurance oversight, and constant communication with drivers and warehouses. A 3PL absorbs all of that complexity. You make one call, explain what needs to move and when, and your 3PL partner handles everything from there.
                </p>
                <p>
                  DeMar Transportation operates as both an asset-based carrier with our own fleet and a licensed freight broker with access to a nationwide network of vetted carriers. This dual capability means we are not limited to a single mode of transport or a fixed number of trucks. We match the right equipment and carrier to every load, every time, whether you need a single pallet moved across town or a multi-stop truckload routed across the country.
                </p>
              </div>
            </div>
          </section>

          {/* 3PL Capabilities */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Capabilities
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-10">
                Our 3PL Capabilities
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { Icon: Boxes, title: "Freight Management", desc: "Complete transportation management from pickup to delivery. We plan routes, select the right equipment type, coordinate loading and unloading schedules, and manage all documentation including bills of lading, proof of delivery, and insurance certificates." },
                  { Icon: Users, title: "Carrier Sourcing", desc: "Access to a vast network of qualified, insured carriers covering every lane in the continental United States. We vet every carrier for safety records, insurance coverage, and on-time performance before tendering a single load. When your primary carrier is unavailable, we have backup options ready." },
                  { Icon: Globe, title: "Warehousing Coordination", desc: "Through our nationwide warehouse network, we coordinate storage, cross-docking, transloading, and distribution services. Whether you need short-term overflow space during peak season or a long-term distribution hub closer to your customers, we connect you with the right facility." },
                  { Icon: BarChart3, title: "Supply Chain Visibility", desc: "Real-time tracking and proactive status updates on every shipment. You always know where your freight is, when it will arrive, and if any issues arise along the way. We provide delivery confirmations, exception alerts, and detailed reporting to keep your team informed." },
                ].map((cap) => (
                  <div key={cap.title} className="p-6 rounded-xl bg-white shadow-[var(--shadow-card)]">
                    <div className="flex items-center gap-2 mb-3">
                      <cap.Icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                      <h3 className="text-base font-semibold text-[hsl(var(--primary))]">{cap.title}</h3>
                    </div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{cap.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Single Point of Contact */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Simplicity
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                One Call Handles Everything
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl">
                <p>
                  One of the biggest advantages of working with DeMar Transportation as your 3PL is the simplicity of having a single point of contact. Rather than juggling relationships with multiple carriers, warehouse operators, and freight brokers, you work with one dedicated logistics coordinator who knows your business, your shipping patterns, and your priorities.
                </p>
                <p>
                  When a shipment needs to move, you make one call or send one email. Your logistics coordinator takes it from there: sourcing the carrier, booking the load, arranging pickup and delivery appointments, monitoring the shipment in transit, and confirming delivery. If something changes mid-route, such as a delay, a rescheduled delivery window, or an equipment issue, your coordinator handles the adjustments and keeps you updated.
                </p>
                <p>
                  This single-provider model eliminates the communication gaps and finger-pointing that often occur when multiple vendors are involved in a single shipment. When DeMar coordinates the entire process, accountability is clear and problems get resolved faster.
                </p>
              </div>
            </div>
          </section>

          {/* Technology & Visibility */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Technology
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-10">
                Technology and Real-Time Visibility
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { value: "GPS", label: "Real-Time Tracking", desc: "GPS-based shipment tracking with regular location updates. Know exactly where your freight is at every stage of transit, from pickup to final delivery." },
                  { value: "24/7", label: "Proactive Updates", desc: "Status notifications at key milestones: loaded, in transit, approaching delivery, and delivered. Exception alerts if delays or issues arise so there are never surprises." },
                  { value: "POD", label: "Delivery Confirmation", desc: "Electronic proof of delivery documentation including signed BOLs, delivery receipts, and photos when required. Complete audit trail for every shipment." },
                ].map((item) => (
                  <div key={item.label} className="p-6 rounded-xl bg-white shadow-[var(--shadow-card)]">
                    <div className="text-3xl font-bold text-[hsl(var(--accent))] tracking-tight mb-2">
                      {item.value}
                    </div>
                    <div className="text-sm font-semibold text-[hsl(var(--primary))] mb-2">
                      {item.label}
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Scalability */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Scalability
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                Scalable Logistics That Grow With Your Business
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl">
                <p>
                  Business is not static, and your logistics solution should not be either. Whether you are dealing with seasonal demand surges, launching into new geographic markets, or experiencing rapid growth, DeMar Transportation scales with you. Because we have access to a deep carrier network and flexible warehouse partnerships, adding capacity is a matter of coordination rather than capital investment.
                </p>
                <p>
                  During peak season, when your shipping volume might double or triple overnight, we ramp up carrier capacity to handle the increased load count without compromising transit times. When volume drops back to normal, you are not paying for idle trucks or empty warehouse space. This flexibility is one of the core reasons companies choose a 3PL partner over building their own logistics operation from scratch.
                </p>
              </div>
            </div>
          </section>

          {/* Industries Served */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Industries
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                Industries We Serve
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl leading-relaxed">
                DeMar Transportation provides 3PL services to businesses across a wide range of industries. Our experience managing complex supply chains for these sectors means we understand the unique requirements, compliance standards, and delivery expectations your industry demands.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { title: "Manufacturing", desc: "Inbound raw materials, outbound finished goods, and just-in-time delivery to keep production lines running. We coordinate multi-stop routes and manage vendor shipping programs." },
                  { title: "Retail & Distribution", desc: "Store replenishment, distribution center transfers, and seasonal inventory positioning. We understand retailer compliance programs, appointment scheduling, and delivery requirements." },
                  { title: "E-Commerce", desc: "High-frequency fulfillment center replenishment, last-mile coordination, and the fast turnaround that online retail demands. We handle the shipping so you can focus on selling." },
                  { title: "Food & Beverage", desc: "Temperature-controlled and dry freight for food manufacturers and distributors. We coordinate both refrigerated and dry van capacity to match your product requirements." },
                  { title: "Construction", desc: "Building materials, equipment, and supplies delivered to job sites on schedule. We handle oversized loads, flatbed coordination, and multi-drop deliveries across active project sites." },
                  { title: "Pharmaceutical", desc: "Secure, reliable transportation for pharmaceutical products and medical supplies. We work with carriers who maintain the compliance and handling standards your products require." },
                ].map((industry) => (
                  <div key={industry.title} className="p-5 rounded-xl bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
                    <h3 className="text-sm font-semibold text-[hsl(var(--primary))] mb-2">{industry.title}</h3>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{industry.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Cost Savings */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Advantages
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-10">
                How 3PL Saves You Money
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: "Volume-Based Rates", desc: "Because we aggregate freight volume from many shippers, we negotiate carrier rates that individual companies typically cannot access on their own. You benefit from our buying power without committing to minimum volume guarantees." },
                  { title: "Optimized Routing", desc: "Our logistics team analyzes your shipping lanes and identifies opportunities to consolidate loads, eliminate empty miles, and select the most efficient routes. Small improvements in routing efficiency compound into significant savings over time." },
                  { title: "Reduced Overhead", desc: "Eliminate the cost of maintaining an in-house logistics department, transportation management software, carrier contracts, and compliance monitoring. A 3PL replaces those fixed costs with a variable, per-shipment model that scales with your business." },
                  { title: "Fewer Claims and Delays", desc: "Vetted carriers, proper load planning, and proactive monitoring reduce the frequency of damage claims, missed appointments, and service failures. Prevention is always less expensive than recovery." },
                ].map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-4">
                    <TrendingUp className="h-5 w-5 text-[hsl(var(--accent))] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-1">{benefit.title}</h3>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why DeMar */}
          <section className="py-20 px-4 bg-[hsl(225_97%_4%)]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Why DeMar
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-8">
                Why Choose DeMar Transportation as Your 3PL Partner
              </h2>
              <div className="space-y-5 text-base text-white/60 leading-relaxed max-w-3xl">
                <p>
                  DeMar Transportation is not a faceless logistics corporation. We are a Reno, Nevada-based company that builds real relationships with every client. When you call us, you reach a person who knows your account, your freight, and your priorities. That level of personal attention is rare in an industry that has trended toward automation and call centers.
                </p>
                <p>
                  What sets us apart is the combination of our own fleet assets and our broker authority. As an asset-based carrier, we have skin in the game and understand what it takes to move freight safely and on time. As a licensed broker, we can tap into a nationwide carrier network to find the right equipment, capacity, and pricing for any shipment. This dual capability gives you the reliability of an asset carrier with the flexibility of a full-service brokerage.
                </p>
                <p>
                  Transparency is a core value. We provide honest rate quotes, realistic transit estimates, and straightforward communication when things do not go as planned. No hidden fees, no vague delivery windows, no excuses. We also offer complementary services including <Link to="/services/warehousing" className="text-[hsl(var(--accent))] hover:underline">warehousing and distribution</Link>, <Link to="/services/dry-van" className="text-[hsl(var(--accent))] hover:underline">dry van shipping</Link>, <Link to="/services/reefer" className="text-[hsl(var(--accent))] hover:underline">refrigerated transport</Link>, and <Link to="/services/flatbed" className="text-[hsl(var(--accent))] hover:underline">flatbed hauling</Link> to cover every aspect of your logistics needs under one roof.
                </p>
              </div>
            </div>
          </section>

          {/* Related Resources */}
          <section className="py-16 bg-[hsl(var(--surface-low))]">
            <div className="container mx-auto px-4 max-w-5xl">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Learn More
              </p>
              <h2 className="text-3xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                Related Resources
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Freight Broker vs Carrier vs 3PL", description: "Understand the differences and how they work", to: "/resources/broker-vs-carrier-vs-3pl" },
                  { title: "How to Choose a Freight Carrier", description: "Checklist for evaluating logistics partners", to: "/resources/how-to-choose-freight-carrier" },
                  { title: "How Much Does Freight Shipping Cost?", description: "2026 pricing guide with per-mile rates", to: "/resources/freight-shipping-cost" },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="group p-5 rounded-xl bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)] transition-all duration-300"
                  >
                    <h3 className="text-sm font-semibold text-[hsl(var(--primary))] mb-1 group-hover:text-[hsl(var(--accent))] transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{link.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-[hsl(var(--accent))]">
            <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-2xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
                Ready to Simplify Your Supply Chain?
              </h2>
              <p className="text-base text-[hsl(var(--primary))]/70 mb-8 max-w-md mx-auto">
                Let DeMar Transportation manage your logistics so you can focus on what you do best. Contact us today for a free consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]/90 font-semibold"
                  asChild
                >
                  <Link to="/quote" className="group">
                    Request a Free Quote
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
              <p className="mt-6 text-[hsl(var(--primary))]/50 text-xs">
                DeMar Transportation | 10471 Double R Blvd, Reno, NV 89521 | info@DeMarTransportation.com
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ThirdPartyLogistics;
