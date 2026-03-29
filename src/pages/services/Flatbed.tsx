import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LandstarSidebar from "@/components/LandstarSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Phone, ShieldCheck, ArrowRight, CheckCircle, AlertTriangle, Ruler, Weight } from "lucide-react";

const Flatbed = () => {
  useEffect(() => {
    document.title = "Flatbed Trucking & Heavy Haul Shipping | Step Deck & Lowboy | DeMar Transportation";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "DeMar Transportation offers flatbed, step-deck, and lowboy shipping for steel, lumber, machinery, and oversized loads. FMCSA-compliant securement. Get a flatbed freight quote from Reno, NV.");
    }
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Flatbed Shipping",
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
    "serviceType": "Flatbed Freight Shipping",
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "description": "Professional flatbed, step-deck, and lowboy trucking services for oversized, heavy, and open-deck freight across the United States."
  };

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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />

          {/* Hero Section */}
          <section className="bg-gradient-to-br from-amber-900 via-orange-900 to-slate-800 text-white py-20 px-4">
            <div className="max-w-5xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 text-sm">
                <Weight className="w-4 h-4 mr-1" /> Open-Deck Specialists
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Flatbed Shipping Services
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Professional open-deck freight transportation for steel, lumber, machinery, construction materials, and oversized loads. DeMar Transportation provides flatbed, step-deck, and lowboy capacity nationwide with FMCSA-compliant load securement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/quote">
                  <Button size="lg" className="text-lg px-8">
                    Get a Flatbed Quote <ArrowRight className="ml-2 w-5 h-5" />
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

          {/* What is Flatbed */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What Is Flatbed Shipping?</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  Flatbed shipping uses open-deck trailers -- trailers with a flat loading surface and no enclosed walls or roof -- to transport freight that cannot fit inside a standard <Link to="/services/dry-van" className="text-primary hover:underline">dry van trailer</Link> due to its size, shape, weight, or loading requirements. Flatbed trailers allow cargo to be loaded from the top, sides, or rear using cranes, forklifts, or other material handling equipment, making them essential for industries that move heavy, oversized, or irregularly shaped products.
                </p>
                <p>
                  Flatbed freight represents one of the most specialized segments of the trucking industry. Unlike enclosed trailers, flatbed loads require careful planning around securement methods, tarping requirements, permit regulations, and route surveys. The driver's skill in properly securing cargo is just as important as the equipment itself, which is why DeMar Transportation works exclusively with experienced flatbed carriers who understand the stakes involved.
                </p>
                <p>
                  Through our Landstar agency partnership, we access one of the largest flatbed carrier networks in North America. Landstar is widely recognized as an industry leader in open-deck transportation, with thousands of specialized flatbed owner-operators who haul steel, building materials, heavy equipment, and oversized freight every day.
                </p>
              </div>
            </div>
          </section>

          {/* Types of Flatbed Trailers */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Types of Flatbed Trailers</h2>
              <p className="text-gray-700 mb-8">
                Different cargo dimensions and weight profiles require different trailer configurations. DeMar Transportation has access to all major flatbed trailer types to match the right equipment to your specific load.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-t-4 border-t-amber-600">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Ruler className="w-5 h-5 text-amber-600" /> Standard Flatbed
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-600 space-y-2">
                    <p>The workhorse of open-deck shipping. Standard flatbeds are 48 or 53 feet long with a deck height of approximately 60 inches from the ground. Maximum payload is typically 48,000 pounds, and the flat, unobstructed deck allows for flexible loading configurations.</p>
                    <p className="text-sm"><span className="font-semibold">Best for:</span> Steel coils, lumber bundles, palletized building materials, large machinery, and most general flatbed freight.</p>
                  </CardContent>
                </Card>
                <Card className="border-t-4 border-t-amber-600">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Ruler className="w-5 h-5 text-amber-600" /> Step-Deck (Drop-Deck)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-600 space-y-2">
                    <p>Step-deck trailers feature a lower rear deck (approximately 38 to 42 inches high) with an upper front section. This design provides an additional 12 to 18 inches of vertical clearance compared to a standard flatbed, allowing taller loads to travel without exceeding the 13-foot-6-inch legal height limit.</p>
                    <p className="text-sm"><span className="font-semibold">Best for:</span> Tall machinery, industrial equipment, vehicles, HVAC units, and loads that exceed standard flatbed height limits.</p>
                  </CardContent>
                </Card>
                <Card className="border-t-4 border-t-amber-600">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Ruler className="w-5 h-5 text-amber-600" /> Double-Drop (Lowboy)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-600 space-y-2">
                    <p>Double-drop trailers have a center well that sits as low as 18 to 24 inches off the ground, providing maximum vertical clearance for the tallest and heaviest loads. The lowboy design is essential for transporting equipment that cannot be disassembled to reduce its height.</p>
                    <p className="text-sm"><span className="font-semibold">Best for:</span> Construction equipment (excavators, bulldozers), industrial generators, transformers, and extremely tall or heavy machinery.</p>
                  </CardContent>
                </Card>
                <Card className="border-t-4 border-t-amber-600">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Ruler className="w-5 h-5 text-amber-600" /> Conestoga
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-600 space-y-2">
                    <p>A Conestoga trailer combines the loading flexibility of a flatbed with the weather protection of an enclosed van. A retractable, rolling tarp system covers the cargo area and can be pulled back completely for top- or side-loading, then extended to fully enclose the freight during transit.</p>
                    <p className="text-sm"><span className="font-semibold">Best for:</span> Cargo that requires both crane/forklift loading and protection from weather, such as finished goods, coated steel, paper products, and moisture-sensitive building materials.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Common Cargo */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Common Flatbed Freight</h2>
              <p className="text-gray-700 mb-8">
                Flatbed trailers serve industries that move large, heavy, or unusually shaped products that enclosed trailers simply cannot accommodate. Here are the most common commodity types we transport on flatbed equipment:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "Steel & Metals", desc: "Steel coils, plate steel, structural beams, rebar, aluminum extrusions, and metal fabrications. Steel is the single largest commodity category in flatbed freight, and proper securement is critical given the extreme weight and shifting potential." },
                  { title: "Lumber & Building Materials", desc: "Dimensional lumber, plywood, OSB, trusses, roofing materials, and packaged building products. Lumber loads often require tarping to protect against moisture and are typically loaded with forklifts at the shipper's yard." },
                  { title: "Construction Equipment", desc: "Excavators, backhoes, skid steers, compactors, and other heavy equipment. These loads frequently require step-deck or lowboy trailers and may need permits for overweight or over-dimension transport." },
                  { title: "Industrial Machinery", desc: "CNC machines, presses, generators, compressors, turbines, and manufacturing equipment. Machinery shipments demand careful load planning, engineered tie-down points, and sometimes custom crating or blocking." },
                  { title: "Prefabricated Structures", desc: "Modular building components, wall panels, roof trusses, pre-cast concrete elements, and steel building frames. These loads are often over-width or over-height, requiring permits, escorts, and restricted travel times." },
                  { title: "Pipes & Tubing", desc: "Steel pipe, PVC pipe, ductile iron pipe, culvert, and tubing for oil and gas, water infrastructure, and construction projects. Pipe loads require specialized securement including pipe stakes or cradles to prevent rolling." },
                ].map((cargo) => (
                  <Card key={cargo.title} className="border-l-4 border-l-amber-600">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{cargo.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{cargo.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Load Securement */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Load Securement Standards</h2>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4 text-gray-700">
                  <p>
                    The Federal Motor Carrier Safety Administration (FMCSA) publishes detailed cargo securement rules under 49 CFR Part 393, Subparts I and J. These regulations specify the minimum number of tie-downs, the aggregate working load limit required, and commodity-specific securement methods for loads including logs, metal coils, concrete pipe, intermodal containers, and heavy vehicles.
                  </p>
                  <p>
                    Flatbed load securement is not a suggestion -- it is a legal requirement that is actively enforced by DOT inspectors at weigh stations and during roadside inspections. Violations carry significant fines and can result in the load being placed out of service until deficiencies are corrected.
                  </p>
                  <h3 className="text-xl font-semibold text-gray-900 mt-6">Securement Equipment We Require</h3>
                  <ul className="space-y-2">
                    {[
                      "Grade 70 transport chains with binders for steel, metal, and heavy equipment",
                      "4-inch ratchet straps rated at 5,400 lbs working load limit for general freight",
                      "Edge protectors and corner protectors to prevent strap damage and cargo abrasion",
                      "Lumber tarps (8-foot drop), steel tarps (6-foot drop), or smoke tarps as required by shipper",
                      "Coil racks, pipe stakes, and bulkheads for commodity-specific loads",
                      "Dunnage, blocking, and bracing materials for irregular-shaped cargo",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:w-80">
                  <Card className="bg-amber-50 border-amber-200">
                    <CardHeader>
                      <CardTitle className="flex items-center text-amber-800">
                        <AlertTriangle className="w-5 h-5 mr-2" /> Tarping Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-amber-900 text-sm space-y-2">
                      <p>
                        Many shippers require flatbed loads to be tarped to protect freight from rain, road spray, and debris. Tarping adds time and labor at the loading point, and rates should reflect this requirement. Always communicate tarping needs when requesting a quote so we can assign a carrier equipped with the correct tarp type and size.
                      </p>
                      <p>
                        Common tarp types include lumber tarps (8-foot drop), steel tarps (4 to 6-foot drop), smoke tarps (front-only coverage), and machinery tarps (custom-fitted covers).
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Oversized / Permits */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Oversized and Overweight Permit Handling</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  When your freight exceeds standard legal dimensions -- 8 feet 6 inches wide, 13 feet 6 inches tall, 53 feet long, or 80,000 pounds gross vehicle weight -- specialized permits are required from every state the load will pass through. Each state has its own permitting authority, fee structure, travel restrictions, and escort requirements, making oversized load logistics a complex undertaking.
                </p>
                <p>
                  DeMar Transportation handles the entire permit process for you. We work with professional permit services to secure single-trip or annual oversize/overweight permits, coordinate pilot car escorts when required, survey routes for bridge weight limits and vertical clearance restrictions, and schedule movements within permitted travel windows. Many states restrict oversize loads to daylight hours only and prohibit travel on holidays and weekends, so advance planning is essential.
                </p>
                <p>
                  For super loads -- shipments that exceed permit limits for standard oversize movement -- we coordinate with state DOT offices, utility companies, and law enforcement to plan the safest possible route with the fewest obstructions. Our experience with heavy haul and oversized freight across the western United States is a core strength of our flatbed operations.
                </p>
              </div>
            </div>
          </section>

          {/* Why DeMar */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose DeMar for Flatbed Shipping</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  Flatbed freight is inherently more complex than van freight. The equipment is more specialized, the securement requirements are more demanding, and the margin for error is smaller. A poorly secured flatbed load is not just a regulatory violation -- it is a serious safety hazard for the driver and every other vehicle on the road.
                </p>
                <p>
                  DeMar Transportation partners with Landstar, a company built on open-deck transportation. Landstar's flatbed capacity is among the deepest in the industry, with thousands of owner-operators who specialize exclusively in flatbed, step-deck, and heavy haul work. These are not van drivers pulling a flatbed trailer once in a while. They are career flatbed professionals who own the right equipment, carry the right securement gear, and know how to safely transport the commodities you ship.
                </p>
                <p>
                  From a single load of structural steel to a multi-load project moving construction equipment to a job site, DeMar Transportation has the flatbed capacity and operational expertise to execute safely and on schedule. We also handle <Link to="/services/dry-van" className="text-primary hover:underline">dry van</Link> and <Link to="/services/reefer" className="text-primary hover:underline">refrigerated</Link> shipments, so you can consolidate all your freight needs through one trusted partner.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 bg-gradient-to-r from-amber-700 to-orange-700 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-3xl font-bold mb-4">Need a Flatbed? Get Your Quote Today.</h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Describe your load -- dimensions, weight, origin, destination, and any special requirements -- and our flatbed specialists will provide a competitive rate and equipment recommendation. We handle everything from standard flatbed loads to complex oversized permits.
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

export default Flatbed;
