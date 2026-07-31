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
  onLikePress?: (postId: string, isLiked: boolean) => void;
}

export default function PostCard({
  post,
  onPress,
  onCommentPress,
  onLikePress,
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.liked || false);
  const [likeCount, setLikeCount] = useState(post.likesCount || 0);
  const [avatarError, setAvatarError] = useState(false);

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

  const handleLike = () => {
    const newLikeState = !isLiked;
    setIsLiked(newLikeState);
    setLikeCount(newLikeState ? likeCount + 1 : Math.max(0, likeCount - 1));
    onLikePress?.(post.id, newLikeState);
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      {/* Header - Author Info */}
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          {!avatarError ? (
            <Image
              source={{ uri: post.author.avatar || 'https://ui-avatars.com/api/?name=' + post.author.name }}
              style={styles.avatar}
              onError={() => setAvatarError(true)}
            />
          ) : (
            <View style={[styles.avatar, styles.fallbackAvatar]}>
              <Text style={styles.fallbackInitial}>
                {post.author.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.authorDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.authorName}>{post.author.name}</Text>
              {(post.author.role === 'admin' || post.author.role === 'superadmin') && (
                <View style={styles.adminBadge}>
                  <Text style={styles.adminText}>ADMIN</Text>
                </View>
              )}
            </View>
            <Text style={styles.timestamp}>{formatDate(post.createdAt)}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Text style={styles.moreButton}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Content - Title and Text */}
      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.text}>{post.content}</Text>
      </View>

      {/* Image */}
      {post.image && (
        <Image
          source={{ uri: post.image }}
          style={styles.image}
        />
      )}

      {/* Engagement Stats */}
      {(likeCount > 0 || post.commentsCount > 0) && (
        <View style={styles.stats}>
          {likeCount > 0 && (
            <Text style={styles.statsText}>👍 {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</Text>
          )}
          {post.commentsCount > 0 && (
            <Text style={styles.statsText}>{post.commentsCount} {post.commentsCount === 1 ? 'Comment' : 'Comments'}</Text>
          )}
        </View>
      )}

      {/* Divider */}
      <View style={styles.divider} />

      {/* Footer - Actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLike}
        >
          <Text style={[styles.actionText, isLiked && styles.actionTextActive]}>
            {isLiked ? '👍' : '🤍'} Like
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onCommentPress?.(post.id)}
        >
          <Text style={styles.actionText}>💬 Comment</Text>
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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: Spacing.sm,
    borderWidth: 1.5,
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
    fontSize: 18,
  },
  authorDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  authorName: {
    ...Fonts.semibold,
    color: Colors.text,
    fontSize: 14,
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
    fontSize: 8,
    fontWeight: '700',
  },
  timestamp: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  moreButton: {
    fontSize: 20,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.sm,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingTop: 0,
  },
  title: {
    ...Fonts.semibold,
    color: Colors.text,
    fontSize: 15,
    marginBottom: Spacing.xs,
  },
  text: {
    ...Fonts.regular,
    color: Colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  stats: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  statsText: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.border,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  actionText: {
    ...Fonts.semibold,
    color: Colors.textSecondary,
    fontSize: 13,
  },
  actionTextActive: {
    color: Colors.primary,
  },
});
