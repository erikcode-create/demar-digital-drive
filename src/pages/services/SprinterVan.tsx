import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Car, Phone, Clock, Zap, Package, CheckCircle, Users } from "lucide-react";

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
      <LandstarSidebar />
      <div className="md:ml-16">
        <Header />
        <main id="main-content">
          {/* Hero Section */}
          <section className="bg-primary text-primary-foreground py-20 px-4">
            <div className="container mx-auto max-w-5xl">
              <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors mb-6">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <div className="flex items-center gap-4 mb-6">
                <Car className="h-12 w-12 text-accent" />
                <Badge variant="secondary" className="text-sm">Service Page</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Sprinter Van & Expedited Shipping
              </h1>
              <p className="text-xl text-primary-foreground/90 max-w-3xl">
                Time-critical freight demands speed, reliability, and dedicated capacity. Our sprinter van and expedited shipping services deliver your cargo on the fastest possible timeline, with same-day and next-day options available nationwide.
              </p>
            </div>
          </section>

          {/* What is Sprinter Van Freight */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold text-primary mb-6">What Is Sprinter Van Freight?</h2>
              <div className="prose max-w-none text-muted-foreground space-y-4">
                <p className="text-lg leading-relaxed">
                  Sprinter van freight refers to expedited shipments transported in cargo vans, typically Mercedes-Benz Sprinters, Ford Transits, or Ram ProMasters. These vehicles offer a cargo capacity of 3,000 to 5,000 pounds with up to 500 cubic feet of interior space, making them the fastest ground transportation option for smaller, time-sensitive shipments. Unlike larger trucks that may face hours-of-service limitations or require special routing, cargo vans can travel nonstop across long distances, especially when operated by team drivers.
                </p>
                <p className="text-lg leading-relaxed">
                  Sprinter vans are the backbone of the expedited freight industry. They do not require a commercial driver's license in most configurations, which means a larger pool of qualified drivers and faster dispatch times. The enclosed, climate-stable cargo area protects sensitive goods from temperature extremes, moisture, and road vibration. Many sprinter vans are equipped with interior shelving, tie-down systems, and blanket wrap materials for secure transport of high-value or fragile cargo.
                </p>
                <p className="text-lg leading-relaxed">
                  When every hour counts and your shipment cannot wait for the next LTL consolidation or scheduled truck route, a dedicated sprinter van provides exclusive use of the vehicle with direct, non-stop routing from origin to destination. There are no terminals, no cross-docking, and no intermediate handling. Your freight goes straight from point A to point B.
                </p>
              </div>
            </div>
          </section>

          {/* Expedited Shipping Explained */}
          <section className="py-16 px-4 bg-secondary">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold text-primary mb-8">Expedited and Time-Critical Shipping</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Expedited shipping is a premium freight service designed for shipments that must arrive within a tight delivery window. Unlike standard freight services that batch multiple orders and route through hub-and-spoke terminal networks, expedited shipments receive a dedicated vehicle that travels directly from pickup to delivery with minimal or zero stops in between.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    The need for expedited shipping arises in many scenarios: a manufacturing line is shut down waiting for a critical replacement part, a hospital needs emergency medical supplies, a legal team requires original documents for a court deadline, or a product launch depends on marketing materials arriving before an event opens. In every case, the cost of delayed delivery far exceeds the premium paid for expedited transportation.
                  </p>
                </div>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-primary flex items-center gap-2">
                        <Zap className="h-5 w-5 text-accent" />
                        Same-Day Delivery
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Pickup and delivery within the same calendar day. Ideal for regional shipments up to 300 miles. Our dispatch team can have a driver en route within one to two hours of order placement for urgent requests.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-primary flex items-center gap-2">
                        <Clock className="h-5 w-5 text-accent" />
                        Next-Day Delivery
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">For shipments covering 300 to 1,000 miles, next-day delivery provides a reliable overnight option. A solo driver can cover this distance within federal hours-of-service regulations, delivering your freight by the following morning.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Common Cargo */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold text-primary mb-8">What We Ship by Sprinter Van</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Sprinter vans handle a diverse range of cargo types. The common thread is urgency: these are shipments where speed and careful handling take priority over cost optimization.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Medical Supplies & Equipment", detail: "Surgical instruments, diagnostic equipment, laboratory samples, and pharmaceutical products that require fast, temperature-stable transport with chain-of-custody documentation." },
                  { title: "Automotive Parts", detail: "Critical replacement components for dealerships, manufacturing plants, and repair shops. A single missing part can shut down an assembly line, making expedited delivery essential." },
                  { title: "Legal Documents & Financial Records", detail: "Original contracts, court filings, closing documents, and other legal materials that require secure, verifiable delivery with signature confirmation." },
                  { title: "Trade Show & Event Materials", detail: "Display booths, promotional materials, product samples, and AV equipment delivered on a guaranteed schedule to convention centers and event venues nationwide." },
                  { title: "Electronics & Technology", detail: "Servers, networking equipment, prototypes, and consumer electronics requiring vibration-dampened transport and careful handling to prevent damage to sensitive components." },
                  { title: "Product Samples & Prototypes", detail: "Pre-production samples, engineering prototypes, and product development materials being shipped between R&D facilities, manufacturers, and client offices for review and testing." }
                ].map((item) => (
                  <Card key={item.title} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg text-primary">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{item.detail}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Hot Shot & Team Drivers */}
          <section className="py-16 px-4 bg-secondary">
            <div className="container mx-auto max-w-5xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold text-primary mb-6">Hot Shot Delivery</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p className="text-lg leading-relaxed">
                      Hot shot delivery is the most urgent tier of expedited freight. The term originates from the oilfield services industry, where critical parts needed to be rushed to drilling sites to prevent costly downtime. Today, hot shot delivery applies to any shipment that requires immediate dispatch and the fastest possible transit time.
                    </p>
                    <p className="text-lg leading-relaxed">
                      When you place a hot shot order with DeMar Transportation, our dispatch team immediately identifies the closest available driver to your pickup location. The driver is dispatched within minutes, not hours. Routes are optimized for speed, and real-time GPS tracking allows you to monitor your shipment from pickup to delivery. Hot shot service is available 24 hours a day, 7 days a week, including holidays.
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-primary mb-6">Team Driver Options</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p className="text-lg leading-relaxed">
                      For shipments traveling over 1,000 miles, team drivers eliminate the downtime required by federal hours-of-service regulations. A team consists of two qualified drivers who alternate driving and resting, allowing the vehicle to remain in motion around the clock. This effectively doubles the daily mileage capability compared to a solo driver.
                    </p>
                    <p className="text-lg leading-relaxed">
                      Team driver service can move freight coast to coast in approximately 40 to 48 hours, compared to 4 to 5 days for standard ground shipping. This service is essential for cross-country expedited shipments where air freight is either too expensive or impractical due to cargo size or type restrictions. DeMar Transportation maintains a roster of experienced team driver pairs who are ready to deploy on short notice for long-distance expedited runs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose DeMar */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold text-primary mb-8">Why Choose DeMar Transportation for Sprinter Van Shipping</h2>
              <div className="space-y-6">
                {[
                  { title: "Rapid Dispatch", description: "Our logistics coordinators are available around the clock to take your expedited orders. We maintain a network of cargo van and sprinter van operators positioned across the western United States, enabling pickup within hours of your call." },
                  { title: "Dedicated Capacity", description: "Every sprinter van shipment gets exclusive use of the vehicle. Your freight is the only freight on the truck, which means no co-loading delays, no terminal stops, and no risk of damage from other shippers' cargo." },
                  { title: "Real-Time Visibility", description: "GPS tracking and proactive status updates keep you informed throughout the transit. Our team provides ETAs, milestone notifications, and proof of delivery documentation so you always know where your shipment is." },
                  { title: "Landstar Network Advantage", description: "As a Landstar agency, DeMar Transportation has access to thousands of pre-qualified owner-operators nationwide. This network depth ensures we can find capacity for your expedited shipment even during peak demand periods or in remote pickup locations." },
                  { title: "Competitive Expedited Rates", description: "We provide transparent, all-inclusive pricing for every expedited shipment. No hidden fuel surcharges, no surprise accessorial fees. You receive a firm quote before we dispatch, so you can make informed decisions about your shipping budget." }
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 bg-primary text-primary-foreground">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Expedited Shipping Now?</h2>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Time-critical freight cannot wait. Call DeMar Transportation for immediate dispatch or submit a quote request and our expedited team will respond within 30 minutes during business hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild variant="hero" size="xl" className="animate-pulse-glow">
                  <Link to="/quote">Request an Expedited Quote</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <a href="tel:+17752304767" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    (775) 230-4767
                  </a>
                </Button>
              </div>
              <p className="mt-6 text-primary-foreground/70 text-sm">
                DeMar Transportation &bull; 10471 Double R Blvd, Reno, NV 89521 &bull;{" "}
                <a href="mailto:info@DeMarTransportation.com" className="underline hover:text-primary-foreground">
                  info@DeMarTransportation.com
                </a>
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/services/box-truck" className="text-primary-foreground/70 hover:text-primary-foreground underline text-sm transition-colors">
                  Box Truck Services
                </Link>
                <span className="text-primary-foreground/40">&bull;</span>
                <Link to="/services/hazmat" className="text-primary-foreground/70 hover:text-primary-foreground underline text-sm transition-colors">
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
