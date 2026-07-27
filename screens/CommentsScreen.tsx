import React, { useState } from 'react';
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
import { mockComments, mockPosts, currentUser } from '../utils/mockData';
import { Comment } from '../types';

export default function CommentsScreen({ route, navigation }: any) {
  const { postId } = route.params;
  const post = mockPosts.find((p) => p.id === postId);
  const [comments, setComments] = useState<Comment[]>(
    mockComments.filter((c) => c.postId === postId)
  );
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddComment = () => {
    if (!newComment.trim()) {
      alert('Please write a comment');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const comment: Comment = {
        id: String(comments.length + 1),
        postId,
        authorId: currentUser.id,
        author: {
          name: currentUser.name,
          role: currentUser.role,
          avatar: currentUser.avatar,
        },
        content: newComment,
        createdAt: new Date().toISOString(),
      };

      setComments([...comments, comment]);
      setNewComment('');
      setLoading(false);
    }, 500);
  };

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Comments</Text>
      </View>

      {/* Post Preview */}
      {post && (
        <View style={[styles.postPreview, styles.section]}>
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

      <View style={styles.divider} />
      <Text style={styles.commentCount}>
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </Text>
    </View>
  );

  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Image
        source={{ uri: item.author.avatar || 'https://via.placeholder.com/40' }}
        style={styles.commentAvatar}
      />
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
      <View style={styles.inputContainer}>
        <Image
          source={{ uri: currentUser.avatar }}
          style={styles.userAvatar}
        />
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            placeholderTextColor={Colors.textSecondary}
            value={newComment}
            onChangeText={setNewComment}
            multiline
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
            onPress={handleAddComment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Text style={styles.sendButtonText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
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
  },
  header: {
    paddingBottom: Spacing.md,
  },
  backButton: {
    ...Fonts.semibold,
    color: Colors.primary,
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Fonts.bold,
    color: Colors.text,
    fontSize: 20,
  },
  section: {
    marginBottom: Spacing.md,
  },
  postPreview: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Spacing.sm,
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
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  commentCount: {
    ...Fonts.semibold,
    color: Colors.text,
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: Spacing.sm,
  },
  commentContent: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
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
    fontSize: 13,
    marginTop: Spacing.xs,
    lineHeight: 18,
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
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
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
    borderRadius: Radius.sm,
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
