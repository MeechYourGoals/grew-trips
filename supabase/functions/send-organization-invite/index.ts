import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "npm:resend@2.0.0";
import { createSecureResponse, createErrorResponse, createOptionsResponse } from "../_shared/securityHeaders.ts";

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-ORG-INVITE] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return createOptionsResponse();
  }

  try {
    logStep("Function started");

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY is not set");
    
    const appUrl = Deno.env.get("APP_URL") || "https://chravel.app";
    logStep("Environment verified", { appUrl });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    const { email, phone, organization_name, organization_id, role, invite_token } = await req.json();
    logStep("Sending invitation", { email, phone, organization_name, role });

    // Send email invitation via Resend
    if (email) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "Chravel <invites@chravel.app>",
        to: [email],
        subject: `You're invited to join ${organization_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Welcome to ${organization_name}</h1>
            <p style="font-size: 16px; color: #555;">
              You've been invited to join as a <strong>${role}</strong>.
            </p>
            <p style="margin: 30px 0;">
              <a href="${appUrl}/accept-invite?token=${invite_token}" 
                 style="background: #0066FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Accept Invitation
              </a>
            </p>
            <p style="font-size: 14px; color: #888;">
              If you didn't expect this invitation, you can safely ignore this email.
            </p>
          </div>
        `
      });
      logStep("Email sent successfully", { email });
    }

    // SMS invitation placeholder (for future Twilio integration)
    if (phone) {
      logStep("SMS invitation requested (not yet implemented)", { phone });
      // TODO: Implement Twilio SMS sending
    }

    return createSecureResponse({ success: true, sent_email: !!email, sent_sms: false });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in send-organization-invite", { message: errorMessage });
    return createErrorResponse(errorMessage, 500);
  }
});
