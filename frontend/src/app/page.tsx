"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/shared/hooks";

export default function HomePage() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div>Loading...</div>
    </div>
  );
}
