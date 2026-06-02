"use client";

import { PageHeader } from "@/shared/components/common";
import { Spinner } from "@/shared/components/ui";
import { BroadcastForm } from "./components/BroadcastForm";
import { useBroadcastPage } from "./hooks";

export function BroadcastPage() {
  const { roles, isLoadingRoles } = useBroadcastPage();

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <PageHeader
        title="Broadcast Notification"
        description="Kirim notifikasi ke semua user berdasarkan role yang dipilih."
      />

      {isLoadingRoles ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-6">
          <BroadcastForm roles={roles} />
        </div>
      )}
    </div>
  );
}
