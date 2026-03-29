import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Car, Phone, Zap, Clock, Package, CheckCircle, ArrowRight, Users } from "lucide-react";

const SprinterVan = () => {
  useEffect(() => {
    document.title = "Sprinter Van & Expedited Shipping Services | DeMar Transportation";
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
            <div className="max-w-5xl mx-auto relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/5 backdrop-blur-sm">
                <Zap className="h-4 w-4 text-[hsl(var(--accent))]" />
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
                  Time-Critical Freight
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                Sprinter Van
                <br />
                <span className="text-white/40">& Expedited Shipping</span>
              </h1>
              <p className="text-lg text-white/60 max-w-2xl mb-10 leading-relaxed">
                Time-critical freight demands speed, reliability, and dedicated capacity. Our sprinter van and expedited shipping services deliver your cargo on the fastest possible timeline, with same-day and next-day options available nationwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/quote" className="group">
                    Request an Expedited Quote
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

          {/* What is Sprinter Van Freight */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Overview
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                What Is Sprinter Van Freight?
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl">
                <p>
                  Sprinter van freight refers to expedited shipments transported in cargo vans, typically Mercedes-Benz Sprinters, Ford Transits, or Ram ProMasters. These vehicles offer a cargo capacity of 3,000 to 5,000 pounds with up to 500 cubic feet of interior space, making them the fastest ground transportation option for smaller, time-sensitive shipments. Unlike larger trucks that may face hours-of-service limitations or require special routing, cargo vans can travel nonstop across long distances, especially when operated by team drivers.
                </p>
                <p>
                  Sprinter vans are the backbone of the expedited freight industry. They do not require a commercial driver's license in most configurations, which means a larger pool of qualified drivers and faster dispatch times. The enclosed, climate-stable cargo area protects sensitive goods from temperature extremes, moisture, and road vibration. Many sprinter vans are equipped with interior shelving, tie-down systems, and blanket wrap materials for secure transport of high-value or fragile cargo.
                </p>
                <p>
                  When every hour counts and your shipment cannot wait for the next LTL consolidation or scheduled truck route, a dedicated sprinter van provides exclusive use of the vehicle with direct, non-stop routing from origin to destination. There are no terminals, no cross-docking, and no intermediate handling. Your freight goes straight from point A to point B.
                </p>
              </div>
            </div>
          </section>

          {/* Expedited Shipping Explained */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Expedited Options
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                Expedited and Time-Critical Shipping
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
                  <p>
                    Expedited shipping is a premium freight service designed for shipments that must arrive within a tight delivery window. Unlike standard freight services that batch multiple orders and route through hub-and-spoke terminal networks, expedited shipments receive a dedicated vehicle that travels directly from pickup to delivery with minimal or zero stops in between.
                  </p>
                  <p>
                    The need for expedited shipping arises in many scenarios: a manufacturing line is shut down waiting for a critical replacement part, a hospital needs emergency medical supplies, a legal team requires original documents for a court deadline, or a product launch depends on marketing materials arriving before an event opens. In every case, the cost of delayed delivery far exceeds the premium paid for expedited transportation.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="p-6 rounded-xl bg-white shadow-[var(--shadow-card)]">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-5 w-5 text-[hsl(var(--accent))]" />
                      <h3 className="text-base font-semibold text-[hsl(var(--primary))]">Same-Day Delivery</h3>
                    </div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">Pickup and delivery within the same calendar day. Ideal for regional shipments up to 300 miles. Our dispatch team can have a driver en route within one to two hours of order placement for urgent requests.</p>
                  </div>
                  <div className="p-6 rounded-xl bg-white shadow-[var(--shadow-card)]">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-5 w-5 text-[hsl(var(--accent))]" />
                      <h3 className="text-base font-semibold text-[hsl(var(--primary))]">Next-Day Delivery</h3>
                    </div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">For shipments covering 300 to 1,000 miles, next-day delivery provides a reliable overnight option. A solo driver can cover this distance within federal hours-of-service regulations, delivering your freight by the following morning.</p>
                  </div>
                </div>
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
                What We Ship by Sprinter Van
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl leading-relaxed">
                Sprinter vans handle a diverse range of cargo types. The common thread is urgency: these are shipments where speed and careful handling take priority over cost optimization.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { title: "Medical Supplies & Equipment", detail: "Surgical instruments, diagnostic equipment, laboratory samples, and pharmaceutical products that require fast, temperature-stable transport with chain-of-custody documentation." },
                  { title: "Automotive Parts", detail: "Critical replacement components for dealerships, manufacturing plants, and repair shops. A single missing part can shut down an assembly line, making expedited delivery essential." },
                  { title: "Legal Documents & Financial Records", detail: "Original contracts, court filings, closing documents, and other legal materials that require secure, verifiable delivery with signature confirmation." },
                  { title: "Trade Show & Event Materials", detail: "Display booths, promotional materials, product samples, and AV equipment delivered on a guaranteed schedule to convention centers and event venues nationwide." },
                  { title: "Electronics & Technology", detail: "Servers, networking equipment, prototypes, and consumer electronics requiring vibration-dampened transport and careful handling to prevent damage to sensitive components." },
                  { title: "Product Samples & Prototypes", detail: "Pre-production samples, engineering prototypes, and product development materials being shipped between R&D facilities, manufacturers, and client offices for review and testing." }
                ].map((item) => (
                  <div key={item.title} className="p-5 rounded-xl bg-[hsl(var(--surface-low))] hover:bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-[hsl(var(--accent))]" />
                      <h3 className="text-sm font-semibold text-[hsl(var(--primary))]">{item.title}</h3>
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Hot Shot & Team Drivers */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Service Tiers
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-6">Hot Shot Delivery</h2>
                  <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
                    <p>
                      Hot shot delivery is the most urgent tier of expedited freight. The term originates from the oilfield services industry, where critical parts needed to be rushed to drilling sites to prevent costly downtime. Today, hot shot delivery applies to any shipment that requires immediate dispatch and the fastest possible transit time.
                    </p>
                    <p>
                      When you place a hot shot order with DeMar Transportation, our dispatch team immediately identifies the closest available driver to your pickup location. The driver is dispatched within minutes, not hours. Routes are optimized for speed, and real-time GPS tracking allows you to monitor your shipment from pickup to delivery. Hot shot service is available 24 hours a day, 7 days a week, including holidays.
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-6">Team Driver Options</h2>
                  <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
                    <p>
                      For shipments traveling over 1,000 miles, team drivers eliminate the downtime required by federal hours-of-service regulations. A team consists of two qualified drivers who alternate driving and resting, allowing the vehicle to remain in motion around the clock. This effectively doubles the daily mileage capability compared to a solo driver.
                    </p>
                    <p>
                      Team driver service can move freight coast to coast in approximately 40 to 48 hours, compared to 4 to 5 days for standard ground shipping. This service is essential for cross-country expedited shipments where air freight is either too expensive or impractical due to cargo size or type restrictions. DeMar Transportation maintains a roster of experienced team driver pairs who are ready to deploy on short notice for long-distance expedited runs.
                    </p>
                  </div>
                </div>
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
                Why Choose DeMar Transportation for Sprinter Van Shipping
              </h2>
              <div className="space-y-6">
                {[
                  { title: "Rapid Dispatch", description: "Our logistics coordinators are available around the clock to take your expedited orders. We maintain a network of cargo van and sprinter van operators positioned across the western United States, enabling pickup within hours of your call." },
                  { title: "Dedicated Capacity", description: "Every sprinter van shipment gets exclusive use of the vehicle. Your freight is the only freight on the truck, which means no co-loading delays, no terminal stops, and no risk of damage from other shippers' cargo." },
                  { title: "Real-Time Visibility", description: "GPS tracking and proactive status updates keep you informed throughout the transit. Our team provides ETAs, milestone notifications, and proof of delivery documentation so you always know where your shipment is." },
                  { title: "Nationwide Carrier Network", description: "DeMar Transportation has access to thousands of pre-qualified owner-operators nationwide. This network depth ensures we can find capacity for your expedited shipment even during peak demand periods or in remote pickup locations." },
                  { title: "Competitive Expedited Rates", description: "We provide transparent, all-inclusive pricing for every expedited shipment. No hidden fuel surcharges, no surprise accessorial fees. You receive a firm quote before we dispatch, so you can make informed decisions about your shipping budget." }
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--accent))] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-base font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-[hsl(var(--accent))]">
            <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-2xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
                Need Expedited Shipping Now?
              </h2>
              <p className="text-base text-[hsl(var(--primary))]/70 mb-8 max-w-md mx-auto">
                Time-critical freight cannot wait. Call DeMar Transportation for immediate dispatch or submit a quote request and our expedited team will respond within 30 minutes during business hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]/90 font-semibold"
                  asChild
                >
                  <Link to="/quote" className="group">
                    Request an Expedited Quote
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
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/services/box-truck" className="text-[hsl(var(--primary))]/70 hover:text-[hsl(var(--primary))] underline text-sm transition-colors">
                  Box Truck Services
                </Link>
                <span className="text-[hsl(var(--primary))]/40">&bull;</span>
                <Link to="/services/hazmat" className="text-[hsl(var(--primary))]/70 hover:text-[hsl(var(--primary))] underline text-sm transition-colors">
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

export default SprinterVan;
