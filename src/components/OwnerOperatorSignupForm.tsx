import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";

const states = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

const experienceOptions = [
  "1-2 years",
  "3-5 years",
  "6-10 years",
  "11-15 years",
  "16-20 years",
  "More than 20 years",
];

const truckTypes = [
  "Sleeper Tractor",
  "Day Cab",
  "Box Truck",
  "Hot Shot",
  "Other",
];

const trailerAccessOptions = [
  "I have my own trailer",
  "I need trailer options",
  "Power only",
  "Open to discussion",
];

const operatingStatusOptions = [
  "Ready to lease on",
  "Currently leased to another carrier",
  "Running under my own authority",
  "Buying a truck soon",
  "Researching options",
];

const startTimeframeOptions = [
  "Immediately",
  "Within 30 days",
  "1-3 months",
  "3+ months",
];

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  yearsExperience: "",
  truckType: "",
  trailerAccess: "",
  operatingStatus: "",
  startTimeframe: "",
  notes: "",
};

const selectClassName =
  "mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const OwnerOperatorSignupForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsSubmitted(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitted(false);

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.city ||
      !formData.state ||
      !formData.yearsExperience ||
      !formData.truckType ||
      !formData.trailerAccess ||
      !formData.operatingStatus ||
      !formData.startTimeframe
    ) {
      toast({
        title: "Missing Required Fields",
        description: "Please complete all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("send-owner-operator-signup", {
        body: formData,
      });

      if (error) throw error;

      setIsSubmitted(true);
      setFormData(initialFormData);
      toast({
        title: "Signup Received",
        description: "Thanks. Our recruiting team will reach out shortly.",
      });
    } catch (error: unknown) {
      console.error("Error submitting owner-operator signup:", error);
      toast({
        title: "Submission Error",
        description: "We could not send your signup. Please call us directly or try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="owner-firstName">First Name *</Label>
          <Input
            id="owner-firstName"
            value={formData.firstName}
            onChange={(event) => handleInputChange("firstName", event.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="owner-lastName">Last Name *</Label>
          <Input
            id="owner-lastName"
            value={formData.lastName}
            onChange={(event) => handleInputChange("lastName", event.target.value)}
            required
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="owner-email">Email *</Label>
          <Input
            id="owner-email"
            type="email"
            value={formData.email}
            onChange={(event) => handleInputChange("email", event.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="owner-phone">Phone *</Label>
          <Input
            id="owner-phone"
            type="tel"
            value={formData.phone}
            onChange={(event) => handleInputChange("phone", event.target.value)}
            required
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="owner-city">City or ZIP *</Label>
          <Input
            id="owner-city"
            value={formData.city}
            onChange={(event) => handleInputChange("city", event.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="owner-state">State *</Label>
          <select
            id="owner-state"
            value={formData.state}
            onChange={(event) => handleInputChange("state", event.target.value)}
            required
            className={selectClassName}
          >
            <option value="">Select state</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="owner-yearsExperience">Years CDL-A Experience *</Label>
          <select
            id="owner-yearsExperience"
            value={formData.yearsExperience}
            onChange={(event) => handleInputChange("yearsExperience", event.target.value)}
            required
            className={selectClassName}
          >
            <option value="">Select experience</option>
            {experienceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="owner-truckType">Truck Type *</Label>
          <select
            id="owner-truckType"
            value={formData.truckType}
            onChange={(event) => handleInputChange("truckType", event.target.value)}
            required
            className={selectClassName}
          >
            <option value="">Select truck type</option>
            {truckTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="owner-trailerAccess">Trailer Access *</Label>
          <select
            id="owner-trailerAccess"
            value={formData.trailerAccess}
            onChange={(event) => handleInputChange("trailerAccess", event.target.value)}
            required
            className={selectClassName}
          >
            <option value="">Select trailer access</option>
            {trailerAccessOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="owner-operatingStatus">Current Operating Status *</Label>
          <select
            id="owner-operatingStatus"
            value={formData.operatingStatus}
            onChange={(event) => handleInputChange("operatingStatus", event.target.value)}
            required
            className={selectClassName}
          >
            <option value="">Select status</option>
            {operatingStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="owner-startTimeframe">Preferred Start Timeframe *</Label>
        <select
          id="owner-startTimeframe"
          value={formData.startTimeframe}
          onChange={(event) => handleInputChange("startTimeframe", event.target.value)}
          required
          className={selectClassName}
        >
          <option value="">Select timeframe</option>
          {startTimeframeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="owner-notes">Notes</Label>
        <Textarea
          id="owner-notes"
          value={formData.notes}
          onChange={(event) => handleInputChange("notes", event.target.value)}
          className="mt-1 min-h-[110px]"
          placeholder="Tell us about your preferred lanes, equipment, or questions."
        />
      </div>

      {isSubmitted && (
        <div className="rounded-lg bg-[hsl(var(--surface-low))] px-4 py-3 text-sm font-medium text-[hsl(var(--primary))]">
          Signup received. Our recruiting team will contact you soon.
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full bg-[hsl(var(--accent))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--accent))]/90 font-semibold"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Signup
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Submit Signup
          </>
        )}
      </Button>
    </form>
  );
};

export default OwnerOperatorSignupForm;
