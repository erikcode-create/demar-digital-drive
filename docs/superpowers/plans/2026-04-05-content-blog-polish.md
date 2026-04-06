# Content & Blog Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply design foundation tokens to the blog index and BlogPost template, creating an editorial reading experience that cascades to all 14 blog posts without modifying individual post files.

**Architecture:** Two files modified — `Blog.tsx` gets a featured post + grid layout with category pills, `BlogPost.tsx` gets a light hero, prose overrides with serif headings, editorial related articles, and simplified inline CTA. All existing props interfaces, JSON-LD schemas, and content preserved.

**Tech Stack:** React, TypeScript, Tailwind CSS, design foundation tokens (font-serif, text-display/heading/subheading/body/caption, spacing vars, surface vars)

---

### Task 1: Rewrite Blog Index Page (Blog.tsx)

**Files:**
- Modify: `src/pages/Blog.tsx` (full rewrite, 309 lines → ~200 lines)

**Context:** The blog index currently has a dark hero and flat list of all posts. The spec calls for a light `surface` background hero, a featured post (first in array) as a full-width large card, remaining posts in a 2-column responsive grid, and category pills with color coding. All existing schema markup, meta tags, and post data array preserved exactly.

- [ ] **Step 1: Rewrite Blog.tsx with featured post + grid layout**

Replace the entire component with the new design. Keep the existing `blogPosts` array, `blogSchema`, `breadcrumbSchema`, `useEffect`, skip-to-content link, Header/Footer, and JSON-LD script tags exactly as they are. Replace only the JSX sections (hero, post list, CTA).

```tsx
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

          {/* Hero — light surface background */}
          <section className="pt-32 pb-[var(--space-2xl)] px-4 bg-[hsl(var(--surface))]">
            <div className="container mx-auto max-w-4xl">
              <h1 className="font-serif text-display text-[hsl(var(--primary))] mb-4">
                Insights
              </h1>
              <p className="text-body text-[hsl(var(--muted-foreground))] max-w-2xl">
                Freight shipping guides, industry analysis, and logistics expertise.
              </p>
            </div>
          </section>

          {/* Featured Post */}
          <section className="pb-[var(--space-xl)] bg-[hsl(var(--surface))]">
            <div className="container mx-auto px-4 max-w-4xl">
              <Link to={`/blog/${featuredPost.slug}`} className="block group">
                <article className="p-[var(--space-lg)] rounded-[var(--radius)] bg-[hsl(var(--surface-low))] hover:shadow-[var(--shadow-float)] transition-shadow">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full ${categoryPillStyle(featuredPost.category)}`}>
                      {featuredPost.category}
                    </span>
                    <span className="text-caption text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {new Date(featuredPost.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-caption text-[hsl(var(--muted-foreground))]">
                      {featuredPost.readTime} read
                    </span>
                  </div>
                  <h2 className="font-serif text-heading text-[hsl(var(--primary))] mb-3 group-hover:text-[hsl(var(--accent))] transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-body text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                    {featuredPost.description}
                  </p>
                  <span className="inline-flex items-center text-sm font-medium text-[hsl(var(--accent))] group-hover:gap-2 transition-all">
                    Read Article
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </article>
              </Link>
            </div>
          </section>

          {/* Post Grid — 2 columns on md+ */}
          <section className="pb-[var(--space-2xl)] bg-[hsl(var(--surface))]">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="grid md:grid-cols-2 gap-[var(--space-md)]">
                {gridPosts.map((post) => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="block group"
                  >
                    <article className="h-full p-[var(--space-md)] rounded-[var(--radius)] bg-[hsl(var(--surface-low))] hover:shadow-[var(--shadow-float)] transition-shadow">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full ${categoryPillStyle(post.category)}`}>
                          {post.category}
                        </span>
                        <span className="text-caption text-[hsl(var(--muted-foreground))] flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="text-caption text-[hsl(var(--muted-foreground))]">
                          {post.readTime} read
                        </span>
                      </div>
                      <h2 className="font-serif text-subheading text-[hsl(var(--primary))] mb-2 group-hover:text-[hsl(var(--accent))] transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-caption text-[hsl(var(--muted-foreground))] leading-relaxed">
                        {post.description}
                      </p>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Banner */}
          <section className="py-[var(--space-2xl)] bg-[hsl(var(--accent))]">
            <div className="container mx-auto px-4 text-center">
              <h2 className="font-serif text-heading text-[hsl(var(--primary))] mb-3">
                Ready to Ship?
              </h2>
              <p className="text-body text-[hsl(var(--primary))]/70 mb-8 max-w-md mx-auto">
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
```

Key changes from the current file:
- Hero: dark bg → light `surface` bg, `font-serif text-display` heading, `text-body text-muted-foreground` subtitle, removed badge/icon/dot pattern
- Featured post: first array item gets full-width card with `font-serif text-heading` title, `text-body` description, category pill + date + read time in `text-caption`
- Grid: remaining 12 posts in `md:grid-cols-2` with `font-serif text-subheading` titles, `text-caption text-muted-foreground` descriptions
- Category pills: inline rounded pill with category-based color tint via `categoryPillStyle` helper
- Cards: `surface-low` bg, `--radius` corners, `--space-lg` / `--space-md` padding, hover `--shadow-float`
- CTA: `font-serif text-heading` instead of raw `text-2xl font-bold`
- Removed: `Newspaper` import (no longer used)

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Clean build, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Blog.tsx
git commit -m "feat: redesign blog index with featured post, grid layout, category pills, design tokens"
```

---

### Task 2: Rewrite BlogPost Template (BlogPost.tsx)

**Files:**
- Modify: `src/components/BlogPost.tsx` (rewrite, 324 lines → ~280 lines)

**Context:** The BlogPost template currently has a dark hero with background image overlay, centered inline CTA with phone button, grid-based related links, and generic sans-serif headings. The spec calls for: light hero with hero image displayed as a rounded image below the title (not as background), prose overrides using font-serif for h2/h3, simplified inline CTA with accent left border and no phone button, editorial list related articles, and accent CTA banner. All existing props interface, JSON-LD schemas, and meta tag handling preserved exactly.

- [ ] **Step 1: Rewrite BlogPost.tsx with editorial styling**

Replace the entire component. Keep the existing `FAQItem` and `BlogPostProps` interfaces, all three schema objects, useEffect, skip-to-content link, Header/Footer, and JSON-LD script tags exactly as they are. Replace only the JSX sections.

```tsx
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, Calendar } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogPostProps {
  title: string;
  subtitle: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  publishDate: string;
  readTime: string;
  heroImage?: string;
  heroImageAlt?: string;
  content: React.ReactNode;
  faqs: FAQItem[];
  relatedLinks?: { label: string; to: string }[];
}

const BlogPost = ({
  title,
  subtitle,
  description,
  metaTitle,
  metaDescription,
  slug,
  publishDate,
  readTime,
  heroImage,
  heroImageAlt,
  content,
  faqs,
  relatedLinks,
}: BlogPostProps) => {
  useEffect(() => {
    document.title = metaTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", metaDescription);
    }
  }, [metaTitle, metaDescription]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: metaDescription,
    author: {
      "@type": "Organization",
      name: "DeMar Transportation",
      url: "https://demartransportation.com",
    },
    publisher: {
      "@type": "Organization",
      name: "DeMar Transportation",
      logo: {
        "@type": "ImageObject",
        url: "https://demartransportation.com/demar-logo-official.png",
      },
    },
    datePublished: publishDate,
    dateModified: publishDate,
    mainEntityOfPage: `https://demartransportation.com/blog/${slug}`,
    ...(heroImage && {
      image: {
        "@type": "ImageObject",
        url: `https://demartransportation.com${heroImage}`,
      },
    }),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
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
        name: "Insights",
        item: "https://demartransportation.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `https://demartransportation.com/blog/${slug}`,
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
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbSchema),
            }}
          />

          {/* Hero — light surface background */}
          <section className="pt-32 pb-[var(--space-xl)] px-4 bg-[hsl(var(--surface))]">
            <div className="container mx-auto max-w-3xl">
              <p className="text-caption font-semibold tracking-[0.15em] uppercase text-[hsl(var(--muted-foreground))] mb-4">
                {subtitle}
              </p>
              <h1 className="font-serif text-display text-[hsl(var(--primary))] mb-5">
                {title}
              </h1>
              <div className="flex items-center gap-4 text-caption text-[hsl(var(--muted-foreground))] mb-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(publishDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="w-1 h-1 rounded-full bg-[hsl(var(--muted-foreground))]/40" />
                <span>{readTime} read</span>
              </div>
              <p className="text-body text-[hsl(var(--muted-foreground))] max-w-2xl leading-relaxed">
                {description}
              </p>
              {heroImage && (
                <img
                  src={heroImage}
                  alt={heroImageAlt || title}
                  className="mt-[var(--space-lg)] w-full rounded-[var(--radius)] object-cover max-h-[480px]"
                  loading="eager"
                />
              )}
            </div>
          </section>

          {/* Article Body — prose overrides with serif headings */}
          <section className="py-[var(--space-2xl)] bg-[hsl(var(--surface))]">
            <div className="container mx-auto px-4 max-w-3xl">
              <article className="prose prose-lg max-w-none [&>h2]:font-serif [&>h2]:text-heading [&>h2]:text-[hsl(var(--primary))] [&>h2]:mt-[var(--space-xl)] [&>h2]:mb-5 [&>h3]:font-serif [&>h3]:text-subheading [&>h3]:text-[hsl(var(--primary))] [&>h3]:mt-[var(--space-lg)] [&>h3]:mb-4 [&>p]:text-body [&>p]:text-[hsl(var(--muted-foreground))] [&>p]:leading-relaxed [&>p]:mb-[var(--space-md)] prose-li:text-[hsl(var(--muted-foreground))] prose-strong:text-[hsl(var(--primary))] [&>a]:text-[hsl(var(--accent))] [&>a]:no-underline hover:[&>a]:underline prose-a:text-[hsl(var(--accent))] prose-a:no-underline hover:prose-a:underline prose-table:text-sm prose-th:text-left prose-th:text-[hsl(var(--primary))] prose-th:font-semibold prose-th:pb-3 prose-th:border-b prose-th:border-[hsl(var(--surface-low))] prose-td:py-3 prose-td:border-b prose-td:border-[hsl(var(--surface-low))] prose-td:text-[hsl(var(--muted-foreground))]">
                {content}
              </article>
            </div>
          </section>

          {/* Inline CTA — accent left border, no phone button */}
          <section className="py-[var(--space-xl)] bg-[hsl(var(--surface))]">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="p-[var(--space-lg)] rounded-[var(--radius)] bg-[hsl(var(--surface-low))] border-l-4 border-[hsl(var(--accent))]">
                <h2 className="font-serif text-subheading text-[hsl(var(--primary))] mb-3">
                  Need a Freight Quote?
                </h2>
                <p className="text-body text-[hsl(var(--muted-foreground))] mb-4">
                  Get a free, no-obligation quote from DeMar Transportation. We respond within 1 business hour.
                </p>
                <Link
                  to="/quote"
                  className="inline-flex items-center text-sm font-medium text-[hsl(var(--accent))] hover:underline group"
                >
                  Get a Quote
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </section>

          {/* FAQs */}
          {faqs.length > 0 && (
            <section className="py-[var(--space-2xl)] bg-[hsl(var(--surface))]">
              <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="font-serif text-heading text-[hsl(var(--primary))] mb-8">
                  Frequently Asked Questions
                </h2>
                <div className="rounded-[var(--radius)] bg-[hsl(var(--surface-low))]">
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`faq-${index}`}
                        className="border-b border-[hsl(var(--muted))]/20 last:border-b-0 px-6"
                      >
                        <AccordionTrigger className="text-left font-serif text-subheading text-[hsl(var(--primary))] hover:no-underline py-5">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-body text-[hsl(var(--muted-foreground))] leading-relaxed pb-5">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </section>
          )}

          {/* Related Articles — editorial list */}
          {relatedLinks && relatedLinks.length > 0 && (
            <section className="py-[var(--space-xl)] bg-[hsl(var(--surface))]">
              <div className="container mx-auto px-4 max-w-3xl">
                <h3 className="font-serif text-heading text-[hsl(var(--primary))] mb-6">
                  Related Articles
                </h3>
                <div className="space-y-[var(--space-md)]">
                  {relatedLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="flex items-center justify-between py-3 border-b border-[hsl(var(--muted))]/20 group"
                    >
                      <span className="font-serif text-subheading text-[hsl(var(--primary))] group-hover:text-[hsl(var(--accent))] transition-colors">
                        {link.label}
                      </span>
                      <ArrowRight className="h-4 w-4 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--accent))] transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Bottom CTA — accent background */}
          <section className="py-[var(--space-2xl)] bg-[hsl(var(--accent))]">
            <div className="container mx-auto px-4 text-center">
              <h2 className="font-serif text-heading text-[hsl(var(--primary))] mb-3">
                Ready to Ship?
              </h2>
              <p className="text-body text-[hsl(var(--primary))]/70 mb-8 max-w-md mx-auto">
                Tell us about your freight needs. No obligation, no hassle.
              </p>
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
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default BlogPost;
```

Key changes from the current file:
- Hero: dark bg with image overlay → light `surface` bg with text first, hero image as rounded `img` below title (not background). Removed `Newspaper`, `Phone` imports.
- Title: `text-3xl md:text-5xl font-bold` → `font-serif text-display`
- Subtitle: glassmorphic badge → `text-caption` uppercase tracking
- Meta line: preserved date + read time in `text-caption text-muted-foreground`
- Article body: prose overrides now use `[&>h2]:font-serif [&>h2]:text-heading` and `[&>h3]:font-serif [&>h3]:text-subheading` for serif headings, `[&>p]:text-body [&>p]:mb-[var(--space-md)]` for paragraph spacing
- Inline CTA: centered card with phone button → left-aligned `surface-low` box with `border-l-4 border-accent`, text link with arrow instead of buttons
- FAQ: `font-serif text-heading` section title, `font-serif text-subheading` questions, `text-body text-muted-foreground` answers, `surface-low` card bg
- Related articles: 2-column grid of cards → editorial stacked list with `font-serif text-subheading` titles + arrow, hover title color shifts to accent
- Bottom CTA: `font-serif text-heading` heading, single "Request a Quote" button

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Clean build, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/BlogPost.tsx
git commit -m "feat: redesign blog post template with light hero, serif headings, editorial styling"
```
