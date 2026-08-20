import { Api } from "../client";
import { Endpoints } from "../endpoints";
import type { Transaction, CreateTransactionDTO, TransactionFilterParams } from "../types";

export const transactionsApi = {
  list: (params?: TransactionFilterParams, options?: RequestInit) =>
    Api.get<Transaction[]>(Endpoints.transactions.list(params), options),
  detail: (id: string, options?: RequestInit) =>
    Api.get<Transaction>(Endpoints.transactions.detail(id), options),
  create: (data: CreateTransactionDTO, options?: RequestInit) =>
    Api.post<Transaction>(Endpoints.transactions.list(), data, options),
};
