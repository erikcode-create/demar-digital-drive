import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, Package, Truck, CheckCircle, ArrowRight } from "lucide-react";

const BoxTruck = () => {
  useEffect(() => {
    document.title = "Box Truck Shipping Services | Local & Regional Freight | DeMar Transportation";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "DeMar Transportation offers box truck shipping for local and regional freight. 26-foot trucks, liftgate service, residential delivery. Cost-effective for small to mid-size loads. Get a quote today.");
    }
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Box Truck Shipping",
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
    "serviceType": "Box Truck Freight Shipping",
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "description": "Cost-effective box truck shipping services for local and regional freight. 26-foot trucks with liftgate service for small to mid-size loads."
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
                    "name": "Box Truck Shipping",
                    "item": "https://demartransportation.com/services/box-truck"
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
                  Local & Regional
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                Box Truck
                <br />
                <span className="text-white/40">Shipping Services</span>
              </h1>
              <p className="text-lg text-white/60 max-w-2xl mb-10 leading-relaxed">
                Cost-effective freight transportation for small to mid-size loads. Our 26-foot box trucks deliver flexibility, reliability, and access to locations that full-size trailers cannot reach.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/quote" className="group">
                    Get a Box Truck Quote
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

          {/* What is Box Truck Freight */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Overview
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                What Is Box Truck Freight?
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl">
                <p>
                  Box truck freight refers to shipments transported using medium-duty straight trucks, typically 26 feet in length with an enclosed cargo area. These vehicles are a staple of the American freight industry, bridging the gap between small cargo vans and full 53-foot tractor-trailers. A standard 26-foot box truck offers approximately 1,700 cubic feet of cargo space and can carry between 10,000 and 12,000 pounds, depending on the specific vehicle configuration and axle rating.
                </p>
                <p>
                  Unlike tractor-trailer combinations that require a driver with a Class A commercial driver's license, most box trucks can be operated with a Class B CDL or even a standard license for lighter GVWR models. This translates to greater driver availability and more scheduling flexibility for shippers. The enclosed cargo bay protects freight from weather, road debris, and theft, while many box trucks come equipped with hydraulic liftgates that simplify loading and unloading at locations without dock-height bays.
                </p>
                <p>
                  Box truck shipping is one of the most versatile modes in the ground transportation industry. Whether you need to move a partial load across town or consolidate multiple LTL shipments into a single dedicated truck, box truck freight offers a practical and economical solution that full truckload carriers simply cannot match for smaller volumes.
                </p>
              </div>
            </div>
          </section>

          {/* Trailer Specs */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Specifications
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-10">
                Standard Box Truck Specs
              </h2>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {[
                  { value: "26 ft", label: "Cargo Bay Length", desc: "Standard 26-foot enclosed cargo area with rear roll-up door for easy loading and unloading." },
                  { value: "12,000 lbs", label: "Maximum Payload", desc: "Up to 12,000 pounds of freight capacity depending on vehicle configuration and axle rating." },
                  { value: "1,700 ft\u00B3", label: "Interior Cubic Capacity", desc: "Approximately 1,700 cubic feet of enclosed cargo space for palletized or loose freight." },
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
                Many box trucks come equipped with hydraulic liftgates rated for 2,500 to 3,000 pounds, enabling delivery to locations without loading docks.
              </p>
            </div>
          </section>

          {/* Ideal Use Cases */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Use Cases
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                Ideal Use Cases for Box Truck Shipping
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl leading-relaxed">
                Box trucks excel in scenarios where full truckload equipment is unnecessary or impractical.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { title: "Local & Regional Deliveries", desc: "Box trucks excel at short-haul and regional routes, typically covering distances under 500 miles. Their smaller size allows faster turnaround times and more efficient routing through urban corridors, making them ideal for daily delivery schedules and recurring distribution runs." },
                  { title: "LTL Consolidation", desc: "When you have freight that is too large for parcel carriers but does not justify a full 53-foot trailer, a box truck provides the perfect middle ground. Shippers can consolidate multiple less-than-truckload orders into a single dedicated box truck, reducing per-unit shipping costs and ensuring faster transit times compared to traditional LTL networks." },
                  { title: "Residential & Limited-Access Deliveries", desc: "Many delivery locations, including residential addresses, strip malls, and older commercial buildings, cannot accommodate a full-size tractor-trailer. Box trucks navigate narrow streets, tight parking lots, and low-clearance areas with ease, and their liftgates enable ground-level delivery without a loading dock." },
                  { title: "Trade Shows & Events", desc: "Moving trade show booths, display materials, and promotional inventory requires careful handling and precise scheduling. Box trucks offer the dedicated space and flexible timing that event logistics demand, with the ability to park close to convention center entrances and expo halls." },
                  { title: "Retail Restocking", desc: "Retail chains and independent stores rely on frequent, smaller deliveries to keep shelves stocked without overloading back-room storage. Box truck delivery routes can be tailored to multi-stop schedules, serving multiple store locations in a single run while meeting tight delivery windows." },
                  { title: "Construction Site Delivery", desc: "Construction materials, tools, and fixtures often need to reach active job sites where space is limited and road conditions are unpredictable. Box trucks provide the durability and maneuverability needed to deliver building supplies directly to the point of use." },
                ].map((item) => (
                  <div key={item.title} className="p-5 rounded-xl bg-[hsl(var(--surface-low))] hover:bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-[hsl(var(--accent))]" />
                      <h3 className="text-sm font-semibold text-[hsl(var(--primary))]">{item.title}</h3>
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Advantages */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Advantages
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-10">
                Advantages of Box Truck Shipping Over Full Truckload
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: "Cost-Efficient for Smaller Loads", desc: "Paying for a full 53-foot trailer when you only need a fraction of the space is an unnecessary expense. Box truck rates reflect the actual capacity being used, which means shippers moving 5,000 to 12,000 pounds of freight can realize significant cost savings. You get a dedicated vehicle without the full truckload price tag." },
                  { title: "Access to Tight Spaces", desc: "A 26-foot box truck is roughly half the length of a standard semi-trailer, giving it a decisive advantage in urban environments. Downtown alleys, residential neighborhoods, underground parking garages, and facilities with tight turning radii are all accessible. This eliminates the need for costly transloading or secondary shuttle services." },
                  { title: "Liftgate and Special Equipment Available", desc: "Many box trucks come equipped with hydraulic liftgates rated for 2,500 to 3,000 pounds, enabling delivery to locations without loading docks. Additional equipment such as pallet jacks, furniture pads, and ratchet straps can be provided to ensure safe handling of your cargo from pickup to delivery." },
                  { title: "Faster Loading and Unloading", desc: "Smaller cargo volumes mean faster dock times. Box truck shipments typically require a fraction of the loading time compared to full truckload, reducing detention charges and keeping your supply chain moving efficiently." },
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

          {/* Industries Served */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Industries
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                Industries We Serve
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl leading-relaxed">
                Box truck freight is one of the most adaptable transportation modes available. DeMar Transportation provides box truck shipping services across a wide range of industries throughout the western United States and beyond.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Retail & E-Commerce", detail: "Store restocking, warehouse-to-store transfers, and last-mile fulfillment for online orders requiring white-glove or threshold delivery." },
                  { title: "Construction & Building Materials", detail: "Lumber, drywall, fixtures, and tools delivered directly to job sites with liftgate service for ground-level unloading." },
                  { title: "Events & Hospitality", detail: "Trade show booths, catering equipment, furniture rentals, and event staging materials with time-definite delivery." },
                  { title: "Healthcare & Pharmaceuticals", detail: "Medical equipment, office furnishings, and pharmaceutical supplies requiring careful handling and on-time delivery." },
                ].map((industry) => (
                  <div key={industry.title} className="p-6 rounded-xl bg-[hsl(var(--surface-low))] hover:bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-[hsl(var(--accent))]" />
                      <h3 className="text-base font-semibold text-[hsl(var(--primary))]">{industry.title}</h3>
                    </div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{industry.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Choose DeMar */}
          <section className="py-20 px-4 bg-[hsl(225_97%_4%)]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Why DeMar
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-8">
                Why Choose DeMar Transportation for Box Truck Shipping
              </h2>
              <div className="space-y-5 text-base text-white/60 leading-relaxed max-w-3xl">
                <p>
                  Based in Reno, Nevada, DeMar Transportation has built a reputation for reliable, customer-focused freight services across the western United States. DeMar Transportation has access to a nationwide carrier network, ensuring capacity availability even during peak shipping seasons. Our box truck fleet and owner-operator network provide the flexibility to handle everything from single-pallet deliveries to multi-stop distribution runs.
                </p>
                <p>
                  Every shipment is assigned a dedicated logistics coordinator who manages your load from pickup to delivery. We provide real-time tracking updates, proactive communication about any delays or schedule changes, and proof of delivery documentation. Our team understands that your freight is your business, and we treat every load with the urgency and care it deserves.
                </p>
                <p>
                  Whether you need a one-time box truck delivery or an ongoing distribution partnership, DeMar Transportation offers competitive rates, consistent service, and the local expertise that national brokers cannot match. We know the roads, the docks, and the challenges of freight delivery in the Reno-Tahoe corridor and beyond.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-[hsl(var(--accent))]">
            <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-2xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
                Get a Box Truck Shipping Quote Today
              </h2>
              <p className="text-base text-[hsl(var(--primary))]/70 mb-8 max-w-md mx-auto">
                Ready to ship? Contact DeMar Transportation for a competitive box truck freight quote. Our logistics team is standing by to help.
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
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/services/sprinter-van" className="text-[hsl(var(--primary))]/60 hover:text-[hsl(var(--primary))] underline text-sm transition-colors">
                  Sprinter Van Services
                </Link>
                <span className="text-[hsl(var(--primary))]/30">&bull;</span>
                <Link to="/services/hazmat" className="text-[hsl(var(--primary))]/60 hover:text-[hsl(var(--primary))] underline text-sm transition-colors">
                  Hazmat & Fuel Transportation
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default BoxTruck;
