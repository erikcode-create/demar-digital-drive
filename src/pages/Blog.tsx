import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, Newspaper, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    slug: "why-freight-quote-keeps-changing",
    title: "Why Your Freight Quote Keeps Changing (And What to Expect in 2026)",
    description:
      "Freight rates aren't fixed prices. Learn the 7 factors that cause quote fluctuations and how to lock in better rates with your carrier.",
    category: "Pricing & Rates",
    date: "2026-03-29",
    readTime: "8 min",
  },
  {
    slug: "small-business-freight-shipping",
    title: "Small Business Freight Shipping: A Complete Guide to Affordable Solutions",
    description:
      "Small businesses can ship freight without volume commitments. Learn when to use LTL vs FTL, how to get competitive rates, and common mistakes to avoid.",
    category: "Shipping Guides",
    date: "2026-03-29",
    readTime: "9 min",
  },
  {
    slug: "emergency-expedited-freight",
    title: "Emergency Freight Shipping: How to Get Expedited Delivery When Time is Critical",
    description:
      "Same-day pickup, dedicated trucks, priority routing. Learn what expedited freight costs, when you need it, and how to arrange emergency shipments fast.",
    category: "Shipping Guides",
    date: "2026-03-29",
    readTime: "8 min",
  },
  {
    slug: "freight-damage-prevention",
    title: "The True Cost of Freight Damage: Prevention, Claims, and Carrier Liability",
    description:
      "Freight damage costs U.S. shippers over $1 billion annually. Learn how to prevent damage, file claims, and choose carriers with low damage rates.",
    category: "Industry Knowledge",
    date: "2026-03-29",
    readTime: "9 min",
  },
  {
    slug: "ecommerce-freight-shipping",
    title: "Freight Shipping for E-commerce: How Online Sellers Move Inventory at Scale",
    description:
      "When order volumes exceed 150 lbs, freight saves 40-60% over parcel. Learn how e-commerce businesses use LTL, FTL, and 3PL to move inventory efficiently.",
    category: "Industry Guides",
    date: "2026-03-29",
    readTime: "9 min",
  },
  {
    slug: "real-time-freight-tracking",
    title: "Real-Time Freight Tracking: Monitor Shipments from Pickup to Final Delivery",
    description:
      "Understand how real-time freight tracking works, what data you'll receive, and how to integrate shipment visibility into your supply chain operations.",
    category: "Shipping Guides",
    date: "2026-03-30",
    readTime: "6 min",
  },
  {
    slug: "food-beverage-freight-shipping",
    title: "Food & Beverage Freight Shipping: Cold Chain Compliance & Temperature Control",
    description:
      "Explore food and beverage shipping requirements, cold chain compliance standards, and how to partner with a carrier that maintains FDA audit trails.",
    category: "Compliance & Safety",
    date: "2026-03-30",
    readTime: "9 min",
  },
  {
    slug: "reverse-logistics-return-freight",
    title: "Reverse Logistics & Return Freight: Managing Product Returns Efficiently",
    description:
      "Discover how to streamline product returns, manage reverse logistics operations, and reduce costs when moving goods back through your supply chain.",
    category: "Logistics Strategy",
    date: "2026-03-30",
    readTime: "8 min",
  },
  {
    slug: "dedicated-fleet-vs-spot-market",
    title: "Dedicated Fleet vs. Spot Market Freight: When to Lock in Rates vs. Stay Flexible",
    description:
      "Understand the trade-offs between dedicated freight contracts and spot market flexibility, and learn which strategy fits your shipping volume and rate expectations.",
    category: "Pricing & Rates",
    date: "2026-03-30",
    readTime: "7 min",
  },
  {
    slug: "partial-truckload-ptl-shipping",
    title: "Partial Truckload (PTL) Shipping: Cost Optimization Between LTL & FTL",
    description:
      "Discover how partial truckload shipping fills the gap between LTL and FTL, offering better rates for medium-sized loads without paying for a full truck.",
    category: "Shipping Guides",
    date: "2026-03-30",
    readTime: "7 min",
  },
  {
    slug: "freight-shipping-insurance-coverage",
    title: "Freight Shipping Insurance: Coverage Types, Claims & How to Choose",
    description:
      "Understand freight insurance requirements, coverage options, and how to file claims when damage occurs during shipping and logistics operations.",
    category: "Compliance & Safety",
    date: "2026-03-30",
    readTime: "8 min",
  },
  {
    slug: "white-glove-freight-handling",
    title: "White-Glove Freight Handling: Specialty Shipping for High-Value Goods",
    description:
      "Explore white-glove freight services for temperature-sensitive, fragile, and high-value shipments requiring specialized handling and logistics expertise.",
    category: "Shipping Guides",
    date: "2026-03-30",
    readTime: "6 min",
  },
  {
    slug: "last-mile-delivery-freight-shipping",
    title: "Last-Mile Delivery for Freight: Options, Costs & Best Practices",
    description:
      "Discover last-mile delivery options for freight shipments, from local box truck delivery to final-mile logistics for ecommerce and B2B shipping.",
    category: "Logistics Strategy",
    date: "2026-03-30",
    readTime: "6 min",
  },
  {
    slug: "ltl-freight-shipping-nevada",
    title: "LTL Freight Shipping in Nevada: A Complete Guide for Businesses",
    description:
      "Everything Nevada businesses need to know about LTL freight shipping, from pricing factors and transit times to pallet preparation tips and choosing between LTL and FTL.",
    category: "Shipping Guides",
    date: "2026-04-05",
    readTime: "8 min",
  },
  {
    slug: "ltl-vs-ftl-freight-shipping",
    title: "LTL vs FTL Freight Shipping: How to Choose the Right Method for Your Load",
    description:
      "A complete comparison of LTL and FTL freight shipping covering costs, transit times, handling risks, and how to choose the right method for your shipment size and budget.",
    category: "Shipping Guides",
    date: "2026-04-06",
    readTime: "8 min",
  },
];

const Blog = () => {
  useEffect(() => {
    document.title =
      "Freight Shipping Insights | DeMar Transportation";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Expert freight shipping insights from DeMar Transportation. Practical guides on rates, damage prevention, expedited shipping, e-commerce logistics, and small business freight."
      );
    }
  }, []);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "DeMar Transportation Blog",
    description:
      "Expert freight shipping insights and guides from DeMar Transportation.",
    url: "https://demartransportation.com/blog",
    publisher: {
      "@type": "Organization",
      name: "DeMar Transportation",
      logo: {
        "@type": "ImageObject",
        url: "https://demartransportation.com/demar-logo-official.png",
      },
    },
    blogPost: blogPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      url: `https://demartransportation.com/blog/${post.slug}`,
      author: {
        "@type": "Organization",
        name: "DeMar Transportation",
      },
    })),
  };

  const breadcrumbSchema = {
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
        name: "Blog",
        item: "https://demartransportation.com/blog",
      },
    ],
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
            dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbSchema),
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
            <div className="container mx-auto max-w-4xl relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/5 backdrop-blur-sm">
                <Newspaper className="h-4 w-4 text-[hsl(var(--accent))]" />
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
                  Freight Shipping Insights
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-6">
                Insights
              </h1>
              <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
                Practical guides and expert analysis from DeMar Transportation.
                Real carrier knowledge to help you ship smarter.
              </p>
            </div>
          </section>

          {/* Blog Posts Grid */}
          <section className="py-16 bg-[hsl(var(--surface))]">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="space-y-6">
                {blogPosts.map((post) => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="block group"
                  >
                    <article className="p-6 md:p-8 rounded-xl bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)] transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[hsl(var(--accent))]">
                          {post.category}
                        </span>
                        <span className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="text-xs text-[hsl(var(--muted-foreground))]">
                          {post.readTime} read
                        </span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3 group-hover:text-[hsl(var(--accent))] transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                        {post.description}
                      </p>
                      <span className="inline-flex items-center text-sm font-medium text-[hsl(var(--accent))] group-hover:gap-2 transition-all">
                        Read Article
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-[hsl(var(--accent))]">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
                Ready to Ship?
              </h2>
              <p className="text-base text-[hsl(var(--primary))]/70 mb-8 max-w-md mx-auto">
                Get a free freight quote from DeMar Transportation. We respond
                within 1 business hour.
              </p>
              <Button
                size="lg"
                className="bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]/90 font-semibold"
                asChild
              >
                <Link to="/quote" className="group">
                  Get a Free Quote
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Blog;
