import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LandstarSidebar from "@/components/LandstarSidebar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Phone } from "lucide-react";

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
            <Link to="/services/dry-van" className="text-primary hover:underline">
              dry van
            </Link>
            ,{" "}
            <Link to="/services/reefer" className="text-primary hover:underline">
              refrigerated (reefer)
            </Link>
            ,{" "}
            <Link to="/services/flatbed" className="text-primary hover:underline">
              flatbed
            </Link>
            , and{" "}
            <Link to="/services/hot-shot" className="text-primary hover:underline">
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
            <Link to="/contact" className="text-primary hover:underline">
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
            <Link to="/quote" className="text-primary hover:underline">
              quote request page
            </Link>{" "}
            and filling out the shipment details form. Alternatively, call us
            directly at{" "}
            <a
              href="tel:+17752304767"
              className="text-primary hover:underline"
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
              className="text-primary hover:underline"
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
            DeMar Transportation operates as a freight carrier with our own
            fleet and drivers. We work with Landstar as an authorized agent,
            giving us access to one of the largest carrier networks in North
            America. This means you get the reliability of a dedicated carrier
            with the capacity and flexibility of a nationwide network.
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
            <Link to="/services/dry-van" className="text-primary hover:underline">
              dry van
            </Link>{" "}
            is a standard enclosed trailer used for non-temperature-sensitive
            freight like packaged goods, electronics, and general merchandise. A{" "}
            <Link to="/services/reefer" className="text-primary hover:underline">
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
          <p>
            We offer standard 53-foot dry van and reefer trailers for full
            truckload shipments, as well as flatbed trailers for oversized or
            open-deck loads. For smaller, time-sensitive shipments, our{" "}
            <Link to="/services/hot-shot" className="text-primary hover:underline">
              hot shot service
            </Link>{" "}
            uses smaller equipment that can be dispatched faster and deliver
            more efficiently.
          </p>
        ),
      },
      {
        question: "Can you handle oversized or overweight loads?",
        answer: (
          <p>
            Yes, our{" "}
            <Link to="/services/flatbed" className="text-primary hover:underline">
              flatbed service
            </Link>{" "}
            is designed for oversized, heavy, and irregularly shaped cargo
            including construction materials, machinery, and industrial
            equipment. For loads requiring special permits, our logistics team
            will coordinate all necessary permits and route planning. Contact
            us for a{" "}
            <Link to="/quote" className="text-primary hover:underline">
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
            <Link to="/services/hot-shot" className="text-primary hover:underline">
              hot shot delivery service
            </Link>{" "}
            is specifically built for time-critical freight. We can dispatch
            quickly and provide dedicated, direct-route delivery when your
            shipment can't wait. Call our 24/7 dispatch at{" "}
            <a
              href="tel:+17752304767"
              className="text-primary hover:underline"
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
            <Link to="/services/hot-shot" className="text-primary hover:underline">
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
              className="text-primary hover:underline"
            >
              (775) 230-4767
            </a>{" "}
            or emailing{" "}
            <a
              href="mailto:info@DeMarTransportation.com"
              className="text-primary hover:underline"
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
            <Link to="/contact" className="text-primary hover:underline">
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
          <p>
            Our{" "}
            <Link to="/services/reefer" className="text-primary hover:underline">
              refrigerated trailers
            </Link>{" "}
            can maintain temperatures ranging from -20 degrees F to 70 degrees F, making
            them suitable for frozen goods, fresh produce, dairy,
            pharmaceuticals, and other temperature-sensitive products.
            Temperature is continuously monitored throughout transit to ensure
            your cargo stays within the required range.
          </p>
        ),
      },
      {
        question: "Can you handle residential deliveries?",
        answer: (
          <p>
            Our services are primarily designed for commercial and industrial
            freight. Residential deliveries may be possible depending on the
            shipment size, equipment requirements, and access at the delivery
            location. Please{" "}
            <Link to="/contact" className="text-primary hover:underline">
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
            delivery locations, and current market conditions. We provide
            transparent, competitive pricing with no hidden fees.{" "}
            <Link to="/quote" className="text-primary hover:underline">
              Request a quote
            </Link>{" "}
            to get an accurate rate for your specific shipment.
          </p>
        ),
      },
      {
        question: "What factors affect shipping cost?",
        answer: (
          <p>
            The main factors that affect freight cost include: mileage between
            origin and destination, type of trailer needed (dry van, reefer, or
            flatbed), total weight and dimensions, any special handling
            requirements, delivery urgency, and fuel surcharges. Seasonal demand
            and lane availability also play a role in pricing.
          </p>
        ),
      },
      {
        question: "Do you require a minimum shipment size?",
        answer: (
          <p>
            We specialize in full truckload (FTL) shipments, but our{" "}
            <Link to="/services/hot-shot" className="text-primary hover:underline">
              hot shot service
            </Link>{" "}
            is a great option for smaller, partial loads that still need
            dedicated equipment and fast delivery. There is no strict minimum --
            reach out for a{" "}
            <Link to="/quote" className="text-primary hover:underline">
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
            company checks, and approved credit terms for established accounts.
            Payment terms and methods are discussed during the quoting process.
            For questions about billing,{" "}
            <Link to="/contact" className="text-primary hover:underline">
              contact our accounting team
            </Link>
            .
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
            <Link to="/careers" className="text-primary hover:underline">
              careers page
            </Link>{" "}
            to learn about current openings and submit your application. We're
            always looking for experienced, safety-conscious drivers. You can
            also call us at{" "}
            <a
              href="tel:+17752304767"
              className="text-primary hover:underline"
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
            <Link to="/careers" className="text-primary hover:underline">
              careers page
            </Link>{" "}
            for full details on qualifications and benefits.
          </p>
        ),
      },
    ],
  },
];

// Build FAQ schema from the categories
const faqSchemaItems = faqCategories.flatMap((category) =>
  category.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      // Strip JSX to plain text for schema
      text: "",
    },
  }))
);

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
    "DeMar Transportation operates as a freight carrier with our own fleet and drivers. We work with Landstar as an authorized agent, giving us access to one of the largest carrier networks in North America.",
  "What is the difference between dry van and reefer shipping?":
    "A dry van is a standard enclosed trailer used for non-temperature-sensitive freight. A reefer (refrigerated trailer) has a built-in cooling and heating unit that maintains precise temperatures, making it essential for perishable goods like food, pharmaceuticals, and anything requiring climate control during transit.",
  "What size trailers do you have?":
    "We offer standard 53-foot dry van and reefer trailers for full truckload shipments, as well as flatbed trailers for oversized or open-deck loads. For smaller, time-sensitive shipments, our hot shot service uses smaller equipment.",
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
    "Our refrigerated trailers can maintain temperatures ranging from -20°F to 70°F, making them suitable for frozen goods, fresh produce, dairy, pharmaceuticals, and other temperature-sensitive products.",
  "Can you handle residential deliveries?":
    "Our services are primarily designed for commercial and industrial freight. Residential deliveries may be possible depending on the shipment size, equipment requirements, and access at the delivery location.",
  "How is freight shipping priced?":
    "Freight rates are based on several factors including distance, shipment weight and dimensions, equipment type required, pickup and delivery locations, and current market conditions. We provide transparent, competitive pricing with no hidden fees.",
  "What factors affect shipping cost?":
    "The main factors include mileage between origin and destination, type of trailer needed, total weight and dimensions, special handling requirements, delivery urgency, and fuel surcharges. Seasonal demand and lane availability also play a role.",
  "Do you require a minimum shipment size?":
    "We specialize in full truckload (FTL) shipments, but our hot shot service is a great option for smaller, partial loads that still need dedicated equipment and fast delivery. There is no strict minimum.",
  "What payment methods do you accept?":
    "We accept standard industry payment methods including ACH transfers, company checks, and approved credit terms for established accounts. Payment terms and methods are discussed during the quoting process.",
  "How do I apply to drive for DeMar?":
    "Visit our careers page to learn about current openings and submit your application. We're always looking for experienced, safety-conscious drivers. You can also call us at (775) 230-4767 to speak with our recruiting team directly.",
  "What are the requirements to drive for DeMar Transportation?":
    "Drivers must hold a valid Class A Commercial Driver's License (CDL), have a clean driving record, and pass DOT physical and drug screening requirements. Experience with the specific equipment type is preferred.",
};

const FAQ = () => {
  useEffect(() => {
    document.title =
      "FAQ | DeMar Transportation - Freight Shipping Questions Answered";
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
      <LandstarSidebar />
      <div className="md:ml-16">
        <Header />
        <main id="main-content">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
            <div className="container mx-auto px-4 text-center">
              <div className="flex justify-center mb-4">
                <HelpCircle className="h-12 w-12 opacity-90" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
                Find answers to common questions about our freight services,
                pricing, and how DeMar Transportation can help with your
                shipping needs.
              </p>
            </div>
          </section>

          {/* FAQ Content */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4 max-w-3xl">
              {faqCategories.map((category, categoryIndex) => (
                <div key={category.title} className={categoryIndex > 0 ? "mt-12" : ""}>
                  <h2 className="text-2xl font-bold mb-6 pb-2 border-b">
                    {category.title}
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    {category.items.map((item, itemIndex) => (
                      <AccordionItem
                        key={itemIndex}
                        value={`${category.title}-${itemIndex}`}
                      >
                        <AccordionTrigger className="text-left text-base">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Still Have Questions?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Our team is ready to help. Reach out for personalized answers
                about your freight and shipping needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg" className="text-lg px-8">
                    Contact Us
                  </Button>
                </Link>
                <Link to="/quote">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8"
                  >
                    Get a Free Quote
                  </Button>
                </Link>
                <a href="tel:+17752304767">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    (775) 230-4767
                  </Button>
                </a>
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
