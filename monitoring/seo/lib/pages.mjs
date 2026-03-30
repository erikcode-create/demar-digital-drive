import "dotenv/config";

export const SITE_URL = "https://demartransportation.com";

const PAGES = [
  // Core
  { path: "/", name: "Home", type: "core" },
  { path: "/about", name: "About", type: "core" },
  { path: "/contact", name: "Contact", type: "core" },
  { path: "/quote", name: "Get a Quote", type: "core" },
  { path: "/careers", name: "Careers", type: "core" },
  { path: "/faq", name: "FAQ", type: "core" },
  { path: "/privacy", name: "Privacy Policy", type: "core" },
  { path: "/support", name: "Support", type: "core" },

  // Services
  { path: "/services/dry-van", name: "Dry Van", type: "service" },
  { path: "/services/reefer", name: "Reefer", type: "service" },
  { path: "/services/flatbed", name: "Flatbed", type: "service" },
  { path: "/services/box-truck", name: "Box Truck", type: "service" },
  { path: "/services/sprinter-van", name: "Sprinter Van", type: "service" },
  { path: "/services/hazmat", name: "Hazmat", type: "service" },
  { path: "/services/ftl", name: "Full Truckload", type: "service" },
  { path: "/services/ltl", name: "Less Than Truckload", type: "service" },
  { path: "/services/3pl", name: "3PL", type: "service" },
  { path: "/services/warehousing", name: "Warehousing", type: "service" },

  // Resources
  { path: "/resources", name: "Resources", type: "resource" },
  { path: "/resources/freight-shipping-cost", name: "Freight Shipping Cost", type: "resource" },
  { path: "/resources/how-to-get-freight-quote", name: "How to Get a Freight Quote", type: "resource" },
  { path: "/resources/how-to-choose-freight-carrier", name: "How to Choose a Freight Carrier", type: "resource" },
  { path: "/resources/dry-van-vs-reefer", name: "Dry Van vs Reefer", type: "resource" },
  { path: "/resources/ftl-vs-ltl", name: "FTL vs LTL", type: "resource" },
  { path: "/resources/hot-shot-vs-full-truckload", name: "Hot Shot vs Full Truckload", type: "resource" },
  { path: "/resources/types-of-freight-trailers", name: "Types of Freight Trailers", type: "resource" },
  { path: "/resources/how-to-ship-freight", name: "How to Ship Freight", type: "resource" },
  { path: "/resources/how-to-ship-refrigerated-goods", name: "How to Ship Refrigerated Goods", type: "resource" },
  { path: "/resources/how-to-ship-hazardous-materials", name: "How to Ship Hazardous Materials", type: "resource" },
  { path: "/resources/oversized-load-shipping", name: "Oversized Load Shipping", type: "resource" },
  { path: "/resources/freight-classes-explained", name: "Freight Classes Explained", type: "resource" },
  { path: "/resources/broker-vs-carrier-vs-3pl", name: "Broker vs Carrier vs 3PL", type: "resource" },
  { path: "/resources/freight-shipping-glossary", name: "Freight Shipping Glossary", type: "resource" },
  { path: "/resources/seasonal-freight-shipping", name: "Seasonal Freight Shipping", type: "resource" },

  // Blog
  { path: "/blog", name: "Blog", type: "blog" },
  { path: "/blog/why-freight-quote-keeps-changing", name: "Why Your Freight Quote Keeps Changing", type: "blog" },
  { path: "/blog/small-business-freight-shipping", name: "Small Business Freight Shipping", type: "blog" },
  { path: "/blog/emergency-expedited-freight", name: "Emergency Expedited Freight", type: "blog" },
  { path: "/blog/freight-damage-prevention", name: "Freight Damage Prevention", type: "blog" },
  { path: "/blog/ecommerce-freight-shipping", name: "Ecommerce Freight Shipping", type: "blog" },
];

/**
 * Returns all pages on the site with their path, name, type, and full URL.
 * @returns {Array<{ path: string, name: string, type: string, url: string }>}
 */
export function getAllPages() {
  return PAGES.map((page) => ({
    ...page,
    url: `${SITE_URL}${page.path}`,
  }));
}
