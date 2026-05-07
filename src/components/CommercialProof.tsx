import { Link } from "react-router-dom";
import { CheckCircle, MapPin, ShieldCheck, Clock, Truck, ArrowRight } from "lucide-react";

const proofItems = [
  {
    icon: ShieldCheck,
    title: "USDOT 4392091",
    detail: "Registered operating authority with both motor carrier and freight broker capability.",
  },
  {
    icon: MapPin,
    title: "48-State Coverage",
    detail: "Nationwide capacity through our own fleet and vetted carrier network, anchored by our Reno headquarters.",
  },
  {
    icon: Clock,
    title: "24/7 Dispatch",
    detail: "Shipment support continues outside normal office hours when freight is moving.",
  },
  {
    icon: Truck,
    title: "Vetted Capacity",
    detail: "Loads are matched with qualified carriers based on authority, equipment fit, safety, and lane experience.",
  },
];

const fitItems = [
  "Confirm shipment mode, trailer dimensions, weight, and loading requirements before booking.",
  "Match time-sensitive freight to direct FTL, sprinter van, or regional box truck capacity.",
  "Plan routes around regional weather, lane constraints, and appointment timing where freight risk is highest.",
  "Connect shippers with related services including LTL, reefer, warehousing, and 3PL support.",
];

export default function CommercialProof() {
  return (
    <section className="py-16 px-4 bg-[hsl(var(--surface-low))]" aria-labelledby="commercial-proof-heading">
      <div className="container mx-auto max-w-5xl">
        <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
          Why DeMar
        </p>
        <h2 id="commercial-proof-heading" className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-5">
          Freight Support Built Around Real Operating Authority
        </h2>
        <p className="text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-3xl mb-10">
          DeMar Transportation serves shippers across the 48 contiguous states and
          operates with USDOT 4392091. Our team combines motor carrier authority,
          broker authority, and a vetted carrier network to help shippers choose the
          right equipment, lane, and service level.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {proofItems.map((item) => (
            <div key={item.title} className="rounded-xl bg-white p-5 shadow-[var(--shadow-card)]">
              <item.icon className="h-5 w-5 text-[hsl(var(--accent))] mb-3" />
              <h3 className="text-sm font-bold text-[hsl(var(--primary))] mb-2">{item.title}</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          <div className="rounded-xl bg-white p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-xl font-bold text-[hsl(var(--primary))] mb-4">
              When This Service Fits
            </h3>
            <div className="space-y-3">
              {fitItems.map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-[hsl(var(--accent))] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-[hsl(225_97%_4%)] p-6 text-white">
            <h3 className="text-xl font-bold mb-3">Related DeMar Hubs</h3>
            <div className="space-y-2">
              {[
                { label: "All Freight Services", to: "/services" },
                { label: "Reno Freight Shipping", to: "/locations/reno-freight-shipping" },
                { label: "Nevada LTL Freight", to: "/locations/nevada-ltl-freight" },
                { label: "Reno Warehouse Distribution", to: "/locations/reno-warehouse-distribution" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {link.label}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
