import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Support = () => {
  useEffect(() => {
    document.title = "Support | DeMar Logistics App Help | DeMar Transportation";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get help with the DeMar Logistics driver app. Contact our support team for assistance with load management, tracking, notifications, or account access.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-16 pt-32">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Support</h1>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">DeMar Logistics App Support</h2>
            <p>
              Need help with the DeMar Logistics driver app? We're here to assist you with any
              issues related to load management, tracking, notifications, or account access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact Us</h2>
            <p>For support inquiries, please reach out to us:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>
                Email:{" "}
                <a href="mailto:info@DeMarTransportation.com" className="text-blue-600 hover:underline">
                  info@DeMarTransportation.com
                </a>
              </li>
              <li>
                Phone:{" "}
                <a href="tel:+18663812617" className="text-blue-600 hover:underline">
                  (866) 381-2617
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Common Issues</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Login Problems</h3>
                <p className="text-sm">
                  If you cannot log in, verify your credentials with your dispatcher. Password
                  resets can be requested through the app's login screen.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Location Tracking</h3>
                <p className="text-sm">
                  Ensure location permissions are enabled for the app in your device settings.
                  The app requires "Always" or "While Using" location access for accurate tracking.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Push Notifications</h3>
                <p className="text-sm">
                  Make sure notifications are enabled in your device settings. If you're not
                  receiving load alerts, try logging out and back in to refresh your push token.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Support;
