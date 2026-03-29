import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Truck, Phone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const QuoteRequest = () => {
  const [formData, setFormData] = useState({
    contactName: "",
    company: "",
    email: "",
    phone: "",
    serviceType: "",
    pickupLocation: "",
    deliveryLocation: "",
    pickupDate: "",
    weight: "",
    dimensions: "",
    commodityType: "",
    specialRequirements: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-quote-request', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: "Quote Request Submitted!",
        description: "We've received your request and will get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        contactName: "",
        company: "",
        email: "",
        phone: "",
        serviceType: "",
        pickupLocation: "",
        deliveryLocation: "",
        pickupDate: "",
        weight: "",
        dimensions: "",
        commodityType: "",
        specialRequirements: ""
      });

    } catch (error: any) {
      console.error("Error submitting quote request:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen">
      <div>
        <Header />
        <main>
          {/* Hero */}
          <section className="pt-32 pb-20 px-4 bg-[hsl(225_97%_4%)] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }} />
            <div className="container mx-auto max-w-5xl relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/5 backdrop-blur-sm">
                <Truck className="h-4 w-4 text-[hsl(var(--accent))]" />
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
                  Free Freight Quote
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                Request a
                <br />
                <span className="text-white/40">Quote</span>
              </h1>
              <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
                Get competitive rates for your freight transportation needs.
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>
          </section>

          {/* Form Section */}
          <section className="py-20 px-4 bg-[hsl(var(--surface))]">
            <div className="container mx-auto max-w-3xl">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                Shipment Details
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-4">
                Quote Request Form
              </h2>
              <p className="text-base text-[hsl(var(--muted-foreground))] mb-10 max-w-2xl leading-relaxed">
                Please provide details about your shipping requirements for an accurate quote.
              </p>

              <div className="rounded-xl bg-white shadow-[var(--shadow-card)] p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Contact Information */}
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                      Contact Information
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactName" className="text-sm font-medium text-[hsl(var(--primary))]">Contact Name *</Label>
                        <Input
                          id="contactName"
                          value={formData.contactName}
                          onChange={(e) => handleInputChange("contactName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-sm font-medium text-[hsl(var(--primary))]">Company Name</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-[hsl(var(--primary))]">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-[hsl(var(--primary))]">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Service Type */}
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                      Service
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="serviceType" className="text-sm font-medium text-[hsl(var(--primary))]">Service Type *</Label>
                      <Select value={formData.serviceType} onValueChange={(value) => handleInputChange("serviceType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dry-van">Dry Van</SelectItem>
                          <SelectItem value="reefer">Reefer (Temperature Controlled)</SelectItem>
                          <SelectItem value="flatbed">Flatbed</SelectItem>
                          <SelectItem value="box-truck">Box Truck</SelectItem>
                          <SelectItem value="sprinter-van">Sprinter Van</SelectItem>
                          <SelectItem value="hazmat">Hazmat/Fuel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Locations and Date */}
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                      Route
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pickupLocation" className="text-sm font-medium text-[hsl(var(--primary))]">Pickup Location *</Label>
                        <Input
                          id="pickupLocation"
                          placeholder="City, State"
                          value={formData.pickupLocation}
                          onChange={(e) => handleInputChange("pickupLocation", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deliveryLocation" className="text-sm font-medium text-[hsl(var(--primary))]">Delivery Location *</Label>
                        <Input
                          id="deliveryLocation"
                          placeholder="City, State"
                          value={formData.deliveryLocation}
                          onChange={(e) => handleInputChange("deliveryLocation", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pickupDate" className="text-sm font-medium text-[hsl(var(--primary))]">Pickup Date *</Label>
                        <Input
                          id="pickupDate"
                          type="date"
                          value={formData.pickupDate}
                          onChange={(e) => handleInputChange("pickupDate", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipment Details */}
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                      Cargo Details
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="weight" className="text-sm font-medium text-[hsl(var(--primary))]">Total Weight (lbs)</Label>
                        <Input
                          id="weight"
                          type="number"
                          placeholder="e.g., 5000"
                          value={formData.weight}
                          onChange={(e) => handleInputChange("weight", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dimensions" className="text-sm font-medium text-[hsl(var(--primary))]">Dimensions (L x W x H)</Label>
                        <Input
                          id="dimensions"
                          placeholder="e.g., 48' x 8' x 9'"
                          value={formData.dimensions}
                          onChange={(e) => handleInputChange("dimensions", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="commodityType" className="text-sm font-medium text-[hsl(var(--primary))]">Commodity Type</Label>
                        <Input
                          id="commodityType"
                          placeholder="e.g., Electronics, Food Products"
                          value={formData.commodityType}
                          onChange={(e) => handleInputChange("commodityType", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Special Requirements */}
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-4">
                      Additional Info
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="specialRequirements" className="text-sm font-medium text-[hsl(var(--primary))]">Special Requirements</Label>
                      <Textarea
                        id="specialRequirements"
                        placeholder="Any special handling, delivery instructions, or other requirements..."
                        value={formData.specialRequirements}
                        onChange={(e) => handleInputChange("specialRequirements", e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 justify-end pt-4">
                    <Button type="button" variant="outline" className="border-[hsl(var(--primary))] text-[hsl(var(--primary))]" asChild>
                      <Link to="/">Cancel</Link>
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="bg-[hsl(var(--accent))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--accent))]/90 font-semibold"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Quote Request"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-[hsl(var(--accent))]">
            <div className="container mx-auto max-w-5xl text-center px-4">
              <h2 className="text-2xl md:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight mb-3">
                Prefer to Talk?
              </h2>
              <p className="text-base text-[hsl(var(--primary))]/70 mb-8 max-w-md mx-auto">
                Call us directly for an immediate rate or to discuss your freight needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]/90 font-semibold"
                  asChild
                >
                  <a href="tel:+17752304767" className="group">
                    <Phone className="mr-2 h-4 w-4" />
                    (775) 230-4767
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10"
                  asChild
                >
                  <Link to="/contact" className="group">
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default QuoteRequest;
