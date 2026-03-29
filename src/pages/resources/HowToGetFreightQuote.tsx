import ResourceArticle from "@/components/ResourceArticle";
import { Link } from "react-router-dom";

const HowToGetFreightQuote = () => {
  const faqs = [
    {
      question: "How long does it take to get a freight quote?",
      answer:
        "Most freight brokers and carriers provide quotes within 1-4 hours during business hours. At DeMar Transportation, we respond to quote requests within 1 business hour. Automated online quoting tools can provide instant estimates, but these are often less accurate than quotes reviewed by a freight specialist.",
    },
    {
      question: "Is a freight quote the same as a freight rate?",
      answer:
        "Not exactly. A freight quote is an estimated price for a specific shipment based on the details you provide. A freight rate is the agreed-upon price once the shipment is booked. Quotes can change if shipment details change (weight, dimensions, dates) or if too much time passes between quote and booking.",
    },
    {
      question: "Do I need to pay for a freight quote?",
      answer:
        "No. Reputable carriers and brokers provide free, no-obligation freight quotes. If a company charges for a quote, consider it a red flag. At DeMar Transportation, all quotes are free with no commitment required.",
    },
    {
      question: "How many freight quotes should I get?",
      answer:
        "We recommend getting 2-3 quotes for comparison, especially for new lanes or large shipments. However, do not choose solely on price -- transit time, carrier reliability, insurance coverage, and communication quality are equally important factors.",
    },
    {
      question: "What if my shipment details change after I get a quote?",
      answer:
        "Contact your carrier or broker immediately. Changes in weight, dimensions, pickup/delivery locations, or dates can affect pricing. Minor changes may not impact the rate, but significant changes (e.g., adding 5,000 lbs or changing equipment type) will require a requote.",
    },
  ];

  const relatedLinks = [
    {
      label: "Freight Shipping Cost Guide",
      to: "/resources/freight-shipping-cost",
    },
    {
      label: "How to Choose a Freight Carrier",
      to: "/resources/how-to-choose-freight-carrier",
    },
    { label: "Request a Free Quote", to: "/quote" },
  ];

  const content = (
    <>
      <p>
        To get a freight shipping quote, you need <strong>5 key pieces of information</strong>:
        origin and destination addresses, total weight, commodity type, required equipment, and
        your preferred ship date. You can request quotes directly from carriers, through freight
        brokers, or via online platforms. The fastest way is to submit a quote request form --{" "}
        <Link to="/quote">DeMar Transportation responds within 1 business hour</Link> with
        transparent, all-in pricing. For the most accurate quote, provide exact zip codes (not
        just cities), precise weight and pallet count, and any special requirements like
        temperature control or liftgate service. Avoid vague descriptions -- the more specific
        your shipment details, the tighter your quote will be and the fewer surprises you will
        encounter at billing. Here is the complete step-by-step process to get, compare, and
        book the best freight quote for your shipment.
      </p>

      <h2>Step-by-Step: How to Get a Freight Quote</h2>
      <ol>
        <li>
          <strong>Gather your shipment details.</strong> Before contacting any carrier or broker,
          compile all relevant information (see checklist below). Having everything ready speeds
          up the quoting process and improves accuracy.
        </li>
        <li>
          <strong>Choose your quoting method.</strong> You can get quotes from direct carriers,
          freight brokers (like DeMar Transportation), or online freight marketplaces. Brokers
          often provide the best combination of competitive pricing and service because they
          access multiple carrier networks.
        </li>
        <li>
          <strong>Submit your quote request.</strong> Fill out the carrier's or broker's quote
          form with complete details.{" "}
          <Link to="/quote">DeMar Transportation's quote form</Link> takes under 2 minutes to
          complete.
        </li>
        <li>
          <strong>Review and compare quotes.</strong> Evaluate each quote on total cost, transit
          time, insurance coverage, and service terms -- not just the bottom-line price.
        </li>
        <li>
          <strong>Ask questions.</strong> Clarify anything unclear: Are fuel surcharges included?
          What happens if the shipment is heavier than estimated? Is there detention time
          included?
        </li>
        <li>
          <strong>Book the shipment.</strong> Once you choose a quote, confirm the booking.
          You will receive a rate confirmation or bill of lading with all agreed terms.
        </li>
      </ol>

      <h2>Information You Need for a Freight Quote</h2>
      <p>
        Having these details ready ensures you get an accurate quote on the first try:
      </p>
      <table>
        <thead>
          <tr>
            <th>Detail</th>
            <th>Why It Matters</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Origin address/zip</td>
            <td>Determines lane and mileage</td>
            <td>Reno, NV 89501</td>
          </tr>
          <tr>
            <td>Destination address/zip</td>
            <td>Determines lane and mileage</td>
            <td>Dallas, TX 75201</td>
          </tr>
          <tr>
            <td>Total weight</td>
            <td>Affects rate and equipment</td>
            <td>22,000 lbs</td>
          </tr>
          <tr>
            <td>Number of pallets</td>
            <td>Determines FTL vs LTL</td>
            <td>12 pallets (48x40)</td>
          </tr>
          <tr>
            <td>Commodity description</td>
            <td>Insurance and handling requirements</td>
            <td>Packaged dry food products</td>
          </tr>
          <tr>
            <td>Equipment type</td>
            <td>Pricing varies by trailer type</td>
            <td>Dry van, reefer, flatbed</td>
          </tr>
          <tr>
            <td>Pickup date</td>
            <td>Capacity and rate depend on timing</td>
            <td>April 5, 2026</td>
          </tr>
          <tr>
            <td>Delivery deadline</td>
            <td>Expedited service costs more</td>
            <td>April 8, 2026</td>
          </tr>
          <tr>
            <td>Special requirements</td>
            <td>Accessorial charges may apply</td>
            <td>Liftgate, temp 34°F, hazmat</td>
          </tr>
        </tbody>
      </table>

      <h2>How to Compare Freight Quotes</h2>
      <p>
        Price is important, but it should not be your only consideration. Here is what to
        evaluate when comparing freight quotes:
      </p>

      <h3>Total Cost (All-In)</h3>
      <p>
        Make sure you are comparing apples to apples. Some carriers quote a base rate and add
        fuel surcharges, accessorial fees, and insurance separately. Others provide all-in
        pricing. Ask each provider for a{" "}
        <strong>total landed cost</strong> that includes every charge. At DeMar Transportation,
        our quotes are always all-in with no hidden fees.
      </p>

      <h3>Transit Time</h3>
      <p>
        A cheaper quote with a 7-day transit time may not serve you as well as a slightly more
        expensive option with 3-day transit. Calculate the cost of delayed inventory and factor
        that into your decision.
      </p>

      <h3>Insurance Coverage</h3>
      <p>
        Verify what cargo insurance is included. Standard carrier liability is often limited to
        $0.50-$1.00 per pound, which may not cover high-value goods. Ask about full-value cargo
        insurance options. DeMar Transportation carries $1M+ in cargo insurance.
      </p>

      <h3>Tracking and Communication</h3>
      <p>
        Real-time GPS tracking, proactive delay notifications, and responsive customer service
        are worth paying a small premium for. Ask: Will I get live tracking updates? Who do I
        call if there is an issue?
      </p>

      <h3>Carrier Reputation</h3>
      <p>
        Check the carrier's safety record on FMCSA's SAFER database. Look for their MC/DOT
        number, insurance status, and any out-of-service violations. Read reviews and ask for
        references. Learn more in our guide on{" "}
        <Link to="/resources/how-to-choose-freight-carrier">
          how to choose a freight carrier
        </Link>.
      </p>

      <h2>Red Flags in Freight Quotes</h2>
      <p>
        Watch for these warning signs when evaluating freight quotes:
      </p>
      <ul>
        <li>
          <strong>Unusually low prices.</strong> If a quote is 30%+ below competitors, the
          carrier may be cutting corners on insurance, using unvetted subcontractors, or planning
          to renegotiate after pickup (double brokering).
        </li>
        <li>
          <strong>No written confirmation.</strong> Every legitimate quote should come in writing
          with clear terms. Verbal-only quotes leave you exposed.
        </li>
        <li>
          <strong>Vague surcharge language.</strong> Terms like "fuel surcharge TBD" or
          "accessorials as applicable" mean your final bill could be significantly higher.
        </li>
        <li>
          <strong>No MC or DOT number provided.</strong> Every legal carrier and broker must have
          active FMCSA authority. If they cannot provide their MC number, walk away.
        </li>
        <li>
          <strong>Pressure to book immediately.</strong> Legitimate carriers provide reasonable
          time to decide. High-pressure tactics are a red flag.
        </li>
        <li>
          <strong>No insurance documentation.</strong> A reputable carrier will readily provide a
          certificate of insurance upon request.
        </li>
      </ul>

      <h2>Where to Get Freight Quotes</h2>
      <p>
        You have several options for sourcing freight quotes:
      </p>
      <ul>
        <li>
          <strong>Freight brokers</strong> (like DeMar Transportation) -- access multiple
          carriers through a single point of contact. Best for competitive rates and managed
          service.
        </li>
        <li>
          <strong>Direct carriers</strong> -- contact trucking companies directly. Good for
          established relationships and consistent lanes.
        </li>
        <li>
          <strong>Online freight marketplaces</strong> -- platforms like Freightquote or uShip
          aggregate carrier rates. Convenient but less personalized.
        </li>
        <li>
          <strong>3PL providers</strong> -- full-service logistics companies manage quoting,
          booking, and tracking. Best for shippers with complex or high-volume needs.
        </li>
      </ul>

      <h2>Get Your Free Quote from DeMar Transportation</h2>
      <p>
        Ready to get started?{" "}
        <Link to="/quote">Submit your quote request</Link> and receive a transparent, all-in
        price within 1 business hour. We handle{" "}
        <Link to="/services/ftl">FTL</Link>, <Link to="/services/ltl">LTL</Link>,{" "}
        <Link to="/services/reefer">reefer</Link>,{" "}
        <Link to="/services/flatbed">flatbed</Link>, and specialized freight across all 48
        contiguous states. No hidden fees, no surprises -- just reliable freight shipping at
        competitive rates.
      </p>
    </>
  );

  return (
    <ResourceArticle
      title="How to Get a Freight Quote: Step-by-Step Guide"
      subtitle="Freight Resources"
      description="Learn exactly what information you need and where to get freight shipping quotes. Compare quotes like a pro and avoid common pitfalls."
      metaTitle="How to Get a Freight Quote: Step-by-Step Guide | DeMar Transportation"
      metaDescription="Get a freight quote in 6 steps. Learn what info you need, how to compare quotes, and red flags to avoid. Free quotes from DeMar Transportation in under 1 hour."
      slug="how-to-get-freight-quote"
      publishDate="2026-03-29"
      content={content}
      faqs={faqs}
      relatedLinks={relatedLinks}
    />
  );
};

export default HowToGetFreightQuote;
