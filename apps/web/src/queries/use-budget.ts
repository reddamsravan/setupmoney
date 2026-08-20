import { createQuery, createMutation, useQueryClient } from "@tanstack/solid-query";
import { apiService, type UpdateBudgetDTO } from "@setupmoney/api";
import { budgetKeys } from "./query-keys";

export function useBudgetQuery() {
  return createQuery(() => ({
    queryKey: budgetKeys.lists(),
    queryFn: ({ signal }) => apiService.budget.list({ signal }),
  }));
}

export function useBudgetCategoryDetailQuery(category: () => string) {
  return createQuery(() => ({
    queryKey: budgetKeys.detail(category()),
    queryFn: ({ signal }) => apiService.budget.detail(category(), { signal }),
    enabled: Boolean(category()),
  }));
}

export function useUpdateBudgetMutation() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: (data: UpdateBudgetDTO) => apiService.budget.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    },
  }));
}
