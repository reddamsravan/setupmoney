import { createQuery, createMutation, useQueryClient } from "@tanstack/solid-query";
import { api, type CreateAssetDTO } from "@setupmoney/api";

export function useAssetsQuery() {
  return createQuery(() => ({
    queryKey: api.assets.keys.lists(),
    queryFn: ({ signal }) => api.assets.list({ signal }),
  }));
}

export function useAssetDetailQuery(id: () => string) {
  return createQuery(() => ({
    queryKey: api.assets.keys.detail(id()),
    queryFn: ({ signal }) => api.assets.detail(id(), { signal }),
    enabled: Boolean(id()),
  }));
}

export function useCreateAssetMutation() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: (data: CreateAssetDTO) => api.assets.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: api.assets.keys.all });
      queryClient.invalidateQueries({ queryKey: api.reports.keys.all });
    },
  }));
}
