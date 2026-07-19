import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import MangoLogo from "../components/MangoLogo";
import PrimaryButton from "../components/PrimaryButton";
import ScreenContainer from "../components/ScreenContainer";
import { useAuth } from "../context/AuthContext";
import { AuthStackParamList } from "../navigation/AuthStack";
import { colors, radius, spacing } from "../utils/theme";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "Connexion impossible. Verifiez vos identifiants.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <MangoLogo size={88} />
        <Text style={styles.title}>MangoWatch</Text>
        <Text style={styles.subtitle}>Detection des maladies du manguier</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Entrez votre email"
        />

        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Entrez votre mot de passe"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton label="Se connecter" icon="🔑" onPress={handleSubmit} loading={loading} />

        <PrimaryButton
          label="Creer un compte"
          variant="secondary"
          onPress={() => navigation.navigate("Register")}
          style={{ marginTop: spacing.sm }}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.primaryDark,
    marginTop: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    backgroundColor: "#FFFFFF",
  },
  error: {
    color: colors.danger,
    marginBottom: spacing.sm,
    fontWeight: "600",
  },
});
