import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Support = () => {
  useEffect(() => {
    document.title = "Freight Shipment Tracking Support | DeMar Transportation";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Track freight shipments, file claims, report issues, and get billing support from DeMar Transportation. Contact our team by phone or email for prompt assistance.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(var(--surface))]">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-16 pt-32">
        <h1 className="text-3xl font-bold text-[hsl(var(--primary))] mb-8">Freight Shipment Tracking Support</h1>

        <article className="prose prose-lg max-w-none prose-headings:text-[hsl(var(--primary))] prose-p:text-[hsl(var(--muted-foreground))] prose-li:text-[hsl(var(--muted-foreground))] prose-a:text-[hsl(var(--accent))] prose-a:no-underline hover:prose-a:underline">
          <section>
            <h2 className="text-xl font-semibold">Contact Our Support Team</h2>
            <p>
              DeMar Transportation provides direct support for shipment tracking, freight claims,
              billing questions, and service issues. Reach us through any of these channels:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>
                Email:{" "}
                <a href="mailto:info@DeMarTransportation.com" className="text-[hsl(var(--accent))]">
                  info@DeMarTransportation.com
                </a>
              </li>
              <li>
                Phone:{" "}
                <a href="tel:+17752304767" className="text-[hsl(var(--accent))]">
                  (775) 230-4767
                </a>
              </li>
              <li>
                Office: 10471 Double R Blvd, Reno, NV 89521
              </li>
            </ul>
            <p className="mt-3 text-sm">
              Our team is available Monday through Friday, 7:00 AM to 6:00 PM PST.
              Dispatch is available 24/7 for urgent shipment issues. Every request
              is logged and tracked to resolution.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Shipment Tracking</h2>
            <p>
              Contact our dispatch team for real-time shipment updates. You can
              request a status update at any point by calling or emailing with your
              BOL number or PO number.
            </p>
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-medium">What You Can Track</h3>
                <ul className="list-disc ml-6 mt-1 text-sm space-y-1">
                  <li>Current shipment status and estimated time of arrival (ETA)</li>
                  <li>Pickup confirmation with timestamp and driver information</li>
                  <li>Delivery confirmation with proof of delivery (POD) documentation</li>
                  <li>Detention time and delay notifications</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium">How to Get an Update</h3>
                <p className="text-sm">
                  Call or email our dispatch team with your BOL number or
                  PO number. We provide updates on shipment status, ETA, and any known delays.
                  If a shipment is delayed, our team notifies you as soon as we are aware of
                  the issue.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Freight Claims</h2>
            <p>
              If cargo is damaged, lost, or short-delivered, DeMar Transportation handles claims
              directly. Contact us to discuss coverage and claims.
            </p>
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-medium">How to File a Freight Claim</h3>
                <ol className="list-decimal ml-6 mt-1 text-sm space-y-1">
                  <li>Note the damage or shortage on the delivery receipt at the time of delivery</li>
                  <li>Take photos of the damaged freight and packaging before moving the cargo</li>
                  <li>
                    Email{" "}
                    <a href="mailto:info@DeMarTransportation.com" className="text-[hsl(var(--accent))]">
                      info@DeMarTransportation.com
                    </a>
                    {" "}with your BOL number, photos, and a description of the damage
                  </li>
                  <li>Include the original invoice value of the affected goods</li>
                  <li>Submit the claim as soon as possible after the delivery date</li>
                </ol>
              </div>
              <div>
                <h3 className="font-medium">What to Expect</h3>
                <p className="text-sm">
                  Once we receive your claim, our team acknowledges receipt and begins
                  investigating the issue. We keep you updated on the status of your claim
                  throughout the process and work toward timely resolution.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Billing Support</h2>
            <p>
              Our billing team handles invoice questions, rate confirmations, and payment issues.
              Contact us with your company name, invoice number or BOL number, and a description
              of the issue so we can resolve your request quickly.
            </p>
            <div className="mt-4">
              <h3 className="font-medium">Common Billing Requests</h3>
              <ul className="list-disc ml-6 mt-1 text-sm space-y-1">
                <li>Invoice copies or corrections</li>
                <li>Rate confirmation questions</li>
                <li>Accessorial charge details (detention, layover, lumper fees)</li>
                <li>Payment status or remittance confirmation</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Report a Service Issue</h2>
            <p>
              If a shipment did not meet expectations, we want to know. DeMar Transportation
              tracks every reported issue to identify patterns and prevent repeat problems.
            </p>
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-medium">What to Report</h3>
                <ul className="list-disc ml-6 mt-1 text-sm space-y-1">
                  <li>Late pickups or deliveries</li>
                  <li>Driver conduct or communication concerns</li>
                  <li>Equipment problems (trailer condition, temperature issues for reefer loads)</li>
                  <li>Documentation errors on BOL or proof of delivery</li>
                  <li>Missed appointment windows</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium">What Happens Next</h3>
                <p className="text-sm">
                  Our dispatch team reviews every service report and follows up with you
                  directly. You receive an explanation of what happened and what steps we are
                  taking to address it. If an issue is not resolved to your satisfaction,
                  you can request escalation to management.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold">DeMar Logistics App Support</h2>
            <p>
              Need help with the DeMar Logistics driver app? We assist with issues related to
              load management, tracking, notifications, and account access.
            </p>
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-medium">Login Problems</h3>
                <p className="text-sm">
                  If you cannot log in, verify your credentials with your dispatcher. Password
                  resets can be requested through the app's login screen.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Location Tracking</h3>
                <p className="text-sm">
                  Ensure location permissions are enabled for the app in your device settings.
                  The app requires "Always" or "While Using" location access for accurate tracking.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm">
                  Make sure notifications are enabled in your device settings. If you are not
                  receiving load alerts, try logging out and back in to refresh your push token.
                </p>
              </div>
            </div>
          </section>
        </article>
      </div>
      <Footer />
    </div>
  );
};

export default Support;