import { Api } from "../client";
import { Endpoints } from "../endpoints";
import type { Asset, CreateAssetDTO } from "../types";

export const assetsApi = {
  list: (options?: RequestInit) => Api.get<Asset[]>(Endpoints.assets.list(), options),
  detail: (id: string, options?: RequestInit) =>
    Api.get<Asset>(Endpoints.assets.detail(id), options),
  create: (data: CreateAssetDTO, options?: RequestInit) =>
    Api.post<Asset>(Endpoints.assets.list(), data, options),
};
