import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Truck, Phone, ShieldCheck, ArrowRight, CheckCircle, Package, Clock, DollarSign, Factory } from "lucide-react";

const FTL = () => {
  useEffect(() => {
    document.title = "Full Truckload (FTL) Shipping Services | DeMar Transportation";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "DeMar Transportation provides full truckload (FTL) freight shipping nationwide. Dedicated trailers, faster transit, less handling. Dry van, reefer, flatbed, and step-deck available. Get a free quote.");
    }
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Full Truckload (FTL) Shipping",
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
    "serviceType": "Full Truckload Freight Shipping",
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "description": "Full Truckload (FTL) freight shipping services with dedicated trailers. Up to 45,000 lbs capacity, dry van, reefer, flatbed, and step-deck trailers available nationwide."
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
                    "name": "Full Truckload (FTL)",
                    "item": "https://demartransportation.com/services/ftl"
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
                  Dedicated Capacity
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                Full Truckload
                <br />
                <span className="text-white/40">Shipping Services</span>
              </h1>
              <p className="text-lg text-white/60 max-w-2xl mb-10 leading-relaxed">
                Your freight, your trailer, your schedule. DeMar Transportation provides dedicated full truckload shipping with direct origin-to-destination service, faster transit times, and reduced handling for maximum cargo protection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/quote" className="group">
                    Get a Free FTL Quote
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

          {/* What is FTL Shipping */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Overview
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                What Is Full Truckload Shipping?
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl">
                <p>
                  Full Truckload (FTL) shipping means your freight gets a dedicated trailer for the entire journey from origin to destination. Unlike LTL shipments where multiple shippers share trailer space, an FTL shipment is loaded at your facility, sealed, and driven directly to the delivery point without any intermediate terminal stops or freight transfers. No other shipper's cargo touches your trailer.
                </p>
                <p>
                  This dedicated approach offers significant advantages: faster transit because the driver goes straight from pickup to delivery, reduced risk of damage because your freight is loaded once and unloaded once with no terminal handling in between, and greater scheduling flexibility because the truck operates on your timeline rather than a carrier's terminal schedule.
                </p>
                <p>
                  DeMar Transportation operates our own fleet of trucks and also maintains a nationwide carrier network through our 3PL brokerage operations. This means we can provide FTL capacity for any lane in the continental United States -- whether you need a single spot-market load moved tomorrow or a dedicated fleet running the same lane every week. We match the right equipment, the right carrier, and the right rate to every shipment.
                </p>
              </div>
            </div>
          </section>

          {/* When to Use FTL */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                FTL vs LTL
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                When to Choose FTL Over LTL
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl leading-relaxed">
                Full truckload shipping is the right choice when your freight volume, value, or delivery requirements exceed what LTL can efficiently provide. Here are the key indicators that FTL is your best option:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { title: "Heavy Shipments", desc: "Your freight weighs 10,000 lbs or more. At this threshold, FTL rates often become more economical than LTL per-hundredweight pricing, especially for lower freight classes." },
                  { title: "High Volume", desc: "You have 10 or more standard pallets (48\" x 40\"). Once you are using more than half the trailer's floor space, a dedicated truck typically costs less than paying LTL rates for that volume." },
                  { title: "High-Value Freight", desc: "Electronics, pharmaceuticals, and other valuable goods benefit from FTL's sealed-trailer security. No terminal handling means fewer people touch your cargo and fewer opportunities for loss or theft." },
                  { title: "Time-Sensitive Delivery", desc: "When your freight must arrive by a specific date and time, FTL's direct routing eliminates the uncertainty of terminal transfers. Transit times are predictable and significantly faster than LTL." },
                  { title: "Fragile or Sensitive Goods", desc: "Cargo that cannot withstand multiple loading and unloading cycles benefits from FTL's single-touch handling. The freight stays on the same trailer from door to door." },
                  { title: "Cost Optimization", desc: "When LTL accessorial charges (liftgate, inside delivery, residential surcharges) push the total cost close to FTL rates, a dedicated truck may actually be the cheaper option." },
                ].map((item) => (
                  <div key={item.title} className="p-5 rounded-xl bg-[hsl(var(--surface))] hover:bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--accent))]" />
                      <h3 className="text-sm font-semibold text-[hsl(var(--primary))]">{item.title}</h3>
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mt-6 max-w-3xl">
                Shipping less than a full trailer? Our <Link to="/services/ltl" className="text-[hsl(var(--accent))] hover:underline font-medium">LTL freight services</Link> let you share trailer space and pay only for what you ship, making it the more economical choice for smaller shipments.
              </p>
            </div>
          </section>

          {/* Trailer Types */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Equipment
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                Available Trailer Types
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl leading-relaxed">
                DeMar Transportation provides FTL service across all major trailer types. The right equipment depends on your commodity, dimensions, and any special handling requirements:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Dry Van (53')", link: "/services/dry-van", desc: "The workhorse of freight transportation. Fully enclosed, non-temperature-controlled trailers for general commodities. 45,000 lbs capacity, 2,390 cubic feet of interior space. Ideal for palletized goods, boxed products, and any non-perishable freight that fits standard trailer dimensions." },
                  { title: "Refrigerated (Reefer)", link: "/services/reefer", desc: "Temperature-controlled trailers for perishable goods, pharmaceuticals, and temperature-sensitive products. Capable of maintaining temperatures from -20 degrees F to 70 degrees F. Essential for food and beverage, biotech, and floral shipments that require an unbroken cold chain." },
                  { title: "Flatbed", link: "/services/flatbed", desc: "Open-deck trailers for oversized, heavy, or irregularly shaped freight that cannot be loaded through trailer doors. Construction materials, machinery, steel, lumber, and equipment. Top-, side-, and rear-loading flexibility with 48,000 lbs capacity on standard 48-foot decks." },
                  { title: "Step-Deck (Drop-Deck)", link: "/services/flatbed", desc: "A flatbed variant with a lower deck height, providing additional vertical clearance for tall freight that would exceed standard over-the-road height limits on a traditional flatbed. Commonly used for tall machinery, vehicles, and industrial equipment up to 10 feet in height." },
                ].map((trailer) => (
                  <div key={trailer.title} className="p-6 rounded-xl bg-[hsl(var(--surface-low))] hover:bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
                    <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-2">
                      <Link to={trailer.link} className="hover:text-[hsl(var(--accent))] transition-colors">{trailer.title}</Link>
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{trailer.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FTL Advantages & Capacity */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Advantages
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-10">
                FTL Advantages and Capacity
              </h2>
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-semibold text-[hsl(var(--primary))] mb-6">Key Advantages</h3>
                  <div className="space-y-6">
                    {[
                      { title: "Faster Transit Times", detail: "No terminal stops means your freight moves directly from pickup to delivery. A coast-to-coast FTL shipment typically arrives in 4 to 5 days compared to 7 to 10 days for LTL." },
                      { title: "Reduced Handling", detail: "Your freight is loaded once at origin and unloaded once at destination. Less handling means dramatically lower risk of damage, loss, or shortage." },
                      { title: "Predictable Pricing", detail: "FTL rates are typically quoted as a flat rate per load or per mile. No freight class calculations, no hundredweight pricing tiers, and fewer surprise accessorial charges." },
                      { title: "Scheduling Flexibility", detail: "You control the pickup and delivery windows. Need a specific appointment time? Same-day pickup? Weekend delivery? FTL accommodates your schedule." },
                    ].map((item) => (
                      <div key={item.title} className="flex items-start gap-4">
                        <CheckCircle className="h-5 w-5 text-[hsl(var(--accent))] mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-base font-semibold text-[hsl(var(--primary))] mb-1">{item.title}</h4>
                          <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-[hsl(var(--primary))] mb-6">Trailer Capacity</h3>
                  <div className="space-y-4">
                    <div className="p-6 rounded-xl bg-white shadow-[var(--shadow-card)]">
                      <div className="text-3xl font-bold text-[hsl(var(--accent))] tracking-tight mb-2">
                        45,000 lbs
                      </div>
                      <div className="text-sm font-semibold text-[hsl(var(--primary))] mb-2">
                        Maximum Payload (Dry Van)
                      </div>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                        Actual capacity varies by tractor weight, trailer tare weight, and state axle-weight regulations. Typical usable payload ranges from 42,000 to 45,000 lbs.
                      </p>
                    </div>
                    <div className="p-6 rounded-xl bg-white shadow-[var(--shadow-card)]">
                      <div className="text-3xl font-bold text-[hsl(var(--accent))] tracking-tight mb-2">
                        2,390 ft&sup3;
                      </div>
                      <div className="text-sm font-semibold text-[hsl(var(--primary))] mb-2">
                        Interior Volume (53' Dry Van)
                      </div>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                        Interior dimensions: 52'6" length x 98.5" width x 108" height. Accommodates 22 to 26 standard pallets single-stacked or more when double-stacked.
                      </p>
                    </div>
                    <div className="p-5 rounded-xl bg-[hsl(var(--surface))]">
                      <h4 className="text-sm font-semibold text-[hsl(var(--primary))] mb-2">Weight vs. Volume</h4>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                        Dense freight (metals, liquids, machinery) will "weigh out" before filling the trailer's volume. Light, bulky freight (pillows, plastics, insulation) will "cube out" before reaching weight limits. Understanding which constraint applies to your commodity helps optimize loading and pricing. Our team will advise on the most efficient approach for your specific freight.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Pricing
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                FTL Pricing: What Determines Your Rate
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-3xl leading-relaxed">
                Full truckload pricing is straightforward compared to LTL. Rather than calculating rates based on freight class and hundredweight, FTL rates are typically quoted as a flat rate per load or a per-mile rate multiplied by the total distance. Here are the primary factors that determine your FTL cost:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { Icon: DollarSign, title: "Per-Mile Rate", desc: "The base rate is calculated by multiplying the per-mile rate by the total lane miles. Rates vary by region, season, and market conditions. Current national averages range from $2.50 to $3.50 per mile for dry van." },
                  { Icon: Truck, title: "Fuel Surcharge", desc: "A variable surcharge tied to the national average diesel price. Typically calculated as a percentage of the linehaul rate or a flat cents-per-mile charge. This adjusts weekly to reflect fuel market conditions." },
                  { Icon: Package, title: "Equipment Type", desc: "Specialized trailers cost more. Reefer trailers carry a premium for the refrigeration unit. Flatbeds may require tarping fees. Step-deck and other specialty equipment commands higher rates due to limited availability." },
                  { Icon: Clock, title: "Lead Time", desc: "Spot-market loads booked with short notice (same day or next day) typically cost more than loads booked 3 to 5 days in advance. Consistent, contracted lanes offer the best rates through committed volume." },
                  { Icon: Factory, title: "Accessorials", desc: "Detention (waiting time beyond free hours at facilities), layover charges, TONU (truck ordered not used), lumper fees, and stop-offs each add to the base rate. We quote accessorials upfront so there are no surprises." },
                  { Icon: ShieldCheck, title: "Market Conditions", desc: "Carrier capacity, seasonal demand, and regional freight volume all influence spot-market rates. Produce season, holiday peaks, and weather events can tighten capacity and increase rates in specific lanes." },
                ].map((item) => (
                  <div key={item.title} className="p-5 rounded-xl bg-[hsl(var(--surface-low))] hover:bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <item.Icon className="h-4 w-4 text-[hsl(var(--accent))]" />
                      <h3 className="text-sm font-semibold text-[hsl(var(--primary))]">{item.title}</h3>
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
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
                Industries We Serve with FTL
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl leading-relaxed">
                DeMar Transportation provides full truckload services to businesses across a wide range of industries. Our experience in these sectors means we understand your compliance requirements, delivery expectations, and supply chain challenges.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { title: "Manufacturing", desc: "Inbound raw materials to production facilities and outbound finished goods to distribution centers. We support just-in-time delivery schedules where late arrivals directly impact production line uptime." },
                  { title: "Retail & Distribution", desc: "Full truckloads of merchandise to distribution centers, cross-docks, and retail locations. We comply with major retailer routing guides and appointment scheduling requirements." },
                  { title: "Food & Beverage", desc: "Temperature-controlled and dry loads for food producers, beverage companies, and grocery distributors. Our carriers maintain food-grade trailers and comply with FSMA transportation requirements." },
                  { title: "Construction", desc: "Building materials, fixtures, and supplies delivered to job sites and warehouses. We coordinate flatbed, step-deck, and dry van equipment based on material type and site access requirements." },
                  { title: "Automotive", desc: "OEM parts, aftermarket components, and finished assemblies for automotive manufacturers and parts distributors. Time-critical supply chains with zero tolerance for production-stopping delays." },
                  { title: "Consumer Goods", desc: "High-volume shipments of household products, personal care items, and packaged goods from manufacturers to regional and national distribution centers." },
                ].map((industry) => (
                  <div key={industry.title} className="p-5 rounded-xl bg-[hsl(var(--surface))] hover:bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
                    <h3 className="text-sm font-semibold text-[hsl(var(--primary))] mb-2">{industry.title}</h3>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{industry.desc}</p>
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
                Why Choose DeMar Transportation for FTL
              </h2>
              <div className="space-y-5 text-base text-white/60 leading-relaxed max-w-3xl">
                <p>
                  DeMar Transportation brings a unique combination of asset-based capacity and brokerage flexibility to every full truckload shipment. Our own fleet provides reliable, direct capacity on our core lanes, while our carrier network extends our reach to every corner of the continental United States. This hybrid model means you get the consistency of a dedicated fleet with the scalability of a nationwide brokerage.
                </p>
                <p>
                  We offer both spot-market and contracted pricing options. For shippers with consistent lane volume, our contracted rates provide budget predictability and guaranteed capacity even during tight market conditions. For one-time or irregular shipments, our spot-market team sources competitive rates from vetted carriers with a focus on service quality and on-time performance.
                </p>
                <p>
                  Every FTL shipment includes real-time tracking, proactive status updates, and a dedicated point of contact from booking through delivery. We also coordinate specialized services including <Link to="/services/hazmat" className="text-[hsl(var(--accent))] hover:underline">hazmat shipping</Link>, <Link to="/services/reefer" className="text-[hsl(var(--accent))] hover:underline">temperature-controlled freight</Link>, and oversized loads requiring <Link to="/services/flatbed" className="text-[hsl(var(--accent))] hover:underline">flatbed or step-deck trailers</Link>.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-[hsl(var(--accent))]">
            <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-2xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
                Get Your Full Truckload Quote Today
              </h2>
              <p className="text-base text-[hsl(var(--primary))]/70 mb-8 max-w-md mx-auto">
                Whether you need a single spot load or a dedicated lane program, our freight specialists will provide a competitive FTL rate within hours. Tell us your origin, destination, commodity, and weight -- we will handle the rest.
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

export default FTL;
