import { accountHandlers } from "./accounts";
import { transactionHandlers } from "./transactions";
import { budgetHandlers } from "./budget";
import { goalHandlers } from "./goals";
import { assetHandlers } from "./assets";
import { reportHandlers } from "./reports";

export const handlers = [
  ...accountHandlers,
  ...transactionHandlers,
  ...budgetHandlers,
  ...goalHandlers,
  ...assetHandlers,
  ...reportHandlers,
];
