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

// Classes du modele TFLite. "sain" est confirme ; les autres sont des
// placeholders (classe_1..classe_6) en attendant les vrais noms/couleurs.
export const maladieColors: Record<string, string> = {
  sain: "#2F8F3F",
  classe_1: "#D64545",
  classe_2: "#B5651D",
  classe_3: "#4A4A4A",
  classe_4: "#8E44AD",
  classe_5: "#2980B9",
  classe_6: "#D68910",
};

export const maladieLabels: Record<string, string> = {
  sain: "Sain",
  classe_1: "Classe 1",
  classe_2: "Classe 2",
  classe_3: "Classe 3",
  classe_4: "Classe 4",
  classe_5: "Classe 5",
  classe_6: "Classe 6",
};

export const DEFAULT_MALADIE_COLOR = "#5C6B5E";

export const niveauColors: Record<string, string> = {
  faible: "#2F8F3F",
  moyen: "#E0A800",
  eleve: "#D64545",
};
