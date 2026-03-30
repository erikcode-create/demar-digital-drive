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

const quickLinks = [
  { name: "About Us", path: "/about" },
  { name: "Careers", path: "/careers" },
  { name: "Contact", path: "/contact" },
  { name: "FAQ", path: "/faq" },
  { name: "Get a Quote", path: "/quote" },
];

const resourceLinks = [
  { name: "Freight Shipping Cost Guide", path: "/resources/freight-shipping-cost" },
  { name: "How to Ship Freight", path: "/resources/how-to-ship-freight" },
  { name: "FTL vs LTL Guide", path: "/resources/ftl-vs-ltl" },
  { name: "Types of Trailers", path: "/resources/types-of-freight-trailers" },
  { name: "Freight Glossary", path: "/resources/freight-shipping-glossary" },
  { name: "All Resources", path: "/resources" },
];

const blogLinks = [
  { name: "Why Freight Quotes Change", path: "/blog/why-freight-quote-keeps-changing" },
  { name: "Small Business Freight", path: "/blog/small-business-freight-shipping" },
  { name: "Emergency Freight Shipping", path: "/blog/emergency-expedited-freight" },
  { name: "Freight Damage Prevention", path: "/blog/freight-damage-prevention" },
  { name: "E-commerce Freight", path: "/blog/ecommerce-freight-shipping" },
  { name: "All Insights", path: "/blog" },
];

const Footer = () => {
  return (
    <footer className="bg-[hsl(225_97%_4%)] text-white">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          {/* Company */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/demar-logo-official.png"
                alt="DeMar Transportation"
                className="h-10 w-10"
              />
              <div>
                <span className="text-base font-bold tracking-tight">
                  DeMar
                  <span className="text-[hsl(var(--accent))]"> Transportation</span>
                </span>
              </div>
            </div>
            <p className="text-sm text-white/40 leading-relaxed mb-6 max-w-xs">
              Asset-based freight carrier and licensed broker providing
              nationwide transportation solutions.
            </p>
            <p className="text-[10px] tracking-[0.15em] uppercase text-white/25">
              Driven by Purpose. Delivering Results.
            </p>
          </div>

          {/* Services — two columns on larger screens */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[hsl(var(--accent))] mb-4">
              Services
            </p>
            <ul className="space-y-2.5">
              {serviceLinks.map((s) => (
                <li key={s.path}>
                  <Link
                    to={s.path}
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[hsl(var(--accent))] mb-4">
              Company
            </p>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.path}>
                  <Link
                    to={l.path}
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[hsl(var(--accent))] mb-4">
              Resources
            </p>
            <ul className="space-y-2.5">
              {resourceLinks.map((r) => (
                <li key={r.path}>
                  <Link
                    to={r.path}
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[hsl(var(--accent))] mb-4">
              Blog
            </p>
            <ul className="space-y-2.5">
              {blogLinks.map((b) => (
                <li key={b.path}>
                  <Link
                    to={b.path}
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[hsl(var(--accent))] mb-4">
              Contact
            </p>
            <div className="space-y-3">
              <a
                href="tel:+17752304767"
                className="flex items-center gap-3 text-sm text-white/40 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 flex-shrink-0" />
                (775) 230-4767
              </a>
              <a
                href="mailto:info@DeMarTransportation.com"
                className="flex items-center gap-3 text-sm text-white/40 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                info@DeMarTransportation.com
              </a>
              <Link
                to="/contact"
                className="flex items-center gap-3 text-sm text-white/40 hover:text-white transition-colors"
              >
                <MapPin className="h-4 w-4 flex-shrink-0" />
                10471 Double R Blvd, Reno, NV
              </Link>
              <div className="flex items-center gap-3 text-sm text-white/40">
                <Clock className="h-4 w-4 flex-shrink-0" />
                24/7 Service Available
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar — tonal separation, no border */}
        <div className="pt-8 bg-white/[0.02] -mx-4 px-4 rounded-t-xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/25">
              &copy; {new Date().getFullYear()} DeMar Transportation. All rights
              reserved.
            </p>
            <div className="flex gap-6 text-xs text-white/25">
              <Link
                to="/privacy"
                className="hover:text-white/50 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/support"
                className="hover:text-white/50 transition-colors"
              >
                Terms
              </Link>
              <a
                href="https://www.carriersource.io/carriers/demar-transportation-4392091"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/50 transition-colors"
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
