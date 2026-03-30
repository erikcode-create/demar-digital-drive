import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Package, Phone, ArrowRight, CheckCircle, Scale, Clock, DollarSign, Layers, ShieldCheck } from "lucide-react";

const LTL = () => {
  useEffect(() => {
    document.title = "LTL Freight Shipping Services | Less Than Truckload | DeMar Transportation";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "DeMar Transportation provides competitive LTL (Less Than Truckload) freight shipping nationwide. Share trailer space, pay only for what you ship. NMFC classes 50-500, 1-10 pallets, fast transit times. Get a free quote.");
    }
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "LTL Freight Shipping",
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
    "serviceType": "LTL Freight Shipping",
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "description": "Less Than Truckload (LTL) freight shipping services for shipments under 10,000 lbs. Competitive rates, nationwide coverage, and freight class optimization."
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
                    "name": "Less Than Truckload (LTL)",
                    "item": "https://demartransportation.com/services/ltl"
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
                <Package className="h-4 w-4 text-[hsl(var(--accent))]" />
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
                  Cost-Effective Freight
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                LTL Freight
                <br />
                <span className="text-white/40">Shipping Services</span>
              </h1>
              <p className="text-lg text-white/60 max-w-2xl mb-10 leading-relaxed">
                Ship smarter with Less Than Truckload freight. Pay only for the trailer space your shipment occupies and let DeMar Transportation handle the rest -- from carrier selection to delivery coordination.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/quote" className="group">
                    Get a Free LTL Quote
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

          {/* What is LTL Shipping */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Overview
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                What Is LTL Shipping?
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl">
                <p>
                  Less Than Truckload (LTL) shipping is a freight transportation method where multiple shippers share space on the same trailer. Instead of paying for an entire 53-foot trailer, you only pay for the portion of the trailer your freight occupies. This makes LTL an economical choice for businesses that need to move goods but do not have enough cargo to fill a full truck.
                </p>
                <p>
                  In an LTL shipment, the carrier picks up freight from multiple shippers, consolidates those shipments at a terminal, and then routes them through a hub-and-spoke network to their respective destinations. Your freight is palletized, labeled, and loaded alongside other shippers' cargo, with each shipment tracked independently through the carrier's system.
                </p>
                <p>
                  At DeMar Transportation, we leverage our extensive carrier network and 3PL brokerage capabilities to secure competitive LTL rates from top national and regional carriers. Whether you are shipping a single pallet from Reno to Chicago or managing recurring LTL lanes across the country, our freight specialists match your shipment to the right carrier for the best combination of price, transit time, and service quality.
                </p>
              </div>
            </div>
          </section>

          {/* When to Use LTL vs FTL */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Comparison
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                When to Use LTL vs. Full Truckload
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl leading-relaxed">
                Choosing between LTL and FTL depends on the size, weight, and urgency of your shipment. Here is a straightforward guide to help you determine which mode fits your needs:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 rounded-xl bg-white shadow-[var(--shadow-card)]">
                  <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-4">LTL Is Best When...</h3>
                  <div className="space-y-3">
                    {[
                      "Your shipment weighs under 10,000 lbs",
                      "You are shipping 1 to 10 pallets",
                      "You do not need a full trailer and want to reduce costs",
                      "Delivery within 1 to 5 business days is acceptable",
                      "You are replenishing inventory or sending samples",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[hsl(var(--accent))] mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 rounded-xl bg-[hsl(var(--surface))]">
                  <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-4">Consider FTL Instead When...</h3>
                  <div className="space-y-3">
                    {[
                      "Your shipment weighs over 10,000 lbs",
                      "You have 10 or more pallets to ship",
                      "Freight is high-value, fragile, or time-sensitive",
                      "You need direct transit with no terminal handling",
                      "The cost of LTL with accessorials approaches FTL rates",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <ArrowRight className="w-5 h-5 text-[hsl(var(--muted-foreground))]/50 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-6 leading-relaxed">
                Shipping more than 10,000 lbs or filling more than half a trailer? Our <Link to="/services/ftl" className="text-[hsl(var(--accent))] hover:underline font-medium">full truckload (FTL) services</Link> may offer a better rate and faster transit for your shipment.
              </p>
            </div>
          </section>

          {/* NMFC Freight Classes */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Classification
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                Understanding NMFC Freight Classes
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl mb-10">
                <p>
                  Every LTL shipment is assigned a freight class under the National Motor Freight Classification (NMFC) system, which ranges from Class 50 to Class 500. The freight class directly impacts your shipping rate -- lower classes cost less per hundredweight, while higher classes cost more. The NMFC classification is determined by four key factors:
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {[
                  { Icon: Scale, title: "Density", desc: "Weight per cubic foot. Denser freight (like bricks or metal) receives a lower class. Lightweight, bulky items (like pillows or lampshades) receive a higher class." },
                  { Icon: Package, title: "Handling", desc: "How easy or difficult the freight is to load and unload. Standard palletized cargo is easy to handle. Oddly shaped, fragile, or hazardous items require more care and cost more." },
                  { Icon: ShieldCheck, title: "Liability", desc: "The value and susceptibility to damage or theft. High-value electronics or perishable goods carry greater carrier liability, resulting in a higher freight class." },
                  { Icon: Layers, title: "Stowability", desc: "How well the freight fits with other cargo. Items that cannot be stacked, must be loaded in a specific orientation, or are regulated receive a higher class." },
                ].map((item) => (
                  <div key={item.title} className="p-6 rounded-xl bg-[hsl(var(--surface-low))] hover:bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
                    <item.Icon className="h-6 w-6 text-[hsl(var(--accent))] mb-3" />
                    <h3 className="text-sm font-semibold text-[hsl(var(--primary))] mb-2">{item.title}</h3>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="p-6 rounded-xl bg-[hsl(var(--surface-low))]">
                <h3 className="text-sm font-semibold text-[hsl(var(--primary))] mb-4">Common Freight Class Examples</h3>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-[hsl(var(--muted-foreground))]">
                  <p><strong className="text-[hsl(var(--primary))]">Class 50:</strong> Fits-in-drum goods, clean brick, hardwood flooring (50+ lbs/ft3)</p>
                  <p><strong className="text-[hsl(var(--primary))]">Class 70:</strong> Auto parts, food items, machinery (15-22.5 lbs/ft3)</p>
                  <p><strong className="text-[hsl(var(--primary))]">Class 100:</strong> Boat covers, car covers, canvas, wine cases (9-10.5 lbs/ft3)</p>
                  <p><strong className="text-[hsl(var(--primary))]">Class 150:</strong> Auto sheet metal, bookcases, cabinets (5-6 lbs/ft3)</p>
                  <p><strong className="text-[hsl(var(--primary))]">Class 250:</strong> Bamboo furniture, mattresses, plasma TVs (2-3 lbs/ft3)</p>
                  <p><strong className="text-[hsl(var(--primary))]">Class 500:</strong> Low-density freight like bags of gold dust, ping pong balls (&lt;1 lb/ft3)</p>
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-4 leading-relaxed">
                  Not sure about your freight class? Our team will help you determine the correct NMFC classification to ensure accurate quoting and avoid reclassification charges from the carrier.
                </p>
              </div>
            </div>
          </section>

          {/* Common LTL Cargo */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                What We Ship
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                Common LTL Cargo Types
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl leading-relaxed">
                LTL shipping is the go-to solution for businesses that move partial loads on a regular basis. Here are the most common types of freight we handle through our LTL services:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { title: "Palletized Goods", desc: "Standard pallets of boxed or shrink-wrapped products are the bread and butter of LTL shipping. Properly palletized freight moves efficiently through carrier terminals and minimizes handling damage." },
                  { title: "Partial Loads", desc: "When you have more freight than a parcel carrier can handle but not enough to fill a truck, LTL bridges the gap. Shipments of 150 lbs to 10,000 lbs fit perfectly in the LTL sweet spot." },
                  { title: "Samples & Prototypes", desc: "Manufacturers and product teams frequently ship samples to buyers, trade shows, or testing facilities. LTL provides a cost-effective way to move these smaller shipments with full tracking." },
                  { title: "Distributor Replenishment", desc: "Regular inventory replenishment to warehouses, distribution centers, and retail locations. Consistent LTL lanes can be optimized for recurring routes and scheduled pickups." },
                  { title: "E-Commerce Shipments", desc: "Larger e-commerce orders, wholesale quantities, and B2B shipments that exceed parcel carrier limits but do not require a full trailer. Common for furniture, appliances, and bulk orders." },
                  { title: "Printed Materials", desc: "Marketing materials, catalogs, books, and point-of-sale displays shipped from printers to distribution points across the country. These lightweight but bulky shipments are well-suited to LTL." },
                ].map((cargo) => (
                  <div key={cargo.title} className="p-5 rounded-xl bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
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

          {/* Transit Times & Cost Factors */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Pricing & Timing
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-10">
                LTL Transit Times and Cost Factors
              </h2>
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-semibold text-[hsl(var(--primary))] mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-[hsl(var(--accent))]" /> Transit Times
                  </h3>
                  <div className="space-y-4 text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                    <p>
                      LTL transit times typically range from 1 to 5 business days depending on the distance between origin and destination, the carrier's network, and the number of terminal transfers required. Regional shipments (under 500 miles) often arrive in 1 to 2 days, while cross-country shipments may take 4 to 5 days.
                    </p>
                    <p>
                      Unlike FTL, where the truck goes directly from pickup to delivery, LTL freight passes through carrier terminals where it is sorted and consolidated with other shipments heading in the same direction. Each terminal stop adds time, which is why direct-lane LTL shipments with fewer terminal transfers move faster.
                    </p>
                    <p>
                      Need faster transit? Ask about guaranteed delivery services or expedited LTL options. For time-critical freight, a <Link to="/services/ftl" className="text-[hsl(var(--accent))] hover:underline">dedicated FTL shipment</Link> eliminates terminal handling entirely.
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[hsl(var(--primary))] mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-[hsl(var(--accent))]" /> Cost Factors
                  </h3>
                  <div className="space-y-3">
                    {[
                      { factor: "Weight", detail: "LTL rates are calculated per hundredweight (CWT). Heavier shipments generally pay a lower per-pound rate." },
                      { factor: "Dimensions", detail: "Freight dimensions determine density, which affects class. Oversized items may incur linear foot pricing instead of class-based rates." },
                      { factor: "Freight Class", detail: "NMFC class is the primary rate driver. Higher classes pay significantly more per hundredweight than lower classes." },
                      { factor: "Distance", detail: "Longer hauls cost more, though the per-mile rate decreases as distance increases. Zone-based pricing is common." },
                      { factor: "Accessorials", detail: "Additional services add cost: liftgate delivery ($75-$150), inside delivery ($75-$200), appointment scheduling ($25-$75), residential delivery ($75-$150), and limited-access locations." },
                    ].map((item) => (
                      <div key={item.factor} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[hsl(var(--accent))] mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-sm font-semibold text-[hsl(var(--primary))]">{item.factor}:</span>{" "}
                          <span className="text-sm text-[hsl(var(--muted-foreground))]">{item.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                Why Ship LTL with DeMar Transportation
              </h2>
              <div className="space-y-5 text-base text-white/60 leading-relaxed max-w-3xl">
                <p>
                  DeMar Transportation operates as both an asset-based carrier with our own fleet and a licensed freight broker with access to a nationwide network of LTL carriers. This dual capability means we are never limited to a single carrier's network or pricing -- we shop the market on your behalf to find the best rate and service combination for every shipment.
                </p>
                <p>
                  Our LTL advantages include competitive rates negotiated through volume commitments with major national carriers, consolidation options that combine multiple smaller shipments into more efficient loads, and proactive freight class optimization to ensure you are never overpaying due to incorrect classification. We also provide a single point of contact for pickup coordination, tracking, and delivery confirmation.
                </p>
                <p>
                  For shippers with recurring LTL needs, we offer customized rate programs, scheduled pickup windows, and dedicated account management. Whether you ship one pallet a week or fifty, DeMar Transportation provides the consistency and cost control your supply chain demands.
                </p>
                <p>
                  We also coordinate specialized LTL services including shipments requiring <Link to="/services/reefer" className="text-[hsl(var(--accent))] hover:underline">temperature-controlled trailers</Link>, <Link to="/services/hazmat" className="text-[hsl(var(--accent))] hover:underline">hazmat-certified carriers</Link>, and liftgate or inside delivery for locations without loading docks. Every shipment includes bill of lading preparation, real-time tracking, and delivery confirmation.
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
                  { title: "FTL vs LTL: How to Choose", description: "Find the right shipping method for your load", to: "/resources/ftl-vs-ltl" },
                  { title: "Freight Classes Explained", description: "NMFC classes and how they affect pricing", to: "/resources/freight-classes-explained" },
                  { title: "How to Get a Freight Quote", description: "Step-by-step guide to requesting quotes", to: "/resources/how-to-get-freight-quote" },
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
                Get Your LTL Freight Quote Today
              </h2>
              <p className="text-base text-[hsl(var(--primary))]/70 mb-8 max-w-md mx-auto">
                Tell us about your shipment -- weight, dimensions, origin, and destination -- and receive a competitive LTL rate quote within hours.
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

export default LTL;
