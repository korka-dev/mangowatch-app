import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Maladie } from "../api/types";
import { DEFAULT_MALADIE_COLOR, maladieColors, maladieLabels, radius, spacing } from "../utils/theme";

export default function DiseaseBadge({ maladie }: { maladie: Maladie }) {
  const color = maladieColors[maladie] ?? DEFAULT_MALADIE_COLOR;
  const label = maladieLabels[maladie] ?? maladie;
  return (
    <View style={[styles.badge, { backgroundColor: color + "22", borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  text: {
    fontWeight: "700",
    fontSize: 14,
  },
});
