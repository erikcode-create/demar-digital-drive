import ServicePageLayout from "@/components/ServicePageLayout";
import { Layers } from "lucide-react";

const LTL = () => (
  <ServicePageLayout
    title="LTL Freight Shipping Services"
    slug="ltl"
    icon={Layers}
    category="standard"
    badge="Cost-Effective Freight"
    metaTitle="LTL Freight Shipping Services | Less Than Truckload | DeMar Transportation"
    metaDescription="DeMar Transportation provides competitive LTL (Less Than Truckload) freight shipping nationwide. Share trailer space, pay only for what you ship. NMFC classes 50-500, 1-10 pallets, fast transit times. Get a free quote."
    description="Ship smarter with Less Than Truckload freight. Pay only for the trailer space your shipment occupies and let DeMar Transportation handle the rest -- from carrier selection to delivery coordination."
    overview={{
      heading: "What Is LTL Shipping?",
      paragraphs: [
        "Less Than Truckload (LTL) shipping is a freight transportation method where multiple shippers share space on the same trailer. Instead of paying for an entire 53-foot trailer, you only pay for the portion of the trailer your freight occupies. This makes LTL an economical choice for businesses that need to move goods but do not have enough cargo to fill a full truck.",
        "In an LTL shipment, the carrier picks up freight from multiple shippers, consolidates those shipments at a terminal, and then routes them through a hub-and-spoke network to their respective destinations. Your freight is palletized, labeled, and loaded alongside other shippers' cargo, with each shipment tracked independently through the carrier's system.",
        "At DeMar Transportation, we use our extensive carrier network and 3PL brokerage capabilities to secure competitive LTL rates from top national and regional carriers. Whether you are shipping a single pallet from Reno to Chicago or managing recurring LTL lanes across the country, our freight specialists match your shipment to the right carrier for the best combination of price, transit time, and service quality.",
      ],
    }}
    cargoTypes={[
      { title: "Palletized Goods", desc: "Standard pallets of boxed or shrink-wrapped products are the bread and butter of LTL shipping. Properly palletized freight moves efficiently through carrier terminals and minimizes handling damage." },
      { title: "Partial Loads", desc: "When you have more freight than a parcel carrier can handle but not enough to fill a truck, LTL bridges the gap. Shipments of 150 lbs to 10,000 lbs fit perfectly in the LTL sweet spot." },
      { title: "Samples & Prototypes", desc: "Manufacturers and product teams frequently ship samples to buyers, trade shows, or testing facilities. LTL provides a cost-effective way to move these smaller shipments with full tracking." },
      { title: "Distributor Replenishment", desc: "Regular inventory replenishment to warehouses, distribution centers, and retail locations. Consistent LTL lanes can be optimized for recurring routes and scheduled pickups." },
      { title: "E-Commerce Shipments", desc: "Larger e-commerce orders, wholesale quantities, and B2B shipments that exceed parcel carrier limits but do not require a full trailer. Common for furniture, appliances, and bulk orders." },
      { title: "Printed Materials", desc: "Marketing materials, catalogs, books, and point-of-sale displays shipped from printers to distribution points across the country. These lightweight but bulky shipments are well-suited to LTL." },
    ]}
    whyDemar={{
      paragraphs: [
        "DeMar Transportation operates as both an asset-based carrier with our own fleet and a licensed freight broker with access to a nationwide network of LTL carriers. This dual capability means we are never limited to a single carrier's network or pricing -- we shop the market on your behalf to find the best rate and service combination for every shipment.",
        "Our LTL advantages include competitive rates negotiated through volume commitments with major national carriers, consolidation options that combine multiple smaller shipments into more efficient loads, and proactive freight class optimization to ensure you are never overpaying due to incorrect classification. We also provide a single point of contact for pickup coordination, tracking, and delivery confirmation.",
        "For shippers with recurring LTL needs, we offer customized rate programs, scheduled pickup windows, and dedicated account management. Whether you ship one pallet a week or fifty, DeMar Transportation provides the consistency and cost control your supply chain demands.",
      ],
      relatedServices: [
        { name: "temperature-controlled trailers", slug: "reefer" },
        { name: "hazmat-certified carriers", slug: "hazmat" },
      ],
    }}
    relatedResources={[
      { title: "FTL vs LTL: How to Choose", description: "Find the right shipping method for your load", to: "/resources/ftl-vs-ltl" },
      { title: "Freight Classes Explained", description: "NMFC classes and how they affect pricing", to: "/resources/freight-classes-explained" },
      { title: "How to Get a Freight Quote", description: "Step-by-step guide to requesting quotes", to: "/resources/how-to-get-freight-quote" },
    ]}
    schema={{
      serviceType: "LTL Freight Shipping",
      serviceDescription: "Less Than Truckload (LTL) freight shipping services for shipments under 10,000 lbs. Competitive rates, nationwide coverage, and freight class optimization.",
    }}
  />
);

export default LTL;
