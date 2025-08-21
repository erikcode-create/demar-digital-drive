import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Quote, CheckCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const features = [
    "Direct carrier - no middleman markup",
    "All English speaking drivers",
    "US-based operations",
    "Competitive pricing",
    "Clear communication",
    "Professional service",
    "24/7 availability",
    "DOT compliant"
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="animate-fade-in">
            <Badge variant="secondary" className="mb-4 text-accent-foreground bg-accent/10">
              About Us
            </Badge>
            
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              The Direct Way to Work with a Full Truckload Carrier
            </h2>

            <div className="bg-accent/10 border-l-4 border-accent p-6 mb-8 rounded-r-lg">
              <Quote className="h-8 w-8 text-accent mb-4" />
              <p className="text-lg italic text-primary font-medium">
                "DeMar Transportation is highly competitive on price."
              </p>
            </div>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We focus on a clear, concise, and professional communication style. 
              Our team is friendly, approachable, and easy to speak to. We take pride 
              in our clear, professional communication, ensuring that every 
              conversation is smooth and hassle-free.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div 
                  key={feature} 
                  className="flex items-center gap-3 animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-primary">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="animate-pulse-glow" asChild>
                <a href="tel:+17752304767">
                  <Phone className="h-5 w-5 mr-2" />
                  Call (775) 230-4767
                </a>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/quote">Request Quote Online</Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Stats & Process */}
          <div className="animate-slide-in-right">
            <Card className="mb-8 shadow-[var(--shadow-card)]">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-accent mb-2">14+</div>
                  <p className="text-muted-foreground">Years of Experience</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-primary mb-6">We Make Life Easier</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-accent/5 rounded-lg">
                  <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Call Colby</h4>
                    <p className="text-muted-foreground">Get discounted rates for working directly with us</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-accent/5 rounded-lg">
                  <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Agree on Price</h4>
                    <p className="text-muted-foreground">Transparent pricing with no hidden fees</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-accent/5 rounded-lg">
                  <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">We Deliver</h4>
                    <p className="text-muted-foreground">Professional service from pickup to delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;