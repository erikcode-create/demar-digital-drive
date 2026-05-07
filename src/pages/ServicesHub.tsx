import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Phone, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommercialProof from "@/components/CommercialProof";
import { Button } from "@/components/ui/button";
import { canonicalUrl, setPageSeo } from "@/lib/seo";
import { equipmentServices, solutionServices } from "@/data/seoPages";

const ServicesHub = () => {
  useEffect(() => {
    setPageSeo({
      path: "/services",
      title: "Freight Shipping Services | DeMar Transportation",
      description:
        "Explore DeMar Transportation freight services across the 48 contiguous states: dry van, reefer, flatbed, box truck, sprinter van, hazmat, FTL, LTL, 3PL, and warehousing.",
    });
  }, []);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Freight Shipping Services",
    description:
      "Freight shipping service directory for DeMar Transportation.",
    url: canonicalUrl("/services"),
    publisher: {
      "@type": "Organization",
      name: "DeMar Transportation",
      url: canonicalUrl("/"),
    },
    mainEntity: [...equipmentServices, ...solutionServices].map((service) => ({
      "@type": "Service",
      name: service.title,
      url: canonicalUrl(service.path),
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
      { "@type": "ListItem", position: 2, name: "Services", item: canonicalUrl("/services") },
    ],
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

        <section className="pt-32 pb-20 px-4 bg-[hsl(225_97%_4%)] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }} />
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/5">
              <ShieldCheck className="h-4 w-4 text-[hsl(var(--accent))]" />
              <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
                USDOT 4392091 | 48-State Freight Coverage
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
              Freight Shipping Services
            </h1>
            <p className="text-lg text-white/60 max-w-3xl leading-relaxed mb-10">
              One freight team for dry van, reefer, flatbed, box truck, sprinter van,
              hazmat, FTL, LTL, 3PL, and warehousing support across the 48 contiguous
              states. DeMar Transportation combines its own fleet with a vetted
              nationwide carrier network.
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
          <div className="container mx-auto max-w-5xl">
            <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
              Equipment
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
              Freight Equipment Options
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {equipmentServices.map((service) => (
                <Link key={service.path} to={service.path} className="group rounded-xl bg-white p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)] transition-all">
                  <service.icon className="h-6 w-6 text-[hsl(var(--accent))] mb-4" />
                  <h3 className="text-lg font-bold text-[hsl(var(--primary))] mb-2 group-hover:text-[hsl(var(--accent))]">{service.title}</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{service.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
          <div className="container mx-auto max-w-5xl">
            <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
              Solutions
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
              Freight Management Solutions
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {solutionServices.map((service) => (
                <Link key={service.path} to={service.path} className="group rounded-xl bg-white p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)] transition-all">
                  <service.icon className="h-6 w-6 text-[hsl(var(--accent))] mb-4" />
                  <h3 className="text-lg font-bold text-[hsl(var(--primary))] mb-2 group-hover:text-[hsl(var(--accent))]">{service.title}</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{service.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
              What Shippers Get With DeMar
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Carrier and broker authority for flexible capacity.",
                "Own fleet plus vetted carrier network for 48-state coverage.",
                "Equipment guidance before booking so freight is matched to the right mode.",
                "Relevant service links from every page so shippers can compare options quickly.",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-[hsl(var(--accent))] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CommercialProof />
      </main>
      <Footer />
    </div>
  );
};

export default ServicesHub;
