import ResourceArticle from "@/components/ResourceArticle";
import { Link } from "react-router-dom";

const HowToShipFreight = () => {
  const faqs = [
    {
      question: "How much does it cost to ship freight?",
      answer:
        "Freight shipping costs depend on weight, distance, equipment type, and market conditions. As a general range: local shipments (under 250 miles) cost $300-$800 for a sprinter van or box truck, and $800-$1,500 for a full truckload. Long-haul FTL shipments (1,000+ miles) typically run $2,000-$4,000. LTL shipments cost $150-$500 for a few pallets. Get an accurate quote by providing your origin, destination, weight, and dimensions.",
    },
    {
      question: "What information do I need to get a freight quote?",
      answer:
        "To get an accurate freight quote, you need: (1) pickup and delivery zip codes, (2) total weight of the shipment, (3) number of pallets or pieces, (4) dimensions (length x width x height), (5) commodity description, (6) pickup and delivery dates, and (7) any special requirements like liftgate, temperature control, or inside delivery.",
    },
    {
      question: "How long does freight shipping take?",
      answer:
        "Transit times vary by distance and service type. Local deliveries (under 250 miles) typically arrive same-day or next-day. Regional shipments (250-750 miles) take 1-3 days. Cross-country shipments (2,000+ miles) take 4-6 days for FTL. Expedited services can cut these times in half. LTL shipments add 1-3 days due to hub transfers.",
    },
    {
      question: "Do I need freight insurance?",
      answer:
        "All licensed carriers have cargo liability insurance, but it typically covers only $100,000 per incident with limited per-pound coverage ($0.50-$1.00/lb). For high-value shipments, purchase supplemental freight insurance through your carrier or a third-party provider. Full-value coverage typically costs 1-3% of the cargo value.",
    },
    {
      question: "What's the difference between a freight broker and a carrier?",
      answer:
        "A carrier owns trucks and hauls freight directly. A freight broker connects shippers with carriers, negotiating rates and managing logistics without owning trucks. Some companies, like DeMar Transportation, operate as both -- we own our own fleet and also broker freight to vetted partner carriers, giving you the best combination of capacity, reliability, and price.",
    },
  ];

  const content = (
    <>
      <p>
        <strong>To ship freight for the first time, follow these 7 steps: determine your shipment details, choose the right equipment type, get quotes from carriers or brokers, prepare your freight for transport, schedule pickup, track your shipment, and confirm delivery.</strong> The entire process can be completed in as little as 24 hours for urgent shipments, or planned days or weeks in advance for the best rates. The most important step for first-time shippers is getting your shipment details right -- accurate weight, dimensions, and commodity information prevent billing surprises and ensure your freight arrives safely. Here is a step-by-step walkthrough of the entire freight shipping process, from first-time quote to confirmed delivery.
      </p>

      <h2>Step 1: Determine Your Shipment Details</h2>

      <p>
        Before contacting any carrier or broker, gather these essential details about your freight:
      </p>

      <ul>
        <li><strong>Weight:</strong> Total weight in pounds. Weigh each piece or pallet. Estimates lead to reweigh fees ($50-$150).</li>
        <li><strong>Dimensions:</strong> Length x width x height of each piece, in inches. Include pallet dimensions if palletized.</li>
        <li><strong>Number of pieces:</strong> How many pallets, crates, or individual items.</li>
        <li><strong>Commodity:</strong> What you're shipping. This affects insurance, equipment needs, and regulatory requirements.</li>
        <li><strong>Origin and destination:</strong> Full address or at minimum zip codes for both pickup and delivery.</li>
        <li><strong>Dates:</strong> When freight is ready for pickup and when it needs to arrive.</li>
        <li><strong>Special requirements:</strong> Liftgate, inside delivery, temperature control, hazmat, residential pickup/delivery.</li>
      </ul>

      <h2>Step 2: Choose the Right Equipment Type</h2>

      <p>
        Your cargo type and volume determine which <Link to="/resources/types-of-freight-trailers">trailer type</Link> you need:
      </p>

      <table>
        <thead>
          <tr>
            <th>Shipment Size</th>
            <th>Equipment Type</th>
            <th>Typical Use</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1-4 pallets (under 5,000 lbs)</td>
            <td><Link to="/services/sprinter-van">Sprinter van</Link> or LTL</td>
            <td>Small, urgent, or expedited</td>
          </tr>
          <tr>
            <td>5-10 pallets (5,000-15,000 lbs)</td>
            <td>Box truck or partial FTL</td>
            <td>Mid-size, regional</td>
          </tr>
          <tr>
            <td>11-26 pallets (15,000-45,000 lbs)</td>
            <td><Link to="/services/ftl">Full truckload</Link></td>
            <td>Large, full trailer loads</td>
          </tr>
          <tr>
            <td>Temperature-sensitive</td>
            <td><Link to="/services/reefer">Reefer trailer</Link></td>
            <td>Perishables, pharma</td>
          </tr>
          <tr>
            <td>Oversized or heavy</td>
            <td><Link to="/services/flatbed">Flatbed</Link></td>
            <td>Machinery, construction materials</td>
          </tr>
        </tbody>
      </table>

      <h2>Step 3: Get Quotes</h2>

      <p>
        <Link to="/resources/how-to-get-freight-quote">Getting freight quotes</Link> is straightforward. Contact 2-3 carriers or brokers with your shipment details. Compare quotes based on:
      </p>

      <ul>
        <li><strong>Total cost:</strong> All-in price including fuel surcharges and accessorial fees</li>
        <li><strong>Transit time:</strong> Estimated pickup and delivery dates</li>
        <li><strong>Insurance coverage:</strong> What's included and what's extra</li>
        <li><strong>Tracking capability:</strong> Real-time GPS tracking vs. check-call updates</li>
        <li><strong>Carrier reputation:</strong> Safety record, on-time percentage, reviews</li>
      </ul>

      <p>
        <strong>Pro tip:</strong> The cheapest quote isn't always the best value. A carrier with a 98% on-time rate at $200 more is often worth it compared to a discount carrier with service issues. <Link to="/quote">Request a free quote from DeMar Transportation</Link> -- we respond within 1 business hour.
      </p>

      <h2>Step 4: Prepare Your Freight</h2>

      <p>
        Proper freight preparation prevents damage claims and shipping delays. Follow these guidelines:
      </p>

      <h3>Palletizing</h3>
      <ul>
        <li>Use standard 48" x 40" pallets when possible</li>
        <li>Stack boxes in a column pattern, not a brick pattern (columns are easier to shrink-wrap)</li>
        <li>Don't exceed the pallet edge -- overhang causes damage during loading</li>
        <li>Maximum pallet height: 48-60 inches (check with your carrier)</li>
      </ul>

      <h3>Packaging</h3>
      <ul>
        <li>Wrap pallets with at least 3-4 layers of stretch wrap</li>
        <li>Use corner protectors on fragile or high-value shipments</li>
        <li>Add "FRAGILE" or "THIS SIDE UP" labels where appropriate</li>
        <li>Ensure nothing is loose that could shift during transit</li>
      </ul>

      <h3>Labeling</h3>
      <ul>
        <li>Label each piece with: shipper name, consignee name, PO number, piece count (e.g., "1 of 3")</li>
        <li>Include weight on each pallet label</li>
        <li>Place labels on at least two sides of each pallet</li>
      </ul>

      <h2>Step 5: Schedule Pickup</h2>

      <p>
        Once you've selected a carrier and prepared your freight, schedule the pickup:
      </p>

      <ul>
        <li><strong>Confirm pickup window:</strong> Most carriers require a 2-4 hour pickup window (e.g., 8:00 AM - 12:00 PM)</li>
        <li><strong>Provide dock details:</strong> Loading dock availability, dock height, forklift on-site or liftgate needed</li>
        <li><strong>Bill of lading (BOL):</strong> Your carrier will provide a BOL template, or you can create your own. It must include shipper/consignee info, commodity description, weight, piece count, and any special instructions.</li>
        <li><strong>Have freight ready:</strong> Freight should be staged and ready to load when the driver arrives. Detention fees ($50-$100/hour) apply if loading takes longer than the free time allowance (typically 1-2 hours).</li>
      </ul>

      <h2>Step 6: Track Your Shipment</h2>

      <p>
        Modern carriers provide real-time tracking through GPS-equipped trucks and driver check-in apps. Here's what to expect:
      </p>

      <ul>
        <li><strong>Pickup confirmation:</strong> You'll receive notification when the driver picks up your freight</li>
        <li><strong>In-transit updates:</strong> Real-time location updates via web portal or email/text notifications</li>
        <li><strong>ETA updates:</strong> If there are delays due to weather, traffic, or mechanical issues, your carrier should proactively notify you</li>
        <li><strong>Delivery appointment:</strong> For deliveries requiring appointments, your carrier coordinates with the receiver</li>
      </ul>

      <h2>Step 7: Confirm Delivery</h2>

      <p>
        When your freight arrives at its destination:
      </p>

      <ul>
        <li><strong>Inspect before signing:</strong> The receiver should inspect all freight for visible damage before signing the delivery receipt</li>
        <li><strong>Note exceptions:</strong> If there's damage, write "damaged" on the delivery receipt and take photos immediately</li>
        <li><strong>Count pieces:</strong> Verify piece count matches the BOL. Note any shortages on the delivery receipt.</li>
        <li><strong>Keep the BOL:</strong> Your signed BOL is your proof of delivery. Keep it for at least 2 years.</li>
        <li><strong>File claims promptly:</strong> If there's damage or loss, file a claim within 9 months (federal Carmack Amendment deadline) -- but the sooner the better.</li>
      </ul>

      <h2>Common First-Time Shipper Mistakes</h2>

      <p>
        Avoid these frequent errors that cost money and cause headaches:
      </p>

      <ol>
        <li><strong>Inaccurate weight:</strong> Underestimating weight leads to reweigh fees and rate adjustments. Always weigh your freight.</li>
        <li><strong>Poor packaging:</strong> Inadequately wrapped pallets shift and break during transit. Spend the extra 10 minutes on proper shrink wrapping.</li>
        <li><strong>Missing pickup windows:</strong> If your freight isn't ready when the truck arrives, you'll pay detention fees or get rescheduled (and possibly re-quoted).</li>
        <li><strong>Not inspecting at delivery:</strong> Signing a "clean" delivery receipt without inspecting makes damage claims nearly impossible.</li>
        <li><strong>Choosing on price alone:</strong> The cheapest carrier may have poor on-time performance, no tracking, or inadequate insurance.</li>
        <li><strong>Forgetting accessorial fees:</strong> Liftgate ($75-$150), residential delivery ($75-$125), inside delivery ($100-$200) -- ask about these upfront.</li>
      </ol>

      <p>
        Ready to ship your first load? <Link to="/quote">Get a free quote from DeMar Transportation</Link>. We specialize in helping first-time shippers navigate the process with dedicated support from pickup through delivery.
      </p>
    </>
  );

  return (
    <ResourceArticle
      title="How to Ship Freight: Beginner's Guide to Freight Shipping"
      subtitle="Shipping Guide"
      description="Step-by-step guide to shipping freight for the first time. Learn how to prepare, quote, ship, and track your freight with confidence."
      metaTitle="How to Ship Freight: Beginner's Guide to Freight Shipping | DeMar Transportation"
      metaDescription="Learn how to ship freight in 7 easy steps: get shipment details, choose equipment, get quotes, prepare freight, schedule pickup, track, and confirm delivery. Free beginner's guide."
      slug="how-to-ship-freight"
      publishDate="2026-03-29"
      content={content}
      faqs={faqs}
      relatedLinks={[
        { label: "How to Get a Freight Quote", to: "/resources/how-to-get-freight-quote" },
        { label: "Types of Freight Trailers", to: "/resources/types-of-freight-trailers" },
        { label: "How Much Does Freight Shipping Cost?", to: "/resources/freight-shipping-cost" },
        { label: "Request a Free Quote", to: "/quote" },
      ]}
    />
  );
};

export default HowToShipFreight;
