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
import { HelpCircle, Phone, ArrowRight } from "lucide-react";

interface FAQItem {
  question: string;
  answer: JSX.Element;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    title: "General",
    items: [
      {
        question: "What services does DeMar Transportation offer?",
        answer: (
          <p>
            DeMar Transportation provides a full range of freight services
            including{" "}
            <Link to="/services/dry-van" className="text-[hsl(var(--accent))] hover:underline">
              dry van
            </Link>
            ,{" "}
            <Link to="/services/reefer" className="text-[hsl(var(--accent))] hover:underline">
              refrigerated (reefer)
            </Link>
            ,{" "}
            <Link to="/services/flatbed" className="text-[hsl(var(--accent))] hover:underline">
              flatbed
            </Link>
            , and{" "}
            <Link to="/services/sprinter-van" className="text-[hsl(var(--accent))] hover:underline">
              hot shot delivery
            </Link>{" "}
            services. We handle everything from full truckload shipments to
            time-critical expedited freight across the western United States.
          </p>
        ),
      },
      {
        question: "Where does DeMar Transportation operate?",
        answer: (
          <p>
            We are headquartered in Reno, Nevada and primarily serve the western
            United States, with strong coverage along the I-80 corridor and
            throughout Nevada, California, Oregon, Washington, Utah, and Arizona.
            For specific route availability,{" "}
            <Link to="/contact" className="text-[hsl(var(--accent))] hover:underline">
              contact our dispatch team
            </Link>
            .
          </p>
        ),
      },
      {
        question: "How do I get a freight quote?",
        answer: (
          <p>
            You can request a free, no-obligation freight quote by visiting our{" "}
            <Link to="/quote" className="text-[hsl(var(--accent))] hover:underline">
              quote request page
            </Link>{" "}
            and filling out the shipment details form. Alternatively, call us
            directly at{" "}
            <a
              href="tel:+17752304767"
              className="text-[hsl(var(--accent))] hover:underline"
            >
              (775) 230-4767
            </a>{" "}
            for an immediate rate. We typically respond to online quote requests
            within one business hour.
          </p>
        ),
      },
      {
        question: "What are your hours of operation?",
        answer: (
          <p>
            Our office is open Monday through Friday from 7:00 AM to 6:00 PM
            PST. However, our dispatch team is available 24 hours a day, 7 days
            a week to handle urgent freight needs and provide shipment updates.
            Call us anytime at{" "}
            <a
              href="tel:+17752304767"
              className="text-[hsl(var(--accent))] hover:underline"
            >
              (775) 230-4767
            </a>
            .
          </p>
        ),
      },
      {
        question: "Is DeMar Transportation a broker or a carrier?",
        answer: (
          <p>
            DeMar Transportation operates as a third-party logistics provider (3PL)
            with our own fleet and drivers, plus access to a vast nationwide carrier
            network. This means you get the reliability of a dedicated freight partner
            with the capacity and flexibility of thousands of vetted carriers across
            North America.
          </p>
        ),
      },
    ],
  },
  {
    title: "Shipping & Logistics",
    items: [
      {
        question:
          "What is the difference between dry van and reefer shipping?",
        answer: (
          <p>
            A{" "}
            <Link to="/services/dry-van" className="text-[hsl(var(--accent))] hover:underline">
              dry van
            </Link>{" "}
            is a standard enclosed trailer used for non-temperature-sensitive
            freight like packaged goods, electronics, and general merchandise. A{" "}
            <Link to="/services/reefer" className="text-[hsl(var(--accent))] hover:underline">
              reefer (refrigerated trailer)
            </Link>{" "}
            has a built-in cooling and heating unit that maintains precise
            temperatures, making it essential for perishable goods like food,
            pharmaceuticals, and anything requiring climate control during
            transit.
          </p>
        ),
      },
      {
        question: "What size trailers do you have?",
        answer: (
          <div>
            <p className="mb-3">
              Our standard 53-foot{" "}
              <Link to="/services/dry-van" className="text-[hsl(var(--accent))] hover:underline">
                dry van
              </Link>{" "}
              and{" "}
              <Link to="/services/reefer" className="text-[hsl(var(--accent))] hover:underline">
                reefer
              </Link>{" "}
              trailers offer approximately 3,400 cubic feet of cargo space and can
              accommodate up to 26 standard pallets with a maximum payload of around
              45,000 lbs. Standard dimensions are 8.5 feet wide and 53 feet long,
              with a practical clearance maximum of 13.5 feet.
            </p>
            <p>
              For oversized or open-deck loads, we offer{" "}
              <Link to="/services/flatbed" className="text-[hsl(var(--accent))] hover:underline">
                flatbed trailers
              </Link>
              . For smaller, time-sensitive shipments, our{" "}
              <Link to="/services/sprinter-van" className="text-[hsl(var(--accent))] hover:underline">
                hot shot service
              </Link>{" "}
              uses smaller equipment that can be dispatched faster and deliver
              more efficiently.
            </p>
          </div>
        ),
      },
      {
        question: "How long does freight shipping take?",
        answer: (
          <div>
            <p className="mb-3">
              Transit times depend on distance, route, and service type. As a general
              guide for full truckload shipments from Reno, Nevada:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Reno to San Francisco Bay Area: approximately 230 miles, 4 to 5 hours</li>
              <li>Reno to Los Angeles: approximately 450 miles, 8 to 10 hours</li>
              <li>Reno to Salt Lake City: approximately 520 miles, 7 to 9 hours</li>
            </ul>
            <p>
              Our{" "}
              <Link to="/services/sprinter-van" className="text-[hsl(var(--accent))] hover:underline">
                hot shot delivery service
              </Link>{" "}
              provides significantly faster transit than standard LTL, with dedicated
              direct-route delivery.{" "}
              <Link to="/contact" className="text-[hsl(var(--accent))] hover:underline">
                Contact us
              </Link>{" "}
              for a transit time estimate on your specific lane.
            </p>
          </div>
        ),
      },
      {
        question: "Can you handle oversized or overweight loads?",
        answer: (
          <p>
            Yes, our{" "}
            <Link to="/services/flatbed" className="text-[hsl(var(--accent))] hover:underline">
              flatbed service
            </Link>{" "}
            is designed for oversized, heavy, and irregularly shaped cargo
            including construction materials, machinery, and industrial
            equipment. For loads requiring special permits, our logistics team
            will coordinate all necessary permits and route planning. Contact
            us for a{" "}
            <Link to="/quote" className="text-[hsl(var(--accent))] hover:underline">
              custom quote
            </Link>
            .
          </p>
        ),
      },
      {
        question: "Do you offer expedited shipping?",
        answer: (
          <p>
            Absolutely. Our{" "}
            <Link to="/services/sprinter-van" className="text-[hsl(var(--accent))] hover:underline">
              hot shot delivery service
            </Link>{" "}
            is specifically built for time-critical freight. We can dispatch
            quickly and provide dedicated, direct-route delivery when your
            shipment can't wait. Call our 24/7 dispatch at{" "}
            <a
              href="tel:+17752304767"
              className="text-[hsl(var(--accent))] hover:underline"
            >
              (775) 230-4767
            </a>{" "}
            for expedited availability.
          </p>
        ),
      },
      {
        question: "What is a hot shot delivery?",
        answer: (
          <p>
            <Link to="/services/sprinter-van" className="text-[hsl(var(--accent))] hover:underline">
              Hot shot delivery
            </Link>{" "}
            is an expedited freight service that uses smaller, dedicated
            equipment to move time-sensitive or smaller loads faster than
            traditional full truckload shipping. It's ideal for urgent parts,
            emergency supplies, or partial loads that need to arrive on a tight
            deadline.
          </p>
        ),
      },
      {
        question: "How do I track my shipment?",
        answer: (
          <p>
            You can get real-time updates on your shipment by contacting our
            dispatch team at{" "}
            <a
              href="tel:+17752304767"
              className="text-[hsl(var(--accent))] hover:underline"
            >
              (775) 230-4767
            </a>{" "}
            or emailing{" "}
            <a
              href="mailto:info@DeMarTransportation.com"
              className="text-[hsl(var(--accent))] hover:underline"
            >
              info@DeMarTransportation.com
            </a>
            . Our team provides proactive updates on pickup, transit, and
            delivery status so you always know where your freight is.
          </p>
        ),
      },
    ],
  },
  {
    title: "Specialized Services",
    items: [
      {
        question: "Do you transport hazardous materials?",
        answer: (
          <p>
            Hazardous materials transport requires specialized certifications and
            equipment. Please{" "}
            <Link to="/contact" className="text-[hsl(var(--accent))] hover:underline">
              contact us directly
            </Link>{" "}
            to discuss your specific hazmat shipping needs, and we'll let you
            know if we can accommodate your load or connect you with an
            appropriate carrier in our network.
          </p>
        ),
      },
      {
        question:
          "What temperature ranges do your reefer trailers maintain?",
        answer: (
          <div>
            <p className="mb-3">
              Our{" "}
              <Link to="/services/reefer" className="text-[hsl(var(--accent))] hover:underline">
                refrigerated trailers
              </Link>{" "}
              can maintain temperatures ranging from -20 degrees F to 70 degrees F.
              Common temperature settings by commodity include:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Frozen goods: -10 to 0 degrees F</li>
              <li>Fresh produce: 34 to 38 degrees F</li>
              <li>Pharmaceuticals: 36 to 46 degrees F</li>
            </ul>
            <p>
              Temperature is continuously monitored throughout transit to ensure
              your cargo stays within the required range. All temperature-controlled
              shipments comply with FSMA (Food Safety Modernization Act) requirements
              for sanitary transportation of food.
            </p>
          </div>
        ),
      },
      {
        question: "Can you handle residential deliveries?",
        answer: (
          <p>
            Our services are primarily designed for commercial and industrial
            freight. Residential deliveries may be possible depending on the
            shipment size, equipment requirements, and access at the delivery
            location. Residential deliveries may incur an additional fee due
            to access constraints and limited-access surcharges. Please{" "}
            <Link to="/contact" className="text-[hsl(var(--accent))] hover:underline">
              contact us
            </Link>{" "}
            to discuss your specific needs and we'll work to find a solution.
          </p>
        ),
      },
    ],
  },
  {
    title: "Pricing & Booking",
    items: [
      {
        question: "How is freight shipping priced?",
        answer: (
          <p>
            Freight rates are based on several factors including distance,
            shipment weight and dimensions, equipment type required, pickup and
            delivery locations, and current market conditions. Reefer shipments
            typically cost more than comparable dry van loads due to fuel for the
            refrigeration unit and specialized equipment requirements. We provide
            transparent, competitive pricing with no hidden fees.{" "}
            <Link to="/quote" className="text-[hsl(var(--accent))] hover:underline">
              Request a quote
            </Link>{" "}
            to get an accurate rate for your specific shipment.
          </p>
        ),
      },
      {
        question: "What factors affect shipping cost?",
        answer: (
          <div>
            <p className="mb-3">
              The main factors that affect freight cost include:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Mileage between origin and destination</li>
              <li>Type of trailer needed (dry van, reefer, or flatbed)</li>
              <li>Total weight and dimensions of the shipment</li>
              <li>Any special handling or accessorial requirements</li>
              <li>Delivery urgency and service level</li>
              <li>Fuel surcharges and current market conditions</li>
            </ul>
            <p>
              Seasonal demand and lane availability also play a role in pricing.{" "}
              <Link to="/quote" className="text-[hsl(var(--accent))] hover:underline">
                Contact us for current rates
              </Link>{" "}
              on your specific lane.
            </p>
          </div>
        ),
      },
      {
        question: "Do you require a minimum shipment size?",
        answer: (
          <p>
            We specialize in full truckload (FTL) shipments, but our{" "}
            <Link to="/services/sprinter-van" className="text-[hsl(var(--accent))] hover:underline">
              hot shot service
            </Link>{" "}
            is a great option for smaller, partial loads that still need
            dedicated equipment and fast delivery. There is no strict minimum --
            reach out for a{" "}
            <Link to="/quote" className="text-[hsl(var(--accent))] hover:underline">
              quote
            </Link>{" "}
            and we'll find the most cost-effective solution for your shipment.
          </p>
        ),
      },
      {
        question: "What payment methods do you accept?",
        answer: (
          <p>
            We accept standard industry payment methods including ACH transfers,
            company checks, and credit terms available for established accounts.
            Payment terms and methods are discussed during the quoting process.
            For questions about billing,{" "}
            <Link to="/contact" className="text-[hsl(var(--accent))] hover:underline">
              contact our accounting team
            </Link>
            .
          </p>
        ),
      },
    ],
  },
  {
    title: "Packaging & Freight Preparation",
    items: [
      {
        question: "How should I prepare my freight for shipping?",
        answer: (
          <div>
            <p className="mb-3">
              Proper freight preparation helps prevent damage and delays. Follow
              these best practices:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Use sturdy, industry-standard pallets (48 x 40 inches is the most common size)</li>
              <li>Stack and shrink-wrap all palletized cargo securely</li>
              <li>Label every package with origin, destination, and handling instructions</li>
              <li>Ensure weight is distributed evenly across pallets</li>
              <li>Protect fragile items with appropriate cushioning and corner protectors</li>
              <li>Keep total pallet height (including the pallet) under 48 inches for standard stacking</li>
            </ul>
            <p>
              If you need guidance on packaging for a specific commodity,{" "}
              <Link to="/contact" className="text-[hsl(var(--accent))] hover:underline">
                contact our logistics team
              </Link>{" "}
              and we'll help you plan.
            </p>
          </div>
        ),
      },
      {
        question: "What documents are needed for freight shipping?",
        answer: (
          <div>
            <p className="mb-3">
              Standard freight shipments require the following documentation:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Bill of Lading (BOL) with accurate weight, piece count, and commodity description</li>
              <li>Shipping labels on all packages</li>
              <li>Packing list or commercial invoice</li>
              <li>Any special handling instructions or temperature requirements</li>
            </ul>
            <p>
              For regulated commodities, additional documentation may be required
              under 49 CFR (Code of Federal Regulations) for hazardous materials,
              or FSMA sanitary transportation records for food products. Our team
              will advise you on any additional paperwork needed for your specific
              shipment.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    title: "Claims & Insurance",
    items: [
      {
        question: "What happens if my freight is damaged during transit?",
        answer: (
          <div>
            <p className="mb-3">
              If your freight is damaged, notify us as soon as possible and document
              the damage with photographs before accepting delivery. Under the
              Carmack Amendment, motor carriers are liable for loss or damage to
              goods during interstate transportation. You have up to 9 months from
              the delivery date to file a formal freight claim.
            </p>
            <p>
              We work to resolve claims promptly and will guide you through the
              entire process. All carriers in our network meet or exceed FMCSA
              minimum insurance requirements for cargo coverage.{" "}
              <Link to="/contact" className="text-[hsl(var(--accent))] hover:underline">
                Contact us
              </Link>{" "}
              to report damage or start a claim.
            </p>
          </div>
        ),
      },
      {
        question: "Is my freight insured during shipping?",
        answer: (
          <p>
            All carriers in our network meet or exceed FMCSA minimum insurance
            requirements for cargo coverage. For high-value shipments, additional
            cargo insurance can be arranged through third-party providers. We
            recommend discussing insurance options during the quoting process so
            your coverage matches the value of your goods.{" "}
            <Link to="/quote" className="text-[hsl(var(--accent))] hover:underline">
              Request a quote
            </Link>{" "}
            and we'll help you determine the right level of coverage.
          </p>
        ),
      },
    ],
  },
  {
    title: "Careers",
    items: [
      {
        question: "How do I apply to drive for DeMar?",
        answer: (
          <p>
            Visit our{" "}
            <Link to="/careers" className="text-[hsl(var(--accent))] hover:underline">
              careers page
            </Link>{" "}
            to learn about current openings and submit your application. We're
            always looking for experienced, safety-conscious drivers. You can
            also call us at{" "}
            <a
              href="tel:+17752304767"
              className="text-[hsl(var(--accent))] hover:underline"
            >
              (775) 230-4767
            </a>{" "}
            to speak with our recruiting team directly.
          </p>
        ),
      },
      {
        question:
          "What are the requirements to drive for DeMar Transportation?",
        answer: (
          <p>
            Drivers must hold a valid Class A Commercial Driver's License (CDL),
            have a clean driving record, and pass DOT physical and drug
            screening requirements. Experience with the specific equipment type
            (dry van, reefer, or flatbed) is preferred. Visit our{" "}
            <Link to="/careers" className="text-[hsl(var(--accent))] hover:underline">
              careers page
            </Link>{" "}
            for full details on qualifications and benefits.
          </p>
        ),
      },
    ],
  },
];

// Plain text answers for JSON-LD schema
const plainTextAnswers: Record<string, string> = {
  "What services does DeMar Transportation offer?":
    "DeMar Transportation provides a full range of freight services including dry van, refrigerated (reefer), flatbed, and hot shot delivery services. We handle everything from full truckload shipments to time-critical expedited freight across the western United States.",
  "Where does DeMar Transportation operate?":
    "We are headquartered in Reno, Nevada and primarily serve the western United States, with strong coverage along the I-80 corridor and throughout Nevada, California, Oregon, Washington, Utah, and Arizona.",
  "How do I get a freight quote?":
    "You can request a free, no-obligation freight quote by visiting our quote request page and filling out the shipment details form. Alternatively, call us directly at (775) 230-4767 for an immediate rate. We typically respond to online quote requests within one business hour.",
  "What are your hours of operation?":
    "Our office is open Monday through Friday from 7:00 AM to 6:00 PM PST. However, our dispatch team is available 24 hours a day, 7 days a week to handle urgent freight needs and provide shipment updates.",
  "Is DeMar Transportation a broker or a carrier?":
    "DeMar Transportation operates as a third-party logistics provider (3PL) with our own fleet and drivers, plus access to a vast nationwide carrier network. This means you get the reliability of a dedicated freight partner with the capacity and flexibility of thousands of vetted carriers across North America.",
  "What is the difference between dry van and reefer shipping?":
    "A dry van is a standard enclosed trailer used for non-temperature-sensitive freight. A reefer (refrigerated trailer) has a built-in cooling and heating unit that maintains precise temperatures, making it essential for perishable goods like food, pharmaceuticals, and anything requiring climate control during transit.",
  "What size trailers do you have?":
    "Our standard 53-foot dry van and reefer trailers offer approximately 3,400 cubic feet of cargo space and can accommodate up to 26 standard pallets with a maximum payload of around 45,000 lbs. Standard dimensions are 8.5 feet wide and 53 feet long, with a practical clearance maximum of 13.5 feet. We also offer flatbed trailers for oversized or open-deck loads, and hot shot service with smaller equipment for time-sensitive shipments.",
  "How long does freight shipping take?":
    "Transit times depend on distance, route, and service type. As a general guide for full truckload shipments from Reno, Nevada: Reno to San Francisco Bay Area is approximately 230 miles (4 to 5 hours), Reno to Los Angeles is approximately 450 miles (8 to 10 hours), and Reno to Salt Lake City is approximately 520 miles (7 to 9 hours). Our hot shot delivery service provides significantly faster transit than standard LTL, with dedicated direct-route delivery.",
  "Can you handle oversized or overweight loads?":
    "Yes, our flatbed service is designed for oversized, heavy, and irregularly shaped cargo including construction materials, machinery, and industrial equipment. For loads requiring special permits, our logistics team will coordinate all necessary permits and route planning.",
  "Do you offer expedited shipping?":
    "Absolutely. Our hot shot delivery service is specifically built for time-critical freight. We can dispatch quickly and provide dedicated, direct-route delivery when your shipment can't wait.",
  "What is a hot shot delivery?":
    "Hot shot delivery is an expedited freight service that uses smaller, dedicated equipment to move time-sensitive or smaller loads faster than traditional full truckload shipping. It's ideal for urgent parts, emergency supplies, or partial loads.",
  "How do I track my shipment?":
    "You can get real-time updates on your shipment by contacting our dispatch team at (775) 230-4767 or emailing info@DeMarTransportation.com. Our team provides proactive updates on pickup, transit, and delivery status.",
  "Do you transport hazardous materials?":
    "Hazardous materials transport requires specialized certifications and equipment. Please contact us directly to discuss your specific hazmat shipping needs.",
  "What temperature ranges do your reefer trailers maintain?":
    "Our refrigerated trailers can maintain temperatures ranging from -20 degrees F to 70 degrees F. Common temperature settings by commodity include: frozen goods at -10 to 0 degrees F, fresh produce at 34 to 38 degrees F, and pharmaceuticals at 36 to 46 degrees F. Temperature is continuously monitored throughout transit. All temperature-controlled shipments comply with FSMA requirements for sanitary transportation of food.",
  "Can you handle residential deliveries?":
    "Our services are primarily designed for commercial and industrial freight. Residential deliveries may be possible depending on the shipment size, equipment requirements, and access at the delivery location. Residential deliveries may incur an additional fee due to access constraints and limited-access surcharges.",
  "How is freight shipping priced?":
    "Freight rates are based on several factors including distance, shipment weight and dimensions, equipment type required, pickup and delivery locations, and current market conditions. Reefer shipments typically cost more than comparable dry van loads due to fuel for the refrigeration unit and specialized equipment requirements. We provide transparent, competitive pricing with no hidden fees. Request a quote to get an accurate rate for your specific shipment.",
  "What factors affect shipping cost?":
    "The main factors include mileage between origin and destination, type of trailer needed (dry van, reefer, or flatbed), total weight and dimensions, special handling or accessorial requirements, delivery urgency and service level, and fuel surcharges and current market conditions. Seasonal demand and lane availability also play a role. Contact us for current rates on your specific lane.",
  "Do you require a minimum shipment size?":
    "We specialize in full truckload (FTL) shipments, but our hot shot service is a great option for smaller, partial loads that still need dedicated equipment and fast delivery. There is no strict minimum.",
  "What payment methods do you accept?":
    "We accept standard industry payment methods including ACH transfers, company checks, and credit terms available for established accounts. Payment terms and methods are discussed during the quoting process.",
  "How should I prepare my freight for shipping?":
    "Proper freight preparation helps prevent damage and delays. Best practices include: use sturdy, industry-standard pallets (48 x 40 inches is the most common size), stack and shrink-wrap all palletized cargo securely, label every package with origin, destination, and handling instructions, ensure weight is distributed evenly across pallets, protect fragile items with appropriate cushioning and corner protectors, and keep total pallet height (including the pallet) under 48 inches for standard stacking.",
  "What documents are needed for freight shipping?":
    "Standard freight shipments require a Bill of Lading (BOL) with accurate weight, piece count, and commodity description, shipping labels on all packages, a packing list or commercial invoice, and any special handling instructions or temperature requirements. For regulated commodities, additional documentation may be required under 49 CFR for hazardous materials, or FSMA sanitary transportation records for food products.",
  "What happens if my freight is damaged during transit?":
    "If your freight is damaged, notify us as soon as possible and document the damage with photographs before accepting delivery. Under the Carmack Amendment, motor carriers are liable for loss or damage to goods during interstate transportation. You have up to 9 months from the delivery date to file a formal freight claim. We work to resolve claims promptly and will guide you through the entire process. All carriers in our network meet or exceed FMCSA minimum insurance requirements for cargo coverage.",
  "Is my freight insured during shipping?":
    "All carriers in our network meet or exceed FMCSA minimum insurance requirements for cargo coverage. For high-value shipments, additional cargo insurance can be arranged through third-party providers. We recommend discussing insurance options during the quoting process so your coverage matches the value of your goods.",
  "How do I apply to drive for DeMar?":
    "Visit our careers page to learn about current openings and submit your application. We're always looking for experienced, safety-conscious drivers. You can also call us at (775) 230-4767 to speak with our recruiting team directly.",
  "What are the requirements to drive for DeMar Transportation?":
    "Drivers must hold a valid Class A Commercial Driver's License (CDL), have a clean driving record, and pass DOT physical and drug screening requirements. Experience with the specific equipment type is preferred.",
};

const FAQ = () => {
  useEffect(() => {
    document.title =
      "Freight Shipping FAQ | DeMar Transportation - Common Questions Answered";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Find answers to common freight shipping questions including transit times, pricing factors, trailer sizes, packaging guidelines, claims and insurance, equipment types, and career opportunities at DeMar Transportation.');
    }
  }, []);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqCategories.flatMap((category) =>
      category.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: plainTextAnswers[item.question] || "",
        },
      }))
    ),
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
          {/* Hero */}
          <section className="pt-32 pb-20 px-4 bg-[hsl(225_97%_4%)] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }} />
            <div className="container mx-auto max-w-5xl relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/5 backdrop-blur-sm">
                <HelpCircle className="h-4 w-4 text-[hsl(var(--accent))]" />
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
                  Freight Shipping FAQ
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                Frequently Asked
                <br />
                <span className="text-white/40">Questions</span>
              </h1>
              <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
                Find answers to common questions about transit times, pricing
                factors, equipment types, freight packaging, claims and
                insurance, and how DeMar Transportation can help with your
                shipping needs.
              </p>
            </div>
          </section>

          {/* FAQ Content , alternating sections per category */}
          {faqCategories.map((category, categoryIndex) => (
            <section
              key={category.title}
              className={`py-20 px-4 ${
                categoryIndex % 2 === 0
                  ? "bg-[hsl(var(--surface))]"
                  : "bg-[hsl(var(--surface-low))]"
              }`}
            >
              <div className="container mx-auto max-w-3xl">
                <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                  {category.title}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-8">
                  {category.title}
                </h2>
                <div className="rounded-xl bg-white shadow-[var(--shadow-card)]">
                  <Accordion type="single" collapsible className="w-full">
                    {category.items.map((item, itemIndex) => (
                      <AccordionItem
                        key={itemIndex}
                        value={`${category.title}-${itemIndex}`}
                        className="border-b border-[hsl(var(--surface-low))] last:border-b-0 px-6"
                      >
                        <AccordionTrigger className="text-left text-base font-medium text-[hsl(var(--primary))] hover:no-underline py-5">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed pb-5">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </section>
          ))}

          {/* CTA */}
          <section className="py-16 bg-[hsl(var(--accent))]">
            <div className="container mx-auto max-w-5xl text-center px-4">
              <h2 className="text-2xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
                Still Have Questions?
              </h2>
              <p className="text-base text-[hsl(var(--primary))]/70 mb-8 max-w-md mx-auto">
                Our team is ready to help. Reach out for personalized answers
                about your freight and shipping needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]/90 font-semibold"
                  asChild
                >
                  <Link to="/contact" className="group">
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10"
                  asChild
                >
                  <Link to="/quote">
                    Get a Free Quote
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10"
                  asChild
                >
                  <a href="tel:+17752304767">
                    <Phone className="mr-2 h-4 w-4" />
                    (775) 230-4767
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>

      {/* FAQ JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </div>
  );
};

export default FAQ;
