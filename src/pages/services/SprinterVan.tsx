import ServicePageLayout from "@/components/ServicePageLayout";
import { Car } from "lucide-react";

const SprinterVan = () => (
  <ServicePageLayout
    title="Sprinter Van & Expedited Shipping"
    slug="sprinter-van"
    icon={Car}
    category="lastmile"
    badge="Time-Critical Freight"
    metaTitle="Sprinter Van & Expedited Shipping Services | DeMar Transportation"
    metaDescription="DeMar Transportation provides sprinter van and expedited shipping services for time-critical freight. Same-day and next-day delivery, hot shot service, team drivers available nationwide."
    description="Time-critical freight demands speed, reliability, and dedicated capacity. Our sprinter van and expedited shipping services deliver your cargo on the fastest possible timeline, with same-day and next-day options available nationwide."
    overview={{
      heading: "What Is Sprinter Van Freight?",
      paragraphs: [
        "Sprinter van freight refers to expedited shipments transported in cargo vans, typically Mercedes-Benz Sprinters, Ford Transits, or Ram ProMasters. These vehicles offer a cargo capacity of 3,000 to 5,000 pounds with up to 500 cubic feet of interior space, making them the fastest ground transportation option for smaller, time-sensitive shipments. Unlike larger trucks that may face hours-of-service limitations or require special routing, cargo vans can travel nonstop across long distances, especially when operated by team drivers.",
        "Sprinter vans are the backbone of the expedited freight industry. They do not require a commercial driver's license in most configurations, which means a larger pool of qualified drivers and faster dispatch times. The enclosed, climate-stable cargo area protects sensitive goods from temperature extremes, moisture, and road vibration. Many sprinter vans are equipped with interior shelving, tie-down systems, and blanket wrap materials for secure transport of high-value or fragile cargo.",
        "When every hour counts and your shipment cannot wait for the next LTL consolidation or scheduled truck route, a dedicated sprinter van provides exclusive use of the vehicle with direct, non-stop routing from origin to destination. There are no terminals, no cross-docking, and no intermediate handling. Your freight goes straight from point A to point B.",
      ],
    }}
    cargoTypes={[
      { title: "Medical Supplies & Equipment", desc: "Surgical instruments, diagnostic equipment, laboratory samples, and pharmaceutical products that require fast, temperature-stable transport with chain-of-custody documentation." },
      { title: "Automotive Parts", desc: "Critical replacement components for dealerships, manufacturing plants, and repair shops. A single missing part can shut down an assembly line, making expedited delivery essential." },
      { title: "Legal Documents & Financial Records", desc: "Original contracts, court filings, closing documents, and other legal materials that require secure, verifiable delivery with signature confirmation." },
      { title: "Trade Show & Event Materials", desc: "Display booths, promotional materials, product samples, and AV equipment delivered on a guaranteed schedule to convention centers and event venues nationwide." },
      { title: "Electronics & Technology", desc: "Servers, networking equipment, prototypes, and consumer electronics requiring vibration-dampened transport and careful handling to prevent damage to sensitive components." },
      { title: "Product Samples & Prototypes", desc: "Pre-production samples, engineering prototypes, and product development materials being shipped between R&D facilities, manufacturers, and client offices for review and testing." },
    ]}
    features={[
      { title: "Rapid Dispatch", desc: "Our logistics coordinators are available around the clock to take your expedited orders. We maintain a network of cargo van and sprinter van operators positioned across the western United States, enabling pickup within hours of your call." },
      { title: "Dedicated Capacity", desc: "Every sprinter van shipment gets exclusive use of the vehicle. Your freight is the only freight on the truck, which means no co-loading delays, no terminal stops, and no risk of damage from other shippers' cargo." },
      { title: "Real-Time Visibility", desc: "GPS tracking and proactive status updates keep you informed throughout the transit. Our team provides ETAs, milestone notifications, and proof of delivery documentation so you always know where your shipment is." },
      { title: "Nationwide Carrier Network", desc: "DeMar Transportation has access to thousands of pre-qualified owner-operators nationwide. This network depth ensures we can find capacity for your expedited shipment even during peak demand periods or in remote pickup locations." },
      { title: "Competitive Expedited Rates", desc: "We provide transparent, all-inclusive pricing for every expedited shipment. No hidden fuel surcharges, no surprise accessorial fees. You receive a firm quote before we dispatch, so you can make informed decisions about your shipping budget." },
    ]}
    whyDemar={{
      paragraphs: [
        "DeMar Transportation understands that expedited shipping is not just about speed -- it is about reliability. When you have a production line waiting for a critical part or a legal deadline that cannot be missed, you need a logistics partner who treats your urgency as their own.",
        "Our dispatch team is available 24/7 for hot shot and expedited orders. We maintain a deep network of sprinter van and cargo van operators across the country, enabling rapid pickup and direct routing to your destination.",
      ],
      relatedServices: [
        { name: "box truck services", slug: "box-truck" },
        { name: "hazmat transportation", slug: "hazmat" },
      ],
    }}
    relatedResources={[
      { title: "Hot Shot vs Full Truckload", description: "Compare speed vs cost for your shipment", to: "/resources/hot-shot-vs-full-truckload" },
      { title: "How Much Does Freight Shipping Cost?", description: "2026 pricing guide with per-mile rates", to: "/resources/freight-shipping-cost" },
      { title: "How to Get a Freight Quote", description: "Step-by-step guide to requesting quotes", to: "/resources/how-to-get-freight-quote" },
    ]}
    schema={{
      serviceType: "Sprinter Van and Expedited Shipping",
      serviceDescription: "Time-critical sprinter van and expedited freight shipping services with same-day, next-day, and hot shot delivery options nationwide.",
    }}
  />
);

export default SprinterVan;
