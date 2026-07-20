import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { colors, radius, spacing } from "../utils/theme";

interface Props {
  text: string;
}

/** Bouton pour ecouter un texte a voix haute (accessibilite, utilisateurs peu alphabetises). */
export default function SpeakButton({ text }: Props) {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  function toggle() {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    Speech.speak(text, {
      language: "fr-FR",
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  }

  return (
    <TouchableOpacity style={styles.button} onPress={toggle}>
      <Ionicons name={speaking ? "stop-circle-outline" : "volume-high-outline"} size={18} color={colors.primary} />
      <Text style={styles.label}>{speaking ? "Arreter" : "Ecouter"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.xs,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  label: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 13,
  },
});
