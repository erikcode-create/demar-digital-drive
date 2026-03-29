import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Truck } from "lucide-react";
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
        
        <main className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-8">
              <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <Truck className="h-12 w-12 text-primary" />
                </div>
                <h1 className="text-4xl font-bold mb-4">Request a Quote</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Get competitive rates for your freight transportation needs. 
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Quote Request Form</CardTitle>
                <CardDescription>
                  Please provide details about your shipping requirements for an accurate quote.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name *</Label>
                      <Input
                        id="contactName"
                        value={formData.contactName}
                        onChange={(e) => handleInputChange("contactName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Service Type */}
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type *</Label>
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

                  {/* Locations and Date */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickupLocation">Pickup Location *</Label>
                      <Input
                        id="pickupLocation"
                        placeholder="City, State"
                        value={formData.pickupLocation}
                        onChange={(e) => handleInputChange("pickupLocation", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryLocation">Delivery Location *</Label>
                      <Input
                        id="deliveryLocation"
                        placeholder="City, State"
                        value={formData.deliveryLocation}
                        onChange={(e) => handleInputChange("deliveryLocation", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickupDate">Pickup Date *</Label>
                      <Input
                        id="pickupDate"
                        type="date"
                        value={formData.pickupDate}
                        onChange={(e) => handleInputChange("pickupDate", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Shipment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Total Weight (lbs)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="e.g., 5000"
                        value={formData.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dimensions">Dimensions (L x W x H)</Label>
                      <Input
                        id="dimensions"
                        placeholder="e.g., 48' x 8' x 9'"
                        value={formData.dimensions}
                        onChange={(e) => handleInputChange("dimensions", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="commodityType">Commodity Type</Label>
                      <Input
                        id="commodityType"
                        placeholder="e.g., Electronics, Food Products"
                        value={formData.commodityType}
                        onChange={(e) => handleInputChange("commodityType", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Special Requirements */}
                  <div className="space-y-2">
                    <Label htmlFor="specialRequirements">Special Requirements</Label>
                    <Textarea
                      id="specialRequirements"
                      placeholder="Any special handling, delivery instructions, or other requirements..."
                      value={formData.specialRequirements}
                      onChange={(e) => handleInputChange("specialRequirements", e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-4 justify-end">
                    <Button type="button" variant="outline" asChild>
                      <Link to="/">Cancel</Link>
                    </Button>
                    <Button type="submit" variant="cta" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Quote Request"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default QuoteRequest;