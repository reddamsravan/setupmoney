export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
}

export interface CreateTransactionDTO {
  amount: number;
  category: string;
  date: string;
}

export interface UpdateTransactionDTO extends Partial<CreateTransactionDTO> {}

export interface TransactionFilterParams {
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}
