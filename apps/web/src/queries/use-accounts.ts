import { createQuery, createMutation, useQueryClient } from "@tanstack/solid-query";
import { apiService, type CreateAccountDTO } from "@setupmoney/api";
import { accountKeys } from "./query-keys";

export function useAccountsQuery() {
  return createQuery(() => ({
    queryKey: accountKeys.lists(),
    queryFn: ({ signal }) => apiService.accounts.list({ signal }),
  }));
}

export function useAccountDetailQuery(id: () => string) {
  return createQuery(() => ({
    queryKey: accountKeys.detail(id()),
    queryFn: ({ signal }) => apiService.accounts.detail(id(), { signal }),
    enabled: Boolean(id()),
  }));
}

export function useCreateAccountMutation() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: (data: CreateAccountDTO) => apiService.accounts.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  }));
}
