import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Thermometer, Phone, ArrowRight, CheckCircle, AlertTriangle, Snowflake } from "lucide-react";

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
                    "item": "https://demartransportation.com/"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Refrigerated Shipping",
                    "item": "https://demartransportation.com/services/reefer"
                  }
                ]
              }),
            }}
          />

          {/* Hero */}
          <section className="pt-32 pb-20 px-4 bg-[hsl(225_97%_4%)] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }} />
            <div className="max-w-5xl mx-auto relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/5 backdrop-blur-sm">
                <Snowflake className="h-4 w-4 text-[hsl(var(--accent))]" />
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
                  Temperature-Controlled
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                Refrigerated
                <br />
                <span className="text-white/40">Shipping Services</span>
              </h1>
              <p className="text-lg text-white/60 max-w-2xl mb-10 leading-relaxed">
                FSMA-compliant, temperature-controlled freight transportation for perishable goods, pharmaceuticals, and temperature-sensitive products. DeMar Transportation keeps your cold chain intact from origin to destination.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/quote" className="group">
                    Get a Reefer Quote
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

          {/* What is Reefer */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Overview
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                What Is Reefer Shipping?
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl">
                <p>
                  Reefer shipping -- short for refrigerated shipping -- uses specially equipped trailers with built-in cooling and heating systems to maintain precise temperature conditions throughout transit. Unlike standard <Link to="/services/dry-van" className="text-[hsl(var(--accent))] hover:underline">dry van trailers</Link>, reefer units contain a self-powered refrigeration unit (typically diesel-driven) mounted on the front wall of the trailer that circulates conditioned air to keep cargo within a specified temperature range.
                </p>
                <p>
                  Temperature-controlled transportation is critical for any product that can spoil, degrade, or lose efficacy when exposed to temperatures outside its safe storage range. This includes fresh and frozen foods, dairy products, floral shipments, pharmaceuticals, certain chemicals, and biological materials. A break in the cold chain -- even a brief temperature excursion -- can render an entire truckload worthless and create food safety or regulatory compliance risks.
                </p>
                <p>
                  At DeMar Transportation, we coordinate reefer shipments through our vetted carrier network of qualified refrigerated carriers. Every reefer carrier in our network maintains properly serviced and calibrated refrigeration equipment, and we verify temperature settings and monitoring capabilities before dispatching any load. Our goal is simple: your temperature-sensitive freight arrives at its destination in the same condition it left the shipper's dock.
                </p>
              </div>
            </div>
          </section>

          {/* Temperature Ranges */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Specifications
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                Temperature Ranges We Support
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl leading-relaxed">
                Modern reefer trailers can maintain temperatures across a wide spectrum. The correct setting depends entirely on the commodity being transported, and our team will confirm the appropriate temperature requirements with you before every shipment.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: Snowflake, value: "-20\u00B0F to 0\u00B0F", label: "Frozen", desc: "Deep-frozen cargo including ice cream, frozen meals, frozen vegetables, seafood, and other products requiring consistent sub-zero temperatures. Carriers maintain continuous run on the refrigeration unit with no defrost cycles during transit for ultra-sensitive frozen goods." },
                  { icon: Thermometer, value: "32\u00B0F to 40\u00B0F", label: "Chilled", desc: "Fresh produce, dairy products, deli items, fresh meat and poultry, eggs, and beverages. This is the most common reefer temperature range and requires precise control to prevent freezing on the low end or bacterial growth on the high end." },
                  { icon: Thermometer, value: "55\u00B0F to 70\u00B0F", label: "Climate-Controlled", desc: "Pharmaceuticals, cosmetics, chocolate, confections, wine, candles, and other products that must not be exposed to extreme heat or cold. Climate-controlled loads often require both heating and cooling capability depending on ambient conditions." },
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
            </div>
          </section>

          {/* Common Cargo */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                What We Ship
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                What We Ship in Reefer Trailers
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl leading-relaxed">
                Refrigerated transportation serves industries where product integrity depends on unbroken temperature control. Here are the commodity types we most frequently handle:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { title: "Fresh Produce", desc: "Fruits, vegetables, salad mixes, and herbs from farms and packing houses to distribution centers and grocery retailers. Seasonal volume surges require flexible capacity." },
                  { title: "Dairy Products", desc: "Milk, cheese, yogurt, butter, and cream. These high-value perishables demand strict temperature adherence and timely delivery to prevent spoilage and product loss." },
                  { title: "Meat & Poultry", desc: "Fresh and frozen cuts of beef, pork, chicken, and turkey. USDA-inspected facilities require carriers to maintain documented temperature logs throughout transit." },
                  { title: "Pharmaceuticals", desc: "Temperature-sensitive medications, vaccines, biologics, and clinical trial materials. Pharmaceutical shipments often require validated temperature recorders and chain-of-custody documentation." },
                  { title: "Flowers & Plants", desc: "Cut flowers, live plants, and floral arrangements from growers to wholesalers and event venues. These shipments are highly time-sensitive and require gentle handling in addition to temperature control." },
                  { title: "Frozen Foods", desc: "Frozen entrees, pizzas, ice cream, frozen desserts, and frozen ingredients. Maintaining -10\u00B0F or below throughout transit is essential to preserve texture, flavor, and food safety." },
                ].map((cargo) => (
                  <div key={cargo.title} className="p-5 rounded-xl bg-[hsl(var(--surface-low))] hover:bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Snowflake className="h-4 w-4 text-[hsl(var(--accent))]" />
                      <h3 className="text-sm font-semibold text-[hsl(var(--primary))]">{cargo.title}</h3>
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{cargo.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FSMA Compliance */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Compliance
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                FSMA Compliance and Food Safety
              </h2>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
                  <p>
                    The Food Safety Modernization Act (FSMA) Sanitary Transportation Rule, enforced by the FDA, establishes requirements for shippers, carriers, and brokers involved in transporting human and animal food. Compliance is not optional -- it is a federal mandate that affects every participant in the food transportation chain.
                  </p>
                  <p>
                    DeMar Transportation takes FSMA compliance seriously. We work exclusively with carriers who meet or exceed the following standards:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Properly maintained and pre-cooled refrigeration equipment",
                      "Documented sanitation procedures for trailer interiors between loads",
                      "Temperature monitoring and recording throughout transit",
                      "Written procedures for handling temperature excursions",
                      "Driver training on food safety requirements and proper pre-trip reefer inspection",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[hsl(var(--accent))] mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:w-80">
                  <div className="p-6 rounded-xl bg-[hsl(var(--accent))]/10">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-[hsl(var(--accent))]" />
                      <h3 className="text-sm font-semibold text-[hsl(var(--primary))]">Pre-Cool Requirement</h3>
                    </div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                      All reefer trailers must be pre-cooled to the specified set-point temperature before loading begins. DeMar Transportation verifies pre-cool status and reefer unit functionality with every carrier prior to dispatch. We do not permit loading into trailers that have not reached the target temperature.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Real-Time Monitoring */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Visibility
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                Real-Time Temperature Monitoring
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl">
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
          <section className="py-20 px-4 bg-[hsl(225_97%_4%)]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Why DeMar
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-8">
                Why Choose DeMar for Reefer Shipping
              </h2>
              <div className="space-y-5 text-base text-white/60 leading-relaxed max-w-3xl">
                <p>
                  Refrigerated freight demands a higher level of attention than standard dry van shipping. Equipment must be inspected and verified. Temperatures must be confirmed and monitored. Transit times must be tight. At DeMar Transportation, we understand that when you ship perishable goods, there is no room for error.
                </p>
                <p>
                  Our team has direct experience coordinating reefer loads across every major produce corridor, dairy belt, and protein distribution lane in the country. We know which carriers specialize in frozen versus fresh, which routes present seasonal challenges, and how to plan for the unexpected. Every reefer shipment gets a dedicated point of contact who monitors the load from dispatch through delivery confirmation.
                </p>
                <p>
                  We also offer <Link to="/services/dry-van" className="text-[hsl(var(--accent))] hover:underline">dry van shipping</Link> for your non-temperature-sensitive freight and <Link to="/services/flatbed" className="text-[hsl(var(--accent))] hover:underline">flatbed transportation</Link> for oversized or open-deck cargo, giving you a single logistics partner for all your shipping needs.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-[hsl(var(--accent))]">
            <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-2xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
                Protect Your Cold Chain. Get a Reefer Quote Today.
              </h2>
              <p className="text-base text-[hsl(var(--primary))]/70 mb-8 max-w-md mx-auto">
                Whether you are shipping a full truckload of frozen goods or a climate-controlled pharmaceutical load, our team will match you with a qualified reefer carrier and provide a competitive rate.
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

export default Reefer;
