import { createQuery, createMutation, useQueryClient } from "@tanstack/solid-query";
import { api, type UpdateBudgetDTO } from "@setupmoney/api";

export function useBudgetQuery() {
  return createQuery(() => ({
    queryKey: api.budget.keys.lists(),
    queryFn: ({ signal }) => api.budget.list({ signal }),
  }));
}

export function useBudgetCategoryDetailQuery(category: () => string) {
  return createQuery(() => ({
    queryKey: api.budget.keys.detail(category()),
    queryFn: ({ signal }) => api.budget.detail(category(), { signal }),
    enabled: Boolean(category()),
  }));
}

export function useUpdateBudgetMutation() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: (data: UpdateBudgetDTO) => api.budget.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: api.budget.keys.all });
    },
  }));
}
