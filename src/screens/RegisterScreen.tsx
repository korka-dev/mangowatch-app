import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import MangoLogo from "../components/MangoLogo";
import PrimaryButton from "../components/PrimaryButton";
import ScreenContainer from "../components/ScreenContainer";
import { useAuth } from "../context/AuthContext";
import { AuthStackParamList } from "../navigation/AuthStack";
import { colors, radius, spacing } from "../utils/theme";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    if (!fullName || !email || !password) {
      setError("Nom, email et mot de passe sont obligatoires");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      await signUp({ email: email.trim(), password, full_name: fullName.trim(), phone: phone.trim() || undefined });
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "Inscription impossible. Reessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <MangoLogo size={72} />
        <Text style={styles.title}>Creer un compte</Text>
        <Text style={styles.subtitle}>Rejoignez MangoWatch pour proteger vos manguiers</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nom complet</Text>
        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Entrez votre nom complet" />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Entrez votre email"
        />

        <Text style={styles.label}>Telephone (optionnel)</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="Entrez votre numero de telephone" />

        <Text style={styles.label}>Mot de passe</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Entrez votre mot de passe (6 caracteres min.)" />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton label="S'inscrire" icon="🌱" onPress={handleSubmit} loading={loading} />

        <PrimaryButton
          label="J'ai deja un compte"
          variant="secondary"
          onPress={() => navigation.navigate("Login")}
          style={{ marginTop: spacing.sm }}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primaryDark,
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
