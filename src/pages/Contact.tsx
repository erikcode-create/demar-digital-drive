import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
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
  ArrowRight,
} from "lucide-react";

const departments = [
  {
    icon: MessageSquare,
    title: "General Inquiries",
    description: "Have a question about our services? Our team is ready to help with any freight or logistics inquiry.",
    action: "Email Us",
    href: "mailto:info@DeMarTransportation.com",
    external: true,
  },
  {
    icon: FileText,
    title: "Get a Quote",
    description: "Need a freight quote? Submit your shipment details and receive a competitive rate quickly.",
    action: "Request a Quote",
    href: "/quote",
    external: false,
  },
  {
    icon: Users,
    title: "Driver Recruitment",
    description: "Interested in driving for DeMar Transportation? We offer competitive pay and consistent freight.",
    action: "View Careers",
    href: "/careers",
    external: false,
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description: "Need help with an existing shipment or billing question? Our support team is here for you.",
    action: "Call Support",
    href: "tel:+17752304767",
    external: true,
  },
];

const Contact = () => {
  useEffect(() => {
    document.title = "Contact DeMar Transportation | Reno, NV Freight & Logistics";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Contact DeMar Transportation for freight shipping quotes and logistics support. Call (775) 230-4767, email info@DeMarTransportation.com, or visit our Reno, NV office.');
    }
  }, []);

  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>
      <div>
        <Header />
        <main id="main-content">
          {/* Hero */}
          <section className="pt-32 pb-20 px-4 bg-[hsl(225_97%_4%)] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }} />
            <div className="container mx-auto max-w-5xl relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/5 backdrop-blur-sm">
                <Phone className="h-4 w-4 text-[hsl(var(--accent))]" />
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
                  Get In Touch
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                Contact
                <br />
                <span className="text-white/40">DeMar Transportation</span>
              </h1>
              <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
                We're available 24/7 to help with your shipping needs. Reach out by phone, email, or visit our Reno office.
              </p>
            </div>
          </section>

          {/* Primary Contact Methods */}
          <section className="py-20 bg-[hsl(var(--surface))]">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="p-8 rounded-xl bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)] transition-all duration-300 text-center">
                  <Phone className="h-7 w-7 text-[hsl(var(--accent))] mx-auto mb-4" />
                  <h2 className="text-base font-semibold text-[hsl(var(--primary))] mb-2">Call Us</h2>
                  <a
                    href="tel:+17752304767"
                    className="text-lg font-bold text-[hsl(var(--primary))] hover:text-[hsl(var(--accent))] transition-colors"
                  >
                    (775) 230-4767
                  </a>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">24/7 dispatch available</p>
                </div>

                <div className="p-8 rounded-xl bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)] transition-all duration-300 text-center">
                  <Mail className="h-7 w-7 text-[hsl(var(--accent))] mx-auto mb-4" />
                  <h2 className="text-base font-semibold text-[hsl(var(--primary))] mb-2">Email Us</h2>
                  <a
                    href="mailto:info@DeMarTransportation.com"
                    className="text-sm font-bold text-[hsl(var(--primary))] hover:text-[hsl(var(--accent))] transition-colors"
                  >
                    info@DeMarTransportation.com
                  </a>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">We respond within 1 business hour</p>
                </div>

                <div className="p-8 rounded-xl bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)] transition-all duration-300 text-center">
                  <MapPin className="h-7 w-7 text-[hsl(var(--accent))] mx-auto mb-4" />
                  <h2 className="text-base font-semibold text-[hsl(var(--primary))] mb-2">Visit Us</h2>
                  <p className="text-sm font-bold text-[hsl(var(--primary))]">
                    10471 Double R Blvd<br />Reno, NV 89521
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">South Reno office location</p>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[hsl(var(--surface-low))]">
                  <Clock className="h-4 w-4 text-[hsl(var(--accent))]" />
                  <span className="text-sm font-medium text-[hsl(var(--primary))]">24/7 Dispatch Available</span>
                </div>
              </div>
            </div>
          </section>

          {/* Department Cards */}
          <section className="py-20 bg-[hsl(var(--surface-low))]">
            <div className="container mx-auto px-4">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] text-center mb-4">
                Departments
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight text-center mb-4">
                How Can We Help?
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] text-center mb-12 max-w-2xl mx-auto leading-relaxed">
                Choose the department that best fits your needs.
              </p>

              <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {departments.map((dept) => (
                  <div key={dept.title} className="p-6 rounded-xl bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)] transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-lg bg-[hsl(var(--surface-low))]">
                        <dept.icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-2">{dept.title}</h3>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4 leading-relaxed">{dept.description}</p>
                        {dept.external ? (
                          <a href={dept.href}>
                            <Button variant="outline" size="sm" className="border-[hsl(var(--primary))] text-[hsl(var(--primary))]">
                              {dept.action}
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </a>
                        ) : (
                          <Button variant="outline" size="sm" className="border-[hsl(var(--primary))] text-[hsl(var(--primary))]" asChild>
                            <Link to={dept.href}>
                              {dept.action}
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Location & Map */}
          <section className="py-20 bg-[hsl(var(--surface))]">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                      Location
                    </p>
                    <h2 className="text-3xl font-bold text-[hsl(var(--primary))] tracking-tight mb-2">
                      Reno, Nevada
                    </h2>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-8">
                      Strategically located along the I-80 corridor
                    </p>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <MapPin className="h-5 w-5 text-[hsl(var(--accent))] mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-semibold text-[hsl(var(--primary))] mb-1">Office Address</h3>
                          <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            10471 Double R Blvd<br />Reno, NV 89521
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Navigation className="h-5 w-5 text-[hsl(var(--accent))] mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-semibold text-[hsl(var(--primary))] mb-1">Strategic Location</h3>
                          <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                            Our headquarters sits near the I-80 corridor, one of the most important east-west freight routes in the western US, providing direct access to major distribution hubs.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Clock className="h-5 w-5 text-[hsl(var(--accent))] mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-semibold text-[hsl(var(--primary))] mb-1">Hours of Operation</h3>
                          <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            Office: Mon-Fri, 7:00 AM - 6:00 PM PST<br />
                            Dispatch: 24/7 availability
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl overflow-hidden shadow-[var(--shadow-float)]">
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

          {/* CTA */}
          <section className="py-16 bg-[hsl(var(--accent))]">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
                Ready to Ship?
              </h2>
              <p className="text-base text-[hsl(var(--primary))]/70 mb-8 max-w-md mx-auto">
                Tell us about your freight needs. No obligation, no hassle.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]/90 font-semibold"
                  asChild
                >
                  <Link to="/quote" className="group">
                    Request a Quote
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10"
                  asChild
                >
                  <a href="tel:+17752304767">
                    <Phone className="mr-2 h-4 w-4" />
                    (775) 230-4767
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "DeMar Transportation",
            description: "Freight transportation and logistics services in Reno, Nevada.",
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
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "07:00",
                closes: "18:00",
              },
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                opens: "00:00",
                closes: "23:59",
                description: "24/7 Dispatch",
              },
            ],
            image: "https://demartransportation.com/og-image.png",
            priceRange: "$$",
          }),
        }}
      />
    </div>
  );
};

export default Contact;
