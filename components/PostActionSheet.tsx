import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import Colors from '../theme/colors';
import Fonts from '../theme/fonts';
import Spacing from '../theme/spacing';
import Radius from '../theme/radius';
import Shadows from '../theme/shadows';

interface PostActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PostActionSheet({ visible, onClose, onEdit, onDelete }: PostActionSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <TouchableOpacity style={styles.option} onPress={onEdit}>
            <Text style={styles.optionIcon}>✏️</Text>
            <Text style={styles.optionText}>Edit Post</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.option} onPress={onDelete}>
            <Text style={styles.optionIcon}>🗑️</Text>
            <Text style={[styles.optionText, styles.deleteText]}>Delete Post</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    ...Shadows.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  optionIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  optionText: {
    ...Fonts.semibold,
    fontSize: 15,
    color: Colors.text,
  },
  deleteText: {
    color: Colors.danger,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.border,
  },
  cancelButton: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  cancelText: {
    ...Fonts.semibold,
    fontSize: 15,
    color: Colors.text,
  },
});
