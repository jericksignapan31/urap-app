import React, { useState, useEffect } from 'react';
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
import { getUserFromFirestore } from '../services/userService';
import { User } from '../types';
import Colors from '../theme/colors';
import Fonts from '../theme/fonts';
import Spacing from '../theme/spacing';
import Radius from '../theme/radius';
import Shadows from '../theme/shadows';

export default function UserProfileScreen({ route, navigation }: any) {
  const { userId } = route.params;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const fetchedUser = await getUserFromFirestore(userId);
        setUser(fetchedUser);
      } catch (error) {
        console.error('Error loading user profile:', error);
        alert('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
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
        <View style={styles.centerContent}>
          <Text style={styles.notFoundText}>User not found</Text>
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
              source={{ uri: user.avatar || 'https://ui-avatars.com/api/?name=' + user.name }}
              style={styles.avatar}
              onError={() => setAvatarError(true)}
            />
          ) : (
            <View style={[styles.avatar, styles.fallbackAvatar]}>
              <Text style={styles.fallbackInitial}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.name}>{user.name}</Text>
          {!!user.nickname && <Text style={styles.nickname}>"{user.nickname}"</Text>}
          {/* Role Badge */}
          <View
            style={[
              styles.roleBadge,
              user.role === 'admin' || user.role === 'superadmin'
                ? styles.adminBadge
                : styles.userBadge,
            ]}
          >
            <Text
              style={[
                styles.roleText,
                user.role === 'admin' || user.role === 'superadmin'
                  ? styles.adminRoleText
                  : styles.userRoleText,
              ]}
            >
              {user.role.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{user.name}</Text>
            </View>

            <View style={[styles.infoRow, styles.infoBorder]}>
              <Text style={styles.infoLabel}>Nickname</Text>
              <Text style={styles.infoValue}>{user.nickname || '—'}</Text>
            </View>

            <View style={[styles.infoRow, styles.infoBorder]}>
              <Text style={styles.infoLabel}>Club Name</Text>
              <Text style={styles.infoValue}>{user.clubName || '—'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>URAP Position</Text>
              <Text style={styles.infoValue}>{user.urapPosition || '—'}</Text>
            </View>
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
  notFoundText: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 14,
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
  nickname: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
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
  spacer: {
    height: Spacing.xl,
  },
});
