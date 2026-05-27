import { type AuthenticatedUser, authenticatedUserSchema } from "@/shared/types";
import { apiClient } from "@/shared/lib/api-client";
import type { RegisterInput } from "./register.schema";

/** Only these three fields are sent to the backend — confirmPassword is omitted. */
type RegisterApiInput = Pick<RegisterInput, "name" | "email" | "password">;

/**
 * Sends registration data to the server and returns the authenticated user.
 * Uses Zod parse (not `as` cast) to validate the server response.
 */
export async function registerApi(data: RegisterApiInput): Promise<AuthenticatedUser> {
  const response = await apiClient.post("/auth/register", data);
  return authenticatedUserSchema.parse(response.data.data);
}
