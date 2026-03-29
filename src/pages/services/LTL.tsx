import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Package, Phone, ShieldCheck, ArrowRight, CheckCircle, Scale, Clock, DollarSign, Layers } from "lucide-react";

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

          {/* Hero Section */}
          <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-20 px-4">
            <div className="max-w-5xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 text-sm">
                <Package className="w-4 h-4 mr-1" /> Cost-Effective Freight
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                LTL Freight Shipping Services
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Ship smarter with Less Than Truckload freight. Pay only for the trailer space your shipment occupies and let DeMar Transportation handle the rest -- from carrier selection to delivery coordination.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/quote">
                  <Button size="lg" className="text-lg px-8">
                    Get a Free LTL Quote <ArrowRight className="ml-2 w-5 h-5" />
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

          {/* What is LTL Shipping */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What Is LTL Shipping?</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
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
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">When to Use LTL vs. Full Truckload</h2>
              <p className="text-gray-700 mb-8">
                Choosing between LTL and FTL depends on the size, weight, and urgency of your shipment. Here is a straightforward guide to help you determine which mode fits your needs:
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="text-xl">LTL Is Best When...</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">Your shipment weighs under 10,000 lbs</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">You are shipping 1 to 10 pallets</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">You do not need a full trailer and want to reduce costs</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">Delivery within 1 to 5 business days is acceptable</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">You are replenishing inventory or sending samples</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-gray-400">
                  <CardHeader>
                    <CardTitle className="text-xl">Consider FTL Instead When...</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <ArrowRight className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">Your shipment weighs over 10,000 lbs</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ArrowRight className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">You have 10 or more pallets to ship</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ArrowRight className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">Freight is high-value, fragile, or time-sensitive</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ArrowRight className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">You need direct transit with no terminal handling</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ArrowRight className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">The cost of LTL with accessorials approaches FTL rates</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <p className="text-gray-700 mt-6">
                Shipping more than 10,000 lbs or filling more than half a trailer? Our <Link to="/services/ftl" className="text-primary hover:underline font-medium">full truckload (FTL) services</Link> may offer a better rate and faster transit for your shipment.
              </p>
            </div>
          </section>

          {/* NMFC Freight Classes */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Understanding NMFC Freight Classes</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4 mb-8">
                <p>
                  Every LTL shipment is assigned a freight class under the National Motor Freight Classification (NMFC) system, which ranges from Class 50 to Class 500. The freight class directly impacts your shipping rate -- lower classes cost less per hundredweight, while higher classes cost more. The NMFC classification is determined by four key factors:
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="text-center pb-2">
                    <Scale className="w-8 h-8 mx-auto text-primary mb-2" />
                    <CardTitle className="text-lg">Density</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm text-gray-600">
                    Weight per cubic foot. Denser freight (like bricks or metal) receives a lower class. Lightweight, bulky items (like pillows or lampshades) receive a higher class.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="text-center pb-2">
                    <Package className="w-8 h-8 mx-auto text-primary mb-2" />
                    <CardTitle className="text-lg">Handling</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm text-gray-600">
                    How easy or difficult the freight is to load and unload. Standard palletized cargo is easy to handle. Oddly shaped, fragile, or hazardous items require more care and cost more.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="text-center pb-2">
                    <ShieldCheck className="w-8 h-8 mx-auto text-primary mb-2" />
                    <CardTitle className="text-lg">Liability</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm text-gray-600">
                    The value and susceptibility to damage or theft. High-value electronics or perishable goods carry greater carrier liability, resulting in a higher freight class.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="text-center pb-2">
                    <Layers className="w-8 h-8 mx-auto text-primary mb-2" />
                    <CardTitle className="text-lg">Stowability</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm text-gray-600">
                    How well the freight fits with other cargo. Items that cannot be stacked, must be loaded in a specific orientation, or are regulated receive a higher class.
                  </CardContent>
                </Card>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">Common Freight Class Examples</h3>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700">
                  <p><strong>Class 50:</strong> Fits-in-drum goods, clean brick, hardwood flooring (50+ lbs/ft3)</p>
                  <p><strong>Class 70:</strong> Auto parts, food items, machinery (15-22.5 lbs/ft3)</p>
                  <p><strong>Class 100:</strong> Boat covers, car covers, canvas, wine cases (9-10.5 lbs/ft3)</p>
                  <p><strong>Class 150:</strong> Auto sheet metal, bookcases, cabinets (5-6 lbs/ft3)</p>
                  <p><strong>Class 250:</strong> Bamboo furniture, mattresses, plasma TVs (2-3 lbs/ft3)</p>
                  <p><strong>Class 500:</strong> Low-density freight like bags of gold dust, ping pong balls (&lt;1 lb/ft3)</p>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Not sure about your freight class? Our team will help you determine the correct NMFC classification to ensure accurate quoting and avoid reclassification charges from the carrier.
                </p>
              </div>
            </div>
          </section>

          {/* Common LTL Cargo */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Common LTL Cargo Types</h2>
              <p className="text-gray-700 mb-8">
                LTL shipping is the go-to solution for businesses that move partial loads on a regular basis. Here are the most common types of freight we handle through our LTL services:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "Palletized Goods", desc: "Standard pallets of boxed or shrink-wrapped products are the bread and butter of LTL shipping. Properly palletized freight moves efficiently through carrier terminals and minimizes handling damage." },
                  { title: "Partial Loads", desc: "When you have more freight than a parcel carrier can handle but not enough to fill a truck, LTL bridges the gap. Shipments of 150 lbs to 10,000 lbs fit perfectly in the LTL sweet spot." },
                  { title: "Samples & Prototypes", desc: "Manufacturers and product teams frequently ship samples to buyers, trade shows, or testing facilities. LTL provides a cost-effective way to move these smaller shipments with full tracking." },
                  { title: "Distributor Replenishment", desc: "Regular inventory replenishment to warehouses, distribution centers, and retail locations. Consistent LTL lanes can be optimized for recurring routes and scheduled pickups." },
                  { title: "E-Commerce Shipments", desc: "Larger e-commerce orders, wholesale quantities, and B2B shipments that exceed parcel carrier limits but do not require a full trailer. Common for furniture, appliances, and bulk orders." },
                  { title: "Printed Materials", desc: "Marketing materials, catalogs, books, and point-of-sale displays shipped from printers to distribution points across the country. These lightweight but bulky shipments are well-suited to LTL." },
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

          {/* Transit Times & Cost Factors */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">LTL Transit Times and Cost Factors</h2>
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="w-6 h-6 mr-2 text-primary" /> Transit Times
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      LTL transit times typically range from 1 to 5 business days depending on the distance between origin and destination, the carrier's network, and the number of terminal transfers required. Regional shipments (under 500 miles) often arrive in 1 to 2 days, while cross-country shipments may take 4 to 5 days.
                    </p>
                    <p>
                      Unlike FTL, where the truck goes directly from pickup to delivery, LTL freight passes through carrier terminals where it is sorted and consolidated with other shipments heading in the same direction. Each terminal stop adds time, which is why direct-lane LTL shipments with fewer terminal transfers move faster.
                    </p>
                    <p>
                      Need faster transit? Ask about guaranteed delivery services or expedited LTL options. For time-critical freight, a <Link to="/services/ftl" className="text-primary hover:underline">dedicated FTL shipment</Link> eliminates terminal handling entirely.
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="w-6 h-6 mr-2 text-primary" /> Cost Factors
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
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-semibold">{item.factor}:</span>{" "}
                          <span className="text-gray-600">{item.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DeMar's LTL Advantages */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Ship LTL with DeMar Transportation</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
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
                  We also coordinate specialized LTL services including shipments requiring <Link to="/services/reefer" className="text-primary hover:underline">temperature-controlled trailers</Link>, <Link to="/services/hazmat" className="text-primary hover:underline">hazmat-certified carriers</Link>, and liftgate or inside delivery for locations without loading docks. Every shipment includes bill of lading preparation, real-time tracking, and delivery confirmation.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 bg-gradient-to-r from-primary to-blue-700 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-3xl font-bold mb-4">Get Your LTL Freight Quote Today</h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Tell us about your shipment -- weight, dimensions, origin, and destination -- and receive a competitive LTL rate quote within hours. Our freight specialists are available Monday through Saturday to help you find the most cost-effective shipping solution.
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

export default LTL;
