import { useDashboardRoleDistribution } from "../../hooks/useDashboard";

export const useRoleDistribution = () => {
  const { data, isLoading, isError } = useDashboardRoleDistribution();

  return {
    isLoading,
    isError,
    roleBars: data ?? [],
  };
};
