import { Suspense } from "react";
import { VerifyEmailSent } from "@/features/auth/verify-email-sent";

export const metadata = { title: "Verify Your Email - RBAC Boilerplate" };

export default function VerifyEmailSentPage() {
  return (
    <Suspense>
      <VerifyEmailSent />
    </Suspense>
  );
}
