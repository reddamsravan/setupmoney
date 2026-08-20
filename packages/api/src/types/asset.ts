export interface Asset {
  id: string;
  name: string;
  value: number;
  type: string;
}

export interface CreateAssetDTO {
  name: string;
  value: number;
  type: string;
}
