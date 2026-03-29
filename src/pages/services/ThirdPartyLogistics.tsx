import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Phone, ArrowRight, CheckCircle, ShieldCheck, Network, TrendingUp, BarChart3, Users, Globe, Boxes } from "lucide-react";

const ThirdPartyLogistics = () => {
  useEffect(() => {
    document.title = "Third-Party Logistics (3PL) Services | Freight Management | DeMar Transportation";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "DeMar Transportation provides full-service 3PL solutions including freight management, carrier sourcing, warehousing coordination, and supply chain visibility. One call handles everything. Get a free quote today.");
    }
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Third-Party Logistics (3PL) Services",
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
    "serviceType": "Third-Party Logistics",
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "description": "Full-service third-party logistics (3PL) including freight management, carrier sourcing, warehousing coordination, real-time tracking, and supply chain optimization for businesses across the United States."
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
                <Network className="w-4 h-4 mr-1" /> Full-Service Logistics
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Third-Party Logistics (3PL) Services
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Simplify your supply chain with a single logistics partner. DeMar Transportation manages your freight, coordinates warehousing, and provides end-to-end visibility so you can focus on growing your business.
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

          {/* What is 3PL */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What Is a Third-Party Logistics Provider?</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  A third-party logistics provider, commonly referred to as a 3PL, is an outside company that manages some or all of your supply chain and shipping operations on your behalf. Instead of hiring your own fleet, negotiating with dozens of carriers, coordinating warehouse space, and tracking every shipment yourself, you hand those responsibilities to a 3PL partner who has the infrastructure, relationships, and technology to do it more efficiently.
                </p>
                <p>
                  For many businesses, logistics is essential but not their core competency. Managing freight in-house requires dedicated staff, carrier contracts, transportation management software, insurance oversight, and constant communication with drivers and warehouses. A 3PL absorbs all of that complexity. You make one call, explain what needs to move and when, and your 3PL partner handles everything from there.
                </p>
                <p>
                  DeMar Transportation operates as both an asset-based carrier with our own fleet and a licensed freight broker with access to a nationwide network of vetted carriers. This dual capability means we are not limited to a single mode of transport or a fixed number of trucks. We match the right equipment and carrier to every load, every time, whether you need a single pallet moved across town or a multi-stop truckload routed across the country.
                </p>
              </div>
            </div>
          </section>

          {/* 3PL Capabilities */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Our 3PL Capabilities</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-primary">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Boxes className="w-5 h-5 mr-2 text-primary" />
                      Freight Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Complete transportation management from pickup to delivery. We plan routes, select the right equipment type, coordinate loading and unloading schedules, and manage all documentation including bills of lading, proof of delivery, and insurance certificates.</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-primary">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Users className="w-5 h-5 mr-2 text-primary" />
                      Carrier Sourcing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Access to a vast network of qualified, insured carriers covering every lane in the continental United States. We vet every carrier for safety records, insurance coverage, and on-time performance before tendering a single load. When your primary carrier is unavailable, we have backup options ready.</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-primary">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-primary" />
                      Warehousing Coordination
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Through our nationwide warehouse network, we coordinate storage, cross-docking, transloading, and distribution services. Whether you need short-term overflow space during peak season or a long-term distribution hub closer to your customers, we connect you with the right facility.</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-primary">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                      Supply Chain Visibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Real-time tracking and proactive status updates on every shipment. You always know where your freight is, when it will arrive, and if any issues arise along the way. We provide delivery confirmations, exception alerts, and detailed reporting to keep your team informed.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Single Point of Contact */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">One Call Handles Everything</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  One of the biggest advantages of working with DeMar Transportation as your 3PL is the simplicity of having a single point of contact. Rather than juggling relationships with multiple carriers, warehouse operators, and freight brokers, you work with one dedicated logistics coordinator who knows your business, your shipping patterns, and your priorities.
                </p>
                <p>
                  When a shipment needs to move, you make one call or send one email. Your logistics coordinator takes it from there: sourcing the carrier, booking the load, arranging pickup and delivery appointments, monitoring the shipment in transit, and confirming delivery. If something changes mid-route, such as a delay, a rescheduled delivery window, or an equipment issue, your coordinator handles the adjustments and keeps you updated.
                </p>
                <p>
                  This single-provider model eliminates the communication gaps and finger-pointing that often occur when multiple vendors are involved in a single shipment. When DeMar coordinates the entire process, accountability is clear and problems get resolved faster.
                </p>
              </div>
            </div>
          </section>

          {/* Technology & Visibility */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Technology and Real-Time Visibility</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl font-bold text-primary">Real-Time Tracking</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-gray-600">
                    <p>GPS-based shipment tracking with regular location updates. Know exactly where your freight is at every stage of transit, from pickup to final delivery.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl font-bold text-primary">Proactive Updates</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-gray-600">
                    <p>Status notifications at key milestones: loaded, in transit, approaching delivery, and delivered. Exception alerts if delays or issues arise so there are never surprises.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl font-bold text-primary">Delivery Confirmation</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-gray-600">
                    <p>Electronic proof of delivery documentation including signed BOLs, delivery receipts, and photos when required. Complete audit trail for every shipment.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Scalability */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Scalable Logistics That Grow With Your Business</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  Business is not static, and your logistics solution should not be either. Whether you are dealing with seasonal demand surges, launching into new geographic markets, or experiencing rapid growth, DeMar Transportation scales with you. Because we have access to a deep carrier network and flexible warehouse partnerships, adding capacity is a matter of coordination rather than capital investment.
                </p>
                <p>
                  During peak season, when your shipping volume might double or triple overnight, we ramp up carrier capacity to handle the increased load count without compromising transit times. When volume drops back to normal, you are not paying for idle trucks or empty warehouse space. This flexibility is one of the core reasons companies choose a 3PL partner over building their own logistics operation from scratch.
                </p>
              </div>
            </div>
          </section>

          {/* Industries Served */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Industries We Serve</h2>
              <p className="text-gray-700 mb-8">
                DeMar Transportation provides 3PL services to businesses across a wide range of industries. Our experience managing complex supply chains for these sectors means we understand the unique requirements, compliance standards, and delivery expectations your industry demands.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "Manufacturing", desc: "Inbound raw materials, outbound finished goods, and just-in-time delivery to keep production lines running. We coordinate multi-stop routes and manage vendor shipping programs." },
                  { title: "Retail & Distribution", desc: "Store replenishment, distribution center transfers, and seasonal inventory positioning. We understand retailer compliance programs, appointment scheduling, and delivery requirements." },
                  { title: "E-Commerce", desc: "High-frequency fulfillment center replenishment, last-mile coordination, and the fast turnaround that online retail demands. We handle the shipping so you can focus on selling." },
                  { title: "Food & Beverage", desc: "Temperature-controlled and dry freight for food manufacturers and distributors. We coordinate both refrigerated and dry van capacity to match your product requirements." },
                  { title: "Construction", desc: "Building materials, equipment, and supplies delivered to job sites on schedule. We handle oversized loads, flatbed coordination, and multi-drop deliveries across active project sites." },
                  { title: "Pharmaceutical", desc: "Secure, reliable transportation for pharmaceutical products and medical supplies. We work with carriers who maintain the compliance and handling standards your products require." },
                ].map((industry) => (
                  <Card key={industry.title}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{industry.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{industry.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Cost Savings */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">How 3PL Saves You Money</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Volume-Based Rates</h3>
                      <p className="text-gray-600">Because we aggregate freight volume from many shippers, we negotiate carrier rates that individual companies typically cannot access on their own. You benefit from our buying power without committing to minimum volume guarantees.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Optimized Routing</h3>
                      <p className="text-gray-600">Our logistics team analyzes your shipping lanes and identifies opportunities to consolidate loads, eliminate empty miles, and select the most efficient routes. Small improvements in routing efficiency compound into significant savings over time.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Reduced Overhead</h3>
                      <p className="text-gray-600">Eliminate the cost of maintaining an in-house logistics department, transportation management software, carrier contracts, and compliance monitoring. A 3PL replaces those fixed costs with a variable, per-shipment model that scales with your business.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Fewer Claims and Delays</h3>
                      <p className="text-gray-600">Vetted carriers, proper load planning, and proactive monitoring reduce the frequency of damage claims, missed appointments, and service failures. Prevention is always less expensive than recovery.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why DeMar */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose DeMar Transportation as Your 3PL Partner</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  DeMar Transportation is not a faceless logistics corporation. We are a Reno, Nevada-based company that builds real relationships with every client. When you call us, you reach a person who knows your account, your freight, and your priorities. That level of personal attention is rare in an industry that has trended toward automation and call centers.
                </p>
                <p>
                  What sets us apart is the combination of our own fleet assets and our broker authority. As an asset-based carrier, we have skin in the game and understand what it takes to move freight safely and on time. As a licensed broker, we can tap into a nationwide carrier network to find the right equipment, capacity, and pricing for any shipment. This dual capability gives you the reliability of an asset carrier with the flexibility of a full-service brokerage.
                </p>
                <p>
                  Transparency is a core value. We provide honest rate quotes, realistic transit estimates, and straightforward communication when things do not go as planned. No hidden fees, no vague delivery windows, no excuses. We also offer complementary services including <Link to="/services/warehousing" className="text-primary hover:underline">warehousing and distribution</Link>, <Link to="/services/dry-van" className="text-primary hover:underline">dry van shipping</Link>, <Link to="/services/reefer" className="text-primary hover:underline">refrigerated transport</Link>, and <Link to="/services/flatbed" className="text-primary hover:underline">flatbed hauling</Link> to cover every aspect of your logistics needs under one roof.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 bg-gradient-to-r from-primary to-blue-700 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-3xl font-bold mb-4">Ready to Simplify Your Supply Chain?</h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Let DeMar Transportation manage your logistics so you can focus on what you do best. Contact us today for a free consultation and discover how our 3PL services can reduce costs, improve reliability, and give you complete visibility into your freight operations.
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

export default ThirdPartyLogistics;
