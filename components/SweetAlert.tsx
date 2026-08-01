import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import Colors from '../theme/colors';
import Fonts from '../theme/fonts';
import Spacing from '../theme/spacing';
import Radius from '../theme/radius';
import Shadows from '../theme/shadows';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface AlertOptions {
  type?: AlertType;
  title: string;
  message?: string;
  buttons?: AlertButton[];
}

const ICONS: Record<AlertType, string> = {
  success: '✓',
  error: '✕',
  info: 'i',
  warning: '!',
};

const ICON_COLORS: Record<AlertType, string> = {
  success: Colors.success,
  error: Colors.danger,
  info: Colors.primary,
  warning: Colors.warning,
};

interface SweetAlertProps {
  visible: boolean;
  options: AlertOptions | null;
  onButtonPress: (button: AlertButton) => void;
}

export default function SweetAlert({ visible, options, onButtonPress }: SweetAlertProps) {
  if (!options) return null;

  const type = options.type || 'info';
  const buttons: AlertButton[] = options.buttons?.length ? options.buttons : [{ text: 'OK' }];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => {}}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => {}} />
        <View style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: ICON_COLORS[type] }]}>
            <Text style={styles.iconText}>{ICONS[type]}</Text>
          </View>

          <Text style={styles.title}>{options.title}</Text>
          {!!options.message && <Text style={styles.message}>{options.message}</Text>}

          <View style={styles.buttonRow}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  button.style === 'cancel'
                    ? styles.cancelButton
                    : button.style === 'destructive'
                    ? styles.destructiveButton
                    : styles.defaultButton,
                  buttons.length > 1 && index > 0 && { marginLeft: Spacing.sm },
                ]}
                onPress={() => onButtonPress(button)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    button.style === 'cancel' ? styles.cancelButtonText : styles.defaultButtonText,
                  ]}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    ...Shadows.lg,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconText: {
    color: Colors.white,
    fontSize: 32,
    ...Fonts.bold,
  },
  title: {
    ...Fonts.bold,
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  message: {
    ...Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultButton: {
    backgroundColor: Colors.primary,
  },
  destructiveButton: {
    backgroundColor: Colors.danger,
  },
  cancelButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonText: {
    ...Fonts.semibold,
    fontSize: 14,
  },
  defaultButtonText: {
    color: Colors.white,
  },
  cancelButtonText: {
    color: Colors.text,
  },
});
