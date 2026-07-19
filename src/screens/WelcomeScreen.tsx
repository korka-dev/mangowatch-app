import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

import MangoLogo from "../components/MangoLogo";
import PrimaryButton from "../components/PrimaryButton";
import ScreenContainer from "../components/ScreenContainer";
import { AuthStackParamList } from "../navigation/AuthStack";
import { colors, spacing } from "../utils/theme";

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">;

export default function WelcomeScreen({ navigation }: Props) {
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(16)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslate, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(buttonsOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.06,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [logoScale, logoOpacity, textOpacity, textTranslate, buttonsOpacity, pulse]);

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.content}>
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ scale: Animated.multiply(logoScale, pulse) }],
          }}
        >
          <MangoLogo size={140} />
        </Animated.View>

        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateY: textTranslate }],
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>MangoWatch</Text>
          <Text style={styles.subtitle}>
            Detectez tot les maladies de vos manguiers et protegez votre recolte
          </Text>
        </Animated.View>

        <Animated.View style={[styles.buttons, { opacity: buttonsOpacity }]}>
          <PrimaryButton label="Se connecter" icon="🔑" onPress={() => navigation.navigate("Login")} />
          <PrimaryButton
            label="Creer un compte"
            icon="🌱"
            variant="secondary"
            onPress={() => navigation.navigate("Register")}
            style={{ marginTop: spacing.sm }}
          />
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.primaryDark,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  buttons: {
    width: "100%",
    paddingHorizontal: spacing.lg,
  },
});
