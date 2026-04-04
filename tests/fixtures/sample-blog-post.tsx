import BlogPost from "@/components/BlogPost";
import { Link } from "react-router-dom";

const SampleFreightShippingGuide = () => {
  return (
    <BlogPost
      title="Freight Shipping Basics: A Complete Guide for First-Time Shippers"
      subtitle="Freight Guide"
      description="Learn the fundamentals of freight shipping, from choosing the right service level to preparing your first shipment. Covers LTL, FTL, freight classes, and how to get a quote."
      metaTitle="Freight Shipping Basics: Complete Guide for First-Time Shippers | DeMar Transportation"
      metaDescription="Everything you need to know about freight shipping. Understand LTL vs FTL, freight classes, pallet prep, and how to get competitive rates. Free quotes from DeMar Transportation."
      slug="freight-shipping-basics-guide"
      publishDate="2026-01-15"
      readTime="7 min"
      heroImage="/images/blog/truck-fleet.jpg"
      heroImageAlt="Fleet of freight trucks ready for shipping"
      content={
        <>
          <p className="mb-6">
            Freight shipping is the backbone of commerce in the United States. Every day,
            millions of pounds of goods move from manufacturers to distributors, retailers,
            and end consumers via a vast network of carriers, terminals, and logistics
            providers. If your business ships more than 150 pounds at a time, understanding
            freight shipping is not optional — it is essential to keeping your costs under
            control and your customers satisfied.
          </p>

          <p className="mb-6">
            This guide covers everything a first-time shipper needs to know: the difference
            between LTL and FTL, how freight classes work, what to expect when you book
            your first shipment, and how to avoid the most common and costly mistakes. By
            the end, you will have a clear picture of how freight shipping works and which
            options make sense for your business.
          </p>

          <h2>What Is Freight Shipping?</h2>

          <p className="mb-6">
            Freight shipping refers to the commercial transportation of goods in bulk, typically
            on pallets or in crates, via truck, rail, air, or ocean. In the context of domestic
            over-the-road shipping — which is what most businesses mean when they say freight —
            it means moving goods via semi-truck between a pickup location and a delivery
            destination.
          </p>

          <p className="mb-6">
            The dividing line between parcel shipping and freight shipping is weight. Once your
            shipment exceeds 150 pounds, or fills more than a few cubic feet, freight shipping
            almost always costs less than parcel service. Parcel carriers like UPS and FedEx
            impose steep surcharges on oversized and overweight packages. Freight carriers, by
            contrast, are built for large, heavy loads and price accordingly.
          </p>

          <p className="mb-6">
            At DeMar Transportation, we handle freight shipments of all sizes, from a single
            pallet to a full 53-foot trailer. Whether you are shipping consumer goods, industrial
            equipment, food products, or raw materials, the freight shipping process follows the
            same fundamental steps.
          </p>

          <h2>LTL vs FTL: The Most Important Decision</h2>

          <p className="mb-6">
            Before you book your first freight shipment, you need to understand the difference
            between less-than-truckload (LTL) and full truckload (FTL) shipping. Choosing the
            wrong service level is the single most common and expensive mistake that new shippers
            make.
          </p>

          <p className="mb-6">
            LTL shipping means your freight shares trailer space with shipments from other
            businesses. You pay only for the space and weight your cargo occupies. LTL is ideal
            for shipments weighing between 150 and 10,000 pounds — roughly one to ten standard
            pallets. Average LTL rates run $2.00 to $4.50 per mile for shipments under 5,000
            pounds. Transit times range from two to seven business days, depending on distance
            and the number of terminal transfers your freight passes through.
          </p>

          <p className="mb-6">
            FTL shipping gives you an entire trailer dedicated to your freight. You pay a flat
            rate for the truck regardless of how full it is. FTL makes sense when your shipment
            exceeds 10,000 pounds, fills more than half a trailer, or requires direct point-to-point
            service with no terminal handling. The breakeven between LTL and FTL typically falls
            around 8,000 to 12,000 pounds. Above that threshold, FTL is almost always cheaper on
            a per-pound basis.
          </p>

          <p className="mb-8">
            Not sure which service level you need?{" "}
            <Link to="/contact">Contact our freight specialists</Link> for a free consultation,
            or go ahead and{" "}
            <Link to="/quote">request a quote</Link> and we will recommend the right option
            for your shipment.
          </p>

          <h2>Understanding Freight Classes</h2>

          <p className="mb-6">
            Freight class is a standardized pricing category used by LTL carriers to determine
            how much to charge for a shipment. The National Motor Freight Traffic Association
            (NMFTA) assigns every type of commodity a class number from 50 to 500. Lower class
            numbers mean lower shipping rates. Higher classes mean higher rates.
          </p>

          <p className="mb-6">
            Class is determined by four factors: density (weight per cubic foot), stowability
            (how easily the item fits with other freight), handling (how difficult it is to
            load and unload), and liability (value per pound and susceptibility to damage or
            theft). A dense, easy-to-handle item like steel rods might be Class 50. A lightweight,
            fragile item like assembled furniture might be Class 125 or higher.
          </p>

          <p className="mb-6">
            Many first-time shippers get reclassified after the carrier inspects their freight,
            resulting in unexpected charges. Always verify your freight class before booking.
            When in doubt, call your carrier and describe the item in detail. The five minutes
            you spend confirming your class can save you 30 to 50 percent on your invoice.
          </p>

          <h2>Preparing Your First Freight Shipment</h2>

          <p className="mb-6">
            Good preparation is the difference between a smooth delivery and a damaged, delayed,
            or re-billed shipment. Follow these steps every time.
          </p>

          <p className="mb-6">
            Start by weighing and measuring your shipment. Get exact dimensions (length, width,
            height) in inches and the total weight in pounds, including the pallet. Round up to
            the nearest inch and pound. Carriers re-weigh shipments at their terminals. If your
            declared weight is off by 10 percent or more, you will receive a reweigh charge that
            can increase your invoice by 25 to 50 percent.
          </p>

          <p className="mb-6">
            Next, palletize properly. Use a standard 48x40 heat-treated pallet. Stack your
            freight evenly, keeping the weight centered. Apply at least three full rotations of
            shrink wrap around the load and the pallet deck boards. Label the shipment on at
            least two sides with origin, destination, and contents.
          </p>

          <p className="mb-6">
            Complete your bill of lading (BOL) accurately. The BOL is the legal contract between
            you and the carrier. It must include the shipper name and address, consignee name
            and address, item descriptions, freight class, weight, and any special handling
            instructions or declared accessorials. Missing or incorrect BOL information causes
            delays and billing disputes.
          </p>

          <p className="mb-8">
            Finally, declare any accessorial services you need upfront. Liftgate delivery, inside
            delivery, residential delivery, limited access locations, and appointment scheduling
            all carry additional fees. Declaring them at booking ensures you are quoted accurately.
            Discovering you need a liftgate at delivery and not having it on the BOL will result
            in an additional charge — typically $75 to $175 — billed after the fact.
          </p>

          <h2>Getting a Freight Quote</h2>

          <p className="mb-6">
            To get an accurate freight quote, you need five pieces of information: origin zip
            code, destination zip code, total weight, freight class, and any required accessorial
            services. Having these ready before you call or submit an online quote form will save
            you time and ensure the quote you receive reflects your actual shipment.
          </p>

          <p className="mb-6">
            Get quotes from at least two carriers before booking. Rates vary significantly
            between carriers on the same lane, especially for LTL shipments. A 20 percent
            difference between carriers is not unusual.
          </p>

          <p>
            Ready to get started?{" "}
            <Link to="/quote">Request a free freight quote</Link> from DeMar Transportation.
            We serve businesses across the Western United States with no minimum shipment
            requirements. Call us at (775) 230-4767 or submit your request online. Our
            team responds within one business hour during office hours.
          </p>
        </>
      }
      faqs={[
        {
          question: "What is the minimum weight for freight shipping?",
          answer:
            "Most LTL carriers accept shipments starting at 150 pounds or one pallet. Some carriers impose minimum revenue charges of $75 to $150 per shipment, which effectively sets a weight floor below which parcel shipping is more economical. At DeMar Transportation, we have no minimum shipment requirements and quote fairly regardless of shipment size.",
        },
        {
          question: "How do I determine my freight class?",
          answer:
            "Freight class is determined by density, stowability, handling difficulty, and liability. The easiest way to find your class is to look up your commodity in the NMFTA classification directory or ask your carrier. Provide the item description, weight, and dimensions (to calculate density) and your carrier will confirm the correct class. Incorrect classification is one of the most common causes of unexpected invoice adjustments.",
        },
        {
          question: "How long does freight shipping take?",
          answer:
            "LTL transit times range from two to seven business days depending on distance and the number of terminal transfers. FTL shipments move faster because there are no terminal stops — direct point-to-point service typically delivers in one to five days. Expedited freight options are available when you need faster delivery. Call (775) 230-4767 to discuss time-sensitive shipments.",
        },
        {
          question: "What is a bill of lading and why does it matter?",
          answer:
            "A bill of lading (BOL) is the legal contract between the shipper and the carrier that authorizes the transportation of your freight. It describes the shipment (contents, weight, class, dimensions), identifies the shipper and consignee, and lists any special instructions. An accurate BOL protects you in the event of a claim and prevents billing disputes. Always review your BOL carefully before the driver leaves.",
        },
      ]}
      relatedLinks={[
        { label: "LTL Shipping Services", to: "/services/ltl" },
        { label: "FTL Shipping Services", to: "/services/ftl" },
        { label: "Request a Free Freight Quote", to: "/quote" },
        { label: "Contact Our Freight Team", to: "/contact" },
      ]}
    />
  );
};

export default SampleFreightShippingGuide;
