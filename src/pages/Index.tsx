import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Footer from "@/components/Footer";

const Index = () => {
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
          <Hero />
          <Services />
          <About />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
