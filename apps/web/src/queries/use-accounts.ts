import { createQuery, createMutation, useQueryClient } from "@tanstack/solid-query";
import { api, type CreateAccountDTO } from "@setupmoney/api";

export function useAccountsQuery() {
  return createQuery(() => ({
    queryKey: api.accounts.keys.lists(),
    queryFn: ({ signal }) => api.accounts.list({ signal }),
  }));
}

export function useAccountDetailQuery(id: () => string) {
  return createQuery(() => ({
    queryKey: api.accounts.keys.detail(id()),
    queryFn: ({ signal }) => api.accounts.detail(id(), { signal }),
    enabled: Boolean(id()),
  }));
}

export function useCreateAccountMutation() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: (data: CreateAccountDTO) => api.accounts.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: api.accounts.keys.all });
    },
  }));
}
