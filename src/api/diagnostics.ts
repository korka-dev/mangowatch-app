import { apiClient } from "./client";
import { Diagnostic } from "./types";

export async function listDiagnostics(): Promise<Diagnostic[]> {
  const { data } = await apiClient.get<Diagnostic[]>("/diagnostics/");
  return data;
}

export async function analyzeImage(imageUri: string, parcelleId?: string | null): Promise<Diagnostic> {
  const formData = new FormData();
  const filename = imageUri.split("/").pop() || "photo.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1] === "jpg" ? "jpeg" : match[1]}` : "image/jpeg";

  formData.append("file", {
    uri: imageUri,
    name: filename,
    type,
  } as unknown as Blob);

  if (parcelleId) {
    formData.append("parcelle_id", parcelleId);
  }

  const { data } = await apiClient.post<Diagnostic>("/diagnostics/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
