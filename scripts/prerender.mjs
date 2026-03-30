/**
 * Pre-render SPA routes to static HTML for SEO.
 *
 * After `npm run build`, this script:
 * 1. Serves the dist/ folder locally
 * 2. Visits each route with Playwright
 * 3. Saves the fully-rendered HTML to dist/<route>/index.html
 *
 * This gives each route a real HTML file so the server can serve
 * it with a 200 status code and search engines see the full content.
 */

import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = join(__dirname, '..', 'dist');

const routes = [
  '/about',
  '/contact',
  '/careers',
  '/faq',
  '/quote',
  '/privacy',
  '/support',
  '/services/dry-van',
  '/services/reefer',
  '/services/flatbed',
  '/services/box-truck',
  '/services/sprinter-van',
  '/services/hazmat',
  '/services/ftl',
  '/services/ltl',
  '/services/3pl',
  '/services/warehousing',
  '/resources',
  '/resources/freight-shipping-cost',
  '/resources/how-to-get-freight-quote',
  '/resources/how-to-choose-freight-carrier',
  '/resources/dry-van-vs-reefer',
  '/resources/ftl-vs-ltl',
  '/resources/hot-shot-vs-full-truckload',
  '/resources/types-of-freight-trailers',
  '/resources/how-to-ship-freight',
  '/resources/how-to-ship-refrigerated-goods',
  '/resources/how-to-ship-hazardous-materials',
  '/resources/oversized-load-shipping',
  '/resources/freight-classes-explained',
  '/resources/broker-vs-carrier-vs-3pl',
  '/resources/freight-shipping-glossary',
  '/resources/seasonal-freight-shipping',
  '/blog',
  '/blog/why-freight-quote-keeps-changing',
  '/blog/small-business-freight-shipping',
  '/blog/emergency-expedited-freight',
  '/blog/freight-damage-prevention',
  '/blog/ecommerce-freight-shipping',
];

// Simple static file server
function createStaticServer(dir) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain',
  };

  return createServer((req, res) => {
    let filePath = join(dir, req.url === '/' ? '/index.html' : req.url);

    // SPA fallback: if file doesn't exist, serve index.html
    if (!existsSync(filePath) || !extname(filePath)) {
      filePath = join(dir, 'index.html');
    }

    try {
      const content = readFileSync(filePath);
      const ext = extname(filePath);
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(content);
    } catch {
      const content = readFileSync(join(dir, 'index.html'));
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    }
  });
}

async function prerender() {
  console.log(`Pre-rendering ${routes.length} routes...`);

  // Start local server
  const server = createStaticServer(distDir);
  await new Promise(resolve => server.listen(4173, resolve));
  console.log('Local server running on http://localhost:4173');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  });

  let success = 0;
  let failed = 0;

  for (const route of routes) {
    try {
      const page = await context.newPage();
      await page.goto(`http://localhost:4173${route}`, {
        waitUntil: 'networkidle',
        timeout: 15000,
      });

      // Wait for React to render
      await page.waitForTimeout(1000);

      // Get the rendered HTML
      let html = await page.content();

      // Remove any scripts that modify history (the SPA redirect handler)
      // Keep the module script for hydration
      html = html.replace(
        /<script>\s*\(function\(l\)\s*\{[\s\S]*?\}\(window\.location\)\);\s*<\/script>/,
        ''
      );

      // Create directory structure
      const outputDir = join(distDir, route);
      mkdirSync(outputDir, { recursive: true });

      // Write the pre-rendered HTML
      writeFileSync(join(outputDir, 'index.html'), html);
      console.log(`  ✓ ${route}`);
      success++;

      await page.close();
    } catch (err) {
      console.log(`  ✗ ${route}: ${err.message}`);
      failed++;
    }
  }

  await browser.close();
  server.close();

  console.log(`\nDone: ${success} succeeded, ${failed} failed`);
}

prerender().catch(console.error);
