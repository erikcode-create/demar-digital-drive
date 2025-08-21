import { Button } from "@/components/ui/button";
import { ChevronDown, Shield, Clock, Users } from "lucide-react";
import heroTruck from "@/assets/hero-truck-demar.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroTruck})` }}
      >
        <div className="absolute inset-0 bg-primary/80"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            DRIVEN BY PURPOSE
            <br />
            <span className="text-accent">DELIVERING RESULTS</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
            A Safety First Transportation Solutions Provider. Professional freight transportation 
            services delivered with reliability and clear communication.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="hero" 
              size="xl" 
              className="animate-scale-in"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Why DeMar Transportation?
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="xl" 
              className="bg-white/10 border-white text-white hover:bg-white hover:text-primary animate-scale-in"
            >
              <a href="tel:+17752304767">Call (775) 230-4767</a>
            </Button>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-slide-in-right">
            <div className="flex flex-col items-center p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <Shield className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">Safety First</h3>
              <p className="text-primary-foreground/80">DOT compliant with excellent safety ratings</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <Clock className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">24/7 Service</h3>
              <p className="text-primary-foreground/80">Round-the-clock transportation solutions</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <Users className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">US Based Team</h3>
              <p className="text-primary-foreground/80">All English speaking, US-based drivers</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center text-accent">
            <span className="text-sm mb-2">SCROLL DOWN TO LEARN MORE</span>
            <ChevronDown className="h-6 w-6" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;