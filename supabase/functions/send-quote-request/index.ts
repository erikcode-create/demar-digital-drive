import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const ALLOWED_ORIGINS = [
  "https://demartransportation.com",
  "https://www.demartransportation.com",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

// Simple in-memory rate limiter: max 5 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return false;
  }
  entry.count++;
  return entry.count > 5;
}

// Sanitize user input to prevent XSS in email HTML
function sanitize(str: string): string {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(clientIp)) {
    return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
      status: 429,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const quoteData: QuoteRequest = await req.json();

    // Validate required fields
    if (!quoteData.contactName || !quoteData.email || !quoteData.phone || !quoteData.serviceType) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quoteData.email)) {
      return new Response(JSON.stringify({ error: "Invalid email address." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("Processing quote request from:", sanitize(quoteData.contactName));

    // Sanitize all user input before inserting into HTML
    const s = {
      contactName: sanitize(quoteData.contactName),
      company: sanitize(quoteData.company),
      email: sanitize(quoteData.email),
      phone: sanitize(quoteData.phone),
      serviceType: sanitize(quoteData.serviceType),
      pickupLocation: sanitize(quoteData.pickupLocation),
      deliveryLocation: sanitize(quoteData.deliveryLocation),
      pickupDate: sanitize(quoteData.pickupDate),
      weight: sanitize(quoteData.weight),
      dimensions: sanitize(quoteData.dimensions),
      commodityType: sanitize(quoteData.commodityType),
      specialRequirements: sanitize(quoteData.specialRequirements),
    };

    // Email to team members
    const teamEmailHtml = `
      <h2>New Quote Request from ${s.contactName}</h2>
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h3>Contact Information</h3>
        <p><strong>Name:</strong> ${s.contactName}</p>
        <p><strong>Company:</strong> ${s.company || 'N/A'}</p>
        <p><strong>Email:</strong> ${s.email}</p>
        <p><strong>Phone:</strong> ${s.phone}</p>

        <h3>Service Details</h3>
        <p><strong>Service Type:</strong> ${s.serviceType}</p>
        <p><strong>Pickup Location:</strong> ${s.pickupLocation}</p>
        <p><strong>Delivery Location:</strong> ${s.deliveryLocation}</p>
        <p><strong>Pickup Date:</strong> ${s.pickupDate}</p>

        <h3>Shipment Information</h3>
        <p><strong>Weight:</strong> ${s.weight || 'Not specified'} lbs</p>
        <p><strong>Dimensions:</strong> ${s.dimensions || 'Not specified'}</p>
        <p><strong>Commodity Type:</strong> ${s.commodityType || 'Not specified'}</p>

        ${s.specialRequirements ? `
          <h3>Special Requirements</h3>
          <p>${s.specialRequirements}</p>
        ` : ''}
      </div>
    `;

    // Customer confirmation email
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>Thank you for your quote request, ${s.contactName}!</h2>
        <p>We have received your transportation quote request and will get back to you within 24 hours with competitive pricing.</p>

        <h3>Your Request Summary</h3>
        <p><strong>Service Type:</strong> ${s.serviceType}</p>
        <p><strong>Route:</strong> ${s.pickupLocation} → ${s.deliveryLocation}</p>
        <p><strong>Pickup Date:</strong> ${s.pickupDate}</p>
        ${s.weight ? `<p><strong>Weight:</strong> ${s.weight} lbs</p>` : ''}

        <p style="margin-top: 20px;">If you have any immediate questions, please contact us at:</p>
        <p>Email: info@DeMarTransportation.com<br>
        Phone: (775) 230-4767</p>

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
  subject: `New Quote Request - ${s.contactName} (${s.serviceType})`,
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