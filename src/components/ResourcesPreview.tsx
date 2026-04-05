import { Link } from "react-router-dom";
import { ArrowRight, DollarSign, Scale, BookOpen } from "lucide-react";

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
    title: "How to Ship Freight: Beginner's Guide",
    description: "End-to-end process from getting a quote to confirming delivery.",
    to: "/resources/how-to-ship-freight",
    icon: BookOpen,
  },
];

const ResourcesPreview = () => {
  return (
    <section className="py-space-2xl bg-[hsl(var(--surface-low))]">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-end justify-between mb-space-xl">
          <h2 className="font-serif text-heading text-primary">
            Freight Shipping Guides
          </h2>
          <Link
            to="/resources"
            className="hidden sm:inline-flex items-center gap-1 text-caption font-medium text-primary hover:text-accent transition-colors group"
          >
            All Resources
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="space-y-space-md">
          {featuredResources.map((resource) => (
            <Link
              key={resource.to}
              to={resource.to}
              className="group flex items-start gap-space-md p-space-md rounded-[var(--radius)] bg-background hover:shadow-[var(--shadow-float)] transition-all duration-300"
            >
              <div className="flex-shrink-0 p-2.5 rounded-lg bg-[hsl(var(--surface-container))]">
                <resource.icon className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-subheading text-primary mb-1 group-hover:text-accent transition-colors">
                  {resource.title}
                </h3>
                <p className="text-caption text-muted-foreground leading-relaxed">
                  {resource.description}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-accent flex-shrink-0 mt-1 transition-colors" />
            </Link>
          ))}
        </div>

        <div className="mt-space-lg sm:hidden text-center">
          <Link
            to="/resources"
            className="inline-flex items-center gap-1 text-caption font-medium text-primary hover:text-accent transition-colors"
          >
            View All Resources
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ResourcesPreview;
