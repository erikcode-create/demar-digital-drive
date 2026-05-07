import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OwnerOperatorSignupForm from "@/components/OwnerOperatorSignupForm";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BriefcaseBusiness,
  Calculator,
  CheckCircle,
  ClipboardCheck,
  CreditCard,
  Fuel,
  Headphones,
  Phone,
  ShieldCheck,
  Truck,
  WalletCards,
} from "lucide-react";

const supportBenefits = [
  {
    icon: Fuel,
    title: "Big Fuel Discounts",
    desc: "Leverage DeMar's fuel programs to reduce one of your largest weekly operating costs.",
  },
  {
    icon: ShieldCheck,
    title: "Insurance Savings",
    desc: "Access insurance savings that help make the business side of trucking more manageable.",
  },
  {
    icon: Headphones,
    title: "Full Dispatch",
    desc: "Run with a dispatch team that keeps freight moving and helps reduce wasted time between loads.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Back Office Support",
    desc: "Let DeMar support paperwork, coordination, and administrative details while you focus on the road.",
  },
];

const programDetails = [
  "Keep 90% of profits with clear weekly settlement statements.",
  "You pay for and maintain your own truck.",
  "Use DeMar's freight relationships, dispatch, and back office function.",
  "Get support from a team that understands both drivers and freight customers.",
  "Talk with recruiting before making a decision so the program fit is clear.",
];

const operatingFit = [
  {
    title: "Experienced CDL-A Owner-Operators",
    desc: "Built for professionals who own their truck and want a stronger support system behind the business.",
  },
  {
    title: "Business-Minded Drivers",
    desc: "A fit for operators who want to control their equipment, manage their costs, and keep more of what they earn.",
  },
  {
    title: "Ready for Support",
    desc: "Best for owner-operators who want dispatch, insurance savings, fuel discounts, and weekly settlement visibility.",
  },
];

const OwnerOperators = () => {
  useEffect(() => {
    document.title =
      "Owner Operator Trucking Opportunities | DeMar Transportation";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Owner-operator trucking opportunities with DeMar Transportation. Keep 90% of profits, access fuel discounts, insurance savings, dispatch, back office support, and weekly settlement statements.",
      );
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
      <Header />
      <main id="main-content">
        <section className="pt-32 pb-20 px-4 bg-[hsl(225_97%_4%)] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/5 backdrop-blur-sm">
              <Truck className="h-4 w-4 text-[hsl(var(--accent))]" />
              <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
                Owner Operator Opportunities
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
              Keep 90% of profits
              <br />
              <span className="text-white/40">with DeMar behind you</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl leading-relaxed mb-8">
              Own your truck and run your business with stronger support.
              DeMar owner-operators pay for and maintain their own truck, then
              leverage our fuel discounts, insurance savings, full dispatch,
              and back office function.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="bg-[hsl(var(--accent))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--accent))]/90 font-semibold"
                asChild
              >
                <a href="#signup">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                asChild
              >
                <a href="tel:+17752304767">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Recruiting
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-[hsl(var(--accent))]">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-xl bg-[hsl(var(--primary))] text-white shadow-[var(--shadow-float)]">
                <WalletCards className="h-7 w-7 text-[hsl(var(--accent))] mb-4" />
                <p className="text-4xl font-bold tracking-tight">90%</p>
                <p className="text-sm text-white/60 mt-2">
                  of profits kept by the owner-operator.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white/60 shadow-[var(--shadow-card)]">
                <CreditCard className="h-7 w-7 text-[hsl(var(--primary))] mb-4" />
                <p className="text-xl font-bold text-[hsl(var(--primary))]">
                  Weekly Settlements
                </p>
                <p className="text-sm text-[hsl(var(--primary))]/70 mt-2">
                  Weekly settlement statements help you see how the business is
                  performing.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white/60 shadow-[var(--shadow-card)]">
                <Calculator className="h-7 w-7 text-[hsl(var(--primary))] mb-4" />
                <p className="text-xl font-bold text-[hsl(var(--primary))]">
                  Business Support
                </p>
                <p className="text-sm text-[hsl(var(--primary))]/70 mt-2">
                  Dispatch, fuel savings, insurance savings, and back office
                  help in one program.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-[hsl(var(--surface))]">
          <div className="container mx-auto max-w-5xl">
            <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
              Program Support
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
              Run independently with a full team behind you.
            </h2>
            <p className="text-base text-[hsl(var(--muted-foreground))] mb-12 max-w-2xl leading-relaxed">
              Owner-operators carry the responsibility of the truck. DeMar
              supports the business around it, so you can spend more time
              moving freight and less time fighting administrative drag.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supportBenefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="p-6 rounded-xl bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)] transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-[hsl(var(--surface-low))]">
                      <benefit.icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-[hsl(225_97%_4%)] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="container mx-auto max-w-5xl relative z-10">
            <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-10">
              Clear economics. Strong support. Weekly visibility.
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.85fr] gap-8">
              <div className="space-y-3">
                {programDetails.map((detail) => (
                  <div key={detail} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--accent))] mt-0.5 flex-shrink-0" />
                    <p className="text-sm md:text-base text-white/60 leading-relaxed">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <ClipboardCheck className="h-8 w-8 text-[hsl(var(--accent))] mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  The right first step is a conversation.
                </h3>
                <p className="text-sm text-white/55 leading-relaxed mb-5">
                  Use the signup form to tell us about your truck, experience,
                  and timing. Our team will follow up to talk through fit,
                  freight, support, and weekly settlement expectations.
                </p>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  asChild
                >
                  <a href="#signup">Start Signup</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-[hsl(var(--surface-low))]">
          <div className="container mx-auto max-w-5xl">
            <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
              Owner-Operator Fit
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-10">
              Built for operators who treat trucking like a business.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {operatingFit.map((item) => (
                <div key={item.title} className="p-6 rounded-xl bg-white shadow-[var(--shadow-card)]">
                  <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="signup" className="scroll-mt-32 py-20 px-4 bg-[hsl(var(--surface))]">
          <div className="container mx-auto max-w-3xl">
            <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4 text-center">
              Sign Up Now
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4 text-center">
              Owner Operator Signup
            </h2>
            <p className="text-base text-[hsl(var(--muted-foreground))] mb-8 max-w-xl mx-auto text-center leading-relaxed">
              Tell us a little about your truck, experience, and timing. This
              form is dedicated to owner-operators and separate from the company
              driver application.
            </p>
            <div className="rounded-xl bg-white shadow-[var(--shadow-float)] p-6">
              <OwnerOperatorSignupForm />
            </div>
          </div>
        </section>

        <section className="py-16 bg-[hsl(var(--accent))]">
          <div className="container mx-auto max-w-5xl text-center px-4">
            <h2 className="text-2xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
              Questions before you sign up?
            </h2>
            <p className="text-base text-[hsl(var(--primary))]/70 mb-8 max-w-2xl mx-auto">
              Call recruiting to talk through the program, the 90% of profits
              model, weekly settlement statements, and what support looks like
              day to day.
            </p>
            <Button
              size="lg"
              className="bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]/90 font-semibold"
              asChild
            >
              <a href="tel:+17752304767">
                <Phone className="mr-2 h-4 w-4" />
                (775) 230-4767
              </a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OwnerOperators;
