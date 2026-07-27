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
        <Text style={styles.headerTitle}>URAP Announcements</Text>
        {currentUser.role === 'admin' && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreatePost}
          >
            <Text style={styles.createButtonText}>+ Post</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
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
    padding: Spacing.md,
    paddingTop: Spacing.sm,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingBottom: Spacing.lg,
    marginBottom: Spacing.md,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
    marginHorizontal: -Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...Fonts.bold,
    color: Colors.white,
    fontSize: 24,
  },
  createButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  createButtonText: {
    ...Fonts.semibold,
    color: Colors.primary,
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
  },
});
