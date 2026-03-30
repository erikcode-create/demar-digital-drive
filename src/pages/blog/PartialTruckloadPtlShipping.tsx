import BlogPost from "@/components/BlogPost";
import { Link } from "react-router-dom";

const PartialTruckloadPtlShipping = () => {
  const faqs = [
    {
      question: "What is partial truckload (PTL) shipping and how does it differ from LTL and FTL?",
      answer: "PTL shipping is when your freight fills 6-17 pallets or occupies 8,000-20,000 lbs, too much for LTL but not enough for a full 53-foot trailer. PTL typically costs 20-40% less than LTL while offering faster service than consolidating smaller shipments, making it ideal for mid-sized loads."
    },
    {
      question: "How much does partial truckload shipping cost?",
      answer: "PTL freight rates typically range from $1.50-$3.50 per mile depending on weight, distance, and freight class, compared to $2.50-$5.00 for LTL and $0.85-$1.75 for FTL. Most carriers offer PTL pricing between these tiers with flat-rate or mileage-based options."
    },
    {
      question: "What's the typical transit time for PTL shipments?",
      answer: "PTL shipments typically take 2-5 days for cross-country delivery, with regional PTL shipments arriving in 1-2 days. Since PTL loads don't wait for full-truckload consolidation like LTL, they offer faster service than traditional less-than-truckload options."
    },
    {
      question: "How do I know if my shipment qualifies for PTL shipping?",
      answer: "Your freight qualifies for PTL if it weighs 8,000-20,000+ lbs or occupies 6-17 pallets but doesn't fill a 53-foot trailer. Request a PTL quote by providing your weight, dimensions, freight class, and origin/destination, and carriers will confirm eligibility within 24 hours."
    },
    {
      question: "Can I ship mixed freight classes with PTL?",
      answer: "Yes, PTL shipments commonly include mixed freight classes since you're paying for the trailer capacity rather than weight-based rates. However, your shipment may have additional handling requirements for hazmat or fragile items, which should be noted when requesting quotes."
    }
  ];

  const relatedLinks = [
    {
      label: "FTL vs LTL: How to Choose the Right Shipping Method",
      to: "/resources/ftl-vs-ltl"
    },
    {
      label: "How to Get a Freight Quote: Step-by-Step Guide",
      to: "/resources/how-to-get-freight-quote"
    },
    {
      label: "Types of Freight Trailers: Complete Guide",
      to: "/resources/types-of-freight-trailers"
    },
    {
      label: "LTL Freight Shipping Services",
      to: "/services/ltl"
    }
  ];

  const content = (
    <>
      <p>
        Partial truckload shipping, commonly called PTL, is a freight mode designed for loads that fall between 6 and 17 pallets or weigh between 8,000 and 20,000 pounds. It sits in the middle ground between less-than-truckload and full truckload shipping: your freight is too large to price efficiently as LTL, but it does not justify booking an entire 53-foot trailer. When shippers move cargo in this range through traditional LTL carriers, they often overpay because LTL rates are calculated using NMFC freight class and weight breaks that penalize larger shipments. PTL eliminates that penalty by pricing based on trailer space used rather than freight classification, which translates directly to savings of 20 to 40 percent compared to LTL on qualifying loads. In practice, a shipper moving 10 pallets of automotive parts from Memphis to Columbus on a regular LTL carrier might pay $1,800 to $2,400. The same load tendered as PTL typically runs $1,100 to $1,500, with fewer handling touchpoints and a transit time that is one to two days faster. That combination of lower cost and faster delivery is why supply chain directors at manufacturing and retail companies increasingly route mid-sized loads through PTL rather than defaulting to LTL or paying for capacity they do not need with FTL.
      </p>

      <h2>How Partial Truckload Shipping Works</h2>
      <p>
        When you book a PTL shipment, a carrier assigns a truck to haul your freight along with one or two other shippers whose lanes align closely with yours. Unlike LTL, where your pallets may transfer through three or four terminal facilities before reaching the consignee, PTL loads typically move on a single trailer with at most one driver change. The result is fewer handoffs, less chance of damage, and a more predictable delivery window.
      </p>
      <p>
        The mechanics of PTL pricing reflect this difference. Rather than running your weight against a freight class matrix, the carrier quotes a flat rate or mileage-based rate for the trailer space your load occupies. If you are moving 12 pallets and the carrier pairs you with a shipper moving 6 pallets in the same direction, both shippers pay for their portion of the trailer. Neither party pays the LTL premium that comes from repeated terminal handling, and neither pays for 35 empty feet of trailer the way a full truckload shipper would if they booked FTL for a partial load.
      </p>
      <p>
        DeMar Transportation handles PTL bookings across Midwest and Southeast lanes regularly. In our experience coordinating loads between Chicago and Atlanta, shippers who switch from LTL to PTL for 8-to-12 pallet shipments typically see their per-load cost drop by $300 to $700 while cutting one to two days off transit time. The savings scale with distance, which means longer cross-country hauls offer even greater spread between LTL and PTL pricing.
      </p>

      <h2>PTL vs LTL vs FTL: Choosing the Right Mode</h2>
      <p>
        Understanding where PTL fits requires an honest look at what each mode costs and what each mode delivers. The comparison is not always straightforward because freight class, lane density, and seasonal demand all affect actual rates. The table below shows representative rate ranges for 2026 across common shipment sizes.
      </p>
      <table>
        <thead>
          <tr>
            <th>Shipment Size</th>
            <th>Recommended Mode</th>
            <th>Typical Rate Range</th>
            <th>Average Transit (Chicago to Atlanta)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1-5 pallets / under 8,000 lbs</td>
            <td>LTL</td>
            <td>$2.50-$5.00 per mile</td>
            <td>3-5 days</td>
          </tr>
          <tr>
            <td>6-17 pallets / 8,000-20,000 lbs</td>
            <td>PTL</td>
            <td>$1.50-$3.50 per mile</td>
            <td>2-4 days</td>
          </tr>
          <tr>
            <td>18+ pallets / 20,000+ lbs</td>
            <td>FTL</td>
            <td>$0.85-$1.75 per mile</td>
            <td>1-2 days</td>
          </tr>
        </tbody>
      </table>
      <p>
        The breakeven point between LTL and PTL typically occurs around 6 to 8 pallets or 7,500 pounds, though this shifts based on freight class. High-class freight like class 150 or 200 items see the LTL-to-PTL crossover happen at lower weights because LTL carriers apply a steep multiplier to high-class freight that PTL pricing does not replicate. If your load is class 125 or higher and weighs more than 6,000 pounds, run a PTL quote before defaulting to LTL.
      </p>
      <p>
        For a deeper comparison of FTL and LTL fundamentals, the <Link to="/resources/ftl-vs-ltl">FTL vs LTL shipping guide</Link> walks through the decision framework in detail.
      </p>

      <h2>When Partial Truckload Shipping Saves You the Most Money</h2>
      <p>
        PTL delivers its largest savings advantage in three specific scenarios. The first is high-class freight. Because PTL rates are space-based rather than class-based, shippers moving class 100 to class 200 freight on PTL avoid the multipliers that make LTL expensive for those commodity types. A 10-pallet load of foam packaging materials rated at class 150 might cost $2,800 via LTL. The same load via PTL runs $1,400 to $1,700 because the carrier is not applying a class 150 penalty to your weight.
      </p>
      <p>
        The second scenario where PTL wins is time-sensitive mid-sized loads. If you are moving 8 pallets and you need delivery in two days rather than four, your options are paying LTL expedited fees or booking PTL at standard rates. PTL expedited fees run significantly lower than LTL expedited because the base transit time for PTL is already faster. Shippers who route time-sensitive loads through PTL instead of paying LTL expedited surcharges save an estimated $200 to $500 per load on the Chicago-to-Dallas corridor.
      </p>
      <p>
        The third scenario is freight that handles poorly at LTL terminals. Every terminal transfer introduces risk. If your product is fragile, oversized, or requires careful floor-loading, each additional handling event raises the probability of a damage claim. PTL loads move with one or two handling events compared to the three to five typical of LTL. Shippers who have experienced damage claim rates above 1.5 percent on LTL regularly find that PTL brings that figure down to under 0.5 percent, which represents real cost reduction beyond the rate savings.
      </p>

      <h2>How PTL Rates Are Calculated</h2>
      <p>
        PTL carriers quote freight in one of two ways: mileage-based or flat-rate. Mileage-based pricing multiplies a per-mile rate by the distance between origin and destination. Flat-rate pricing sets a single number for a defined lane regardless of mileage variations. Both approaches are simpler than LTL rating because they do not require a freight class determination, though some carriers apply a minimum weight or pallet count to qualify a load as PTL rather than LTL.
      </p>
      <p>
        What drives PTL rates up or down? Fuel is the largest variable. Carrier fuel surcharges in 2026 add roughly $0.35 to $0.55 per mile to base rates, depending on the current national diesel average. After fuel, lane density matters most. High-volume lanes like Los Angeles to Phoenix or Chicago to Memphis have more PTL capacity moving in both directions, which keeps rates competitive. Thinner lanes with less freight volume in the backhaul direction carry higher rates because the carrier is more likely to deadhead empty miles on the return trip.
      </p>
      <p>
        Accessorial charges apply to PTL the same way they apply to LTL and FTL. Liftgate service, residential delivery, inside delivery, and detention charges all appear on PTL invoices. Detention in particular adds up quickly: most carriers begin billing detention after two hours of free time at pickup or delivery, typically at $65 to $95 per hour. Shippers who consistently hold drivers past free time will see carriers either raise their base rates to offset detention risk or decline to quote their lanes.
      </p>
      <p>
        To understand the quoting process from start to finish, the <Link to="/resources/how-to-get-freight-quote">freight quote guide</Link> covers what information to have ready and how to compare carrier bids.
      </p>

      <h2>Equipment and Capacity for PTL Shipments</h2>
      <p>
        PTL loads most commonly move in standard 53-foot dry van trailers, though the mode is not limited to dry van. Temperature-controlled PTL exists for food, pharmaceutical, and other commodities that require refrigeration or heat protection. Flatbed PTL handles oversized or heavy freight that cannot be enclosed. The equipment type affects rate because reefer and flatbed capacity costs more to operate than dry van.
      </p>
      <p>
        For dry van PTL, the usable floor space in a 53-foot trailer is approximately 2,560 square feet of floor space with a weight capacity of 44,000 to 46,000 pounds. A 10-pallet load on standard 48x40 pallets occupies roughly 400 square feet, or about 15 to 16 percent of total trailer capacity. A carrier booking two or three PTL shippers on the same trailer is filling 30 to 50 percent of available space while collecting multiple revenue streams, which is why PTL economics work for carriers even at rates below LTL.
      </p>
      <p>
        The <Link to="/resources/types-of-freight-trailers">freight trailer guide</Link> covers specifications for dry van, reefer, flatbed, and specialized equipment in detail, including weight limits and interior dimensions that affect how your freight loads.
      </p>

      <h2>Preparing Your Freight for PTL Shipment</h2>
      <p>
        PTL does not require different packaging than LTL or FTL, but there are preparation steps that affect how smoothly your shipment moves. Pallet consistency matters more in PTL than in FTL because your freight shares trailer space with other shippers. Loads that overhang pallets, are stacked unevenly, or are not properly stretch-wrapped create liability questions at the shared loading dock and during transit.
      </p>
      <p>
        Freight that ships via PTL should be palletized whenever possible. Floor-loaded freight, meaning boxes or bags loaded directly on the trailer floor without pallets, takes longer to load and unload and creates complications when carriers are coordinating multiple pickup and delivery stops on the same trailer. Some PTL carriers decline floor-loaded freight entirely, or they charge a lumper fee to cover the additional labor. Budget $75 to $150 per stop for lumper service if your freight is not palletized.
      </p>
      <p>
        Documentation requirements for PTL mirror those for LTL and FTL. You need a bill of lading that accurately reflects commodity description, weight, dimensions, number of pieces, and freight class. For hazmat freight, proper hazmat placarding and shipping papers are required under FMCSA regulations regardless of shipment mode. Carriers who discover undeclared hazmat at pickup have the right to refuse the load, which creates delays and potential re-tendering costs.
      </p>

      <h2>Common Mistakes Shippers Make with PTL</h2>
      <p>
        The most expensive mistake is routing freight that qualifies for PTL through LTL by default. Many logistics teams default to the same carrier relationships they have always used, and if those relationships are with LTL carriers, that is where the freight goes. Auditing shipments in the 6-to-17 pallet range quarterly and running PTL quotes against your LTL invoices takes about two hours and frequently reveals $20,000 to $60,000 in annual overspend for a shipper moving 50 or more loads per month.
      </p>
      <p>
        The second mistake is not providing accurate freight dimensions when requesting a PTL quote. Carriers build their trailer plans based on the dimensions you provide. If your declared dimensions are 12 pallets at 48x40x60 inches and your actual freight is 48x40x72 inches, the carrier may not have planned for the height difference, which creates a loading problem at pickup. Inaccurate dimensions also expose you to reweigh and redimension charges, which add $75 to $150 per event.
      </p>
      <p>
        A third common error is expecting PTL to work for loads that are genuinely better suited for <Link to="/services/ltl">LTL freight services</Link>. If your freight is 4 pallets and 3,800 pounds, PTL carriers will either decline the load or quote it at LTL rates because it does not meet the minimum threshold for PTL capacity pricing. Trying to force a 4-pallet load into PTL wastes time and does not produce savings.
      </p>

      <h2>PTL for Regular Shipping Lanes</h2>
      <p>
        Where PTL delivers its best long-term value is on recurring lanes. A manufacturer shipping 10 pallets of finished goods from their production facility to a regional distribution center twice a week has a predictable PTL load that carriers want to plan around. When you offer a carrier consistent, predictable volume on a defined lane, they are willing to negotiate contract rates that sit 10 to 15 percent below their spot PTL rates.
      </p>
      <p>
        Contract PTL arrangements typically run on three-month, six-month, or annual terms. The carrier commits to capacity availability and a locked rate. The shipper commits to a minimum weekly volume. This structure benefits both parties: the carrier fills their trailers more efficiently, and the shipper removes rate volatility from their freight budget.
      </p>
      <p>
        Spot PTL, meaning one-off loads without a volume commitment, is available but prices vary more with market conditions. During peak shipping seasons like Q4 or produce season in the Southeast, spot PTL rates can run 20 to 35 percent above contract rates. Shippers who rely exclusively on spot PTL face meaningful budget variance in high-demand periods.
      </p>
      <p>
        DeMar Transportation works with shippers to identify which recurring lanes are best candidates for PTL contract pricing and which loads should remain on spot market. The analysis is straightforward: volume, consistency, and lane alignment drive the decision more than freight class or commodity type.
      </p>

      <h2>Getting a PTL Quote</h2>
      <p>
        To get an accurate PTL quote, you need four pieces of information ready before contacting a carrier: total weight, total pallet count and dimensions, freight class if known, and origin and destination zip codes. Transit time requirements and any accessorial needs like liftgate or inside delivery should also be specified upfront.
      </p>
      <p>
        Most carriers respond to PTL quote requests within two to four hours for standard lanes and within 24 hours for thinner markets. If a carrier takes longer than 24 hours to quote, it often signals that they do not have active PTL capacity moving in your lane direction, which means their rate will likely be higher than carriers who do.
      </p>
      <p>
        Comparing PTL quotes requires attention to what is and is not included in the base rate. Fuel surcharges, pallet fees, and accessorial charges that one carrier includes in their all-in rate may appear as line-item additions on another carrier's quote. Always compare total landed cost, not just the base freight rate, to make an accurate mode and carrier decision.
      </p>
    </>
  );

  return (
    <BlogPost
      title="Partial Truckload (PTL) Shipping: Cost Optimization Between LTL & FTL"
      subtitle="Shipping Guides"
      description="Discover how partial truckload shipping fills the gap between LTL and FTL, offering better rates for medium-sized loads without paying for a full truck."
      metaTitle="PTL Shipping Guide: Save on Freight Costs"
      metaDescription="Learn how partial truckload (PTL) shipping can save you 20-40% vs LTL. Understand PTL rates, capacity, and when to use it for your freight."
      heroImage="/images/blog/freight-quote-hero.jpg"
      heroImageAlt="Partial truckload freight being loaded onto a trailer at a warehouse dock"
      slug="partial-truckload-ptl-shipping"
      publishDate="2026-03-30"
      readTime="7 min"
      content={content}
      faqs={faqs}
      relatedLinks={relatedLinks}
    />
  );
};

export default PartialTruckloadPtlShipping;