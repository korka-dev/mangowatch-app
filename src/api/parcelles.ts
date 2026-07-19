import { apiClient } from "./client";
import { Parcelle } from "./types";

export async function listParcelles(): Promise<Parcelle[]> {
  const { data } = await apiClient.get<Parcelle[]>("/parcelles/");
  return data;
}

export async function createParcelle(payload: {
  nom: string;
  latitude: number;
  longitude: number;
}): Promise<Parcelle> {
  const { data } = await apiClient.post<Parcelle>("/parcelles/", payload);
  return data;
}

export async function deleteParcelle(id: string): Promise<void> {
  await apiClient.delete(`/parcelles/${id}`);
}
