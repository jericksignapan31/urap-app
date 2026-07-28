import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import { getAllPosts } from '../services/postService';
import { useUser } from '../context/UserContext';
import Colors from '../theme/colors';
import Fonts from '../theme/fonts';
import Spacing from '../theme/spacing';
import Radius from '../theme/radius';
import Shadows from '../theme/shadows';

export default function HomeScreen({ navigation }: any) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [avatarError, setAvatarError] = useState(false);
  const { currentUser } = useUser();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      alert('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handlePostPress = (postId: string) => {
    navigation.navigate('PostDetail', { postId });
  };

  const handleCommentPress = (postId: string) => {
    navigation.navigate('Comments', { postId });
  };

  const handleCreatePost = () => {
    navigation.navigate('CreatePost');
  };

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerGreeting}>Announcements</Text>
          <Text style={styles.headerSubtitle}>Stay updated with latest news</Text>
        </View>
      </View>

      {/* Compose Card */}
      {currentUser && (
        <TouchableOpacity 
          style={styles.composeCard}
          onPress={handleCreatePost}
        >
          {!avatarError ? (
            <Image
              source={{ uri: currentUser.avatar || 'https://ui-avatars.com/api/?name=' + currentUser.name }}
              style={styles.composeAvatar}
              onError={() => setAvatarError(true)}
            />
          ) : (
            <View style={[styles.composeAvatar, styles.fallbackComposeAvatar]}>
              <Text style={styles.fallbackComposeInitial}>
                {currentUser.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.composeInputSection}>
            <Text style={styles.composePlaceholder}>What's on your mind?</Text>
          </View>
          <Text style={styles.composeIcon}>✏️</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateEmoji}>📭</Text>
      <Text style={styles.emptyStateTitle}>No announcements yet</Text>
      <Text style={styles.emptyStateText}>
        Be the first to post an announcement!
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading announcements...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        onEndReachedThreshold={0.1}
      />
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
  composeCard: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
    ...Shadows.md,
  },
  composeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  fallbackComposeAvatar: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackComposeInitial: {
    color: Colors.white,
    ...Fonts.bold,
    fontSize: 16,
  },
  composeInputSection: {
    flex: 1,
  },
  composePlaceholder: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  composeIcon: {
    fontSize: 18,
    marginLeft: Spacing.sm,
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
