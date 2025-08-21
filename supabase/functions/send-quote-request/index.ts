import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface QuoteRequest {
  contactName: string;
  company: string;
  email: string;
  phone: string;
  serviceType: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  weight: string;
  dimensions: string;
  commodityType: string;
  specialRequirements: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const quoteData: QuoteRequest = await req.json();
    console.log("Processing quote request:", quoteData);

    // Email to team members
    const teamEmailHtml = `
      <h2>New Quote Request from ${quoteData.contactName}</h2>
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h3>Contact Information</h3>
        <p><strong>Name:</strong> ${quoteData.contactName}</p>
        <p><strong>Company:</strong> ${quoteData.company || 'N/A'}</p>
        <p><strong>Email:</strong> ${quoteData.email}</p>
        <p><strong>Phone:</strong> ${quoteData.phone}</p>
        
        <h3>Service Details</h3>
        <p><strong>Service Type:</strong> ${quoteData.serviceType}</p>
        <p><strong>Pickup Location:</strong> ${quoteData.pickupLocation}</p>
        <p><strong>Delivery Location:</strong> ${quoteData.deliveryLocation}</p>
        <p><strong>Pickup Date:</strong> ${quoteData.pickupDate}</p>
        
        <h3>Shipment Information</h3>
        <p><strong>Weight:</strong> ${quoteData.weight || 'Not specified'} lbs</p>
        <p><strong>Dimensions:</strong> ${quoteData.dimensions || 'Not specified'}</p>
        <p><strong>Commodity Type:</strong> ${quoteData.commodityType || 'Not specified'}</p>
        
        ${quoteData.specialRequirements ? `
          <h3>Special Requirements</h3>
          <p>${quoteData.specialRequirements}</p>
        ` : ''}
      </div>
    `;

    // Customer confirmation email
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>Thank you for your quote request, ${quoteData.contactName}!</h2>
        <p>We have received your transportation quote request and will get back to you within 24 hours with competitive pricing.</p>
        
        <h3>Your Request Summary</h3>
        <p><strong>Service Type:</strong> ${quoteData.serviceType}</p>
        <p><strong>Route:</strong> ${quoteData.pickupLocation} → ${quoteData.deliveryLocation}</p>
        <p><strong>Pickup Date:</strong> ${quoteData.pickupDate}</p>
        ${quoteData.weight ? `<p><strong>Weight:</strong> ${quoteData.weight} lbs</p>` : ''}
        
        <p style="margin-top: 20px;">If you have any immediate questions, please contact us at:</p>
        <p>Email: info@DeMarTransportation.com<br>
        Phone: ${quoteData.phone}</p>
        
        <p style="margin-top: 20px;">Thank you for choosing DeMar Transportation!</p>
        <p><em>Driven by Purpose. Delivering Results.</em></p>
      </div>
    `;

    // Send using business domain with small retry to handle rate limits
const sendEmail = async (params: { to: string[]; subject: string; html: string; purpose: 'team' | 'customer' }) => {
  const attempt = async () => {
    return await resend.emails.send({
      from: 'DeMar Transportation <info@demartransportation.com>',
      to: params.to,
      subject: params.subject,
      html: params.html,
      reply_to: 'info@demartransportation.com',
    } as any);
  };

  let response = await attempt();
  let retries = 0;
  while (
    response.error &&
    (((response.error as any).statusCode === 429) || ((response.error as any).name === 'rate_limit_exceeded')) &&
    retries < 2
  ) {
    const delay = 700 * (retries + 1);
    console.log(`Rate limited on ${params.purpose} email, retrying in ${delay}ms...`, response.error);
    await new Promise((r) => setTimeout(r, delay));
    response = await attempt();
    retries++;
  }
  return response;
};

    // Send emails concurrently
    const teamEmails = ['Colby@DeMarTransportation.com', 'info@DeMarTransportation.com', 'Erik@DeMarTransportation.com'];

const teamResponse = await sendEmail({
  to: teamEmails,
  subject: `New Quote Request - ${quoteData.contactName} (${quoteData.serviceType})`,
  html: teamEmailHtml,
  purpose: 'team',
});

// Small delay to avoid hitting Resend's per-second limits
await new Promise((r) => setTimeout(r, 750));

const customerResponse = await sendEmail({
  to: [quoteData.email],
  subject: 'Quote Request Received - DeMar Transportation',
  html: customerEmailHtml,
  purpose: 'customer',
});

    console.log("Team email result:", teamResponse);
    console.log("Customer email result:", customerResponse);

    if (teamResponse.error || customerResponse.error) {
      throw new Error(`Email sending failed: ${teamResponse.error?.message || customerResponse.error?.message}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Quote request submitted successfully and emails sent!" 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in send-quote-request function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to process quote request", 
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);