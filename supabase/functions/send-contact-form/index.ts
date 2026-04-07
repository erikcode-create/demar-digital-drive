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

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
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
    const data: ContactFormData = await req.json();

    if (!data.name || !data.email || !data.message) {
      return new Response(JSON.stringify({ error: "Name, email, and message are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return new Response(JSON.stringify({ error: "Invalid email address." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const s = {
      name: sanitize(data.name),
      email: sanitize(data.email),
      phone: sanitize(data.phone),
      message: sanitize(data.message),
    };

    console.log("Processing contact form from:", s.name);

    const teamEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${s.name}</p>
        <p><strong>Email:</strong> ${s.email}</p>
        ${s.phone ? `<p><strong>Phone:</strong> ${s.phone}</p>` : ''}
        <h3>Message</h3>
        <p style="white-space: pre-wrap;">${s.message}</p>
      </div>
    `;

    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>Thank you for contacting DeMar Transportation, ${s.name}!</h2>
        <p>We received your message and will respond within 1 business day.</p>
        <h3>Your Message</h3>
        <p style="white-space: pre-wrap;">${s.message}</p>
        <p style="margin-top: 20px;">If you need immediate assistance, call us at:</p>
        <p>Phone: (775) 230-4767 (24/7 dispatch)<br>
        Email: info@DeMarTransportation.com</p>
        <p style="margin-top: 20px;"><em>DeMar Transportation</em></p>
      </div>
    `;

    const sendEmail = async (params: { to: string[]; subject: string; html: string; purpose: string }) => {
      const attempt = async () => {
        return await resend.emails.send({
          from: 'DeMar Transportation <info@demartransportation.com>',
          to: params.to,
          subject: params.subject,
          html: params.html,
          reply_to: 'info@demartransportation.com',
        } as Parameters<typeof resend.emails.send>[0]);
      };

      let response = await attempt();
      let retries = 0;
      while (
        response.error &&
        ((response.error as Record<string, unknown>).statusCode === 429 || (response.error as Record<string, unknown>).name === 'rate_limit_exceeded') &&
        retries < 2
      ) {
        const delay = 700 * (retries + 1);
        console.log(`Rate limited on ${params.purpose} email, retrying in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
        response = await attempt();
        retries++;
      }
      return response;
    };

    const teamResponse = await sendEmail({
      to: ['info@DeMarTransportation.com'],
      subject: `Contact Form - ${s.name}`,
      html: teamEmailHtml,
      purpose: 'team',
    });

    await new Promise((r) => setTimeout(r, 750));

    const customerResponse = await sendEmail({
      to: [data.email],
      subject: 'Message Received - DeMar Transportation',
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
      message: "Message sent successfully!",
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: unknown) {
    console.error("Error in send-contact-form function:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to send message",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
