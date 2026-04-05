import ServicePageLayout from "@/components/ServicePageLayout";
import { Container } from "lucide-react";

const FTL = () => (
  <ServicePageLayout
    title="Full Truckload Shipping Services"
    slug="ftl"
    icon={Container}
    category="standard"
    badge="Dedicated Capacity"
    metaTitle="Full Truckload (FTL) Shipping Services | DeMar Transportation"
    metaDescription="DeMar Transportation provides full truckload (FTL) freight shipping nationwide. Dedicated trailers, faster transit, less handling. Dry van, reefer, flatbed, and step-deck available. Get a free quote."
    description="Your freight, your trailer, your schedule. DeMar Transportation provides dedicated full truckload shipping with direct origin-to-destination service, faster transit times, and reduced handling for maximum cargo protection."
    overview={{
      heading: "What Is Full Truckload Shipping?",
      paragraphs: [
        "Full Truckload (FTL) shipping means your freight gets a dedicated trailer for the entire journey from origin to destination. Unlike LTL shipments where multiple shippers share trailer space, an FTL shipment is loaded at your facility, sealed, and driven directly to the delivery point without any intermediate terminal stops or freight transfers. No other shipper's cargo touches your trailer.",
        "This dedicated approach offers significant advantages: faster transit because the driver goes straight from pickup to delivery, reduced risk of damage because your freight is loaded once and unloaded once with no terminal handling in between, and greater scheduling flexibility because the truck operates on your timeline rather than a carrier's terminal schedule.",
        "DeMar Transportation operates our own fleet of trucks and also maintains a nationwide carrier network through our 3PL brokerage operations. This means we can provide FTL capacity for any lane in the continental United States -- whether you need a single spot-market load moved tomorrow or a dedicated fleet running the same lane every week. We match the right equipment, the right carrier, and the right rate to every shipment.",
      ],
    }}
    specs={[
      { value: "45,000 lbs", label: "Maximum Payload (Dry Van)", desc: "Actual capacity varies by tractor weight, trailer tare weight, and state axle-weight regulations. Typical usable payload ranges from 42,000 to 45,000 lbs." },
      { value: "2,390 ft\u00B3", label: "Interior Volume (53' Dry Van)", desc: "Interior dimensions: 52'6\" length x 98.5\" width x 108\" height. Accommodates 22 to 26 standard pallets single-stacked or more when double-stacked." },
    ]}
    features={[
      { title: "Faster Transit Times", desc: "No terminal stops means your freight moves directly from pickup to delivery. A coast-to-coast FTL shipment typically arrives in 4 to 5 days compared to 7 to 10 days for LTL." },
      { title: "Reduced Handling", desc: "Your freight is loaded once at origin and unloaded once at destination. Less handling means dramatically lower risk of damage, loss, or shortage." },
      { title: "Predictable Pricing", desc: "FTL rates are typically quoted as a flat rate per load or per mile. No freight class calculations, no hundredweight pricing tiers, and fewer surprise accessorial charges." },
      { title: "Scheduling Flexibility", desc: "You control the pickup and delivery windows. Need a specific appointment time? Same-day pickup? Weekend delivery? FTL accommodates your schedule." },
    ]}
    industries={[
      { name: "Manufacturing", detail: "Inbound raw materials to production facilities and outbound finished goods to distribution centers. We support just-in-time delivery schedules where late arrivals directly impact production line uptime." },
      { name: "Retail & Distribution", detail: "Full truckloads of merchandise to distribution centers, cross-docks, and retail locations. We comply with major retailer routing guides and appointment scheduling requirements." },
      { name: "Food & Beverage", detail: "Temperature-controlled and dry loads for food producers, beverage companies, and grocery distributors. Our carriers maintain food-grade trailers and comply with FSMA transportation requirements." },
      { name: "Construction", detail: "Building materials, fixtures, and supplies delivered to job sites and warehouses. We coordinate flatbed, step-deck, and dry van equipment based on material type and site access requirements." },
      { name: "Automotive", detail: "OEM parts, aftermarket components, and finished assemblies for automotive manufacturers and parts distributors. Time-critical supply chains with zero tolerance for production-stopping delays." },
      { name: "Consumer Goods", detail: "High-volume shipments of household products, personal care items, and packaged goods from manufacturers to regional and national distribution centers." },
    ]}
    whyDemar={{
      paragraphs: [
        "DeMar Transportation brings a unique combination of asset-based capacity and brokerage flexibility to every full truckload shipment. Our own fleet provides reliable, direct capacity on our core lanes, while our carrier network extends our reach to every corner of the continental United States. This hybrid model means you get the consistency of a dedicated fleet with the scalability of a nationwide brokerage.",
        "We offer both spot-market and contracted pricing options. For shippers with consistent lane volume, our contracted rates provide budget predictability and guaranteed capacity even during tight market conditions. For one-time or irregular shipments, our spot-market team sources competitive rates from vetted carriers with a focus on service quality and on-time performance.",
        "Every FTL shipment includes real-time tracking, proactive status updates, and a dedicated point of contact from booking through delivery.",
      ],
      relatedServices: [
        { name: "hazmat shipping", slug: "hazmat" },
        { name: "temperature-controlled freight", slug: "reefer" },
        { name: "flatbed or step-deck trailers", slug: "flatbed" },
      ],
    }}
    relatedResources={[
      { title: "FTL vs LTL: How to Choose", description: "Find the right shipping method for your load", to: "/resources/ftl-vs-ltl" },
      { title: "How Much Does Freight Shipping Cost?", description: "2026 pricing guide with per-mile rates", to: "/resources/freight-shipping-cost" },
      { title: "Freight Classes Explained", description: "NMFC classes and how they affect pricing", to: "/resources/freight-classes-explained" },
    ]}
    schema={{
      serviceType: "Full Truckload Freight Shipping",
      serviceDescription: "Full Truckload (FTL) freight shipping services with dedicated trailers. Up to 45,000 lbs capacity, dry van, reefer, flatbed, and step-deck trailers available nationwide.",
    }}
  />
);

export default FTL;
