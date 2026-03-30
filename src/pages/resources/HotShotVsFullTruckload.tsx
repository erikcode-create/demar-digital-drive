import ResourceArticle from "@/components/ResourceArticle";
import { Link } from "react-router-dom";

const HotShotVsFullTruckload = () => {
  const faqs = [
    {
      question: "What is hot shot trucking?",
      answer:
        "Hot shot trucking uses medium-duty trucks (Class 3-5) with flatbed or gooseneck trailers to deliver time-sensitive, smaller loads. These trucks typically haul 10,000-16,500 lbs and can be dispatched within hours, making them ideal for urgent freight that doesn't require a full 53-foot trailer.",
    },
    {
      question: "Is hot shot cheaper than full truckload?",
      answer:
        "Not always. Hot shot rates per mile are often higher ($2.50-$4.00/mile vs $2.00-$3.50/mile for FTL), but the total shipment cost can be lower for small loads because you're not paying for unused trailer space. For loads over 10,000 lbs or distances over 500 miles, FTL is usually more cost-effective.",
    },
    {
      question: "How fast can a hot shot delivery be picked up?",
      answer:
        "Hot shot carriers can typically pick up within 2-4 hours of booking, compared to 24-48 hours for standard FTL. This rapid response makes hot shot the go-to option for emergency parts, oilfield equipment, and production-line-down situations where every hour of delay costs money.",
    },
    {
      question: "What size loads are best for hot shot?",
      answer:
        "Hot shot is best for loads between 1,000 and 16,500 lbs that fit on a 40-foot or shorter trailer. Common hot shot freight includes machinery parts, construction materials, agricultural equipment, and oilfield supplies. If your load exceeds 16,500 lbs or requires a 53-foot trailer, full truckload is the better option.",
    },
    {
      question: "Can hot shot trucks haul oversized freight?",
      answer:
        "Some hot shot carriers can haul moderately oversized loads using step-deck or RGN trailers, but they're limited compared to full-size heavy haul equipment. For loads exceeding 48 feet in length, 8.5 feet in width, or 40,000 lbs, you'll need a standard FTL or specialized heavy haul carrier.",
    },
  ];

  const content = (
    <>
      <p>
        <strong>Hot shot delivery is faster but costs more per mile, while full truckload (FTL) is more economical for large shipments.</strong> Hot shot uses medium-duty trucks to haul urgent, smaller loads (up to 16,500 lbs) with pickup times as fast as 2-4 hours. FTL uses standard 53-foot trailers carrying up to 45,000 lbs with typical 24-48 hour pickup windows.
      </p>
      <p>
        The right choice depends on three factors: how much freight you're shipping, how quickly it needs to arrive, and your budget. For loads under 10,000 lbs that need to move today, hot shot wins. For shipments over 10,000 lbs with standard timelines, FTL delivers better per-pound economics. Below is a detailed comparison to help you decide which service fits your shipment.
      </p>

      <h2>Hot Shot vs Full Truckload: Side-by-Side Comparison</h2>

      <table>
        <thead>
          <tr>
            <th>Factor</th>
            <th>Hot Shot</th>
            <th>Full Truckload (FTL)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Equipment</strong></td>
            <td>Class 3-5 truck with 20-40 ft trailer</td>
            <td>Class 8 semi with 53 ft trailer</td>
          </tr>
          <tr>
            <td><strong>Max Weight</strong></td>
            <td>10,000-16,500 lbs</td>
            <td>42,000-45,000 lbs</td>
          </tr>
          <tr>
            <td><strong>Pickup Speed</strong></td>
            <td>2-4 hours</td>
            <td>24-48 hours</td>
          </tr>
          <tr>
            <td><strong>Transit Time</strong></td>
            <td>Same-day to next-day (under 500 mi)</td>
            <td>1-5 days depending on distance</td>
          </tr>
          <tr>
            <td><strong>Cost Per Mile</strong></td>
            <td>$2.50-$4.00/mile</td>
            <td>$2.00-$3.50/mile</td>
          </tr>
          <tr>
            <td><strong>Cost Per Pound</strong></td>
            <td>Higher (paying for speed)</td>
            <td>Lower (economies of scale)</td>
          </tr>
          <tr>
            <td><strong>Best For</strong></td>
            <td>Urgent, small-to-mid loads</td>
            <td>Large, planned shipments</td>
          </tr>
          <tr>
            <td><strong>Common Freight</strong></td>
            <td>Machinery parts, oilfield equipment</td>
            <td>Palletized goods, retail inventory</td>
          </tr>
        </tbody>
      </table>

      <h2>When Hot Shot Makes Sense</h2>

      <p>
        Hot shot trucking is the right call when speed matters more than cost. These are the most common scenarios where hot shot outperforms FTL:
      </p>

      <ul>
        <li><strong>Emergency breakdowns:</strong> A manufacturing line goes down and needs a replacement part within hours. Hot shot can pick up and deliver the same day within a 300-mile radius.</li>
        <li><strong>Small urgent loads:</strong> You have 2-3 pallets or a single piece of equipment (under 10,000 lbs) that needs to move fast. Booking a full 53-foot trailer wastes money on empty space.</li>
        <li><strong>Oilfield and construction sites:</strong> Remote job sites often need pipe, fittings, or tools delivered on tight schedules. Hot shot trucks can access sites that full-size semis cannot.</li>
        <li><strong>Time-definite deliveries:</strong> When a shipment must arrive by a specific hour, not just a specific day, hot shot's direct routing and smaller equipment reduce delays.</li>
        <li><strong>Last-mile or rural deliveries:</strong> Hot shot trucks navigate narrow roads and tight loading docks more easily than 53-foot trailers.</li>
      </ul>

      <h2>When Full Truckload Is Better</h2>

      <p>
        <Link to="/services/ftl">Full truckload shipping</Link> wins when you're optimizing for cost per pound and have enough freight to fill a trailer:
      </p>

      <ul>
        <li><strong>Loads over 10,000 lbs:</strong> Once your shipment exceeds hot shot capacity, FTL is your only single-truck option. At 20,000+ lbs, FTL cost-per-pound can be 40-60% lower than splitting across multiple hot shot loads.</li>
        <li><strong>Planned shipments with lead time:</strong> If you can book 24-48 hours in advance, FTL rates are significantly lower than same-day hot shot premiums.</li>
        <li><strong>Multi-pallet loads:</strong> 10+ pallets of product fit efficiently in a 53-foot <Link to="/services/dry-van">dry van</Link>. Hot shot trailers max out at 6-8 pallets.</li>
        <li><strong>Long-haul routes (500+ miles):</strong> FTL per-mile rates drop on longer routes. Hot shot rates stay elevated because of the expedited service expectation.</li>
        <li><strong>Temperature-controlled freight:</strong> Full-size <Link to="/services/reefer">reefer trailers</Link> maintain more consistent temperatures than smaller hot shot refrigerated units.</li>
      </ul>

      <h2>Cost Comparison: Real-World Examples</h2>

      <p>
        To illustrate the cost tradeoff, here are three typical shipment scenarios:
      </p>

      <h3>Scenario 1: 3,000 lbs, 200 miles, urgent</h3>
      <ul>
        <li><strong>Hot shot:</strong> $700-$900 (same-day pickup and delivery)</li>
        <li><strong>FTL:</strong> $500-$700 (next-day pickup, arrives day after)</li>
        <li><strong>Verdict:</strong> Hot shot costs $200 more but saves 24+ hours</li>
      </ul>

      <h3>Scenario 2: 15,000 lbs, 500 miles, standard timeline</h3>
      <ul>
        <li><strong>Hot shot:</strong> $1,800-$2,200 (may need larger hot shot unit)</li>
        <li><strong>FTL:</strong> $1,200-$1,600 (standard 53-ft dry van)</li>
        <li><strong>Verdict:</strong> FTL saves $500-$600. Hot shot only justified if delivery is truly urgent.</li>
      </ul>

      <h3>Scenario 3: 40,000 lbs, 1,000 miles, planned</h3>
      <ul>
        <li><strong>Hot shot:</strong> Not feasible (exceeds capacity)</li>
        <li><strong>FTL:</strong> $2,500-$3,500</li>
        <li><strong>Verdict:</strong> FTL is the only option at this weight</li>
      </ul>

      <h2>How to Decide: Quick Checklist</h2>

      <ol>
        <li><strong>Weight check:</strong> Over 16,500 lbs? Go FTL. Under 10,000 lbs? Consider hot shot.</li>
        <li><strong>Urgency check:</strong> Need pickup in under 4 hours? Hot shot. Can wait 24-48 hours? FTL.</li>
        <li><strong>Distance check:</strong> Under 300 miles and time-sensitive? Hot shot excels here. Over 500 miles with lead time? FTL.</li>
        <li><strong>Budget check:</strong> Cost-per-pound matters most? FTL. Speed matters most? Hot shot.</li>
        <li><strong>Access check:</strong> Tight loading dock or remote site? Hot shot trucks are more maneuverable.</li>
      </ol>

      <p>
        Not sure which option fits your shipment? <Link to="/quote">Request a free quote</Link> from DeMar Transportation. We operate both hot shot and full truckload equipment, so we'll recommend the most cost-effective option for your specific load, timeline, and route.
      </p>

      <h2>DeMar Transportation: Hot Shot and FTL Services</h2>

      <p>
        DeMar Transportation provides both <Link to="/services/sprinter-van">expedited sprinter van</Link> and <Link to="/services/ftl">full truckload</Link> services across the continental United States. As both a licensed carrier and freight broker, we match your shipment to the right equipment -- whether that's a hot shot truck for a same-day emergency or a 53-foot trailer for a planned cross-country move. Every shipment includes real-time tracking, dedicated support, and competitive rates.
      </p>
    </>
  );

  return (
    <ResourceArticle
      title="Hot Shot vs Full Truckload: When to Use Each"
      subtitle="Equipment Guide"
      description="Compare hot shot delivery and full truckload shipping. Learn which option saves money, which is faster, and how to choose the right service for your freight."
      metaTitle="Hot Shot vs Full Truckload: When to Use Each | DeMar Transportation"
      metaDescription="Compare hot shot vs full truckload shipping: cost per mile, transit times, weight limits, and when each option makes sense. Free comparison guide from DeMar Transportation."
      slug="hot-shot-vs-full-truckload"
      publishDate="2026-03-29"
      content={content}
      faqs={faqs}
      relatedLinks={[
        { label: "Sprinter Van & Expedited Services", to: "/services/sprinter-van" },
        { label: "Full Truckload (FTL) Shipping", to: "/services/ftl" },
        { label: "How Much Does Freight Shipping Cost?", to: "/resources/freight-shipping-cost" },
      ]}
    />
  );
};

export default HotShotVsFullTruckload;
