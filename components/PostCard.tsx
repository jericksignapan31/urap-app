import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Post } from '../types';
import Colors from '../theme/colors';
import Fonts from '../theme/fonts';
import Spacing from '../theme/spacing';
import Radius from '../theme/radius';
import Shadows from '../theme/shadows';

interface PostCardProps {
  post: Post;
  onPress?: () => void;
  onCommentPress?: (postId: string) => void;
}

export default function PostCard({
  post,
  onPress,
  onCommentPress,
}: PostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <Image
            source={{ uri: post.author.avatar || 'https://via.placeholder.com/50' }}
            style={styles.avatar}
          />
          <View style={styles.authorDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.authorName}>{post.author.name}</Text>
              {post.author.role === 'admin' && (
                <View style={styles.adminBadge}>
                  <Text style={styles.adminText}>ADMIN</Text>
                </View>
              )}
            </View>
            <Text style={styles.timestamp}>{formatDate(post.createdAt)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.text} numberOfLines={3}>
          {post.content}
        </Text>
      </View>

      {post.image && (
        <Image
          source={{ uri: post.image }}
          style={styles.image}
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.commentButton}
          onPress={() => onCommentPress?.(post.id)}
        >
          <Text style={styles.commentText}>💬 {post.commentsCount} Comments</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.md,
  },
  header: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: Spacing.sm,
  },
  authorDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    ...Fonts.bold,
    color: Colors.text,
    marginRight: Spacing.xs,
  },
  adminBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  adminText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  timestamp: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    padding: Spacing.md,
  },
  title: {
    ...Fonts.semibold,
    color: Colors.text,
    fontSize: 16,
    marginBottom: Spacing.xs,
  },
  text: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
  },
  commentButton: {
    padding: Spacing.sm,
  },
  commentText: {
    ...Fonts.semibold,
    color: Colors.primary,
    fontSize: 14,
  },
});
