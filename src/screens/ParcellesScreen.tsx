import * as Location from "expo-location";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { createParcelle, deleteParcelle, listParcelles } from "../api/parcelles";
import { Parcelle } from "../api/types";
import PrimaryButton from "../components/PrimaryButton";
import ScreenContainer from "../components/ScreenContainer";
import { colors, radius, spacing } from "../utils/theme";

export default function ParcellesScreen() {
  const [parcelles, setParcelles] = useState<Parcelle[]>([]);
  const [nom, setNom] = useState("");
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    listParcelles()
      .then(setParcelles)
      .catch(() => setParcelles([]));
  }, []);

  React.useEffect(load, [load]);

  async function useCurrentLocation() {
    setError(null);
    setLocating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setError("Autorisation de localisation refusee.");
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude });
    } catch {
      setError("Impossible d'obtenir la position actuelle.");
    } finally {
      setLocating(false);
    }
  }

  async function handleCreate() {
    if (!nom || !coords) {
      setError("Indiquez un nom et localisez la parcelle");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createParcelle({ nom, latitude: coords.latitude, longitude: coords.longitude });
      setNom("");
      setCoords(null);
      load();
    } catch {
      setError("Enregistrement impossible. Verifiez votre connexion.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setParcelles((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteParcelle(id);
    } catch {
      load();
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.form}>
        <Text style={styles.label}>Nom de la parcelle</Text>
        <TextInput style={styles.input} value={nom} onChangeText={setNom} placeholder="Entrez le nom de la parcelle" />

        <PrimaryButton
          label={coords ? `Position : ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : "Utiliser ma position actuelle"}
          variant="secondary"
          onPress={useCurrentLocation}
          loading={locating}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton label="Ajouter la parcelle" onPress={handleCreate} loading={saving} style={{ marginTop: spacing.sm }} />
      </View>

      <Text style={styles.title}>Parcelles enregistrees</Text>
      {parcelles.length === 0 ? (
        <Text style={styles.empty}>Aucune parcelle enregistree.</Text>
      ) : (
        parcelles.map((p) => (
          <View key={p.id} style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>{p.nom}</Text>
              <Text style={styles.cardSubtitle}>
                {p.latitude.toFixed(4)}, {p.longitude.toFixed(4)}
              </Text>
            </View>
            <Text onPress={() => handleDelete(p.id)} style={styles.deleteLink}>
              Supprimer
            </Text>
          </View>
        ))
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    marginBottom: spacing.sm,
    backgroundColor: "#FFFFFF",
  },
  error: {
    color: colors.danger,
    fontWeight: "600",
    marginTop: spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  empty: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
  deleteLink: {
    color: colors.danger,
    fontWeight: "600",
    fontSize: 13,
  },
});
