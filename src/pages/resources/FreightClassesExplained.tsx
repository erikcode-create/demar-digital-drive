import ResourceArticle from "@/components/ResourceArticle";
import type { FAQItem } from "@/components/ResourceArticle";
import { Link } from "react-router-dom";

const FreightClassesExplained = () => {
  const faqs: FAQItem[] = [
    {
      question: "What is a freight class and why does it matter?",
      answer:
        "A freight class is a standardized classification system (NMFC classes 50-500) used by LTL carriers to price shipments. The class is determined by four factors: density, stowability, handling difficulty, and liability. A lower class number means lower shipping costs. Class directly determines your LTL rate, so accurate classification can save you hundreds of dollars per shipment.",
    },
    {
      question: "How do I determine my freight class?",
      answer:
        "To determine your freight class, you need to know your commodity type, shipment density (weight divided by cubic dimensions), and NMFC code. Start by looking up your product in the NMFC directory maintained by the National Motor Freight Traffic Association (NMFTA). If density is the primary factor, calculate it by dividing total weight (lbs) by total cubic feet. Most commodities fall between class 70 and class 150.",
    },
    {
      question: "What happens if my freight is misclassified?",
      answer:
        "If your freight is misclassified, the LTL carrier will issue a reweigh or reclass inspection at the terminal. You will be charged the correct class rate plus a reclassification fee of $50-$150. In some cases, carriers apply the higher rate retroactively and issue an additional invoice. Repeated misclassification can result in audits and loss of discount pricing. Always classify accurately to avoid unexpected charges.",
    },
    {
      question: "Is freight class the same as freight density?",
      answer:
        "No. Density is one of the four factors used to determine freight class, but it is not the only one. Two items with the same density can have different classes if one is harder to handle, more liable to damage, or difficult to stow with other freight. However, density is the most influential factor for most commodities, and many shippers use density-based class calculators as a starting point.",
    },
    {
      question: "Can I negotiate my freight class?",
      answer:
        "You cannot change the NMFC classification itself -- that is set by the NMFTA. However, you can negotiate density-based pricing (also called FAK, or Freight All Kinds) with your LTL carrier. With FAK pricing, the carrier agrees to rate all your freight at a single class regardless of actual commodity class. This is common for shippers with consistent freight profiles and sufficient volume.",
    },
  ];

  const relatedLinks = [
    { label: "FTL vs LTL: How to Choose", to: "/resources/ftl-vs-ltl" },
    { label: "Freight Shipping Cost Guide", to: "/resources/freight-shipping-cost" },
    { label: "How to Get a Freight Quote", to: "/resources/how-to-get-freight-quote" },
    { label: "Request a Free Quote", to: "/quote" },
  ];

  const content = (
    <>
      <p>
        Freight classes are a standardized classification system that LTL (less-than-truckload)
        carriers use to price shipments based on transportability. The National Motor Freight
        Classification (NMFC) system assigns every commodity a class from{" "}
        <strong>50 to 500</strong>, with <strong>18 distinct classes</strong> in total.{" "}
        <strong>Lower classes (50-85) cost less to ship</strong> because they represent dense,
        easy-to-handle freight.{" "}
        <strong>Higher classes (300-500) cost significantly more</strong> because they represent
        light, bulky, fragile, or hazardous goods. Four factors determine your freight class:{" "}
        <strong>density</strong> (lbs per cubic foot), <strong>stowability</strong> (how easily it
        fits with other freight), <strong>handling</strong> (special equipment or care needed), and{" "}
        <strong>liability</strong> (value and fragility). Understanding your freight class is
        essential because it directly determines your LTL shipping rate -- a misclassification can
        cost you hundreds of dollars per shipment in reclass fees and rate adjustments. Below, we
        explain all 18 classes, how to determine yours, and how to avoid costly misclassification.
        For an accurate LTL rate,{" "}
        <Link to="/quote">request a free quote from DeMar Transportation</Link>.
      </p>

      <h2>The 4 Factors That Determine Freight Class</h2>
      <p>
        The NMFTA evaluates commodities across four criteria when assigning a freight class:
      </p>
      <ol>
        <li>
          <strong>Density</strong> -- the most influential factor. Measured in pounds per cubic foot
          (PCF). Higher density generally means a lower (cheaper) class. Calculate density by
          dividing total shipment weight by total cubic feet.
        </li>
        <li>
          <strong>Stowability</strong> -- how easily the freight can be arranged alongside other
          cargo. Items that are irregularly shaped, hazardous, or require separation from other goods
          receive a higher class.
        </li>
        <li>
          <strong>Handling</strong> -- the effort and equipment required to load and unload. Freight
          that requires forklifts, cranes, or special care is classified higher than palletized,
          easily stackable goods.
        </li>
        <li>
          <strong>Liability</strong> -- the risk of damage, theft, or spoilage during transit.
          High-value, perishable, or hazardous items carry higher liability and higher classification.
        </li>
      </ol>

      <h2>All 18 NMFC Freight Classes (50-500)</h2>
      <p>
        The following table lists all 18 freight classes with their corresponding density ranges and
        common commodity examples:
      </p>
      <table>
        <thead>
          <tr>
            <th>Class</th>
            <th>Density (PCF)</th>
            <th>Cost Level</th>
            <th>Example Commodities</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>50</td>
            <td>50+</td>
            <td>Lowest</td>
            <td>Sand, gravel, bricks, cement</td>
          </tr>
          <tr>
            <td>55</td>
            <td>35-50</td>
            <td>Very Low</td>
            <td>Steel rods, hardwood flooring, construction materials</td>
          </tr>
          <tr>
            <td>60</td>
            <td>30-35</td>
            <td>Low</td>
            <td>Car parts, steel cables, bottled beverages</td>
          </tr>
          <tr>
            <td>65</td>
            <td>22.5-30</td>
            <td>Low</td>
            <td>Auto parts, canned goods, bottled drinks</td>
          </tr>
          <tr>
            <td>70</td>
            <td>15-22.5</td>
            <td>Low-Moderate</td>
            <td>Food items, car engines, metal castings</td>
          </tr>
          <tr>
            <td>77.5</td>
            <td>13.5-15</td>
            <td>Moderate</td>
            <td>Tires, bathroom fixtures, paper goods</td>
          </tr>
          <tr>
            <td>85</td>
            <td>12-13.5</td>
            <td>Moderate</td>
            <td>Crated machinery, engines, transmissions</td>
          </tr>
          <tr>
            <td>92.5</td>
            <td>10.5-12</td>
            <td>Moderate</td>
            <td>Computers, monitors, refrigerators</td>
          </tr>
          <tr>
            <td>100</td>
            <td>9-10.5</td>
            <td>Moderate-High</td>
            <td>Boat covers, wine cases, furniture pads</td>
          </tr>
          <tr>
            <td>110</td>
            <td>8-9</td>
            <td>Moderate-High</td>
            <td>Cabinets, framed artwork, table saws</td>
          </tr>
          <tr>
            <td>125</td>
            <td>7-8</td>
            <td>High</td>
            <td>Small household appliances, vending machines</td>
          </tr>
          <tr>
            <td>150</td>
            <td>6-7</td>
            <td>High</td>
            <td>Auto sheet metal, bookcases, assembled furniture</td>
          </tr>
          <tr>
            <td>175</td>
            <td>5-6</td>
            <td>High</td>
            <td>Clothing, couches, stuffed furniture</td>
          </tr>
          <tr>
            <td>200</td>
            <td>4-5</td>
            <td>Very High</td>
            <td>Auto sheet metal parts, TVs, mattresses</td>
          </tr>
          <tr>
            <td>250</td>
            <td>3-4</td>
            <td>Very High</td>
            <td>Bamboo furniture, mattress sets, plasma TVs</td>
          </tr>
          <tr>
            <td>300</td>
            <td>2-3</td>
            <td>Very High</td>
            <td>Model boats, wood cabinets, kayaks</td>
          </tr>
          <tr>
            <td>400</td>
            <td>1-2</td>
            <td>Highest</td>
            <td>Deer antlers, lightweight fixtures, artwork</td>
          </tr>
          <tr>
            <td>500</td>
            <td>{"<"}1</td>
            <td>Highest</td>
            <td>Gold dust, ping pong balls, bags of feathers</td>
          </tr>
        </tbody>
      </table>

      <h2>How Freight Class Affects LTL Pricing</h2>
      <p>
        LTL carriers use freight class as a primary pricing input alongside distance, weight, and
        accessorial charges. Here is how class impacts cost:
      </p>
      <ul>
        <li>
          <strong>Rate per hundredweight (CWT):</strong> Each freight class has a corresponding rate
          per 100 lbs. Class 50 might cost $15/CWT, while class 500 could cost $80+/CWT on the
          same lane.
        </li>
        <li>
          <strong>Doubling effect:</strong> Moving up just 2-3 class levels can increase your
          shipping cost by 30-50%. Accurate classification matters.
        </li>
        <li>
          <strong>Minimum charges:</strong> LTL carriers apply minimum charges per shipment
          regardless of weight, typically $75-$200. Low-weight, high-class shipments may hit this
          floor.
        </li>
        <li>
          <strong>Discount structures:</strong> Negotiated LTL discounts (often 50-80% off tariff
          rates) are applied after class is determined. Higher classes get smaller effective
          discounts.
        </li>
      </ul>

      <h2>How to Determine Your Freight Class</h2>
      <p>Follow these steps to classify your shipment correctly:</p>
      <ol>
        <li>
          <strong>Look up the NMFC code:</strong> Search for your commodity in the NMFC directory
          (available via NMFTA subscription or through your carrier/broker). Each product has an
          assigned NMFC number and corresponding class.
        </li>
        <li>
          <strong>Calculate density:</strong> If the NMFC code uses density-based sub-classes,
          calculate your shipment density. Measure length, width, and height in inches. Multiply to
          get cubic inches, divide by 1,728 for cubic feet, then divide weight by cubic feet.
        </li>
        <li>
          <strong>Consider packaging:</strong> Freight class is based on the shipping unit as
          packaged, not the raw product. Crating, palletizing, or shrink-wrapping can change
          effective density and class.
        </li>
        <li>
          <strong>Verify with your carrier:</strong> When in doubt, ask your carrier or broker to
          confirm the class before shipping. This prevents costly reclassification at the terminal.
        </li>
      </ol>

      <h3>Density Calculation Example</h3>
      <p>
        You are shipping a pallet that is 48" x 40" x 48" and weighs 800 lbs:
      </p>
      <ul>
        <li>Volume: 48 x 40 x 48 = 92,160 cubic inches</li>
        <li>Cubic feet: 92,160 / 1,728 = 53.3 cubic feet</li>
        <li>Density: 800 / 53.3 = <strong>15.0 PCF</strong></li>
        <li>Class: <strong>70</strong> (falls in the 15-22.5 PCF range)</li>
      </ul>

      <h2>Common Misclassification Issues</h2>
      <p>
        Misclassification is one of the most expensive mistakes in LTL shipping. Here are the most
        common issues:
      </p>
      <ul>
        <li>
          <strong>Using the wrong NMFC code:</strong> Similar products can have different codes. For
          example, "machinery" has dozens of sub-codes with different class assignments depending on
          type and packaging.
        </li>
        <li>
          <strong>Inaccurate dimensions:</strong> Estimating pallet dimensions instead of measuring
          can shift your density calculation by 1-2 classes.
        </li>
        <li>
          <strong>Ignoring packaging:</strong> Loose items on a pallet take up more cubic space than
          boxed/crated items, resulting in a lower density and higher class.
        </li>
        <li>
          <strong>Failing to update after product changes:</strong> If your product or packaging
          changes, the freight class may also change. Review annually.
        </li>
      </ul>

      <h3>Reweigh and Reclass Fees</h3>
      <p>
        When an LTL carrier inspects your freight and finds the actual class differs from what was
        declared, they will:
      </p>
      <ol>
        <li>Re-rate the shipment at the correct class</li>
        <li>
          Charge a <strong>reclassification fee of $50-$150</strong>
        </li>
        <li>
          Bill the difference back to you (or your broker), which can be{" "}
          <strong>30-100% more</strong> than the original quote
        </li>
      </ol>
      <p>
        Consistent misclassification can trigger carrier audits, reduced discounts, or even account
        suspension. Investing time in accurate classification saves money in the long run. Need
        help classifying your freight?{" "}
        <Link to="/quote">Contact DeMar Transportation</Link> for expert guidance and accurate
        LTL quoting.
      </p>
    </>
  );

  return (
    <ResourceArticle
      title="Freight Classes Explained: NMFC Classes 50-500"
      subtitle="Shipping Guide"
      description="Understand the 18 NMFC freight classes, how they affect LTL pricing, and how to correctly classify your shipment to avoid reclass fees."
      metaTitle="Freight Classes Explained: NMFC Classes 50-500 Guide | DeMar Transportation"
      metaDescription="Complete guide to NMFC freight classes 50-500. Learn how density, stowability, handling, and liability determine your LTL shipping class and cost."
      slug="freight-classes-explained"
      publishDate="2026-03-29"
      content={content}
      faqs={faqs}
      relatedLinks={relatedLinks}
    />
  );
};

export default FreightClassesExplained;
