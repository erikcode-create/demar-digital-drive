import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Wrench, Phone, ShieldCheck, AlertTriangle, FileText, CheckCircle, Flame } from "lucide-react";

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
          {/* Hero Section */}
          <section className="bg-primary text-primary-foreground py-20 px-4">
            <div className="container mx-auto max-w-5xl">
              <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors mb-6">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <div className="flex items-center gap-4 mb-6">
                <Wrench className="h-12 w-12 text-accent" />
                <Badge variant="secondary" className="text-sm">Service Page</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Hazmat & Fuel Transportation
              </h1>
              <p className="text-xl text-primary-foreground/90 max-w-3xl">
                Certified hazardous materials transportation with fully compliant drivers, equipment, and documentation. From fuel hauling to chemical transport, DeMar Transportation handles your most sensitive freight with the expertise and safety protocols the job demands.
              </p>
            </div>
          </section>

          {/* What is Hazmat Transportation */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold text-primary mb-6">What Is Hazmat Transportation?</h2>
              <div className="prose max-w-none text-muted-foreground space-y-4">
                <p className="text-lg leading-relaxed">
                  Hazmat transportation is the movement of hazardous materials by ground, air, rail, or water in compliance with the regulations established by the U.S. Department of Transportation (DOT) under Title 49 of the Code of Federal Regulations (49 CFR). Hazardous materials are substances that pose a risk to health, safety, property, or the environment during transport. This broad category includes flammable liquids, corrosive chemicals, compressed gases, explosives, radioactive materials, toxic substances, and many other product types that require specialized handling procedures.
                </p>
                <p className="text-lg leading-relaxed">
                  The hazmat transportation industry is one of the most heavily regulated sectors in freight logistics. Every aspect of a hazmat shipment is governed by federal law, from the packaging and labeling of materials to the training and certification of drivers, the placarding of vehicles, and the documentation that must accompany each load. These regulations exist to protect drivers, the public, and the environment from the consequences of accidental release or exposure during transit.
                </p>
                <p className="text-lg leading-relaxed">
                  DeMar Transportation provides hazmat shipping services for a wide range of hazardous materials, with particular expertise in fuel hauling and petroleum product transportation. Our drivers hold current hazmat endorsements, our equipment meets all DOT specifications, and our safety management systems are designed to exceed minimum regulatory requirements.
                </p>
              </div>
            </div>
          </section>

          {/* DOT Hazmat Classifications */}
          <section className="py-16 px-4 bg-secondary">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold text-primary mb-4">DOT Hazmat Classifications</h2>
              <p className="text-lg text-muted-foreground mb-8">
                The Department of Transportation classifies hazardous materials into nine primary classes based on the type of hazard they present. Understanding these classifications is essential for proper packaging, labeling, placarding, and transportation compliance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <Card key={item.cls}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-primary flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-accent" />
                        {item.cls}: {item.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{item.detail}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Fuel Hauling Services */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold text-primary mb-6">Fuel Hauling Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-lg leading-relaxed">
                    Fuel transportation is one of the most critical segments of the hazmat industry. Gas stations, airports, construction sites, mining operations, and agricultural facilities all depend on regular, reliable fuel deliveries to maintain operations. A disruption in fuel supply can halt entire industries, making the reliability of fuel hauling services a matter of economic importance.
                  </p>
                  <p className="text-lg leading-relaxed">
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
                    <Card key={item.fuel}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base text-primary flex items-center gap-2">
                          <Flame className="h-4 w-4 text-accent" />
                          {item.fuel}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{item.detail}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Certifications & Safety */}
          <section className="py-16 px-4 bg-secondary">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold text-primary mb-8">Required Certifications & Driver Qualifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Hazmat transportation demands the highest level of driver qualification in the trucking industry. Federal and state regulations impose multiple layers of certification, training, and background verification before a driver is authorized to transport hazardous materials on public roads.
                  </p>
                  <div className="space-y-4">
                    {[
                      { title: "CDL with HazMat Endorsement (H)", description: "All hazmat drivers must hold a valid Commercial Driver's License with a HazMat endorsement, obtained by passing a written knowledge test and undergoing a TSA-administered security threat assessment including fingerprinting and criminal background check." },
                      { title: "Tanker Endorsement (N)", description: "Drivers transporting liquid hazmat in cargo tanks require an additional tanker endorsement, demonstrating knowledge of liquid surge dynamics, rollover prevention, and proper loading and unloading procedures." },
                      { title: "TWIC Card", description: "The Transportation Worker Identification Credential, issued by the TSA, provides biometric-verified access to secure port facilities and is required for drivers hauling hazmat to or from maritime terminals and certain government installations." },
                      { title: "Hazmat Training (49 CFR 172.704)", description: "Federal regulation mandates initial and recurrent hazmat training covering general awareness, function-specific procedures, safety protocols, and security awareness. Training must be documented and refreshed every three years." }
                    ].map((cert) => (
                      <div key={cert.title} className="flex gap-3">
                        <ShieldCheck className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold text-primary">{cert.title}</h3>
                          <p className="text-sm text-muted-foreground">{cert.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-6">Safety Protocols</h3>
                  <div className="space-y-4">
                    {[
                      { title: "Vehicle Placarding", description: "All hazmat vehicles display DOT-compliant diamond placards identifying the hazard class of materials being transported. Placards are visible from all four sides of the vehicle and are selected based on the specific UN identification number and hazard class of the cargo." },
                      { title: "Emergency Response Plans", description: "Every hazmat shipment is accompanied by emergency response information as required by 49 CFR 172.602, including the material's hazards, immediate precautions, fire and spill response procedures, and first aid measures." },
                      { title: "Spill Kits & PPE", description: "Hazmat vehicles carry DOT-required spill containment kits, personal protective equipment, fire extinguishers, and absorbent materials appropriate for the class of material being transported." },
                      { title: "Pre-Trip Inspections", description: "Drivers perform comprehensive pre-trip inspections of the vehicle, cargo containment systems, placarding, and emergency equipment before every hazmat load. These inspections are documented and retained as part of the safety compliance record." }
                    ].map((protocol) => (
                      <Card key={protocol.title}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base text-primary">{protocol.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{protocol.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Regulatory Compliance */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold text-primary mb-6">Regulatory Compliance</h2>
              <div className="prose max-w-none text-muted-foreground space-y-4">
                <p className="text-lg leading-relaxed">
                  Hazmat transportation is governed by an overlapping framework of federal regulations administered by multiple agencies. DeMar Transportation maintains full compliance with all applicable regulations and conducts regular internal audits to ensure our operations meet or exceed legal requirements.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-primary flex items-center gap-2">
                        <FileText className="h-5 w-5 text-accent" />
                        49 CFR (DOT)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Title 49 of the Code of Federal Regulations is the primary body of law governing hazmat transport. It covers classification, packaging, marking, labeling, placarding, shipping papers, training requirements, and incident reporting for all hazardous materials moving in commerce.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-primary flex items-center gap-2">
                        <FileText className="h-5 w-5 text-accent" />
                        FMCSA
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">The Federal Motor Carrier Safety Administration regulates the motor carriers and drivers involved in hazmat transportation. FMCSA enforces hours-of-service rules, drug and alcohol testing programs, driver qualification files, and vehicle maintenance standards for hazmat carriers.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-primary flex items-center gap-2">
                        <FileText className="h-5 w-5 text-accent" />
                        EPA
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">The Environmental Protection Agency regulates the handling and transport of environmentally hazardous substances under RCRA, CERCLA, and the Clean Water Act. Fuel haulers must comply with Spill Prevention, Control, and Countermeasure (SPCC) plans and report any releases to the National Response Center.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Insurance & Why Choose DeMar */}
          <section className="py-16 px-4 bg-secondary">
            <div className="container mx-auto max-w-5xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold text-primary mb-6">Insurance & Liability Coverage</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p className="text-lg leading-relaxed">
                      Federal law requires motor carriers transporting hazardous materials to maintain significantly higher levels of liability insurance than standard freight carriers. The minimum financial responsibility for hazmat carriers ranges from $1 million to $5 million depending on the class and quantity of materials being transported, as specified in 49 CFR Part 387.
                    </p>
                    <p className="text-lg leading-relaxed">
                      DeMar Transportation and our carrier network maintain comprehensive insurance coverage that meets or exceeds all federal minimums. This includes auto liability, cargo insurance, pollution liability, and umbrella coverage. Certificates of insurance are available upon request for any shipment.
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-primary mb-6">Why Choose DeMar for Hazmat</h2>
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
                      <div key={i} className="flex gap-3">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 bg-primary text-primary-foreground">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Request a Hazmat Transportation Quote</h2>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Shipping hazardous materials requires a carrier you can trust. Contact DeMar Transportation to discuss your hazmat freight requirements with a qualified logistics professional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild variant="hero" size="xl" className="animate-pulse-glow">
                  <Link to="/quote">Request a Hazmat Quote</Link>
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
                <Link to="/services/sprinter-van" className="text-primary-foreground/70 hover:text-primary-foreground underline text-sm transition-colors">
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
