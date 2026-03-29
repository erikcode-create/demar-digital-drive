import ResourceArticle from "@/components/ResourceArticle";
import { Link } from "react-router-dom";

const HowToChooseFreightCarrier = () => {
  const faqs = [
    {
      question: "What is the difference between a freight broker and a carrier?",
      answer:
        "A freight carrier owns trucks and physically transports your goods. A freight broker acts as an intermediary, connecting shippers with carriers. Brokers do not own trucks but provide access to larger carrier networks, often at competitive rates. Some companies, like DeMar Transportation, operate as both carrier and broker, offering the reliability of owned equipment plus network flexibility.",
    },
    {
      question: "How do I verify a freight carrier's authority?",
      answer:
        "Search the carrier's MC or DOT number on FMCSA's SAFER website (safer.fmcsa.dot.gov). Verify their operating authority is 'Active,' check their insurance status, and review their safety rating and inspection history. Any legitimate carrier will provide their MC/DOT number on request.",
    },
    {
      question: "What insurance should a freight carrier have?",
      answer:
        "At minimum, a freight carrier should carry $750,000-$1,000,000 in auto liability insurance (required by FMCSA for interstate carriers) and $100,000 in cargo insurance. For high-value shipments, look for carriers with $250,000+ in cargo coverage. Always request a certificate of insurance before booking.",
    },
    {
      question: "Should I use a large carrier or a small carrier?",
      answer:
        "Both have advantages. Large carriers offer extensive networks, advanced technology, and financial stability. Small to mid-size carriers often provide more personalized service, flexibility, and competitive rates. The best choice depends on your shipment volume, service requirements, and the specific lanes you need covered.",
    },
    {
      question: "How important is a carrier's safety record?",
      answer:
        "Extremely important. A poor safety record increases the risk of accidents, cargo damage, and delivery failures. Check the carrier's CSA (Compliance, Safety, Accountability) scores on FMCSA's website. Look for carriers with scores below the intervention threshold in all BASIC categories, especially Unsafe Driving and Crash Indicator.",
    },
  ];

  const relatedLinks = [
    {
      label: "Broker vs Carrier vs 3PL",
      to: "/resources/broker-vs-carrier-vs-3pl",
    },
    {
      label: "How to Get a Freight Quote",
      to: "/resources/how-to-get-freight-quote",
    },
    {
      label: "Freight Shipping Cost Guide",
      to: "/resources/freight-shipping-cost",
    },
  ];

  const content = (
    <>
      <p>
        Choosing the right freight carrier comes down to <strong>5 critical criteria</strong>:
        active FMCSA authority and licensing, adequate insurance coverage, a clean safety record,
        the right equipment for your cargo, and responsive communication. The wrong carrier can
        result in damaged goods, missed delivery windows, hidden charges, and significant
        financial loss. In 2026, there are over 500,000 active motor carriers in the United
        States -- but not all are created equal. Roughly <strong>15-20% of new carriers</strong>{" "}
        fail within their first year, and cargo theft claims exceed{" "}
        <strong>$500 million annually</strong>. Vetting your carrier is not optional; it is
        essential. This guide provides a complete checklist to evaluate any freight carrier,
        whether you are shipping one load or building a long-term partnership. If you want to
        skip the research and work with a vetted, licensed carrier and broker,{" "}
        <Link to="/quote">request a quote from DeMar Transportation</Link>.
      </p>

      <h2>The Complete Freight Carrier Checklist</h2>
      <p>
        Use this checklist to evaluate any carrier before booking your first load:
      </p>

      <h3>1. Authority and Licensing</h3>
      <p>
        Every freight carrier operating interstate must hold active operating authority from the
        Federal Motor Carrier Safety Administration (FMCSA). Here is what to verify:
      </p>
      <ul>
        <li>
          <strong>MC Number:</strong> Motor Carrier number -- required for carriers transporting
          regulated commodities.
        </li>
        <li>
          <strong>DOT Number:</strong> Department of Transportation number -- required for all
          commercial vehicles.
        </li>
        <li>
          <strong>Operating status:</strong> Must show "AUTHORIZED" on FMCSA's SAFER database.
        </li>
        <li>
          <strong>Broker authority (if applicable):</strong> If the company is brokering loads,
          they need separate broker authority (MC-B).
        </li>
      </ul>
      <p>
        Search any carrier at{" "}
        <a href="https://safer.fmcsa.dot.gov" target="_blank" rel="noopener noreferrer">
          safer.fmcsa.dot.gov
        </a>. If their authority is revoked, suspended, or "Not Authorized," do not book with
        them.
      </p>

      <h3>2. Insurance Coverage</h3>
      <p>
        Adequate insurance protects your cargo and your business. Verify these minimums:
      </p>
      <table>
        <thead>
          <tr>
            <th>Insurance Type</th>
            <th>FMCSA Minimum</th>
            <th>Recommended</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Auto Liability</td>
            <td>$750,000</td>
            <td>$1,000,000+</td>
          </tr>
          <tr>
            <td>Cargo Insurance</td>
            <td>$5,000 (brokers)</td>
            <td>$100,000 - $250,000+</td>
          </tr>
          <tr>
            <td>General Liability</td>
            <td>Not required</td>
            <td>$1,000,000+</td>
          </tr>
          <tr>
            <td>Workers' Compensation</td>
            <td>Varies by state</td>
            <td>State-mandated minimum</td>
          </tr>
        </tbody>
      </table>
      <p>
        Always request a <strong>Certificate of Insurance (COI)</strong> and verify it is
        current. DeMar Transportation carries $1M+ in cargo insurance and provides COIs on
        request.
      </p>

      <h3>3. Safety Record</h3>
      <p>
        A carrier's safety history is one of the strongest predictors of future performance.
        Check these metrics:
      </p>
      <ul>
        <li>
          <strong>CSA Scores:</strong> FMCSA's Compliance, Safety, Accountability program scores
          carriers in 7 BASIC categories. Lower scores are better. Watch for carriers above the
          intervention threshold (65-80 percentile depending on category).
        </li>
        <li>
          <strong>Out-of-service rate:</strong> The percentage of inspections that result in an
          out-of-service order. The national average is about 21% for vehicles and 6% for
          drivers. Higher rates indicate maintenance or compliance problems.
        </li>
        <li>
          <strong>Crash history:</strong> Review the carrier's crash rate relative to their
          mileage. Some crashes may not be the carrier's fault, but a pattern is concerning.
        </li>
        <li>
          <strong>Safety rating:</strong> FMCSA assigns ratings of Satisfactory, Conditional, or
          Unsatisfactory. Only book with Satisfactory or unrated (not yet reviewed) carriers.
        </li>
      </ul>

      <h3>4. Equipment and Capabilities</h3>
      <p>
        Make sure the carrier has the right equipment for your freight:
      </p>
      <ul>
        <li>
          <strong>Trailer types:</strong> Do they operate{" "}
          <Link to="/services/dry-van">dry vans</Link>,{" "}
          <Link to="/services/reefer">reefers</Link>,{" "}
          <Link to="/services/flatbed">flatbeds</Link>, or specialized equipment? Do they own
          their equipment or rely entirely on subcontractors?
        </li>
        <li>
          <strong>Fleet size:</strong> A carrier with 5 trucks may not have backup capacity if a
          truck breaks down. Larger fleets or broker networks provide redundancy.
        </li>
        <li>
          <strong>Technology:</strong> GPS tracking, ELD compliance, and electronic
          documentation signal a professional operation.
        </li>
        <li>
          <strong>Geographic coverage:</strong> Can they service your lanes consistently, or are
          some regions outside their network?
        </li>
      </ul>

      <h3>5. Communication and Service Quality</h3>
      <p>
        How a carrier communicates before you book is a preview of how they will perform after.
        Evaluate:
      </p>
      <ul>
        <li>
          <strong>Response time:</strong> How quickly do they respond to quote requests and
          questions? DeMar Transportation responds within 1 business hour.
        </li>
        <li>
          <strong>Proactive updates:</strong> Do they notify you of delays or issues, or do you
          have to chase them?
        </li>
        <li>
          <strong>Single point of contact:</strong> Having a dedicated account representative
          streamlines communication.
        </li>
        <li>
          <strong>After-hours support:</strong> Freight moves 24/7. Make sure you can reach
          someone when issues arise outside business hours.
        </li>
      </ul>

      <h2>Red Flags to Watch For</h2>
      <p>
        Walk away from any carrier or broker that exhibits these warning signs:
      </p>
      <ul>
        <li>Cannot or will not provide their MC/DOT number</li>
        <li>No written rate confirmation or contract</li>
        <li>Asks for large upfront payments before pickup</li>
        <li>Has an "Unsatisfactory" FMCSA safety rating</li>
        <li>Cannot provide a Certificate of Insurance</li>
        <li>Has a pattern of cargo claims or complaints on FMCSA or BBB</li>
        <li>Quotes significantly below market rate (potential double brokering)</li>
        <li>No physical business address or professional web presence</li>
        <li>Unwilling to share references from current customers</li>
      </ul>

      <h2>Questions to Ask Before Booking</h2>
      <p>
        Use these questions when evaluating a new freight carrier:
      </p>
      <ol>
        <li>What is your MC and DOT number?</li>
        <li>How long have you been in business?</li>
        <li>What is your cargo insurance limit, and can you provide a COI?</li>
        <li>Do you own your trucks or broker to other carriers?</li>
        <li>What is your on-time delivery rate?</li>
        <li>Do you provide real-time GPS tracking?</li>
        <li>What is your claims process and average resolution time?</li>
        <li>Do you have 24/7 dispatch support?</li>
        <li>Can you provide references from shippers on similar lanes?</li>
        <li>What are your detention and TONU policies?</li>
      </ol>

      <h2>Broker vs Carrier vs 3PL</h2>
      <p>
        Understanding who you are working with matters. A <strong>carrier</strong> owns trucks
        and moves freight directly. A <strong>broker</strong> connects shippers with carriers
        but does not own equipment. A <strong>3PL</strong> (third-party logistics provider)
        offers end-to-end supply chain management including warehousing, shipping, and
        fulfillment. DeMar Transportation operates as both a carrier (with our own fleet) and a
        broker (with a vetted carrier network), giving you the reliability of asset-based
        service with the flexibility of a brokerage. Learn more in our{" "}
        <Link to="/resources/broker-vs-carrier-vs-3pl">
          broker vs carrier vs 3PL comparison guide
        </Link>.
      </p>

      <h2>Why Shippers Choose DeMar Transportation</h2>
      <p>
        DeMar Transportation meets every criterion on this checklist:
      </p>
      <ul>
        <li>Active MC and DOT authority with clean FMCSA record</li>
        <li>$1M+ cargo insurance with COI available on request</li>
        <li>Own fleet plus vetted carrier network for nationwide coverage</li>
        <li>Real-time GPS tracking on every shipment</li>
        <li>1-hour quote response time and 24/7 dispatch</li>
        <li>Dedicated account management for consistent shippers</li>
      </ul>
      <p>
        <Link to="/quote">Request your free quote</Link> and experience the DeMar difference.
      </p>
    </>
  );

  return (
    <ResourceArticle
      title="How to Choose a Freight Carrier: Complete Checklist"
      subtitle="Freight Resources"
      description="Use this 5-point checklist to vet any freight carrier. Verify authority, insurance, safety records, equipment, and service quality before booking."
      metaTitle="How to Choose a Freight Carrier: Complete Checklist | DeMar Transportation"
      metaDescription="Choose the right freight carrier with this 5-point checklist. Verify FMCSA authority, insurance, safety records, equipment, and communication before booking."
      slug="how-to-choose-freight-carrier"
      publishDate="2026-03-29"
      content={content}
      faqs={faqs}
      relatedLinks={relatedLinks}
    />
  );
};

export default HowToChooseFreightCarrier;
