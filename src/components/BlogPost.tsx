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

          {/* Hero — light surface with text above image */}
          <section className="pt-32 pb-[var(--space-xl)] px-4 bg-[hsl(var(--surface))]">
            <div className="container mx-auto max-w-3xl">
              <p className="text-caption font-semibold tracking-[0.15em] uppercase text-[hsl(var(--muted-foreground))] mb-4">
                {subtitle}
              </p>
              <h1 className="font-serif text-display text-[hsl(var(--primary))] mb-5 text-balance">
                {title}
              </h1>
              <div className="flex items-center gap-4 text-caption text-[hsl(var(--muted-foreground))] mb-5">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
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
                  width={1200}
                  height={480}
                />
              )}
            </div>
          </section>

          {/* Article Body */}
          <section className="py-[var(--space-2xl)] bg-[hsl(var(--surface))]">
            <div className="container mx-auto px-4 max-w-3xl">
              <article className="prose prose-lg max-w-none [&>h2]:font-serif [&>h2]:text-heading [&>h2]:text-[hsl(var(--primary))] [&>h2]:mt-[var(--space-xl)] [&>h2]:mb-5 [&>h3]:font-serif [&>h3]:text-subheading [&>h3]:text-[hsl(var(--primary))] [&>h3]:mt-[var(--space-lg)] [&>h3]:mb-4 [&>p]:text-body [&>p]:text-[hsl(var(--muted-foreground))] [&>p]:leading-relaxed [&>p]:mb-[var(--space-md)] prose-li:text-[hsl(var(--muted-foreground))] prose-strong:text-[hsl(var(--primary))] prose-a:text-[hsl(var(--accent))] prose-a:no-underline hover:prose-a:underline prose-table:text-sm prose-th:text-left prose-th:text-[hsl(var(--primary))] prose-th:font-semibold prose-th:pb-3 prose-th:border-b prose-th:border-[hsl(var(--surface-low))] prose-td:py-3 prose-td:border-b prose-td:border-[hsl(var(--surface-low))] prose-td:text-[hsl(var(--muted-foreground))]">
                {content}
              </article>
            </div>
          </section>

          {/* Inline CTA */}
          <section className="py-[var(--space-xl)] bg-[hsl(var(--surface))]">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="p-[var(--space-lg)] rounded-[var(--radius)] bg-[hsl(var(--surface-low))] border-l-4 border-[hsl(var(--accent))]">
                <h2 className="font-serif text-subheading text-[hsl(var(--primary))] mb-3">
                  Need a Freight Quote?
                </h2>
                <p className="text-body text-[hsl(var(--muted-foreground))] mb-4">
                  Get a free, no-obligation quote from DeMar Transportation.
                  We respond within 1 business hour.
                </p>
                <Link
                  to="/quote"
                  className="inline-flex items-center gap-2 text-body font-semibold text-[hsl(var(--accent))] hover:underline group"
                >
                  Get a Quote
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
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
                        <AccordionTrigger className="text-left hover:no-underline py-5">
                          <span className="font-serif text-subheading text-[hsl(var(--primary))]">
                            {faq.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-5">
                          <p className="text-body text-[hsl(var(--muted-foreground))] leading-relaxed">
                            {faq.answer}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </section>
          )}

          {/* Related Articles */}
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
                      <ArrowRight className="h-4 w-4 text-[hsl(var(--accent))] transition-transform group-hover:translate-x-1 shrink-0 ml-4" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Bottom CTA */}
          <section className="py-[var(--space-2xl)] bg-[hsl(var(--accent))]">
            <div className="container mx-auto px-4 text-center">
              <h2 className="font-serif text-heading text-[hsl(var(--primary))] mb-3 text-balance">
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
                  Get a Free Quote
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
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
