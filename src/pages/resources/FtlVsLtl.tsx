import ResourceArticle from "@/components/ResourceArticle";
import { Link } from "react-router-dom";

const FtlVsLtl = () => {
  const faqs = [
    {
      question: "What does FTL and LTL stand for?",
      answer:
        "FTL stands for Full Truckload, meaning your shipment occupies an entire trailer (typically 24-26 pallets in a 53-foot trailer). LTL stands for Less-Than-Truckload, meaning your shipment shares trailer space with other shippers' freight. FTL is priced per mile, while LTL is priced per hundredweight (cwt) based on freight class.",
    },
    {
      question: "At what point is FTL cheaper than LTL?",
      answer:
        "FTL typically becomes cheaper than LTL once your shipment exceeds 6-8 pallets or 10,000-12,000 lbs. At this threshold, the per-pound cost of FTL drops below LTL rates. However, the exact breakpoint varies by lane, freight class, and market conditions. Always get quotes for both options when your shipment falls in the 5-10 pallet range.",
    },
    {
      question: "Is FTL faster than LTL?",
      answer:
        "Yes, FTL is almost always faster than LTL. FTL shipments travel directly from origin to destination without stops, typically delivering within 1-3 days for distances under 1,500 miles. LTL shipments pass through multiple terminals for consolidation and deconsolidation, adding 2-5 days to transit time.",
    },
    {
      question: "Is there less risk of damage with FTL?",
      answer:
        "Yes. FTL shipments are loaded once and unloaded once at the final destination. LTL freight is handled multiple times -- at pickup, at origin terminal, at destination terminal, and at delivery. Each handling point increases the risk of damage. FTL damage claim rates are roughly 1-2% compared to 3-5% for LTL.",
    },
    {
      question: "Can I ship just a few pallets as FTL?",
      answer:
        "You can, but it is usually not cost-effective unless the cargo is high-value, fragile, or time-sensitive. You will pay for the entire trailer regardless of how much space you use. Some shippers choose partial FTL for 4-6 pallets of fragile goods to avoid the extra handling of LTL. Another option is volume LTL, which offers FTL-like handling for 6-12 pallets at a discounted rate.",
    },
  ];

  const relatedLinks = [
    { label: "FTL Shipping Services", to: "/services/ftl" },
    { label: "LTL Shipping Services", to: "/services/ltl" },
    {
      label: "Freight Shipping Cost Guide",
      to: "/resources/freight-shipping-cost",
    },
    {
      label: "Freight Classes Explained",
      to: "/resources/freight-classes-explained",
    },
  ];

  const content = (
    <>
      <p>
        <strong>FTL (Full Truckload)</strong> means your shipment fills an entire trailer and
        travels directly from origin to destination with no stops. <strong>LTL
        (Less-Than-Truckload)</strong> means your shipment shares trailer space with freight from
        other shippers and passes through hub terminals along the way. FTL is the better choice
        for shipments over <strong>6 pallets or 10,000 lbs</strong>. It is faster (1-3 days vs
        3-7 days), has lower damage risk (1-2% vs 3-5% claim rate), and becomes more
        cost-effective at higher volumes.
      </p>
      <p>
        LTL is ideal for <strong>1-5 pallets under 10,000
        lbs</strong>, where you only pay for the space you use. The cost crossover point,
        where FTL becomes cheaper than LTL, typically falls around{" "}
        <strong>6-8 pallets or 10,000-12,000 lbs</strong>, though this varies by lane and
        freight class. If your shipment falls in this range,{" "}
        <Link to="/quote">get quotes for both FTL and LTL from DeMar Transportation</Link> to
        find the most economical option.
      </p>

      <h2>FTL vs LTL: Complete Comparison</h2>
      <table>
        <thead>
          <tr>
            <th>Factor</th>
            <th>FTL (Full Truckload)</th>
            <th>LTL (Less-Than-Truckload)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Shipment Size</td>
            <td>6+ pallets, 10,000+ lbs</td>
            <td>1-5 pallets, under 10,000 lbs</td>
          </tr>
          <tr>
            <td>Pricing Model</td>
            <td>Per mile ($1.50-$4.00/mi)</td>
            <td>Per hundredweight by freight class</td>
          </tr>
          <tr>
            <td>Transit Time</td>
            <td>1-3 days (under 1,500 mi)</td>
            <td>3-7 days (same distance)</td>
          </tr>
          <tr>
            <td>Handling</td>
            <td>Loaded once, unloaded once</td>
            <td>Handled 4-6 times through terminals</td>
          </tr>
          <tr>
            <td>Damage Risk</td>
            <td>Low (1-2% claim rate)</td>
            <td>Higher (3-5% claim rate)</td>
          </tr>
          <tr>
            <td>Tracking</td>
            <td>Real-time GPS on dedicated truck</td>
            <td>Terminal scan updates</td>
          </tr>
          <tr>
            <td>Flexibility</td>
            <td>Pickup/delivery on your schedule</td>
            <td>Carrier's terminal schedule</td>
          </tr>
          <tr>
            <td>Best For</td>
            <td>Large, time-sensitive, fragile loads</td>
            <td>Small, budget-friendly shipments</td>
          </tr>
        </tbody>
      </table>

      <h2>When FTL Is the Right Choice</h2>
      <p>
        <Link to="/services/ftl">Full truckload shipping</Link> makes sense in these scenarios:
      </p>
      <ul>
        <li>
          <strong>Large shipments:</strong> 6+ pallets or 10,000+ lbs. You are paying for the
          whole trailer either way, so fill it up.
        </li>
        <li>
          <strong>Time-sensitive deliveries:</strong> FTL moves directly from A to B with no
          terminal stops. A 1,000-mile FTL shipment delivers in 1-2 days; LTL takes 4-6 days.
        </li>
        <li>
          <strong>Fragile or high-value cargo:</strong> Fewer handling points mean less damage
          risk. This is critical for electronics, glassware, or machinery.
        </li>
        <li>
          <strong>Hazardous materials:</strong> Many LTL carriers restrict hazmat. FTL provides
          dedicated capacity with proper placarding and compliance.
        </li>
        <li>
          <strong>Consistent shipping lanes:</strong> Regular FTL volume on the same lanes earns
          volume discounts and dedicated capacity commitments.
        </li>
      </ul>

      <h3>Pros of FTL</h3>
      <ul>
        <li>Fastest transit times -- direct, no stops</li>
        <li>Lowest damage risk -- loaded and unloaded only once</li>
        <li>Full trailer space for your freight only</li>
        <li>Flexible pickup and delivery scheduling</li>
        <li>Real-time GPS tracking throughout transit</li>
        <li>No freight class classification required</li>
        <li>Lower per-pound cost for large shipments</li>
      </ul>

      <h3>Cons of FTL</h3>
      <ul>
        <li>Higher total cost for small shipments (you pay for the full trailer)</li>
        <li>Wasted space if you cannot fill the trailer</li>
        <li>Less cost-effective under 6 pallets or 10,000 lbs</li>
      </ul>

      <h2>When LTL Is the Right Choice</h2>
      <p>
        <Link to="/services/ltl">Less-than-truckload shipping</Link> is ideal when:
      </p>
      <ul>
        <li>
          <strong>Small shipments:</strong> 1-5 pallets or under 10,000 lbs. You only pay for
          the space your freight occupies.
        </li>
        <li>
          <strong>Budget is the priority:</strong> LTL is significantly cheaper for small loads.
          A 2-pallet shipment might cost $400-$800 via LTL compared to $1,500-$2,500 for FTL.
        </li>
        <li>
          <strong>Delivery timing is flexible:</strong> If 3-7 day transit is acceptable, LTL
          saves money without compromising reliability.
        </li>
        <li>
          <strong>Multiple delivery locations:</strong> LTL carriers serve more delivery points
          through their terminal networks, including residential and limited-access locations.
        </li>
      </ul>

      <h3>Pros of LTL</h3>
      <ul>
        <li>Lower total cost for small shipments</li>
        <li>Pay only for the space you use</li>
        <li>Extensive delivery network including residential areas</li>
        <li>Accessorial services (liftgate, inside delivery) widely available</li>
        <li>Guaranteed delivery dates available for a premium</li>
      </ul>

      <h3>Cons of LTL</h3>
      <ul>
        <li>Slower transit times (3-7 days typical)</li>
        <li>Higher damage risk from multiple handling points</li>
        <li>Freight class classification required (affects pricing)</li>
        <li>Reweigh and reclassification fees if shipment details are inaccurate</li>
        <li>Less flexible pickup and delivery windows</li>
        <li>Shipment shares space with other freight</li>
      </ul>

      <h2>The Cost Breakpoint: When FTL Beats LTL</h2>
      <p>
        The crossover point where FTL becomes cheaper than LTL depends on your specific
        shipment, but here are general guidelines:
      </p>
      <table>
        <thead>
          <tr>
            <th>Shipment Size</th>
            <th>Recommended Mode</th>
            <th>Estimated Cost (1,000 mi)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1-2 pallets (500-2,000 lbs)</td>
            <td>LTL</td>
            <td>$300 - $800</td>
          </tr>
          <tr>
            <td>3-5 pallets (2,000-7,500 lbs)</td>
            <td>LTL</td>
            <td>$600 - $1,500</td>
          </tr>
          <tr>
            <td>6-8 pallets (7,500-12,000 lbs)</td>
            <td>Quote both</td>
            <td>LTL: $1,200-$2,200 / FTL: $1,800-$2,800</td>
          </tr>
          <tr>
            <td>9-14 pallets (12,000-25,000 lbs)</td>
            <td>FTL</td>
            <td>$2,000 - $3,000</td>
          </tr>
          <tr>
            <td>15-26 pallets (25,000-44,000 lbs)</td>
            <td>FTL</td>
            <td>$2,000 - $3,500</td>
          </tr>
        </tbody>
      </table>
      <p>
        Notice that FTL cost stays relatively flat between 9 and 26 pallets because you are
        paying for the trailer, not the individual pallets. This is why consolidating multiple
        small LTL shipments into one FTL load often saves 30-50%.
      </p>

      <h2>How to Decide: FTL or LTL?</h2>
      <p>
        Ask yourself these questions:
      </p>
      <ol>
        <li>
          <strong>How many pallets are you shipping?</strong> Under 6 pallets, start with LTL.
          Over 6 pallets, get FTL quotes. In the 6-8 range, quote both.
        </li>
        <li>
          <strong>How quickly does it need to arrive?</strong> If transit time matters, FTL is
          2-4 days faster on most lanes.
        </li>
        <li>
          <strong>How fragile is the cargo?</strong> High-value or damage-sensitive freight
          benefits from FTL's single-handling approach.
        </li>
        <li>
          <strong>What is your budget?</strong> If cost is the primary concern and you have a
          small shipment, LTL wins.
        </li>
        <li>
          <strong>Do you ship regularly?</strong> Consistent FTL volume earns better rates over
          time. Consider a dedicated lane contract.
        </li>
      </ol>

      <h2>Volume LTL: The Middle Ground</h2>
      <p>
        For shipments in the gray zone (6-12 pallets, 10,000-20,000 lbs), volume LTL offers a
        middle ground. Volume LTL provides FTL-like handling with fewer terminal touches, at a
        price point between standard LTL and FTL. Not all carriers offer volume LTL, so ask
        your broker or carrier about availability on your lane.
      </p>

      <h2>Ship Smarter with DeMar Transportation</h2>
      <p>
        DeMar Transportation handles both <Link to="/services/ftl">FTL</Link> and{" "}
        <Link to="/services/ltl">LTL</Link> shipments across all 48 contiguous states. Our
        freight specialists will analyze your shipment and recommend the most cost-effective
        option -- whether that is FTL, LTL, or volume LTL.{" "}
        <Link to="/quote">Request a free quote</Link> and get a transparent comparison within 1
        business hour. No hidden fees, no obligation.
      </p>
    </>
  );

  return (
    <ResourceArticle
      title="FTL vs LTL: How to Choose the Right Shipping Method"
      subtitle="Shipping Guide"
      description="Compare FTL and LTL shipping methods side by side. Learn cost breakpoints, transit times, damage risk, and how to choose the right option for your freight."
      metaTitle="FTL vs LTL: How to Choose the Right Shipping Method | DeMar Transportation"
      metaDescription="FTL vs LTL: FTL is faster and safer for 6+ pallets. LTL saves money under 10,000 lbs. Compare costs, transit times, and damage risk in this complete guide."
      slug="ftl-vs-ltl"
      publishDate="2026-03-29"
      content={content}
      faqs={faqs}
      relatedLinks={relatedLinks}
    />
  );
};

export default FtlVsLtl;
