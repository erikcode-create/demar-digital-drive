import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const ALLOWED_ORIGINS = [
  "https://staging.demartransportation.com",
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

function sanitize(str: string): string {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface OwnerOperatorSignup {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  yearsExperience: string;
  truckType: string;
  trailerAccess: string;
  operatingStatus: string;
  startTimeframe: string;
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(clientIp)) {
    return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
      status: 429,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const signupData: OwnerOperatorSignup = await req.json();

    if (
      !signupData.firstName ||
      !signupData.lastName ||
      !signupData.email ||
      !signupData.phone ||
      !signupData.city ||
      !signupData.state ||
      !signupData.yearsExperience
    ) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      return new Response(JSON.stringify({ error: "Invalid email address." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const s = {
      firstName: sanitize(signupData.firstName),
      lastName: sanitize(signupData.lastName),
      email: sanitize(signupData.email),
      phone: sanitize(signupData.phone),
      city: sanitize(signupData.city),
      state: sanitize(signupData.state),
      yearsExperience: sanitize(signupData.yearsExperience),
      truckType: sanitize(signupData.truckType),
      trailerAccess: sanitize(signupData.trailerAccess),
      operatingStatus: sanitize(signupData.operatingStatus),
      startTimeframe: sanitize(signupData.startTimeframe),
      notes: sanitize(signupData.notes || ""),
    };

    console.log("Processing owner-operator signup from:", s.firstName, s.lastName);

    const teamEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 640px;">
        <h2>New Owner Operator Signup from ${s.firstName} ${s.lastName}</h2>

        <h3>Contact Information</h3>
        <p><strong>Name:</strong> ${s.firstName} ${s.lastName}</p>
        <p><strong>Email:</strong> ${s.email}</p>
        <p><strong>Phone:</strong> ${s.phone}</p>
        <p><strong>Location:</strong> ${s.city}, ${s.state}</p>

        <h3>Owner Operator Details</h3>
        <p><strong>Years CDL-A Experience:</strong> ${s.yearsExperience}</p>
        <p><strong>Truck Type:</strong> ${s.truckType || "Not specified"}</p>
        <p><strong>Trailer Access:</strong> ${s.trailerAccess || "Not specified"}</p>
        <p><strong>Current Operating Status:</strong> ${s.operatingStatus || "Not specified"}</p>
        <p><strong>Preferred Start Timeframe:</strong> ${s.startTimeframe || "Not specified"}</p>
        ${s.notes ? `<h3>Notes</h3><p style="white-space: pre-wrap;">${s.notes}</p>` : ""}

        <p style="margin-top: 20px; padding: 12px; background-color: #f0f0f0; border-left: 4px solid #d6a926;">
          <strong>Action Required:</strong> Follow up with this owner-operator candidate about the 90% of profits program, weekly settlement statements, fuel discounts, insurance savings, dispatch, and back office support.
        </p>
      </div>
    `;

    const applicantEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 640px;">
        <h2>Owner Operator Signup Received</h2>
        <p>Thank you, ${s.firstName}. We received your owner-operator signup for DeMar Transportation.</p>
        <p>Our team will review your information and reach out to discuss the program, including 90% of profits, weekly settlement statements, fuel discounts, insurance savings, dispatch, and back office support.</p>

        <h3>Your Signup Summary</h3>
        <p><strong>Name:</strong> ${s.firstName} ${s.lastName}</p>
        <p><strong>Location:</strong> ${s.city}, ${s.state}</p>
        <p><strong>Experience:</strong> ${s.yearsExperience}</p>
        <p><strong>Truck Type:</strong> ${s.truckType || "Not specified"}</p>

        <p style="margin-top: 20px;">If you have questions before we call, contact us directly:</p>
        <p>Email: info@DeMarTransportation.com<br>
        Phone: (775) 230-4767</p>

        <p style="margin-top: 20px;"><em>DeMar Transportation</em></p>
      </div>
    `;

    const sendEmail = async (params: { to: string[]; subject: string; html: string; purpose: "team" | "applicant" }) => {
      const attempt = async () => {
        return await resend.emails.send({
          from: "DeMar Transportation <info@demartransportation.com>",
          to: params.to,
          subject: params.subject,
          html: params.html,
          reply_to: "info@demartransportation.com",
        } as Parameters<typeof resend.emails.send>[0]);
      };

      let response = await attempt();
      let retries = 0;
      while (
        response.error &&
        ((response.error as Record<string, unknown>).statusCode === 429 ||
          (response.error as Record<string, unknown>).name === "rate_limit_exceeded") &&
        retries < 2
      ) {
        const delay = 700 * (retries + 1);
        console.log(`Rate limited on ${params.purpose} email, retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        response = await attempt();
        retries++;
      }
      return response;
    };

    const teamResponse = await sendEmail({
      to: [
        "erik@demartransportation.com",
        "colby@demartransportation.com",
        "info@DeMarTransportation.com",
      ],
      subject: `Owner Operator Signup - ${s.firstName} ${s.lastName} (${s.state}, ${s.yearsExperience})`,
      html: teamEmailHtml,
      purpose: "team",
    });

    await new Promise((resolve) => setTimeout(resolve, 750));

    const applicantResponse = await sendEmail({
      to: [signupData.email],
      subject: "Owner Operator Signup Received - DeMar Transportation",
      html: applicantEmailHtml,
      purpose: "applicant",
    });

    console.log("Team email result:", teamResponse);
    console.log("Applicant email result:", applicantResponse);

    if (teamResponse.error || applicantResponse.error) {
      throw new Error(`Email sending failed: ${teamResponse.error?.message || applicantResponse.error?.message}`);
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Owner operator signup submitted successfully.",
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in send-owner-operator-signup function:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process owner operator signup",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
};

serve(handler);
