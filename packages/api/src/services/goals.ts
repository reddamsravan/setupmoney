import { Api } from "../client";
import { Endpoints } from "../endpoints";
import type { Goal, CreateGoalDTO } from "../types";

export const goalsApi = {
  list: (options?: RequestInit) => Api.get<Goal[]>(Endpoints.goals.list(), options),
  detail: (id: string, options?: RequestInit) => Api.get<Goal>(Endpoints.goals.detail(id), options),
  create: (data: CreateGoalDTO, options?: RequestInit) =>
    Api.post<Goal>(Endpoints.goals.list(), data, options),
};
