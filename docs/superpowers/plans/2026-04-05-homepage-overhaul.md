# Homepage Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign all 5 homepage sections (Hero, Services, About, ResourcesPreview, Footer) to use the new design foundation tokens with an editorial, typography-led aesthetic.

**Architecture:** Rewrite each component in place using the new `font-serif`/`font-sans` families, `text-display`/`text-heading`/`text-subheading` sizes, `--space-*` tokens, and refined accent color. No new files. No routing changes.

**Tech Stack:** React 18, TypeScript, Tailwind CSS 3.4 with custom design tokens, shadcn/ui Button, lucide-react icons, react-router-dom Link

**Spec:** `docs/superpowers/specs/2026-04-05-homepage-overhaul-spec.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/Hero.tsx` | Rewrite | Typography-led hero with trust strip, no background image |
| `src/components/Services.tsx` | Rewrite | Bento grid with tiered card sizes |
| `src/components/About.tsx` | Rewrite | Simplified two-column + CTA banner, no Apply form |
| `src/components/ResourcesPreview.tsx` | Rewrite | Editorial list layout, 3 items |
| `src/components/Footer.tsx` | Rewrite | Consolidated 3-column layout |

---

### Task 1: Rewrite Hero Section

**Files:**
- Modify: `src/components/Hero.tsx` (full rewrite, currently 136 lines)

**Context:** The Hero currently uses a background truck image (`heroTruck` import from `@/assets/hero-truck-plain.jpg`), floating feature cards, and a scroll indicator. The new design kills the image and replaces it with a typography-led split layout with a CSS geometric accent.

**Button variants available:** `hero` (gold bg, bold, shadow, scale hover), `cta` (gold bg, pulse glow), `outline`, `default`. Sizes: `default`, `sm`, `lg`, `xl` (h-14 px-10 text-lg).

- [ ] **Step 1: Rewrite Hero.tsx**

Replace the entire contents of `src/components/Hero.tsx` with:

```tsx
import { Button } from "@/components/ui/button";
import { Shield, Clock, Users, Truck, ArrowRight, Package, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const trustItems = [
  { icon: Package, label: "10+ Equipment Types" },
  { icon: Clock, label: "24/7 Availability" },
  { icon: MapPin, label: "48 States Covered" },
  { icon: Shield, label: "Safety First" },
  { icon: Phone, label: "24/7 Service" },
  { icon: Users, label: "US-Based Team" },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 py-space-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-space-xl items-center min-h-[70vh]">
          {/* Left — editorial text block (3/5 width) */}
          <div className="lg:col-span-3">
            {/* Badge */}
            <span className="inline-block text-caption font-sans font-medium tracking-[0.15em] uppercase text-muted-foreground mb-space-lg">
              Asset-Based Carrier &amp; Licensed Broker
            </span>

            {/* Headline */}
            <h1 className="font-serif text-display text-primary mb-space-lg">
              Driven by{" "}
              <span className="text-accent">Purpose.</span>
              <br />
              Delivering Results.
            </h1>

            <p className="font-sans text-body text-muted-foreground max-w-xl mb-space-xl leading-relaxed">
              Nationwide freight transportation with our own fleet and extended
              carrier network. One call connects you to every solution.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-space-md mb-space-lg">
              <Button variant="hero" size="xl" asChild>
                <Link to="/quote" className="group">
                  Request a Quote
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <a
                href="tel:+17752304767"
                className="inline-flex items-center gap-2 text-body font-medium text-primary hover:text-accent transition-colors py-3"
              >
                <Phone className="h-4 w-4" />
                Call (775) 230-4767
              </a>
            </div>
          </div>

          {/* Right — geometric accent (2/5 width) */}
          <div className="hidden lg:block lg:col-span-2 relative">
            <div className="aspect-square max-w-md ml-auto relative">
              {/* Layered geometric shapes */}
              <div className="absolute inset-0 rounded-[2rem] bg-primary rotate-3 opacity-90" />
              <div className="absolute inset-4 rounded-[1.5rem] bg-[hsl(220_85%_15%)] -rotate-2" />
              <div className="absolute inset-8 rounded-[1rem] bg-accent/10 rotate-1 flex items-center justify-center">
                <Truck className="h-24 w-24 text-accent/40" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="bg-[hsl(var(--surface-low))] border-t border-border">
        <div className="container mx-auto px-4 py-space-md">
          <div className="flex flex-wrap justify-center lg:justify-between gap-space-md lg:gap-space-sm">
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2 px-3 py-1">
                <item.icon className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-caption font-sans text-muted-foreground whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
```

- [ ] **Step 2: Verify build**

```bash
cd "/Users/erik/Library/CloudStorage/OneDrive-demarconsultinggroup.com/Claude/DeMar Transportation/DeMar Transportation/DeMar-Transportation-Website" && npm run build 2>&1 | tail -5
```

Expected: Build succeeds. The old `heroTruck` import is removed — if the asset file is now unreferenced, that's fine (tree shaking handles it).

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: rewrite Hero with typography-led layout and trust strip"
```

---

### Task 2: Rewrite Services Section

**Files:**
- Modify: `src/components/Services.tsx` (full rewrite, currently 136 lines)

**Context:** Currently a uniform 5-column grid of 10 identical cards. The new design uses a bento grid with 3 tiers: 2 large (Dry Van, Reefer), 3 medium (Flatbed, FTL, LTL), 5 compact (rest). All use the same `services` data array — just rendered differently based on index.

- [ ] **Step 1: Rewrite Services.tsx**

Replace the entire contents of `src/components/Services.tsx` with:

```tsx
import { Button } from "@/components/ui/button";
import {
  Truck,
  Package,
  Snowflake,
  Building,
  Car,
  Wrench,
  Container,
  Layers,
  Network,
  Warehouse,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Package,
    title: "Dry Van",
    slug: "dry-van",
    description: "Standard enclosed trailers for general freight and cargo protection across all 48 states.",
  },
  {
    icon: Snowflake,
    title: "Reefer",
    slug: "reefer",
    description: "Temperature-controlled transport for perishable goods with real-time monitoring.",
  },
  {
    icon: Truck,
    title: "Flatbed",
    slug: "flatbed",
    description: "Open trailers for oversized loads and heavy equipment.",
  },
  {
    icon: Container,
    title: "Full Truckload",
    slug: "ftl",
    description: "Dedicated trailers for 10,000+ lb shipments, direct delivery.",
  },
  {
    icon: Layers,
    title: "LTL Shipping",
    slug: "ltl",
    description: "Cost-effective less-than-truckload for smaller freight.",
  },
  {
    icon: Building,
    title: "Box Truck",
    slug: "box-truck",
    description: "Smaller loads and local deliveries.",
  },
  {
    icon: Car,
    title: "Sprinter Van",
    slug: "sprinter-van",
    description: "Expedited small shipments.",
  },
  {
    icon: Wrench,
    title: "Hazmat/Fuel",
    slug: "hazmat",
    description: "Certified hazardous materials.",
  },
  {
    icon: Network,
    title: "3PL Services",
    slug: "3pl",
    description: "Full logistics management.",
  },
  {
    icon: Warehouse,
    title: "Warehousing",
    slug: "warehousing",
    description: "Storage and fulfillment.",
  },
];

// Tier splits: indices 0-1 large, 2-4 medium, 5-9 compact
const large = services.slice(0, 2);
const medium = services.slice(2, 5);
const compact = services.slice(5);

const Services = () => {
  return (
    <section id="services" className="py-space-2xl bg-[hsl(var(--surface))]">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="max-w-2xl mb-space-xl">
          <h2 className="font-serif text-heading text-primary mb-space-sm">
            Full-Spectrum Freight, One Partner
          </h2>
          <p className="font-sans text-body text-muted-foreground max-w-lg">
            From dry van to hazmat, FTL to warehousing. Every shipping solution
            under one roof.
          </p>
        </div>

        {/* Large cards — top tier */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mb-space-md">
          {large.map((service) => (
            <Link key={service.slug} to={`/services/${service.slug}`} className="group">
              <div className="h-full p-space-lg rounded-[var(--radius)] bg-[hsl(var(--surface-low))] hover:shadow-[var(--shadow-float)] transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-space-md">
                  <service.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-serif text-subheading text-primary mb-space-sm">
                  {service.title}
                </h3>
                <p className="text-body text-muted-foreground leading-relaxed mb-space-md">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-1 text-caption font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Medium cards — second tier */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md mb-space-md">
          {medium.map((service) => (
            <Link key={service.slug} to={`/services/${service.slug}`} className="group">
              <div className="h-full p-space-lg rounded-[var(--radius)] bg-[hsl(var(--surface-low))] hover:shadow-[var(--shadow-float)] transition-all duration-300">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-space-sm">
                  <service.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-serif text-subheading text-primary mb-1">
                  {service.title}
                </h3>
                <p className="text-caption text-muted-foreground leading-relaxed mb-space-sm">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-1 text-caption font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Compact cards — third tier */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-space-sm mb-space-xl">
          {compact.map((service) => (
            <Link key={service.slug} to={`/services/${service.slug}`} className="group">
              <div className="h-full p-space-md rounded-[var(--radius)] bg-[hsl(var(--surface-low))] hover:shadow-[var(--shadow-float)] transition-all duration-300 text-center">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 mb-space-xs">
                  <service.icon className="h-4 w-4 text-accent" />
                </div>
                <h3 className="text-sm font-bold text-primary">
                  {service.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Button asChild variant="hero" size="xl">
            <Link to="/quote" className="group">
              Get a Free Quote
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
```

- [ ] **Step 2: Verify build**

```bash
cd "/Users/erik/Library/CloudStorage/OneDrive-demarconsultinggroup.com/Claude/DeMar Transportation/DeMar Transportation/DeMar-Transportation-Website" && npm run build 2>&1 | tail -5
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Services.tsx
git commit -m "feat: rewrite Services with bento grid and tiered card sizes"
```

---

### Task 3: Rewrite About Section

**Files:**
- Modify: `src/components/About.tsx` (full rewrite, currently 183 lines)

**Context:** Currently has 3 sub-sections: dark "Why Choose Us" with 4 cards, About+Apply two-column, and CTA banner. The new design removes the "Why Choose Us" section (merged into hero trust strip), removes the Apply form (belongs on /careers), simplifies About to two-column content, and keeps a simplified CTA banner.

- [ ] **Step 1: Rewrite About.tsx**

Replace the entire contents of `src/components/About.tsx` with:

```tsx
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  "Competitive rates, no hidden fees",
  "English-speaking drivers & dispatch",
  "Nationwide coverage, 48 contiguous states",
  "MC + Broker dual authority",
  "Real-time communication",
  "DOT compliant operations",
];

const About = () => {
  return (
    <>
      {/* About content */}
      <section id="about" className="py-space-2xl bg-[hsl(var(--surface))]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-space-xl items-start">
            {/* Left — content (3/5) */}
            <div className="lg:col-span-3">
              <h2 className="font-serif text-heading text-primary mb-space-lg">
                One Partner for All Your Freight
              </h2>

              <p className="text-body text-muted-foreground leading-relaxed mb-space-md">
                DeMar Transportation combines the reliability of an asset-based
                carrier with the capacity flexibility of a licensed broker.
                Professional communication, competitive rates, and a team that
                answers the phone.
              </p>

              <p className="text-body text-muted-foreground leading-relaxed mb-space-lg">
                Whether you need a single dry van or a complex multi-modal
                solution, we handle the logistics so you can focus on your
                business.
              </p>

              {/* Pull quote */}
              <div className="border-l-4 border-accent pl-space-md py-space-sm mb-space-xl">
                <p className="font-serif text-subheading italic text-primary">
                  "We don't oversell. We deliver. Your freight is our reputation."
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start gap-space-md">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/quote" className="group">
                    Request a Quote
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <a
                  href="tel:+17752304767"
                  className="inline-flex items-center gap-2 text-body font-medium text-primary hover:text-accent transition-colors py-2"
                >
                  Call (775) 230-4767
                </a>
              </div>
            </div>

            {/* Right — feature checklist (2/5) */}
            <div className="lg:col-span-2">
              <div className="space-y-space-sm">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-body text-primary">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-space-xl bg-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-heading text-accent-foreground mb-space-md">
            Ready to Ship?
          </h2>
          <p className="text-body text-accent-foreground/70 mb-space-lg max-w-md mx-auto">
            Get a free quote in minutes. One call connects you to our fleet and
            network.
          </p>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            asChild
          >
            <Link to="/quote" className="group">
              Request a Quote
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default About;
```

- [ ] **Step 2: Verify build**

```bash
cd "/Users/erik/Library/CloudStorage/OneDrive-demarconsultinggroup.com/Claude/DeMar Transportation/DeMar Transportation/DeMar-Transportation-Website" && npm run build 2>&1 | tail -5
```

Expected: Build succeeds. The `ApplyToDriveForm` import is removed — the component itself remains in the codebase for the /careers page but is no longer rendered on the homepage.

- [ ] **Step 3: Commit**

```bash
git add src/components/About.tsx
git commit -m "feat: simplify About section, remove Apply form and Why Choose Us"
```

---

### Task 4: Rewrite ResourcesPreview

**Files:**
- Modify: `src/components/ResourcesPreview.tsx` (full rewrite, currently 105 lines)

**Context:** Currently a 2-column grid of 4 card-style resources. The new design uses an editorial list of 3 items (dropped "Types of Freight Trailers") with a horizontal row layout.

- [ ] **Step 1: Rewrite ResourcesPreview.tsx**

Replace the entire contents of `src/components/ResourcesPreview.tsx` with:

```tsx
import { Link } from "react-router-dom";
import { ArrowRight, DollarSign, Scale, BookOpen } from "lucide-react";

const featuredResources = [
  {
    title: "How Much Does Freight Shipping Cost?",
    description: "2026 pricing guide with per-mile rates, cost factors, and tips to reduce your freight spend.",
    to: "/resources/freight-shipping-cost",
    icon: DollarSign,
  },
  {
    title: "FTL vs LTL: How to Choose",
    description: "When full truckload beats less-than-truckload. Cost breakpoints and decision guide.",
    to: "/resources/ftl-vs-ltl",
    icon: Scale,
  },
  {
    title: "How to Ship Freight: Beginner's Guide",
    description: "End-to-end process from getting a quote to confirming delivery.",
    to: "/resources/how-to-ship-freight",
    icon: BookOpen,
  },
];

const ResourcesPreview = () => {
  return (
    <section className="py-space-2xl bg-[hsl(var(--surface-low))]">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-end justify-between mb-space-xl">
          <h2 className="font-serif text-heading text-primary">
            Freight Shipping Guides
          </h2>
          <Link
            to="/resources"
            className="hidden sm:inline-flex items-center gap-1 text-caption font-medium text-primary hover:text-accent transition-colors group"
          >
            All Resources
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="space-y-space-md">
          {featuredResources.map((resource) => (
            <Link
              key={resource.to}
              to={resource.to}
              className="group flex items-start gap-space-md p-space-md rounded-[var(--radius)] bg-background hover:shadow-[var(--shadow-float)] transition-all duration-300"
            >
              <div className="flex-shrink-0 p-2.5 rounded-lg bg-[hsl(var(--surface-container))]">
                <resource.icon className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-subheading text-primary mb-1 group-hover:text-accent transition-colors">
                  {resource.title}
                </h3>
                <p className="text-caption text-muted-foreground leading-relaxed">
                  {resource.description}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-accent flex-shrink-0 mt-1 transition-colors" />
            </Link>
          ))}
        </div>

        <div className="mt-space-lg sm:hidden text-center">
          <Link
            to="/resources"
            className="inline-flex items-center gap-1 text-caption font-medium text-primary hover:text-accent transition-colors"
          >
            View All Resources
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ResourcesPreview;
```

- [ ] **Step 2: Verify build**

```bash
cd "/Users/erik/Library/CloudStorage/OneDrive-demarconsultinggroup.com/Claude/DeMar Transportation/DeMar Transportation/DeMar-Transportation-Website" && npm run build 2>&1 | tail -5
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/ResourcesPreview.tsx
git commit -m "feat: rewrite ResourcesPreview as editorial list with 3 items"
```

---

### Task 5: Rewrite Footer

**Files:**
- Modify: `src/components/Footer.tsx` (full rewrite, currently 220 lines)

**Context:** Currently 6 columns (Company, Services, Quick Links, Resources, Insights, Contact). The new design consolidates to 3 columns: Services, Company & Resources (merged), Contact (with prominent phone number). Blog links and resource links are deduplicated.

- [ ] **Step 1: Rewrite Footer.tsx**

Replace the entire contents of `src/components/Footer.tsx` with:

```tsx
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const serviceLinks = [
  { name: "Dry Van", path: "/services/dry-van" },
  { name: "Reefer", path: "/services/reefer" },
  { name: "Flatbed", path: "/services/flatbed" },
  { name: "Box Truck", path: "/services/box-truck" },
  { name: "Sprinter Van", path: "/services/sprinter-van" },
  { name: "Hazmat/Fuel", path: "/services/hazmat" },
  { name: "Full Truckload", path: "/services/ftl" },
  { name: "LTL Shipping", path: "/services/ltl" },
  { name: "3PL Services", path: "/services/3pl" },
  { name: "Warehousing", path: "/services/warehousing" },
];

const companyAndResources = [
  { name: "About Us", path: "/about" },
  { name: "Careers", path: "/careers" },
  { name: "Contact", path: "/contact" },
  { name: "FAQ", path: "/faq" },
  { name: "Get a Quote", path: "/quote" },
  { name: "Freight Shipping Cost", path: "/resources/freight-shipping-cost" },
  { name: "FTL vs LTL Guide", path: "/resources/ftl-vs-ltl" },
  { name: "How to Ship Freight", path: "/resources/how-to-ship-freight" },
  { name: "All Resources", path: "/resources" },
];

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-space-xl">
        {/* Logo + description above columns */}
        <div className="flex items-center gap-3 mb-space-xl">
          <img
            src="/demar-logo-official.png"
            alt="DeMar Transportation"
            className="h-10 w-10"
          />
          <div>
            <span className="text-body font-bold tracking-tight">
              DeMar
              <span className="text-accent"> Transportation</span>
            </span>
            <p className="text-caption text-primary-foreground/40">
              Asset-based carrier &amp; licensed broker. Nationwide freight solutions.
            </p>
          </div>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xl mb-space-xl">
          {/* Column 1 — Services */}
          <div>
            <p className="text-caption font-semibold tracking-[0.15em] uppercase text-accent mb-space-md">
              Services
            </p>
            <ul className="space-y-2.5">
              {serviceLinks.map((s) => (
                <li key={s.path}>
                  <Link
                    to={s.path}
                    className="text-caption text-primary-foreground/40 hover:text-primary-foreground transition-colors"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 — Company & Resources */}
          <div>
            <p className="text-caption font-semibold tracking-[0.15em] uppercase text-accent mb-space-md">
              Company &amp; Resources
            </p>
            <ul className="space-y-2.5">
              {companyAndResources.map((l) => (
                <li key={l.path}>
                  <Link
                    to={l.path}
                    className="text-caption text-primary-foreground/40 hover:text-primary-foreground transition-colors"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <p className="text-caption font-semibold tracking-[0.15em] uppercase text-accent mb-space-md">
              Contact
            </p>
            <div className="space-y-space-md">
              {/* Phone — prominent */}
              <a
                href="tel:+17752304767"
                className="block font-serif text-subheading text-primary-foreground hover:text-accent transition-colors"
              >
                (775) 230-4767
              </a>
              <a
                href="mailto:info@DeMarTransportation.com"
                className="flex items-center gap-3 text-caption text-primary-foreground/40 hover:text-primary-foreground transition-colors"
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                info@DeMarTransportation.com
              </a>
              <Link
                to="/contact"
                className="flex items-center gap-3 text-caption text-primary-foreground/40 hover:text-primary-foreground transition-colors"
              >
                <MapPin className="h-4 w-4 flex-shrink-0" />
                10471 Double R Blvd, Reno, NV
              </Link>
              <div className="flex items-center gap-3 text-caption text-primary-foreground/40">
                <Clock className="h-4 w-4 flex-shrink-0" />
                24/7 Service Available
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-space-md border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-caption text-primary-foreground/25">
              &copy; {new Date().getFullYear()} DeMar Transportation. All rights
              reserved.
            </p>
            <div className="flex gap-6 text-caption text-primary-foreground/25">
              <Link
                to="/privacy"
                className="hover:text-primary-foreground/50 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/support"
                className="hover:text-primary-foreground/50 transition-colors"
              >
                Terms
              </Link>
              <a
                href="https://www.carriersource.io/carriers/demar-transportation-4392091"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-foreground/50 transition-colors"
              >
                DOT Information
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

- [ ] **Step 2: Verify build**

```bash
cd "/Users/erik/Library/CloudStorage/OneDrive-demarconsultinggroup.com/Claude/DeMar Transportation/DeMar Transportation/DeMar-Transportation-Website" && npm run build 2>&1 | tail -5
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: consolidate Footer to 3-column layout with prominent phone"
```

---

### Task 6: Final Verification

- [ ] **Step 1: Full build**

```bash
cd "/Users/erik/Library/CloudStorage/OneDrive-demarconsultinggroup.com/Claude/DeMar Transportation/DeMar Transportation/DeMar-Transportation-Website" && npm run build
```

Expected: Clean build, no errors or warnings.

- [ ] **Step 2: Run unit tests**

```bash
cd "/Users/erik/Library/CloudStorage/OneDrive-demarconsultinggroup.com/Claude/DeMar Transportation/DeMar Transportation/DeMar-Transportation-Website" && npm run test 2>&1 | tail -15
```

Expected: No NEW test failures (pre-existing 4 failures from revision-loop/content-validator are acceptable).

- [ ] **Step 3: Start dev server**

```bash
cd "/Users/erik/Library/CloudStorage/OneDrive-demarconsultinggroup.com/Claude/DeMar Transportation/DeMar Transportation/DeMar-Transportation-Website" && timeout 10 npm run dev 2>&1 | head -5
```

Expected: Dev server starts on port 8080 without errors.
