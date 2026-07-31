import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useUser } from '../context/UserContext';
import Colors from '../theme/colors';
import Fonts from '../theme/fonts';
import Spacing from '../theme/spacing';
import Radius from '../theme/radius';
import Shadows from '../theme/shadows';

export default function EditProfileScreen({ navigation }: any) {
  const { currentUser, fetchUserProfile } = useUser();
  const [name, setName] = useState(currentUser?.name || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [clubName, setClubName] = useState(currentUser?.clubName || '');
  const [urapPosition, setUrapPosition] = useState(currentUser?.urapPosition || '');
  const [loading, setLoading] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      alert('Please enter a name');
      return;
    }

    setLoading(true);

    try {
      // Update user in Firestore
      const userDocRef = doc(db, 'users', currentUser!.id);
      await updateDoc(userDocRef, {
        name: name.trim(),
        avatar: avatar.trim() || currentUser?.avatar,
        clubName: clubName.trim(),
        urapPosition: urapPosition.trim(),
      });

      // Refresh user profile from Firebase
      await fetchUserProfile(currentUser!.id);

      alert('Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 30 }} />
        </View>

        {/* Avatar Preview */}
        <View style={styles.avatarSection}>
          <Text style={styles.sectionLabel}>Avatar Preview</Text>
          {!avatarError && avatar ? (
            <Image
              source={{ uri: avatar }}
              style={styles.previewAvatar}
              onError={() => setAvatarError(true)}
            />
          ) : (
            <View style={[styles.previewAvatar, styles.fallbackAvatar]}>
              <Text style={styles.fallbackInitial}>
                {name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Edit Form */}
        <View style={styles.formSection}>
          {/* Name Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={Colors.textSecondary}
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
          </View>

          {/* Avatar URL Input - Optional */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Avatar URL</Text>
            <TextInput
              style={styles.input}
              placeholder="Paste image URL (e.g., https://example.com/avatar.jpg)"
              placeholderTextColor={Colors.textSecondary}
              value={avatar}
              onChangeText={(text) => {
                setAvatar(text);
                setAvatarError(false);
              }}
              editable={!loading}
              multiline
            />
            <Text style={styles.hint}>
              Paste any direct image URL. Preview updates automatically.
            </Text>
          </View>

          {/* Club Name Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Club Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your riding club's name"
              placeholderTextColor={Colors.textSecondary}
              value={clubName}
              onChangeText={setClubName}
              editable={!loading}
            />
          </View>

          {/* URAP Position Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>URAP Position</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Member, Admin, President"
              placeholderTextColor={Colors.textSecondary}
              value={urapPosition}
              onChangeText={setUrapPosition}
              editable={!loading}
            />
          </View>

          {/* Email Display (Read-only) */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email (cannot be changed)</Text>
            <View style={[styles.input, styles.readOnlyInput]}>
              <Text style={styles.readOnlyText}>{currentUser.email}</Text>
            </View>
          </View>

          {/* Role Display (Read-only) */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Role (cannot be changed)</Text>
            <View style={[styles.input, styles.readOnlyInput]}>
              <Text style={styles.readOnlyText}>
                {currentUser.role === 'superadmin'
                  ? 'Superadmin'
                  : currentUser.role === 'admin'
                  ? 'Administrator'
                  : 'Member'}
              </Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSaveProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Text style={styles.saveButtonText}>💾 Save Changes</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    marginBottom: Spacing.lg,
    ...Shadows.lg,
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    position: 'absolute',
    left: Spacing.md,
  },
  backButtonText: {
    ...Fonts.semibold,
    color: Colors.white,
    fontSize: 14,
  },
  headerTitle: {
    ...Fonts.bold,
    color: Colors.white,
    fontSize: 20,
  },
  avatarSection: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  sectionLabel: {
    ...Fonts.semibold,
    color: Colors.text,
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  previewAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  fallbackAvatar: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackInitial: {
    color: Colors.white,
    ...Fonts.bold,
    fontSize: 32,
  },
  formSection: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  formGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Fonts.semibold,
    color: Colors.text,
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    ...Fonts.regular,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  readOnlyInput: {
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
  readOnlyText: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  hint: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  actionSection: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    ...Fonts.semibold,
    color: Colors.white,
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    ...Fonts.semibold,
    color: Colors.text,
    fontSize: 16,
  },
});
