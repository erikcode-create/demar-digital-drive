import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Sidebar />
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
