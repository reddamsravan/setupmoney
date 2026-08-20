import { createQuery, createMutation, useQueryClient } from "@tanstack/solid-query";
import { api, type CreateTransactionDTO, type TransactionFilterParams } from "@setupmoney/api";

export function useTransactionsQuery(params: () => TransactionFilterParams | undefined) {
  return createQuery(() => ({
    queryKey: api.transactions.keys.list(params()),
    queryFn: ({ signal }) => api.transactions.list(params(), { signal }),
  }));
}

export function useTransactionDetailQuery(id: () => string) {
  return createQuery(() => ({
    queryKey: api.transactions.keys.detail(id()),
    queryFn: ({ signal }) => api.transactions.detail(id(), { signal }),
    enabled: Boolean(id()),
  }));
}

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: (data: CreateTransactionDTO) => api.transactions.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: api.transactions.keys.all });
      queryClient.invalidateQueries({ queryKey: api.accounts.keys.all });
      queryClient.invalidateQueries({ queryKey: api.budget.keys.all });
      queryClient.invalidateQueries({ queryKey: api.reports.keys.all });
    },
  }));
}
