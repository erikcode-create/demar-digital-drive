import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Truck, Phone, Package, ArrowRight, CheckCircle } from "lucide-react";

const DryVan = () => {
  useEffect(() => {
    document.title = "Dry Van Shipping Services | Full Truckload FTL & LTL | DeMar Transportation";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "DeMar Transportation offers reliable dry van shipping across the US. 53-foot trailers, 45,000 lb capacity, full truckload and LTL services from Reno, NV. Get a free quote today.");
    }
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Dry Van Shipping",
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
    "serviceType": "Dry Van Freight Shipping",
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "description": "Professional dry van shipping services for full truckload and LTL freight. 53-foot enclosed trailers with 45,000 lb capacity."
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
                    "name": "Dry Van Shipping",
                    "item": "https://demartransportation.com/services/dry-van"
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
                <Truck className="h-4 w-4 text-[hsl(var(--accent))]" />
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
                  Most Popular Service
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                Dry Van
                <br />
                <span className="text-white/40">Shipping Services</span>
              </h1>
              <p className="text-lg text-white/60 max-w-2xl mb-10 leading-relaxed">
                Reliable, enclosed freight transportation for general commodities across the continental United States. Safe, on time, and at competitive rates.
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

          {/* What is Dry Van */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Overview
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                What Is Dry Van Freight Shipping?
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl">
                <p>
                  Dry van shipping is the most widely used method of over-the-road freight transportation in the United States, accounting for roughly 70 percent of all truckload shipments. A dry van is a fully enclosed, non-temperature-controlled trailer designed to protect cargo from weather, road debris, and theft during transit.
                </p>
                <p>
                  At DeMar Transportation, dry van freight is the backbone of our operations. Whether you need a full truckload (FTL) moved coast to coast or a less-than-truckload (LTL) shipment consolidated with other freight, our dry van fleet is equipped to handle it.
                </p>
                <p>
                  Dry van trailers are ideal for non-perishable goods that do not require temperature regulation, specialized loading equipment, or oversized handling. From palletized consumer products to boxed electronics, the dry van's versatility makes it the default choice for the majority of commercial shippers.
                </p>
              </div>
            </div>
          </section>

          {/* Trailer Specs — tonal cards, no borders */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Specifications
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-10">
                Standard Dry Van Trailer Specs
              </h2>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {[
                  { value: "53 ft", label: "Standard Trailer Length", desc: "Interior length of approximately 52 feet 6 inches. 48-foot trailers also available." },
                  { value: "45,000 lbs", label: "Maximum Payload Capacity", desc: "Up to 45,000 pounds of freight per load, depending on tractor configuration." },
                  { value: "2,390 ft³", label: "Interior Cubic Capacity", desc: "Interior width of 98.5 inches and height of 108 inches at door opening." },
                ].map((spec) => (
                  <div key={spec.label} className="p-6 rounded-xl bg-white shadow-[var(--shadow-card)]">
                    <div className="text-3xl font-bold text-[hsl(var(--accent))] tracking-tight mb-2">
                      {spec.value}
                    </div>
                    <div className="text-sm font-semibold text-[hsl(var(--primary))] mb-2">
                      {spec.label}
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                      {spec.desc}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl">
                Standard dry van trailers feature rear swing doors or roll-up doors. Most accommodate 22 to 26 standard pallets (48" x 40") loaded single-stacked.
              </p>
            </div>
          </section>

          {/* Common Cargo Types */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                What We Ship
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                Common Dry Van Cargo Types
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl leading-relaxed">
                Nearly any non-perishable, non-hazardous commodity that fits within the trailer dimensions can be shipped by dry van.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { title: "Consumer Goods", desc: "Household products, cleaning supplies, personal care items, and general merchandise." },
                  { title: "Electronics", desc: "Packaged electronics, computer components, appliances, and consumer technology products." },
                  { title: "Packaged Foods", desc: "Non-perishable food items including canned goods, snack foods, beverages, and dry goods." },
                  { title: "Retail Inventory", desc: "Clothing, footwear, furniture, home goods, and seasonal merchandise." },
                  { title: "Paper Products", desc: "Printing paper, packaging materials, tissue products, cardboard, and corrugated containers." },
                  { title: "Textiles & Fabrics", desc: "Rolls of fabric, yarn, finished garments, carpeting, and industrial textiles." },
                ].map((cargo) => (
                  <div key={cargo.title} className="p-5 rounded-xl bg-[hsl(var(--surface-low))] hover:bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-[hsl(var(--accent))]" />
                      <h3 className="text-sm font-semibold text-[hsl(var(--primary))]">{cargo.title}</h3>
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{cargo.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Advantages
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-10">
                Benefits of Dry Van Shipping
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: "Weather Protection", desc: "Fully enclosed trailers shield your freight from rain, snow, wind, and UV exposure throughout the entire journey." },
                  { title: "Cargo Security", desc: "Sealed trailers with locking mechanisms reduce the risk of theft, tampering, and pilferage during transit." },
                  { title: "Versatility", desc: "Dry vans accommodate the widest range of commodity types of any trailer class — from lightweight, high-volume to dense, heavy pallets." },
                  { title: "Cost-Effective", desc: "The most abundant equipment type on the road means more competitive rates, shorter lead times, and flexible scheduling." },
                ].map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-4">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--accent))] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-1">{benefit.title}</h3>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Industries */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Industries
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-10">
                Industries We Serve
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { name: "Retail & Distribution", detail: "We move freight for national retailers, regional distributors, and third-party logistics providers. Our carriers understand appointment scheduling, lumper requirements, and retailer compliance programs." },
                  { name: "Manufacturing", detail: "Raw materials inbound and finished products outbound. We coordinate just-in-time deliveries where schedule reliability directly impacts production line uptime." },
                  { name: "Food & Beverage", detail: "Non-perishable food products, beverages, and packaged goods require clean, dry trailers. Our carriers maintain washout records and comply with food-grade standards." },
                  { name: "E-Commerce & Fulfillment", detail: "High-frequency shipments to fulfillment centers and last-mile hubs. We support the fast-paced replenishment cycles that e-commerce operations demand." },
                ].map((industry) => (
                  <div key={industry.name} className="p-6 rounded-xl bg-[hsl(var(--surface-low))] hover:bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
                    <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-2">{industry.name}</h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{industry.detail}</p>
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
                Why Choose DeMar Transportation
              </h2>
              <div className="space-y-5 text-base text-white/60 leading-relaxed max-w-3xl">
                <p>
                  Based in Reno, Nevada, DeMar Transportation combines personalized service with the capacity of an extensive carrier network spanning North America. Our vetted owner-operators have a personal stake in delivering your freight safely and on schedule.
                </p>
                <p>
                  We provide real-time shipment tracking, proactive communication on load status, and a single point of contact for every shipment from pickup through delivery.
                </p>
                <p>
                  Whether you are shipping a single full truckload or managing a recurring lane program with hundreds of loads per month, DeMar Transportation has the capacity, carrier relationships, and operational expertise to keep your supply chain moving. We also offer <Link to="/services/reefer" className="text-[hsl(var(--accent))] hover:underline">refrigerated shipping</Link> and <Link to="/services/flatbed" className="text-[hsl(var(--accent))] hover:underline">flatbed transportation</Link> for specialized equipment needs.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-[hsl(var(--accent))]">
            <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-2xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
                Ready to Ship?
              </h2>
              <p className="text-base text-[hsl(var(--primary))]/70 mb-8 max-w-md mx-auto">
                Get your dry van quote today. Our freight specialists are available to help.
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

export default DryVan;
