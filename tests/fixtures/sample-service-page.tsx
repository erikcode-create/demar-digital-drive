import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Truck, Phone, Package, ArrowRight, CheckCircle } from "lucide-react";

const SampleServicePage = () => {
  useEffect(() => {
    document.title = "Sample Freight Service | Test Fixture | DeMar Transportation";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "DeMar Transportation sample service page fixture for testing. Covers freight shipping services from Reno, NV. Get a free quote at (775) 230-4767."
      );
    }
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Sample Freight Service",
    provider: {
      "@type": "LocalBusiness",
      name: "DeMar Transportation",
      address: {
        "@type": "PostalAddress",
        streetAddress: "10471 Double R Blvd",
        addressLocality: "Reno",
        addressRegion: "NV",
        postalCode: "89521",
        addressCountry: "US",
      },
      telephone: "(775) 230-4767",
      email: "info@DeMarTransportation.com",
    },
    serviceType: "Freight Shipping",
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    description:
      "Professional freight shipping services for full truckload and LTL freight across the continental United States.",
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
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://demartransportation.com/",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Services",
                    item: "https://demartransportation.com/",
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: "Sample Freight Service",
                    item: "https://demartransportation.com/services/sample",
                  },
                ],
              }),
            }}
          />

          {/* Hero */}
          <section className="pt-32 pb-20 px-4 bg-[hsl(225_97%_4%)] relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                backgroundSize: "40px 40px",
              }}
            />
            <div className="max-w-5xl mx-auto relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/5 backdrop-blur-sm">
                <Truck className="h-4 w-4 text-[hsl(var(--accent))]" />
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
                  Freight Services
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                Sample Freight
                <br />
                <span className="text-white/40">Service Fixture</span>
              </h1>
              <p className="text-lg text-white/60 max-w-2xl mb-10 leading-relaxed">
                Reliable freight transportation across the continental United States. Safe,
                on time, and at competitive rates from our Reno, NV base.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/quote" className="group">
                    Get a Free Quote
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

          {/* Overview */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Overview
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                What Is This Freight Service?
              </h2>
              <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl">
                <p>
                  This is a sample service page used as a test fixture. It mirrors the structure
                  of real service pages such as Dry Van, Reefer, and Flatbed shipping pages on
                  the DeMar Transportation website. Unit tests use this fixture to verify that
                  pages contain required elements like CTA links, phone numbers, images with alt
                  text, and proper meta tags.
                </p>
                <p>
                  DeMar Transportation is based in Reno, Nevada and serves businesses across
                  the Western United States and beyond. Our fleet includes dry van, reefer,
                  flatbed, and sprinter van equipment to handle virtually any freight type.
                </p>
                <p>
                  Every shipment gets a dedicated account contact, real-time tracking, and
                  all-in pricing with no hidden fees. We respond to quote requests within one
                  business hour during office hours, Monday through Friday, 7:00 AM to 6:00 PM PST.
                </p>
              </div>
            </div>
          </section>

          {/* Service Image */}
          <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Equipment
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-10">
                Our Fleet
              </h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <img
                  src="/images/services/sample-fleet.jpg"
                  alt="DeMar Transportation freight truck fleet ready for shipment"
                  className="rounded-xl w-full object-cover"
                  width={600}
                  height={400}
                />
                <div className="space-y-5 text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
                  <p>
                    Our modern fleet is maintained to the highest safety standards and equipped
                    with GPS tracking on every unit. Drivers are fully licensed, DOT-compliant,
                    and experienced on Western US lanes.
                  </p>
                  <p>
                    DOT Number: 4392091. Fully insured with cargo liability coverage on every load.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Advantages
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-10">
                Why Ship With DeMar?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "No Minimum Requirements",
                    desc: "Ship once a year or once a day — you get the same pricing and service level regardless of volume.",
                  },
                  {
                    title: "Real-Time Tracking",
                    desc: "GPS tracking on every load so you always know where your freight is and when it will arrive.",
                  },
                  {
                    title: "All-In Pricing",
                    desc: "Quotes include fuel surcharges and standard accessorials. No surprise invoices after delivery.",
                  },
                  {
                    title: "Western US Expertise",
                    desc: "Based in Reno, NV — we know the lanes, weather, and delivery challenges across Western states better than national carriers.",
                  },
                ].map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-4">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--accent))] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-[hsl(var(--accent))]">
            <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-2xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
                Ready to Ship?
              </h2>
              <p className="text-base text-[hsl(var(--primary))]/70 mb-8 max-w-md mx-auto">
                Get your freight quote today. Our specialists are standing by to help.
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
                DeMar Transportation | 10471 Double R Blvd, Reno, NV 89521 |
                info@DeMarTransportation.com
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default SampleServicePage;
