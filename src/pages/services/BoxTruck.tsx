import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Building, Phone, Package, MapPin, Truck, CheckCircle } from "lucide-react";

const BoxTruck = () => {
  useEffect(() => {
    document.title = "Box Truck Shipping Services | Local & Regional Freight | DeMar Transportation";
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
          {/* Hero Section */}
          <section className="bg-primary text-primary-foreground py-20 px-4">
            <div className="container mx-auto max-w-5xl">
              <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors mb-6">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <div className="flex items-center gap-4 mb-6">
                <Building className="h-12 w-12 text-accent" />
                <Badge variant="secondary" className="text-sm">Service Page</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Box Truck Shipping Services
              </h1>
              <p className="text-xl text-primary-foreground/90 max-w-3xl">
                Cost-effective freight transportation for small to mid-size loads. Our 26-foot box trucks deliver flexibility, reliability, and access to locations that full-size trailers cannot reach.
              </p>
            </div>
          </section>

          {/* What is Box Truck Freight */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold text-primary mb-6">What Is Box Truck Freight?</h2>
              <div className="prose max-w-none text-muted-foreground space-y-4">
                <p className="text-lg leading-relaxed">
                  Box truck freight refers to shipments transported using medium-duty straight trucks, typically 26 feet in length with an enclosed cargo area. These vehicles are a staple of the American freight industry, bridging the gap between small cargo vans and full 53-foot tractor-trailers. A standard 26-foot box truck offers approximately 1,700 cubic feet of cargo space and can carry between 10,000 and 12,000 pounds, depending on the specific vehicle configuration and axle rating.
                </p>
                <p className="text-lg leading-relaxed">
                  Unlike tractor-trailer combinations that require a driver with a Class A commercial driver's license, most box trucks can be operated with a Class B CDL or even a standard license for lighter GVWR models. This translates to greater driver availability and more scheduling flexibility for shippers. The enclosed cargo bay protects freight from weather, road debris, and theft, while many box trucks come equipped with hydraulic liftgates that simplify loading and unloading at locations without dock-height bays.
                </p>
                <p className="text-lg leading-relaxed">
                  Box truck shipping is one of the most versatile modes in the ground transportation industry. Whether you need to move a partial load across town or consolidate multiple LTL shipments into a single dedicated truck, box truck freight offers a practical and economical solution that full truckload carriers simply cannot match for smaller volumes.
                </p>
              </div>
            </div>
          </section>

          {/* Ideal Use Cases */}
          <section className="py-16 px-4 bg-secondary">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold text-primary mb-8">Ideal Use Cases for Box Truck Shipping</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Local & Regional Deliveries",
                    description: "Box trucks excel at short-haul and regional routes, typically covering distances under 500 miles. Their smaller size allows faster turnaround times and more efficient routing through urban corridors, making them ideal for daily delivery schedules and recurring distribution runs."
                  },
                  {
                    title: "LTL Consolidation",
                    description: "When you have freight that is too large for parcel carriers but does not justify a full 53-foot trailer, a box truck provides the perfect middle ground. Shippers can consolidate multiple less-than-truckload orders into a single dedicated box truck, reducing per-unit shipping costs and ensuring faster transit times compared to traditional LTL networks."
                  },
                  {
                    title: "Residential & Limited-Access Deliveries",
                    description: "Many delivery locations, including residential addresses, strip malls, and older commercial buildings, cannot accommodate a full-size tractor-trailer. Box trucks navigate narrow streets, tight parking lots, and low-clearance areas with ease, and their liftgates enable ground-level delivery without a loading dock."
                  },
                  {
                    title: "Trade Shows & Events",
                    description: "Moving trade show booths, display materials, and promotional inventory requires careful handling and precise scheduling. Box trucks offer the dedicated space and flexible timing that event logistics demand, with the ability to park close to convention center entrances and expo halls."
                  },
                  {
                    title: "Retail Restocking",
                    description: "Retail chains and independent stores rely on frequent, smaller deliveries to keep shelves stocked without overloading back-room storage. Box truck delivery routes can be tailored to multi-stop schedules, serving multiple store locations in a single run while meeting tight delivery windows."
                  },
                  {
                    title: "Construction Site Delivery",
                    description: "Construction materials, tools, and fixtures often need to reach active job sites where space is limited and road conditions are unpredictable. Box trucks provide the durability and maneuverability needed to deliver building supplies directly to the point of use."
                  }
                ].map((item) => (
                  <Card key={item.title} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg text-primary">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Advantages */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold text-primary mb-8">Advantages of Box Truck Shipping Over Full Truckload</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-2">Cost-Efficient for Smaller Loads</h3>
                    <p className="text-muted-foreground">Paying for a full 53-foot trailer when you only need a fraction of the space is an unnecessary expense. Box truck rates reflect the actual capacity being used, which means shippers moving 5,000 to 12,000 pounds of freight can realize significant cost savings. You get a dedicated vehicle without the full truckload price tag.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-2">Access to Tight Spaces</h3>
                    <p className="text-muted-foreground">A 26-foot box truck is roughly half the length of a standard semi-trailer, giving it a decisive advantage in urban environments. Downtown alleys, residential neighborhoods, underground parking garages, and facilities with tight turning radii are all accessible. This eliminates the need for costly transloading or secondary shuttle services.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-2">Liftgate and Special Equipment Available</h3>
                    <p className="text-muted-foreground">Many box trucks come equipped with hydraulic liftgates rated for 2,500 to 3,000 pounds, enabling delivery to locations without loading docks. Additional equipment such as pallet jacks, furniture pads, and ratchet straps can be provided to ensure safe handling of your cargo from pickup to delivery.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-2">Faster Loading and Unloading</h3>
                    <p className="text-muted-foreground">Smaller cargo volumes mean faster dock times. Box truck shipments typically require a fraction of the loading time compared to full truckload, reducing detention charges and keeping your supply chain moving efficiently.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Industries Served */}
          <section className="py-16 px-4 bg-secondary">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold text-primary mb-8">Industries We Serve</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Box truck freight is one of the most adaptable transportation modes available. DeMar Transportation provides box truck shipping services across a wide range of industries throughout the western United States and beyond.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Retail & E-Commerce", detail: "Store restocking, warehouse-to-store transfers, and last-mile fulfillment for online orders requiring white-glove or threshold delivery." },
                  { title: "Construction & Building Materials", detail: "Lumber, drywall, fixtures, and tools delivered directly to job sites with liftgate service for ground-level unloading." },
                  { title: "Events & Hospitality", detail: "Trade show booths, catering equipment, furniture rentals, and event staging materials with time-definite delivery." },
                  { title: "Healthcare & Pharmaceuticals", detail: "Medical equipment, office furnishings, and pharmaceutical supplies requiring careful handling and on-time delivery." }
                ].map((industry) => (
                  <Card key={industry.title}>
                    <CardHeader>
                      <CardTitle className="text-lg text-primary flex items-center gap-2">
                        <Package className="h-5 w-5 text-accent" />
                        {industry.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{industry.detail}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Why Choose DeMar */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold text-primary mb-6">Why Choose DeMar Transportation for Box Truck Shipping</h2>
              <div className="prose max-w-none text-muted-foreground space-y-4">
                <p className="text-lg leading-relaxed">
                  Based in Reno, Nevada, DeMar Transportation has built a reputation for reliable, customer-focused freight services across the western United States. DeMar Transportation has access to a nationwide carrier network, ensuring capacity availability even during peak shipping seasons. Our box truck fleet and owner-operator network provide the flexibility to handle everything from single-pallet deliveries to multi-stop distribution runs.
                </p>
                <p className="text-lg leading-relaxed">
                  Every shipment is assigned a dedicated logistics coordinator who manages your load from pickup to delivery. We provide real-time tracking updates, proactive communication about any delays or schedule changes, and proof of delivery documentation. Our team understands that your freight is your business, and we treat every load with the urgency and care it deserves.
                </p>
                <p className="text-lg leading-relaxed">
                  Whether you need a one-time box truck delivery or an ongoing distribution partnership, DeMar Transportation offers competitive rates, consistent service, and the local expertise that national brokers cannot match. We know the roads, the docks, and the challenges of freight delivery in the Reno-Tahoe corridor and beyond.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 bg-primary text-primary-foreground">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Get a Box Truck Shipping Quote Today</h2>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Ready to ship? Contact DeMar Transportation for a competitive box truck freight quote. Our logistics team is standing by to help you find the most cost-effective solution for your shipment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild variant="hero" size="xl" className="animate-pulse-glow">
                  <Link to="/quote">Request a Free Quote</Link>
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
                <Link to="/services/sprinter-van" className="text-primary-foreground/70 hover:text-primary-foreground underline text-sm transition-colors">
                  Sprinter Van Services
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

export default BoxTruck;
