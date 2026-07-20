export const colors = {
  background: "#F6FBF4",
  surface: "#FFFFFF",
  primary: "#2F8F3F",
  primaryDark: "#1F6E2E",
  accent: "#F2A93B",
  danger: "#D64545",
  warning: "#E0A800",
  text: "#1B2B1E",
  textMuted: "#5C6B5E",
  border: "#DDEBD9",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
};

// Classes reelles du modele (MobileNetV3-Large + LR-ASPP, 7 classes).
export const maladieColors: Record<string, string> = {
  background: "#5C6B5E",
  Healthy: "#2F8F3F",
  Anthracnose: "#D64545",
  "Bacterial Canker": "#B5651D",
  Lasiodiplodia: "#8E44AD",
  Lichens: "#2980B9",
  Pestalotia: "#D68910",
};

export const maladieLabels: Record<string, string> = {
  background: "Fond",
  Healthy: "Saine",
  Anthracnose: "Anthracnose",
  "Bacterial Canker": "Chancre bacterien",
  Lasiodiplodia: "Lasiodiplodia",
  Lichens: "Lichens",
  Pestalotia: "Pestalotiose",
};

export const DEFAULT_MALADIE_COLOR = "#5C6B5E";

export const niveauColors: Record<string, string> = {
  faible: "#2F8F3F",
  moyen: "#E0A800",
  eleve: "#D64545",
};
