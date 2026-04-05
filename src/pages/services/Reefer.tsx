import ServicePageLayout from "@/components/ServicePageLayout";
import { Snowflake } from "lucide-react";

const Reefer = () => (
  <ServicePageLayout
    title="Refrigerated Shipping Services"
    slug="reefer"
    icon={Snowflake}
    category="temperature"
    badge="Temperature-Controlled"
    metaTitle="Refrigerated Shipping & Reefer Trucking | Temperature-Controlled Freight | DeMar Transportation"
    metaDescription="DeMar Transportation provides refrigerated (reefer) shipping with real-time temperature monitoring. FSMA-compliant carriers for produce, dairy, meat, pharmaceuticals. Get a reefer quote today."
    description="FSMA-compliant, temperature-controlled freight transportation for perishable goods, pharmaceuticals, and temperature-sensitive products. DeMar Transportation keeps your cold chain intact from origin to destination."
    overview={{
      heading: "What Is Reefer Shipping?",
      paragraphs: [
        "Reefer shipping -- short for refrigerated shipping -- uses specially equipped trailers with built-in cooling and heating systems to maintain precise temperature conditions throughout transit. Unlike standard dry van trailers, reefer units contain a self-powered refrigeration unit (typically diesel-driven) mounted on the front wall of the trailer that circulates conditioned air to keep cargo within a specified temperature range.",
        "Temperature-controlled transportation is critical for any product that can spoil, degrade, or lose efficacy when exposed to temperatures outside its safe storage range. This includes fresh and frozen foods, dairy products, floral shipments, pharmaceuticals, certain chemicals, and biological materials. A break in the cold chain -- even a brief temperature excursion -- can render an entire truckload worthless and create food safety or regulatory compliance risks.",
        "At DeMar Transportation, we coordinate reefer shipments through our vetted carrier network of qualified refrigerated carriers. Every reefer carrier in our network maintains properly serviced and calibrated refrigeration equipment, and we verify temperature settings and monitoring capabilities before dispatching any load. Our goal is simple: your temperature-sensitive freight arrives at its destination in the same condition it left the shipper's dock.",
      ],
    }}
    specs={[
      { value: "-20\u00B0F to 0\u00B0F", label: "Frozen", desc: "Deep-frozen cargo including ice cream, frozen meals, frozen vegetables, seafood, and other products requiring consistent sub-zero temperatures. Carriers maintain continuous run on the refrigeration unit with no defrost cycles during transit for ultra-sensitive frozen goods." },
      { value: "32\u00B0F to 40\u00B0F", label: "Chilled", desc: "Fresh produce, dairy products, deli items, fresh meat and poultry, eggs, and beverages. This is the most common reefer temperature range and requires precise control to prevent freezing on the low end or bacterial growth on the high end." },
      { value: "55\u00B0F to 70\u00B0F", label: "Climate-Controlled", desc: "Pharmaceuticals, cosmetics, chocolate, confections, wine, candles, and other products that must not be exposed to extreme heat or cold. Climate-controlled loads often require both heating and cooling capability depending on ambient conditions." },
    ]}
    cargoTypes={[
      { title: "Fresh Produce", desc: "Fruits, vegetables, salad mixes, and herbs from farms and packing houses to distribution centers and grocery retailers. Seasonal volume surges require flexible capacity." },
      { title: "Dairy Products", desc: "Milk, cheese, yogurt, butter, and cream. These high-value perishables demand strict temperature adherence and timely delivery to prevent spoilage and product loss." },
      { title: "Meat & Poultry", desc: "Fresh and frozen cuts of beef, pork, chicken, and turkey. USDA-inspected facilities require carriers to maintain documented temperature logs throughout transit." },
      { title: "Pharmaceuticals", desc: "Temperature-sensitive medications, vaccines, biologics, and clinical trial materials. Pharmaceutical shipments often require validated temperature recorders and chain-of-custody documentation." },
      { title: "Flowers & Plants", desc: "Cut flowers, live plants, and floral arrangements from growers to wholesalers and event venues. These shipments are highly time-sensitive and require gentle handling in addition to temperature control." },
      { title: "Frozen Foods", desc: "Frozen entrees, pizzas, ice cream, frozen desserts, and frozen ingredients. Maintaining -10\u00B0F or below throughout transit is essential to preserve texture, flavor, and food safety." },
    ]}
    whyDemar={{
      paragraphs: [
        "Refrigerated freight demands a higher level of attention than standard dry van shipping. Equipment must be inspected and verified. Temperatures must be confirmed and monitored. Transit times must be tight. At DeMar Transportation, we understand that when you ship perishable goods, there is no room for error.",
        "Our team has direct experience coordinating reefer loads across every major produce corridor, dairy belt, and protein distribution lane in the country. We know which carriers specialize in frozen versus fresh, which routes present seasonal challenges, and how to plan for the unexpected. Every reefer shipment gets a dedicated point of contact who monitors the load from dispatch through delivery confirmation.",
      ],
      relatedServices: [
        { name: "dry van shipping", slug: "dry-van" },
        { name: "flatbed transportation", slug: "flatbed" },
      ],
    }}
    relatedResources={[
      { title: "How to Ship Refrigerated Goods", description: "Cold chain shipping guide and best practices", to: "/resources/how-to-ship-refrigerated-goods" },
      { title: "Dry Van vs Reefer: Which Do You Need?", description: "Compare trailer types for your cargo", to: "/resources/dry-van-vs-reefer" },
      { title: "Seasonal Freight Shipping Guide", description: "Peak season rates and planning tips", to: "/resources/seasonal-freight-shipping" },
    ]}
    schema={{
      serviceType: "Refrigerated Freight Shipping",
      serviceDescription: "Temperature-controlled refrigerated trucking services for perishable goods, pharmaceuticals, and temperature-sensitive freight.",
    }}
  />
);

export default Reefer;
