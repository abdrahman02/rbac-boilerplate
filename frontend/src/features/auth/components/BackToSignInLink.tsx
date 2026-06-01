import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function BackToSignInLink() {
  return (
    <Link href="/login" className="text-primary font-medium no-underline inline-flex items-center gap-1">
      <ChevronLeft size={14} />
      Back to sign in
    </Link>
  );
}
