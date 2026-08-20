export interface BudgetCategory {
  category: string;
  allocated: number;
  spent: number;
}

export interface UpdateBudgetDTO {
  category: string;
  allocated: number;
}
