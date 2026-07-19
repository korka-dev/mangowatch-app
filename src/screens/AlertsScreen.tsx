import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { listAlerts, markAlertRead, simulateAlert } from "../api/alerts";
import { Alerte } from "../api/types";
import OfflineBanner from "../components/OfflineBanner";
import PrimaryButton from "../components/PrimaryButton";
import ScreenContainer from "../components/ScreenContainer";
import { fetchWithCache } from "../utils/offlineCache";
import { colors, niveauColors, radius, spacing } from "../utils/theme";

const NIVEAU_LABELS: Record<string, string> = { faible: "Faible", moyen: "Moyen", eleve: "Eleve" };

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<Alerte[]>([]);
  const [offline, setOffline] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const { data, fromCache } = await fetchWithCache("alerts", listAlerts);
      setAlerts(data);
      setOffline(fromCache);
    } catch {
      // pas de donnees disponibles
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function handleMarkRead(id: string) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, lue: true } : a)));
    try {
      await markAlertRead(id);
    } catch {
      load();
    }
  }

  async function handleSimulate() {
    setSimulating(true);
    try {
      await simulateAlert();
      await load();
    } catch {
      // hors-ligne : impossible de simuler une alerte serveur
    } finally {
      setSimulating(false);
    }
  }

  return (
    <ScreenContainer onRefresh={load} refreshing={refreshing}>
      <Text style={styles.title}>Alertes</Text>
      <Text style={styles.subtitle}>Notifications des capteurs IoT et risques climatiques</Text>
      {offline ? <OfflineBanner /> : null}

      <PrimaryButton
        label="Simuler une alerte IoT (demo)"
        variant="secondary"
        onPress={handleSimulate}
        loading={simulating}
        style={{ marginBottom: spacing.md }}
      />

      {alerts.length === 0 ? (
        <Text style={styles.empty}>Aucune alerte pour le moment.</Text>
      ) : (
        alerts.map((a) => (
          <TouchableOpacity
            key={a.id}
            onPress={() => !a.lue && handleMarkRead(a.id)}
            style={[styles.card, !a.lue && styles.cardUnread, { borderLeftColor: niveauColors[a.niveau] }]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.niveauBadge, { backgroundColor: niveauColors[a.niveau] }]}>
                <Text style={styles.niveauText}>{NIVEAU_LABELS[a.niveau]}</Text>
              </View>
              <Text style={styles.date}>{new Date(a.created_at).toLocaleString("fr-FR")}</Text>
            </View>
            <Text style={styles.message}>{a.message}</Text>
            {!a.lue && <Text style={styles.unreadHint}>Touchez pour marquer comme lue</Text>}
          </TouchableOpacity>
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
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
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
    borderLeftWidth: 5,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  cardUnread: {
    backgroundColor: "#FFFDF5",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  niveauBadge: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  niveauText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  date: {
    fontSize: 11,
    color: colors.textMuted,
  },
  message: {
    fontSize: 14,
    color: colors.text,
  },
  unreadHint: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: "italic",
  },
});
