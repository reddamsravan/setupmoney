import { accountsApi } from "./accounts";
import { transactionsApi } from "./transactions";
import { budgetApi } from "./budget";
import { goalsApi } from "./goals";
import { assetsApi } from "./assets";
import { reportsApi } from "./reports";

export const apiService = {
  accounts: accountsApi,
  transactions: transactionsApi,
  budget: budgetApi,
  goals: goalsApi,
  assets: assetsApi,
  reports: reportsApi,
};
