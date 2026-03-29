import ResourceArticle from "@/components/ResourceArticle";
import { Link } from "react-router-dom";

const DryVanVsReefer = () => {
  const faqs = [
    {
      question: "Can I ship non-perishable goods in a reefer trailer?",
      answer:
        "Yes, you can ship non-perishable goods in a reefer trailer, and some shippers do this to protect temperature-sensitive items like electronics, candles, or cosmetics from extreme heat or cold. However, reefer trailers cost 20-40% more than dry vans, so this only makes financial sense when temperature protection is genuinely needed.",
    },
    {
      question: "What temperature range can a reefer trailer maintain?",
      answer:
        "Modern reefer trailers can maintain temperatures from -20°F to 70°F (-29°C to 21°C). Some multi-temperature reefers have separate zones that maintain different temperatures simultaneously, which is useful for mixed loads of frozen and refrigerated goods.",
    },
    {
      question: "How much more does a reefer cost compared to a dry van?",
      answer:
        "Reefer shipping typically costs 20-40% more than dry van on the same lane. For a 1,000-mile shipment, a dry van might cost $2,000-$3,000 while a reefer would run $2,500-$4,500. The premium covers fuel for the refrigeration unit, specialized equipment costs, and higher insurance requirements.",
    },
    {
      question: "What is a dry van trailer used for?",
      answer:
        "A dry van trailer is an enclosed, non-temperature-controlled trailer used for general merchandise. Common cargo includes packaged consumer goods, electronics, clothing, furniture, building materials, paper products, and any freight that does not require climate control. Dry vans are the most common trailer type, representing about 70% of all truckload shipments.",
    },
    {
      question: "Do reefer trailers have less cargo space than dry vans?",
      answer:
        "Yes, slightly. Reefer trailers have insulated walls that reduce interior dimensions by about 3-5 inches on each side. A standard 53-foot reefer has approximately 2,900-3,000 cubic feet of cargo space compared to 3,000-3,400 cubic feet in a dry van. Reefers also typically have lower weight capacity (42,000-43,000 lbs vs 44,000-45,000 lbs) due to the refrigeration unit weight.",
    },
  ];

  const relatedLinks = [
    { label: "Dry Van Shipping Services", to: "/services/dry-van" },
    { label: "Reefer Shipping Services", to: "/services/reefer" },
    {
      label: "Types of Freight Trailers",
      to: "/resources/types-of-freight-trailers",
    },
    {
      label: "How to Ship Refrigerated Goods",
      to: "/resources/how-to-ship-refrigerated-goods",
    },
  ];

  const content = (
    <>
      <p>
        The core difference between a dry van and a reefer (refrigerated) trailer is{" "}
        <strong>temperature control</strong>. A dry van is a standard enclosed trailer with no
        climate control, used for general merchandise that does not require specific temperature
        conditions. A reefer trailer has a built-in refrigeration unit that maintains temperatures
        from <strong>-20°F to 70°F</strong>, making it essential for perishable food, pharmaceuticals,
        and other temperature-sensitive cargo. Dry vans account for roughly{" "}
        <strong>70% of all truckload shipments</strong> and are the most cost-effective option for
        non-perishable goods. Reefer trailers cost <strong>20-40% more</strong> than dry vans on
        the same lane due to fuel for the refrigeration unit, insulation costs, and specialized
        maintenance. For a 1,000-mile shipment, expect to pay $2,000-$3,000 for a{" "}
        <Link to="/services/dry-van">dry van</Link> versus $2,500-$4,500 for a{" "}
        <Link to="/services/reefer">reefer</Link>. Below, we compare both trailer types in
        detail so you can choose the right one for your freight.
      </p>

      <h2>Dry Van vs Reefer: Side-by-Side Comparison</h2>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Dry Van</th>
            <th>Reefer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Temperature Control</td>
            <td>None</td>
            <td>-20°F to 70°F</td>
          </tr>
          <tr>
            <td>Standard Length</td>
            <td>53 feet</td>
            <td>53 feet</td>
          </tr>
          <tr>
            <td>Interior Width</td>
            <td>100.5 inches</td>
            <td>97-98 inches</td>
          </tr>
          <tr>
            <td>Interior Height</td>
            <td>110 inches</td>
            <td>106-108 inches</td>
          </tr>
          <tr>
            <td>Cargo Space</td>
            <td>3,000 - 3,400 cu ft</td>
            <td>2,900 - 3,000 cu ft</td>
          </tr>
          <tr>
            <td>Max Payload</td>
            <td>44,000 - 45,000 lbs</td>
            <td>42,000 - 43,000 lbs</td>
          </tr>
          <tr>
            <td>Cost per Mile</td>
            <td>$1.50 - $3.50</td>
            <td>$2.00 - $4.50</td>
          </tr>
          <tr>
            <td>Cost Premium</td>
            <td>Baseline</td>
            <td>+20-40%</td>
          </tr>
          <tr>
            <td>Market Share</td>
            <td>~70% of truckload</td>
            <td>~15% of truckload</td>
          </tr>
          <tr>
            <td>Key Cargo Types</td>
            <td>General merchandise, retail</td>
            <td>Food, pharma, chemicals</td>
          </tr>
        </tbody>
      </table>

      <h2>When to Use a Dry Van</h2>
      <p>
        A <Link to="/services/dry-van">dry van trailer</Link> is the right choice when your
        cargo does not need temperature control. Dry vans are the workhorses of the freight
        industry, offering the best combination of availability, price, and versatility.
      </p>
      <p>
        <strong>Ideal cargo for dry van shipping:</strong>
      </p>
      <ul>
        <li>Packaged consumer goods (electronics, clothing, household items)</li>
        <li>Building materials and construction supplies</li>
        <li>Paper products, printing materials, and packaging</li>
        <li>Non-perishable food (canned goods, dry goods, snacks)</li>
        <li>Furniture and home furnishings</li>
        <li>Auto parts and industrial components</li>
        <li>Retail store inventory and e-commerce fulfillment</li>
      </ul>
      <p>
        <strong>Advantages of dry van:</strong>
      </p>
      <ul>
        <li>Lowest cost per mile of any enclosed trailer type</li>
        <li>Highest availability -- easy to find capacity on any lane</li>
        <li>Maximum cargo space and payload capacity</li>
        <li>No fuel costs for a refrigeration unit</li>
        <li>Less maintenance downtime than reefer units</li>
      </ul>

      <h2>When to Use a Reefer</h2>
      <p>
        A <Link to="/services/reefer">reefer trailer</Link> is required whenever your cargo
        needs to be maintained at a specific temperature during transit. Using a dry van for
        temperature-sensitive goods risks spoilage, regulatory violations, and rejected loads.
      </p>
      <p>
        <strong>Ideal cargo for reefer shipping:</strong>
      </p>
      <ul>
        <li>Fresh produce (fruits, vegetables, herbs)</li>
        <li>Frozen foods (meats, seafood, ice cream, frozen meals)</li>
        <li>Dairy products (milk, cheese, yogurt)</li>
        <li>Pharmaceuticals and biotech products</li>
        <li>Flowers and live plants</li>
        <li>Beverages (beer, wine, juice)</li>
        <li>Cosmetics and chemicals sensitive to temperature extremes</li>
        <li>Chocolate and confections (summer months)</li>
      </ul>
      <p>
        <strong>Advantages of reefer:</strong>
      </p>
      <ul>
        <li>Precise temperature control throughout transit</li>
        <li>Protects cargo value and prevents spoilage claims</li>
        <li>Meets FDA and FSMA compliance requirements for food</li>
        <li>Multi-temperature zones available for mixed loads</li>
        <li>Can also be used as a dry van (unit off) for backhaul flexibility</li>
      </ul>

      <h2>Understanding the Cost Difference</h2>
      <p>
        Reefer trailers cost more than dry vans for several reasons:
      </p>
      <ol>
        <li>
          <strong>Refrigeration fuel:</strong> The reefer unit runs on diesel, consuming 0.5-1.0
          gallons per hour. On a 2-day transit, that is 24-48 gallons of additional fuel ($75-$175
          at current prices).
        </li>
        <li>
          <strong>Equipment cost:</strong> A new reefer trailer costs $70,000-$90,000 compared to
          $35,000-$50,000 for a dry van. Higher capital costs are built into rates.
        </li>
        <li>
          <strong>Maintenance:</strong> Refrigeration units require specialized maintenance,
          pre-trip inspections, and calibration. Breakdowns are costlier and more time-sensitive.
        </li>
        <li>
          <strong>Seasonal demand:</strong> Reefer demand spikes during produce season
          (April-September), pushing rates up 30-50% above off-season levels.
        </li>
        <li>
          <strong>Insurance:</strong> Temperature-sensitive cargo carries higher insurance
          premiums due to spoilage risk.
        </li>
      </ol>

      <h2>How to Decide: Dry Van or Reefer?</h2>
      <p>
        Follow this decision process to determine which trailer you need:
      </p>
      <ol>
        <li>
          <strong>Does your cargo have a required temperature range?</strong> If yes, you need a
          reefer. Check with your buyer, regulatory requirements, and product specifications.
        </li>
        <li>
          <strong>Will transit conditions exceed your product's tolerance?</strong> Even
          non-perishable items like candles, adhesives, or electronics can be damaged by extreme
          heat (100°F+ in summer) or cold (below freezing in winter). If so, consider a reefer.
        </li>
        <li>
          <strong>Are there regulatory requirements?</strong> The FDA's Food Safety Modernization
          Act (FSMA) requires temperature-controlled transport for certain food products. Non-compliance
          risks fines and product seizure.
        </li>
        <li>
          <strong>What is the cost of spoilage vs the reefer premium?</strong> If a $50,000 load
          of produce spoils because you saved $800 by using a dry van, the math does not work.
          Factor in the full cost of risk.
        </li>
        <li>
          <strong>Is this a seasonal consideration?</strong> Some products only need reefer
          protection during summer months. You might use dry van in winter and reefer in summer
          for the same commodity.
        </li>
      </ol>

      <h2>Get the Right Trailer for Your Freight</h2>
      <p>
        Not sure which trailer type you need? DeMar Transportation operates both{" "}
        <Link to="/services/dry-van">dry van</Link> and{" "}
        <Link to="/services/reefer">reefer</Link> trailers across all 48 contiguous states.
        Our freight specialists will recommend the right equipment based on your cargo, route,
        and budget.{" "}
        <Link to="/quote">Request a free quote</Link> and we will get back to you within 1
        business hour with transparent, all-in pricing.
      </p>
    </>
  );

  return (
    <ResourceArticle
      title="Dry Van vs Reefer: Which Trailer Do You Need?"
      subtitle="Equipment Guide"
      description="Compare dry van and reefer trailers side by side. Learn the cost difference, when to use each, and how to choose the right equipment for your freight."
      metaTitle="Dry Van vs Reefer: Which Trailer Do You Need? | DeMar Transportation"
      metaDescription="Dry van vs reefer: reefer trailers cost 20-40% more but provide temperature control from -20°F to 70°F. Compare dimensions, costs, and cargo types."
      slug="dry-van-vs-reefer"
      publishDate="2026-03-29"
      content={content}
      faqs={faqs}
      relatedLinks={relatedLinks}
    />
  );
};

export default DryVanVsReefer;
