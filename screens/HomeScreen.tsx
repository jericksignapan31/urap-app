import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import Colors from '../theme/colors';
import Fonts from '../theme/fonts';
import Spacing from '../theme/spacing';
import Radius from '../theme/radius';
import Shadows from '../theme/shadows';
import { mockPosts, currentUser } from '../utils/mockData';

export default function HomeScreen({ navigation }: any) {
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const handlePostPress = (postId: string) => {
    navigation.navigate('PostDetail', { postId });
  };

  const handleCommentPress = (postId: string) => {
    navigation.navigate('Comments', { postId });
  };

  const handleCreatePost = () => {
    if (currentUser.role === 'admin') {
      navigation.navigate('CreatePost');
    } else {
      alert('Only admins can create posts');
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.headerGreeting}>Announcements</Text>
        <Text style={styles.headerSubtitle}>Stay updated with latest news</Text>
      </View>
      {currentUser.role === 'admin' && (
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreatePost}
        >
          <Text style={styles.createButtonEmoji}>✏️</Text>
          <Text style={styles.createButtonText}>Post</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateEmoji}>📭</Text>
      <Text style={styles.emptyStateTitle}>No announcements yet</Text>
      <Text style={styles.emptyStateText}>
        Check back soon for updates from URAP admins
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => handlePostPress(item.id)}
            onCommentPress={handleCommentPress}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    marginHorizontal: -Spacing.md,
    alignItems: 'center',
    ...Shadows.lg,
  },
  headerContent: {
    marginBottom: 0,
  },
  headerGreeting: {
    ...Fonts.bold,
    color: Colors.white,
    fontSize: 22,
    marginBottom: 0,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  headerSubtitle: {
    ...Fonts.regular,
    color: Colors.white,
    fontSize: 12,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  createButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    ...Shadows.md,
  },
  createButtonEmoji: {
    fontSize: 16,
  },
  createButtonText: {
    ...Fonts.semibold,
    color: Colors.primary,
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyStateTitle: {
    ...Fonts.semibold,
    color: Colors.text,
    fontSize: 18,
    marginBottom: Spacing.sm,
  },
  emptyStateText: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
