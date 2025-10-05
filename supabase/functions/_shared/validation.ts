import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Organization invite validation schemas
export const InviteOrganizationMemberSchema = z.object({
  organizationId: z.string().uuid("Invalid organization ID format"),
  email: z.string().email("Invalid email address").max(255, "Email too long"),
  role: z.enum(['admin', 'member'], {
    errorMap: () => ({ message: "Role must be either 'admin' or 'member'" })
  })
});

export const AcceptInviteSchema = z.object({
  token: z.string().uuid("Invalid token format")
});

export const LinkTripToOrgSchema = z.object({
  tripId: z.string()
    .min(1, "Trip ID is required")
    .max(50, "Trip ID too long")
    .regex(/^[a-zA-Z0-9_-]+$/, "Trip ID contains invalid characters"),
  organizationId: z.string().uuid("Invalid organization ID format")
});

// Generic validation helper
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        error: `${firstError.path.join('.')}: ${firstError.message}`
      };
    }
    return { success: false, error: 'Invalid input data' };
  }
}

// Input sanitization helpers
export function sanitizeString(input: string, maxLength: number = 1000): string {
  return input
    .replace(/[<>'"]/g, '') // Remove potentially dangerous characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .substring(0, maxLength);
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim().substring(0, 255);
}
