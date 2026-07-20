import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { listAlerts } from "../api/alerts";
import { analyzeImage, listDiagnostics } from "../api/diagnostics";
import { listParcelles } from "../api/parcelles";
import { Alerte, Diagnostic, Parcelle } from "../api/types";
import AccountModal from "../components/AccountModal";
import DiseaseBadge from "../components/DiseaseBadge";
import MangoLogo from "../components/MangoLogo";
import OfflineBanner from "../components/OfflineBanner";
import PrimaryButton from "../components/PrimaryButton";
import ScreenContainer from "../components/ScreenContainer";
import SpeakButton from "../components/SpeakButton";
import { useAuth } from "../context/AuthContext";
import { AppStackParamList } from "../navigation/AppStack";
import { fetchWithCache } from "../utils/offlineCache";
import { colors, radius, spacing } from "../utils/theme";

type Nav = NativeStackNavigationProp<AppStackParamList>;

export default function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();

  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [alerts, setAlerts] = useState<Alerte[]>([]);
  const [offline, setOffline] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [parcelles, setParcelles] = useState<Parcelle[]>([]);
  const [selectedParcelle, setSelectedParcelle] = useState<string | null>(null);
  const [result, setResult] = useState<Diagnostic | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [diagResult, alertResult] = await Promise.all([
        fetchWithCache("diagnostics", listDiagnostics),
        fetchWithCache("alerts", listAlerts),
      ]);
      setDiagnostics(diagResult.data);
      setAlerts(alertResult.data);
      setOffline(diagResult.fromCache || alertResult.fromCache);
    } catch {
      // pas de cache ni de reseau disponible : on garde l'etat precedent
    }
    listParcelles()
      .then(setParcelles)
      .catch(() => setParcelles([]));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const reset = useCallback(() => {
    setImageUri(null);
    setResult(null);
    setError(null);
  }, []);

  async function pickImage(fromCamera: boolean) {
    setError(null);
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setError("Autorisation refusee. Activez l'acces a la camera/galerie dans les reglages.");
      return;
    }

    const pickerResult = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.7, allowsEditing: true });

    if (!pickerResult.canceled && pickerResult.assets[0]) {
      setImageUri(pickerResult.assets[0].uri);
      setResult(null);
    }
  }

  async function submit() {
    if (!imageUri) return;
    setLoading(true);
    setError(null);
    try {
      const diagnostic = await analyzeImage(imageUri, selectedParcelle);
      setResult(diagnostic);
      setDiagnostics((prev) => [diagnostic, ...prev]);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "Analyse impossible. Verifiez votre connexion au serveur.");
    } finally {
      setLoading(false);
    }
  }

  const unreadAlerts = alerts.filter((a) => !a.lue).length;
  const initial = user?.full_name?.trim()?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MangoLogo size={44} />
          <View>
            <View style={styles.greetingRow}>
              <Text style={styles.greeting}>Bonjour</Text>
              <Ionicons name="hand-left-outline" size={20} color={colors.primary} />
              <Text style={styles.greeting}>, {user?.full_name?.split(" ")[0] ?? ""}</Text>
            </View>
            <Text style={styles.subGreeting}>Voici l'etat de vos manguiers</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.avatar} onPress={() => setAccountModalVisible(true)}>
          <Text style={styles.avatarText}>{initial}</Text>
        </TouchableOpacity>
      </View>

      {offline ? <OfflineBanner /> : null}

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderColor: colors.primary }]}>
          <Text style={styles.statNumber}>{diagnostics.length}</Text>
          <Text style={styles.statLabel}>Diagnostics</Text>
        </View>
        <View style={[styles.statCard, { borderColor: unreadAlerts > 0 ? colors.danger : colors.border }]}>
          <Text style={[styles.statNumber, unreadAlerts > 0 && { color: colors.danger }]}>{unreadAlerts}</Text>
          <Text style={styles.statLabel}>Alertes non lues</Text>
        </View>
      </View>

      <Text style={styles.title}>Analyser une photo</Text>
      <Text style={styles.subtitle}>Prenez une photo nette d'une feuille ou d'un fruit</Text>

      {imageUri ? (
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          {result && result.zone_detectee.width > 0 ? (
            <View
              style={[
                styles.zoneBox,
                {
                  left: `${result.zone_detectee.x * 100}%`,
                  top: `${result.zone_detectee.y * 100}%`,
                  width: `${result.zone_detectee.width * 100}%`,
                  height: `${result.zone_detectee.height * 100}%`,
                },
              ]}
            />
          ) : null}
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Aucune photo selectionnee</Text>
        </View>
      )}

      {!imageUri && (
        <>
          <PrimaryButton label="Prendre une photo" onPress={() => pickImage(true)} />
          <PrimaryButton
            label="Choisir depuis la galerie"
            variant="secondary"
            onPress={() => pickImage(false)}
            style={{ marginTop: spacing.sm }}
          />
        </>
      )}

      {imageUri && !result && (
        <>
          {parcelles.length > 0 && (
            <View style={styles.parcelleSection}>
              <Text style={styles.label}>Parcelle (optionnel)</Text>
              <View style={styles.parcelleList}>
                {parcelles.map((p) => (
                  <Text
                    key={p.id}
                    onPress={() => setSelectedParcelle(selectedParcelle === p.id ? null : p.id)}
                    style={[
                      styles.parcelleChip,
                      selectedParcelle === p.id && styles.parcelleChipActive,
                    ]}
                  >
                    {p.nom}
                  </Text>
                ))}
              </View>
            </View>
          )}

          <PrimaryButton label="Lancer l'analyse" onPress={submit} loading={loading} />
          <PrimaryButton label="Reprendre une photo" variant="secondary" onPress={reset} style={{ marginTop: spacing.sm }} />
        </>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {result && (
        <View style={styles.resultCard}>
          <DiseaseBadge maladie={result.maladie} />
          <Text style={styles.confidence}>Confiance : {Math.round(result.confiance * 100)}%</Text>
          <Text style={styles.recommendation}>{result.recommandation}</Text>
          <SpeakButton text={result.recommandation} maladie={result.maladie} />
          <PrimaryButton label="Nouvelle analyse" onPress={reset} style={{ marginTop: spacing.md }} />
        </View>
      )}

      <AccountModal
        visible={accountModalVisible}
        onClose={() => setAccountModalVisible(false)}
        onNavigateParcelles={() => navigation.navigate("Parcelles")}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexShrink: 1,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  subGreeting: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 2,
    padding: spacing.md,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  placeholder: {
    height: 220,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  placeholderText: {
    color: colors.textMuted,
  },
  imageWrapper: {
    width: "100%",
    height: 260,
    borderRadius: radius.md,
    overflow: "hidden",
    marginBottom: spacing.md,
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  zoneBox: {
    position: "absolute",
    borderWidth: 3,
    borderColor: colors.danger,
    backgroundColor: "rgba(214,69,69,0.15)",
    borderRadius: 4,
  },
  parcelleSection: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  parcelleList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  parcelleChip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    color: colors.text,
    overflow: "hidden",
  },
  parcelleChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: "#FFFFFF",
  },
  error: {
    color: colors.danger,
    fontWeight: "600",
    marginTop: spacing.sm,
  },
  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  confidence: {
    fontSize: 13,
    color: colors.textMuted,
  },
  recommendation: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 21,
  },
});
