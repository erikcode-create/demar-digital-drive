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
            width={40}
            height={40}
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
                <Mail aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
                info@DeMarTransportation.com
              </a>
              <Link
                to="/contact"
                className="flex items-center gap-3 text-caption text-primary-foreground/40 hover:text-primary-foreground transition-colors"
              >
                <MapPin aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
                10471 Double R Blvd, Reno, NV
              </Link>
              <div className="flex items-center gap-3 text-caption text-primary-foreground/40">
                <Clock aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
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
