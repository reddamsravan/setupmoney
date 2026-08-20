import { createQuery, createMutation, useQueryClient } from "@tanstack/solid-query";
import { apiService, type CreateGoalDTO } from "@setupmoney/api";
import { goalKeys } from "./query-keys";

export function useGoalsQuery() {
  return createQuery(() => ({
    queryKey: goalKeys.lists(),
    queryFn: ({ signal }) => apiService.goals.list({ signal }),
  }));
}

export function useGoalDetailQuery(id: () => string) {
  return createQuery(() => ({
    queryKey: goalKeys.detail(id()),
    queryFn: ({ signal }) => apiService.goals.detail(id(), { signal }),
    enabled: Boolean(id()),
  }));
}

export function useCreateGoalMutation() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: (data: CreateGoalDTO) => apiService.goals.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  }));
}
