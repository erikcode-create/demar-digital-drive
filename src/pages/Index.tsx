import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Footer from "@/components/Footer";
import LandstarSidebar from "@/components/LandstarSidebar";

const Index = () => {
  return (
    <div className="min-h-screen">
      <LandstarSidebar />
      <div className="ml-16">
        <Header />
        <Hero />
        <Services />
        <About />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
