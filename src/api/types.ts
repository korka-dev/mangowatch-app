// Les classes exactes viennent du modele TFLite (encore provisoires : "sain" + classe_1..classe_6).
export type Maladie = string;
export type NiveauAlerte = "faible" | "moyen" | "eleve";

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  langue: string;
  created_at: string;
}

export interface ZoneDetectee {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Diagnostic {
  id: string;
  parcelle_id: string | null;
  image_path: string;
  maladie: Maladie;
  confiance: number;
  zone_detectee: ZoneDetectee;
  recommandation: string;
  created_at: string;
}

export interface Parcelle {
  id: string;
  nom: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface Alerte {
  id: string;
  parcelle_id: string | null;
  type: string;
  message: string;
  niveau: NiveauAlerte;
  lue: boolean;
  created_at: string;
}
