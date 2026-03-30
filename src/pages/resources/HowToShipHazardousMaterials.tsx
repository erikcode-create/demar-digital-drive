import ResourceArticle from "@/components/ResourceArticle";
import { Link } from "react-router-dom";

const HowToShipHazardousMaterials = () => {
  const faqs = [
    {
      question: "What are the 9 DOT hazmat classes?",
      answer:
        "The 9 DOT hazmat classes are: Class 1 (Explosives), Class 2 (Gases), Class 3 (Flammable Liquids), Class 4 (Flammable Solids), Class 5 (Oxidizers and Organic Peroxides), Class 6 (Toxic and Infectious Substances), Class 7 (Radioactive Materials), Class 8 (Corrosives), and Class 9 (Miscellaneous Dangerous Goods). Each class has divisions with specific requirements for packaging, labeling, and transport.",
    },
    {
      question: "Do truck drivers need a special license to haul hazmat?",
      answer:
        "Yes, drivers must hold a Commercial Driver's License (CDL) with a Hazardous Materials (H) endorsement. To obtain the H endorsement, drivers must pass a written knowledge test, undergo a TSA security threat assessment (background check and fingerprinting), and renew the endorsement every 5 years. Drivers hauling hazmat tankers also need a Tank (N) endorsement.",
    },
    {
      question: "What documentation is required for hazmat shipping?",
      answer:
        "Required documents include: (1) Shipping papers listing the proper shipping name, hazard class, UN/NA identification number, packing group, and quantity; (2) Emergency response information (ERG guide number or 24-hour emergency phone number); (3) Placards appropriate to the hazard class; (4) Safety Data Sheets (SDS) for each product. The driver must keep shipping papers within arm's reach or in the driver's door pocket at all times.",
    },
    {
      question: "What are the penalties for hazmat shipping violations?",
      answer:
        "Federal penalties for hazmat violations range from $500 to $500,000 per violation for civil penalties. Criminal penalties can reach $500,000 in fines and up to 10 years in prison for knowing violations. Common violations include improper packaging ($10,000-$80,000), missing placards ($10,000-$80,000), and falsifying shipping papers ($50,000-$500,000). Repeat violations carry higher penalties.",
    },
    {
      question: "Can hazmat be shipped with non-hazmat freight?",
      answer:
        "Yes, in many cases hazmat can be shipped on the same truck as non-hazmat freight, but there are strict compatibility rules. Certain classes cannot be loaded together -- for example, Class 1 (Explosives) cannot be loaded with Class 3 (Flammable Liquids) or Class 5 (Oxidizers). The DOT Segregation Table in 49 CFR 177.848 specifies which classes can and cannot be loaded together. Your carrier must follow these rules.",
    },
  ];

  const content = (
    <>
      <p>
        <strong>Shipping hazardous materials (hazmat) requires compliance with DOT regulations under 49 CFR Parts 100-185, which cover classification, packaging, labeling, placarding, and documentation for all 9 hazard classes.</strong> Every hazmat shipment must include proper shipping papers with the UN/NA identification number, proper shipping name, hazard class, packing group, and quantity. Drivers must hold a CDL with a Hazardous Materials (H) endorsement and TSA security clearance.
      </p>
      <p>
        Carriers must maintain minimum $1 million cargo liability insurance (higher for certain classes) and a Satisfactory FMCSA safety rating. Violations carry civil penalties up to $500,000 and criminal penalties including imprisonment. This guide covers the complete hazmat shipping process, from classifying your material to selecting a qualified <Link to="/services/hazmat">hazmat carrier</Link>.
      </p>

      <h2>DOT Hazmat Classes: All 9 Categories</h2>

      <p>
        The Department of Transportation classifies hazardous materials into 9 classes based on their primary hazard. Some classes have divisions for more specific categorization:
      </p>

      <table>
        <thead>
          <tr>
            <th>Class</th>
            <th>Category</th>
            <th>Examples</th>
            <th>Placard Color</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1</strong></td>
            <td>Explosives</td>
            <td>Fireworks, ammunition, dynamite, detonators</td>
            <td>Orange</td>
          </tr>
          <tr>
            <td><strong>2.1</strong></td>
            <td>Flammable Gas</td>
            <td>Propane, butane, acetylene</td>
            <td>Red</td>
          </tr>
          <tr>
            <td><strong>2.2</strong></td>
            <td>Non-Flammable Gas</td>
            <td>Nitrogen, helium, carbon dioxide</td>
            <td>Green</td>
          </tr>
          <tr>
            <td><strong>2.3</strong></td>
            <td>Poison Gas</td>
            <td>Chlorine, ammonia, phosgene</td>
            <td>White</td>
          </tr>
          <tr>
            <td><strong>3</strong></td>
            <td>Flammable Liquids</td>
            <td>Gasoline, diesel, acetone, paint</td>
            <td>Red</td>
          </tr>
          <tr>
            <td><strong>4.1</strong></td>
            <td>Flammable Solids</td>
            <td>Matches, sulfur, magnesium</td>
            <td>Red/White striped</td>
          </tr>
          <tr>
            <td><strong>4.2</strong></td>
            <td>Spontaneously Combustible</td>
            <td>White phosphorus, aluminum alkyls</td>
            <td>Red/White</td>
          </tr>
          <tr>
            <td><strong>4.3</strong></td>
            <td>Dangerous When Wet</td>
            <td>Sodium, potassium, calcium carbide</td>
            <td>Blue</td>
          </tr>
          <tr>
            <td><strong>5.1</strong></td>
            <td>Oxidizers</td>
            <td>Ammonium nitrate, hydrogen peroxide</td>
            <td>Yellow</td>
          </tr>
          <tr>
            <td><strong>5.2</strong></td>
            <td>Organic Peroxides</td>
            <td>Benzoyl peroxide, peracetic acid</td>
            <td>Yellow/Red</td>
          </tr>
          <tr>
            <td><strong>6.1</strong></td>
            <td>Toxic Substances</td>
            <td>Pesticides, cyanides, arsenic compounds</td>
            <td>White</td>
          </tr>
          <tr>
            <td><strong>6.2</strong></td>
            <td>Infectious Substances</td>
            <td>Medical waste, biological samples</td>
            <td>White</td>
          </tr>
          <tr>
            <td><strong>7</strong></td>
            <td>Radioactive Materials</td>
            <td>Medical isotopes, uranium, thorium</td>
            <td>Yellow/White</td>
          </tr>
          <tr>
            <td><strong>8</strong></td>
            <td>Corrosives</td>
            <td>Sulfuric acid, sodium hydroxide, batteries</td>
            <td>Black/White</td>
          </tr>
          <tr>
            <td><strong>9</strong></td>
            <td>Miscellaneous</td>
            <td>Lithium batteries, dry ice, magnetized materials</td>
            <td>White/Black striped</td>
          </tr>
        </tbody>
      </table>

      <h2>Required Documentation</h2>

      <p>
        Every hazmat shipment requires specific documentation. Missing or incorrect paperwork is one of the most common (and most heavily penalized) violations:
      </p>

      <h3>Shipping Papers (Bill of Lading)</h3>
      <p>
        Hazmat shipping papers must include these elements in this order:
      </p>
      <ol>
        <li><strong>Proper shipping name</strong> (from 49 CFR 172.101 Hazardous Materials Table)</li>
        <li><strong>Hazard class or division number</strong> (e.g., "3" for flammable liquids)</li>
        <li><strong>UN or NA identification number</strong> (e.g., "UN1203" for gasoline)</li>
        <li><strong>Packing group</strong> (I = great danger, II = medium danger, III = minor danger)</li>
        <li><strong>Total quantity</strong> by weight or volume</li>
        <li><strong>Emergency contact phone number</strong> monitored 24/7</li>
      </ol>

      <p>
        <strong>Example entry:</strong> "Gasoline, 3, UN1203, PG II, 5,000 gallons"
      </p>

      <h3>Placards and Markings</h3>
      <ul>
        <li>Placards are required on all four sides of the vehicle when carrying 1,001+ lbs of a single hazmat class</li>
        <li>For mixed loads under 1,001 lbs per class, a "DANGEROUS" placard may be used</li>
        <li>Class 1 (Explosives), Class 2.3 (Poison Gas), Class 4.3 (Dangerous When Wet), and Class 7 (Radioactive) require placards at any quantity</li>
        <li>Individual packages must display the correct hazard labels, UN number, and proper shipping name</li>
      </ul>

      <h3>Emergency Response Information</h3>
      <ul>
        <li>The <strong>Emergency Response Guidebook (ERG)</strong> must be in the cab</li>
        <li>A <strong>24-hour emergency phone number</strong> must be on the shipping papers (CHEMTREC: 1-800-424-9300 is commonly used)</li>
        <li><strong>Safety Data Sheets (SDS)</strong> for each product should accompany the shipment</li>
      </ul>

      <h2>Driver Certification Requirements</h2>

      <p>
        Not just any CDL holder can transport hazmat. Drivers must meet additional qualifications:
      </p>

      <ul>
        <li><strong>CDL with H endorsement:</strong> Requires passing a written hazmat knowledge test covering identification, handling, emergency procedures, and loading/unloading</li>
        <li><strong>TSA security threat assessment:</strong> Background check including fingerprinting, criminal history review, and immigration status verification. Takes 30-60 days to complete.</li>
        <li><strong>Hazmat training:</strong> Initial training within 90 days of hire and refresher training every 3 years, covering:
          <ul>
            <li>General awareness and familiarization</li>
            <li>Function-specific training</li>
            <li>Safety training</li>
            <li>Security awareness training</li>
          </ul>
        </li>
        <li><strong>Medical certification:</strong> Valid DOT medical certificate (renewed every 2 years)</li>
        <li><strong>Tank endorsement (N):</strong> Required if hauling hazmat in a cargo tank</li>
      </ul>

      <h2>Packaging Requirements</h2>

      <p>
        Hazmat packaging must meet UN performance standards and is designated by packing group:
      </p>

      <ul>
        <li><strong>Packing Group I (PG I):</strong> Great danger. Requires the highest level of packaging performance. Heavy-duty drums, UN-rated containers with maximum leak and drop resistance.</li>
        <li><strong>Packing Group II (PG II):</strong> Medium danger. Standard UN-rated packaging. Most common for industrial chemicals.</li>
        <li><strong>Packing Group III (PG III):</strong> Minor danger. Lighter-duty UN-rated packaging acceptable. Common for diluted solutions and lower-hazard materials.</li>
      </ul>

      <h3>Key Packaging Rules</h3>
      <ul>
        <li>All packaging must be UN-certified and marked with the UN symbol</li>
        <li>Inner containers must be cushioned and separated within outer packaging</li>
        <li>Closures must be secured against loosening during transport (e.g., secondary caps, tape)</li>
        <li>Incompatible materials must not be packed in the same outer container</li>
        <li>Packages must pass drop, stacking, pressure, and leakproofness tests for their packing group</li>
      </ul>

      <h2>Carrier Requirements</h2>

      <p>
        When choosing a carrier for hazmat freight, verify these qualifications:
      </p>

      <ul>
        <li><strong>FMCSA operating authority:</strong> Active MC number with hazmat authorization</li>
        <li><strong>Safety rating:</strong> Satisfactory or Conditional rating from FMCSA (Unsatisfactory-rated carriers are prohibited from hauling hazmat)</li>
        <li><strong>Insurance minimums:</strong>
          <ul>
            <li>$1 million for most hazmat (non-bulk)</li>
            <li>$5 million for hazmat transported in cargo tanks, hopper vehicles, or bulk quantities</li>
            <li>Higher for radioactive materials and certain explosives</li>
          </ul>
        </li>
        <li><strong>Hazmat registration:</strong> Annual registration with PHMSA (Pipeline and Hazardous Materials Safety Administration)</li>
        <li><strong>Trained personnel:</strong> All employees who handle hazmat must have current training records on file</li>
        <li><strong>Written security plan:</strong> Required for carriers transporting certain high-hazard materials</li>
      </ul>

      <h2>Common Violations and Penalties</h2>

      <table>
        <thead>
          <tr>
            <th>Violation</th>
            <th>Typical Civil Penalty</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Shipping papers missing or incorrect</td>
            <td>$10,000-$80,000</td>
          </tr>
          <tr>
            <td>Missing or wrong placards</td>
            <td>$10,000-$80,000</td>
          </tr>
          <tr>
            <td>Packaging not UN-certified</td>
            <td>$10,000-$80,000</td>
          </tr>
          <tr>
            <td>Untrained employee handling hazmat</td>
            <td>$10,000-$80,000</td>
          </tr>
          <tr>
            <td>Falsified shipping papers</td>
            <td>$50,000-$500,000</td>
          </tr>
          <tr>
            <td>Knowing violation resulting in injury/death</td>
            <td>Up to $500,000 + criminal prosecution</td>
          </tr>
        </tbody>
      </table>

      <h2>How to Ship Hazmat: Step-by-Step</h2>

      <ol>
        <li><strong>Classify your material:</strong> Identify the hazard class, proper shipping name, UN number, and packing group using 49 CFR 172.101</li>
        <li><strong>Select proper packaging:</strong> Use UN-certified packaging rated for your material's packing group</li>
        <li><strong>Label and mark packages:</strong> Apply correct hazard labels, UN number, and proper shipping name to each package</li>
        <li><strong>Prepare shipping papers:</strong> Complete the bill of lading with all required hazmat information</li>
        <li><strong>Choose a qualified carrier:</strong> Verify FMCSA authority, safety rating, insurance, and hazmat registration</li>
        <li><strong>Provide emergency info:</strong> Include 24-hour emergency contact and ERG reference on shipping papers</li>
        <li><strong>Load properly:</strong> Follow segregation rules, secure against movement, and apply vehicle placards</li>
      </ol>

      <p>
        Need to ship hazardous materials? <Link to="/quote">Request a free quote</Link> from DeMar Transportation. We connect shippers with vetted, fully compliant hazmat carriers and handle all documentation requirements.
      </p>
    </>
  );

  return (
    <ResourceArticle
      title="How to Ship Hazardous Materials: Hazmat Shipping Guide"
      subtitle="Compliance Guide"
      description="Complete guide to shipping hazardous materials. DOT hazmat classes, required documentation, driver certifications, packaging requirements, and penalty avoidance."
      metaTitle="How to Ship Hazardous Materials: Hazmat Shipping Guide | DeMar Transportation"
      metaDescription="Learn how to ship hazardous materials legally and safely. All 9 DOT hazmat classes, required documents, CDL endorsements, packaging standards, and common violations to avoid."
      slug="how-to-ship-hazardous-materials"
      publishDate="2026-03-29"
      content={content}
      faqs={faqs}
      relatedLinks={[
        { label: "Hazmat Shipping Services", to: "/services/hazmat" },
        { label: "How to Choose a Freight Carrier", to: "/resources/how-to-choose-freight-carrier" },
        { label: "How to Ship Freight: Beginner's Guide", to: "/resources/how-to-ship-freight" },
      ]}
    />
  );
};

export default HowToShipHazardousMaterials;
