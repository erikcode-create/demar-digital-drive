import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Wrench, Phone, ShieldCheck, AlertTriangle, FileText, CheckCircle, Flame, ArrowRight } from "lucide-react";

const Hazmat = () => {
  useEffect(() => {
    document.title = "Hazmat & Fuel Transportation Services | Certified Hazardous Materials Shipping | DeMar Transportation";
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
                    "name": "Hazmat Transportation",
                    "item": "https://demartransportation.com/services/hazmat"
                  }
                ]
              }),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Service",
                "name": "Hazmat & Fuel Transportation",
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
                "serviceType": "Hazardous Materials Transportation",
                "areaServed": {
                  "@type": "Country",
                  "name": "United States"
                },
                "description": "Licensed and certified hazardous materials transportation including fuel hauling. Class 1-9 hazmat transport in compliance with 49 CFR regulations.",
                "dateModified": "2026-04-05"
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
                <ShieldCheck className="h-4 w-4 text-[hsl(var(--accent))]" />
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
                  Certified & Compliant
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                Hazmat & Fuel
                <br />
                <span className="text-white/40">Transportation</span>
              </h1>
              <p className="text-lg text-white/60 max-w-2xl mb-10 leading-relaxed">
                Certified hazardous materials transportation with fully compliant drivers, equipment, and documentation. From fuel hauling to chemical transport, DeMar Transportation handles your most sensitive freight with the expertise and safety protocols the job demands.
              </p>
              <p className="text-sm text-white/50 max-w-2xl leading-relaxed mt-4">
                DeMar Transportation is licensed and certified for hazardous materials transportation including fuel tanker hauling. All hazmat drivers carry current HazMat endorsements and complete DOT-required training for Class 1 through Class 9 materials in compliance with 49 CFR regulations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/quote" className="group">
                    Request a Hazmat Quote
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

          {/* What is Hazmat Transportation */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Overview
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                What Is Hazmat Transportation?
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl">
                <p>
                  Hazmat transportation is the movement of hazardous materials by ground, air, rail, or water in compliance with the regulations established by the U.S. Department of Transportation (DOT) under Title 49 of the Code of Federal Regulations (49 CFR). Hazardous materials are substances that pose a risk to health, safety, property, or the environment during transport. This broad category includes flammable liquids, corrosive chemicals, compressed gases, explosives, radioactive materials, toxic substances, and many other product types that require specialized handling procedures.
                </p>
                <p>
                  The hazmat transportation industry is one of the most heavily regulated sectors in freight logistics. Every aspect of a hazmat shipment is governed by federal law, from the packaging and labeling of materials to the training and certification of drivers, the placarding of vehicles, and the documentation that must accompany each load. These regulations exist to protect drivers, the public, and the environment from the consequences of accidental release or exposure during transit.
                </p>
                <p>
                  DeMar Transportation provides hazmat shipping services for a wide range of hazardous materials, with particular expertise in fuel hauling and petroleum product transportation. Our drivers hold current hazmat endorsements, our equipment meets all DOT specifications, and our safety management systems are designed to exceed minimum regulatory requirements.
                </p>
              </div>
            </div>
          </section>

          {/* DOT Hazmat Classifications */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Classifications
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                DOT Hazmat Classifications
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl leading-relaxed">
                The Department of Transportation classifies hazardous materials into nine primary classes based on the type of hazard they present. Understanding these classifications is essential for proper packaging, labeling, placarding, and transportation compliance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { cls: "Class 1", name: "Explosives", detail: "Dynamite, detonators, fireworks, ammunition, and other materials capable of producing an explosion or pyrotechnic effect." },
                  { cls: "Class 2", name: "Gases", detail: "Compressed, liquefied, or dissolved gases including propane, oxygen, acetylene, and aerosol products." },
                  { cls: "Class 3", name: "Flammable Liquids", detail: "Gasoline, diesel fuel, ethanol, acetone, paint thinners, and other liquids with a flash point below 141 degrees Fahrenheit." },
                  { cls: "Class 4", name: "Flammable Solids", detail: "Matches, sulfur, magnesium, and other solids that are easily ignited or may cause fire through friction or self-reaction." },
                  { cls: "Class 5", name: "Oxidizers & Organic Peroxides", detail: "Ammonium nitrate, hydrogen peroxide, and substances that release oxygen and intensify combustion." },
                  { cls: "Class 6", name: "Toxic & Infectious Substances", detail: "Pesticides, medical waste, biological specimens, and materials that are harmful or fatal if inhaled, ingested, or absorbed." },
                  { cls: "Class 7", name: "Radioactive Materials", detail: "Medical isotopes, industrial gauges, and nuclear fuel assemblies requiring specialized shielding and handling." },
                  { cls: "Class 8", name: "Corrosives", detail: "Battery acid, sulfuric acid, sodium hydroxide, and materials that cause visible destruction to skin or corrode metals." },
                  { cls: "Class 9", name: "Miscellaneous Dangerous Goods", detail: "Lithium batteries, dry ice, magnetized materials, and environmentally hazardous substances not covered by other classes." }
                ].map((item) => (
                  <div key={item.cls} className="p-5 rounded-xl bg-[hsl(var(--surface))] hover:bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-[hsl(var(--accent))]" />
                      <h3 className="text-sm font-semibold text-[hsl(var(--primary))]">{item.cls}: {item.name}</h3>
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Fuel Hauling Services */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Fuel Hauling
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                Fuel Hauling Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
                  <p>
                    Fuel transportation is one of the most critical segments of the hazmat industry. Gas stations, airports, construction sites, mining operations, and agricultural facilities all depend on regular, reliable fuel deliveries to maintain operations. A disruption in fuel supply can halt entire industries, making the reliability of fuel hauling services a matter of economic importance.
                  </p>
                  <p>
                    DeMar Transportation provides dedicated fuel hauling services across the western United States. Our tanker fleet and qualified carrier partners transport gasoline, diesel fuel, jet fuel (Jet-A), heating oil, biodiesel, and other petroleum products. Every fuel haul is managed with strict adherence to DOT and EPA regulations, including proper loading procedures, vapor recovery protocols, and spill prevention measures.
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    { fuel: "Gasoline (All Grades)", detail: "Regular, mid-grade, and premium gasoline for retail stations, fleet fueling operations, and emergency supply." },
                    { fuel: "Diesel Fuel (ULSD)", detail: "Ultra-low sulfur diesel for commercial fleets, construction equipment, and agricultural machinery." },
                    { fuel: "Jet Fuel (Jet-A)", detail: "Aviation fuel for regional airports, FBOs, and military installations requiring certified delivery." },
                    { fuel: "Heating Oil & Biodiesel", detail: "Residential and commercial heating fuel, as well as biodiesel blends for eco-conscious operators." }
                  ].map((item) => (
                    <div key={item.fuel} className="p-5 rounded-xl bg-[hsl(var(--surface-low))] hover:bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <Flame className="h-4 w-4 text-[hsl(var(--accent))]" />
                        <h3 className="text-sm font-semibold text-[hsl(var(--primary))]">{item.fuel}</h3>
                      </div>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Certifications & Safety */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Certifications & Safety
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                Required Certifications & Driver Qualifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <p className="text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
                    Hazmat transportation demands the highest level of driver qualification in the trucking industry. Federal and state regulations impose multiple layers of certification, training, and background verification before a driver is authorized to transport hazardous materials on public roads.
                  </p>
                  <div className="space-y-4">
                    {[
                      { title: "CDL with HazMat Endorsement (H)", description: "All hazmat drivers must hold a valid Commercial Driver's License with a HazMat endorsement, obtained by passing a written knowledge test and undergoing a TSA-administered security threat assessment including fingerprinting and criminal background check." },
                      { title: "Tanker Endorsement (N)", description: "Drivers transporting liquid hazmat in cargo tanks require an additional tanker endorsement, demonstrating knowledge of liquid surge dynamics, rollover prevention, and proper loading and unloading procedures." },
                      { title: "TWIC Card", description: "The Transportation Worker Identification Credential, issued by the TSA, provides biometric-verified access to secure port facilities and is required for drivers hauling hazmat to or from maritime terminals and certain government installations." },
                      { title: "Hazmat Training (49 CFR 172.704)", description: "Federal regulation mandates initial and recurrent hazmat training covering general awareness, function-specific procedures, safety protocols, and security awareness. Training must be documented and refreshed every three years." }
                    ].map((cert) => (
                      <div key={cert.title} className="flex items-start gap-4">
                        <ShieldCheck className="h-5 w-5 text-[hsl(var(--accent))] mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-1">{cert.title}</h3>
                          <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{cert.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[hsl(var(--primary))] tracking-tight mb-6">Safety Protocols</h3>
                  <div className="space-y-4">
                    {[
                      { title: "Vehicle Placarding", description: "All hazmat vehicles display DOT-compliant diamond placards identifying the hazard class of materials being transported. Placards are visible from all four sides of the vehicle and are selected based on the specific UN identification number and hazard class of the cargo." },
                      { title: "Emergency Response Plans", description: "Every hazmat shipment is accompanied by emergency response information as required by 49 CFR 172.602, including the material's hazards, immediate precautions, fire and spill response procedures, and first aid measures." },
                      { title: "Spill Kits & PPE", description: "Hazmat vehicles carry DOT-required spill containment kits, personal protective equipment, fire extinguishers, and absorbent materials appropriate for the class of material being transported." },
                      { title: "Pre-Trip Inspections", description: "Drivers perform comprehensive pre-trip inspections of the vehicle, cargo containment systems, placarding, and emergency equipment before every hazmat load. These inspections are documented and retained as part of the safety compliance record." }
                    ].map((protocol) => (
                      <div key={protocol.title} className="p-5 rounded-xl bg-[hsl(var(--surface))] hover:bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300">
                        <h4 className="text-sm font-semibold text-[hsl(var(--primary))] mb-2">{protocol.title}</h4>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{protocol.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Regulatory Compliance */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Compliance
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                Regulatory Compliance
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl mb-10">
                Hazmat transportation is governed by an overlapping framework of federal regulations administered by multiple agencies. DeMar Transportation maintains full compliance with all applicable regulations and conducts regular internal audits to ensure our operations meet or exceed legal requirements.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: FileText, title: "49 CFR (DOT)", desc: "Title 49 of the Code of Federal Regulations is the primary body of law governing hazmat transport. It covers classification, packaging, marking, labeling, placarding, shipping papers, training requirements, and incident reporting for all hazardous materials moving in commerce." },
                  { icon: FileText, title: "FMCSA", desc: "The Federal Motor Carrier Safety Administration regulates the motor carriers and drivers involved in hazmat transportation. FMCSA enforces hours-of-service rules, drug and alcohol testing programs, driver qualification files, and vehicle maintenance standards for hazmat carriers." },
                  { icon: FileText, title: "EPA", desc: "The Environmental Protection Agency regulates the handling and transport of environmentally hazardous substances under RCRA, CERCLA, and the Clean Water Act. Fuel haulers must comply with Spill Prevention, Control, and Countermeasure (SPCC) plans and report any releases to the National Response Center." },
                ].map((item) => (
                  <div key={item.title} className="p-6 rounded-xl bg-white shadow-[var(--shadow-card)]">
                    <div className="flex items-center gap-2 mb-3">
                      <item.icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                      <h3 className="text-base font-semibold text-[hsl(var(--primary))]">{item.title}</h3>
                    </div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Insurance & Why Choose DeMar */}
          <section className="py-20 px-4 bg-[hsl(225_97%_4%)]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Why DeMar
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">Insurance & Liability Coverage</h2>
                  <div className="space-y-5 text-base text-white/60 leading-relaxed">
                    <p>
                      Federal law requires motor carriers transporting hazardous materials to maintain significantly higher levels of liability insurance than standard freight carriers. The minimum financial responsibility for hazmat carriers ranges from $1 million to $5 million depending on the class and quantity of materials being transported, as specified in 49 CFR Part 387.
                    </p>
                    <p>
                      DeMar Transportation and our carrier network maintain comprehensive insurance coverage that meets or exceeds all federal minimums. This includes auto liability, cargo insurance, pollution liability, and umbrella coverage. Certificates of insurance are available upon request for any shipment.
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">Why Choose DeMar for Hazmat</h2>
                  <div className="space-y-4">
                    {[
                      "Fully certified hazmat drivers with current endorsements and clean safety records",
                      "Comprehensive DOT compliance management and documentation",
                      "Access to a nationwide network of hazmat-qualified carriers",
                      "Dedicated logistics coordinators experienced in hazmat shipping requirements",
                      "24/7 dispatch availability for urgent and emergency hazmat shipments",
                      "Fuel hauling expertise across the western United States",
                      "Transparent pricing with no hidden regulatory surcharges"
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-[hsl(var(--accent))] mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-white/60 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related Resources */}
          <section className="py-16 bg-[hsl(var(--surface-low))]">
            <div className="container mx-auto px-4 max-w-5xl">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Learn More
              </p>
              <h2 className="text-3xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                Related Resources
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "How to Ship Hazardous Materials", description: "DOT regulations and compliance guide", to: "/resources/how-to-ship-hazardous-materials" },
                  { title: "How to Choose a Freight Carrier", description: "Checklist for evaluating carriers", to: "/resources/how-to-choose-freight-carrier" },
                  { title: "Freight Shipping Terms Glossary", description: "50+ logistics terms defined", to: "/resources/freight-shipping-glossary" },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="group p-5 rounded-xl bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)] transition-all duration-300"
                  >
                    <h3 className="text-sm font-semibold text-[hsl(var(--primary))] mb-1 group-hover:text-[hsl(var(--accent))] transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{link.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-[hsl(var(--accent))]">
            <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-2xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
                Request a Hazmat Transportation Quote
              </h2>
              <p className="text-base text-[hsl(var(--primary))]/70 mb-8 max-w-md mx-auto">
                Shipping hazardous materials requires a carrier you can trust. Contact DeMar Transportation to discuss your hazmat freight requirements with a qualified logistics professional.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]/90 font-semibold"
                  asChild
                >
                  <Link to="/quote" className="group">
                    Request a Hazmat Quote
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
                <Link to="/services/sprinter-van" className="text-[hsl(var(--primary))]/70 hover:text-[hsl(var(--primary))] underline text-sm transition-colors">
                  Sprinter Van Services
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

export default Hazmat;
