import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LandstarSidebar from "@/components/LandstarSidebar";
import ApplyToDriveForm from "@/components/ApplyToDriveForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Truck,
  Phone,
  MapPin,
  CheckCircle,
  DollarSign,
  Shield,
  Heart,
  Clock,
  Fuel,
  Headphones,
  CreditCard,
  Monitor,
  Snowflake,
  AlertTriangle,
} from "lucide-react";

const Careers = () => {
  useEffect(() => {
    document.title =
      "CDL-A Truck Driving Jobs | Careers at DeMar Transportation | Reno, NV";
  }, []);

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
          <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20 px-4">
            <div className="container mx-auto max-w-5xl text-center">
              <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 text-sm">
                Now Hiring CDL-A Drivers
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Drive with DeMar Transportation
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
                Join a carrier that values its drivers. Competitive pay,
                consistent freight, modern equipment, and a team that treats
                you like a professional -- because you are one.
              </p>
              <a href="#apply">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8"
                >
                  Apply Now
                </Button>
              </a>
            </div>
          </section>

          {/* Why Drive for DeMar */}
          <section className="py-16 px-4 bg-background">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold mb-4 text-center">
                Why Drive for DeMar?
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                At DeMar Transportation, drivers are not a number on a
                spreadsheet. You are the backbone of our business, and we
                build our company around making sure you succeed on the road
                and at home.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <DollarSign className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Competitive Pay
                        </h3>
                        <p className="text-muted-foreground">
                          We offer industry-competitive per-mile rates that
                          reflect the skill, responsibility, and
                          professionalism our drivers bring to every load.
                          Your paycheck reflects the value you deliver, not
                          the bare minimum the market will tolerate. Weekly
                          settlements mean you are never waiting to get paid.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Truck className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Consistent Freight
                        </h3>
                        <p className="text-muted-foreground">
                          Our established shipper relationships and nationwide
                          service area mean steady loads and minimal deadhead
                          miles. We keep our drivers moving with freight that
                          makes sense for your route, your schedule, and your
                          earnings. No sitting around waiting for dispatch to
                          find your next load.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Heart className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Respect for Drivers
                        </h3>
                        <p className="text-muted-foreground">
                          We built DeMar Transportation on the principle that
                          drivers deserve to be treated as skilled
                          professionals. When you call dispatch, a real person
                          answers who knows your name and your situation. Your
                          feedback matters. Your home time matters. Your
                          career matters.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Modern Equipment
                        </h3>
                        <p className="text-muted-foreground">
                          Our fleet is well-maintained and regularly updated.
                          You will drive reliable, clean, professionally
                          equipped trucks with ELD systems, modern safety
                          features, and comfortable cabs. We invest in our
                          equipment because we invest in our drivers.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Current Openings */}
          <section className="py-16 px-4 bg-muted/50">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold mb-4 text-center">
                Current Openings
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                We are actively hiring experienced CDL-A drivers for multiple
                positions. Find the role that fits your experience and
                lifestyle, then apply below.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge>OTR</Badge>
                      <Badge variant="outline">Full-Time</Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      OTR CDL-A Driver
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Over-the-road positions hauling{" "}
                      <Link
                        to="/services/dry-van"
                        className="text-primary hover:underline"
                      >
                        dry van
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/services/refrigerated"
                        className="text-primary hover:underline"
                      >
                        reefer
                      </Link>{" "}
                      freight across the continental United States. Consistent
                      miles, competitive per-mile pay, and scheduled home time.
                      Ideal for experienced drivers who enjoy long-haul routes
                      and maximizing earnings.
                    </p>
                    <a href="#apply">
                      <Button variant="outline" size="sm">
                        Apply for This Position
                      </Button>
                    </a>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge>Regional</Badge>
                      <Badge variant="outline">Full-Time</Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Regional CDL-A Driver
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Regional routes with more predictable schedules and
                      regular home time. Service established lanes within
                      designated multi-state regions. A strong option for
                      drivers who want steady miles without extended time away
                      from home.
                    </p>
                    <a href="#apply">
                      <Button variant="outline" size="sm">
                        Apply for This Position
                      </Button>
                    </a>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge>Flatbed</Badge>
                      <Badge variant="outline">Full-Time</Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Flatbed CDL-A Driver
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Haul{" "}
                      <Link
                        to="/services/flatbed"
                        className="text-primary hover:underline"
                      >
                        flatbed freight
                      </Link>{" "}
                      including construction materials, steel, lumber, machinery,
                      and oversized loads. Requires experience with tarping,
                      chaining, strapping, and securement. Premium pay rates
                      reflect the specialized skill set required.
                    </p>
                    <a href="#apply">
                      <Button variant="outline" size="sm">
                        Apply for This Position
                      </Button>
                    </a>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge>Hazmat/Tanker</Badge>
                      <Badge variant="outline">Full-Time</Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Hazmat/Tanker CDL-A Driver
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Transport hazardous materials and tanker loads with full
                      regulatory compliance. Must hold current H, N, or X
                      endorsements. This specialized role commands top-tier
                      compensation and is suited for drivers with hazmat
                      experience and an impeccable safety record.
                    </p>
                    <a href="#apply">
                      <Button variant="outline" size="sm">
                        Apply for This Position
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Requirements */}
          <section className="py-16 px-4 bg-background">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Driver Requirements
              </h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-lg text-muted-foreground mb-6">
                  To drive for DeMar Transportation, candidates must meet the
                  following minimum qualifications. These standards ensure the
                  safety of our drivers, our customers' freight, and the
                  motoring public.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Valid Class A Commercial Driver's License (CDL-A)",
                    "Clean Motor Vehicle Record (MVR)",
                    "Minimum 1 year of verifiable OTR or regional driving experience",
                    "Pass current DOT physical examination",
                    "Pass pre-employment drug screening and random testing compliance",
                    "No DUI/DWI convictions in the past 5 years",
                    "Ability to pass a comprehensive background check",
                    "Must be at least 21 years of age",
                  ].map((req) => (
                    <div key={req} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">{req}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-6 italic">
                  Additional endorsements (Hazmat, Tanker, Doubles/Triples)
                  are preferred for specialized positions and may qualify for
                  premium pay rates.
                </p>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="py-16 px-4 bg-muted/50">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold mb-4 text-center">
                Driver Benefits
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                We believe that taking care of our drivers is not a perk -- it
                is a business requirement. When our drivers succeed, our
                customers succeed.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    icon: DollarSign,
                    title: "Competitive Per-Mile Pay",
                    desc: "Industry-leading rates that reward your experience and miles driven.",
                  },
                  {
                    icon: CreditCard,
                    title: "Weekly Settlements",
                    desc: "Get paid every week with reliable, on-time direct deposit. No waiting around.",
                  },
                  {
                    icon: Fuel,
                    title: "Fuel Cards",
                    desc: "Company fuel cards with access to nationwide fuel networks and discounted rates.",
                  },
                  {
                    icon: Monitor,
                    title: "ELD Equipped Trucks",
                    desc: "Modern electronic logging devices on every truck for compliant, hassle-free record keeping.",
                  },
                  {
                    icon: Headphones,
                    title: "24/7 Dispatch Support",
                    desc: "Live dispatch support available any time of day or night. You are never on your own out there.",
                  },
                  {
                    icon: Snowflake,
                    title: "Year-Round Freight",
                    desc: "Steady loads through every season. Our shipper relationships keep you moving all year.",
                  },
                ].map((benefit) => (
                  <Card key={benefit.title}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <benefit.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">
                            {benefit.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {benefit.desc}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Base of Operations */}
          <section className="py-16 px-4 bg-background">
            <div className="container mx-auto max-w-5xl">
              <Card>
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="bg-primary/10 p-6 rounded-full flex-shrink-0">
                      <MapPin className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">
                        Base of Operations: Reno, Nevada
                      </h2>
                      <p className="text-lg text-muted-foreground mb-4">
                        Our headquarters at 10471 Double R Blvd, Reno, NV 89521
                        sits at the intersection of major West Coast freight
                        lanes. Reno's strategic location offers quick access to
                        California distribution centers, Pacific Northwest
                        markets, and transcontinental corridors heading east.
                        For drivers based in the Reno-Sparks metro area, this
                        means more home time and less deadhead to your first
                        pickup.
                      </p>
                      <p className="text-muted-foreground">
                        We hire drivers from across the country. Whether you
                        live near our Reno headquarters or operate from another
                        region, we have routes and freight that work for your
                        location.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Application Form */}
          <section id="apply" className="py-16 px-4 bg-muted/50">
            <div className="container mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold mb-4 text-center">
                Apply to Drive with DeMar
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">
                Ready to join a carrier that puts drivers first? Complete the
                application below and our recruiting team will be in touch
                within 24-48 hours to discuss next steps.
              </p>
              <Card>
                <CardContent className="pt-6">
                  <ApplyToDriveForm />
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <div className="container mx-auto max-w-5xl text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Questions? Talk to Our Recruiting Team
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                If you have questions about open positions, pay, routes, or
                anything else, call us directly. Our team is here to help you
                make the right decision for your driving career.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:+17752304767">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-lg px-8"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    (775) 230-4767
                  </Button>
                </a>
                <a href="mailto:info@DeMarTransportation.com">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 border-white text-white hover:bg-white/10"
                  >
                    info@DeMarTransportation.com
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

export default Careers;
