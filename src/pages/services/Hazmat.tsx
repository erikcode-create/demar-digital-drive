import ServicePageLayout from "@/components/ServicePageLayout";
import { Wrench } from "lucide-react";

const Hazmat = () => (
  <ServicePageLayout
    title="Hazmat & Fuel Transportation"
    slug="hazmat"
    icon={Wrench}
    category="heavy"
    badge="Certified & Compliant"
    metaTitle="Hazmat & Fuel Transportation Services | Certified Hazardous Materials Shipping | DeMar Transportation"
    metaDescription="DeMar Transportation provides certified hazmat and fuel transportation with compliant drivers, equipment, and documentation. DOT-regulated shipping for all 9 hazmat classes. Get a hazmat quote today."
    description="Certified hazardous materials transportation with fully compliant drivers, equipment, and documentation. From fuel hauling to chemical transport, DeMar Transportation handles your most sensitive freight with the expertise and safety protocols the job demands."
    overview={{
      heading: "What Is Hazmat Transportation?",
      paragraphs: [
        "Hazmat transportation is the movement of hazardous materials by ground, air, rail, or water in compliance with the regulations established by the U.S. Department of Transportation (DOT) under Title 49 of the Code of Federal Regulations (49 CFR). Hazardous materials are substances that pose a risk to health, safety, property, or the environment during transport. This broad category includes flammable liquids, corrosive chemicals, compressed gases, explosives, radioactive materials, toxic substances, and many other product types that require specialized handling procedures.",
        "The hazmat transportation industry is one of the most heavily regulated sectors in freight logistics. Every aspect of a hazmat shipment is governed by federal law, from the packaging and labeling of materials to the training and certification of drivers, the placarding of vehicles, and the documentation that must accompany each load. These regulations exist to protect drivers, the public, and the environment from the consequences of accidental release or exposure during transit.",
        "DeMar Transportation provides hazmat shipping services for a wide range of hazardous materials, with particular expertise in fuel hauling and petroleum product transportation. Our drivers hold current hazmat endorsements, our equipment meets all DOT specifications, and our safety management systems are designed to exceed minimum regulatory requirements.",
      ],
    }}
    cargoTypes={[
      { title: "Class 1: Explosives", desc: "Dynamite, detonators, fireworks, ammunition, and other materials capable of producing an explosion or pyrotechnic effect." },
      { title: "Class 2: Gases", desc: "Compressed, liquefied, or dissolved gases including propane, oxygen, acetylene, and aerosol products." },
      { title: "Class 3: Flammable Liquids", desc: "Gasoline, diesel fuel, ethanol, acetone, paint thinners, and other liquids with a flash point below 141 degrees Fahrenheit." },
      { title: "Class 4: Flammable Solids", desc: "Matches, sulfur, magnesium, and other solids that are easily ignited or may cause fire through friction or self-reaction." },
      { title: "Class 5: Oxidizers & Organic Peroxides", desc: "Ammonium nitrate, hydrogen peroxide, and substances that release oxygen and intensify combustion." },
      { title: "Class 6: Toxic & Infectious Substances", desc: "Pesticides, medical waste, biological specimens, and materials that are harmful or fatal if inhaled, ingested, or absorbed." },
      { title: "Class 7: Radioactive Materials", desc: "Medical isotopes, industrial gauges, and nuclear fuel assemblies requiring specialized shielding and handling." },
      { title: "Class 8: Corrosives", desc: "Battery acid, sulfuric acid, sodium hydroxide, and materials that cause visible destruction to skin or corrode metals." },
      { title: "Class 9: Miscellaneous Dangerous Goods", desc: "Lithium batteries, dry ice, magnetized materials, and environmentally hazardous substances not covered by other classes." },
    ]}
    features={[
      { title: "CDL with HazMat Endorsement (H)", desc: "All hazmat drivers must hold a valid Commercial Driver's License with a HazMat endorsement, obtained by passing a written knowledge test and undergoing a TSA-administered security threat assessment including fingerprinting and criminal background check." },
      { title: "Tanker Endorsement (N)", desc: "Drivers transporting liquid hazmat in cargo tanks require an additional tanker endorsement, demonstrating knowledge of liquid surge dynamics, rollover prevention, and proper loading and unloading procedures." },
      { title: "TWIC Card", desc: "The Transportation Worker Identification Credential, issued by the TSA, provides biometric-verified access to secure port facilities and is required for drivers hauling hazmat to or from maritime terminals and certain government installations." },
      { title: "Hazmat Training (49 CFR 172.704)", desc: "Federal regulation mandates initial and recurrent hazmat training covering general awareness, function-specific procedures, safety protocols, and security awareness. Training must be documented and refreshed every three years." },
    ]}
    whyDemar={{
      paragraphs: [
        "DeMar Transportation and our carrier network maintain comprehensive insurance coverage that meets or exceeds all federal minimums for hazmat carriers, ranging from $1 million to $5 million depending on class and quantity. This includes auto liability, cargo insurance, pollution liability, and umbrella coverage.",
        "Our hazmat capabilities include fully certified drivers with current endorsements and clean safety records, comprehensive DOT compliance management and documentation, access to a nationwide network of hazmat-qualified carriers, dedicated logistics coordinators experienced in hazmat shipping requirements, 24/7 dispatch availability for urgent and emergency hazmat shipments, fuel hauling expertise across the western United States, and transparent pricing with no hidden regulatory surcharges.",
      ],
      relatedServices: [
        { name: "box truck services", slug: "box-truck" },
        { name: "sprinter van services", slug: "sprinter-van" },
      ],
    }}
    relatedResources={[
      { title: "How to Ship Hazardous Materials", description: "DOT regulations and compliance guide", to: "/resources/how-to-ship-hazardous-materials" },
      { title: "How to Choose a Freight Carrier", description: "Checklist for evaluating carriers", to: "/resources/how-to-choose-freight-carrier" },
      { title: "Freight Shipping Terms Glossary", description: "50+ logistics terms defined", to: "/resources/freight-shipping-glossary" },
    ]}
    schema={{
      serviceType: "Hazardous Materials Transportation",
      serviceDescription: "Certified hazmat and fuel transportation services with DOT-compliant drivers, equipment, and documentation for all nine hazardous materials classes.",
    }}
  />
);

export default Hazmat;
