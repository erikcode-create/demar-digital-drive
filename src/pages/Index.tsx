import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import ResourcesPreview from "@/components/ResourcesPreview";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    document.title = "DeMar Transportation | Freight Shipping & Logistics Services | Reno, NV";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'DeMar Transportation provides reliable freight shipping services including dry van, reefer, flatbed, and hazmat transportation. US-based carrier with 24/7 dispatch. Call (775) 230-4767.');
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
          <Hero />
          <Services />
          <About />
          <ResourcesPreview />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
