import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, radius } from "../utils/theme";

interface Props {
  size?: number;
}

/** Logo MangoWatch partage entre l'accueil, la connexion et l'inscription. */
export default function MangoLogo({ size = 96 }: Props) {
  return (
    <View
      style={[
        styles.badge,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={{ fontSize: size * 0.55 }}>🥭</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.primary,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
