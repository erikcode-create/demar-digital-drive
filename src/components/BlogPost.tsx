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
import { Newspaper, Phone, ArrowRight, Calendar } from "lucide-react";

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

          {/* Hero with image background */}
          <section className="relative min-h-[520px] md:min-h-[600px] flex items-end overflow-hidden">
            {/* Background image */}
            {heroImage ? (
              <img
                src={heroImage}
                alt={heroImageAlt || title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
              />
            ) : (
              <div className="absolute inset-0 bg-[hsl(225_97%_4%)]" />
            )}
            {/* Gradient overlay — heavier at bottom for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />

            {/* Content pinned to bottom */}
            <div className="relative z-10 w-full pt-40 pb-12 md:pb-16 px-4">
              <div className="container mx-auto max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                  <Newspaper className="h-4 w-4 text-[hsl(var(--accent))]" />
                  <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/80">
                    {subtitle}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-5 drop-shadow-lg">
                  {title}
                </h1>
                <p className="text-base md:text-lg text-white/75 max-w-2xl leading-relaxed mb-5 drop-shadow-sm">
                  {description}
                </p>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(publishDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  <span>{readTime} read</span>
                </div>
              </div>
            </div>
          </section>

          {/* Article Body */}
          <section className="py-16 bg-[hsl(var(--surface))]">
            <div className="container mx-auto px-4 max-w-3xl">
              <article className="prose prose-lg max-w-none prose-headings:text-[hsl(var(--primary))] prose-headings:tracking-tight prose-h2:mt-12 prose-h2:mb-5 prose-h3:mt-8 prose-h3:mb-4 prose-p:text-[hsl(var(--muted-foreground))] prose-p:leading-relaxed prose-p:mb-6 prose-li:text-[hsl(var(--muted-foreground))] prose-strong:text-[hsl(var(--primary))] prose-a:text-[hsl(var(--accent))] prose-a:no-underline hover:prose-a:underline prose-table:text-sm prose-th:text-left prose-th:text-[hsl(var(--primary))] prose-th:font-semibold prose-th:pb-3 prose-th:border-b prose-th:border-[hsl(var(--surface-low))] prose-td:py-3 prose-td:border-b prose-td:border-[hsl(var(--surface-low))] prose-td:text-[hsl(var(--muted-foreground))]">
                {content}
              </article>
            </div>
          </section>

          {/* Inline CTA */}
          <section className="py-12 bg-[hsl(var(--surface-low))]">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="p-8 rounded-xl bg-white shadow-[var(--shadow-card)] text-center">
                <h2 className="text-2xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
                  Need a Freight Quote?
                </h2>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6 max-w-md mx-auto">
                  Get a free, no-obligation quote from DeMar Transportation.
                  We respond within 1 business hour.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="hero" size="lg" asChild>
                    <Link to="/quote" className="group">
                      Request a Quote
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-[hsl(var(--primary))] text-[hsl(var(--primary))]"
                    asChild
                  >
                    <a href="tel:+17752304767">
                      <Phone className="mr-2 h-4 w-4" />
                      (775) 230-4767
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* FAQs */}
          {faqs.length > 0 && (
            <section className="py-16 bg-[hsl(var(--surface))]">
              <div className="container mx-auto px-4 max-w-3xl">
                <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                  Common Questions
                </p>
                <h2 className="text-3xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                  Frequently Asked Questions
                </h2>
                <div className="rounded-xl bg-white shadow-[var(--shadow-card)]">
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`faq-${index}`}
                        className="border-b border-[hsl(var(--surface-low))] last:border-b-0 px-6"
                      >
                        <AccordionTrigger className="text-left text-base font-medium text-[hsl(var(--primary))] hover:no-underline py-5">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed pb-5">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </section>
          )}

          {/* Related Posts */}
          {relatedLinks && relatedLinks.length > 0 && (
            <section className="py-12 bg-[hsl(var(--surface-low))]">
              <div className="container mx-auto px-4 max-w-3xl">
                <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-4">
                  Related Articles
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {relatedLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="p-4 rounded-lg bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)] transition-all text-sm font-medium text-[hsl(var(--primary))] flex items-center justify-between group"
                    >
                      {link.label}
                      <ArrowRight className="h-4 w-4 text-[hsl(var(--accent))] transition-transform group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Bottom CTA */}
          <section className="py-16 bg-[hsl(var(--accent))]">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
                Ready to Ship?
              </h2>
              <p className="text-base text-[hsl(var(--primary))]/70 mb-8 max-w-md mx-auto">
                Tell us about your freight needs. No obligation, no hassle.
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

export default BlogPost;
