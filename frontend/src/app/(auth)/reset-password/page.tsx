import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/reset-password";

export const metadata = { title: "Reset Password - RBAC Boilerplate" };

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
