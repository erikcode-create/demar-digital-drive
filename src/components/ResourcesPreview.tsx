import { Link } from "react-router-dom";
import { ArrowRight, DollarSign, Truck, Scale, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const featuredResources = [
  {
    title: "How Much Does Freight Shipping Cost?",
    description: "2026 pricing guide with per-mile rates, cost factors, and tips to reduce your freight spend.",
    to: "/resources/freight-shipping-cost",
    icon: DollarSign,
  },
  {
    title: "FTL vs LTL: How to Choose",
    description: "When full truckload beats less-than-truckload. Cost breakpoints and decision guide.",
    to: "/resources/ftl-vs-ltl",
    icon: Scale,
  },
  {
    title: "Types of Freight Trailers",
    description: "Every trailer type explained — dry van, reefer, flatbed, step deck, and more.",
    to: "/resources/types-of-freight-trailers",
    icon: Truck,
  },
  {
    title: "How to Ship Freight: Beginner's Guide",
    description: "End-to-end process from getting a quote to confirming delivery.",
    to: "/resources/how-to-ship-freight",
    icon: BookOpen,
  },
];

const ResourcesPreview = () => {
  return (
    <section className="py-20 bg-[hsl(var(--surface-low))]">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-3">
              Resource Center
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight">
              Freight Shipping Guides
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex border-[hsl(var(--primary))] text-[hsl(var(--primary))]"
            asChild
          >
            <Link to="/resources" className="group">
              All Resources
              <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {featuredResources.map((resource) => (
            <Link
              key={resource.to}
              to={resource.to}
              className="group p-6 rounded-xl bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)] transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-[hsl(var(--surface-low))]">
                  <resource.icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[hsl(var(--primary))] mb-1 group-hover:text-[hsl(var(--accent))] transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                    {resource.description}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-[hsl(var(--accent))]">
                    Read Guide
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 sm:hidden text-center">
          <Button
            variant="outline"
            size="sm"
            className="border-[hsl(var(--primary))] text-[hsl(var(--primary))]"
            asChild
          >
            <Link to="/resources" className="group">
              View All Resources
              <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ResourcesPreview;
