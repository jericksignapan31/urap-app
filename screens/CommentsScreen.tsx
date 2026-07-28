import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import Colors from '../theme/colors';
import Fonts from '../theme/fonts';
import Spacing from '../theme/spacing';
import Radius from '../theme/radius';
import Shadows from '../theme/shadows';
import { getCommentsByPostId, createComment } from '../services/commentService';
import { getPostById } from '../services/postService';
import { useUser } from '../context/UserContext';
import { Comment, Post } from '../types';

export default function CommentsScreen({ route, navigation }: any) {
  const { postId } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [avatarErrors, setAvatarErrors] = useState<Set<string>>(new Set());
  const { currentUser } = useUser();

  useEffect(() => {
    loadPostAndComments();
  }, []);

  const loadPostAndComments = async () => {
    try {
      setLoading(true);
      const postData = await getPostById(postId);
      setPost(postData);

      const commentsData = await getCommentsByPostId(postId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
      alert('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert('Please write a comment');
      return;
    }

    if (!currentUser) {
      alert('User not authenticated');
      return;
    }

    try {
      setSubmitting(true);

      // Create comment in Firebase
      await createComment(
        postId,
        currentUser.id,
        currentUser.name,
        currentUser.role,
        currentUser.avatar || 'https://via.placeholder.com/40',
        newComment
      );

      setNewComment('');
      // Reload comments
      await loadPostAndComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButtonContainer}
        >
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Comments</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Post Preview */}
      {post && (
        <View style={styles.postPreview}>
          <View style={styles.postHeader}>
            <Image
              source={{ uri: post.author.avatar }}
              style={styles.postAvatar}
            />
            <View style={styles.postAuthorInfo}>
              <Text style={styles.postAuthorName}>{post.author.name}</Text>
              <Text style={styles.postTime}>
                {new Date(post.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postContent} numberOfLines={2}>
            {post.content}
          </Text>
        </View>
      )}

      <Text style={styles.commentCount}>
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </Text>
    </View>
  );

  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      {!avatarErrors.has(item.id) ? (
        <Image
          source={{ uri: item.author.avatar || 'https://ui-avatars.com/api/?name=' + item.author.name }}
          style={styles.commentAvatar}
          onError={() => setAvatarErrors(new Set([...avatarErrors, item.id]))}
        />
      ) : (
        <View style={[styles.commentAvatar, styles.fallbackCommentAvatar]}>
          <Text style={styles.fallbackCommentInitial}>
            {item.author.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentAuthor}>{item.author.name}</Text>
          {item.author.role === 'admin' && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminText}>ADMIN</Text>
            </View>
          )}
        </View>
        <Text style={styles.commentTime}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.commentText}>{item.content}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading comments...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />

      {/* Comment Input Box */}
      {currentUser && (
        <View style={styles.inputContainer}>
          {!avatarErrors.has('currentUser') ? (
            <Image
              source={{ uri: currentUser.avatar || 'https://ui-avatars.com/api/?name=' + currentUser.name }}
              style={styles.userAvatar}
              onError={() => setAvatarErrors(new Set([...avatarErrors, 'currentUser']))}
            />
          ) : (
            <View style={[styles.userAvatar, styles.fallbackUserAvatar]}>
              <Text style={styles.fallbackUserInitial}>
                {currentUser.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Write a comment..."
              placeholderTextColor={Colors.textSecondary}
              value={newComment}
              onChangeText={setNewComment}
              multiline
              editable={!submitting}
            />
            <TouchableOpacity
              style={[styles.sendButton, submitting && styles.sendButtonDisabled]}
              onPress={handleAddComment}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.sendButtonText}>Send</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
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
  postPreview: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  postAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  postAuthorInfo: {
    flex: 1,
  },
  postAuthorName: {
    ...Fonts.semibold,
    color: Colors.text,
    fontSize: 13,
  },
  postTime: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  postTitle: {
    ...Fonts.semibold,
    color: Colors.text,
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  postContent: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  commentCount: {
    ...Fonts.semibold,
    color: Colors.text,
    fontSize: 13,
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.md,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  commentAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  fallbackCommentAvatar: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackCommentInitial: {
    color: Colors.white,
    ...Fonts.bold,
    fontSize: 14,
  },
  commentContent: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    ...Shadows.sm,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAuthor: {
    ...Fonts.semibold,
    color: Colors.text,
    fontSize: 13,
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
    fontSize: 9,
    fontWeight: '700',
  },
  commentTime: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  commentText: {
    ...Fonts.regular,
    color: Colors.text,
    fontSize: 12,
    marginTop: Spacing.xs,
    lineHeight: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  fallbackUserAvatar: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackUserInitial: {
    color: Colors.white,
    ...Fonts.bold,
    fontSize: 14,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    alignItems: 'flex-end',
    paddingRight: Spacing.sm,
    gap: Spacing.xs,
  },
  input: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    ...Fonts.regular,
    color: Colors.text,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.lg,
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
  sendButtonText: {
    ...Fonts.semibold,
    color: Colors.white,
    fontSize: 12,
  },
});
