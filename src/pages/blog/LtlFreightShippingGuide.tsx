import BlogPost from "@/components/BlogPost";
import { Link } from "react-router-dom";

const LtlFreightShippingGuide = () => {
  const faqs = [
    {
      question: "What is LTL freight shipping and how does it work?",
      answer: "LTL (Less-Than-Truckload) freight shipping combines shipments from multiple shippers into a single trailer. Your freight shares truck space with other cargo, and you only pay for the portion of the trailer your shipment occupies. LTL is typically used for shipments between 150 and 10,000 pounds that don't require a full 48- or 53-foot trailer."
    },
    {
      question: "How are LTL freight shipping costs calculated?",
      answer: "LTL costs are determined by several factors: freight class (based on density, handling, stowability, and liability), shipment weight, distance traveled, and any accessorial services like liftgate delivery or inside pickup. Freight class ranges from Class 50 (the least expensive, densest cargo) to Class 500 (the most expensive, lightest or most difficult to handle)."
    },
    {
      question: "When should I choose LTL shipping instead of FTL?",
      answer: "LTL is the better choice when your shipment weighs under 10,000 pounds and doesn't fill an entire trailer. If you're shipping 1 to 6 pallets, LTL is almost always more cost-effective than booking a full truckload. However, if your shipment exceeds 10,000 pounds or you need guaranteed delivery without intermediate handling, FTL may be the better option."
    },
    {
      question: "How long does LTL freight shipping take?",
      answer: "LTL transit times typically range from 1 to 7 business days depending on distance and the number of terminal transfers along the route. Regional shipments under 500 miles often deliver in 1 to 3 days, while cross-country shipments may take 5 to 7 days. Because LTL shipments make multiple stops, transit times are longer than dedicated FTL service."
    },
    {
      question: "How should I package freight for LTL shipping?",
      answer: "Proper LTL packaging starts with sturdy pallets rated for your shipment weight. Stack and shrink-wrap all items securely to the pallet, keeping the load within the pallet footprint. Label every package with shipper and consignee information, and make sure the freight class and weight on your bill of lading are accurate to avoid reclassification charges."
    }
  ];

  const relatedLinks = [
    {
      label: "LTL Freight Shipping Services",
      to: "/services/ltl"
    },
    {
      label: "LTL vs FTL: Which Shipping Method Is Right for You?",
      to: "/blog/ltl-vs-ftl-freight-shipping"
    },
    {
      label: "Freight Classes Explained",
      to: "/resources/freight-classes-explained"
    },
    {
      label: "Get a Free Freight Quote",
      to: "/quote"
    }
  ];

  const content = (
    <>
      <p>
        LTL freight shipping is how most small and mid-size businesses move goods across the country
        without paying for trailer space they don't need. In an LTL shipment, your pallets share
        trailer space with freight from other shippers. You pay only for the linear feet or weight
        your cargo occupies, not the full truck. This LTL freight shipping guide covers everything
        you need to know: how the pricing works, what freight classes mean for your invoice, how to
        package your shipment so it arrives intact, and when LTL makes more sense than booking a
        full truckload. If you are shipping between 150 and 10,000 pounds, LTL is the standard
        choice. The carrier picks up your freight, routes it through one or more terminals, and
        delivers it to the consignee. Each transfer point is called a cross-dock, where freight
        is unloaded from one trailer and loaded onto another heading closer to its destination.
        The more terminals your shipment passes through, the longer it takes to arrive. Regional
        moves under 500 miles often deliver in 1 to 3 business days. Cross-country shipments
        that pass through 3 or 4 terminals may take 5 to 7 days. Understanding how each piece
        of the LTL process works puts you in a better position to control costs and avoid
        surprise charges on your freight bill.
      </p>

      <h2>How LTL Freight Shipping Works</h2>
      <p>
        The LTL process starts when you request a quote. You provide the origin and destination
        zip codes, the number of pallets or handling units, the total weight, and the freight
        class. The carrier or broker returns a rate based on those inputs. Once you book, the
        carrier dispatches a truck to pick up your freight, usually within 24 to 48 hours. Your
        shipment gets a PRO number, which is the tracking ID you use to follow it through
        the network.
      </p>
      <p>
        After pickup, your freight goes to the origin terminal. There, it is sorted and loaded
        onto a linehaul trailer with other shipments heading in the same direction. If your
        destination is within the same terminal's delivery area, the shipment may go out for
        delivery the next business day. For longer hauls, the freight moves through one or more
        intermediate terminals before reaching the destination terminal, where it is loaded onto
        a local delivery truck and brought to the consignee.
      </p>
      <p>
        Each terminal transfer adds handling. That is why proper packaging matters so much in LTL.
        Your freight will be moved by forklift multiple times, stacked next to other cargo, and
        potentially shifted during transit. Damage claims in LTL often trace back to poor
        palletizing or insufficient shrink wrap rather than carrier negligence.
      </p>

      <h2>LTL Freight Shipping Costs: What Drives the Price</h2>
      <p>
        LTL pricing is more complex than FTL pricing. With a full truckload, you pay a flat rate
        for the truck. With LTL, the carrier calculates your rate from a tariff that accounts for
        freight class, weight, distance, and accessorial charges. Understanding each factor helps
        you control what you pay.
      </p>

      <h3>Freight Class</h3>
      <p>
        The National Motor Freight Classification (NMFC) system assigns every commodity a freight
        class from 50 to 500. Class 50 covers dense, easy-to-handle freight like steel bolts.
        Class 500 covers low-density, fragile, or high-liability items like ping pong balls or
        gold dust. The higher the class, the higher the per-hundredweight rate. If you misclassify
        your freight on the bill of lading, the carrier will reclassify it at delivery and send
        you an adjusted invoice, often at a higher rate plus a reclassification fee. Getting the{" "}
        <Link to="/resources/freight-classes-explained">freight class</Link> right up front is one
        of the easiest ways to avoid unexpected charges.
      </p>

      <h3>Weight and Density</h3>
      <p>
        Carriers price LTL by the hundredweight (CWT), so heavier shipments cost more in absolute
        terms but often less per pound. Density plays a role too. A shipment that weighs 500 pounds
        but takes up 8 linear feet of trailer space costs more than 500 pounds packed onto a single
        48-by-40-inch pallet. Some carriers have shifted to density-based pricing entirely,
        calculating your rate from the cubic dimensions of your freight rather than the NMFC class.
      </p>

      <h3>Accessorial Charges</h3>
      <p>
        Accessorials are fees for services beyond standard dock-to-dock pickup and delivery.
        Common accessorials include liftgate service (when the pickup or delivery location lacks
        a loading dock), inside delivery, residential delivery, limited access locations, and
        appointment scheduling. Each accessorial adds a flat fee, typically ranging from $50 to
        $150 per service. If you know your delivery site requires a liftgate, include that in
        your quote request so the price you see matches the price you pay.
      </p>

      <h2>How to Package Freight for LTL Shipping</h2>
      <p>
        LTL freight gets handled more than FTL freight. Your shipment will be loaded and unloaded
        at every terminal along the route, often by different crews using different forklifts. The
        goal of your packaging is to make your freight forklift-friendly, stackable, and clearly
        labeled.
      </p>
      <p>
        Start with a standard 48-by-40-inch pallet rated for the weight you are stacking on it.
        Arrange your boxes or cartons in a stable pattern and keep them within the pallet
        footprint. Nothing should hang over the edges. Wrap the entire load in stretch film,
        working from the bottom up and anchoring the film to the pallet base. For heavy or
        tall loads, add corner boards under the stretch wrap for extra stability.
      </p>
      <p>
        Label every handling unit with the shipper name, consignee name and address, PO number,
        and PRO number once assigned. Place labels on at least two sides so dock workers can
        identify the shipment regardless of how the pallet is positioned. A bill of lading (BOL)
        must accompany every LTL shipment. The BOL lists the shipper, consignee, freight
        description, weight, class, and any special instructions. Inaccurate BOL information is
        the number one cause of billing disputes in LTL.
      </p>

      <h2>LTL Transit Times and Service Levels</h2>
      <p>
        Standard LTL transit times depend on distance and the number of terminal transfers.
        Regional moves under 500 miles generally deliver in 1 to 3 business days. Shipments
        traveling 500 to 1,500 miles typically take 3 to 5 days. Cross-country moves over
        1,500 miles may take 5 to 7 business days. These are estimates, not guarantees. Weather,
        terminal congestion, and trailer capacity all affect actual delivery dates.
      </p>
      <p>
        If you need a firm delivery date, most carriers offer guaranteed service for an additional
        fee. Guaranteed LTL costs 20% to 40% more than standard service, but the carrier commits
        to delivering by a specific date and refunds the premium if they miss it. For
        time-sensitive shipments that don't justify a dedicated truck, guaranteed LTL splits the
        difference between standard LTL and{" "}
        <Link to="/blog/emergency-expedited-freight">expedited freight</Link> on both cost
        and speed.
      </p>
      <p>
        DeMar Transportation works with a network of LTL carriers covering every lane in the
        lower 48 states. Because we hold both Motor Carrier and Freight Broker authority, we can
        either move your LTL freight on our own equipment or match you with the carrier that
        offers the best rate and transit time for your specific lane. Either way, you get a single
        point of contact and full shipment visibility from pickup to delivery.
      </p>

      <h2>When to Choose LTL vs Full Truckload</h2>
      <p>
        The decision between <Link to="/blog/ltl-vs-ftl-freight-shipping">LTL and FTL</Link> comes
        down to weight, volume, and how much handling your freight can tolerate. LTL makes sense
        when your shipment weighs between 150 and 10,000 pounds, fits on 1 to 6 standard pallets,
        and the extra transit time from terminal transfers is acceptable.
      </p>
      <p>
        FTL becomes the better option when your freight exceeds 10,000 pounds, fills more than
        half a trailer, or is fragile enough that multiple handling events create unacceptable
        damage risk. FTL shipments move point to point with no terminal stops, which means faster
        transit and less handling. The cost per pound is lower with FTL once your shipment is
        large enough to fill a significant portion of the trailer.
      </p>
      <p>
        There is a gray zone between 6 and 12 pallets where both LTL and FTL quotes are worth
        comparing. In that range, volume LTL rates or partial truckload (PTL) pricing may beat
        a full truckload rate. At DeMar Transportation, we quote both options and show you the
        cost and transit time side by side so you can make the call based on your budget and
        delivery window. <Link to="/quote">Request a free quote</Link> and we will run the
        numbers for your specific shipment.
      </p>

      <h2>Common LTL Freight Shipping Mistakes</h2>
      <p>
        The most expensive LTL mistake is listing the wrong freight class on your bill of lading.
        Carriers inspect shipments at terminals, and if your declared class does not match the
        actual commodity, you will get hit with a reclassification charge plus the rate difference.
        This alone can add hundreds of dollars to a single shipment. Before booking, look up your
        commodity's NMFC code and class, and weigh your shipment on a calibrated scale.
      </p>
      <p>
        Another common mistake is underestimating dimensions. LTL carriers increasingly use
        dimensionalizers, automated scanners that measure your freight at the terminal. If your
        shipment's cubic dimensions put it in a higher density bracket than what you declared,
        the carrier will adjust the invoice. Measure your pallets after they are built, not before.
      </p>
      <p>
        Failing to specify accessorials at the time of booking causes problems too. If you book a
        standard dock delivery but the consignee only has a parking lot, the driver will either
        refuse to deliver or call in a liftgate. Either way, you pay the liftgate fee plus a
        redelivery charge. Know your pickup and delivery site requirements before you request
        a quote.
      </p>
      <p>
        Finally, skipping{" "}
        <Link to="/blog/freight-shipping-insurance-coverage">freight insurance</Link> is a
        gamble. Carrier liability under the Carmack Amendment covers actual loss, but the claims
        process is slow and limited to the declared value or a per-pound maximum. For high-value
        freight, third-party cargo insurance closes the gap between carrier liability and your
        actual replacement cost.
      </p>

      <h2>How to Get Started with LTL Shipping</h2>
      <p>
        Booking your first LTL shipment is straightforward once you have the right information
        ready. Gather the origin and destination addresses, total weight, pallet count, dimensions,
        and freight class. Note any accessorials your shipment needs: liftgate, residential
        delivery, inside delivery, or appointment scheduling. With those details in hand, you can
        request a quote and compare rates.
      </p>
      <p>
        DeMar Transportation handles <Link to="/services/ltl">LTL freight</Link> for businesses
        across the country from our base in Reno, Nevada. Licensed under USDOT 4392091, we hold
        both Motor Carrier and Freight Broker authority so we can move your freight on our own
        equipment or source the right carrier for your lane. Our dispatch team is available 24/7
        to coordinate pickups and track active shipments. For non-urgent questions, our office is
        open Monday through Friday, 7:00 AM to 6:00 PM PST. Reach us at (775) 230-4767 and we
        will walk you through freight class, mode selection, or anything else you need.
      </p>
      <p>
        Whether you ship one pallet a month or twenty pallets a week, understanding how LTL
        works puts you in control of your freight spend. Get the class right, package for
        terminal handling, plan for accessorials, and compare LTL against FTL when your shipment
        size falls in the overlap zone. The more you know about how the LTL network operates,
        the fewer surprises show up on your invoice.
      </p>
    </>
  );

  return (
    <BlogPost
      title="LTL Freight Shipping Guide: How Less-Than-Truckload Shipping Works"
      subtitle="Shipping Guides"
      description="Everything you need to know about LTL freight shipping, from how it works and what it costs to packaging requirements and when to choose LTL over full truckload."
      metaTitle="LTL Freight Shipping Guide | How LTL Works in 2026"
      metaDescription="Complete LTL freight shipping guide covering costs, freight classes, packaging, and transit times. Get a free LTL quote from DeMar Transportation today."
      slug="ltl-freight-shipping-guide"
      publishDate="2026-04-07"
      readTime="8 min"
      content={content}
      faqs={faqs}
      relatedLinks={relatedLinks}
    />
  );
};

export default LtlFreightShippingGuide;
