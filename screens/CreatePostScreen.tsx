import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import Colors from '../theme/colors';
import Fonts from '../theme/fonts';
import Spacing from '../theme/spacing';
import Radius from '../theme/radius';
import Shadows from '../theme/shadows';
import { mockPosts } from '../utils/mockData';

export default function CreatePostScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newPost = {
        id: String(mockPosts.length + 1),
        authorId: '2',
        author: {
          name: 'Maria Admin',
          role: 'admin' as const,
          avatar: 'https://via.placeholder.com/50',
        },
        title,
        content,
        image: imageUrl || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        commentsCount: 0,
      };

      mockPosts.unshift(newPost);
      setLoading(false);

      alert('Post created successfully!');
      navigation.goBack();
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Announcement</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Title Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter announcement title"
              placeholderTextColor={Colors.textSecondary}
              value={title}
              onChangeText={setTitle}
              editable={!loading}
            />
          </View>

          {/* Content Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Content *</Text>
            <TextInput
              style={[styles.input, styles.contentInput]}
              placeholder="Write your announcement here..."
              placeholderTextColor={Colors.textSecondary}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              editable={!loading}
            />
          </View>

          {/* Image URL Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Image URL (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Paste image URL here"
              placeholderTextColor={Colors.textSecondary}
              value={imageUrl}
              onChangeText={setImageUrl}
              editable={!loading}
            />
            {imageUrl && (
              <Image
                source={{ uri: imageUrl }}
                style={styles.imagePreview}
              />
            )}
          </View>

          {/* Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleCreatePost}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>Post Announcement</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    ...Shadows.lg,
    marginBottom: Spacing.md,
  },
  backButton: {
    ...Fonts.semibold,
    color: Colors.white,
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Fonts.bold,
    color: Colors.white,
    fontSize: 22,
  },
  form: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Fonts.semibold,
    color: Colors.text,
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    ...Fonts.regular,
    color: Colors.text,
    backgroundColor: Colors.white,
    ...Shadows.md,
  },
  contentInput: {
    minHeight: 120,
    paddingTop: Spacing.md,
  },
  imagePreview: {
    width: '100%',
    height: 180,
    borderRadius: Radius.lg,
    marginTop: Spacing.md,
    resizeMode: 'cover',
    ...Shadows.md,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  cancelButton: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  cancelButtonText: {
    ...Fonts.semibold,
    color: Colors.primary,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: Colors.primary,
  },
  submitButtonText: {
    ...Fonts.semibold,
    color: Colors.white,
    fontSize: 14,
  },
});
