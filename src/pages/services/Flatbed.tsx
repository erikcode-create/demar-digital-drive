import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, ArrowRight, CheckCircle, AlertTriangle, Ruler, Weight } from "lucide-react";

const Flatbed = () => {
  useEffect(() => {
    document.title = "Flatbed Trucking & Heavy Haul Shipping | Step Deck & Lowboy | DeMar Transportation";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "DeMar Transportation offers flatbed, step-deck, and lowboy shipping for steel, lumber, machinery, and oversized loads. FMCSA-compliant securement. Get a flatbed freight quote from Reno, NV.");
    }
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Flatbed Shipping",
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
    "serviceType": "Flatbed Freight Shipping",
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "description": "Professional flatbed, step-deck, and lowboy trucking services for oversized, heavy, and open-deck freight across the United States.",
    "dateModified": "2026-04-05"
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
                    "name": "Flatbed Trucking",
                    "item": "https://demartransportation.com/services/flatbed"
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
                <Weight className="h-4 w-4 text-[hsl(var(--accent))]" />
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
                  Open-Deck Specialists
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                Flatbed
                <br />
                <span className="text-white/40">Shipping Services</span>
              </h1>
              <p className="text-lg text-white/60 max-w-2xl mb-10 leading-relaxed">
                Professional open-deck freight transportation for steel, lumber, machinery, construction materials, and oversized loads. DeMar Transportation provides flatbed, step-deck, and lowboy capacity nationwide with FMCSA-compliant load securement.
              </p>
              <p className="text-sm text-white/50 max-w-2xl leading-relaxed mt-4">
                DeMar Transportation provides flatbed shipping for oversized, heavy, and irregularly shaped freight that cannot fit in enclosed trailers. Our flatbed service handles construction materials, heavy machinery, steel, and lumber with proper load securement and permitting for oversize loads.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/quote" className="group">
                    Get a Flatbed Quote
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

          {/* What is Flatbed */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Overview
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                What Is Flatbed Shipping?
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl">
                <p>
                  Flatbed shipping uses open-deck trailers -- trailers with a flat loading surface and no enclosed walls or roof -- to transport freight that cannot fit inside a standard <Link to="/services/dry-van" className="text-[hsl(var(--accent))] hover:underline">dry van trailer</Link> due to its size, shape, weight, or loading requirements. Flatbed trailers allow cargo to be loaded from the top, sides, or rear using cranes, forklifts, or other material handling equipment, making them essential for industries that move heavy, oversized, or irregularly shaped products.
                </p>
                <p>
                  Flatbed freight represents one of the most specialized segments of the trucking industry. Unlike enclosed trailers, flatbed loads require careful planning around securement methods, tarping requirements, permit regulations, and route surveys. The driver's skill in properly securing cargo is just as important as the equipment itself, which is why DeMar Transportation works exclusively with experienced flatbed carriers who understand the stakes involved.
                </p>
                <p>
                  Through our extensive carrier network, we access one of the largest flatbed carrier pools in North America. DeMar Transportation works with thousands of specialized flatbed owner-operators who haul steel, building materials, heavy equipment, and oversized freight every day.
                </p>
              </div>
            </div>
          </section>

          {/* Types of Flatbed Trailers */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Equipment
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                Types of Flatbed Trailers
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl leading-relaxed">
                Different cargo dimensions and weight profiles require different trailer configurations. DeMar Transportation has access to all major flatbed trailer types to match the right equipment to your specific load.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Standard Flatbed", desc: "The workhorse of open-deck shipping. Standard flatbeds are 48 or 53 feet long with a deck height of approximately 60 inches from the ground. Maximum payload is typically 48,000 pounds, and the flat, unobstructed deck allows for flexible loading configurations.", best: "Steel coils, lumber bundles, palletized building materials, large machinery, and most general flatbed freight." },
                  { title: "Step-Deck (Drop-Deck)", desc: "Step-deck trailers feature a lower rear deck (approximately 38 to 42 inches high) with an upper front section. This design provides an additional 12 to 18 inches of vertical clearance compared to a standard flatbed, allowing taller loads to travel without exceeding the 13-foot-6-inch legal height limit.", best: "Tall machinery, industrial equipment, vehicles, HVAC units, and loads that exceed standard flatbed height limits." },
                  { title: "Double-Drop (Lowboy)", desc: "Double-drop trailers have a center well that sits as low as 18 to 24 inches off the ground, providing maximum vertical clearance for the tallest and heaviest loads. The lowboy design is essential for transporting equipment that cannot be disassembled to reduce its height.", best: "Construction equipment (excavators, bulldozers), industrial generators, transformers, and extremely tall or heavy machinery." },
                  { title: "Conestoga", desc: "A Conestoga trailer combines the loading flexibility of a flatbed with the weather protection of an enclosed van. A retractable, rolling tarp system covers the cargo area and can be pulled back completely for top- or side-loading, then extended to fully enclose the freight during transit.", best: "Cargo that requires both crane/forklift loading and protection from weather, such as finished goods, coated steel, paper products, and moisture-sensitive building materials." },
                ].map((trailer) => (
                  <div key={trailer.title} className="p-6 rounded-xl bg-white shadow-[var(--shadow-card)]">
                    <div className="flex items-center gap-2 mb-3">
                      <Ruler className="h-4 w-4 text-[hsl(var(--accent))]" />
                      <h3 className="text-base font-semibold text-[hsl(var(--primary))]">{trailer.title}</h3>
                    </div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-3">{trailer.desc}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                      <span className="font-semibold text-[hsl(var(--primary))]">Best for:</span> {trailer.best}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Common Cargo */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                What We Ship
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                Common Flatbed Freight
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl leading-relaxed">
                Flatbed trailers serve industries that move large, heavy, or unusually shaped products that enclosed trailers simply cannot accommodate. Here are the most common commodity types we transport on flatbed equipment:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { title: "Steel & Metals", desc: "Steel coils, plate steel, structural beams, rebar, aluminum extrusions, and metal fabrications. Steel is the single largest commodity category in flatbed freight, and proper securement is critical given the extreme weight and shifting potential." },
                  { title: "Lumber & Building Materials", desc: "Dimensional lumber, plywood, OSB, trusses, roofing materials, and packaged building products. Lumber loads often require tarping to protect against moisture and are typically loaded with forklifts at the shipper's yard." },
                  { title: "Construction Equipment", desc: "Excavators, backhoes, skid steers, compactors, and other heavy equipment. These loads frequently require step-deck or lowboy trailers and may need permits for overweight or over-dimension transport." },
                  { title: "Industrial Machinery", desc: "CNC machines, presses, generators, compressors, turbines, and manufacturing equipment. Machinery shipments demand careful load planning, engineered tie-down points, and sometimes custom crating or blocking." },
                  { title: "Prefabricated Structures", desc: "Modular building components, wall panels, roof trusses, pre-cast concrete elements, and steel building frames. These loads are often over-width or over-height, requiring permits, escorts, and restricted travel times." },
                  { title: "Pipes & Tubing", desc: "Steel pipe, PVC pipe, ductile iron pipe, culvert, and tubing for oil and gas, water infrastructure, and construction projects. Pipe loads require specialized securement including pipe stakes or cradles to prevent rolling." },
                ].map((cargo) => (
                  <div key={cargo.title} className="p-5 rounded-xl bg-[hsl(var(--surface-low))] hover:bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Weight className="h-4 w-4 text-[hsl(var(--accent))]" />
                      <h3 className="text-sm font-semibold text-[hsl(var(--primary))]">{cargo.title}</h3>
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{cargo.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Load Securement */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Safety & Compliance
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                Load Securement Standards
              </h2>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
                  <p>
                    The Federal Motor Carrier Safety Administration (FMCSA) publishes detailed cargo securement rules under 49 CFR Part 393, Subparts I and J. These regulations specify the minimum number of tie-downs, the aggregate working load limit required, and commodity-specific securement methods for loads including logs, metal coils, concrete pipe, intermodal containers, and heavy vehicles.
                  </p>
                  <p>
                    Flatbed load securement is not a suggestion -- it is a legal requirement that is actively enforced by DOT inspectors at weigh stations and during roadside inspections. Violations carry significant fines and can result in the load being placed out of service until deficiencies are corrected.
                  </p>
                  <h3 className="text-lg font-semibold text-[hsl(var(--primary))] mt-6">Securement Equipment We Require</h3>
                  <ul className="space-y-3">
                    {[
                      "Grade 70 transport chains with binders for steel, metal, and heavy equipment",
                      "4-inch ratchet straps rated at 5,400 lbs working load limit for general freight",
                      "Edge protectors and corner protectors to prevent strap damage and cargo abrasion",
                      "Lumber tarps (8-foot drop), steel tarps (6-foot drop), or smoke tarps as required by shipper",
                      "Coil racks, pipe stakes, and bulkheads for commodity-specific loads",
                      "Dunnage, blocking, and bracing materials for irregular-shaped cargo",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[hsl(var(--accent))] mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:w-80">
                  <div className="p-6 rounded-xl bg-[hsl(var(--accent))]/10">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-[hsl(var(--accent))]" />
                      <h3 className="text-sm font-semibold text-[hsl(var(--primary))]">Tarping Requirements</h3>
                    </div>
                    <div className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed space-y-3">
                      <p>
                        Many shippers require flatbed loads to be tarped to protect freight from rain, road spray, and debris. Tarping adds time and labor at the loading point, and rates should reflect this requirement. Always communicate tarping needs when requesting a quote so we can assign a carrier equipped with the correct tarp type and size.
                      </p>
                      <p>
                        Common tarp types include lumber tarps (8-foot drop), steel tarps (4 to 6-foot drop), smoke tarps (front-only coverage), and machinery tarps (custom-fitted covers).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Oversized / Permits */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Permits
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                Oversized and Overweight Permit Handling
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl">
                <p>
                  When your freight exceeds standard legal dimensions -- 8 feet 6 inches wide, 13 feet 6 inches tall, 53 feet long, or 80,000 pounds gross vehicle weight -- specialized permits are required from every state the load will pass through. Each state has its own permitting authority, fee structure, travel restrictions, and escort requirements, making oversized load logistics a complex undertaking.
                </p>
                <p>
                  DeMar Transportation handles the entire permit process for you. We work with professional permit services to secure single-trip or annual oversize/overweight permits, coordinate pilot car escorts when required, survey routes for bridge weight limits and vertical clearance restrictions, and schedule movements within permitted travel windows. Many states restrict oversize loads to daylight hours only and prohibit travel on holidays and weekends, so advance planning is essential.
                </p>
                <p>
                  For super loads -- shipments that exceed permit limits for standard oversize movement -- we coordinate with state DOT offices, utility companies, and law enforcement to plan the safest possible route with the fewest obstructions. Our experience with heavy haul and oversized freight across the western United States is a core strength of our flatbed operations.
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
                Why Choose DeMar for Flatbed Shipping
              </h2>
              <div className="space-y-5 text-base text-white/60 leading-relaxed max-w-3xl">
                <p>
                  Flatbed freight is inherently more complex than van freight. The equipment is more specialized, the securement requirements are more demanding, and the margin for error is smaller. A poorly secured flatbed load is not just a regulatory violation -- it is a serious safety hazard for the driver and every other vehicle on the road.
                </p>
                <p>
                  DeMar Transportation has built deep relationships across the flatbed carrier market, giving us access to some of the deepest open-deck capacity in the industry. We work with thousands of owner-operators who specialize exclusively in flatbed, step-deck, and heavy haul work. These are not van drivers pulling a flatbed trailer once in a while. They are career flatbed professionals who own the right equipment, carry the right securement gear, and know how to safely transport the commodities you ship.
                </p>
                <p>
                  From a single load of structural steel to a multi-load project moving construction equipment to a job site, DeMar Transportation has the flatbed capacity and operational expertise to execute safely and on schedule. We also handle <Link to="/services/dry-van" className="text-[hsl(var(--accent))] hover:underline">dry van</Link> and <Link to="/services/reefer" className="text-[hsl(var(--accent))] hover:underline">refrigerated</Link> shipments, so you can consolidate all your freight needs through one trusted partner.
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
                  { title: "Oversized Load Shipping Guide", description: "Permits, planning, and cost factors", to: "/resources/oversized-load-shipping" },
                  { title: "Types of Freight Trailers", description: "Complete guide to every trailer type", to: "/resources/types-of-freight-trailers" },
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
                Need a Flatbed? Get Your Quote Today.
              </h2>
              <p className="text-base text-[hsl(var(--primary))]/70 mb-8 max-w-md mx-auto">
                Describe your load -- dimensions, weight, origin, destination, and any special requirements -- and our flatbed specialists will provide a competitive rate and equipment recommendation.
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

export default Flatbed;
