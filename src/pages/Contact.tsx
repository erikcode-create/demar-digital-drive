import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  FileText,
  Users,
  Headphones,
  Navigation,
} from "lucide-react";

const Contact = () => {
  useEffect(() => {
    document.title =
      "Contact DeMar Transportation | Reno, NV Freight & Logistics";
  }, []);

  const departments = [
    {
      icon: MessageSquare,
      title: "General Inquiries",
      description:
        "Have a question about our services? Our team is ready to help with any freight or logistics inquiry.",
      action: "Email Us",
      href: "mailto:info@DeMarTransportation.com",
      external: true,
    },
    {
      icon: FileText,
      title: "Get a Quote",
      description:
        "Need a freight quote? Submit your shipment details and receive a competitive rate quickly.",
      action: "Request a Quote",
      href: "/quote",
      external: false,
    },
    {
      icon: Users,
      title: "Driver Recruitment",
      description:
        "Interested in driving for DeMar Transportation? We offer competitive pay and consistent freight.",
      action: "View Careers",
      href: "/careers",
      external: false,
    },
    {
      icon: Headphones,
      title: "Customer Support",
      description:
        "Need help with an existing shipment or have a billing question? Our support team is here for you.",
      action: "Call Support",
      href: "tel:+17752304767",
      external: true,
    },
  ];

  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>
      <LandstarSidebar />
      <div className="md:ml-16">
        <Header />
        <main id="main-content">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Contact DeMar Transportation
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
                Get in touch with our freight and logistics team. We're
                available 24/7 to help with your shipping needs.
              </p>
            </div>
          </section>

          {/* Primary Contact Methods */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold mb-2">Call Us</h2>
                    <a
                      href="tel:+17752304767"
                      className="text-primary text-xl font-bold hover:underline"
                    >
                      (775) 230-4767
                    </a>
                    <p className="text-muted-foreground text-sm mt-2">
                      24/7 dispatch available
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold mb-2">Email Us</h2>
                    <a
                      href="mailto:info@DeMarTransportation.com"
                      className="text-primary font-bold hover:underline"
                    >
                      info@DeMarTransportation.com
                    </a>
                    <p className="text-muted-foreground text-sm mt-2">
                      We respond within 1 business hour
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold mb-2">Visit Us</h2>
                    <p className="font-bold">
                      10471 Double R Blvd
                      <br />
                      Reno, NV 89521
                    </p>
                    <p className="text-muted-foreground text-sm mt-2">
                      South Reno office location
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center mt-8">
                <Badge
                  variant="secondary"
                  className="text-base px-6 py-2 gap-2"
                >
                  <Clock className="h-4 w-4" />
                  24/7 Dispatch Available
                </Badge>
              </div>
            </div>
          </section>

          {/* Department Cards */}
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-4">
                How Can We Help?
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                Choose the department that best fits your needs and we'll
                connect you with the right team.
              </p>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {departments.map((dept) => (
                  <Card
                    key={dept.title}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                          <dept.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">
                            {dept.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4">
                            {dept.description}
                          </p>
                          {dept.external ? (
                            <a href={dept.href}>
                              <Button variant="outline" size="sm">
                                {dept.action}
                              </Button>
                            </a>
                          ) : (
                            <Link to={dept.href}>
                              <Button variant="outline" size="sm">
                                {dept.action}
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Location & Map Section */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Reno, Nevada</h2>
                    <p className="text-muted-foreground mb-6">
                      Strategically located along the I-80 corridor
                    </p>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                        <div>
                          <h3 className="font-semibold">Office Address</h3>
                          <p className="text-muted-foreground">
                            10471 Double R Blvd
                            <br />
                            Reno, NV 89521
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Navigation className="h-5 w-5 text-primary mt-1 shrink-0" />
                        <div>
                          <h3 className="font-semibold">
                            Strategic Location
                          </h3>
                          <p className="text-muted-foreground">
                            Our Reno headquarters sits in close proximity to the
                            I-80 corridor, one of the most important
                            east-west freight routes in the western United
                            States. This gives us direct access to major
                            distribution hubs across Nevada, California, and
                            beyond.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Clock className="h-5 w-5 text-primary mt-1 shrink-0" />
                        <div>
                          <h3 className="font-semibold">Hours of Operation</h3>
                          <p className="text-muted-foreground">
                            Office: Monday - Friday, 7:00 AM - 6:00 PM PST
                            <br />
                            Dispatch: 24/7 availability
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      title="DeMar Transportation office location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3079.5!2d-119.773!3d39.4631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDI3JzQ3LjIiTiAxMTnCsDQ2JzIyLjgiVw!5e0!3m2!1sen!2sus!4v1"
                      width="100%"
                      height="400"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Ship? Get a Free Quote Today.
              </h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Tell us about your freight needs and we'll provide a
                competitive rate. No obligation, no hassle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/quote">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-lg px-8"
                  >
                    Request a Quote
                  </Button>
                </Link>
                <a href="tel:+17752304767">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    (775) 230-4767
                  </Button>
                </a>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>

      {/* JSON-LD LocalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "DeMar Transportation",
            description:
              "Freight transportation and logistics services in Reno, Nevada. Dry van, reefer, flatbed, and hot shot delivery across the western United States.",
            url: "https://demartransportation.com",
            telephone: "+1-775-230-4767",
            email: "info@DeMarTransportation.com",
            address: {
              "@type": "PostalAddress",
              streetAddress: "10471 Double R Blvd",
              addressLocality: "Reno",
              addressRegion: "NV",
              postalCode: "89521",
              addressCountry: "US",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 39.4631,
              longitude: -119.773,
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ],
                opens: "07:00",
                closes: "18:00",
              },
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                opens: "00:00",
                closes: "23:59",
                description: "24/7 Dispatch",
              },
            ],
            image: "https://demartransportation.com/og-image.png",
            priceRange: "$$",
            areaServed: {
              "@type": "GeoCircle",
              geoMidpoint: {
                "@type": "GeoCoordinates",
                latitude: 39.4631,
                longitude: -119.773,
              },
              geoRadius: "500 mi",
            },
          }),
        }}
      />
    </div>
  );
};

export default Contact;
