import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import ResourcesPreview from "@/components/ResourcesPreview";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    document.title = "Freight Shipping Reno Nevada | DeMar Transportation | Nationwide Carrier";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'DeMar Transportation is a Reno, NV freight shipping carrier with USDOT 4392091. Dry van, reefer, flatbed, hazmat, LTL, and FTL shipping nationwide. 24/7 dispatch. Call (775) 230-4767.');
    }

    const existingLd = document.querySelectorAll('script[data-homepage-schema]');
    existingLd.forEach((el) => el.remove());

    const localBusiness = {
      "@context": "https://schema.org",
      "@type": "TransportationBusiness",
      "name": "DeMar Transportation",
      "telephone": "(775) 230-4767",
      "email": "info@DeMarTransportation.com",
      "url": "https://demartransportation.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "10471 Double R Blvd",
        "addressLocality": "Reno",
        "addressRegion": "NV",
        "postalCode": "89521",
        "addressCountry": "US"
      },
      "areaServed": {
        "@type": "Country",
        "name": "United States"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "07:00",
          "closes": "18:00"
        }
      ],
      "description": "Freight shipping carrier based in Reno, Nevada providing dry van, refrigerated, flatbed, hazmat, LTL, and FTL transportation services nationwide.",
      "identifier": {
        "@type": "PropertyValue",
        "name": "USDOT",
        "value": "4392091"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Freight Shipping Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Dry Van Shipping" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Refrigerated Freight" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Flatbed Shipping" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hazmat Freight" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "FTL Shipping" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "LTL Shipping" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "3PL Logistics" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Warehousing" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Box Truck Delivery" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sprinter Van / Expedited" } }
        ]
      }
    };

    const webSite = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "DeMar Transportation",
      "url": "https://demartransportation.com"
    };

    [localBusiness, webSite].forEach((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-homepage-schema", "true");
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      document.querySelectorAll('script[data-homepage-schema]').forEach((el) => el.remove());
    };
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
          <Hero />

          {/* Trust bar with authority credentials */}
          <section className="bg-muted/50 border-y" aria-label="Company credentials">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>USDOT 4392091</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Motor Carrier &amp; Freight Broker Authority</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Reno, NV - Nationwide Service</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.828a1 1 0 101.415-1.414L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>24/7 Dispatch Available</span>
                </div>
              </div>
            </div>
          </section>

          <Services />

          {/* Full service directory with all 10 services */}
          <section className="py-16 bg-background" aria-labelledby="service-directory-heading">
            <div className="container mx-auto px-4">
              <h2 id="service-directory-heading" className="text-3xl font-bold text-center mb-4">
                Freight Shipping Services from Reno, Nevada to All 50 States
              </h2>
              <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
                DeMar Transportation operates as both a motor carrier and freight broker with 10 distinct shipping services. Every shipment is dispatched from our Reno, NV headquarters at 10471 Double R Blvd.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <Link to="/services/dry-van" className="group block p-5 rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">Dry Van Shipping</h3>
                  <p className="text-sm text-muted-foreground mt-1">Enclosed trailer freight for palletized, boxed, and floor-loaded cargo. Standard 53-foot trailers with full weather protection.</p>
                </Link>
                <Link to="/services/reefer" className="group block p-5 rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">Reefer / Refrigerated Freight</h3>
                  <p className="text-sm text-muted-foreground mt-1">Temperature-controlled shipping for perishable goods, pharmaceuticals, and cold chain products requiring consistent climate management.</p>
                </Link>
                <Link to="/services/flatbed" className="group block p-5 rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">Flatbed Shipping</h3>
                  <p className="text-sm text-muted-foreground mt-1">Open-deck trailers for construction materials, heavy machinery, steel, lumber, and oversized freight that cannot fit in enclosed trailers.</p>
                </Link>
                <Link to="/services/box-truck" className="group block p-5 rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">Box Truck Delivery</h3>
                  <p className="text-sm text-muted-foreground mt-1">Smaller enclosed trucks for local and regional deliveries, residential areas, and locations where full-size trailers cannot access.</p>
                </Link>
                <Link to="/services/sprinter-van" className="group block p-5 rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">Sprinter Van / Expedited Shipping</h3>
                  <p className="text-sm text-muted-foreground mt-1">Time-critical deliveries using cargo vans for urgent, smaller shipments that need to arrive on the same day or next day.</p>
                </Link>
                <Link to="/services/hazmat" className="group block p-5 rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">Hazmat Freight Shipping</h3>
                  <p className="text-sm text-muted-foreground mt-1">Hazardous materials transport with proper placarding, documentation, and trained drivers for all 9 DOT hazard classes.</p>
                </Link>
                <Link to="/services/ftl" className="group block p-5 rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">FTL (Full Truckload) Shipping</h3>
                  <p className="text-sm text-muted-foreground mt-1">Dedicated trailer capacity for large shipments, typically 10,000 lbs or more. Direct point-to-point with no additional stops or handling.</p>
                </Link>
                <Link to="/services/ltl" className="group block p-5 rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">LTL (Less Than Truckload) Shipping</h3>
                  <p className="text-sm text-muted-foreground mt-1">Cost-effective shipping for freight under 10,000 lbs. Your cargo shares trailer space with other shipments heading the same direction.</p>
                </Link>
                <Link to="/services/3pl" className="group block p-5 rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">3PL / Third-Party Logistics</h3>
                  <p className="text-sm text-muted-foreground mt-1">End-to-end freight management including carrier selection, rate negotiation, shipment tracking, and logistics coordination.</p>
                </Link>
                <Link to="/services/warehousing" className="group block p-5 rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">Warehousing</h3>
                  <p className="text-sm text-muted-foreground mt-1">Short-term and long-term storage with inventory management, cross-docking, and distribution services from our Nevada facilities.</p>
                </Link>
              </div>
              <div className="text-center mt-8">
                <Link to="/quote" className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors">
                  Get a Freight Quote
                </Link>
              </div>
            </div>
          </section>

          <About />

          {/* E-E-A-T authority section */}
          <section className="py-16 bg-muted/30" aria-labelledby="why-demar-heading">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 id="why-demar-heading" className="text-3xl font-bold text-center mb-10">
                A Registered Motor Carrier, Not Just a Broker
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Federal Operating Authority</h3>
                  <p className="text-muted-foreground text-sm">
                    DeMar Transportation holds both Motor Carrier (MC) and Freight Broker authority registered with the FMCSA under USDOT number 4392091. This dual authority means we can haul freight on our own trucks and coordinate shipments through our vetted carrier network.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Headquartered in Reno, Nevada</h3>
                  <p className="text-muted-foreground text-sm">
                    Our office at 10471 Double R Blvd, Reno, NV 89521 serves as the dispatch hub for freight moving across all 50 states. Reno sits at the intersection of I-80 and US-395, giving us direct highway access to major West Coast markets and cross-country lanes.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">10 Shipping Modes Under One Carrier</h3>
                  <p className="text-muted-foreground text-sm">
                    From dry van and refrigerated trailers to hazmat loads and sprinter van expedites, DeMar Transportation covers the full spectrum of freight types. One point of contact handles your dry van, reefer, flatbed, box truck, hazmat, FTL, LTL, 3PL, warehousing, and expedited shipments.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">24/7 Dispatch, Mon-Fri Office Support</h3>
                  <p className="text-muted-foreground text-sm">
                    Dispatch runs around the clock, 7 days a week for active shipments. Office hours are Monday through Friday, 7:00 AM to 6:00 PM PST for quotes, booking, and account management. Reach us at{" "}
                    <a href="tel:+17752304767" className="text-primary hover:underline">(775) 230-4767</a> or{" "}
                    <a href="mailto:info@DeMarTransportation.com" className="text-primary hover:underline">info@DeMarTransportation.com</a>.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <ResourcesPreview />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;