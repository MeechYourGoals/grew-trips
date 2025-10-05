import { corsHeaders } from "./cors.ts";

// Enhanced security headers for all edge functions
export const securityHeaders = {
  ...corsHeaders,
  'Content-Type': 'application/json',
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',
  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Content Security Policy
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:;",
  // HTTP Strict Transport Security (HSTS)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  // Permissions Policy (formerly Feature Policy)
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

// Helper to create consistent response with security headers
export function createSecureResponse(
  body: unknown,
  status: number = 200,
  additionalHeaders: Record<string, string> = {}
): Response {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        ...securityHeaders,
        ...additionalHeaders
      }
    }
  );
}

// Helper for error responses
export function createErrorResponse(
  error: string | Error,
  status: number = 400
): Response {
  const message = typeof error === 'string' ? error : error.message;
  return createSecureResponse(
    { error: message },
    status
  );
}

// Helper for OPTIONS (CORS preflight) responses
export function createOptionsResponse(): Response {
  return new Response(null, { headers: corsHeaders });
}
