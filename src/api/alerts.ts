import { apiClient } from "./client";
import { Alerte } from "./types";

export async function listAlerts(): Promise<Alerte[]> {
  const { data } = await apiClient.get<Alerte[]>("/alerts/");
  return data;
}

export async function simulateAlert(parcelleId?: string | null): Promise<Alerte> {
  const { data } = await apiClient.post<Alerte>("/alerts/simulate", {
    parcelle_id: parcelleId ?? null,
  });
  return data;
}

export async function markAlertRead(id: string): Promise<Alerte> {
  const { data } = await apiClient.patch<Alerte>(`/alerts/${id}/lue`);
  return data;
}
