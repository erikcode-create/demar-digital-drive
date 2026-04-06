import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Category = "standard" | "temperature" | "heavy" | "lastmile" | "logistics";

interface ServicePageProps {
  title: string;
  slug: string;
  icon: LucideIcon;
  category: Category;
  badge: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  overview: { heading: string; paragraphs: string[] };
  capabilities?: {
    heading: string;
    paragraphs: string[];
    subsections?: Array<{ heading: string; items: Array<{ title: string; detail: string }> }>;
  };
  specs?: Array<{ value: string; label: string; desc: string }>;
  cargoTypes?: Array<{ title: string; desc: string }>;
  features?: Array<{ title: string; desc: string }>;
  industries?: Array<{ name: string; detail: string }>;
  whyDemar: {
    paragraphs: string[];
    relatedServices: Array<{ name: string; slug: string }>;
  };
  faq?: Array<{ q: string; a: string }>;
  relatedResources: Array<{ title: string; description: string; to: string }>;
  schema: { serviceType: string; serviceDescription: string };
}

// ---------------------------------------------------------------------------
// Category tint map
// ---------------------------------------------------------------------------

const categoryTints: Record<Category, string | null> = {
  standard: null,
  temperature: "210 60% 50%",
  heavy: "30 60% 50%",
  lastmile: "160 50% 45%",
  logistics: "270 40% 50%",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ServicePageLayout(props: ServicePageProps) {
  const {
    title, slug, icon: Icon, category, badge, description,
    metaTitle, metaDescription,
    overview, capabilities, specs, cargoTypes, features, industries,
    whyDemar, faq, relatedResources, schema,
  } = props;

  const tint = categoryTints[category];
  const specValueColor = tint ? `hsl(${tint})` : "hsl(var(--accent))";
  const heroGradient = tint
    ? `linear-gradient(135deg, hsl(225 97% 4%) 0%, hsl(${tint} / 0.15) 50%, hsl(225 97% 4%) 100%)`
    : "linear-gradient(135deg, hsl(225 97% 4%), hsl(220 85% 15%))";

  // Meta tags
  useEffect(() => {
    document.title = metaTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", metaDescription);
  }, [metaTitle, metaDescription]);

  // Schema objects
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title.replace(/ Services?$/, ""),
    provider: {
      "@type": "LocalBusiness",
      name: "DeMar Transportation",
      address: { "@type": "PostalAddress", streetAddress: "10471 Double R Blvd", addressLocality: "Reno", addressRegion: "NV", postalCode: "89521", addressCountry: "US" },
      telephone: "(775) 230-4767",
      email: "info@DeMarTransportation.com",
    },
    serviceType: schema.serviceType,
    areaServed: { "@type": "Country", name: "United States" },
    description: schema.serviceDescription,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://demartransportation.com/" },
      { "@type": "ListItem", position: 2, name: "Services", item: "https://demartransportation.com/#services" },
      { "@type": "ListItem", position: 3, name: title, item: `https://demartransportation.com/services/${slug}` },
    ],
  };

  const faqSchema = faq?.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

  return (
    <div className="min-h-screen">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded">
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        {/* Schemas */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

        {/* ── Hero ── */}
        <section className="pt-32 pb-space-xl px-4 relative overflow-hidden" style={{ background: heroGradient }}>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
          <div className="container mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-space-md rounded-full bg-white/5 backdrop-blur-sm">
              <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
              <span className="text-caption font-medium tracking-[0.15em] uppercase text-white/60">{badge}</span>
            </div>
            <h1 className="font-serif text-display text-white mb-space-md text-balance">
              {title}
            </h1>
            <p className="text-body text-white/60 max-w-2xl mb-space-xl leading-relaxed">{description}</p>
            <div className="flex flex-col sm:flex-row items-start gap-space-md">
              <Button variant="hero" size="xl" asChild>
                <Link to="/quote" className="group">
                  Get a Free Quote
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <a href="tel:+17752304767" className="inline-flex items-center gap-2 text-body font-medium text-white/70 hover:text-white transition-colors py-3">
                <Phone className="h-4 w-4" aria-hidden="true" />
                (775) 230-4767
              </a>
            </div>
          </div>
        </section>

        {/* ── Overview ── */}
        <section className="py-space-2xl px-4 bg-[hsl(var(--surface))]">
          <div className="container mx-auto">
            <h2 className="font-serif text-heading text-primary mb-space-lg">{overview.heading}</h2>
            <div className="space-y-5 text-body text-muted-foreground leading-relaxed max-w-3xl">
              {overview.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </section>

        {/* ── Capabilities (optional) ── */}
        {capabilities && (
          <section className="py-space-2xl px-4 bg-[hsl(var(--surface-low))]">
            <div className="container mx-auto">
              <h2 className="font-serif text-heading text-primary mb-space-lg">{capabilities.heading}</h2>
              <div className="space-y-5 text-body text-muted-foreground leading-relaxed max-w-3xl mb-space-xl">
                {capabilities.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              {capabilities.subsections?.map((sub) => (
                <div key={sub.heading} className="mb-space-lg">
                  <h3 className="font-serif text-subheading text-primary mb-space-md">{sub.heading}</h3>
                  <div className="grid md:grid-cols-3 gap-space-md">
                    {sub.items.map((item) => (
                      <div key={item.title} className="p-space-md rounded-[var(--radius)] bg-background shadow-[var(--shadow-card)]">
                        <h4 className="text-sm font-bold text-primary mb-1">{item.title}</h4>
                        <p className="text-caption text-muted-foreground leading-relaxed">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Specs (optional) ── */}
        {specs && specs.length > 0 && (
          <section className="py-space-2xl px-4 bg-[hsl(var(--surface))]">
            <div className="container mx-auto">
              <h2 className="font-serif text-heading text-primary mb-space-xl">Specifications</h2>
              <div className="grid md:grid-cols-3 gap-space-md">
                {specs.map((spec) => (
                  <div key={spec.label} className="p-space-lg rounded-[var(--radius)] bg-background shadow-[var(--shadow-card)]">
                    <div className="font-serif text-heading tracking-tight mb-2" style={{ color: specValueColor }}>{spec.value}</div>
                    <div className="text-sm font-bold text-primary mb-2">{spec.label}</div>
                    <p className="text-caption text-muted-foreground leading-relaxed">{spec.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Cargo Types (optional) ── */}
        {cargoTypes && cargoTypes.length > 0 && (
          <section className="py-space-2xl px-4 bg-[hsl(var(--surface-low))]">
            <div className="container mx-auto">
              <h2 className="font-serif text-heading text-primary mb-space-xl">Common Cargo Types</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-space-sm">
                {cargoTypes.map((cargo) => (
                  <div key={cargo.title} className="p-space-md rounded-[var(--radius)] bg-[hsl(var(--surface))] hover:bg-background hover:shadow-[var(--shadow-card)] transition-shadow duration-300">
                    <h3 className="text-sm font-bold text-primary mb-1">{cargo.title}</h3>
                    <p className="text-caption text-muted-foreground leading-relaxed">{cargo.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Features (optional) ── */}
        {features && features.length > 0 && (
          <section className="py-space-2xl px-4 bg-[hsl(var(--surface))]">
            <div className="container mx-auto">
              <h2 className="font-serif text-heading text-primary mb-space-xl">Key Advantages</h2>
              <div className="grid md:grid-cols-2 gap-space-md max-w-4xl">
                {features.map((f) => (
                  <div key={f.title} className="flex items-start gap-4">
                    <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <h3 className="text-body font-bold text-primary mb-1">{f.title}</h3>
                      <p className="text-caption text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Industries (optional) ── */}
        {industries && industries.length > 0 && (
          <section className="py-space-2xl px-4 bg-[hsl(var(--surface-low))]">
            <div className="container mx-auto">
              <h2 className="font-serif text-heading text-primary mb-space-xl">Industries We Serve</h2>
              <div className="grid md:grid-cols-2 gap-space-md">
                {industries.map((ind) => (
                  <div key={ind.name} className="p-space-lg rounded-[var(--radius)] bg-[hsl(var(--surface))] hover:bg-background hover:shadow-[var(--shadow-card)] transition-shadow duration-300">
                    <h3 className="text-body font-bold text-primary mb-2">{ind.name}</h3>
                    <p className="text-caption text-muted-foreground leading-relaxed">{ind.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Why DeMar ── */}
        <section className="py-space-2xl px-4 bg-primary">
          <div className="container mx-auto">
            <h2 className="font-serif text-heading text-primary-foreground mb-space-lg">Why Choose DeMar Transportation</h2>
            <div className="space-y-5 text-body text-primary-foreground/60 leading-relaxed max-w-3xl">
              {whyDemar.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              {whyDemar.relatedServices.length > 0 && (
                <p>
                  We also offer{" "}
                  {whyDemar.relatedServices.map((rs, i) => (
                    <span key={rs.slug}>
                      {i > 0 && (i === whyDemar.relatedServices.length - 1 ? " and " : ", ")}
                      <Link to={`/services/${rs.slug}`} className="text-accent hover:underline">{rs.name}</Link>
                    </span>
                  ))}
                  .
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ── FAQ (optional) ── */}
        {faq && faq.length > 0 && (
          <section className="py-space-2xl px-4 bg-[hsl(var(--surface))]">
            <div className="container mx-auto">
              <h2 className="font-serif text-heading text-primary mb-space-xl">Frequently Asked Questions</h2>
              <div className="space-y-space-md max-w-3xl">
                {faq.map((item) => (
                  <div key={item.q} className="p-space-lg rounded-[var(--radius)] bg-[hsl(var(--surface-low))]">
                    <h3 className="font-serif text-subheading text-primary mb-space-sm">{item.q}</h3>
                    <p className="text-caption text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Related Resources ── */}
        <section className="py-space-2xl px-4 bg-[hsl(var(--surface-low))]">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-serif text-heading text-primary mb-space-xl">Related Resources</h2>
            <div className="space-y-space-md">
              {relatedResources.map((r) => (
                <Link key={r.to} to={r.to} className="group flex items-start gap-space-md p-space-md rounded-[var(--radius)] bg-background hover:shadow-[var(--shadow-float)] transition-shadow duration-300">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-subheading text-primary mb-1 group-hover:text-accent transition-colors">{r.title}</h3>
                    <p className="text-caption text-muted-foreground">{r.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-accent flex-shrink-0 mt-1 transition-colors" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="py-space-xl bg-accent">
          <div className="container mx-auto text-center px-4">
            <h2 className="font-serif text-heading text-accent-foreground mb-space-md text-balance">Ready to Ship?</h2>
            <p className="text-body text-accent-foreground/70 mb-space-lg max-w-md mx-auto">
              Get your quote today. Our freight specialists are available to help.
            </p>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" asChild>
              <Link to="/quote" className="group">
                Request a Free Quote
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
