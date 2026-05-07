import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, MapPin, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { canonicalUrl, setPageSeo } from "@/lib/seo";

interface LocalPageConfig {
  path: string;
  title: string;
  eyebrow: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  bullets: string[];
  serviceLinks: Array<{ label: string; to: string }>;
  schemaServiceType: string;
}

const pageContent: Record<string, LocalPageConfig> = {
  "reno-freight-shipping": {
    path: "/locations/reno-freight-shipping",
    title: "Reno Freight Shipping",
    eyebrow: "Reno, NV Freight Carrier",
    metaTitle: "Reno Freight Shipping | DeMar Transportation",
    metaDescription:
      "Reno freight shipping from DeMar Transportation. Dry van, reefer, flatbed, LTL, FTL, 3PL, and warehouse support from a Reno, NV freight team.",
    intro:
      "DeMar Transportation supports Reno shippers moving freight along I-80, US-395, California lanes, Pacific Northwest lanes, and nationwide routes. Our Reno location gives shippers fast access to regional distribution markets and long-haul capacity.",
    bullets: [
      "Dry van, reefer, flatbed, LTL, FTL, sprinter van, and box truck options.",
      "Useful for manufacturers, distributors, retailers, food shippers, and project freight.",
      "Reno dispatch can help compare equipment, timing, and route options before booking.",
      "Local knowledge for Sierra weather, appointment windows, and Western US freight lanes.",
    ],
    serviceLinks: [
      { label: "Dry Van Freight", to: "/services/dry-van" },
      { label: "Full Truckload", to: "/services/ftl" },
      { label: "LTL Freight", to: "/services/ltl" },
      { label: "Warehousing", to: "/services/warehousing" },
    ],
    schemaServiceType: "Reno Freight Shipping",
  },
  "nevada-ltl-freight": {
    path: "/locations/nevada-ltl-freight",
    title: "Nevada LTL Freight",
    eyebrow: "Less Than Truckload in Nevada",
    metaTitle: "Nevada LTL Freight Shipping | DeMar Transportation",
    metaDescription:
      "Nevada LTL freight shipping for palletized loads, shared trailer space, freight class guidance, and regional or nationwide LTL lanes from DeMar Transportation.",
    intro:
      "Nevada businesses use LTL freight when shipments are too large for parcel but do not require a dedicated trailer. DeMar Transportation helps shippers prepare pallet counts, freight class details, accessorial needs, and carrier selection before tendering freight.",
    bullets: [
      "Best for palletized freight, partial loads, and recurring small business shipments.",
      "Support for freight class, weight, dimensions, liftgate, appointment, and limited-access details.",
      "Useful for Reno, Sparks, Carson City, Las Vegas, and statewide Nevada freight moves.",
      "Can compare LTL against partial truckload or FTL when shipment size is near a breakpoint.",
    ],
    serviceLinks: [
      { label: "LTL Freight Services", to: "/services/ltl" },
      { label: "FTL vs LTL Guide", to: "/resources/ftl-vs-ltl" },
      { label: "Freight Classes Explained", to: "/resources/freight-classes-explained" },
      { label: "How to Get a Freight Quote", to: "/resources/how-to-get-freight-quote" },
    ],
    schemaServiceType: "Nevada LTL Freight Shipping",
  },
  "nevada-reefer-freight": {
    path: "/locations/nevada-reefer-freight",
    title: "Nevada Reefer Freight",
    eyebrow: "Temperature-Controlled Nevada Freight",
    metaTitle: "Nevada Reefer Freight Shipping | DeMar Transportation",
    metaDescription:
      "Nevada reefer freight shipping for food, beverage, pharmaceutical, and temperature-sensitive shipments with DeMar Transportation.",
    intro:
      "Temperature-controlled freight needs the right trailer, temperature range, loading process, and carrier communication. DeMar Transportation helps Nevada shippers coordinate reefer capacity for cold chain freight moving locally, regionally, and nationwide.",
    bullets: [
      "Useful for produce, frozen goods, dairy, beverages, pharmaceuticals, and temperature-sensitive freight.",
      "Pre-cooling, temperature range, seal, appointment, and transit details are confirmed before dispatch.",
      "Supports Western US lanes where desert heat and mountain weather can both affect cold chain risk.",
      "Can compare reefer FTL, reefer LTL, and dedicated expedited options based on shipment size.",
    ],
    serviceLinks: [
      { label: "Reefer Services", to: "/services/reefer" },
      { label: "How to Ship Refrigerated Goods", to: "/resources/how-to-ship-refrigerated-goods" },
      { label: "Refrigerated Freight Guide", to: "/blog/refrigerated-freight-shipping-guide" },
      { label: "Food & Beverage Freight", to: "/blog/food-beverage-freight-shipping" },
    ],
    schemaServiceType: "Nevada Reefer Freight Shipping",
  },
  "reno-warehouse-distribution": {
    path: "/locations/reno-warehouse-distribution",
    title: "Reno Warehouse Distribution",
    eyebrow: "Storage, Cross-Dock, and Distribution",
    metaTitle: "Reno Warehouse Distribution | DeMar Transportation",
    metaDescription:
      "Reno warehouse distribution support for storage, cross-docking, transloading, fulfillment coordination, and freight distribution from DeMar Transportation.",
    intro:
      "Reno is a practical distribution point for freight moving between California, Nevada, the Pacific Northwest, and the Mountain West. DeMar Transportation coordinates warehousing, cross-docking, and outbound freight solutions for shippers that need more than a one-time truckload.",
    bullets: [
      "Useful for overflow storage, short-term staging, cross-docking, transloading, and regional distribution.",
      "Connects warehouse needs with outbound dry van, box truck, LTL, FTL, and 3PL support.",
      "Helps shippers plan inbound freight, inventory movement, and final outbound delivery.",
      "Good fit for businesses using Reno as a Western US distribution point.",
    ],
    serviceLinks: [
      { label: "Warehousing", to: "/services/warehousing" },
      { label: "3PL Services", to: "/services/3pl" },
      { label: "Box Truck Delivery", to: "/services/box-truck" },
      { label: "Supply Chain Guide", to: "/blog/supply-chain-management-small-business" },
    ],
    schemaServiceType: "Reno Warehouse Distribution",
  },
};

interface LocationPageProps {
  slug: keyof typeof pageContent;
}

const LocationPage = ({ slug }: LocationPageProps) => {
  const page = pageContent[slug];

  useEffect(() => {
    setPageSeo({
      path: page.path,
      title: page.metaTitle,
      description: page.metaDescription,
    });
  }, [page]);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.title,
    serviceType: page.schemaServiceType,
    url: canonicalUrl(page.path),
    provider: {
      "@type": "LocalBusiness",
      name: "DeMar Transportation",
      telephone: "+1-775-230-4767",
      address: {
        "@type": "PostalAddress",
        streetAddress: "10471 Double R Blvd",
        addressLocality: "Reno",
        addressRegion: "NV",
        postalCode: "89521",
        addressCountry: "US",
      },
    },
    areaServed: {
      "@type": "State",
      name: "Nevada",
    },
    description: page.metaDescription,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
      { "@type": "ListItem", position: 2, name: "Locations", item: canonicalUrl("/locations") },
      { "@type": "ListItem", position: 3, name: page.title, item: canonicalUrl(page.path) },
    ],
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

        <section className="pt-32 pb-20 px-4 bg-[hsl(225_97%_4%)] relative overflow-hidden">
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/5">
              <MapPin className="h-4 w-4 text-[hsl(var(--accent))]" />
              <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
                {page.eyebrow}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
              {page.title}
            </h1>
            <p className="text-lg text-white/60 max-w-3xl leading-relaxed mb-10">
              {page.intro}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/quote">
                  Request a Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <a href="tel:+17752304767" className="inline-flex items-center gap-2 text-white/70 hover:text-white py-3">
                <Phone className="h-4 w-4" />
                (775) 230-4767
              </a>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-[hsl(var(--surface))]">
          <div className="container mx-auto max-w-5xl grid lg:grid-cols-[1.15fr_0.85fr] gap-10">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Local Freight Fit
              </p>
              <h2 className="text-3xl font-bold text-[hsl(var(--primary))] tracking-tight mb-6">
                How DeMar Supports This Lane
              </h2>
              <div className="space-y-4">
                {page.bullets.map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--accent))] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-[var(--shadow-card)]">
              <h2 className="text-xl font-bold text-[hsl(var(--primary))] mb-4">
                Related Services and Guides
              </h2>
              <div className="space-y-2">
                {page.serviceLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="group flex items-center justify-between rounded-lg bg-[hsl(var(--surface-low))] px-4 py-3 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors">
                    {link.label}
                    <ArrowRight className="h-4 w-4 text-[hsl(var(--accent))] transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LocationPage;
