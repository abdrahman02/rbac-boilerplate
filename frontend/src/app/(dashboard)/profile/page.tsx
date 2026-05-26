"use client";

import { useAuth } from "@/shared/hooks";

export default function ProfilePage() {
  const { user } = useAuth();
  console.log({ user });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Profile</h1>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <dl className="divide-y divide-gray-200">
          <div className="px-4 py-6 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">Name</dt>
            <dd className="mt-1 text-sm text-gray-600">{user?.name}</dd>
          </div>
          <div className="px-4 py-6 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">Email</dt>
            <dd className="mt-1 text-sm text-gray-600">{user?.email}</dd>
          </div>
          <div className="px-4 py-6 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">Roles</dt>
            <dd className="mt-1 flex flex-wrap gap-2">
              {user?.roles?.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800"
                >
                  {role}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
