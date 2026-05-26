import { useMemo } from "react";
import { useRoles } from "@/features/roles/hooks/useRoles";
import { useUsers } from "@/features/users/hooks";

const MAX_USERS_FOR_DISTRIBUTION = 200;

interface RoleBar {
  id: number;
  name: string;
  count: number;
  pct: number;
}

export const useRoleDistribution = () => {
  const rolesQuery = useRoles();
  const usersQuery = useUsers(1, MAX_USERS_FOR_DISTRIBUTION);

  const roles = rolesQuery.data ?? [];
  const users = usersQuery.data?.data ?? [];
  const isLoading = rolesQuery.isLoading || usersQuery.isLoading;
  const isError = rolesQuery.isError || usersQuery.isError;

  const roleBars = useMemo<RoleBar[]>(() => {
    const roleCountMap = users.reduce<Record<string, number>>((acc, u) => {
      for (const roleName of u.roles) {
        acc[roleName] = (acc[roleName] ?? 0) + 1;
      }
      return acc;
    }, {});

    return roles.slice(0, 6).map((role) => {
      const count = roleCountMap[role.name] ?? 0;
      const pct = users.length > 0 ? Math.round((count / users.length) * 100) : 0;
      return { id: role.id, name: role.name, count, pct };
    });
  }, [roles, users]);

  return {
    isLoading,
    isError,
    roleBars,
  };
};
