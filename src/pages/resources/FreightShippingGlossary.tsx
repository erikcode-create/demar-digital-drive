import ResourceArticle from "@/components/ResourceArticle";
import type { FAQItem } from "@/components/ResourceArticle";
import { Link } from "react-router-dom";

const FreightShippingGlossary = () => {
  const faqs: FAQItem[] = [
    {
      question: "What is the most important freight term to understand?",
      answer:
        "The Bill of Lading (BOL) is arguably the most important freight document and term to understand. It serves as a receipt for your goods, a contract between shipper and carrier, and a document of title. Every freight shipment requires a BOL, and errors on this document can cause delivery delays, billing disputes, and cargo claims issues.",
    },
    {
      question: "What is the difference between detention and demurrage?",
      answer:
        "Detention is a fee charged when a truck is kept waiting at a shipper or receiver location beyond the allotted free time (typically 1-2 hours). Demurrage applies specifically to shipping containers at ports or rail yards that are not picked up within the free time period (usually 3-5 days). Both are time-based penalty charges, but detention applies to trucks and demurrage applies to containers.",
    },
    {
      question: "What does FOB mean and why does it matter?",
      answer:
        "FOB (Free on Board) determines when ownership and risk transfer from seller to buyer. FOB Origin means the buyer assumes responsibility once the goods leave the seller's dock -- the buyer pays freight and bears transit risk. FOB Destination means the seller is responsible until goods arrive at the buyer's location. This distinction determines who files claims for damaged freight and who pays shipping costs.",
    },
    {
      question: "What is the difference between FTL and LTL?",
      answer:
        "FTL (Full Truckload) means your shipment occupies an entire trailer, typically 24-26 pallets or 40,000+ lbs. LTL (Less-Than-Truckload) means your shipment shares trailer space with other shippers' freight, usually 1-6 pallets or under 10,000 lbs. FTL is priced per mile while LTL is priced per hundredweight (CWT) based on freight class. FTL ships point-to-point while LTL routes through carrier terminals.",
    },
    {
      question: "What is an accessorial charge in freight shipping?",
      answer:
        "An accessorial charge is any fee beyond the base line-haul rate for additional services required to complete a shipment. Common accessorials include liftgate delivery ($75-$150), inside delivery ($100-$250), residential delivery ($75-$150), limited access pickup ($50-$150), detention ($50-$100/hour), redelivery ($150-$300), and appointment scheduling ($25-$50). Always account for accessorials when comparing freight quotes.",
    },
  ];

  const relatedLinks = [
    { label: "Freight Classes Explained", to: "/resources/freight-classes-explained" },
    { label: "How to Ship Freight", to: "/resources/how-to-ship-freight" },
    { label: "Broker vs Carrier vs 3PL", to: "/resources/broker-vs-carrier-vs-3pl" },
    { label: "Request a Free Quote", to: "/quote" },
  ];

  const content = (
    <>
      <p>
        This freight shipping glossary defines <strong>50+ essential logistics and
        transportation terms</strong> that shippers, receivers, and supply chain professionals
        encounter daily. Whether you are shipping your first pallet or managing a complex supply
        chain, understanding these terms helps you communicate clearly with carriers and brokers,
        read contracts and invoices accurately, and avoid costly misunderstandings. Each definition
        below is written in plain language with practical context for how the term applies to
        real-world freight shipping. Terms are organized alphabetically for quick reference. For
        deeper dives into specific topics, see our related guides on{" "}
        <Link to="/resources/freight-classes-explained">freight classes</Link>,{" "}
        <Link to="/resources/broker-vs-carrier-vs-3pl">brokers vs carriers vs 3PLs</Link>, and{" "}
        <Link to="/resources/how-to-ship-freight">how to ship freight</Link>. Need help with a
        shipment? <Link to="/quote">Request a free quote from DeMar Transportation</Link>.
      </p>

      <h2>A</h2>

      <h3>Accessorial Charges</h3>
      <p>
        Fees charged for services beyond standard pickup and delivery. Common accessorials include
        liftgate service ($75-$150), inside delivery ($100-$250), residential delivery ($75-$150),
        detention ($50-$100/hour), and limited access fees ($50-$150). Always ask about potential
        accessorials when requesting a <Link to="/quote">freight quote</Link>.
      </p>

      <h3>Axle Weight</h3>
      <p>
        The portion of a vehicle's total weight distributed to a single axle or axle group. Federal
        limits are 12,000 lbs for a single axle and 34,000 lbs for a tandem axle, with an 80,000
        lb gross vehicle weight maximum.
      </p>

      <h2>B</h2>

      <h3>Bill of Lading (BOL)</h3>
      <p>
        The most important document in freight shipping. A BOL serves three functions: a receipt
        confirming the carrier received the goods, a contract for transportation services, and a
        document of title for the cargo. Every shipment must have a BOL listing shipper, consignee,
        commodity description, weight, freight class, and special instructions.
      </p>

      <h3>Blind Shipment</h3>
      <p>
        A shipment where either the shipper or consignee (or both) is hidden from the other party.
        Used when a broker or middleman does not want the manufacturer and end buyer to know each
        other's identity. Requires special BOL handling.
      </p>

      <h3>Broker</h3>
      <p>
        A licensed intermediary that arranges freight transportation between shippers and carriers
        without owning trucks. Brokers must hold FMCSA broker authority and maintain a $75,000
        surety bond. See our full guide on{" "}
        <Link to="/resources/broker-vs-carrier-vs-3pl">broker vs carrier vs 3PL</Link>.
      </p>

      <h2>C</h2>

      <h3>Carrier</h3>
      <p>
        A company that owns and operates trucks to physically transport freight. Carriers hold motor
        carrier (MC) authority and USDOT numbers from the FMCSA. They are legally responsible for
        freight in their possession.
      </p>

      <h3>CBM (Cubic Meter)</h3>
      <p>
        A volumetric measurement used primarily in international shipping. One CBM equals a cube
        measuring 1 meter on each side (35.3 cubic feet). Used to calculate container space and
        ocean freight rates.
      </p>

      <h3>Class (Freight)</h3>
      <p>
        A standardized NMFC classification (50-500) that determines LTL shipping rates based on
        density, stowability, handling, and liability. Lower classes cost less. See our{" "}
        <Link to="/resources/freight-classes-explained">freight classes guide</Link>.
      </p>

      <h3>Commodity</h3>
      <p>
        The product or goods being shipped. The commodity description on a BOL determines freight
        class, insurance requirements, and whether hazmat regulations apply. Accurate commodity
        descriptions prevent reclassification fees.
      </p>

      <h3>Consignee</h3>
      <p>
        The person or company receiving the freight shipment at the delivery destination. The
        consignee is named on the BOL and is responsible for inspecting the goods and signing for
        receipt (proof of delivery).
      </p>

      <h3>Cross-Docking</h3>
      <p>
        A logistics practice where inbound freight is unloaded from one truck and directly loaded
        onto outbound trucks with minimal or no warehouse storage. Reduces handling costs and
        transit time. Used extensively in LTL operations and retail distribution.
      </p>

      <h3>CWT (Hundredweight)</h3>
      <p>
        A pricing unit equal to 100 pounds. LTL freight rates are typically quoted per CWT. For
        example, a rate of $25/CWT means $25 per 100 lbs, so a 500 lb shipment would cost $125
        for the line-haul portion.
      </p>

      <h2>D</h2>

      <h3>Deadhead</h3>
      <p>
        Miles driven by a truck without a load, typically from the last delivery point to the next
        pickup. Deadhead miles generate no revenue for the carrier and are often factored into
        freight rates, especially on less popular lanes.
      </p>

      <h3>Demurrage</h3>
      <p>
        A charge assessed when a shipping container at a port or rail yard is not picked up within
        the allotted free time (usually 3-5 days). Rates escalate the longer the container sits,
        often starting at $75-$150/day and increasing to $300+/day.
      </p>

      <h3>Detention</h3>
      <p>
        A charge for holding a truck at a shipper or receiver facility beyond the allotted free
        time, typically 1-2 hours. Rates range from $50 to $100 per hour. Detention is one of the
        most common accessorial charges in trucking.
      </p>

      <h3>Drayage</h3>
      <p>
        Short-distance transportation of freight, usually between a port, rail yard, or warehouse
        and a nearby facility. Drayage is a critical link in intermodal shipping, connecting ocean
        or rail transport to final truck delivery.
      </p>

      <h3>Drop Trailer</h3>
      <p>
        A service where the carrier leaves an empty trailer at a shipper's dock for loading over a
        period of time, then returns to pick it up. Eliminates detention charges but requires the
        carrier to have extra trailer capacity. Fees range from $50-$100/day.
      </p>

      <h3>Dry Van</h3>
      <p>
        The most common type of enclosed trailer, measuring 53' long with approximately 3,000 cubic
        feet of cargo space. Used for non-temperature-sensitive, non-oversized freight. Roughly 70%
        of all truck freight in the U.S. moves in dry vans.
      </p>

      <h3>Dunnage</h3>
      <p>
        Materials used to protect and secure cargo during transport, including lumber, airbags,
        foam padding, cardboard, and strapping. Proper dunnage prevents freight damage from
        shifting, vibration, and compression.
      </p>

      <h2>E</h2>

      <h3>EDI (Electronic Data Interchange)</h3>
      <p>
        A standardized electronic format for exchanging business documents (purchase orders,
        invoices, shipment status) between companies. EDI integration between shippers and carriers
        automates load tendering, tracking, and invoicing.
      </p>

      <h3>ETA (Estimated Time of Arrival)</h3>
      <p>
        The projected date and time a shipment will reach its destination. ETAs are based on
        distance, driver hours-of-service, route conditions, and scheduled stops. Real-time tracking
        provides updated ETAs throughout transit.
      </p>

      <h3>Expedited Shipping</h3>
      <p>
        A premium service that guarantees faster-than-standard transit times, often using team
        drivers (two drivers alternating to keep the truck moving 24/7), straight trucks, or
        exclusive-use vehicles. Expedited rates are typically 30-80% higher than standard.
      </p>

      <h2>F</h2>

      <h3>Flatbed</h3>
      <p>
        An open trailer without sides or a roof, used for freight that is oversized, oddly shaped,
        or needs to be loaded from the top or sides (machinery, steel, lumber, construction
        materials). Learn more about our{" "}
        <Link to="/services/flatbed">flatbed shipping services</Link>.
      </p>

      <h3>FMCSA (Federal Motor Carrier Safety Administration)</h3>
      <p>
        The U.S. government agency that regulates the trucking industry. FMCSA issues operating
        authority (MC numbers), sets safety standards, enforces hours-of-service rules, and
        maintains carrier safety records. All legitimate carriers and brokers are registered with
        FMCSA.
      </p>

      <h3>FOB (Free on Board)</h3>
      <p>
        A term that defines when ownership and risk transfer from seller to buyer. FOB Origin: buyer
        assumes risk once goods leave seller's dock. FOB Destination: seller bears risk until goods
        arrive at buyer's facility. This determines who pays freight and who files damage claims.
      </p>

      <h3>Freight Class</h3>
      <p>
        See <strong>Class (Freight)</strong> above and our{" "}
        <Link to="/resources/freight-classes-explained">full freight classes guide</Link>.
      </p>

      <h3>FTL (Full Truckload)</h3>
      <p>
        A shipment that occupies an entire trailer, typically 24-26 standard pallets or 40,000+
        lbs. FTL ships point-to-point without terminal handling, resulting in faster transit and
        lower damage risk compared to LTL. Priced per mile rather than per hundredweight.
      </p>

      <h3>Fuel Surcharge (FSC)</h3>
      <p>
        A variable fee added to freight rates to account for fluctuating fuel costs. Calculated as
        a percentage of the line-haul rate or a cents-per-mile charge, based on the DOE's weekly
        national diesel fuel price index. FSC typically adds 15-30% to the base rate.
      </p>

      <h2>G-H</h2>

      <h3>Gross Vehicle Weight (GVW)</h3>
      <p>
        The total combined weight of a truck, trailer, fuel, driver, and cargo. Federal GVW limit on
        interstate highways is 80,000 lbs. Exceeding this limit requires overweight permits.
      </p>

      <h3>Hazmat (Hazardous Materials)</h3>
      <p>
        Materials classified as dangerous for transport, including flammable liquids, corrosives,
        explosives, and toxic substances. Hazmat freight requires DOT placards, trained drivers with
        hazmat endorsement, special documentation, and compliance with 49 CFR regulations. Learn
        more in our{" "}
        <Link to="/resources/how-to-ship-hazardous-materials">hazmat shipping guide</Link>.
      </p>

      <h2>I-J</h2>

      <h3>Intermodal</h3>
      <p>
        Freight transportation using two or more modes (truck, rail, ship) in a single journey. The
        most common intermodal combination is truck-rail-truck, where a container is drayed to a
        rail yard, transported by train for the long haul, and drayed to the final destination.
        Intermodal is 10-30% cheaper than over-the-road trucking on lanes over 750 miles.
      </p>

      <h3>JIT (Just-In-Time)</h3>
      <p>
        A logistics strategy where materials arrive precisely when needed in the production process,
        minimizing inventory storage costs. JIT requires highly reliable transportation with tight
        delivery windows and real-time tracking.
      </p>

      <h2>L</h2>

      <h3>Lane</h3>
      <p>
        A specific origin-to-destination route used regularly for freight shipments. Carriers and
        brokers track pricing, capacity, and transit times by lane. High-volume lanes typically
        offer lower rates due to consistent demand.
      </p>

      <h3>Linehaul</h3>
      <p>
        The base transportation charge for moving freight from origin to destination, excluding fuel
        surcharges and accessorial fees. Linehaul rates are determined by distance, weight, freight
        class (LTL), and market conditions.
      </p>

      <h3>LTL (Less-Than-Truckload)</h3>
      <p>
        A shipping method where your freight shares trailer space with other shippers' cargo.
        Typically for shipments of 1-6 pallets or 150-10,000 lbs. LTL is priced by freight class
        and weight (per CWT). Freight routes through carrier terminals and may be handled multiple
        times, increasing transit time compared to FTL. See our{" "}
        <Link to="/resources/ftl-vs-ltl">FTL vs LTL guide</Link>.
      </p>

      <h2>M-N</h2>

      <h3>Manifest</h3>
      <p>
        A document listing all cargo on a single truck or trailer. In LTL, the manifest lists every
        shipper's freight being transported. Used for inventory control and regulatory compliance.
      </p>

      <h3>MC Number (Motor Carrier Number)</h3>
      <p>
        A unique identifier issued by FMCSA to carriers and brokers authorized to operate in
        interstate commerce. Verify any carrier or broker's MC number at safer.fmcsa.dot.gov before
        tendering freight.
      </p>

      <h3>NMFC (National Motor Freight Classification)</h3>
      <p>
        The standardized freight classification system maintained by the National Motor Freight
        Traffic Association (NMFTA). Assigns every commodity an NMFC code and corresponding freight
        class (50-500) used for LTL pricing.
      </p>

      <h2>O-P</h2>

      <h3>OTR (Over-the-Road)</h3>
      <p>
        Long-distance trucking, typically referring to routes of 250+ miles. OTR drivers may be
        away from home for days or weeks at a time, distinguishing OTR from local or regional
        trucking.
      </p>

      <h3>Pallet</h3>
      <p>
        A flat wooden or plastic platform used to stack, store, and transport goods. Standard pallet
        dimensions are 48" x 40". A standard dry van trailer holds 24-26 pallets in a single row,
        or up to 52 double-stacked. Palletized freight is easier to handle and less prone to damage.
      </p>

      <h3>POD (Proof of Delivery)</h3>
      <p>
        A signed document confirming that freight was delivered to the consignee in the expected
        condition. The POD is signed by the receiver at the time of delivery and is essential for
        billing, payment, and damage claims. Electronic PODs (ePODs) are increasingly common.
      </p>

      <h2>R</h2>

      <h3>Reefer (Refrigerated Trailer)</h3>
      <p>
        A temperature-controlled trailer used for transporting perishable goods (food, pharmaceuticals,
        chemicals). Reefers maintain temperatures from -20 degrees F to 70 degrees F and cost 20-40% more than dry
        vans. See our guide on{" "}
        <Link to="/resources/how-to-ship-refrigerated-goods">shipping refrigerated goods</Link>.
      </p>

      <h2>S</h2>

      <h3>Shipper</h3>
      <p>
        The person or company that sends freight. The shipper is responsible for packaging, labeling,
        preparing the BOL, and making goods available for carrier pickup. Also called the
        "consignor."
      </p>

      <h3>Spot Rate</h3>
      <p>
        A one-time freight rate for an individual shipment, negotiated on the open market based on
        current supply and demand. Spot rates fluctuate daily and can be significantly higher or
        lower than contract rates depending on market conditions and season.
      </p>

      <h3>Step Deck</h3>
      <p>
        A flatbed trailer with a lower rear deck (36-42" vs 60" for standard flatbed), allowing
        taller freight to be hauled without exceeding legal height limits. Used for machinery,
        vehicles, and equipment that exceeds standard flatbed height capacity.
      </p>

      <h2>T</h2>

      <h3>Tarp</h3>
      <p>
        A protective cover placed over open-deck freight (flatbed, step deck) to shield it from
        weather. Tarping is an accessorial service, typically costing $50-$150 per load. Some
        commodities require tarping per shipper instructions or to prevent moisture damage.
      </p>

      <h3>TL (Truckload)</h3>
      <p>
        See <strong>FTL (Full Truckload)</strong> above. The terms TL and FTL are used
        interchangeably.
      </p>

      <h3>TONU (Truck Ordered Not Used)</h3>
      <p>
        A fee charged when a carrier dispatches a truck to a shipper's facility for a scheduled
        pickup, but the load is cancelled or not ready. TONU fees typically range from $150 to $500
        and compensate the carrier for deadhead miles and lost revenue opportunity.
      </p>

      <h3>Transit Time</h3>
      <p>
        The number of business days required for a shipment to travel from origin to destination.
        FTL transit times are typically 1-5 days depending on distance. LTL transit times range
        from 1-7+ days due to terminal handling and routing. Expedited services offer same-day or
        next-day delivery.
      </p>

      <h2>U-W</h2>

      <h3>USDOT Number</h3>
      <p>
        A unique identifier assigned by the U.S. Department of Transportation to commercial motor
        carriers operating in interstate commerce. Required for all carriers that transport
        passengers or haul cargo in interstate commerce. Different from an MC number.
      </p>

      <h3>Warehouse</h3>
      <p>
        A commercial facility used for storing, sorting, and distributing goods. Warehouses in the
        freight context may offer cross-docking, order fulfillment, inventory management, and
        distribution services. DeMar Transportation provides warehousing through our{" "}
        <Link to="/services/3pl">3PL partner network</Link>.
      </p>

      <h3>Waybill</h3>
      <p>
        A document issued by a carrier that accompanies freight through transit, listing origin,
        destination, route, commodity, weight, and charges. Similar to a BOL but used more commonly
        in rail and international shipping. In trucking, the BOL serves as the primary shipping
        document.
      </p>
    </>
  );

  return (
    <ResourceArticle
      title="Freight Shipping Terms Glossary: 50+ Logistics Definitions"
      subtitle="Reference Guide"
      description="Comprehensive glossary of 50+ freight shipping and logistics terms. Clear, plain-language definitions for shippers, receivers, and supply chain professionals."
      metaTitle="Freight Shipping Terms Glossary: 50+ Logistics Definitions | DeMar Transportation"
      metaDescription="Look up 50+ freight and logistics terms with clear definitions. From accessorial charges to waybills, this glossary covers every shipping term you need to know."
      slug="freight-shipping-glossary"
      publishDate="2026-03-29"
      content={content}
      faqs={faqs}
      relatedLinks={relatedLinks}
    />
  );
};

export default FreightShippingGlossary;
