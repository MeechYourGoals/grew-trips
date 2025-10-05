import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { createSecureResponse, createErrorResponse, createOptionsResponse } from "../_shared/securityHeaders.ts";

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return createOptionsResponse();
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating unsubscribed state");
      return createSecureResponse({ subscribed: false });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Update profile with stripe_customer_id if not set
    await supabaseClient
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('user_id', user.id);

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    
    const hasActiveSub = subscriptions.data.length > 0;
    let productId = null;
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
      
      productId = subscription.items.data[0].price.product as string;
      logStep("Determined subscription tier", { productId });

      // Update profile with subscription info
      await supabaseClient
        .from('profiles')
        .update({ subscription_product_id: productId })
        .eq('user_id', user.id);

      // Grant pro role if it's a pro product
      if (productId.startsWith('prod_TBIi')) { // All Pro products start with this
        await supabaseClient
          .from('user_roles')
          .insert({ user_id: user.id, role: 'pro' })
          .onConflict('user_id,role')
          .select();
        logStep("Pro role granted");
      }
    } else {
      logStep("No active subscription found");
      
      // Remove subscription info
      await supabaseClient
        .from('profiles')
        .update({ subscription_product_id: null })
        .eq('user_id', user.id);
    }

    return createSecureResponse({
      subscribed: hasActiveSub,
      product_id: productId,
      subscription_end: subscriptionEnd
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return createErrorResponse(errorMessage, 500);
  }
});
