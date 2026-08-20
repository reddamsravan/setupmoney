export interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

export interface CreateAccountDTO {
  name: string;
  balance: number;
  currency: string;
}
