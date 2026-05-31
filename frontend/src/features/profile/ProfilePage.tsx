"use client";

import { memo } from "react";
import { PageHeader } from "@/shared/components/common";
import { Spinner } from "@/shared/components/ui";
import {
  ChangePasswordModal,
  EditProfileModal,
  PermissionsCard,
  ProfileCard,
  RolesCard,
  SecurityCard,
} from "./components";
import { useProfile } from "./hooks";

export const ProfilePage = memo(function ProfilePage() {
  const {
    user,
    isLoading,
    roles,
    permissions,
    isEditProfileOpen,
    openEditProfile,
    closeEditProfile,
    isChangePasswordOpen,
    openChangePassword,
    closeChangePassword,
  } = useProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Profile" description="Your account, roles, and the permissions inherited from them." />

      <ProfileCard name={user.name} email={user.email} onEditProfile={openEditProfile} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <RolesCard roles={roles} />
        <PermissionsCard permissions={permissions} />
      </div>

      <SecurityCard onChangePassword={openChangePassword} />

      <EditProfileModal isOpen={isEditProfileOpen} onClose={closeEditProfile} />
      <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={closeChangePassword} />
    </div>
  );
});
