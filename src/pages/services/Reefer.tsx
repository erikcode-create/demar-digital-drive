import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LandstarSidebar from "@/components/LandstarSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Thermometer, Phone, ShieldCheck, ArrowRight, CheckCircle, AlertTriangle, Snowflake } from "lucide-react";

const Reefer = () => {
  useEffect(() => {
    document.title = "Refrigerated Shipping & Reefer Trucking | Temperature-Controlled Freight | DeMar Transportation";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "DeMar Transportation provides refrigerated (reefer) shipping with real-time temperature monitoring. FSMA-compliant carriers for produce, dairy, meat, pharmaceuticals. Get a reefer quote today.");
    }
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Refrigerated Shipping",
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
    "serviceType": "Refrigerated Freight Shipping",
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "description": "Temperature-controlled refrigerated trucking services for perishable goods, pharmaceuticals, and temperature-sensitive freight."
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
          <section className="bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-800 text-white py-20 px-4">
            <div className="max-w-5xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 text-sm">
                <Snowflake className="w-4 h-4 mr-1" /> Temperature-Controlled
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Refrigerated Shipping Services
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                FSMA-compliant, temperature-controlled freight transportation for perishable goods, pharmaceuticals, and temperature-sensitive products. DeMar Transportation keeps your cold chain intact from origin to destination.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/quote">
                  <Button size="lg" className="text-lg px-8">
                    Get a Reefer Quote <ArrowRight className="ml-2 w-5 h-5" />
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

          {/* What is Reefer */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What Is Reefer Shipping?</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  Reefer shipping -- short for refrigerated shipping -- uses specially equipped trailers with built-in cooling and heating systems to maintain precise temperature conditions throughout transit. Unlike standard <Link to="/services/dry-van" className="text-primary hover:underline">dry van trailers</Link>, reefer units contain a self-powered refrigeration unit (typically diesel-driven) mounted on the front wall of the trailer that circulates conditioned air to keep cargo within a specified temperature range.
                </p>
                <p>
                  Temperature-controlled transportation is critical for any product that can spoil, degrade, or lose efficacy when exposed to temperatures outside its safe storage range. This includes fresh and frozen foods, dairy products, floral shipments, pharmaceuticals, certain chemicals, and biological materials. A break in the cold chain -- even a brief temperature excursion -- can render an entire truckload worthless and create food safety or regulatory compliance risks.
                </p>
                <p>
                  At DeMar Transportation, we coordinate reefer shipments through Landstar's extensive network of qualified refrigerated carriers. Every reefer carrier in our network maintains properly serviced and calibrated refrigeration equipment, and we verify temperature settings and monitoring capabilities before dispatching any load. Our goal is simple: your temperature-sensitive freight arrives at its destination in the same condition it left the shipper's dock.
                </p>
              </div>
            </div>
          </section>

          {/* Temperature Ranges */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Temperature Ranges We Support</h2>
              <p className="text-gray-700 mb-8">
                Modern reefer trailers can maintain temperatures across a wide spectrum. The correct setting depends entirely on the commodity being transported, and our team will confirm the appropriate temperature requirements with you before every shipment.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-t-4 border-t-blue-500">
                  <CardHeader className="text-center">
                    <Snowflake className="w-10 h-10 mx-auto text-blue-500 mb-2" />
                    <CardTitle className="text-xl">Frozen</CardTitle>
                    <p className="text-3xl font-bold text-blue-600">-20&deg;F to 0&deg;F</p>
                  </CardHeader>
                  <CardContent className="text-gray-600">
                    <p>Deep-frozen cargo including ice cream, frozen meals, frozen vegetables, seafood, and other products requiring consistent sub-zero temperatures. Carriers maintain continuous run on the refrigeration unit with no defrost cycles during transit for ultra-sensitive frozen goods.</p>
                  </CardContent>
                </Card>
                <Card className="border-t-4 border-t-cyan-500">
                  <CardHeader className="text-center">
                    <Thermometer className="w-10 h-10 mx-auto text-cyan-500 mb-2" />
                    <CardTitle className="text-xl">Chilled</CardTitle>
                    <p className="text-3xl font-bold text-cyan-600">32&deg;F to 40&deg;F</p>
                  </CardHeader>
                  <CardContent className="text-gray-600">
                    <p>Fresh produce, dairy products, deli items, fresh meat and poultry, eggs, and beverages. This is the most common reefer temperature range and requires precise control to prevent freezing on the low end or bacterial growth on the high end.</p>
                  </CardContent>
                </Card>
                <Card className="border-t-4 border-t-amber-500">
                  <CardHeader className="text-center">
                    <Thermometer className="w-10 h-10 mx-auto text-amber-500 mb-2" />
                    <CardTitle className="text-xl">Climate-Controlled</CardTitle>
                    <p className="text-3xl font-bold text-amber-600">55&deg;F to 70&deg;F</p>
                  </CardHeader>
                  <CardContent className="text-gray-600">
                    <p>Pharmaceuticals, cosmetics, chocolate, confections, wine, candles, and other products that must not be exposed to extreme heat or cold. Climate-controlled loads often require both heating and cooling capability depending on ambient conditions.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Common Cargo */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Ship in Reefer Trailers</h2>
              <p className="text-gray-700 mb-8">
                Refrigerated transportation serves industries where product integrity depends on unbroken temperature control. Here are the commodity types we most frequently handle:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "Fresh Produce", desc: "Fruits, vegetables, salad mixes, and herbs from farms and packing houses to distribution centers and grocery retailers. Seasonal volume surges require flexible capacity." },
                  { title: "Dairy Products", desc: "Milk, cheese, yogurt, butter, and cream. These high-value perishables demand strict temperature adherence and timely delivery to prevent spoilage and product loss." },
                  { title: "Meat & Poultry", desc: "Fresh and frozen cuts of beef, pork, chicken, and turkey. USDA-inspected facilities require carriers to maintain documented temperature logs throughout transit." },
                  { title: "Pharmaceuticals", desc: "Temperature-sensitive medications, vaccines, biologics, and clinical trial materials. Pharmaceutical shipments often require validated temperature recorders and chain-of-custody documentation." },
                  { title: "Flowers & Plants", desc: "Cut flowers, live plants, and floral arrangements from growers to wholesalers and event venues. These shipments are highly time-sensitive and require gentle handling in addition to temperature control." },
                  { title: "Frozen Foods", desc: "Frozen entrees, pizzas, ice cream, frozen desserts, and frozen ingredients. Maintaining -10&deg;F or below throughout transit is essential to preserve texture, flavor, and food safety." },
                ].map((cargo) => (
                  <Card key={cargo.title} className="border-l-4 border-l-cyan-600">
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

          {/* FSMA Compliance */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">FSMA Compliance and Food Safety</h2>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4 text-gray-700">
                  <p>
                    The Food Safety Modernization Act (FSMA) Sanitary Transportation Rule, enforced by the FDA, establishes requirements for shippers, carriers, and brokers involved in transporting human and animal food. Compliance is not optional -- it is a federal mandate that affects every participant in the food transportation chain.
                  </p>
                  <p>
                    DeMar Transportation takes FSMA compliance seriously. We work exclusively with carriers who meet or exceed the following standards:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Properly maintained and pre-cooled refrigeration equipment",
                      "Documented sanitation procedures for trailer interiors between loads",
                      "Temperature monitoring and recording throughout transit",
                      "Written procedures for handling temperature excursions",
                      "Driver training on food safety requirements and proper pre-trip reefer inspection",
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
                        <AlertTriangle className="w-5 h-5 mr-2" /> Pre-Cool Requirement
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-amber-900 text-sm">
                      <p>
                        All reefer trailers must be pre-cooled to the specified set-point temperature before loading begins. DeMar Transportation verifies pre-cool status and reefer unit functionality with every carrier prior to dispatch. We do not permit loading into trailers that have not reached the target temperature.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Real-Time Monitoring */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Real-Time Temperature Monitoring</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  Visibility into your reefer shipment does not stop at location tracking. Through our carrier network, we provide real-time temperature monitoring that gives you and our dispatch team continuous insight into the conditions inside the trailer. If a temperature excursion occurs -- whether caused by equipment malfunction, a door left open, or an unexpected ambient temperature spike -- our team is alerted immediately and can take corrective action before product integrity is compromised.
                </p>
                <p>
                  Temperature data logs are available for every reefer shipment and can be provided upon delivery or upon request. For pharmaceutical and regulated food shipments, these records serve as critical documentation for quality assurance and regulatory compliance audits.
                </p>
              </div>
            </div>
          </section>

          {/* Why DeMar */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose DeMar for Reefer Shipping</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  Refrigerated freight demands a higher level of attention than standard dry van shipping. Equipment must be inspected and verified. Temperatures must be confirmed and monitored. Transit times must be tight. At DeMar Transportation, we understand that when you ship perishable goods, there is no room for error.
                </p>
                <p>
                  Our team has direct experience coordinating reefer loads across every major produce corridor, dairy belt, and protein distribution lane in the country. We know which carriers specialize in frozen versus fresh, which routes present seasonal challenges, and how to plan for the unexpected. Every reefer shipment gets a dedicated point of contact who monitors the load from dispatch through delivery confirmation.
                </p>
                <p>
                  We also offer <Link to="/services/dry-van" className="text-primary hover:underline">dry van shipping</Link> for your non-temperature-sensitive freight and <Link to="/services/flatbed" className="text-primary hover:underline">flatbed transportation</Link> for oversized or open-deck cargo, giving you a single logistics partner for all your shipping needs.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 bg-gradient-to-r from-cyan-700 to-blue-700 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-3xl font-bold mb-4">Protect Your Cold Chain. Get a Reefer Quote Today.</h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Whether you are shipping a full truckload of frozen goods or a climate-controlled pharmaceutical load, our team will match you with a qualified reefer carrier and provide a competitive rate. Contact us now.
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

export default Reefer;
