import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { canonicalUrl, setPageSeo } from "@/lib/seo";
import { locationPages } from "@/data/seoPages";

const Locations = () => {
  useEffect(() => {
    setPageSeo({
      path: "/locations",
      title: "Nevada Freight Shipping Locations | DeMar Transportation",
      description:
        "Explore DeMar Transportation local freight pages for Reno freight shipping, Nevada LTL, Nevada reefer freight, and Reno warehouse distribution.",
    });
  }, []);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Nevada Freight Shipping Locations",
    url: canonicalUrl("/locations"),
    mainEntity: locationPages.map((page) => ({
      "@type": "WebPage",
      name: page.title,
      url: canonicalUrl(page.path),
    })),
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
        <section className="pt-32 pb-20 px-4 bg-[hsl(225_97%_4%)] relative overflow-hidden">
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/5">
              <MapPin className="h-4 w-4 text-[hsl(var(--accent))]" />
              <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
                Reno and Nevada Freight
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
              Nevada Freight Shipping Locations
            </h1>
            <p className="text-lg text-white/60 max-w-3xl leading-relaxed mb-10">
              DeMar Transportation is headquartered in Reno, Nevada and supports
              shippers across local, regional, and nationwide freight lanes.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/quote">
                Request a Nevada Freight Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-20 px-4 bg-[hsl(var(--surface))]">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-4">
              {locationPages.map((page) => (
                <Link key={page.path} to={page.path} className="group rounded-xl bg-white p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)] transition-all">
                  <page.icon className="h-6 w-6 text-[hsl(var(--accent))] mb-4" />
                  <h2 className="text-xl font-bold text-[hsl(var(--primary))] mb-2 group-hover:text-[hsl(var(--accent))]">{page.title}</h2>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{page.description}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-[hsl(var(--accent))]">
                    View Location Page
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-[hsl(var(--surface-low))]">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
              Talk With Reno Dispatch
            </h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
              Call DeMar Transportation for Nevada freight lanes, regional deliveries, and nationwide shipping support.
            </p>
            <a href="tel:+17752304767" className="inline-flex items-center gap-2 text-[hsl(var(--primary))] font-semibold">
              <Phone className="h-4 w-4" />
              (775) 230-4767
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Locations;
