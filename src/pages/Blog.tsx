import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
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
];

const categoryPillStyle = (category: string) => {
  switch (category) {
    case "Pricing & Rates":
      return "bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))]";
    case "Shipping Guides":
      return "bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]";
    case "Industry Knowledge":
      return "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]";
    case "Business Strategy":
      return "bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]";
    case "Technology":
      return "bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))]";
    default:
      return "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]";
  }
};

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

  const featuredPost = blogPosts[0];
  const gridPosts = blogPosts.slice(1);

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
          <section className="pt-32 pb-[var(--space-2xl)] px-4 bg-[hsl(var(--surface))]">
            <div className="container mx-auto max-w-4xl">
              <h1 className="font-serif text-display text-[hsl(var(--primary))] leading-tight tracking-tight mb-6" style={{ textWrap: 'balance' }}>
                Insights
              </h1>
              <p className="text-body text-muted-foreground max-w-2xl leading-relaxed">
                Freight shipping guides, industry analysis, and logistics expertise.
              </p>
            </div>
          </section>

          {/* Posts */}
          <section className="pb-[var(--space-2xl)] bg-[hsl(var(--surface))]">
            <div className="container mx-auto px-4 max-w-4xl space-y-[var(--space-xl)]">

              {/* Featured Post */}
              <Link to={`/blog/${featuredPost.slug}`} className="block group">
                <article className="p-[var(--space-lg)] bg-[hsl(var(--surface-low))] rounded-[var(--radius)] hover:shadow-[var(--shadow-float)] transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-[10px] font-semibold tracking-[0.2em] uppercase px-2 py-0.5 rounded-full ${categoryPillStyle(featuredPost.category)}`}>
                      {featuredPost.category}
                    </span>
                    <span className="text-caption text-muted-foreground flex items-center gap-1">
                      <Calendar aria-hidden="true" className="h-3 w-3" />
                      {new Date(featuredPost.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-caption text-muted-foreground">
                      {featuredPost.readTime} read
                    </span>
                  </div>
                  <h2 className="font-serif text-heading text-[hsl(var(--primary))] tracking-tight mb-3 group-hover:text-[hsl(var(--accent))] transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-body text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                    {featuredPost.description}
                  </p>
                  <span className="inline-flex items-center text-sm font-medium text-[hsl(var(--accent))] group-hover:gap-2 transition-[gap]">
                    Read Article
                    <ArrowRight aria-hidden="true" className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </article>
              </Link>

              {/* Post Grid */}
              <div className="grid md:grid-cols-2 gap-[var(--space-md)]">
                {gridPosts.map((post) => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="block group"
                  >
                    <article className="p-[var(--space-md)] bg-[hsl(var(--surface-low))] rounded-[var(--radius)] hover:shadow-[var(--shadow-float)] transition-shadow h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`text-[10px] font-semibold tracking-[0.2em] uppercase px-2 py-0.5 rounded-full ${categoryPillStyle(post.category)}`}>
                          {post.category}
                        </span>
                        <span className="text-caption text-muted-foreground flex items-center gap-1">
                          <Calendar aria-hidden="true" className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="text-caption text-muted-foreground">
                          {post.readTime} read
                        </span>
                      </div>
                      <h2 className="font-serif text-subheading text-[hsl(var(--primary))] tracking-tight mb-3 group-hover:text-[hsl(var(--accent))] transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-caption text-muted-foreground leading-relaxed mb-4">
                        {post.description}
                      </p>
                      <span className="inline-flex items-center text-sm font-medium text-[hsl(var(--accent))] group-hover:gap-2 transition-[gap]">
                        Read Article
                        <ArrowRight aria-hidden="true" className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-[var(--space-2xl)] bg-[hsl(var(--accent))]">
            <div className="container mx-auto px-4 text-center">
              <h2 className="font-serif text-heading text-[hsl(var(--primary))] tracking-tight mb-3" style={{ textWrap: 'balance' }}>
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
                  <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
