import { Api } from "../client";
import { Endpoints } from "../endpoints";
import type { BudgetCategory, UpdateBudgetDTO } from "../types";

export const budgetApi = {
  list: (options?: RequestInit) => Api.get<BudgetCategory[]>(Endpoints.budget.list(), options),
  detail: (category: string, options?: RequestInit) =>
    Api.get<BudgetCategory>(Endpoints.budget.detail(category), options),
  update: (data: UpdateBudgetDTO, options?: RequestInit) =>
    Api.put<BudgetCategory>(Endpoints.budget.list(), data, options),
};
