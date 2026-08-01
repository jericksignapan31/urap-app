import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { updatePost } from '../services/postService';
import { uploadImageToCloudinary } from '../services/cloudinaryService';
import { useAlert } from '../context/AlertContext';
import { Post } from '../types';
import Colors from '../theme/colors';
import Fonts from '../theme/fonts';
import Spacing from '../theme/spacing';
import Radius from '../theme/radius';
import Shadows from '../theme/shadows';

export default function EditPostScreen({ route, navigation }: any) {
  const { post }: { post: Post } = route.params;
  const { showAlert } = useAlert();
  const [content, setContent] = useState(post.content);
  const [imageUri, setImageUri] = useState<string | null>(post.image || null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Please allow access to your photos to add an image');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setImageRemoved(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUri(null);
    setImageRemoved(true);
  };

  const isLocalImage = (uri: string) => uri.startsWith('file://') || uri.startsWith('content://');

  const handleSave = async () => {
    if (!content.trim()) {
      alert('Please write something in your announcement');
      return;
    }

    setLoading(true);

    try {
      const updates: Partial<Post> = {
        title: content.split('\n')[0] || 'Announcement',
        content,
      };

      if (imageRemoved) {
        updates.image = null;
      } else if (imageUri && isLocalImage(imageUri)) {
        updates.image = await uploadImageToCloudinary(imageUri);
      }
      // else: image field is left out entirely, so the existing value is untouched.

      await updatePost(post.id, updates);

      showAlert({
        type: 'success',
        title: 'Success',
        message: 'Post updated successfully!',
        buttons: [{ text: 'OK', onPress: () => navigation.goBack() }],
      });
    } catch (error) {
      console.error('Error updating post:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      showAlert({ type: 'error', title: 'Update Failed', message: `Failed to update post: ${message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit post</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Compose Area */}
      <ScrollView style={styles.composeArea} showsVerticalScrollIndicator={false}>
        <TextInput
          style={styles.composInput}
          placeholder="What's on your mind?"
          placeholderTextColor={Colors.textSecondary}
          value={content}
          onChangeText={setContent}
          multiline
          editable={!loading}
        />

        {imageUri && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={handleRemoveImage}
              disabled={loading}
            >
              <Text style={styles.removeImageText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Add to Post */}
      <View style={styles.addToPost}>
        <Text style={styles.addToPostLabel}>Add to your post</Text>
        <View style={styles.actionIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handlePickImage}
            disabled={loading}
          >
            <Text style={styles.icon}>🖼️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Save Button Footer */}
      <View style={styles.footerSection}>
        <TouchableOpacity
          style={[styles.postButton, loading && styles.postButtonDisabled]}
          onPress={handleSave}
          disabled={loading || !content.trim()}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.postButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Fonts.bold,
    fontSize: 18,
    color: Colors.text,
  },
  closeButton: {
    fontSize: 24,
    color: Colors.text,
    padding: Spacing.sm,
  },
  composeArea: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  composInput: {
    ...Fonts.regular,
    fontSize: 16,
    color: Colors.text,
    maxHeight: 200,
    textAlignVertical: 'top',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginTop: Spacing.md,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: Radius.lg,
    marginTop: Spacing.md,
  },
  removeImageButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  removeImageText: {
    fontSize: 18,
    color: Colors.text,
  },
  addToPost: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    marginBottom: Spacing.md,
  },
  addToPostLabel: {
    ...Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  iconButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginRight: Spacing.sm,
  },
  icon: {
    fontSize: 20,
  },
  footerSection: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  postButton: {
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  postButtonDisabled: {
    backgroundColor: Colors.textSecondary,
    opacity: 0.6,
  },
  postButtonText: {
    ...Fonts.semibold,
    fontSize: 16,
    color: Colors.white,
  },
});
