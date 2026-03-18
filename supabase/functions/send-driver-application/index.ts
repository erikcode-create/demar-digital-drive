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

interface DriverApplication {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  state: string;
  driverType: string;
  yearsExperience: string;
  cdlNumber: string;
  cdlState: string;
  endorsements: string[];
  accidentsLastThreeYears: string;
  violationsLastThreeYears: string;
  freightExperience: string[];
  availableStartDate: string;
  willingToTravel: string;
  winterDrivingExperience: string;
  chainsExperience: string;
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
    const applicationData: DriverApplication = await req.json();

    // Validate required fields
    if (!applicationData.firstName || !applicationData.lastName || !applicationData.email || !applicationData.phone) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicationData.email)) {
      return new Response(JSON.stringify({ error: "Invalid email address." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("Processing driver application from:", sanitize(applicationData.firstName), sanitize(applicationData.lastName));

    // Post application data to external endpoint
    try {
      const externalResponse = await fetch('https://prlrorevvtfscbjaxqci.supabase.co/functions/v1/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });
      console.log("External endpoint response status:", externalResponse.status);
      const externalResult = await externalResponse.text();
      console.log("External endpoint response:", externalResult);
    } catch (externalError) {
      console.error("Error posting to external endpoint:", externalError);
      // Continue with email sending even if external post fails
    }

    // Sanitize all user input before inserting into HTML
    const s = {
      firstName: sanitize(applicationData.firstName),
      lastName: sanitize(applicationData.lastName),
      email: sanitize(applicationData.email),
      phone: sanitize(applicationData.phone),
      zipCode: sanitize(applicationData.zipCode),
      state: sanitize(applicationData.state),
      driverType: sanitize(applicationData.driverType),
      yearsExperience: sanitize(applicationData.yearsExperience),
      cdlNumber: sanitize(applicationData.cdlNumber),
      cdlState: sanitize(applicationData.cdlState),
      endorsements: (applicationData.endorsements || []).map(sanitize).join(', ') || 'None',
      accidentsLastThreeYears: sanitize(applicationData.accidentsLastThreeYears),
      violationsLastThreeYears: sanitize(applicationData.violationsLastThreeYears),
      freightExperience: (applicationData.freightExperience || []).map(sanitize).join(', ') || 'None specified',
      willingToTravel: sanitize(applicationData.willingToTravel),
      winterDrivingExperience: sanitize(applicationData.winterDrivingExperience),
      chainsExperience: sanitize(applicationData.chainsExperience),
      availableStartDate: sanitize(applicationData.availableStartDate),
    };

    // Email to team members
    const teamEmailHtml = `
      <h2>New Driver Application from ${s.firstName} ${s.lastName}</h2>
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h3>Contact Information</h3>
        <p><strong>Name:</strong> ${s.firstName} ${s.lastName}</p>
        <p><strong>Email:</strong> ${s.email}</p>
        <p><strong>Phone:</strong> ${s.phone}</p>
        <p><strong>Location:</strong> ${s.zipCode}, ${s.state}</p>

        <h3>Driver Type & Experience</h3>
        <p><strong>Driver Type:</strong> ${s.driverType}</p>
        <p><strong>Years of Experience:</strong> ${s.yearsExperience}</p>

        <h3>CDL Information</h3>
        <p><strong>CDL Number:</strong> ${s.cdlNumber}</p>
        <p><strong>CDL State:</strong> ${s.cdlState}</p>
        <p><strong>Endorsements:</strong> ${s.endorsements}</p>

        <h3>Driving Record</h3>
        <p><strong>Accidents (Last 3 Years):</strong> ${s.accidentsLastThreeYears}</p>
        <p><strong>Violations (Last 3 Years):</strong> ${s.violationsLastThreeYears}</p>

        <h3>Experience & Preferences</h3>
        <p><strong>Freight Experience:</strong> ${s.freightExperience}</p>
        <p><strong>Willing to Travel Nationwide:</strong> ${s.willingToTravel}</p>
        <p><strong>Winter Driving Experience:</strong> ${s.winterDrivingExperience}</p>
        <p><strong>Tire Chains Experience:</strong> ${s.chainsExperience}</p>
        <p><strong>Available Start Date:</strong> ${s.availableStartDate}</p>

        <p style="margin-top: 20px; padding: 10px; background-color: #f0f0f0; border-left: 4px solid #003366;">
          <strong>Action Required:</strong> Please follow up with this candidate as soon as possible.
        </p>
      </div>
    `;

    // Applicant confirmation email
    const applicantEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>Thank you for your application, ${s.firstName}!</h2>
        <p>We have received your driver application and appreciate your interest in joining the DeMar Transportation team.</p>

        <h3>Application Summary</h3>
        <p><strong>Name:</strong> ${s.firstName} ${s.lastName}</p>
        <p><strong>Location:</strong> ${s.zipCode}, ${s.state}</p>
        <p><strong>Experience:</strong> ${s.yearsExperience}</p>

        <p style="margin-top: 20px;">Our team will review your application and contact you within 24-48 hours if you meet our requirements.</p>

        <p style="margin-top: 20px;">If you have any questions, please contact us at:</p>
        <p>Email: info@demartransportation.com<br>
        Phone: (775) 230-4767</p>

        <p style="margin-top: 20px;">Thank you for considering DeMar Transportation!</p>
        <p><em>Driven by Purpose. Delivering Results.</em></p>
      </div>
    `;

    // Send using business domain with retry for rate limits
    const sendEmail = async (params: { to: string[]; subject: string; html: string; purpose: 'team' | 'applicant' }) => {
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

    // Send emails sequentially to avoid rate limits
    const teamEmails = ['erik@demartransportation.com', 'colby@demartransportation.com'];

    const teamResponse = await sendEmail({
      to: teamEmails,
      subject: `New Driver Application - ${s.firstName} ${s.lastName} (${s.driverType}, ${s.yearsExperience})`,
      html: teamEmailHtml,
      purpose: 'team',
    });

    // Small delay to avoid hitting Resend's per-second limits
    await new Promise((r) => setTimeout(r, 750));

    const applicantResponse = await sendEmail({
      to: [applicationData.email],
      subject: 'Driver Application Received - DeMar Transportation',
      html: applicantEmailHtml,
      purpose: 'applicant',
    });

    console.log("Team email result:", teamResponse);
    console.log("Applicant email result:", applicantResponse);

    if (teamResponse.error || applicantResponse.error) {
      throw new Error(`Email sending failed: ${teamResponse.error?.message || applicantResponse.error?.message}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Driver application submitted successfully and emails sent!" 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in send-driver-application function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to process driver application", 
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