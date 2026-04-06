import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Truck, Phone, Package, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";

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
    "description": "Professional dry van shipping services for full truckload and LTL freight. 53-foot enclosed trailers with 45,000 lb capacity.",
    "dateModified": "2026-04-06"
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the maximum weight for a dry van shipment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A standard 53-foot dry van trailer has a maximum payload capacity of approximately 45,000 pounds. The exact weight limit depends on the tractor configuration and axle weights. Most full truckload dry van shipments range between 30,000 and 44,000 pounds. DeMar Transportation confirms weight limits at the time of booking to ensure compliance with federal gross vehicle weight limits of 80,000 pounds."
        }
      },
      {
        "@type": "Question",
        "name": "How many pallets fit in a dry van trailer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A 53-foot dry van trailer fits 22 to 26 standard pallets (48 by 40 inches) when loaded single-stacked in a straight configuration. Double-stacking is possible with lighter freight, bringing total pallet count up to 52. DeMar Transportation coordinates pallet configuration during booking to maximize trailer utilization and reduce per-unit shipping costs."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between dry van FTL and LTL shipping?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Full truckload (FTL) means your freight occupies the entire trailer, typically 15,000 pounds or more. Less-than-truckload (LTL) consolidates shipments from multiple shippers into one trailer. FTL offers faster transit times with no intermediate handling, while LTL costs less for smaller shipments. DeMar Transportation handles both FTL and LTL dry van freight across all 48 contiguous states."
        }
      },
      {
        "@type": "Question",
        "name": "How long does dry van shipping take from Reno, NV?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Transit times from Reno, NV depend on destination. Reno to Los Angeles is approximately 450 miles with 1-day transit. Reno to Seattle is roughly 700 miles with 1 to 2-day transit. Reno to Dallas is about 1,700 miles with 3 to 4-day transit. Cross-country shipments to the East Coast take 4 to 6 days. DeMar Transportation provides estimated delivery dates at booking and offers real-time tracking throughout transit."
        }
      },
      {
        "@type": "Question",
        "name": "What are the limitations of dry van shipping?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Dry vans are not temperature-controlled, so they are not suitable for perishable goods, frozen products, or freight that requires climate regulation. Extreme heat or cold during transit can affect temperature-sensitive cargo. Dry vans also have fixed interior dimensions, so oversized or irregularly shaped freight that exceeds 53 feet in length, 98.5 inches in width, or 108 inches in height requires a flatbed or specialized trailer. If your freight needs refrigeration, DeMar Transportation offers reefer trailer services as an alternative."
        }
      }
    ]
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
                    "item": "https://demartransportation.com/#services"
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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
              <p className="text-sm text-white/50 max-w-2xl leading-relaxed mt-4">
                DeMar Transportation provides dry van shipping services for enclosed freight across the continental United States. Our 53-foot dry van trailers handle general merchandise, consumer goods, and non-perishable freight with a maximum payload of 45,000 pounds, competitive per-mile rates, and 24/7 dispatch availability.
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
                  Dry van shipping is the most widely used method of over-the-road freight transportation in the United States. A dry van is a fully enclosed, non-temperature-controlled trailer designed to protect cargo from weather, road debris, and theft during transit. Standard dry van trailers come in 28-foot, 48-foot, and 53-foot lengths, with the 53-foot variant being the most common for long-haul freight.
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

          {/* Our Experience - E-E-A-T Section */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Our Experience
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                What We Have Learned Moving Dry Van Freight
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl">
                <p>
                  Operating out of Reno, Nevada, we coordinate dry van shipments daily across I-80, US-395, and the Western US freight corridors. Our dispatch team has developed lane-specific knowledge that directly impacts service quality: which carriers consistently deliver on time to specific distribution centers, where seasonal weather delays are most likely, and how to route around congestion on high-traffic corridors.
                </p>
                <p>
                  We have found that the biggest factor in dry van shipping reliability is carrier vetting. Every carrier in our network passes DOT compliance screening before their first load. We track on-time delivery performance and cargo claim history on an ongoing basis, and carriers that fall below our standards are removed from active dispatch.
                </p>
                <p>
                  Our location at the intersection of I-80 and US-395 gives us a strategic advantage for freight moving between California, the Pacific Northwest, and the Intermountain West. Key routes we run regularly include Reno to Los Angeles (approximately 450 miles, 1-day transit), Reno to Seattle (roughly 700 miles, 1 to 2-day transit), and Reno to Dallas (about 1,700 miles, 3 to 4-day transit).
                </p>
              </div>
            </div>
          </section>

          {/* DeMar Capabilities */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Our Capabilities
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                DeMar's Dry Van Shipping Services
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl mb-10">
                <p>
                  DeMar Transportation coordinates dry van shipments across all 48 contiguous states through a vetted network of owner-operators and carrier partners. Our home base in Reno, Nevada places us at the intersection of I-80 and US-395, giving us direct access to major freight corridors connecting the West Coast, Pacific Northwest, and Intermountain West.
                </p>
                <p>
                  We handle shipments ranging from single-pallet LTL loads under 5,000 pounds to full truckload moves up to 45,000 pounds. Our dispatch team books dry van loads daily, with consistent lane coverage on high-demand routes throughout the Western US and beyond. All carriers in our network pass DOT compliance screening before their first load.
                </p>
              </div>

              <h3 className="text-xl font-bold text-[hsl(var(--primary))] tracking-tight mb-6">
                Service Area Coverage
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { region: "Western US", detail: "California, Oregon, Washington, Nevada, Arizona, Utah, Colorado. Reno to Los Angeles: approximately 450 miles, 1-day transit. Reno to Seattle: roughly 700 miles, 1 to 2-day transit." },
                  { region: "Central US", detail: "Texas, Illinois, Missouri, Minnesota, Kansas, Nebraska, Oklahoma. Reno to Dallas: about 1,700 miles, 3 to 4-day transit. Reliable capacity on I-80 and I-70 corridors." },
                  { region: "Eastern US", detail: "New York, Pennsylvania, Georgia, Florida, Ohio, North Carolina. Typically 4 to 6-day transit with coast-to-coast full truckload service." },
                ].map((area) => (
                  <div key={area.region} className="p-5 rounded-xl bg-white shadow-[var(--shadow-card)]">
                    <h4 className="text-sm font-semibold text-[hsl(var(--primary))] mb-2">{area.region}</h4>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{area.detail}</p>
                  </div>
                ))}
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
                Standard Dry Van Trailer Specs
              </h2>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {[
                  { value: "53 ft", label: "Standard Trailer Length", desc: "Interior length of approximately 52 feet 6 inches. 48-foot and 28-foot trailers also available for shorter hauls or tighter dock access." },
                  { value: "45,000 lbs", label: "Maximum Payload Capacity", desc: "Up to 45,000 pounds of freight per load, depending on tractor configuration and federal gross vehicle weight limits of 80,000 pounds." },
                  { value: "2,390 ft\u00B3", label: "Interior Cubic Capacity", desc: "Interior width of 98.5 inches and height of 108 inches at door opening. Sufficient for most palletized and floor-loaded freight." },
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
                Standard dry van trailers feature rear swing doors or roll-up doors. Most accommodate 22 to 26 standard pallets (48" x 40") loaded single-stacked. Double-stacking lighter freight can bring total capacity up to 52 pallets per trailer.
              </p>
            </div>
          </section>

          {/* When NOT to Use Dry Van */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Is Dry Van Right for You?
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                When to Choose a Different Trailer Type
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl mb-10">
                <p>
                  Dry vans are the right choice for the majority of freight shipments, but they are not ideal for every load. Understanding the limitations helps you choose the right equipment and avoid delays or damage.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: "Temperature-Sensitive Freight", desc: "Dry vans have no climate control. Perishable foods, pharmaceuticals, chemicals, and any cargo that requires heating or cooling during transit should ship in a reefer (refrigerated) trailer instead.", link: "/services/reefer", linkText: "Learn about reefer shipping" },
                  { title: "Oversized or Irregularly Shaped Cargo", desc: "Freight that exceeds 53 feet in length, 98.5 inches in width, or 108 inches in height will not fit inside a dry van. Heavy machinery, construction equipment, and oversized loads require a flatbed trailer.", link: "/services/flatbed", linkText: "Learn about flatbed shipping" },
                  { title: "High-Value Cargo Requiring Extra Security", desc: "While dry vans offer basic theft deterrence through enclosed walls and locking doors, extremely high-value loads may benefit from additional security measures such as sealed trailers with GPS tracking and team drivers for non-stop transit.", link: "", linkText: "" },
                  { title: "Cargo Sensitive to Heat Buildup", desc: "During summer months, interior temperatures in a dry van can climb significantly above ambient temperature. Items like candles, adhesives, chocolate, and certain plastics may warp or melt. Consider a reefer set to a moderate temperature for protection.", link: "", linkText: "" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-1">{item.title}</h3>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{item.desc}</p>
                      {item.link && (
                        <Link to={item.link} className="text-sm text-[hsl(var(--accent))] hover:underline mt-1 inline-block">
                          {item.linkText} &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Common Cargo Types */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                What We Ship
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                Common Dry Van Cargo Types
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl leading-relaxed">
                Nearly any non-perishable, non-hazardous commodity that fits within the trailer dimensions can be shipped by dry van. The following categories represent our most frequently booked freight types.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { title: "Consumer Goods", desc: "Household products, cleaning supplies, personal care items, and general merchandise moving to retail distribution centers." },
                  { title: "Electronics", desc: "Packaged electronics, computer components, appliances, and consumer technology products requiring enclosed, weather-protected transit." },
                  { title: "Packaged Foods", desc: "Non-perishable food items including canned goods, snack foods, beverages, and dry goods that do not require temperature control." },
                  { title: "Retail Inventory", desc: "Clothing, footwear, furniture, home goods, and seasonal merchandise shipped to stores and fulfillment centers." },
                  { title: "Paper Products", desc: "Printing paper, packaging materials, tissue products, cardboard, and corrugated containers that must stay dry during transit." },
                  { title: "Textiles & Fabrics", desc: "Rolls of fabric, yarn, finished garments, carpeting, and industrial textiles shipped palletized or floor-loaded." },
                  { title: "Building Materials", desc: "Drywall, insulation, flooring, doors, windows, and other construction supplies that fit standard pallets and need weather protection." },
                  { title: "Auto Parts", desc: "Aftermarket parts, OEM components, tires, and accessories shipped to dealerships, repair shops, and distribution centers." },
                  { title: "Industrial Equipment", desc: "Machinery parts, tools, fasteners, and packaged industrial supplies under 45,000 pounds that fit within standard trailer dimensions." },
                ].map((cargo) => (
                  <div key={cargo.title} className="p-5 rounded-xl bg-[hsl(var(--surface))] hover:bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
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
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Advantages
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-10">
                Benefits of Dry Van Shipping
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: "Weather Protection", desc: "Fully enclosed trailers shield your freight from rain, snow, wind, and UV exposure throughout the entire journey. Unlike flatbed or open-deck trailers, dry vans require no tarping or strapping for weather protection." },
                  { title: "Cargo Security", desc: "Sealed trailers with locking mechanisms reduce the risk of theft, tampering, and pilferage during transit. The enclosed design also prevents shifting from wind forces at highway speeds." },
                  { title: "Versatility", desc: "Dry vans accommodate the widest range of commodity types of any trailer class, from lightweight high-volume goods to dense heavy pallets. This flexibility makes them suitable for nearly every industry." },
                  { title: "Cost-Effective", desc: "As the most abundant equipment type on the road, dry vans offer competitive rates and shorter lead times compared to specialized trailers. More available trucks means more scheduling flexibility." },
                  { title: "Loading Flexibility", desc: "Rear swing doors and roll-up doors allow standard dock loading. Floor-loaded, palletized, and slip-sheeted freight all work in a dry van, and no special loading equipment is required." },
                  { title: "Carrier Availability", desc: "Dry vans are the most common trailer type in North America, which means more available trucks and faster booking even during peak shipping seasons when specialized equipment is scarce." },
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
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
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
                  { name: "Food & Beverage", detail: "Non-perishable food products, beverages, and packaged goods require clean, dry trailers. Our carriers maintain washout records and comply with food-grade transportation standards." },
                  { name: "E-Commerce & Fulfillment", detail: "High-frequency shipments to fulfillment centers and last-mile hubs. We support the fast-paced replenishment cycles that e-commerce operations demand." },
                ].map((industry) => (
                  <div key={industry.name} className="p-6 rounded-xl bg-[hsl(var(--surface))] hover:bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
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
                  Every shipment gets a single point of contact from booking through delivery. Our dispatch team provides real-time tracking updates, proactive communication on potential delays, and immediate escalation when issues arise. We do not hand you off to a call center.
                </p>
                <p>
                  Whether you are shipping a single full truckload or managing a recurring lane program with regular loads, DeMar Transportation has the capacity, carrier relationships, and operational knowledge to keep your supply chain moving. We also offer <Link to="/services/reefer" className="text-[hsl(var(--accent))] hover:underline">refrigerated shipping</Link> and <Link to="/services/flatbed" className="text-[hsl(var(--accent))] hover:underline">flatbed transportation</Link> for specialized equipment needs.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Common Questions
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-10">
                Dry Van Shipping FAQ
              </h2>
              <div className="space-y-6 max-w-3xl">
                {[
                  {
                    q: "What is the maximum weight for a dry van shipment?",
                    a: "A standard 53-foot dry van trailer has a maximum payload capacity of approximately 45,000 pounds. The exact weight limit depends on the tractor configuration and axle weights. Most full truckload dry van shipments range between 30,000 and 44,000 pounds. DeMar Transportation confirms weight limits at the time of booking to ensure compliance with federal gross vehicle weight limits of 80,000 pounds."
                  },
                  {
                    q: "How many pallets fit in a dry van trailer?",
                    a: "A 53-foot dry van trailer fits 22 to 26 standard pallets (48 by 40 inches) when loaded single-stacked in a straight configuration. Double-stacking is possible with lighter freight, bringing total pallet count up to 52. We coordinate pallet configuration during booking to maximize trailer utilization and reduce per-unit shipping costs."
                  },
                  {
                    q: "What is the difference between dry van FTL and LTL shipping?",
                    a: "Full truckload (FTL) means your freight occupies the entire trailer, typically 15,000 pounds or more. Less-than-truckload (LTL) consolidates shipments from multiple shippers into one trailer. FTL offers faster transit times with no intermediate handling, while LTL costs less for smaller shipments. DeMar Transportation handles both FTL and LTL dry van freight across all 48 contiguous states."
                  },
                  {
                    q: "How long does dry van shipping take from Reno, NV?",
                    a: "Transit times from Reno depend on destination. Reno to Los Angeles is approximately 450 miles with 1-day transit. Reno to Seattle is roughly 700 miles with 1 to 2-day transit. Reno to Dallas is about 1,700 miles with 3 to 4-day transit. Cross-country shipments to the East Coast take 4 to 6 days. We provide estimated delivery dates at booking and offer real-time tracking throughout transit."
                  },
                  {
                    q: "What are the limitations of dry van shipping?",
                    a: "Dry vans are not temperature-controlled, so they are not suitable for perishable goods, frozen products, or freight that requires climate regulation. Extreme heat or cold during transit can affect temperature-sensitive cargo. Dry vans also have fixed interior dimensions, so oversized or irregularly shaped freight that exceeds standard trailer measurements requires a flatbed or specialized trailer. If your freight needs refrigeration, DeMar offers reefer trailer services as an alternative."
                  },
                ].map((faq) => (
                  <div key={faq.q} className="p-6 rounded-xl bg-[hsl(var(--surface-low))]">
                    <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-3">{faq.q}</h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{faq.a}</p>
                  </div>
                ))}
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
                  { title: "How Much Does Freight Shipping Cost?", description: "2026 pricing guide with per-mile rates", to: "/resources/freight-shipping-cost" },
                  { title: "Dry Van vs Reefer: Which Do You Need?", description: "Compare trailer types for your cargo", to: "/resources/dry-van-vs-reefer" },
                  { title: "Types of Freight Trailers", description: "Complete guide to every trailer type", to: "/resources/types-of-freight-trailers" },
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