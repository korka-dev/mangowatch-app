import { Ionicons } from "@expo/vector-icons";
import { Audio, AVPlaybackStatus } from "expo-av";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { colors, radius, spacing } from "../utils/theme";

const AUDIO_MAP: Record<string, any> = {
  Healthy: require("../../assets/audio/healthy.m4a"),
  Anthracnose: require("../../assets/audio/anthracnose.m4a"),
  "Bacterial Canker": require("../../assets/audio/bacterial_canker.m4a"),
  Lasiodiplodia: require("../../assets/audio/lasiodiplodia.m4a"),
  Lichens: require("../../assets/audio/lichens.m4a"),
  Pestalotia: require("../../assets/audio/pestalotia.m4a"),
  background: require("../../assets/audio/background.m4a"),
};

interface Props {
  text: string;
  maladie?: string;
}

export default function SpeakButton({ text, maladie }: Props) {
  const [speaking, setSpeaking] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    return () => {
      soundRef.current?.unloadAsync();
      Speech.stop();
    };
  }, []);

  async function playWolof() {
    const source = maladie ? AUDIO_MAP[maladie] : null;
    if (source) {
      const { sound } = await Audio.Sound.createAsync(source);
      soundRef.current = sound;
      setSpeaking(true);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
          setSpeaking(false);
          sound.unloadAsync();
          soundRef.current = null;
        }
      });
    } else {
      setSpeaking(true);
      Speech.speak(text, {
        language: "fr-FR",
        onDone: () => setSpeaking(false),
        onStopped: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      });
    }
  }

  async function stop() {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    Speech.stop();
    setSpeaking(false);
  }

  return (
    <TouchableOpacity style={styles.button} onPress={speaking ? stop : playWolof}>
      <Ionicons name={speaking ? "stop-circle-outline" : "volume-high-outline"} size={18} color={colors.primary} />
      <Text style={styles.label}>{speaking ? "Arreter" : "Ecouter en Wolof"}</Text>
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
