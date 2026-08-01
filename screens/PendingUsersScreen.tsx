import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../theme/colors';
import Fonts from '../theme/fonts';
import Spacing from '../theme/spacing';
import Radius from '../theme/radius';
import Shadows from '../theme/shadows';
import { getPendingUsers, verifyUser, rejectUser } from '../services/userService';
import { useUser } from '../context/UserContext';
import { User } from '../types';

export default function PendingUsersScreen({ navigation }: any) {
  const { currentUser } = useUser();
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = async () => {
    try {
      setLoading(true);
      const users = await getPendingUsers();
      setPendingUsers(users);
    } catch (error) {
      console.error('Error loading pending users:', error);
      alert('Failed to load pending accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (user: User) => {
    try {
      setProcessingId(user.id);
      await verifyUser(user.id);
      setPendingUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve account');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = (user: User) => {
    Alert.alert(
      'Reject Account?',
      `This removes ${user.name}'s profile. Their sign-in account must still be deleted from the Firebase Console.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              setProcessingId(user.id);
              await rejectUser(user.id);
              setPendingUsers((prev) => prev.filter((u) => u.id !== user.id));
            } catch (error) {
              console.error('Error rejecting user:', error);
              alert('Failed to reject account');
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  if (currentUser?.role !== 'superadmin') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.deniedText}>Superadmin access only.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
        {!!item.clubName && (
          <Text style={styles.meta}>Club: {item.clubName}</Text>
        )}
        {!!item.urapPosition && (
          <Text style={styles.meta}>Position: {item.urapPosition}</Text>
        )}
        <Text style={styles.date}>
          Registered {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.actions}>
        {processingId === item.id ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleApprove(item)}
            >
              <Text style={styles.approveButtonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleReject(item)}
            >
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonContainer}
        >
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Pending Accounts</Text>
        <View style={{ width: 50 }} />
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={pendingUsers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>✅</Text>
              <Text style={styles.emptyStateText}>No accounts awaiting verification</Text>
            </View>
          }
        />
      )}
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
  deniedText: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    ...Shadows.lg,
  },
  backButtonContainer: {
    width: 50,
  },
  backButton: {
    ...Fonts.semibold,
    color: Colors.white,
    fontSize: 14,
  },
  title: {
    ...Fonts.bold,
    color: Colors.white,
    fontSize: 20,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  cardInfo: {
    marginBottom: Spacing.md,
  },
  name: {
    ...Fonts.semibold,
    color: Colors.text,
    fontSize: 15,
    marginBottom: 2,
  },
  email: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 2,
  },
  meta: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 2,
  },
  date: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 11,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    marginLeft: Spacing.sm,
  },
  approveButton: {
    backgroundColor: Colors.primary,
  },
  approveButtonText: {
    ...Fonts.semibold,
    color: Colors.white,
    fontSize: 13,
  },
  rejectButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  rejectButtonText: {
    ...Fonts.semibold,
    color: Colors.danger,
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyStateText: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
