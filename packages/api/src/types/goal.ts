export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export interface CreateGoalDTO {
  name: string;
  targetAmount: number;
  currentAmount: number;
}
