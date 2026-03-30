import ResourceArticle from "@/components/ResourceArticle";
import { Link } from "react-router-dom";

const HowToShipRefrigeratedGoods = () => {
  const faqs = [
    {
      question: "What temperature should a reefer trailer be set at?",
      answer:
        "The temperature depends on the product: frozen goods require -20°F to 0°F, fresh meat and dairy need 28-40°F, fresh produce ranges from 32-55°F depending on the item, and pharmaceuticals vary by product (typically 35-46°F for refrigerated drugs). Always confirm the required temperature with the product manufacturer and set the reefer to continuous mode, not start-stop (cycle) mode.",
    },
    {
      question: "How long can a reefer trailer maintain temperature without fuel?",
      answer:
        "A modern reefer unit burns approximately 1-1.5 gallons of diesel per hour. Most reefer fuel tanks hold 50-100 gallons, providing 33-100 hours of continuous operation. However, the trailer's insulation can maintain temperature for 4-8 hours with the unit off, depending on ambient temperature and how often the doors are opened. Never rely on insulation alone for temperature-sensitive loads.",
    },
    {
      question: "What is FSMA and how does it affect refrigerated shipping?",
      answer:
        "The Food Safety Modernization Act (FSMA) Sanitary Transportation Rule requires that vehicles and equipment used to transport food are adequately cleaned, temperature is properly maintained, and shipments are protected from contamination. Carriers must have written procedures, train employees, and maintain records. Shippers must specify temperature requirements and ensure carriers comply.",
    },
    {
      question: "Do I need to pre-cool the trailer before loading?",
      answer:
        "Yes, always pre-cool the trailer to within 5°F of the desired set point before loading. For frozen goods, pre-cool to the exact set temperature. Loading warm product into a non-pre-cooled trailer causes condensation, temperature spikes, and potential spoilage. Pre-cooling typically takes 60-90 minutes for a 53-foot trailer.",
    },
    {
      question: "What happens if the reefer unit breaks down during transit?",
      answer:
        "Reputable reefer carriers have 24/7 breakdown service and can dispatch a repair technician within 2-4 hours. The driver should immediately call dispatch, park in shade if possible, and keep the doors closed to preserve temperature. Many modern reefers have remote monitoring that alerts the carrier before temperatures reach critical levels. If repair isn't possible, the load may need to be transloaded to another reefer trailer.",
    },
  ];

  const content = (
    <>
      <p>
        <strong>Shipping refrigerated goods requires maintaining precise temperatures throughout the entire cold chain, from pre-cooling the trailer to monitoring temperatures during transit to verifying conditions at delivery.</strong> The critical temperature ranges are: frozen goods at -20°F to 0°F, fresh meat and dairy at 28-40°F, fresh produce at 32-55°F (varies by item), and pharmaceuticals at product-specific ranges (typically 35-46°F).
      </p>
      <p>
        Failures in the cold chain cause an estimated $35 billion in spoiled goods annually in the United States. The most common causes are inadequate pre-cooling, improper loading patterns that block airflow, and delayed pickups where product sits on a warm dock. This guide covers everything you need to know to ship refrigerated and frozen goods safely, from choosing the right <Link to="/services/reefer">reefer carrier</Link> to FSMA compliance.
      </p>

      <h2>Temperature Requirements by Product Type</h2>

      <p>
        Getting the temperature right is the single most important factor in cold chain shipping. Here are the standard ranges:
      </p>

      <table>
        <thead>
          <tr>
            <th>Product Category</th>
            <th>Temperature Range</th>
            <th>Critical Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Frozen foods</strong></td>
            <td>-20°F to 0°F</td>
            <td>Must stay frozen; any thaw/refreeze damages quality</td>
          </tr>
          <tr>
            <td><strong>Ice cream</strong></td>
            <td>-20°F to -10°F</td>
            <td>Requires colder than standard frozen</td>
          </tr>
          <tr>
            <td><strong>Fresh meat & poultry</strong></td>
            <td>28-32°F</td>
            <td>Must not freeze; USDA regulated</td>
          </tr>
          <tr>
            <td><strong>Dairy products</strong></td>
            <td>33-40°F</td>
            <td>Milk, cheese, yogurt; FDA regulated</td>
          </tr>
          <tr>
            <td><strong>Fresh produce</strong></td>
            <td>32-55°F</td>
            <td>Varies widely: lettuce 32°F, bananas 56°F, tomatoes 50°F</td>
          </tr>
          <tr>
            <td><strong>Flowers & plants</strong></td>
            <td>33-40°F</td>
            <td>Ethylene-sensitive; keep away from produce</td>
          </tr>
          <tr>
            <td><strong>Pharmaceuticals</strong></td>
            <td>35-46°F (typical)</td>
            <td>Product-specific; GDP compliance required</td>
          </tr>
          <tr>
            <td><strong>Biologics & vaccines</strong></td>
            <td>35-46°F</td>
            <td>Strict tolerances; continuous monitoring mandatory</td>
          </tr>
          <tr>
            <td><strong>Chemicals</strong></td>
            <td>Varies</td>
            <td>Some require heated transport in winter</td>
          </tr>
        </tbody>
      </table>

      <h2>Pre-Cooling: The First Step</h2>

      <p>
        Pre-cooling the trailer before loading is non-negotiable for cold chain integrity. A reefer trailer sitting in the sun can reach 130°F+ inside. Loading cold product into a hot trailer causes:
      </p>

      <ul>
        <li><strong>Temperature excursions:</strong> Product core temperature rises, potentially entering the "danger zone" (40-140°F)</li>
        <li><strong>Condensation:</strong> Warm air meeting cold product creates moisture, leading to mold, soggy packaging, and label damage</li>
        <li><strong>Extended pull-down time:</strong> The reefer unit must work harder and longer to bring the trailer back to set point</li>
      </ul>

      <h3>Pre-Cooling Best Practices</h3>
      <ol>
        <li>Start pre-cooling 60-90 minutes before loading for a 53-foot trailer</li>
        <li>Set the reefer to the desired transport temperature</li>
        <li>Verify the trailer reaches within 5°F of set point before loading begins</li>
        <li>Use a calibrated thermometer to verify -- don't rely solely on the reefer unit display</li>
        <li>For frozen loads, the trailer must reach the exact set temperature (0°F or below)</li>
      </ol>

      <h2>Loading for Proper Airflow</h2>

      <p>
        Even with the correct temperature setting, improper loading can create hot spots that spoil product. Reefer trailers circulate air from the front (near the unit) along the ceiling, down the rear doors, and back along the floor.
      </p>

      <h3>Airflow Loading Rules</h3>
      <ul>
        <li><strong>Leave a gap at the rear doors:</strong> 4-6 inches between the last pallet and the doors allows air to circulate down and return to the unit</li>
        <li><strong>Don't block the floor channels:</strong> Many reefer trailers have channeled floors. Place pallets perpendicular to the channels to allow air flow underneath</li>
        <li><strong>Don't stack above the red line:</strong> Most reefer trailers have a red "load line" painted on the interior walls. Stacking above this line blocks top-air circulation</li>
        <li><strong>Avoid center-loading:</strong> Distribute pallets across the full width of the trailer. A column of pallets in the center creates dead air zones on the sides</li>
        <li><strong>Use air bags or load bars:</strong> Prevent pallets from shifting and closing air gaps during transit</li>
      </ul>

      <h2>Temperature Monitoring During Transit</h2>

      <p>
        Continuous temperature monitoring protects your cargo and provides documentation for compliance and claims:
      </p>

      <ul>
        <li><strong>Reefer unit data logger:</strong> Most modern reefer units (Carrier, Thermo King) have built-in data loggers that record temperature every 15-30 minutes. Request a printout or download at delivery.</li>
        <li><strong>Independent data loggers:</strong> Place battery-powered temperature loggers inside the load (near the front, middle, and rear) for independent verification. These cost $15-$50 each.</li>
        <li><strong>Real-time telematics:</strong> Premium reefer carriers offer GPS-connected temperature monitoring with alerts. You can view temperatures in real-time and receive notifications if the temperature deviates from the set range.</li>
        <li><strong>Pulp temperature checks:</strong> At pickup and delivery, insert a probe thermometer into the product itself (not just the air) to verify the actual product temperature. This is the most accurate reading.</li>
      </ul>

      <h2>FSMA Compliance for Shippers</h2>

      <p>
        The FDA's Food Safety Modernization Act (FSMA) Sanitary Transportation Rule applies to shippers, carriers, and receivers of food products. As a shipper, your responsibilities include:
      </p>

      <ul>
        <li><strong>Specify temperature requirements</strong> in writing on the bill of lading or in a separate agreement</li>
        <li><strong>Verify pre-cooling</strong> before loading begins</li>
        <li><strong>Ensure clean trailers:</strong> The trailer must be clean, sanitary, and free of odors from previous loads. Inspect the trailer before loading.</li>
        <li><strong>Document everything:</strong> Maintain temperature records for all shipments. FSMA doesn't specify a retention period, but 2 years is standard practice.</li>
        <li><strong>Use qualified carriers:</strong> Work with carriers who can demonstrate FSMA compliance, proper maintenance records, and trained drivers</li>
      </ul>

      <h2>Choosing the Right Reefer Carrier</h2>

      <p>
        Not all refrigerated carriers provide the same level of service. When selecting a <Link to="/services/reefer">reefer carrier</Link>, evaluate:
      </p>

      <ul>
        <li><strong>Equipment age and maintenance:</strong> Newer reefer units are more reliable and fuel-efficient. Ask about average fleet age.</li>
        <li><strong>Temperature monitoring:</strong> Does the carrier provide real-time telematics, or just unit printouts at delivery?</li>
        <li><strong>Breakdown response:</strong> What is their average response time for reefer breakdowns? Do they have 24/7 dispatch?</li>
        <li><strong>Multi-temperature capability:</strong> If you need different temperature zones in one load, the carrier needs multi-temp trailers with internal dividers.</li>
        <li><strong>Food safety certifications:</strong> Look for carriers with FSMA compliance programs, HACCP training, and clean inspection records.</li>
        <li><strong>Insurance coverage:</strong> Reefer cargo claims can be expensive. Verify the carrier has adequate cargo insurance ($100,000+ per load minimum).</li>
      </ul>

      <h2>Common Cold Chain Failures and Prevention</h2>

      <table>
        <thead>
          <tr>
            <th>Failure</th>
            <th>Cause</th>
            <th>Prevention</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Temperature spike on loading</td>
            <td>Trailer not pre-cooled</td>
            <td>Verify pre-cool temp before loading</td>
          </tr>
          <tr>
            <td>Hot spots in load</td>
            <td>Blocked airflow from improper stacking</td>
            <td>Follow airflow loading rules, stay below red line</td>
          </tr>
          <tr>
            <td>Reefer unit failure</td>
            <td>Mechanical breakdown, fuel exhaustion</td>
            <td>Use carriers with maintained fleets; verify fuel level at pickup</td>
          </tr>
          <tr>
            <td>Extended dock time</td>
            <td>Doors open too long during loading/unloading</td>
            <td>Stage freight near dock; limit door-open time to under 30 minutes</td>
          </tr>
          <tr>
            <td>Wrong temperature setting</td>
            <td>Driver error, miscommunication</td>
            <td>Write set point on BOL; verify driver sets reefer correctly</td>
          </tr>
          <tr>
            <td>Cross-contamination</td>
            <td>Mixed loads, dirty trailer</td>
            <td>Inspect trailers; don't mix produce and meat without separation</td>
          </tr>
        </tbody>
      </table>

      <p>
        Need to ship refrigerated or frozen freight? <Link to="/quote">Request a free quote</Link> from DeMar Transportation. Our reefer fleet includes late-model trailers with continuous temperature monitoring and 24/7 dispatch support.
      </p>
    </>
  );

  return (
    <ResourceArticle
      title="How to Ship Refrigerated Goods: Cold Chain Shipping Guide"
      subtitle="Shipping Guide"
      description="Complete guide to shipping refrigerated and frozen goods. Temperature requirements, pre-cooling, FSMA compliance, and how to prevent cold chain failures."
      metaTitle="How to Ship Refrigerated Goods: Cold Chain Shipping Guide | DeMar Transportation"
      metaDescription="Learn how to ship refrigerated goods safely. Temperature ranges by product type, pre-cooling procedures, airflow loading, FSMA compliance, and cold chain failure prevention."
      slug="how-to-ship-refrigerated-goods"
      publishDate="2026-03-29"
      content={content}
      faqs={faqs}
      relatedLinks={[
        { label: "Refrigerated (Reefer) Shipping Services", to: "/services/reefer" },
        { label: "Dry Van vs Reefer: Which Do You Need?", to: "/resources/dry-van-vs-reefer" },
        { label: "Types of Freight Trailers", to: "/resources/types-of-freight-trailers" },
      ]}
    />
  );
};

export default HowToShipRefrigeratedGoods;
