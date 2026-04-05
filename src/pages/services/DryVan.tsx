import ServicePageLayout from "@/components/ServicePageLayout";
import { Package } from "lucide-react";

const DryVan = () => (
  <ServicePageLayout
    title="Dry Van Shipping Services"
    slug="dry-van"
    icon={Package}
    category="standard"
    badge="Most Popular Service"
    metaTitle="Dry Van Shipping Services | Full Truckload FTL & LTL | DeMar Transportation"
    metaDescription="DeMar Transportation offers reliable dry van shipping across the US. 53-foot trailers, 45,000 lb capacity, full truckload and LTL services from Reno, NV. Get a free quote today."
    description="Reliable, enclosed freight transportation for general commodities across the continental United States. Safe, on time, and at competitive rates."
    overview={{
      heading: "What Is Dry Van Freight Shipping?",
      paragraphs: [
        "Dry van shipping is the most widely used method of over-the-road freight transportation in the United States, accounting for roughly 70 percent of all truckload shipments. A dry van is a fully enclosed, non-temperature-controlled trailer designed to protect cargo from weather, road debris, and theft during transit.",
        "At DeMar Transportation, dry van freight is the backbone of our operations. Whether you need a full truckload (FTL) moved coast to coast or a less-than-truckload (LTL) shipment consolidated with other freight, our dry van fleet is equipped to handle it.",
        "Dry van trailers are ideal for non-perishable goods that do not require temperature regulation, specialized loading equipment, or oversized handling. From palletized consumer products to boxed electronics, the dry van's versatility makes it the default choice for the majority of commercial shippers.",
      ],
    }}
    capabilities={{
      heading: "DeMar's Dry Van Shipping Services",
      paragraphs: [
        "DeMar Transportation coordinates dry van shipments across all 48 contiguous states through a vetted network of owner-operators and carrier partners. Our home base in Reno, Nevada places us at the intersection of I-80 and US-395, giving us direct access to major freight corridors connecting the West Coast, Pacific Northwest, and Intermountain West.",
        "We handle shipments ranging from single-pallet LTL loads under 5,000 pounds to full truckload moves up to 45,000 pounds. Our dispatch team books hundreds of dry van loads monthly, with consistent lane coverage on high-demand routes throughout the Western US and beyond. All carriers in our network pass DOT compliance screening before their first load.",
      ],
      subsections: [
        {
          heading: "Service Area Coverage",
          items: [
            { title: "Western US", detail: "California, Oregon, Washington, Nevada, Arizona, Utah, Colorado. Typically 1 to 2-day transit from Reno for most destinations." },
            { title: "Central US", detail: "Texas, Illinois, Missouri, Minnesota, Kansas, Nebraska, Oklahoma. Typically 2 to 3-day transit with reliable capacity on I-80 and I-70 corridors." },
            { title: "Eastern US", detail: "New York, Pennsylvania, Georgia, Florida, Ohio, North Carolina. Typically 4 to 6-day transit with coast-to-coast full truckload service." },
          ],
        },
      ],
    }}
    specs={[
      { value: "53 ft", label: "Standard Trailer Length", desc: "Interior length of approximately 52 feet 6 inches. 48-foot trailers also available." },
      { value: "45,000 lbs", label: "Maximum Payload Capacity", desc: "Up to 45,000 pounds of freight per load, depending on tractor configuration." },
      { value: "2,390 ft\u00B3", label: "Interior Cubic Capacity", desc: "Interior width of 98.5 inches and height of 108 inches at door opening." },
    ]}
    cargoTypes={[
      { title: "Consumer Goods", desc: "Household products, cleaning supplies, personal care items, and general merchandise." },
      { title: "Electronics", desc: "Packaged electronics, computer components, appliances, and consumer technology products." },
      { title: "Packaged Foods", desc: "Non-perishable food items including canned goods, snack foods, beverages, and dry goods." },
      { title: "Retail Inventory", desc: "Clothing, footwear, furniture, home goods, and seasonal merchandise." },
      { title: "Paper Products", desc: "Printing paper, packaging materials, tissue products, cardboard, and corrugated containers." },
      { title: "Textiles & Fabrics", desc: "Rolls of fabric, yarn, finished garments, carpeting, and industrial textiles." },
      { title: "Building Materials", desc: "Drywall, insulation, flooring, doors, windows, and other construction supplies that fit standard pallets." },
      { title: "Auto Parts", desc: "Aftermarket parts, OEM components, tires, and accessories shipped to dealerships and distribution centers." },
      { title: "Industrial Equipment", desc: "Machinery parts, tools, fasteners, and packaged industrial supplies under 45,000 pounds." },
    ]}
    features={[
      { title: "Weather Protection", desc: "Fully enclosed trailers shield your freight from rain, snow, wind, and UV exposure throughout the entire journey." },
      { title: "Cargo Security", desc: "Sealed trailers with locking mechanisms reduce the risk of theft, tampering, and pilferage during transit." },
      { title: "Versatility", desc: "Dry vans accommodate the widest range of commodity types of any trailer class, from lightweight, high-volume to dense, heavy pallets." },
      { title: "Cost-Effective", desc: "The most abundant equipment type on the road means more competitive rates, shorter lead times, and flexible scheduling." },
      { title: "Loading Flexibility", desc: "Rear swing doors and roll-up doors allow standard dock loading. Floor-loaded, palletized, and slip-sheeted freight all work in a dry van." },
      { title: "Carrier Availability", desc: "As the most common trailer type in North America, dry vans offer more available trucks and faster booking, even during peak shipping season." },
    ]}
    industries={[
      { name: "Retail & Distribution", detail: "We move freight for national retailers, regional distributors, and third-party logistics providers. Our carriers understand appointment scheduling, lumper requirements, and retailer compliance programs." },
      { name: "Manufacturing", detail: "Raw materials inbound and finished products outbound. We coordinate just-in-time deliveries where schedule reliability directly impacts production line uptime." },
      { name: "Food & Beverage", detail: "Non-perishable food products, beverages, and packaged goods require clean, dry trailers. Our carriers maintain washout records and comply with food-grade standards." },
      { name: "E-Commerce & Fulfillment", detail: "High-frequency shipments to fulfillment centers and last-mile hubs. We support the fast-paced replenishment cycles that e-commerce operations demand." },
    ]}
    whyDemar={{
      paragraphs: [
        "Based in Reno, Nevada, DeMar Transportation combines personalized service with the capacity of an extensive carrier network spanning North America. Our vetted owner-operators have a personal stake in delivering your freight safely and on schedule.",
        "We provide real-time shipment tracking, proactive communication on load status, and a single point of contact for every shipment from pickup through delivery.",
        "Whether you are shipping a single full truckload or managing a recurring lane program with hundreds of loads per month, DeMar Transportation has the capacity, carrier relationships, and operational expertise to keep your supply chain moving.",
      ],
      relatedServices: [
        { name: "refrigerated shipping", slug: "reefer" },
        { name: "flatbed transportation", slug: "flatbed" },
      ],
    }}
    faq={[
      {
        q: "What is the maximum weight for a dry van shipment?",
        a: "A standard 53-foot dry van trailer has a maximum payload capacity of approximately 45,000 pounds. The exact weight limit depends on the tractor configuration and axle weights. Most full truckload dry van shipments range between 30,000 and 44,000 pounds. DeMar Transportation confirms weight limits at the time of booking to ensure compliance with federal gross vehicle weight limits of 80,000 pounds.",
      },
      {
        q: "How many pallets fit in a dry van trailer?",
        a: "A 53-foot dry van trailer fits 22 to 26 standard pallets (48 by 40 inches) when loaded single-stacked in a straight configuration. Double-stacking is possible with lighter freight, bringing total pallet count up to 52. We coordinate pallet configuration during booking to maximize trailer utilization and reduce per-unit shipping costs.",
      },
      {
        q: "What is the difference between dry van FTL and LTL shipping?",
        a: "Full truckload (FTL) means your freight occupies the entire trailer, typically 15,000 pounds or more. Less-than-truckload (LTL) consolidates shipments from multiple shippers into one trailer. FTL offers faster transit times with no intermediate handling, while LTL costs less for smaller shipments. DeMar Transportation handles both FTL and LTL dry van freight across all 48 contiguous states.",
      },
      {
        q: "How long does dry van shipping take from Reno, NV?",
        a: "Transit times from Reno depend on destination. Regional deliveries within Nevada, California, Oregon, and Utah typically arrive within 1 to 2 days. Cross-country shipments to the East Coast take 4 to 6 days for standard dry van service. We provide estimated delivery dates at booking and offer real-time tracking throughout transit.",
      },
    ]}
    relatedResources={[
      { title: "How Much Does Freight Shipping Cost?", description: "2026 pricing guide with per-mile rates", to: "/resources/freight-shipping-cost" },
      { title: "Dry Van vs Reefer: Which Do You Need?", description: "Compare trailer types for your cargo", to: "/resources/dry-van-vs-reefer" },
      { title: "Types of Freight Trailers", description: "Complete guide to every trailer type", to: "/resources/types-of-freight-trailers" },
    ]}
    schema={{
      serviceType: "Dry Van Freight Shipping",
      serviceDescription: "Professional dry van shipping services for full truckload and LTL freight. 53-foot enclosed trailers with 45,000 lb capacity.",
    }}
  />
);

export default DryVan;
