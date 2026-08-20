import { Api } from "../client";
import { Endpoints } from "../endpoints";
import type { Account, CreateAccountDTO } from "../types";

export const accountsApi = {
  list: (options?: RequestInit) => Api.get<Account[]>(Endpoints.accounts.list(), options),
  detail: (id: string, options?: RequestInit) =>
    Api.get<Account>(Endpoints.accounts.detail(id), options),
  create: (data: CreateAccountDTO, options?: RequestInit) =>
    Api.post<Account>(Endpoints.accounts.list(), data, options),
};
