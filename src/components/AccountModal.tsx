import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../context/AuthContext";
import { colors, radius, spacing } from "../utils/theme";
import PrimaryButton from "./PrimaryButton";

interface Props {
  visible: boolean;
  onClose: () => void;
  onNavigateParcelles: () => void;
}

export default function AccountModal({ visible, onClose, onNavigateParcelles }: Props) {
  const { user, signOut } = useAuth();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>Mon compte</Text>
          <Text style={styles.name}>{user?.full_name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.phone ? <Text style={styles.phone}>{user.phone}</Text> : null}

          <PrimaryButton
            label="Mes parcelles"
            variant="secondary"
            onPress={() => {
              onClose();
              onNavigateParcelles();
            }}
            style={{ marginTop: spacing.lg }}
          />
          <PrimaryButton
            label="Se deconnecter"
            variant="danger"
            onPress={() => {
              onClose();
              signOut();
            }}
            style={{ marginTop: spacing.sm }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(27,43,30,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  email: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  phone: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
