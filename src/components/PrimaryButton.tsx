import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

import { colors, radius, spacing } from "../utils/theme";

interface Props {
  label: string;
  onPress: () => void;
  icon?: string;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function PrimaryButton({
  label,
  onPress,
  icon,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
}: Props) {
  const backgroundColor =
    variant === "primary" ? colors.primary : variant === "danger" ? colors.danger : colors.surface;
  const textColor = variant === "secondary" ? colors.primaryDark : "#FFFFFF";
  const borderColor = variant === "secondary" ? colors.primary : "transparent";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        { backgroundColor, borderColor, opacity: disabled ? 0.6 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>
          {icon ? `${icon}  ` : ""}
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  label: {
    fontSize: 18,
    fontWeight: "700",
  },
});
