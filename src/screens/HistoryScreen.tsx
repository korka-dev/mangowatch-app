import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { listDiagnostics } from "../api/diagnostics";
import { Diagnostic } from "../api/types";
import DiseaseBadge from "../components/DiseaseBadge";
import OfflineBanner from "../components/OfflineBanner";
import ScreenContainer from "../components/ScreenContainer";
import SpeakButton from "../components/SpeakButton";
import { fetchWithCache } from "../utils/offlineCache";
import { colors, radius, spacing } from "../utils/theme";

export default function HistoryScreen() {
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [offline, setOffline] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const { data, fromCache } = await fetchWithCache("diagnostics", listDiagnostics);
      setDiagnostics(data);
      setOffline(fromCache);
    } catch {
      // rien en cache, rien a afficher
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <ScreenContainer onRefresh={load} refreshing={refreshing}>
      <Text style={styles.title}>Historique des diagnostics</Text>
      {offline ? <OfflineBanner /> : null}

      {diagnostics.length === 0 ? (
        <Text style={styles.empty}>Aucun diagnostic enregistre pour le moment.</Text>
      ) : (
        diagnostics.map((d) => (
          <View key={d.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <DiseaseBadge maladie={d.maladie} />
              <Text style={styles.date}>{new Date(d.created_at).toLocaleDateString("fr-FR")}</Text>
            </View>
            <Text style={styles.recommendation} numberOfLines={2}>
              {d.recommandation}
            </Text>
            <Text style={styles.confidence}>Confiance : {Math.round(d.confiance * 100)}%</Text>
            <SpeakButton text={d.recommandation} />
          </View>
        ))
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.md,
  },
  empty: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
  },
  recommendation: {
    fontSize: 14,
    color: colors.text,
  },
  confidence: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
