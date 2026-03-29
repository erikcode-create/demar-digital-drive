import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Shield,
  Truck,
  Phone,
  MapPin,
  CheckCircle,
  Target,
  Users,
  Clock,
  Award,
  Globe,
} from "lucide-react";

const AboutPage = () => {
  useEffect(() => {
    document.title =
      "About DeMar Transportation | US Freight Carrier Based in Reno, NV";
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
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20 px-4">
            <div className="container mx-auto max-w-5xl text-center">
              <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 text-sm">
                US-Based Freight Carrier
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                DeMar Transportation
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
                Your freight partner for reliable, safe, and competitively priced
                shipping across the United States.
              </p>
            </div>
          </section>

          {/* Company Overview */}
          <section className="py-16 px-4 bg-background">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Who We Are
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="text-lg leading-relaxed mb-6">
                  DeMar Transportation is a United States-based freight carrier
                  headquartered in Reno, Nevada. We provide comprehensive
                  trucking and logistics services to shippers, manufacturers,
                  distributors, and businesses of all sizes nationwide. From
                  full truckload dry van shipments to temperature-controlled
                  refrigerated freight, flatbed hauling, box truck deliveries,
                  sprinter van expedited service, and hazmat-certified loads, we
                  handle every type of freight with the same commitment to
                  excellence.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  As an asset-based carrier with full-service logistics
                  capabilities, DeMar Transportation handles your freight with
                  a single point of contact from pickup to delivery. Whether
                  we move your load on our own equipment or through our vetted
                  carrier network, you get the same level of accountability,
                  transparent pricing, and clear communication on every
                  shipment.
                </p>
                <p className="text-lg leading-relaxed">
                  Our team understands that freight is the backbone of American
                  commerce. Whether you need a single shipment moved across
                  town or recurring lanes serviced coast to coast, DeMar
                  Transportation delivers the capacity, reliability, and
                  professionalism your supply chain demands.
                </p>
              </div>
            </div>
          </section>

          {/* Mission and Values */}
          <section className="py-16 px-4 bg-muted/50">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold mb-4 text-center">
                Our Mission and Values
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Every decision we make is guided by four core principles that
                define who we are and how we operate.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Safety First
                        </h3>
                        <p className="text-muted-foreground">
                          Safety is not negotiable. From rigorous pre-trip
                          inspections to ongoing driver training and full DOT
                          compliance, we maintain the highest safety standards
                          in the industry. Every driver, every truck, every
                          load is held to the same uncompromising standard.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Clear Communication
                        </h3>
                        <p className="text-muted-foreground">
                          All of our drivers are English-speaking professionals
                          who communicate clearly with shippers, receivers, and
                          dispatch. You will never struggle to get a status
                          update, coordinate a delivery window, or resolve a
                          concern. Transparency drives trust.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Target className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Competitive Pricing
                        </h3>
                        <p className="text-muted-foreground">
                          With our own fleet and established carrier network, we
                          keep rates competitive by eliminating unnecessary
                          overhead. You get transparent pricing without
                          sacrificing service quality, tracking visibility, or
                          reliability.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Reliability
                        </h3>
                        <p className="text-muted-foreground">
                          When we commit to a pickup time and delivery window,
                          we honor it. Our dispatch team operates around the
                          clock to monitor loads, proactively address delays,
                          and keep your freight moving on schedule. Consistent
                          on-time performance is what sets us apart.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* What Makes DeMar Different */}
          <section className="py-16 px-4 bg-background">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold mb-12 text-center">
                What Makes DeMar Different
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Truck,
                    title: "Asset-Based Carrier",
                    desc: "Our own fleet combined with a vetted carrier network means reliable capacity and competitive rates.",
                  },
                  {
                    icon: Users,
                    title: "English-Speaking Drivers",
                    desc: "Clear, professional communication at every pickup and delivery point across the country.",
                  },
                  {
                    icon: Clock,
                    title: "24/7 Availability",
                    desc: "Our dispatch team is available around the clock. Freight does not wait for business hours, and neither do we.",
                  },
                  {
                    icon: Award,
                    title: "DOT Compliant",
                    desc: "Full compliance with all Department of Transportation regulations, inspections, and safety requirements.",
                  },
                ].map((item) => (
                  <Card key={item.title} className="text-center">
                    <CardContent className="pt-6">
                      <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <item.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Service Area */}
          <section className="py-16 px-4 bg-muted/50">
            <div className="container mx-auto max-w-5xl">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-bold">Nationwide Coverage</h2>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">
                    DeMar Transportation serves all 48 contiguous states with
                    reliable freight shipping solutions. Whether your shipment
                    originates on the West Coast, moves through the Midwest, or
                    delivers to the Eastern Seaboard, our network and fleet
                    capacity ensure coverage wherever your freight needs to go.
                  </p>
                  <p className="text-lg text-muted-foreground mb-6">
                    From our Reno, Nevada headquarters, we coordinate pickups
                    and deliveries across major freight corridors, metropolitan
                    distribution hubs, and rural delivery points. Our regional
                    and over-the-road drivers maintain consistent service
                    quality regardless of distance or destination.
                  </p>
                  <Link to="/#services">
                    <Button variant="outline">
                      View Our Services
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Fleet Information */}
          <section className="py-16 px-4 bg-background">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold mb-4 text-center">
                Our Fleet
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                We maintain a diverse, well-equipped fleet to handle any freight
                requirement, from standard palletized goods to
                temperature-sensitive cargo and oversized equipment.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: "Dry Vans",
                    desc: "Standard enclosed trailers for palletized freight, boxed goods, and general merchandise requiring weather protection.",
                  },
                  {
                    name: "Reefers",
                    desc: "Temperature-controlled refrigerated trailers for perishable goods, pharmaceuticals, and temperature-sensitive shipments.",
                  },
                  {
                    name: "Flatbeds",
                    desc: "Open-deck trailers for construction materials, machinery, steel, lumber, and oversized loads requiring crane or forklift loading.",
                  },
                  {
                    name: "Box Trucks",
                    desc: "Medium-duty straight trucks ideal for local and regional deliveries, last-mile distribution, and smaller commercial shipments.",
                  },
                  {
                    name: "Sprinter Vans",
                    desc: "Expedited delivery vehicles for time-critical, smaller shipments that need fast, dedicated service with minimal transit time.",
                  },
                  {
                    name: "Hazmat-Certified Equipment",
                    desc: "Specially equipped and permitted vehicles with hazmat-endorsed drivers for hazardous materials transport in full regulatory compliance.",
                  },
                ].map((vehicle) => (
                  <Card key={vehicle.name}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-1">{vehicle.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.desc}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Safety Commitment */}
          <section className="py-16 px-4 bg-muted/50">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Our Commitment to Safety
              </h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-lg text-muted-foreground mb-6">
                  At DeMar Transportation, safety is embedded in every aspect
                  of our operations. We understand that your freight represents
                  your livelihood, and our drivers share the road with families
                  and communities every day. That dual responsibility drives
                  our unwavering commitment to safe practices.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[
                    "Full DOT compliance on every vehicle and driver",
                    "Comprehensive driver training and ongoing education",
                    "Rigorous preventive equipment maintenance schedules",
                    "Mandatory pre-trip and post-trip vehicle inspections",
                    "Electronic logging devices (ELD) on all trucks",
                    "Drug and alcohol testing program compliance",
                    "Hours of service monitoring and enforcement",
                    "Accident prevention and defensive driving programs",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
                <p className="text-lg text-muted-foreground">
                  These are not aspirational goals. They are daily operational
                  requirements enforced across our entire fleet. When you ship
                  with DeMar, you ship with confidence that your cargo is in
                  safe, professional hands.
                </p>
              </div>
            </div>
          </section>

          {/* Headquarters */}
          <section className="py-16 px-4 bg-background">
            <div className="container mx-auto max-w-5xl">
              <Card className="overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="bg-primary/10 p-6 rounded-full">
                      <MapPin className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">
                        Reno, Nevada Headquarters
                      </h2>
                      <p className="text-lg text-muted-foreground mb-4">
                        Our headquarters is strategically located in Reno,
                        Nevada, positioning us at the crossroads of major
                        West Coast freight corridors. Reno's central location
                        provides efficient access to California, the Pacific
                        Northwest, the Mountain West, and all points east,
                        making it an ideal base for nationwide freight
                        operations.
                      </p>
                      <p className="text-muted-foreground font-medium">
                        10471 Double R Blvd, Reno, NV 89521
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <div className="container mx-auto max-w-5xl text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Ship with DeMar?
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Get competitive rates with transparent pricing. Contact us
                today for a free quote or call us directly to discuss your
                freight needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/quote">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-lg px-8"
                  >
                    Get a Free Quote
                  </Button>
                </Link>
                <a href="tel:+17752304767">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 border-white text-white hover:bg-white/10"
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
    </div>
  );
};

export default AboutPage;
