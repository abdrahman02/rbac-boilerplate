import { Suspense } from "react";
import { VerifyEmail } from "@/features/auth/verify-email";

export const metadata = { title: "Verify Email - RBAC Boilerplate" };

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  );
}
