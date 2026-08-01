import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import Colors from '../theme/colors';
import Fonts from '../theme/fonts';
import Spacing from '../theme/spacing';
import Radius from '../theme/radius';
import Shadows from '../theme/shadows';

export default function ProfileScreen({ navigation }: any) {
  const { currentUser, logout } = useUser();
  const [avatarError, setAvatarError] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      // logout() (from UserContext) handles both the Firebase signOut and
      // clearing currentUser — don't call signOut() again here, since a
      // second concurrent call caused it to hang.
      await logout();

      // Navigate to login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout');
    } finally {
      setLoggingOut(false);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleVerifyAccounts = () => {
    navigation.navigate('PendingUsers');
  };

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
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
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 30 }} />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {!avatarError ? (
            <Image
              source={{ uri: currentUser.avatar || 'https://ui-avatars.com/api/?name=' + currentUser.name }}
              style={styles.avatar}
              onError={(error) => {
                console.log('Avatar load error:', error);
                console.log('Avatar URL:', currentUser.avatar);
                setAvatarError(true);
              }}
              onLoad={() => console.log('Avatar loaded successfully')}
            />
          ) : (
            <View style={[styles.avatar, styles.fallbackAvatar]}>
              <Text style={styles.fallbackInitial}>
                {currentUser.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.name}>{currentUser.name}</Text>
          <Text style={styles.email}>{currentUser.email}</Text>
          {/* Role Badge */}
          <View
            style={[
              styles.roleBadge,
              currentUser.role === 'admin' || currentUser.role === 'superadmin'
                ? styles.adminBadge
                : styles.userBadge,
            ]}
          >
            <Text
              style={[
                styles.roleText,
                currentUser.role === 'admin' || currentUser.role === 'superadmin'
                  ? styles.adminRoleText
                  : styles.userRoleText,
              ]}
            >
              {currentUser.role.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{currentUser.name}</Text>
            </View>

            <View style={[styles.infoRow, styles.infoBorder]}>
              <Text style={styles.infoLabel}>Nickname</Text>
              <Text style={styles.infoValue}>{currentUser.nickname || '—'}</Text>
            </View>

            <View style={[styles.infoRow, styles.infoBorder]}>
              <Text style={styles.infoLabel}>Club Name</Text>
              <Text style={styles.infoValue}>{currentUser.clubName || '—'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>URAP Position</Text>
              <Text style={styles.infoValue}>{currentUser.urapPosition || '—'}</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.actionButtonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>

          {currentUser.role === 'superadmin' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleVerifyAccounts}
            >
              <Text style={styles.actionButtonText}>🛡️ Verify Accounts</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <ActivityIndicator size="small" color={Colors.danger} />
            ) : (
              <Text style={[styles.actionButtonText, styles.logoutButtonText]}>
                🚪 Logout
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Permissions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permissions</Text>
          
          <View style={styles.permissionCard}>
            <View style={styles.permissionRow}>
              <Text style={styles.permissionText}>✓ View Announcements</Text>
            </View>
            <View style={styles.permissionRow}>
              <Text style={styles.permissionText}>✓ Comment on Posts</Text>
            </View>
            {(currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
              <View style={styles.permissionRow}>
                <Text style={styles.permissionText}>✓ Create Announcements</Text>
              </View>
            )}
            {currentUser.role === 'superadmin' && (
              <View style={styles.permissionRow}>
                <Text style={styles.permissionText}>✓ Verify & Manage Users</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.spacer} />
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
  loadingText: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: Spacing.md,
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
    justifyContent: 'center',
    position: 'absolute',
    left: Spacing.md,
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.md,
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
  profileCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    ...Shadows.lg,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: Spacing.md,
    borderWidth: 4,
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
  name: {
    ...Fonts.bold,
    color: Colors.text,
    fontSize: 20,
    marginBottom: Spacing.xs,
  },
  email: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: Spacing.md,
  },
  roleBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
  },
  adminBadge: {
    backgroundColor: Colors.primary,
  },
  userBadge: {
    backgroundColor: Colors.background,
  },
  roleText: {
    ...Fonts.bold,
    fontSize: 12,
  },
  adminRoleText: {
    color: Colors.white,
  },
  userRoleText: {
    color: Colors.primary,
  },
  section: {
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    ...Fonts.semibold,
    color: Colors.text,
    fontSize: 15,
    marginBottom: Spacing.md,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  infoBorder: {
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  infoLabel: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 13,
  },
  infoValue: {
    ...Fonts.semibold,
    color: Colors.text,
    fontSize: 13,
  },
  actionButton: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    ...Shadows.md,
  },
  actionButtonText: {
    ...Fonts.semibold,
    color: Colors.primary,
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: Colors.white,
    borderColor: '#FF6B6B',
  },
  logoutButtonText: {
    color: '#FF6B6B',
  },
  permissionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  permissionRow: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  permissionText: {
    ...Fonts.regular,
    color: Colors.text,
    fontSize: 13,
  },
  spacer: {
    height: Spacing.xl,
  },
});
