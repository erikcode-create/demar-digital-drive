import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Truck, Phone, ShieldCheck, Package, ArrowRight, CheckCircle } from "lucide-react";

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

          {/* Hero Section */}
          <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-20 px-4">
            <div className="max-w-5xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 text-sm">
                <Truck className="w-4 h-4 mr-1" /> Most Popular Service
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Dry Van Shipping Services
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Reliable, enclosed freight transportation for general commodities across the continental United States. DeMar Transportation delivers your cargo safely, on time, and at competitive rates.
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

          {/* What is Dry Van */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What Is Dry Van Freight Shipping?</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  Dry van shipping is the most widely used method of over-the-road freight transportation in the United States, accounting for roughly 70 percent of all truckload shipments. A dry van is a fully enclosed, non-temperature-controlled trailer designed to protect cargo from weather, road debris, and theft during transit. The term "dry" distinguishes these trailers from refrigerated ("reefer") units, indicating that no climate-control system is installed.
                </p>
                <p>
                  At DeMar Transportation, dry van freight is the backbone of our operations. Whether you need a full truckload (FTL) moved coast to coast or a less-than-truckload (LTL) shipment consolidated with other freight, our dry van fleet is equipped to handle it. We coordinate with a nationwide carrier network through our Landstar agency partnership, giving shippers access to thousands of qualified dry van carriers on any given day.
                </p>
                <p>
                  Dry van trailers are ideal for non-perishable goods that do not require temperature regulation, specialized loading equipment, or oversized handling. From palletized consumer products to boxed electronics, the dry van's versatility makes it the default choice for the majority of commercial shippers in North America.
                </p>
              </div>
            </div>
          </section>

          {/* Trailer Specs */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Standard Dry Van Trailer Specifications</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-4xl font-bold text-primary">53 ft</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-gray-600">
                    <p className="font-semibold">Standard Trailer Length</p>
                    <p className="text-sm mt-1">Interior length of approximately 52 feet 6 inches. 48-foot trailers also available for routes with length restrictions.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-4xl font-bold text-primary">45,000 lbs</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-gray-600">
                    <p className="font-semibold">Maximum Payload Capacity</p>
                    <p className="text-sm mt-1">Up to 45,000 pounds of freight per load, depending on tractor configuration and state weight regulations.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-4xl font-bold text-primary">2,390 ft&sup3;</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-gray-600">
                    <p className="font-semibold">Interior Cubic Capacity</p>
                    <p className="text-sm mt-1">Approximately 2,390 cubic feet of cargo space. Interior width of 98.5 inches and interior height of 108 inches at the door opening.</p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-gray-600">
                Standard dry van trailers feature rear swing doors or roll-up doors for loading and unloading. Most are compatible with standard loading docks and can accommodate 22 to 26 standard pallets (48" x 40") loaded single-stacked, or more when double-stacked depending on cargo weight distribution.
              </p>
            </div>
          </section>

          {/* Common Cargo Types */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Common Dry Van Cargo Types</h2>
              <p className="text-gray-700 mb-8">
                Dry van trailers transport an enormous range of goods. Because the cargo area is fully enclosed and protected from the elements, nearly any non-perishable, non-hazardous commodity that fits within the trailer dimensions can be shipped by dry van. Here are the most common freight categories we handle:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "Consumer Goods", desc: "Household products, cleaning supplies, personal care items, and general merchandise destined for retail distribution centers and stores." },
                  { title: "Electronics", desc: "Packaged electronics, computer components, appliances, and consumer technology products requiring enclosed protection from moisture and dust." },
                  { title: "Packaged Foods", desc: "Non-perishable food items including canned goods, snack foods, beverages, dry goods, and shelf-stable grocery products." },
                  { title: "Retail Inventory", desc: "Clothing, footwear, furniture, home goods, and seasonal merchandise for big-box retailers, department stores, and e-commerce fulfillment centers." },
                  { title: "Paper Products", desc: "Printing paper, packaging materials, tissue products, cardboard, and corrugated containers. These lightweight but bulky loads often cube out before reaching weight limits." },
                  { title: "Textiles & Fabrics", desc: "Rolls of fabric, yarn, finished garments, carpeting, and industrial textiles that require protection from moisture and contamination during transit." },
                ].map((cargo) => (
                  <Card key={cargo.title} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Package className="w-5 h-5 mr-2 text-primary" />
                        {cargo.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{cargo.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Benefits of Dry Van Shipping</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Weather Protection</h3>
                      <p className="text-gray-600">Fully enclosed trailers shield your freight from rain, snow, wind, and UV exposure throughout the entire journey. Unlike open-deck equipment, dry vans keep cargo completely sealed from the elements.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Cargo Security</h3>
                      <p className="text-gray-600">Sealed trailers with locking mechanisms reduce the risk of theft, tampering, and pilferage. High-value shipments benefit from the added security of an enclosed, locked container that is never left open at truck stops or during transit.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Versatility</h3>
                      <p className="text-gray-600">Dry vans accommodate the widest range of commodity types of any trailer class. From lightweight, high-volume shipments to dense, heavy pallets, the standard dry van handles it all with minimal special equipment needed.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Cost-Effective</h3>
                      <p className="text-gray-600">Because dry van capacity is the most abundant equipment type on the road, rates are typically more competitive than specialized trailers. High carrier availability means shorter lead times and more flexible scheduling options for shippers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Industries Served */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Industries We Serve</h2>
              <p className="text-gray-700 mb-8">
                DeMar Transportation provides dry van freight services to businesses across a wide spectrum of industries. Our experience coordinating shipments for these sectors means we understand your supply chain requirements, delivery windows, and compliance expectations.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { name: "Retail & Distribution", detail: "We move freight for national retailers, regional distributors, and third-party logistics providers. Whether restocking distribution centers or delivering directly to store locations, our carriers understand appointment scheduling, lumper requirements, and retailer compliance programs." },
                  { name: "Manufacturing", detail: "Raw materials inbound and finished products outbound. We coordinate just-in-time deliveries for assembly plants and production facilities where schedule reliability directly impacts production line uptime." },
                  { name: "Food & Beverage", detail: "Non-perishable food products, beverages, and packaged goods require clean, dry trailers free of contaminants and odors. Our carriers maintain trailer washout records and comply with food-grade transportation standards." },
                  { name: "E-Commerce & Fulfillment", detail: "High-frequency shipments to fulfillment centers and last-mile hubs. We support the fast-paced replenishment cycles that e-commerce operations demand, with flexible scheduling and expedited options when volume surges." },
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

          {/* Why DeMar */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose DeMar Transportation for Dry Van Shipping</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  As a Landstar agency based in Reno, Nevada, DeMar Transportation combines the personalized service of a dedicated freight broker with the capacity and resources of one of the largest transportation networks in North America. Landstar's owner-operator model means every carrier in the network has a personal stake in delivering your freight safely and on schedule.
                </p>
                <p>
                  We provide real-time shipment tracking, proactive communication on load status, and a single point of contact for every shipment from pickup through delivery. Our team handles all the logistics coordination so you can focus on running your business rather than managing freight.
                </p>
                <p>
                  Whether you are shipping a single full truckload or managing a recurring lane program with hundreds of loads per month, DeMar Transportation has the capacity, the carrier relationships, and the operational expertise to keep your supply chain moving. We also offer complementary services including <Link to="/services/reefer" className="text-primary hover:underline">refrigerated shipping</Link> and <Link to="/services/flatbed" className="text-primary hover:underline">flatbed transportation</Link> for loads that require specialized equipment.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 bg-gradient-to-r from-primary to-blue-700 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-3xl font-bold mb-4">Ready to Ship? Get Your Dry Van Quote Today.</h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Tell us about your shipment and receive a competitive rate quote within hours. Our freight specialists are available Monday through Saturday to help you find the right solution for your cargo.
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

export default DryVan;
