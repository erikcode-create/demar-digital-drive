import ServicePageLayout from "@/components/ServicePageLayout";
import { Building } from "lucide-react";

const BoxTruck = () => (
  <ServicePageLayout
    title="Box Truck Shipping Services"
    slug="box-truck"
    icon={Building}
    category="lastmile"
    badge="Local & Regional"
    metaTitle="Box Truck Shipping Services | Local & Regional Freight | DeMar Transportation"
    metaDescription="DeMar Transportation offers box truck shipping for local and regional freight. 26-foot trucks, liftgate service, residential delivery. Cost-effective for small to mid-size loads. Get a quote today."
    description="Cost-effective freight transportation for small to mid-size loads. Our 26-foot box trucks deliver flexibility, reliability, and access to locations that full-size trailers cannot reach."
    overview={{
      heading: "What Is Box Truck Freight?",
      paragraphs: [
        "Box truck freight refers to shipments transported using medium-duty straight trucks, typically 26 feet in length with an enclosed cargo area. These vehicles are a staple of the American freight industry, bridging the gap between small cargo vans and full 53-foot tractor-trailers. A standard 26-foot box truck offers approximately 1,700 cubic feet of cargo space and can carry between 10,000 and 12,000 pounds, depending on the specific vehicle configuration and axle rating.",
        "Unlike tractor-trailer combinations that require a driver with a Class A commercial driver's license, most box trucks can be operated with a Class B CDL or even a standard license for lighter GVWR models. This translates to greater driver availability and more scheduling flexibility for shippers. The enclosed cargo bay protects freight from weather, road debris, and theft, while many box trucks come equipped with hydraulic liftgates that simplify loading and unloading at locations without dock-height bays.",
        "Box truck shipping is one of the most versatile modes in the ground transportation industry. Whether you need to move a partial load across town or consolidate multiple LTL shipments into a single dedicated truck, box truck freight offers a practical and economical solution that full truckload carriers simply cannot match for smaller volumes.",
      ],
    }}
    specs={[
      { value: "26 ft", label: "Cargo Bay Length", desc: "Standard 26-foot enclosed cargo area with rear roll-up door for easy loading and unloading." },
      { value: "12,000 lbs", label: "Maximum Payload", desc: "Up to 12,000 pounds of freight capacity depending on vehicle configuration and axle rating." },
      { value: "1,700 ft\u00B3", label: "Interior Cubic Capacity", desc: "Approximately 1,700 cubic feet of enclosed cargo space for palletized or loose freight." },
    ]}
    cargoTypes={[
      { title: "Local & Regional Deliveries", desc: "Box trucks excel at short-haul and regional routes, typically covering distances under 500 miles. Their smaller size allows faster turnaround times and more efficient routing through urban corridors, making them ideal for daily delivery schedules and recurring distribution runs." },
      { title: "LTL Consolidation", desc: "When you have freight that is too large for parcel carriers but does not justify a full 53-foot trailer, a box truck provides the perfect middle ground. Shippers can consolidate multiple less-than-truckload orders into a single dedicated box truck, reducing per-unit shipping costs and ensuring faster transit times compared to traditional LTL networks." },
      { title: "Residential & Limited-Access Deliveries", desc: "Many delivery locations, including residential addresses, strip malls, and older commercial buildings, cannot accommodate a full-size tractor-trailer. Box trucks navigate narrow streets, tight parking lots, and low-clearance areas with ease, and their liftgates enable ground-level delivery without a loading dock." },
      { title: "Trade Shows & Events", desc: "Moving trade show booths, display materials, and promotional inventory requires careful handling and precise scheduling. Box trucks offer the dedicated space and flexible timing that event logistics demand, with the ability to park close to convention center entrances and expo halls." },
      { title: "Retail Restocking", desc: "Retail chains and independent stores rely on frequent, smaller deliveries to keep shelves stocked without overloading back-room storage. Box truck delivery routes can be tailored to multi-stop schedules, serving multiple store locations in a single run while meeting tight delivery windows." },
      { title: "Construction Site Delivery", desc: "Construction materials, tools, and fixtures often need to reach active job sites where space is limited and road conditions are unpredictable. Box trucks provide the durability and maneuverability needed to deliver building supplies directly to the point of use." },
    ]}
    features={[
      { title: "Cost-Efficient for Smaller Loads", desc: "Paying for a full 53-foot trailer when you only need a fraction of the space is an unnecessary expense. Box truck rates reflect the actual capacity being used, which means shippers moving 5,000 to 12,000 pounds of freight can realize significant cost savings. You get a dedicated vehicle without the full truckload price tag." },
      { title: "Access to Tight Spaces", desc: "A 26-foot box truck is roughly half the length of a standard semi-trailer, giving it a decisive advantage in urban environments. Downtown alleys, residential neighborhoods, underground parking garages, and facilities with tight turning radii are all accessible. This eliminates the need for costly transloading or secondary shuttle services." },
      { title: "Liftgate and Special Equipment Available", desc: "Many box trucks come equipped with hydraulic liftgates rated for 2,500 to 3,000 pounds, enabling delivery to locations without loading docks. Additional equipment such as pallet jacks, furniture pads, and ratchet straps can be provided to ensure safe handling of your cargo from pickup to delivery." },
      { title: "Faster Loading and Unloading", desc: "Smaller cargo volumes mean faster dock times. Box truck shipments typically require a fraction of the loading time compared to full truckload, reducing detention charges and keeping your supply chain moving efficiently." },
    ]}
    industries={[
      { name: "Retail & E-Commerce", detail: "Store restocking, warehouse-to-store transfers, and last-mile fulfillment for online orders requiring white-glove or threshold delivery." },
      { name: "Construction & Building Materials", detail: "Lumber, drywall, fixtures, and tools delivered directly to job sites with liftgate service for ground-level unloading." },
      { name: "Events & Hospitality", detail: "Trade show booths, catering equipment, furniture rentals, and event staging materials with time-definite delivery." },
      { name: "Healthcare & Pharmaceuticals", detail: "Medical equipment, office furnishings, and pharmaceutical supplies requiring careful handling and on-time delivery." },
    ]}
    whyDemar={{
      paragraphs: [
        "Based in Reno, Nevada, DeMar Transportation has built a reputation for reliable, customer-focused freight services across the western United States. DeMar Transportation has access to a nationwide carrier network, ensuring capacity availability even during peak shipping seasons. Our box truck fleet and owner-operator network provide the flexibility to handle everything from single-pallet deliveries to multi-stop distribution runs.",
        "Every shipment is assigned a dedicated logistics coordinator who manages your load from pickup to delivery. We provide real-time tracking updates, proactive communication about any delays or schedule changes, and proof of delivery documentation. Our team understands that your freight is your business, and we treat every load with the urgency and care it deserves.",
        "Whether you need a one-time box truck delivery or an ongoing distribution partnership, DeMar Transportation offers competitive rates, consistent service, and the local expertise that national brokers cannot match. We know the roads, the docks, and the challenges of freight delivery in the Reno-Tahoe corridor and beyond.",
      ],
      relatedServices: [],
    }}
    relatedResources={[
      { title: "How to Ship Freight: Beginner's Guide", description: "Step-by-step guide for first-time shippers", to: "/resources/how-to-ship-freight" },
      { title: "FTL vs LTL: How to Choose", description: "Find the right shipping method for your load", to: "/resources/ftl-vs-ltl" },
      { title: "Types of Freight Trailers", description: "Complete guide to every trailer type", to: "/resources/types-of-freight-trailers" },
    ]}
    schema={{
      serviceType: "Box Truck Freight Shipping",
      serviceDescription: "Cost-effective box truck shipping services for local and regional freight. 26-foot trucks with liftgate service for small to mid-size loads.",
    }}
  />
);

export default BoxTruck;
