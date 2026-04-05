import ServicePageLayout from "@/components/ServicePageLayout";
import { Warehouse } from "lucide-react";

const WarehousingPage = () => (
  <ServicePageLayout
    title="Warehousing & Distribution"
    slug="warehousing"
    icon={Warehouse}
    category="logistics"
    badge="Nationwide Network"
    metaTitle="Warehousing & Distribution Services | Storage & Fulfillment | DeMar Transportation"
    metaDescription="DeMar Transportation offers warehousing and distribution services through a nationwide warehouse network. Short-term storage, cross-docking, order fulfillment, and inventory management. Get a free quote today."
    description="Strategically located warehouse facilities across the United States. DeMar Transportation coordinates storage, fulfillment, and distribution through our network of warehouse partners to keep your products moving and your customers satisfied."
    overview={{
      heading: "A Nationwide Warehouse Network at Your Disposal",
      paragraphs: [
        "Efficient warehousing is the backbone of any well-run supply chain. Whether you need a place to stage inventory before it ships to retail locations, a cross-dock facility to consolidate and redistribute freight, or a fulfillment center to process individual customer orders, DeMar Transportation connects you with the right warehouse space in the right location.",
        "Through our network of strategic warehouse locations positioned near major transportation corridors and population centers, we provide flexible storage and distribution services without requiring you to sign long-term leases, hire warehouse staff, or invest in facility infrastructure. Our warehouse partners operate modern, secure facilities equipped with the technology and processes to handle your inventory with care and precision.",
        "What makes our approach different is the integration between warehousing and transportation. Because DeMar manages both your storage needs and your freight movements, there is no disconnect between what is sitting in a warehouse and what is scheduled to ship. One provider, one point of contact, complete coordination from receipt to delivery.",
      ],
    }}
    cargoTypes={[
      { title: "Short-Term & Long-Term Storage", desc: "Flexible storage arrangements that match your needs. Use short-term space for seasonal overflow, product launches, or import staging. Long-term programs available for ongoing inventory positioning without multi-year lease commitments." },
      { title: "Cross-Docking", desc: "Inbound freight is unloaded, sorted, and reloaded onto outbound trucks with minimal or no storage time. Cross-docking reduces handling costs, accelerates delivery times, and eliminates the need for dedicated warehouse space for fast-moving products." },
      { title: "Transloading", desc: "Transfer cargo between transportation modes or container types. Commonly used to move freight from ocean containers into domestic trailers, or to consolidate multiple smaller shipments into full truckloads for more efficient overland transport." },
      { title: "Pick-and-Pack", desc: "Individual order fulfillment from bulk inventory. Warehouse staff pick items from shelved stock, pack them to your specifications, label them, and prepare them for shipment. Ideal for e-commerce operations and direct-to-consumer brands." },
      { title: "Order Fulfillment", desc: "End-to-end fulfillment services from receiving inventory to shipping finished orders. We coordinate the entire process including receiving, quality inspection, storage, order processing, packing, and carrier handoff." },
      { title: "Inventory Management", desc: "Real-time inventory tracking with regular cycle counts and reporting. Know exactly how much stock you have, where it is located within the facility, and when reorder points are approaching. Integration with your systems available." },
    ]}
    specs={[
      { value: "Last-Mile", label: "Last-Mile Delivery", desc: "Coordination of final-mile delivery from warehouse to end customer, retail location, or job site. We work with local delivery partners to ensure your products arrive on time and in perfect condition, even for residential deliveries." },
      { value: "Regional", label: "Regional Distribution", desc: "Multi-stop delivery routes serving multiple locations within a geographic region. We optimize route sequencing to minimize transit time and cost while meeting each location's delivery window and receiving requirements." },
      { value: "Pool", label: "Pool Distribution", desc: "Consolidate multiple LTL shipments headed to the same region into a single truckload, then break them out for individual delivery at the destination market. Pool distribution reduces per-unit shipping costs significantly compared to individual LTL shipments." },
    ]}
    features={[
      { title: "Inventory Tracking", desc: "Barcode and SKU-level tracking from the moment your products arrive at the warehouse. Every receipt, movement, and shipment is recorded, giving you a complete audit trail and accurate stock counts at all times." },
      { title: "WMS Integration", desc: "Our warehouse partners operate warehouse management systems (WMS) that can integrate with your ERP, e-commerce platform, or order management system. Automated data exchange reduces manual entry errors and speeds up order processing." },
      { title: "Real-Time Stock Visibility", desc: "Access current inventory levels, inbound shipment status, and outbound order progress. Reporting dashboards provide the data you need to make informed decisions about replenishment, allocation, and distribution timing." },
      { title: "Secure Facilities", desc: "Warehouse locations in our network maintain security protocols including surveillance cameras, controlled access, alarm systems, and regular security audits. Your inventory is protected around the clock." },
    ]}
    industries={[
      { name: "E-Commerce Fulfillment", detail: "Store inventory close to your customers and ship orders fast. Our warehouse partners handle receiving, storage, pick-and-pack, and carrier handoff so you can offer competitive delivery times without managing your own warehouse." },
      { name: "Retail Distribution", detail: "Stage inventory for retail replenishment, manage seasonal stock builds, and coordinate multi-store deliveries. We understand retailer compliance requirements and appointment-based receiving schedules." },
      { name: "Manufacturing Supply Chain", detail: "Inbound raw material staging, work-in-process buffer storage, and finished goods distribution. We help manufacturers maintain lean inventory while ensuring materials are available when production schedules demand them." },
      { name: "Seasonal Storage", detail: "Not every business needs warehouse space year-round. Our flexible arrangements let you scale up during peak seasons and scale down when demand drops, so you only pay for the space you actually use." },
    ]}
    whyDemar={{
      paragraphs: [
        "The biggest advantage of using DeMar Transportation for warehousing is the tight integration between storage and transportation. Most companies work with a warehouse provider and a separate freight company, which creates communication gaps, scheduling conflicts, and finger-pointing when things go wrong. With DeMar, one team coordinates your entire logistics operation from warehouse receipt through final delivery.",
        "As both an asset-based carrier and a licensed freight broker, we control more of the supply chain than a standalone warehouse company ever could. When your inventory is ready to ship, we do not need to wait for a third-party carrier to become available. We dispatch from our own fleet or immediately source a vetted carrier from our network. The result is faster turnaround, fewer delays, and lower total logistics costs.",
        "Whether you need warehousing as a standalone service or as part of a comprehensive third-party logistics solution, DeMar Transportation has the network, the technology, and the people to make it work. Contact us to discuss your warehousing needs and let us design a solution that fits your business.",
      ],
      relatedServices: [
        { name: "third-party logistics solution", slug: "3pl" },
      ],
    }}
    relatedResources={[
      { title: "Freight Broker vs Carrier vs 3PL", description: "Understand the differences and how they work", to: "/resources/broker-vs-carrier-vs-3pl" },
      { title: "How to Ship Freight: Beginner's Guide", description: "Step-by-step guide for first-time shippers", to: "/resources/how-to-ship-freight" },
      { title: "Seasonal Freight Shipping Guide", description: "Peak season rates and planning tips", to: "/resources/seasonal-freight-shipping" },
    ]}
    schema={{
      serviceType: "Warehousing and Distribution",
      serviceDescription: "Nationwide warehousing and distribution services including short-term and long-term storage, cross-docking, transloading, pick-and-pack, order fulfillment, and inventory management through strategically located warehouse facilities.",
    }}
  />
);

export default WarehousingPage;
