import { createQuery, createMutation, useQueryClient } from "@tanstack/solid-query";
import {
  apiService,
  type CreateTransactionDTO,
  type TransactionFilterParams,
} from "@setupmoney/api";
import { transactionKeys, accountKeys, budgetKeys, reportKeys } from "./query-keys";

export function useTransactionsQuery(params: () => TransactionFilterParams | undefined) {
  return createQuery(() => ({
    queryKey: transactionKeys.list(params()),
    queryFn: ({ signal }) => apiService.transactions.list(params(), { signal }),
  }));
}

export function useTransactionDetailQuery(id: () => string) {
  return createQuery(() => ({
    queryKey: transactionKeys.detail(id()),
    queryFn: ({ signal }) => apiService.transactions.detail(id(), { signal }),
    enabled: Boolean(id()),
  }));
}

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: (data: CreateTransactionDTO) => apiService.transactions.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
    },
  }));
}
