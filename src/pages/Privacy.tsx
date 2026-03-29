import { useEffect } from "react";

const Privacy = () => {
  useEffect(() => {
    document.title = "Privacy Policy | DeMar Transportation";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'DeMar Transportation privacy policy. Learn how we collect, use, and protect your information when using our services and driver app.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: March 28, 2026</p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Introduction</h2>
            <p>
              DeMar Transportation ("we," "our," or "us") operates the DeMar Logistics mobile
              application. This Privacy Policy explains how we collect, use, and protect information
              when you use our app.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Information We Collect</h2>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">How We Use Your Information</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>To authenticate drivers and provide access to assigned loads</li>
              <li>To track shipment progress and provide real-time location updates</li>
              <li>To send push notifications about load assignments and geofence events</li>
              <li>To improve app performance and reliability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Sharing</h2>
            <p>
              We do not sell or share your personal information with third parties for marketing
              purposes. Location data is shared only with authorized dispatchers and shippers as
              part of the freight tracking service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Storage and Security</h2>
            <p>
              Your data is stored securely using industry-standard encryption. We use Supabase for
              data storage with row-level security policies. Location data is retained only for the
              duration of active shipments.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal data at any
              time by contacting us. Drivers may also request that location tracking data be removed
              after a shipment is completed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              DeMar Transportation<br />
              Email: <a href="mailto:info@DeMarTransportation.com" className="text-blue-600 hover:underline">info@DeMarTransportation.com</a><br />
              Website: <a href="https://demartransportation.com" className="text-blue-600 hover:underline">demartransportation.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
