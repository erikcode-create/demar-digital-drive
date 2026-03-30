import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, ArrowRight, CheckCircle, Warehouse, MapPin, PackageCheck, BarChart3, Clock, Layers } from "lucide-react";

const WarehousingPage = () => {
  useEffect(() => {
    document.title = "Warehousing & Distribution Services | Storage & Fulfillment | DeMar Transportation";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "DeMar Transportation offers warehousing and distribution services through a nationwide warehouse network. Short-term storage, cross-docking, order fulfillment, and inventory management. Get a free quote today.");
    }
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Warehousing & Distribution Services",
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
    "serviceType": "Warehousing and Distribution",
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "description": "Nationwide warehousing and distribution services including short-term and long-term storage, cross-docking, transloading, pick-and-pack, order fulfillment, and inventory management through strategically located warehouse facilities."
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
                    "name": "Warehousing & Distribution",
                    "item": "https://demartransportation.com/services/warehousing"
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
                <Warehouse className="h-4 w-4 text-[hsl(var(--accent))]" />
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
                  Nationwide Network
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                Warehousing
                <br />
                <span className="text-white/40">& Distribution</span>
              </h1>
              <p className="text-lg text-white/60 max-w-2xl mb-10 leading-relaxed">
                Strategically located warehouse facilities across the United States. DeMar Transportation coordinates storage, fulfillment, and distribution through our network of warehouse partners to keep your products moving and your customers satisfied.
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

          {/* Overview */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Overview
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                A Nationwide Warehouse Network at Your Disposal
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl">
                <p>
                  Efficient warehousing is the backbone of any well-run supply chain. Whether you need a place to stage inventory before it ships to retail locations, a cross-dock facility to consolidate and redistribute freight, or a fulfillment center to process individual customer orders, DeMar Transportation connects you with the right warehouse space in the right location.
                </p>
                <p>
                  Through our network of strategic warehouse locations positioned near major transportation corridors and population centers, we provide flexible storage and distribution services without requiring you to sign long-term leases, hire warehouse staff, or invest in facility infrastructure. Our warehouse partners operate modern, secure facilities equipped with the technology and processes to handle your inventory with care and precision.
                </p>
                <p>
                  What makes our approach different is the integration between warehousing and transportation. Because DeMar manages both your storage needs and your freight movements, there is no disconnect between what is sitting in a warehouse and what is scheduled to ship. One provider, one point of contact, complete coordination from receipt to delivery.
                </p>
              </div>
            </div>
          </section>

          {/* Warehousing Services */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Services
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-10">
                Warehousing Services
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { Icon: Clock, title: "Short-Term & Long-Term Storage", desc: "Flexible storage arrangements that match your needs. Use short-term space for seasonal overflow, product launches, or import staging. Long-term programs available for ongoing inventory positioning without multi-year lease commitments." },
                  { Icon: Layers, title: "Cross-Docking", desc: "Inbound freight is unloaded, sorted, and reloaded onto outbound trucks with minimal or no storage time. Cross-docking reduces handling costs, accelerates delivery times, and eliminates the need for dedicated warehouse space for fast-moving products." },
                  { Icon: PackageCheck, title: "Transloading", desc: "Transfer cargo between transportation modes or container types. Commonly used to move freight from ocean containers into domestic trailers, or to consolidate multiple smaller shipments into full truckloads for more efficient overland transport." },
                  { Icon: Warehouse, title: "Pick-and-Pack", desc: "Individual order fulfillment from bulk inventory. Warehouse staff pick items from shelved stock, pack them to your specifications, label them, and prepare them for shipment. Ideal for e-commerce operations and direct-to-consumer brands." },
                  { Icon: PackageCheck, title: "Order Fulfillment", desc: "End-to-end fulfillment services from receiving inventory to shipping finished orders. We coordinate the entire process including receiving, quality inspection, storage, order processing, packing, and carrier handoff." },
                  { Icon: BarChart3, title: "Inventory Management", desc: "Real-time inventory tracking with regular cycle counts and reporting. Know exactly how much stock you have, where it is located within the facility, and when reorder points are approaching. Integration with your systems available." },
                ].map((service) => (
                  <div key={service.title} className="p-5 rounded-xl bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <service.Icon className="h-4 w-4 text-[hsl(var(--accent))]" />
                      <h3 className="text-sm font-semibold text-[hsl(var(--primary))]">{service.title}</h3>
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{service.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Distribution Services */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Distribution
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                Distribution Services
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl mb-10">
                <p>
                  Warehousing is only half the equation. Getting products from storage to their final destination efficiently and on time is where distribution comes in. DeMar Transportation coordinates outbound distribution from our warehouse network using our own fleet and our carrier partners to deliver your goods wherever they need to go.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { value: "Last-Mile", label: "Last-Mile Delivery", desc: "Coordination of final-mile delivery from warehouse to end customer, retail location, or job site. We work with local delivery partners to ensure your products arrive on time and in perfect condition, even for residential deliveries." },
                  { value: "Regional", label: "Regional Distribution", desc: "Multi-stop delivery routes serving multiple locations within a geographic region. We optimize route sequencing to minimize transit time and cost while meeting each location's delivery window and receiving requirements." },
                  { value: "Pool", label: "Pool Distribution", desc: "Consolidate multiple LTL shipments headed to the same region into a single truckload, then break them out for individual delivery at the destination market. Pool distribution reduces per-unit shipping costs significantly compared to individual LTL shipments." },
                ].map((item) => (
                  <div key={item.label} className="p-6 rounded-xl bg-[hsl(var(--surface-low))] hover:bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
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

          {/* Strategic Locations */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Locations
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                Strategic Warehouse Locations
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl mb-10">
                <p>
                  Location is everything in warehousing and distribution. A warehouse that is too far from your customers adds transit time and cost to every order. Our warehouse network includes facilities positioned near major interstate highways, intermodal rail yards, ports of entry, and high-density population centers throughout the United States.
                </p>
                <p>
                  Whether you need a West Coast facility to receive imports from the Pacific Rim, a Midwest hub to serve the heartland, or East Coast distribution points for rapid delivery to the Northeast corridor, we can place your inventory where it needs to be. Multiple warehouse locations also provide supply chain redundancy, so a disruption at one facility does not shut down your entire distribution operation.
                </p>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { region: "West Coast", detail: "Import staging, Pacific trade lane support" },
                  { region: "Mountain West", detail: "Regional hub serving NV, UT, CO, AZ corridors" },
                  { region: "Midwest", detail: "Central distribution reaching 80% of the US in 2 days" },
                  { region: "East Coast", detail: "Northeast consumer market and port access" },
                ].map((loc) => (
                  <div key={loc.region} className="p-5 rounded-xl bg-white shadow-[var(--shadow-card)] text-center">
                    <MapPin className="w-5 h-5 text-[hsl(var(--accent))] mx-auto mb-2" />
                    <h3 className="text-sm font-semibold text-[hsl(var(--primary))] mb-1">{loc.region}</h3>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{loc.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Technology */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Technology
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-10">
                Technology-Driven Warehouse Operations
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: "Inventory Tracking", desc: "Barcode and SKU-level tracking from the moment your products arrive at the warehouse. Every receipt, movement, and shipment is recorded, giving you a complete audit trail and accurate stock counts at all times." },
                  { title: "WMS Integration", desc: "Our warehouse partners operate warehouse management systems (WMS) that can integrate with your ERP, e-commerce platform, or order management system. Automated data exchange reduces manual entry errors and speeds up order processing." },
                  { title: "Real-Time Stock Visibility", desc: "Access current inventory levels, inbound shipment status, and outbound order progress. Reporting dashboards provide the data you need to make informed decisions about replenishment, allocation, and distribution timing." },
                  { title: "Secure Facilities", desc: "Warehouse locations in our network maintain security protocols including surveillance cameras, controlled access, alarm systems, and regular security audits. Your inventory is protected around the clock." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--accent))] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-1">{item.title}</h3>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Industries */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Industries
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                Industries We Serve
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl leading-relaxed">
                Our warehousing and distribution services support businesses across multiple industries, each with unique storage requirements, handling procedures, and delivery expectations.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { name: "E-Commerce Fulfillment", detail: "Store inventory close to your customers and ship orders fast. Our warehouse partners handle receiving, storage, pick-and-pack, and carrier handoff so you can offer competitive delivery times without managing your own warehouse." },
                  { name: "Retail Distribution", detail: "Stage inventory for retail replenishment, manage seasonal stock builds, and coordinate multi-store deliveries. We understand retailer compliance requirements and appointment-based receiving schedules." },
                  { name: "Manufacturing Supply Chain", detail: "Inbound raw material staging, work-in-process buffer storage, and finished goods distribution. We help manufacturers maintain lean inventory while ensuring materials are available when production schedules demand them." },
                  { name: "Seasonal Storage", detail: "Not every business needs warehouse space year-round. Our flexible arrangements let you scale up during peak seasons and scale down when demand drops, so you only pay for the space you actually use." },
                ].map((industry) => (
                  <div key={industry.name} className="p-6 rounded-xl bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
                    <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-2">{industry.name}</h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{industry.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Scalable Solutions */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Flexibility
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                Flexible, Scalable Warehouse Options
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl">
                <p>
                  Traditional warehousing often requires long-term lease commitments, capital investment in racking and equipment, and the overhead of hiring and managing warehouse staff. DeMar Transportation eliminates those barriers by providing access to our warehouse network on flexible terms. Need 5,000 square feet for three months during your busy season? Done. Need to expand to 20,000 square feet as your business grows? We scale with you.
                </p>
                <p>
                  This flexibility is especially valuable for businesses that are expanding into new geographic markets. Rather than committing to a warehouse lease in an unfamiliar city, you can test the market by placing inventory in one of our partner facilities, evaluate the results, and adjust your strategy without being locked into a multi-year obligation.
                </p>
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
                Why Choose DeMar Transportation for Warehousing
              </h2>
              <div className="space-y-5 text-base text-white/60 leading-relaxed max-w-3xl">
                <p>
                  The biggest advantage of using DeMar Transportation for warehousing is the tight integration between storage and transportation. Most companies work with a warehouse provider and a separate freight company, which creates communication gaps, scheduling conflicts, and finger-pointing when things go wrong. With DeMar, one team coordinates your entire logistics operation from warehouse receipt through final delivery.
                </p>
                <p>
                  As both an asset-based carrier and a licensed freight broker, we control more of the supply chain than a standalone warehouse company ever could. When your inventory is ready to ship, we do not need to wait for a third-party carrier to become available. We dispatch from our own fleet or immediately source a vetted carrier from our network. The result is faster turnaround, fewer delays, and lower total logistics costs.
                </p>
                <p>
                  Whether you need warehousing as a standalone service or as part of a comprehensive <Link to="/services/3pl" className="text-[hsl(var(--accent))] hover:underline">third-party logistics solution</Link>, DeMar Transportation has the network, the technology, and the people to make it work. Contact us to discuss your warehousing needs and let us design a solution that fits your business.
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
                  { title: "How to Ship Freight: Beginner's Guide", description: "Step-by-step guide for first-time shippers", to: "/resources/how-to-ship-freight" },
                  { title: "Seasonal Freight Shipping Guide", description: "Peak season rates and planning tips", to: "/resources/seasonal-freight-shipping" },
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
                Need Warehouse Space? Let's Talk.
              </h2>
              <p className="text-base text-[hsl(var(--primary))]/70 mb-8 max-w-md mx-auto">
                Tell us about your storage and distribution requirements. No long-term commitments required.
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

export default WarehousingPage;
