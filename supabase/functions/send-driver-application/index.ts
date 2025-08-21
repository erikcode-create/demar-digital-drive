import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface DriverApplication {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  state: string;
  yearsExperience: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const applicationData: DriverApplication = await req.json();
    console.log("Processing driver application:", applicationData);

    // Email to team members
    const teamEmailHtml = `
      <h2>New Driver Application from ${applicationData.firstName} ${applicationData.lastName}</h2>
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h3>Applicant Information</h3>
        <p><strong>Name:</strong> ${applicationData.firstName} ${applicationData.lastName}</p>
        <p><strong>Email:</strong> ${applicationData.email}</p>
        <p><strong>Phone:</strong> ${applicationData.phone}</p>
        <p><strong>Location:</strong> ${applicationData.zipCode}, ${applicationData.state}</p>
        <p><strong>Years of Experience:</strong> ${applicationData.yearsExperience}</p>
        
        <p style="margin-top: 20px;">Please follow up with this candidate as soon as possible.</p>
      </div>
    `;

    // Applicant confirmation email
    const applicantEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>Thank you for your application, ${applicationData.firstName}!</h2>
        <p>We have received your driver application and appreciate your interest in joining the DeMar Transportation team.</p>
        
        <h3>Application Summary</h3>
        <p><strong>Name:</strong> ${applicationData.firstName} ${applicationData.lastName}</p>
        <p><strong>Location:</strong> ${applicationData.zipCode}, ${applicationData.state}</p>
        <p><strong>Experience:</strong> ${applicationData.yearsExperience}</p>
        
        <p style="margin-top: 20px;">Our team will review your application and contact you within 24-48 hours if you meet our requirements.</p>
        
        <p style="margin-top: 20px;">If you have any questions, please contact us at:</p>
        <p>Email: info@demartransportation.com<br>
        Phone: ${applicationData.phone}</p>
        
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
    const teamEmails = ['erik@demartransportation.com', 'colby@demartransportation.com', 'info@demartransportation.com'];

    const teamResponse = await sendEmail({
      to: teamEmails,
      subject: `New Driver Application - ${applicationData.firstName} ${applicationData.lastName} (${applicationData.yearsExperience})`,
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