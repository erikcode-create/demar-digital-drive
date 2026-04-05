import ServicePageLayout from "@/components/ServicePageLayout";
import { Truck } from "lucide-react";

const Flatbed = () => (
  <ServicePageLayout
    title="Flatbed Shipping Services"
    slug="flatbed"
    icon={Truck}
    category="heavy"
    badge="Open-Deck Specialists"
    metaTitle="Flatbed Trucking & Heavy Haul Shipping | Step Deck & Lowboy | DeMar Transportation"
    metaDescription="DeMar Transportation offers flatbed, step-deck, and lowboy shipping for steel, lumber, machinery, and oversized loads. FMCSA-compliant securement. Get a flatbed freight quote from Reno, NV."
    description="Professional open-deck freight transportation for steel, lumber, machinery, construction materials, and oversized loads. DeMar Transportation provides flatbed, step-deck, and lowboy capacity nationwide with FMCSA-compliant load securement."
    overview={{
      heading: "What Is Flatbed Shipping?",
      paragraphs: [
        "Flatbed shipping uses open-deck trailers -- trailers with a flat loading surface and no enclosed walls or roof -- to transport freight that cannot fit inside a standard dry van trailer due to its size, shape, weight, or loading requirements. Flatbed trailers allow cargo to be loaded from the top, sides, or rear using cranes, forklifts, or other material handling equipment, making them essential for industries that move heavy, oversized, or irregularly shaped products.",
        "Flatbed freight represents one of the most specialized segments of the trucking industry. Unlike enclosed trailers, flatbed loads require careful planning around securement methods, tarping requirements, permit regulations, and route surveys. The driver's skill in properly securing cargo is just as important as the equipment itself, which is why DeMar Transportation works exclusively with experienced flatbed carriers who understand the stakes involved.",
        "Through our extensive carrier network, we access one of the largest flatbed carrier pools in North America. DeMar Transportation works with thousands of specialized flatbed owner-operators who haul steel, building materials, heavy equipment, and oversized freight every day.",
      ],
    }}
    cargoTypes={[
      { title: "Steel & Metals", desc: "Steel coils, plate steel, structural beams, rebar, aluminum extrusions, and metal fabrications. Steel is the single largest commodity category in flatbed freight, and proper securement is critical given the extreme weight and shifting potential." },
      { title: "Lumber & Building Materials", desc: "Dimensional lumber, plywood, OSB, trusses, roofing materials, and packaged building products. Lumber loads often require tarping to protect against moisture and are typically loaded with forklifts at the shipper's yard." },
      { title: "Construction Equipment", desc: "Excavators, backhoes, skid steers, compactors, and other heavy equipment. These loads frequently require step-deck or lowboy trailers and may need permits for overweight or over-dimension transport." },
      { title: "Industrial Machinery", desc: "CNC machines, presses, generators, compressors, turbines, and manufacturing equipment. Machinery shipments demand careful load planning, engineered tie-down points, and sometimes custom crating or blocking." },
      { title: "Prefabricated Structures", desc: "Modular building components, wall panels, roof trusses, pre-cast concrete elements, and steel building frames. These loads are often over-width or over-height, requiring permits, escorts, and restricted travel times." },
      { title: "Pipes & Tubing", desc: "Steel pipe, PVC pipe, ductile iron pipe, culvert, and tubing for oil and gas, water infrastructure, and construction projects. Pipe loads require specialized securement including pipe stakes or cradles to prevent rolling." },
    ]}
    whyDemar={{
      paragraphs: [
        "Flatbed freight is inherently more complex than van freight. The equipment is more specialized, the securement requirements are more demanding, and the margin for error is smaller. A poorly secured flatbed load is not just a regulatory violation -- it is a serious safety hazard for the driver and every other vehicle on the road.",
        "DeMar Transportation has built deep relationships across the flatbed carrier market, giving us access to some of the deepest open-deck capacity in the industry. We work with thousands of owner-operators who specialize exclusively in flatbed, step-deck, and heavy haul work. These are not van drivers pulling a flatbed trailer once in a while. They are career flatbed professionals who own the right equipment, carry the right securement gear, and know how to safely transport the commodities you ship.",
        "From a single load of structural steel to a multi-load project moving construction equipment to a job site, DeMar Transportation has the flatbed capacity and operational expertise to execute safely and on schedule.",
      ],
      relatedServices: [
        { name: "dry van", slug: "dry-van" },
        { name: "refrigerated", slug: "reefer" },
      ],
    }}
    relatedResources={[
      { title: "Oversized Load Shipping Guide", description: "Permits, planning, and cost factors", to: "/resources/oversized-load-shipping" },
      { title: "Types of Freight Trailers", description: "Complete guide to every trailer type", to: "/resources/types-of-freight-trailers" },
      { title: "How Much Does Freight Shipping Cost?", description: "2026 pricing guide with per-mile rates", to: "/resources/freight-shipping-cost" },
    ]}
    schema={{
      serviceType: "Flatbed Freight Shipping",
      serviceDescription: "Professional flatbed, step-deck, and lowboy trucking services for oversized, heavy, and open-deck freight across the United States.",
    }}
  />
);

export default Flatbed;
