import ResourceArticle from "@/components/ResourceArticle";
import type { FAQItem } from "@/components/ResourceArticle";
import { Link } from "react-router-dom";

const OversizedLoadShipping = () => {
  const faqs: FAQItem[] = [
    {
      question: "What qualifies as an oversized load?",
      answer:
        "A load is considered oversized when it exceeds standard legal dimensions: wider than 8'6\", taller than 13'6\", or longer than 53' (48' in some states). Loads exceeding 80,000 lbs gross vehicle weight are classified as overweight, which also triggers permit and planning requirements similar to oversized shipments.",
    },
    {
      question: "How much does it cost to ship an oversized load?",
      answer:
        "Oversized load shipping typically costs 30-60% more than standard freight on the same lane. A 500-mile oversized shipment might run $3,000 to $8,000+ depending on dimensions, weight, equipment needed, permit fees ($50-$800 per state), and escort vehicle requirements ($400-$1,200 per day). Super loads exceeding 16' wide or 200,000 lbs can cost $15,000-$50,000+.",
    },
    {
      question: "How long does it take to get oversized load permits?",
      answer:
        "Standard oversized permits take 2 to 4 weeks to process in most states. Some states offer expedited processing in 3-5 business days for an additional fee. Super load permits (for extremely heavy or wide loads) can take 4-8 weeks and may require engineering studies for bridges and overpasses along the route.",
    },
    {
      question: "Do I need escort vehicles for my oversized shipment?",
      answer:
        "Escort vehicle requirements vary by state and load dimensions. Generally, loads wider than 12' require one escort, and loads wider than 14-16' require two escorts (front and rear). Some states require escorts for any oversized load. Escorts must display 'OVERSIZE LOAD' signs and use amber warning lights.",
    },
    {
      question: "Can oversized loads travel at night?",
      answer:
        "Most states restrict oversized load travel to daylight hours only, typically sunrise to sunset or 30 minutes before sunrise to 30 minutes after sunset. Some states prohibit oversized travel on weekends and holidays. Night travel waivers are occasionally granted for super loads that would cause significant traffic disruption during daytime hours.",
    },
  ];

  const relatedLinks = [
    { label: "Flatbed Shipping Services", to: "/services/flatbed" },
    { label: "Types of Freight Trailers", to: "/resources/types-of-freight-trailers" },
    { label: "Freight Shipping Cost Guide", to: "/resources/freight-shipping-cost" },
    { label: "Get a Free Quote", to: "/quote" },
  ];

  const content = (
    <>
      <p>
        Shipping oversized loads requires specialized equipment, government permits, and careful
        route planning that standard freight does not. An <strong>oversized load</strong> is any
        shipment that exceeds standard legal highway dimensions:{" "}
        <strong>wider than 8'6", taller than 13'6", or longer than 53'</strong> (48' in some
        states). Common oversized freight includes construction equipment, industrial machinery,
        prefabricated structures, wind turbine components, and large vehicles. Oversized shipping
        costs <strong>30-60% more</strong> than standard freight due to permit fees ($50-$800 per
        state), escort vehicles ($400-$1,200 per day), specialized trailer equipment, and restricted
        travel windows. The permitting process alone takes <strong>2 to 4 weeks</strong> in most
        states, making early planning essential. Below, we cover everything you need to know about
        permits, route planning, equipment selection, escort requirements, and cost factors for
        oversized shipments. For a customized oversized load quote,{" "}
        <Link to="/quote">contact DeMar Transportation</Link> -- we handle permit acquisition,
        route surveys, and escort coordination so you do not have to.
      </p>

      <h2>What Makes a Load Oversized?</h2>
      <p>
        Federal and state regulations define standard legal dimensions for commercial vehicles on
        public highways. Any load exceeding these limits requires special permits:
      </p>
      <table>
        <thead>
          <tr>
            <th>Dimension</th>
            <th>Standard Legal Limit</th>
            <th>Oversized Threshold</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Width</td>
            <td>8'6" (102 inches)</td>
            <td>Anything wider</td>
          </tr>
          <tr>
            <td>Height</td>
            <td>13'6" (most states)</td>
            <td>Anything taller</td>
          </tr>
          <tr>
            <td>Length</td>
            <td>53' (trailer) / 48' (some states)</td>
            <td>Anything longer</td>
          </tr>
          <tr>
            <td>Weight</td>
            <td>80,000 lbs GVW</td>
            <td>Anything heavier (overweight permit)</td>
          </tr>
        </tbody>
      </table>
      <p>
        Loads that exceed multiple thresholds or are extremely large (wider than 16', heavier than
        200,000 lbs) are classified as <strong>super loads</strong> and require additional
        engineering studies, law enforcement escorts, and extended permit timelines.
      </p>

      <h2>Oversized Load Permit Requirements</h2>
      <p>
        Oversized permits must be obtained from <strong>every state</strong> the load will travel
        through. There is no single federal oversized permit. Key permitting facts:
      </p>
      <ul>
        <li>
          <strong>Single-trip permits</strong> cover one specific route and are valid for a set
          timeframe (typically 5-10 days)
        </li>
        <li>
          <strong>Annual permits</strong> are available in most states for repeat oversized haulers
          and cover loads up to certain dimensions (often 12' wide, 14'6" tall)
        </li>
        <li>
          Permit fees range from <strong>$15 to $800+ per state</strong> depending on load size and
          permit type
        </li>
        <li>
          Processing time is typically <strong>2-4 weeks</strong> for standard oversized, and{" "}
          <strong>4-8 weeks</strong> for super loads
        </li>
        <li>
          Some states require <strong>proof of insurance</strong> with minimum $1 million liability
          coverage
        </li>
        <li>
          Permits specify exact routes, travel times, and required safety equipment
        </li>
      </ul>

      <h3>State-by-State Permit Variations</h3>
      <p>
        Permit requirements differ significantly across states. For example, Texas allows loads up
        to 12' wide on an annual permit, while California requires single-trip permits for anything
        over 8'6" wide. States like New York and Pennsylvania require bridge analysis for heavy
        loads. Always verify current requirements with each state's DOT before planning your route.
      </p>

      <h2>Route Planning for Oversized Loads</h2>
      <p>
        Route planning is one of the most critical aspects of oversized shipping. Hazards that
        standard trucks ignore become serious obstacles for oversized freight:
      </p>
      <ul>
        <li>
          <strong>Low bridges and overpasses:</strong> Clearance varies widely. Some rural bridges
          are as low as 12'. Always verify clearance heights along the entire route.
        </li>
        <li>
          <strong>Power lines:</strong> Loads taller than 14' may require utility company
          coordination to temporarily raise or de-energize lines.
        </li>
        <li>
          <strong>Tunnels:</strong> Most tunnels cannot accommodate oversized loads. Routes must be
          planned around them.
        </li>
        <li>
          <strong>Tight turns and interchanges:</strong> Long or wide loads may not navigate sharp
          highway ramps or urban intersections.
        </li>
        <li>
          <strong>Road weight limits:</strong> Local roads, bridges, and seasonal weight restrictions
          may prohibit heavy loads.
        </li>
        <li>
          <strong>Construction zones:</strong> Narrowed lanes can block oversized loads. Check for
          active construction along the route.
        </li>
      </ul>
      <p>
        Professional route surveys are recommended for any load exceeding 14' wide or 15' tall. DeMar
        Transportation conducts route surveys and coordinates with state DOTs and utility companies
        as part of our{" "}
        <Link to="/services/flatbed">flatbed and oversized shipping services</Link>.
      </p>

      <h2>Equipment Options for Oversized Freight</h2>
      <p>
        Choosing the right trailer is essential for safe and legal oversized transport. Here are the
        most common equipment options:
      </p>
      <table>
        <thead>
          <tr>
            <th>Trailer Type</th>
            <th>Deck Height</th>
            <th>Max Load Height</th>
            <th>Best For</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Standard Flatbed</td>
            <td>60"</td>
            <td>8'6"</td>
            <td>Wide loads with moderate height</td>
          </tr>
          <tr>
            <td>Step Deck</td>
            <td>36-42"</td>
            <td>10'+</td>
            <td>Tall equipment, machinery</td>
          </tr>
          <tr>
            <td>Double Drop (Lowboy)</td>
            <td>18-24"</td>
            <td>11'6"+</td>
            <td>Very tall or heavy equipment</td>
          </tr>
          <tr>
            <td>RGN (Removable Gooseneck)</td>
            <td>18-24"</td>
            <td>11'6"+</td>
            <td>Non-drivable equipment (ramp loading)</td>
          </tr>
          <tr>
            <td>Extendable Trailers</td>
            <td>Varies</td>
            <td>Varies</td>
            <td>Extra-long loads (beams, pipes, poles)</td>
          </tr>
          <tr>
            <td>Multi-Axle Trailers</td>
            <td>Varies</td>
            <td>Varies</td>
            <td>Super-heavy loads (200,000+ lbs)</td>
          </tr>
        </tbody>
      </table>
      <p>
        Learn more about trailer types in our{" "}
        <Link to="/resources/types-of-freight-trailers">
          complete guide to freight trailers
        </Link>
        .
      </p>

      <h2>Escort Vehicle Requirements</h2>
      <p>
        Escort (pilot) vehicles are required for loads that significantly exceed standard dimensions.
        Requirements vary by state, but general guidelines include:
      </p>
      <ul>
        <li>
          <strong>10-12' wide:</strong> One escort vehicle (front or rear, depending on the state)
        </li>
        <li>
          <strong>12-14' wide:</strong> One escort vehicle in most states, two in some
        </li>
        <li>
          <strong>14-16' wide:</strong> Two escort vehicles (front and rear)
        </li>
        <li>
          <strong>16'+ wide or super loads:</strong> Two escorts plus law enforcement escort in many
          states
        </li>
      </ul>
      <p>
        Escort vehicles typically cost <strong>$400 to $1,200 per day</strong> and must display
        "OVERSIZE LOAD" signs, amber warning lights, and CB radio communication with the driver.
        Some states require certified pilot car operators with specific training and insurance.
      </p>

      <h2>Oversized Load Shipping Costs</h2>
      <p>
        Oversized shipping costs more than standard freight due to several unique factors:
      </p>
      <ul>
        <li>
          <strong>Permit fees:</strong> $50-$800 per state, multiplied by every state on the route
        </li>
        <li>
          <strong>Escort vehicles:</strong> $400-$1,200 per day per escort
        </li>
        <li>
          <strong>Specialized equipment:</strong> Lowboys and RGNs command 20-40% higher rates than
          standard flatbeds
        </li>
        <li>
          <strong>Restricted travel hours:</strong> Daylight-only travel extends transit time and
          requires overnight stops
        </li>
        <li>
          <strong>Route surveys:</strong> $500-$2,000 for complex routes requiring on-site
          inspection
        </li>
        <li>
          <strong>Utility coordination:</strong> $1,000-$5,000+ if power lines need to be raised or
          de-energized
        </li>
        <li>
          <strong>Insurance:</strong> Higher premiums for high-value oversized cargo
        </li>
      </ul>

      <h3>How to Reduce Oversized Shipping Costs</h3>
      <ul>
        <li>
          <strong>Plan early:</strong> Rush permits cost 2-3x more than standard processing
        </li>
        <li>
          <strong>Disassemble when possible:</strong> Breaking down equipment to stay under legal
          limits eliminates permit and escort costs entirely
        </li>
        <li>
          <strong>Choose optimal routes:</strong> Fewer states crossed means fewer permits and lower
          total cost
        </li>
        <li>
          <strong>Use annual permits:</strong> If you ship oversized loads regularly, annual permits
          save significantly vs. single-trip permits
        </li>
        <li>
          <strong>Work with experienced carriers:</strong>{" "}
          <Link to="/quote">Request a quote from DeMar Transportation</Link> -- our team handles
          permits, escorts, and route planning to minimize your total cost
        </li>
      </ul>

      <h2>Lead Time and Planning Timeline</h2>
      <p>
        Successful oversized shipping requires advance planning. Here is a recommended timeline:
      </p>
      <ol>
        <li>
          <strong>4-8 weeks before ship date:</strong> Contact carrier, provide load dimensions and
          weight, identify origin and destination
        </li>
        <li>
          <strong>3-6 weeks before:</strong> Begin permit applications for all states on the route
        </li>
        <li>
          <strong>2-4 weeks before:</strong> Conduct route survey, coordinate escorts, arrange
          utility line raises if needed
        </li>
        <li>
          <strong>1 week before:</strong> Confirm permits received, finalize route and travel
          schedule, verify equipment availability
        </li>
        <li>
          <strong>Day of shipment:</strong> Pre-trip inspection, escort coordination, load securement
          verification
        </li>
      </ol>
      <p>
        For super loads, add an additional 2-4 weeks for engineering studies and government agency
        reviews. Starting early is the single most important factor in a smooth oversized shipment.
      </p>
    </>
  );

  return (
    <ResourceArticle
      title="Oversized Load Shipping Guide: Permits, Planning & Costs"
      subtitle="Shipping Guide"
      description="Everything you need to know about shipping oversized loads, including permits, route planning, equipment selection, escort requirements, and cost factors."
      metaTitle="Oversized Load Shipping Guide: Permits, Planning & Costs | DeMar Transportation"
      metaDescription="Learn how to ship oversized loads: permit requirements by state, route planning, equipment options (flatbed, step deck, lowboy, RGN), escort vehicles, costs, and lead times."
      slug="oversized-load-shipping"
      publishDate="2026-03-29"
      content={content}
      faqs={faqs}
      relatedLinks={relatedLinks}
    />
  );
};

export default OversizedLoadShipping;
