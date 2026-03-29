import ResourceArticle from "@/components/ResourceArticle";
import { Link } from "react-router-dom";

const TypesOfFreightTrailers = () => {
  const faqs = [
    {
      question: "What is the most common type of freight trailer?",
      answer:
        "The dry van is the most common freight trailer in North America, accounting for approximately 70-80% of all over-the-road freight. Dry vans are enclosed 53-foot trailers that protect cargo from weather and theft, making them suitable for most non-temperature-sensitive goods including packaged foods, electronics, clothing, and consumer products.",
    },
    {
      question: "What is the difference between a flatbed and a step deck trailer?",
      answer:
        "A standard flatbed has a uniform deck height of about 60 inches from the ground, while a step deck (also called a drop deck) has an upper deck and a lower deck that drops to about 38-42 inches. The lower deck height on a step deck allows you to haul taller freight (up to 10 feet) without requiring oversize permits, making it ideal for tall machinery and equipment.",
    },
    {
      question: "How do I know which trailer type I need?",
      answer:
        "Consider four factors: (1) Does your freight need temperature control? If yes, use a reefer. (2) Is it oversized or irregularly shaped? Use a flatbed or step deck. (3) Is it a standard palletized load under 45,000 lbs? A dry van works. (4) Is it a small, time-sensitive shipment? A sprinter van or box truck is ideal. When in doubt, contact a freight broker who can recommend the right equipment.",
    },
    {
      question: "What is the maximum weight a freight trailer can carry?",
      answer:
        "Federal law limits gross vehicle weight to 80,000 lbs. After subtracting the tractor (15,000-20,000 lbs) and trailer (10,000-15,000 lbs), the typical payload capacity is 42,000-45,000 lbs for a standard dry van or reefer. Flatbeds can carry up to 48,000 lbs due to lighter trailer weight. Overweight permits can allow higher limits on certain routes.",
    },
    {
      question: "Can I ship refrigerated and dry goods on the same trailer?",
      answer:
        "Yes, multi-temperature reefer trailers have internal dividers that create separate temperature zones. This allows you to ship frozen goods in one section and refrigerated or ambient goods in another. However, multi-temp trailers are less common and typically cost 15-25% more than standard single-temp reefers.",
    },
  ];

  const content = (
    <>
      <p>
        <strong>There are six main types of freight trailers used in commercial shipping: dry vans, reefers (refrigerated), flatbeds, step decks/lowboys, box trucks, and sprinter vans.</strong> Each trailer type is designed for specific cargo, weight limits, and delivery requirements. Dry vans handle roughly 75% of all freight in North America -- they are enclosed 53-foot trailers carrying up to 45,000 lbs of palletized goods. Reefers are temperature-controlled versions of dry vans for perishable items. Flatbeds haul oversized or irregularly shaped cargo that cannot fit inside an enclosed trailer. Step decks and lowboys carry tall or heavy machinery. Box trucks and sprinter vans serve smaller, local, and expedited shipments. Choosing the right trailer type affects your shipping cost, transit time, and cargo safety. Here is a complete guide to every trailer type, with dimensions, capacity, and best uses.
      </p>

      <h2>Trailer Type Overview</h2>

      <table>
        <thead>
          <tr>
            <th>Trailer Type</th>
            <th>Length</th>
            <th>Max Payload</th>
            <th>Best For</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Dry Van</strong></td>
            <td>53 ft</td>
            <td>42,000-45,000 lbs</td>
            <td>General freight, palletized goods</td>
          </tr>
          <tr>
            <td><strong>Reefer</strong></td>
            <td>53 ft</td>
            <td>40,000-44,000 lbs</td>
            <td>Perishables, pharmaceuticals</td>
          </tr>
          <tr>
            <td><strong>Flatbed</strong></td>
            <td>48-53 ft</td>
            <td>45,000-48,000 lbs</td>
            <td>Oversized, heavy, open-deck cargo</td>
          </tr>
          <tr>
            <td><strong>Step Deck</strong></td>
            <td>48-53 ft</td>
            <td>43,000-48,000 lbs</td>
            <td>Tall machinery, heavy equipment</td>
          </tr>
          <tr>
            <td><strong>Box Truck</strong></td>
            <td>12-26 ft</td>
            <td>5,000-10,000 lbs</td>
            <td>Local/regional, residential deliveries</td>
          </tr>
          <tr>
            <td><strong>Sprinter Van</strong></td>
            <td>10-14 ft cargo</td>
            <td>2,500-5,000 lbs</td>
            <td>Expedited, small urgent shipments</td>
          </tr>
        </tbody>
      </table>

      <h2>Dry Van Trailers</h2>

      <p>
        The <Link to="/services/dry-van">dry van</Link> is the workhorse of the freight industry. These fully enclosed 53-foot trailers protect cargo from weather, dust, and theft during transit.
      </p>

      <h3>Dry Van Specifications</h3>
      <ul>
        <li><strong>Exterior length:</strong> 53 feet (48-foot versions also available)</li>
        <li><strong>Interior dimensions:</strong> 52'6" L x 8'2" W x 9'0" H</li>
        <li><strong>Door opening:</strong> 7'8" W x 8'9" H</li>
        <li><strong>Payload capacity:</strong> 42,000-45,000 lbs</li>
        <li><strong>Pallet capacity:</strong> 26 standard pallets (48" x 40") single-stacked</li>
        <li><strong>Cubic capacity:</strong> ~3,800 cubic feet</li>
      </ul>

      <h3>Best Uses for Dry Vans</h3>
      <ul>
        <li>Packaged consumer goods and retail inventory</li>
        <li>Non-perishable food products</li>
        <li>Electronics and appliances</li>
        <li>Clothing and textiles</li>
        <li>Paper products and building materials</li>
        <li>Any palletized freight that doesn't require temperature control</li>
      </ul>

      <h2>Refrigerated (Reefer) Trailers</h2>

      <p>
        <Link to="/services/reefer">Reefer trailers</Link> are insulated dry vans equipped with a refrigeration unit that maintains temperatures from -20°F to 70°F. They are essential for perishable goods, pharmaceuticals, and any temperature-sensitive cargo.
      </p>

      <h3>Reefer Specifications</h3>
      <ul>
        <li><strong>Exterior length:</strong> 53 feet</li>
        <li><strong>Interior dimensions:</strong> 52'0" L x 8'0" W x 8'6" H (slightly smaller than dry van due to insulation)</li>
        <li><strong>Payload capacity:</strong> 40,000-44,000 lbs (heavier tare weight due to refrigeration unit)</li>
        <li><strong>Temperature range:</strong> -20°F to 70°F</li>
        <li><strong>Pallet capacity:</strong> 22-24 standard pallets</li>
      </ul>

      <h3>Best Uses for Reefers</h3>
      <ul>
        <li>Fresh produce, dairy, and meat</li>
        <li>Frozen foods and ice cream</li>
        <li>Pharmaceuticals and biologics</li>
        <li>Flowers and live plants</li>
        <li>Chemicals requiring temperature stability</li>
        <li>Chocolate, candles, and other melt-sensitive products</li>
      </ul>

      <p>
        Not sure whether you need a dry van or reefer? Read our <Link to="/resources/dry-van-vs-reefer">dry van vs reefer comparison guide</Link>.
      </p>

      <h2>Flatbed Trailers</h2>

      <p>
        <Link to="/services/flatbed">Flatbed trailers</Link> have an open deck with no sides, roof, or doors. This allows loading from the top, sides, or rear using cranes, forklifts, or other heavy equipment.
      </p>

      <h3>Flatbed Specifications</h3>
      <ul>
        <li><strong>Length:</strong> 48-53 feet</li>
        <li><strong>Deck width:</strong> 8'6"</li>
        <li><strong>Deck height:</strong> 60 inches from ground</li>
        <li><strong>Max freight height:</strong> 8'6" (13'6" total from ground, legal limit)</li>
        <li><strong>Payload capacity:</strong> 45,000-48,000 lbs</li>
      </ul>

      <h3>Best Uses for Flatbeds</h3>
      <ul>
        <li>Steel beams, pipes, and structural materials</li>
        <li>Lumber and building supplies</li>
        <li>Heavy machinery and industrial equipment</li>
        <li>Vehicles and large containers</li>
        <li>Oversized loads that cannot fit in enclosed trailers</li>
        <li>Any cargo requiring crane or overhead loading</li>
      </ul>

      <h2>Step Deck and Lowboy Trailers</h2>

      <p>
        Step deck (drop deck) trailers have a two-level design: a shorter upper deck and a longer lower deck that sits closer to the ground. Lowboy trailers drop even further, with deck heights as low as 18-24 inches.
      </p>

      <h3>Step Deck Specifications</h3>
      <ul>
        <li><strong>Upper deck:</strong> ~11 ft long, 60" from ground</li>
        <li><strong>Lower deck:</strong> ~37 ft long, 38-42" from ground</li>
        <li><strong>Max freight height on lower deck:</strong> Up to 10 feet</li>
        <li><strong>Payload capacity:</strong> 43,000-48,000 lbs</li>
      </ul>

      <h3>Lowboy Specifications</h3>
      <ul>
        <li><strong>Deck height:</strong> 18-24 inches from ground</li>
        <li><strong>Well length:</strong> 24-29 feet</li>
        <li><strong>Payload capacity:</strong> 40,000-80,000 lbs (with permits)</li>
        <li><strong>Best for:</strong> Extremely heavy or tall equipment (excavators, bulldozers, transformers)</li>
      </ul>

      <h2>Box Trucks</h2>

      <p>
        Box trucks (also called straight trucks or cube vans) combine the cab and cargo box on a single chassis. They range from 12 to 26 feet in length and are ideal for local and regional deliveries.
      </p>

      <h3>Box Truck Specifications</h3>
      <ul>
        <li><strong>Cargo length:</strong> 12-26 feet</li>
        <li><strong>Interior height:</strong> 6'6" to 8'0"</li>
        <li><strong>Payload capacity:</strong> 5,000-10,000 lbs</li>
        <li><strong>Pallet capacity:</strong> 6-12 standard pallets</li>
      </ul>

      <h3>Best Uses for Box Trucks</h3>
      <ul>
        <li>Local and last-mile deliveries</li>
        <li>Residential and commercial moves</li>
        <li>Small wholesale shipments</li>
        <li>Trade show and event freight</li>
        <li>Routes with tight dock access or urban restrictions</li>
      </ul>

      <h2>Sprinter Vans</h2>

      <p>
        <Link to="/services/sprinter-van">Sprinter vans</Link> are the smallest and fastest option for freight shipping. These cargo vans handle expedited, time-critical shipments when a full truck isn't needed.
      </p>

      <h3>Sprinter Van Specifications</h3>
      <ul>
        <li><strong>Cargo length:</strong> 10-14 feet</li>
        <li><strong>Interior height:</strong> ~5'8" to 6'4"</li>
        <li><strong>Payload capacity:</strong> 2,500-5,000 lbs</li>
        <li><strong>Pallet capacity:</strong> 3-4 standard pallets</li>
      </ul>

      <h3>Best Uses for Sprinter Vans</h3>
      <ul>
        <li>Same-day and next-day expedited deliveries</li>
        <li>Medical supplies and pharmaceutical samples</li>
        <li>Critical auto and manufacturing parts</li>
        <li>High-value, low-weight shipments</li>
        <li>Tradeshow materials with tight deadlines</li>
      </ul>

      <h2>How to Choose the Right Trailer</h2>

      <p>
        Follow this decision process to select the right trailer type for your shipment:
      </p>

      <ol>
        <li><strong>Check temperature requirements:</strong> Perishable or temperature-sensitive? Use a reefer.</li>
        <li><strong>Check dimensions:</strong> Won't fit inside an enclosed trailer? Use a flatbed or step deck.</li>
        <li><strong>Check weight:</strong> Over 10,000 lbs? Use a dry van, reefer, or flatbed. Under 5,000 lbs? A box truck or sprinter van may be more economical.</li>
        <li><strong>Check urgency:</strong> Same-day delivery? Sprinter van for small loads, hot shot for mid-size loads.</li>
        <li><strong>Check access:</strong> Tight loading dock or residential area? Box truck or sprinter van.</li>
      </ol>

      <p>
        Need help selecting the right equipment? <Link to="/quote">Get a free quote</Link> from DeMar Transportation. We'll match your freight to the ideal trailer type at the best rate.
      </p>
    </>
  );

  return (
    <ResourceArticle
      title="Types of Freight Trailers: Complete Guide to Every Trailer Type"
      subtitle="Equipment Guide"
      description="Learn about every type of freight trailer -- dry van, reefer, flatbed, step deck, box truck, and sprinter van. Dimensions, capacity, and best uses for each."
      metaTitle="Types of Freight Trailers: Complete Guide to Every Trailer Type | DeMar Transportation"
      metaDescription="Complete guide to freight trailer types: dry van, reefer, flatbed, step deck, lowboy, box truck, and sprinter van. Dimensions, weight limits, and best uses for each type."
      slug="types-of-freight-trailers"
      publishDate="2026-03-29"
      content={content}
      faqs={faqs}
      relatedLinks={[
        { label: "Dry Van Shipping Services", to: "/services/dry-van" },
        { label: "Refrigerated (Reefer) Shipping", to: "/services/reefer" },
        { label: "Flatbed Shipping Services", to: "/services/flatbed" },
        { label: "Dry Van vs Reefer: Which Do You Need?", to: "/resources/dry-van-vs-reefer" },
      ]}
    />
  );
};

export default TypesOfFreightTrailers;
