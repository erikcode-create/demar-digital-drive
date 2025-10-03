import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ApplyToDriveForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    zipCode: "",
    state: "",
    yearsExperience: "",
    cdlNumber: "",
    cdlClass: "",
    cdlState: "",
    endorsements: [] as string[],
    accidentsLastThreeYears: "",
    violationsLastThreeYears: "",
    freightExperience: [] as string[],
    preferredRouteType: "",
    availableStartDate: "",
    willingToTravel: "",
    winterDrivingExperience: "",
  });

  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  const experienceOptions = [
    "Less than 1 year",
    "1-2 years",
    "3-5 years", 
    "6-10 years",
    "11-15 years",
    "16-20 years",
    "More than 20 years"
  ];

  const cdlClasses = ["Class A", "Class B", "Class C"];
  
  const endorsementOptions = [
    "H - Hazardous Materials",
    "N - Tank Vehicle",
    "X - Combination Tank/Hazmat",
    "T - Double/Triple Trailers",
    "P - Passenger",
    "S - School Bus"
  ];

  const freightTypes = [
    "Dry Van",
    "Refrigerated (Reefer)",
    "Flatbed",
    "Tanker",
    "Hazmat",
    "Oversized Loads",
    "Auto Transport"
  ];

  const routeTypes = [
    "Local (Home Daily)",
    "Regional (Home Weekly)",
    "OTR (Over-the-Road)",
    "Dedicated Route"
  ];

  const handleInputChange = (name: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[name as keyof typeof prev] as string[];
      if (checked) {
        return { ...prev, [name]: [...currentArray, value] };
      } else {
        return { ...prev, [name]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-driver-application', {
        body: formData,
      });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest. We'll be in touch soon.",
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        zipCode: "",
        state: "",
        yearsExperience: "",
        cdlNumber: "",
        cdlClass: "",
        cdlState: "",
        endorsements: [],
        accidentsLastThreeYears: "",
        violationsLastThreeYears: "",
        freightExperience: [],
        preferredRouteType: "",
        availableStartDate: "",
        willingToTravel: "",
        winterDrivingExperience: "",
      });
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            required
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          required
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="zipCode">Zip Code *</Label>
          <Input
            id="zipCode"
            type="text"
            value={formData.zipCode}
            onChange={(e) => handleInputChange("zipCode", e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="state">State *</Label>
          <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="yearsExperience">Years of Experience *</Label>
        <Select value={formData.yearsExperience} onValueChange={(value) => handleInputChange("yearsExperience", value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            {experienceOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border-t pt-4 mt-4">
        <h3 className="font-semibold mb-4">CDL Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cdlNumber">CDL License Number *</Label>
            <Input
              id="cdlNumber"
              type="text"
              value={formData.cdlNumber}
              onChange={(e) => handleInputChange("cdlNumber", e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="cdlState">CDL State *</Label>
            <Select value={formData.cdlState} onValueChange={(value) => handleInputChange("cdlState", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="cdlClass">CDL Class *</Label>
          <Select value={formData.cdlClass} onValueChange={(value) => handleInputChange("cdlClass", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select CDL class" />
            </SelectTrigger>
            <SelectContent>
              {cdlClasses.map((cdlClass) => (
                <SelectItem key={cdlClass} value={cdlClass}>
                  {cdlClass}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Endorsements</Label>
          <div className="mt-2 space-y-2">
            {endorsementOptions.map((endorsement) => (
              <div key={endorsement} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={endorsement}
                  checked={formData.endorsements.includes(endorsement)}
                  onChange={(e) => handleCheckboxChange("endorsements", endorsement, e.target.checked)}
                  className="rounded border-input"
                />
                <Label htmlFor={endorsement} className="font-normal cursor-pointer">
                  {endorsement}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <h3 className="font-semibold mb-4">Driving Record</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="accidentsLastThreeYears">Accidents in Last 3 Years *</Label>
            <Select value={formData.accidentsLastThreeYears} onValueChange={(value) => handleInputChange("accidentsLastThreeYears", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">None</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3+">3 or more</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="violationsLastThreeYears">Violations in Last 3 Years *</Label>
            <Select value={formData.violationsLastThreeYears} onValueChange={(value) => handleInputChange("violationsLastThreeYears", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">None</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3+">3 or more</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <h3 className="font-semibold mb-4">Experience & Preferences</h3>
        
        <div>
          <Label>Freight Experience *</Label>
          <div className="mt-2 space-y-2">
            {freightTypes.map((freight) => (
              <div key={freight} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={freight}
                  checked={formData.freightExperience.includes(freight)}
                  onChange={(e) => handleCheckboxChange("freightExperience", freight, e.target.checked)}
                  className="rounded border-input"
                />
                <Label htmlFor={freight} className="font-normal cursor-pointer">
                  {freight}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="preferredRouteType">Preferred Route Type *</Label>
          <Select value={formData.preferredRouteType} onValueChange={(value) => handleInputChange("preferredRouteType", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select route type" />
            </SelectTrigger>
            <SelectContent>
              {routeTypes.map((route) => (
                <SelectItem key={route} value={route}>
                  {route}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="winterDrivingExperience">Winter Driving & Chains Experience *</Label>
          <Select value={formData.winterDrivingExperience} onValueChange={(value) => handleInputChange("winterDrivingExperience", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="extensive">Extensive - Regularly drive in winter conditions and proficient with chains</SelectItem>
              <SelectItem value="moderate">Moderate - Some winter driving, comfortable with chains</SelectItem>
              <SelectItem value="limited">Limited - Minimal winter driving experience</SelectItem>
              <SelectItem value="none">None - No winter driving or chain experience</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="willingToTravel">Willing to Travel Nationwide? *</Label>
            <Select value={formData.willingToTravel} onValueChange={(value) => handleInputChange("willingToTravel", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="limited">Limited (Specific Regions Only)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="availableStartDate">Available Start Date *</Label>
            <Input
              id="availableStartDate"
              type="date"
              value={formData.availableStartDate}
              onChange={(e) => handleInputChange("availableStartDate", e.target.value)}
              required
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        variant="hero"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
};

export default ApplyToDriveForm;