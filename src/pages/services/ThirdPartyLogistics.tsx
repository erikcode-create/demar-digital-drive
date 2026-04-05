import ServicePageLayout from "@/components/ServicePageLayout";
import { Network } from "lucide-react";

const ThirdPartyLogistics = () => (
  <ServicePageLayout
    title="Third-Party Logistics (3PL)"
    slug="3pl"
    icon={Network}
    category="logistics"
    badge="Full-Service Logistics"
    metaTitle="Third-Party Logistics (3PL) Services | Freight Management | DeMar Transportation"
    metaDescription="DeMar Transportation provides full-service 3PL services including freight management, carrier sourcing, warehousing coordination, and supply chain visibility. One call handles everything. Get a free quote today."
    description="Simplify your supply chain with a single logistics partner. DeMar Transportation manages your freight, coordinates warehousing, and provides end-to-end visibility so you can focus on growing your business."
    overview={{
      heading: "What Is a Third-Party Logistics Provider?",
      paragraphs: [
        "A third-party logistics provider, commonly referred to as a 3PL, is an outside company that manages some or all of your supply chain and shipping operations on your behalf. Instead of hiring your own fleet, negotiating with dozens of carriers, coordinating warehouse space, and tracking every shipment yourself, you hand those responsibilities to a 3PL partner who has the infrastructure, relationships, and technology to do it more efficiently.",
        "For many businesses, logistics is essential but not their core competency. Managing freight in-house requires dedicated staff, carrier contracts, transportation management software, insurance oversight, and constant communication with drivers and warehouses. A 3PL absorbs all of that complexity. You make one call, explain what needs to move and when, and your 3PL partner handles everything from there.",
        "DeMar Transportation operates as both an asset-based carrier with our own fleet and a licensed freight broker with access to a nationwide network of vetted carriers. This dual capability means we are not limited to a single mode of transport or a fixed number of trucks. We match the right equipment and carrier to every load, every time, whether you need a single pallet moved across town or a multi-stop truckload routed across the country.",
      ],
    }}
    specs={[
      { value: "GPS", label: "Real-Time Tracking", desc: "GPS-based shipment tracking with regular location updates. Know exactly where your freight is at every stage of transit, from pickup to final delivery." },
      { value: "24/7", label: "Proactive Updates", desc: "Status notifications at key milestones: loaded, in transit, approaching delivery, and delivered. Exception alerts if delays or issues arise so there are never surprises." },
      { value: "POD", label: "Delivery Confirmation", desc: "Electronic proof of delivery documentation including signed BOLs, delivery receipts, and photos when required. Complete audit trail for every shipment." },
    ]}
    features={[
      { title: "Volume-Based Rates", desc: "Because we aggregate freight volume from many shippers, we negotiate carrier rates that individual companies typically cannot access on their own. You benefit from our buying power without committing to minimum volume guarantees." },
      { title: "Optimized Routing", desc: "Our logistics team analyzes your shipping lanes and identifies opportunities to consolidate loads, eliminate empty miles, and select the most efficient routes. Small improvements in routing efficiency compound into significant savings over time." },
      { title: "Reduced Overhead", desc: "Eliminate the cost of maintaining an in-house logistics department, transportation management software, carrier contracts, and compliance monitoring. A 3PL replaces those fixed costs with a variable, per-shipment model that scales with your business." },
      { title: "Fewer Claims and Delays", desc: "Vetted carriers, proper load planning, and proactive monitoring reduce the frequency of damage claims, missed appointments, and service failures. Prevention is always less expensive than recovery." },
    ]}
    industries={[
      { name: "Manufacturing", detail: "Inbound raw materials, outbound finished goods, and just-in-time delivery to keep production lines running. We coordinate multi-stop routes and manage vendor shipping programs." },
      { name: "Retail & Distribution", detail: "Store replenishment, distribution center transfers, and seasonal inventory positioning. We understand retailer compliance programs, appointment scheduling, and delivery requirements." },
      { name: "E-Commerce", detail: "High-frequency fulfillment center replenishment, last-mile coordination, and the fast turnaround that online retail demands. We handle the shipping so you can focus on selling." },
      { name: "Food & Beverage", detail: "Temperature-controlled and dry freight for food manufacturers and distributors. We coordinate both refrigerated and dry van capacity to match your product requirements." },
      { name: "Construction", detail: "Building materials, equipment, and supplies delivered to job sites on schedule. We handle oversized loads, flatbed coordination, and multi-drop deliveries across active project sites." },
      { name: "Pharmaceutical", detail: "Secure, reliable transportation for pharmaceutical products and medical supplies. We work with carriers who maintain the compliance and handling standards your products require." },
    ]}
    whyDemar={{
      paragraphs: [
        "DeMar Transportation is not a faceless logistics corporation. We are a Reno, Nevada-based company that builds real relationships with every client. When you call us, you reach a person who knows your account, your freight, and your priorities. That level of personal attention is rare in an industry that has trended toward automation and call centers.",
        "What sets us apart is the combination of our own fleet assets and our broker authority. As an asset-based carrier, we have skin in the game and understand what it takes to move freight safely and on time. As a licensed broker, we can tap into a nationwide carrier network to find the right equipment, capacity, and pricing for any shipment. This dual capability gives you the reliability of an asset carrier with the flexibility of a full-service brokerage.",
        "Transparency is a core value. We provide honest rate quotes, realistic transit estimates, and straightforward communication when things do not go as planned. No hidden fees, no vague delivery windows, no excuses.",
      ],
      relatedServices: [
        { name: "warehousing and distribution", slug: "warehousing" },
        { name: "dry van shipping", slug: "dry-van" },
        { name: "refrigerated transport", slug: "reefer" },
        { name: "flatbed hauling", slug: "flatbed" },
      ],
    }}
    relatedResources={[
      { title: "Freight Broker vs Carrier vs 3PL", description: "Understand the differences and how they work", to: "/resources/broker-vs-carrier-vs-3pl" },
      { title: "How to Choose a Freight Carrier", description: "Checklist for evaluating logistics partners", to: "/resources/how-to-choose-freight-carrier" },
      { title: "How Much Does Freight Shipping Cost?", description: "2026 pricing guide with per-mile rates", to: "/resources/freight-shipping-cost" },
    ]}
    schema={{
      serviceType: "Third-Party Logistics",
      serviceDescription: "Full-service third-party logistics (3PL) including freight management, carrier sourcing, warehousing coordination, real-time tracking, and supply chain optimization for businesses across the United States.",
    }}
  />
);

export default ThirdPartyLogistics;
