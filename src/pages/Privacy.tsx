import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  useEffect(() => {
    document.title = "Privacy Policy | DeMar Transportation";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'DeMar Transportation privacy policy. Learn how we collect, use, and protect your information when using our services and driver app.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(var(--surface))]">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-16 pt-32">
        <h1 className="text-3xl font-bold text-[hsl(var(--primary))] mb-2">Privacy Policy</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-8">Last updated: March 28, 2026</p>

        <article className="prose prose-lg max-w-none prose-headings:text-[hsl(var(--primary))] prose-p:text-[hsl(var(--muted-foreground))] prose-li:text-[hsl(var(--muted-foreground))] prose-a:text-[hsl(var(--accent))] prose-a:no-underline hover:prose-a:underline">
          <section>
            <h2 className="text-xl font-semibold">Introduction</h2>
            <p>
              DeMar Transportation ("we," "our," or "us") operates the DeMar Logistics mobile
              application. This Privacy Policy explains how we collect, use, and protect information
              when you use our app.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Information We Collect</h2>
            <p>
              Our app is designed for authorized drivers working with DeMar Transportation. We may
              collect the following information:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Account credentials (email and password) for authentication</li>
              <li>Location data while the app is in use, for shipment tracking and geofencing</li>
              <li>Device information such as push notification tokens for delivery alerts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">How We Use Your Information</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>To authenticate drivers and provide access to assigned loads</li>
              <li>To track shipment progress and provide real-time location updates</li>
              <li>To send push notifications about load assignments and geofence events</li>
              <li>To improve app performance and reliability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Data Sharing</h2>
            <p>
              We do not sell or share your personal information with third parties for marketing
              purposes. Location data is shared only with authorized dispatchers and shippers as
              part of the freight tracking service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Data Storage and Security</h2>
            <p>
              Your data is stored securely using industry-standard encryption. We use Supabase for
              data storage with row-level security policies. Location data is retained only for the
              duration of active shipments.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal data at any
              time by contacting us. Drivers may also request that location tracking data be removed
              after a shipment is completed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              DeMar Transportation<br />
              Email: <a href="mailto:info@DeMarTransportation.com" className="text-[hsl(var(--accent))]">info@DeMarTransportation.com</a><br />
              Website: <a href="https://demartransportation.com" className="text-[hsl(var(--accent))]">demartransportation.com</a>
            </p>
          </section>
        </article>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
