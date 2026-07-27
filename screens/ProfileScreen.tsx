import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Colors from '../theme/colors';
import Fonts from '../theme/fonts';
import Spacing from '../theme/spacing';
import Radius from '../theme/radius';
import Shadows from '../theme/shadows';
import { currentUser } from '../utils/mockData';

export default function ProfileScreen({ navigation }: any) {
  const handleLogout = () => {
    alert('Logged out successfully');
    navigation.navigate('Login');
  };

  const handleEditProfile = () => {
    alert('Edit profile feature coming soon');
  };

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
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 30 }} />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: currentUser.avatar }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{currentUser.name}</Text>
          <Text style={styles.email}>{currentUser.email}</Text>
          
          {/* Role Badge */}
          <View
            style={[
              styles.roleBadge,
              currentUser.role === 'admin'
                ? styles.adminBadge
                : styles.userBadge,
            ]}
          >
            <Text
              style={[
                styles.roleText,
                currentUser.role === 'admin'
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
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>
                {new Date(currentUser.createdAt).toLocaleDateString()}
              </Text>
            </View>

            <View style={[styles.infoRow, styles.infoBorder]}>
              <Text style={styles.infoLabel}>Account Type</Text>
              <Text style={styles.infoValue}>
                {currentUser.role === 'admin'
                  ? 'Administrator'
                  : 'Regular Member'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email Status</Text>
              <Text style={[styles.infoValue, styles.verified]}>Verified</Text>
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

          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={[styles.actionButtonText, styles.logoutButtonText]}>
              🚪 Logout
            </Text>
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
            {currentUser.role === 'admin' && (
              <View style={styles.permissionRow}>
                <Text style={styles.permissionText}>✓ Create Announcements</Text>
              </View>
            )}
            {currentUser.role === 'admin' && (
              <View style={styles.permissionRow}>
                <Text style={styles.permissionText}>✓ Manage Users</Text>
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
  verified: {
    color: Colors.success,
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
