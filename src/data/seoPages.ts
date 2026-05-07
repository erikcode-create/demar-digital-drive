import {
  Boxes,
  Building2,
  Factory,
  MapPin,
  Package,
  Snowflake,
  Truck,
  Warehouse,
  Zap,
  ShieldCheck,
  Network,
  Scale,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface DirectoryPage {
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
}

export const equipmentServices: DirectoryPage[] = [
  {
    title: "Dry Van",
    description: "53-foot enclosed trailers for palletized, boxed, and general dry freight.",
    path: "/services/dry-van",
    icon: Truck,
  },
  {
    title: "Reefer",
    description: "Temperature-controlled freight for food, beverage, and cold chain shipments.",
    path: "/services/reefer",
    icon: Snowflake,
  },
  {
    title: "Flatbed",
    description: "Open-deck capacity for machinery, steel, lumber, and oversized cargo.",
    path: "/services/flatbed",
    icon: Package,
  },
  {
    title: "Box Truck",
    description: "Local and regional delivery for dock, liftgate, and limited-access freight.",
    path: "/services/box-truck",
    icon: Boxes,
  },
  {
    title: "Sprinter Van",
    description: "Expedited small-shipment delivery for urgent freight and dedicated moves.",
    path: "/services/sprinter-van",
    icon: Zap,
  },
  {
    title: "Hazmat",
    description: "DOT-compliant hazardous materials transport with qualified carrier vetting.",
    path: "/services/hazmat",
    icon: ShieldCheck,
  },
];

export const solutionServices: DirectoryPage[] = [
  {
    title: "Full Truckload (FTL)",
    description: "Dedicated trailer capacity for larger shipments and direct transit.",
    path: "/services/ftl",
    icon: Truck,
  },
  {
    title: "Less Than Truckload (LTL)",
    description: "Shared trailer space for palletized freight under full truckload volume.",
    path: "/services/ltl",
    icon: Scale,
  },
  {
    title: "3PL Services",
    description: "Carrier sourcing, freight management, visibility, and logistics coordination.",
    path: "/services/3pl",
    icon: Network,
  },
  {
    title: "Warehousing",
    description: "Storage, cross-docking, distribution, and fulfillment coordination.",
    path: "/services/warehousing",
    icon: Warehouse,
  },
];

export const locationPages: DirectoryPage[] = [
  {
    title: "Reno Freight Shipping",
    description: "Freight shipping from Reno with direct access to I-80, US-395, California, the Pacific Northwest, and Intermountain West lanes.",
    path: "/locations/reno-freight-shipping",
    icon: MapPin,
  },
  {
    title: "Nevada LTL Freight",
    description: "Less-than-truckload freight for Nevada shippers moving pallets across regional and nationwide lanes.",
    path: "/locations/nevada-ltl-freight",
    icon: Scale,
  },
  {
    title: "Nevada Reefer Freight",
    description: "Temperature-controlled freight for Nevada food, beverage, pharmaceutical, and cold chain shippers.",
    path: "/locations/nevada-reefer-freight",
    icon: Snowflake,
  },
  {
    title: "Reno Warehouse Distribution",
    description: "Warehousing, cross-docking, distribution, and transload coordination for Reno-area freight.",
    path: "/locations/reno-warehouse-distribution",
    icon: Building2,
  },
];

export const industriesServed = [
  { name: "Manufacturing", icon: Factory },
  { name: "Food & Beverage", icon: Snowflake },
  { name: "Retail & E-commerce", icon: Boxes },
  { name: "Construction", icon: Package },
];
