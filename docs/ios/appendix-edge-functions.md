# Appendix B: Edge Functions

**Purpose**: Document backend Edge Functions for iOS integration

---

## Overview

Chravel uses Supabase Edge Functions for:
1. **Stripe Integration** (checkout, subscription check, customer portal)
2. **AI Concierge** (routed through Lovable AI Gateway)
3. **Push Notifications** (send to APNs/FCM)

All functions are deployed automatically and accessible via:
```
https://jmjiyekmxwsxkfnqwyaa.functions.supabase.co/functions/v1/{function-name}
```

---

## 1. create-checkout

**Purpose**: Create Stripe Checkout session for subscription purchase

**Auth**: Required (JWT)

**Request**:
```json
{
  "price_id": "price_consumer_plus_monthly"
}
```

**Response**:
```json
{
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**iOS Usage**:
```swift
func createCheckout(priceId: String) async throws -> URL {
    let response = try await supabase.functions
        .invoke("create-checkout", options: FunctionInvokeOptions(
            body: ["price_id": priceId]
        ))
    
    struct CheckoutResponse: Codable {
        let url: String
    }
    
    let checkoutResponse = try JSONDecoder().decode(CheckoutResponse.self, from: response.data)
    
    guard let url = URL(string: checkoutResponse.url) else {
        throw URLError(.badURL)
    }
    
    return url
}
```

**Implementation** (`supabase/functions/create-checkout/index.ts`):
```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated");

    const { price_id } = await req.json();
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });
    
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId = customers.data[0]?.id;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [{ price: price_id, quantity: 1 }],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/success`,
      cancel_url: `${req.headers.get("origin")}/cancel`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
```

---

## 2. check-subscription

**Purpose**: Check user's current subscription status

**Auth**: Required (JWT)

**Request**: None (body optional)

**Response**:
```json
{
  "subscribed": true,
  "product_id": "prod_consumer_plus",
  "subscription_end": "2025-02-15T00:00:00Z"
}
```

**iOS Usage**:
```swift
func checkSubscription() async throws -> SubscriptionStatus {
    let response = try await supabase.functions
        .invoke("check-subscription")
    
    let decoder = JSONDecoder()
    decoder.dateDecodingStrategy = .iso8601
    
    return try decoder.decode(SubscriptionStatus.self, from: response.data)
}
```

**Implementation** (`supabase/functions/check-subscription/index.ts`):
```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found");
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

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
      productId = subscription.items.data[0].price.product;
      logStep("Active subscription found", { subscriptionId: subscription.id, productId });
    } else {
      logStep("No active subscription");
    }

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      product_id: productId,
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
```

---

## 3. customer-portal

**Purpose**: Generate Stripe Customer Portal URL for subscription management

**Auth**: Required (JWT)

**Request**: None

**Response**:
```json
{
  "url": "https://billing.stripe.com/session/..."
}
```

**iOS Usage**:
```swift
func openCustomerPortal() async throws -> URL {
    let response = try await supabase.functions
        .invoke("customer-portal")
    
    struct PortalResponse: Codable {
        let url: String
    }
    
    let portalResponse = try JSONDecoder().decode(PortalResponse.self, from: response.data)
    
    guard let url = URL(string: portalResponse.url) else {
        throw URLError(.badURL)
    }
    
    return url
}
```

**Implementation** (`supabase/functions/customer-portal/index.ts`):
```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil"
    });
    
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      throw new Error("No Stripe customer found");
    }
    
    const customerId = customers.data[0].id;

    const origin = req.headers.get("origin") || "https://chravel.app";
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/`,
    });

    return new Response(JSON.stringify({ url: portalSession.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
```

---

## 4. ai-concierge (Example)

**Purpose**: Route AI requests through Lovable AI Gateway

**Auth**: Required (JWT)

**Request**:
```json
{
  "prompt": "Suggest restaurants near Times Square",
  "trip_id": "trip-123",
  "context": {
    "dietary": ["vegetarian"],
    "budget": "moderate"
  }
}
```

**Response**:
```json
{
  "response": "Here are some great vegetarian restaurants near Times Square:\n\n1. Dirt Candy...",
  "sources": ["url1", "url2"]
}
```

**iOS Usage**:
```swift
func queryConcierge(prompt: String, tripId: String, context: [String: Any]) async throws -> String {
    let response = try await supabase.functions
        .invoke("ai-concierge", options: FunctionInvokeOptions(
            body: [
                "prompt": prompt,
                "trip_id": tripId,
                "context": context
            ]
        ))
    
    struct AIResponse: Codable {
        let response: String
        let sources: [String]?
    }
    
    let aiResponse = try JSONDecoder().decode(AIResponse.self, from: response.data)
    return aiResponse.response
}
```

**Implementation** (`supabase/functions/ai-concierge/index.ts`):
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, trip_id, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    // Build system prompt with context
    const systemPrompt = `You are a travel concierge assistant. User preferences:
- Dietary: ${context.dietary?.join(', ') || 'none'}
- Budget: ${context.budget || 'flexible'}
Provide helpful, personalized recommendations.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash", // Default model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ]
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('AI gateway error:', response.status, text);
      throw new Error('AI gateway error');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({
      response: aiResponse,
      sources: [] // Add web search sources if implemented
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('AI concierge error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

**CRITICAL**: Always call AI through Edge Functions, never directly from iOS with API keys.

---

## 5. send-push-notification (Future)

**Purpose**: Send push notifications to iOS devices via APNs

**Auth**: Required (JWT or Internal)

**Request**:
```json
{
  "user_id": "uuid",
  "title": "New Broadcast",
  "body": "Check out the latest update!",
  "type": "broadcast",
  "trip_id": "trip-123",
  "metadata": {}
}
```

**Response**:
```json
{
  "success": true,
  "sent": 1
}
```

**Implementation**: See `docs/ios/08-notifications.md` for full APNs integration

---

## Configuration (supabase/config.toml)

```toml
[functions.create-checkout]
verify_jwt = true

[functions.check-subscription]
verify_jwt = true

[functions.customer-portal]
verify_jwt = true

[functions.ai-concierge]
verify_jwt = true

[functions.send-push-notification]
verify_jwt = false  # If called by system, use internal secret validation
```

---

## Error Handling in iOS

```swift
enum EdgeFunctionError: Error {
    case invalidResponse
    case serverError(String)
    case unauthorized
    case rateLimited
}

func invokeFunction<T: Decodable>(
    name: String,
    body: [String: Any]? = nil
) async throws -> T {
    do {
        let options = body.map { FunctionInvokeOptions(body: $0) }
        let response = try await supabase.functions.invoke(name, options: options)
        return try JSONDecoder().decode(T.self, from: response.data)
    } catch {
        // Parse error response
        if let data = (error as? URLError)?.userInfo[NSUnderlyingErrorKey] as? Data,
           let errorResponse = try? JSONDecoder().decode(ErrorResponse.self, from: data) {
            throw EdgeFunctionError.serverError(errorResponse.error)
        }
        throw error
    }
}

struct ErrorResponse: Codable {
    let error: String
}
```

---

## Testing Edge Functions

Use Supabase CLI or Postman:

```bash
# Test locally
supabase functions serve create-checkout --env-file ./supabase/.env.local

# Test deployed
curl -X POST https://jmjiyekmxwsxkfnqwyaa.functions.supabase.co/functions/v1/check-subscription \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Next Steps

- Add webhook handlers for Stripe events
- Implement AI streaming responses
- Add request rate limiting
- Set up function monitoring/logging
- Create admin functions for data exports
