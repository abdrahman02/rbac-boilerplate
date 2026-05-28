import { apiClient } from "@/shared/lib/api-client";
import { type AuthenticatedUser, authenticatedUserSchema } from "@/shared/types";
import type { LoginInput } from "./LoginForm.schema";

/**
 * Sends login credentials to the server and returns the authenticated user.
 */
export async function loginApi(data: LoginInput): Promise<AuthenticatedUser> {
  const response = await apiClient.post("/auth/login", data);
  return authenticatedUserSchema.parse(response.data.data);
}
