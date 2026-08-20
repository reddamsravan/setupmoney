import { createQuery, createMutation, useQueryClient } from "@tanstack/solid-query";
import { apiService, type CreateAssetDTO } from "@setupmoney/api";
import { assetKeys, reportKeys } from "./query-keys";

export function useAssetsQuery() {
  return createQuery(() => ({
    queryKey: assetKeys.lists(),
    queryFn: ({ signal }) => apiService.assets.list({ signal }),
  }));
}

export function useAssetDetailQuery(id: () => string) {
  return createQuery(() => ({
    queryKey: assetKeys.detail(id()),
    queryFn: ({ signal }) => apiService.assets.detail(id(), { signal }),
    enabled: Boolean(id()),
  }));
}

export function useCreateAssetMutation() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: (data: CreateAssetDTO) => apiService.assets.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assetKeys.all });
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
    },
  }));
}
