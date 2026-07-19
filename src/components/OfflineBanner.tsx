import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "../utils/theme";

export default function OfflineBanner() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hors-ligne — donnees affichees depuis le cache local</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.warning,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  text: {
    color: "#3A2E00",
    fontWeight: "600",
    textAlign: "center",
  },
});
