import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Phone, ArrowRight, CheckCircle, ShieldCheck, Warehouse, MapPin, PackageCheck, BarChart3, Clock, Layers } from "lucide-react";

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

          {/* Hero Section */}
          <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-20 px-4">
            <div className="max-w-5xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 text-sm">
                <Warehouse className="w-4 h-4 mr-1" /> Nationwide Network
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Warehousing & Distribution Services
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Strategically located warehouse facilities across the United States. DeMar Transportation coordinates storage, fulfillment, and distribution through our network of warehouse partners to keep your products moving and your customers satisfied.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/quote">
                  <Button size="lg" className="text-lg px-8">
                    Get a Free Quote <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <a href="tel:+17752304767">
                  <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white/10">
                    <Phone className="mr-2 w-5 h-5" /> (775) 230-4767
                  </Button>
                </a>
              </div>
            </div>
          </section>

          {/* Overview */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">A Nationwide Warehouse Network at Your Disposal</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  Efficient warehousing is the backbone of any well-run supply chain. Whether you need a place to stage inventory before it ships to retail locations, a cross-dock facility to consolidate and redistribute freight, or a fulfillment center to process individual customer orders, DeMar Transportation connects you with the right warehouse space in the right location.
                </p>
                <p>
                  Through our network of strategic warehouse locations positioned near major transportation corridors and population centers, we provide flexible storage and distribution solutions without requiring you to sign long-term leases, hire warehouse staff, or invest in facility infrastructure. Our warehouse partners operate modern, secure facilities equipped with the technology and processes to handle your inventory with care and precision.
                </p>
                <p>
                  What makes our approach different is the integration between warehousing and transportation. Because DeMar manages both your storage needs and your freight movements, there is no disconnect between what is sitting in a warehouse and what is scheduled to ship. One provider, one point of contact, complete coordination from receipt to delivery.
                </p>
              </div>
            </div>
          </section>

          {/* Warehousing Services */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Warehousing Services</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: Clock, title: "Short-Term & Long-Term Storage", desc: "Flexible storage arrangements that match your needs. Use short-term space for seasonal overflow, product launches, or import staging. Long-term programs available for ongoing inventory positioning without multi-year lease commitments." },
                  { icon: Layers, title: "Cross-Docking", desc: "Inbound freight is unloaded, sorted, and reloaded onto outbound trucks with minimal or no storage time. Cross-docking reduces handling costs, accelerates delivery times, and eliminates the need for dedicated warehouse space for fast-moving products." },
                  { icon: PackageCheck, title: "Transloading", desc: "Transfer cargo between transportation modes or container types. Commonly used to move freight from ocean containers into domestic trailers, or to consolidate multiple smaller shipments into full truckloads for more efficient overland transport." },
                  { icon: Warehouse, title: "Pick-and-Pack", desc: "Individual order fulfillment from bulk inventory. Warehouse staff pick items from shelved stock, pack them to your specifications, label them, and prepare them for shipment. Ideal for e-commerce operations and direct-to-consumer brands." },
                  { icon: PackageCheck, title: "Order Fulfillment", desc: "End-to-end fulfillment services from receiving inventory to shipping finished orders. We coordinate the entire process including receiving, quality inspection, storage, order processing, packing, and carrier handoff." },
                  { icon: BarChart3, title: "Inventory Management", desc: "Real-time inventory tracking with regular cycle counts and reporting. Know exactly how much stock you have, where it is located within the facility, and when reorder points are approaching. Integration with your systems available." },
                ].map((service) => (
                  <Card key={service.title} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <service.icon className="w-5 h-5 mr-2 text-primary" />
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{service.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Distribution Services */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Distribution Services</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4 mb-8">
                <p>
                  Warehousing is only half the equation. Getting products from storage to their final destination efficiently and on time is where distribution comes in. DeMar Transportation coordinates outbound distribution from our warehouse network using our own fleet and our carrier partners to deliver your goods wherever they need to go.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl font-bold text-primary">Last-Mile Delivery</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-gray-600">
                    <p>Coordination of final-mile delivery from warehouse to end customer, retail location, or job site. We work with local delivery partners to ensure your products arrive on time and in perfect condition, even for residential deliveries.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl font-bold text-primary">Regional Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-gray-600">
                    <p>Multi-stop delivery routes serving multiple locations within a geographic region. We optimize route sequencing to minimize transit time and cost while meeting each location's delivery window and receiving requirements.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl font-bold text-primary">Pool Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-gray-600">
                    <p>Consolidate multiple LTL shipments headed to the same region into a single truckload, then break them out for individual delivery at the destination market. Pool distribution reduces per-unit shipping costs significantly compared to individual LTL shipments.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Strategic Locations */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Strategic Warehouse Locations</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  Location is everything in warehousing and distribution. A warehouse that is too far from your customers adds transit time and cost to every order. Our warehouse network includes facilities positioned near major interstate highways, intermodal rail yards, ports of entry, and high-density population centers throughout the United States.
                </p>
                <p>
                  Whether you need a West Coast facility to receive imports from the Pacific Rim, a Midwest hub to serve the heartland, or East Coast distribution points for rapid delivery to the Northeast corridor, we can place your inventory where it needs to be. Multiple warehouse locations also provide supply chain redundancy, so a disruption at one facility does not shut down your entire distribution operation.
                </p>
              </div>
              <div className="grid md:grid-cols-4 gap-4 mt-8">
                {[
                  { region: "West Coast", detail: "Import staging, Pacific trade lane support" },
                  { region: "Mountain West", detail: "Regional hub serving NV, UT, CO, AZ corridors" },
                  { region: "Midwest", detail: "Central distribution reaching 80% of the US in 2 days" },
                  { region: "East Coast", detail: "Northeast consumer market and port access" },
                ].map((loc) => (
                  <Card key={loc.region} className="text-center">
                    <CardHeader className="pb-2">
                      <MapPin className="w-6 h-6 text-primary mx-auto mb-1" />
                      <CardTitle className="text-lg">{loc.region}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{loc.detail}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Technology */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Technology-Driven Warehouse Operations</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Inventory Tracking</h3>
                      <p className="text-gray-600">Barcode and SKU-level tracking from the moment your products arrive at the warehouse. Every receipt, movement, and shipment is recorded, giving you a complete audit trail and accurate stock counts at all times.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">WMS Integration</h3>
                      <p className="text-gray-600">Our warehouse partners operate warehouse management systems (WMS) that can integrate with your ERP, e-commerce platform, or order management system. Automated data exchange reduces manual entry errors and speeds up order processing.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Real-Time Stock Visibility</h3>
                      <p className="text-gray-600">Access current inventory levels, inbound shipment status, and outbound order progress. Reporting dashboards provide the data you need to make informed decisions about replenishment, allocation, and distribution timing.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Secure Facilities</h3>
                      <p className="text-gray-600">Warehouse locations in our network maintain security protocols including surveillance cameras, controlled access, alarm systems, and regular security audits. Your inventory is protected around the clock.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Industries */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Industries We Serve</h2>
              <p className="text-gray-700 mb-8">
                Our warehousing and distribution services support businesses across multiple industries, each with unique storage requirements, handling procedures, and delivery expectations.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { name: "E-Commerce Fulfillment", detail: "Store inventory close to your customers and ship orders fast. Our warehouse partners handle receiving, storage, pick-and-pack, and carrier handoff so you can offer competitive delivery times without managing your own warehouse." },
                  { name: "Retail Distribution", detail: "Stage inventory for retail replenishment, manage seasonal stock builds, and coordinate multi-store deliveries. We understand retailer compliance requirements and appointment-based receiving schedules." },
                  { name: "Manufacturing Supply Chain", detail: "Inbound raw material staging, work-in-process buffer storage, and finished goods distribution. We help manufacturers maintain lean inventory while ensuring materials are available when production schedules demand them." },
                  { name: "Seasonal Storage", detail: "Not every business needs warehouse space year-round. Our flexible arrangements let you scale up during peak seasons and scale down when demand drops, so you only pay for the space you actually use." },
                ].map((industry) => (
                  <Card key={industry.name}>
                    <CardHeader>
                      <CardTitle className="text-xl">{industry.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{industry.detail}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Scalable Solutions */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Flexible, Scalable Warehouse Solutions</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
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
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose DeMar Transportation for Warehousing</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  The biggest advantage of using DeMar Transportation for warehousing is the seamless integration between storage and transportation. Most companies work with a warehouse provider and a separate freight company, which creates communication gaps, scheduling conflicts, and finger-pointing when things go wrong. With DeMar, one team coordinates your entire logistics operation from warehouse receipt through final delivery.
                </p>
                <p>
                  As both an asset-based carrier and a licensed freight broker, we control more of the supply chain than a standalone warehouse company ever could. When your inventory is ready to ship, we do not need to wait for a third-party carrier to become available. We dispatch from our own fleet or immediately source a vetted carrier from our network. The result is faster turnaround, fewer delays, and lower total logistics costs.
                </p>
                <p>
                  Whether you need warehousing as a standalone service or as part of a comprehensive <Link to="/services/3pl" className="text-primary hover:underline">third-party logistics solution</Link>, DeMar Transportation has the network, the technology, and the people to make it work. Contact us to discuss your warehousing needs and let us design a solution that fits your business.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 bg-gradient-to-r from-primary to-blue-700 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-3xl font-bold mb-4">Need Warehouse Space? Let's Talk.</h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Tell us about your storage and distribution requirements, and we will recommend the right warehouse solution from our nationwide network. No long-term commitments required. Flexible space, professional handling, and integrated transportation all from a single provider.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/quote">
                  <Button size="lg" variant="secondary" className="text-lg px-8">
                    Request a Free Quote <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <a href="tel:+17752304767">
                  <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white/10">
                    <Phone className="mr-2 w-5 h-5" /> (775) 230-4767
                  </Button>
                </a>
              </div>
              <p className="mt-6 text-white/70 text-sm">
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
