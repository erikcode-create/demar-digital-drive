# Scan Findings Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all findings from the website monitoring scans — dependencies, SEO, security headers, and accessibility.

**Architecture:** Direct fixes to existing files. Dependencies via npm audit. SEO via index.html meta tags, JSON-LD, sitemap/robots.txt, and component heading fixes. Security headers via CSP meta tag (GitHub Pages limitation — no custom HTTP headers). Accessibility via skip nav link, heading hierarchy fix, and copyright year update.

**Tech Stack:** React/TypeScript, Vite, GitHub Pages

**Note on security headers:** GitHub Pages does not support custom HTTP response headers. HSTS is automatically set for *.github.io domains. CSP can be added via `<meta http-equiv>` tag. Other headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) are not configurable on GitHub Pages — they will remain flagged by the scanner. If full header control is needed, the site would need to move to a host like Vercel, Netlify, or Cloudflare Pages.

---

## File Structure

```
Files to modify:
├── package.json                          # npm audit fix
├── index.html                            # SEO meta tags, OG tags, canonical, CSP, JSON-LD
├── public/robots.txt                     # NEW: robots.txt for crawlers
├── public/sitemap.xml                    # NEW: sitemap for SEO
├── src/components/Header.tsx             # Change H1 to div (heading hierarchy fix)
├── src/components/Hero.tsx               # Keep H1 here (primary page heading)
├── src/components/Footer.tsx             # Update copyright year, fix Privacy/ToS links
├── src/pages/Index.tsx                   # Add skip nav target
├── src/App.tsx                           # Add skip nav link
```

---

### Task 1: Fix dependency vulnerabilities

**Files:**
- Modify: `package.json` (via npm audit fix)

- [ ] **Step 1: Run npm audit to see current state**

Run: `npm audit`
Expected: List of vulnerabilities with severity levels.

- [ ] **Step 2: Run npm audit fix**

Run: `npm audit fix`
Expected: Some vulnerabilities resolved automatically.

- [ ] **Step 3: If high/critical remain, check what they are**

Run: `npm audit --json | node -e "const d=require('fs').readFileSync(0,'utf8');const j=JSON.parse(d);const v=j.metadata?.vulnerabilities||{};console.log('Critical:',v.critical||0,'High:',v.high||0,'Moderate:',v.moderate||0,'Low:',v.low||0)"`

If critical/high remain, run: `npm audit fix --force` (may include breaking changes — verify build after).

- [ ] **Step 4: Verify build still works**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "fix: resolve npm audit vulnerabilities"
```

---

### Task 2: Fix SEO meta tags and Open Graph

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace placeholder OG tags and add canonical + missing meta**

In `index.html`, replace the entire `<head>` content with:

```html
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="/lovable-uploads/d409271f-b234-4ccb-a60d-5adacce24eb6.png" type="image/png">
    <link rel="canonical" href="https://demartransportation.com/" />
    <title>DeMar Transportation - Professional Freight Transportation Services</title>
    <meta name="description" content="DeMar Transportation provides professional freight services including dry van, reefer, flatbed, and hazmat shipping. US-based carrier with competitive rates. Call (775) 230-4767." />

    <!-- Open Graph -->
    <meta property="og:title" content="DeMar Transportation - Professional Freight Services" />
    <meta property="og:description" content="US-based freight carrier providing dry van, reefer, flatbed, and hazmat transportation with competitive rates and 24/7 service." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://demartransportation.com/" />
    <meta property="og:image" content="https://demartransportation.com/lovable-uploads/d409271f-b234-4ccb-a60d-5adacce24eb6.png" />
    <meta property="og:site_name" content="DeMar Transportation" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="DeMar Transportation - Professional Freight Services" />
    <meta name="twitter:description" content="US-based freight carrier with competitive rates and 24/7 service." />
    <meta name="twitter:image" content="https://demartransportation.com/lovable-uploads/d409271f-b234-4ccb-a60d-5adacce24eb6.png" />

    <!-- Security -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-ancestors 'none';" />
</head>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "fix: update SEO meta tags, OG tags, canonical URL, and add CSP header"
```

---

### Task 3: Add JSON-LD structured data

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add JSON-LD script before closing `</head>`**

Add this just before `</head>` in `index.html`:

```html
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "TransportCompany",
      "name": "DeMar Transportation",
      "url": "https://demartransportation.com",
      "logo": "https://demartransportation.com/lovable-uploads/d409271f-b234-4ccb-a60d-5adacce24eb6.png",
      "description": "Professional freight transportation services including dry van, reefer, flatbed, and hazmat shipping.",
      "telephone": "+1-775-230-4767",
      "email": "info@DeMarTransportation.com",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US"
      },
      "areaServed": {
        "@type": "Country",
        "name": "United States"
      },
      "serviceType": ["Dry Van", "Reefer", "Flatbed", "Box Truck", "Sprinter Van", "Hazmat/Fuel"],
      "availableChannel": {
        "@type": "ServiceChannel",
        "servicePhone": {
          "@type": "ContactPoint",
          "telephone": "+1-775-230-4767",
          "contactType": "customer service",
          "availableLanguage": "English",
          "hoursAvailable": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            "opens": "00:00",
            "closes": "23:59"
          }
        }
      }
    }
    </script>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add JSON-LD structured data for TransportCompany"
```

---

### Task 4: Add robots.txt and sitemap.xml

**Files:**
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`

- [ ] **Step 1: Create public/robots.txt**

```
User-agent: *
Allow: /

Sitemap: https://demartransportation.com/sitemap.xml
```

- [ ] **Step 2: Create public/sitemap.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://demartransportation.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://demartransportation.com/quote</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://demartransportation.com/privacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://demartransportation.com/support</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

- [ ] **Step 3: Verify files are copied to dist**

Run: `npm run build && ls dist/robots.txt dist/sitemap.xml`
Expected: Both files exist in dist/.

- [ ] **Step 4: Commit**

```bash
git add public/robots.txt public/sitemap.xml
git commit -m "feat: add robots.txt and sitemap.xml for SEO"
```

---

### Task 5: Fix heading hierarchy (duplicate H1)

**Files:**
- Modify: `src/components/Header.tsx`

The page currently has two H1 tags: one in Header.tsx ("DeMar Transportation") and one in Hero.tsx ("DRIVEN BY PURPOSE..."). The Hero H1 is the real page heading. The Header H1 should be a styled span instead.

- [ ] **Step 1: In Header.tsx, change the H1 to a span**

Find this line in `src/components/Header.tsx`:
```tsx
<h1 className="text-lg md:text-xl font-bold">DeMar Transportation</h1>
```

Replace with:
```tsx
<span className="text-lg md:text-xl font-bold">DeMar Transportation</span>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.tsx
git commit -m "fix: change header company name from h1 to span (hero has the real h1)"
```

---

### Task 6: Add skip navigation link

**Files:**
- Modify: `src/pages/Index.tsx`

- [ ] **Step 1: Add skip nav link and main content ID to Index.tsx**

Replace the entire content of `src/pages/Index.tsx` with:

```tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Footer from "@/components/Footer";
import LandstarSidebar from "@/components/LandstarSidebar";

const Index = () => {
  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>
      <LandstarSidebar />
      <div className="md:ml-16">
        <Header />
        <main id="main-content">
          <Hero />
          <Services />
          <About />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Index.tsx
git commit -m "fix: add skip navigation link and main landmark for accessibility"
```

---

### Task 7: Fix copyright year and footer links

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Update copyright year from 2025 to 2026 and fix Privacy/ToS links**

In `src/components/Footer.tsx`, find:
```tsx
              © 2025 DeMar Transportation. All rights reserved.
```

Replace with:
```tsx
              © {new Date().getFullYear()} DeMar Transportation. All rights reserved.
```

Also find:
```tsx
              <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
```

Replace with:
```tsx
              <a href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="/support" className="hover:text-accent transition-colors">Terms of Service</a>
```

- [ ] **Step 2: Add Link import if not already present**

Check if `Link` from react-router-dom is imported in Footer.tsx. If not, the `<a href="/privacy">` tags work fine for full page navigation on a SPA with GitHub Pages (they trigger a full reload which the SPA catch-all handles). No import change needed.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "fix: dynamic copyright year, link Privacy/ToS to actual pages"
```

---

### Task 8: Run scan and verify improvements

**Files:** None (verification only)

- [ ] **Step 1: Build and verify no errors**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 2: Run local scan to check improvements**

Run: `cd monitoring && node run-scans.mjs --type lightweight`
Expected: Security and dependency scores should improve. Discord should show updated results.

- [ ] **Step 3: Push all changes**

Run: `git push`
Expected: Deploy workflow triggers, site updates on GitHub Pages.

- [ ] **Step 4: Wait for deploy, then run full scan**

After GitHub Pages deploys (~2 min), run:
`cd monitoring && node run-scans.mjs --type full`

Expected: Improved scores across all categories. Discord shows comprehensive results.

- [ ] **Step 5: Verify via GitHub Actions**

Run: `gh workflow run website-monitor.yml -f scan_type=full --repo erikcode-create/demar-digital-drive`
Expected: Workflow completes successfully, Discord shows scan results from CI.
