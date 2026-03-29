import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Phone, DollarSign, Truck, Scale, Snowflake, AlertTriangle, Package, FileText, BarChart3, HelpCircle, Calendar, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResourceItem {
  title: string;
  description: string;
  slug: string;
  icon: React.ElementType;
  category: string;
}

const resources: ResourceItem[] = [
  {
    title: "How Much Does Freight Shipping Cost?",
    description: "Complete 2026 pricing guide with per-mile rates, cost factors, and tips to reduce your freight spend.",
    slug: "freight-shipping-cost",
    icon: DollarSign,
    category: "Pricing & Quotes",
  },
  {
    title: "How to Get a Freight Quote",
    description: "Step-by-step guide to requesting freight quotes. What information you need and how to compare rates.",
    slug: "how-to-get-freight-quote",
    icon: FileText,
    category: "Pricing & Quotes",
  },
  {
    title: "How to Choose a Freight Carrier",
    description: "Checklist for evaluating carriers. Red flags to avoid and questions to ask before booking.",
    slug: "how-to-choose-freight-carrier",
    icon: HelpCircle,
    category: "Pricing & Quotes",
  },
  {
    title: "Dry Van vs Reefer: Which Do You Need?",
    description: "Side-by-side comparison of dry van and refrigerated trailers. Decision guide for your cargo type.",
    slug: "dry-van-vs-reefer",
    icon: Snowflake,
    category: "Equipment Guides",
  },
  {
    title: "FTL vs LTL: How to Choose the Right Shipping Method",
    description: "When full truckload beats less-than-truckload and vice versa. Cost breakpoints and use cases.",
    slug: "ftl-vs-ltl",
    icon: Scale,
    category: "Equipment Guides",
  },
  {
    title: "Hot Shot vs Full Truckload: When to Use Each",
    description: "Compare expedited hot shot delivery with standard full truckload shipping. Speed vs cost tradeoffs.",
    slug: "hot-shot-vs-full-truckload",
    icon: Truck,
    category: "Equipment Guides",
  },
  {
    title: "Types of Freight Trailers: Complete Guide",
    description: "Every trailer type explained — dry van, reefer, flatbed, step deck, lowboy, sprinter van, and more.",
    slug: "types-of-freight-trailers",
    icon: Layers,
    category: "Equipment Guides",
  },
  {
    title: "How to Ship Freight: Beginner's Guide",
    description: "End-to-end guide for first-time shippers. From getting a quote to receiving your delivery.",
    slug: "how-to-ship-freight",
    icon: Package,
    category: "Shipping Guides",
  },
  {
    title: "How to Ship Refrigerated Goods",
    description: "Temperature requirements, packaging best practices, and compliance for cold chain shipping.",
    slug: "how-to-ship-refrigerated-goods",
    icon: Snowflake,
    category: "Shipping Guides",
  },
  {
    title: "How to Ship Hazardous Materials",
    description: "DOT regulations, required certifications, and what carriers need to transport hazmat freight.",
    slug: "how-to-ship-hazardous-materials",
    icon: AlertTriangle,
    category: "Shipping Guides",
  },
  {
    title: "Oversized Load Shipping Guide",
    description: "Permits, route planning, and equipment requirements for shipping overweight and oversized cargo.",
    slug: "oversized-load-shipping",
    icon: Truck,
    category: "Shipping Guides",
  },
  {
    title: "Freight Shipping Classes Explained",
    description: "NMFC freight classes 50-500 explained. How classification affects your shipping rates.",
    slug: "freight-classes-explained",
    icon: BarChart3,
    category: "Industry Knowledge",
  },
  {
    title: "Freight Broker vs Carrier vs 3PL: What's the Difference?",
    description: "Industry roles explained. How brokers, carriers, and third-party logistics providers work together.",
    slug: "broker-vs-carrier-vs-3pl",
    icon: HelpCircle,
    category: "Industry Knowledge",
  },
  {
    title: "Freight Shipping Terms Glossary",
    description: "A-to-Z glossary of freight and logistics terminology. BOL, accessorials, deadhead, and 50+ more terms.",
    slug: "freight-shipping-glossary",
    icon: BookOpen,
    category: "Industry Knowledge",
  },
  {
    title: "Seasonal Freight Shipping: Peak Season Guide",
    description: "When rates spike, how to plan ahead, and strategies to save during peak shipping seasons.",
    slug: "seasonal-freight-shipping",
    icon: Calendar,
    category: "Industry Knowledge",
  },
];

const categories = [
  "Pricing & Quotes",
  "Equipment Guides",
  "Shipping Guides",
  "Industry Knowledge",
];

const Resources = () => {
  useEffect(() => {
    document.title = "Freight Shipping Resources & Guides | DeMar Transportation";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "Free freight shipping guides, cost calculators, and industry resources from DeMar Transportation. Learn about pricing, equipment types, shipping methods, and more.");
    }
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
                "@type": "CollectionPage",
                name: "Freight Shipping Resources",
                description: "Free freight shipping guides, cost calculators, and industry resources from DeMar Transportation.",
                url: "https://demartransportation.com/resources",
                publisher: {
                  "@type": "Organization",
                  name: "DeMar Transportation",
                },
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
            <div className="container mx-auto max-w-5xl relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/5 backdrop-blur-sm">
                <BookOpen className="h-4 w-4 text-[hsl(var(--accent))]" />
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
                  Resource Center
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                Freight Shipping
                <br />
                <span className="text-white/40">Resources & Guides</span>
              </h1>
              <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
                Everything you need to know about freight shipping — from pricing
                and equipment to regulations and industry terms. Written by our
                logistics team.
              </p>
            </div>
          </section>

          {/* Resource Grid by Category */}
          {categories.map((category, catIndex) => (
            <section
              key={category}
              className={`py-20 px-4 ${
                catIndex % 2 === 0
                  ? "bg-[hsl(var(--surface))]"
                  : "bg-[hsl(var(--surface-low))]"
              }`}
            >
              <div className="container mx-auto max-w-5xl">
                <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                  {category}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                  {category}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {resources
                    .filter((r) => r.category === category)
                    .map((resource) => (
                      <Link
                        key={resource.slug}
                        to={`/resources/${resource.slug}`}
                        className="group p-6 rounded-xl bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)] transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 rounded-lg bg-[hsl(var(--surface-low))]">
                            <resource.icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-2 group-hover:text-[hsl(var(--accent))] transition-colors">
                              {resource.title}
                            </h3>
                            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                              {resource.description}
                            </p>
                            <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-[hsl(var(--accent))]">
                              Read Guide
                              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </section>
          ))}

          {/* CTA */}
          <section className="py-16 bg-[hsl(var(--accent))]">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
                Ready to Ship?
              </h2>
              <p className="text-base text-[hsl(var(--primary))]/70 mb-8 max-w-md mx-auto">
                Put this knowledge to work. Get a free freight quote today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]/90 font-semibold"
                  asChild
                >
                  <Link to="/quote" className="group">
                    Request a Quote
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
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Resources;
