import { createQuery, createMutation, useQueryClient } from "@tanstack/solid-query";
import { api, type CreateGoalDTO } from "@setupmoney/api";

export function useGoalsQuery() {
  return createQuery(() => ({
    queryKey: api.goals.keys.lists(),
    queryFn: ({ signal }) => api.goals.list({ signal }),
  }));
}

export function useGoalDetailQuery(id: () => string) {
  return createQuery(() => ({
    queryKey: api.goals.keys.detail(id()),
    queryFn: ({ signal }) => api.goals.detail(id(), { signal }),
    enabled: Boolean(id()),
  }));
}

export function useCreateGoalMutation() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: (data: CreateGoalDTO) => api.goals.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: api.goals.keys.all });
    },
  }));
}
