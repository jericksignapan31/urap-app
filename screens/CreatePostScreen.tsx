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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { createPost } from '../services/postService';
import { uploadImageToCloudinary } from '../services/cloudinaryService';
import { useUser } from '../context/UserContext';
import Colors from '../theme/colors';
import Fonts from '../theme/fonts';
import Spacing from '../theme/spacing';
import Radius from '../theme/radius';
import Shadows from '../theme/shadows';

export default function CreatePostScreen({ navigation }: any) {
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useUser();

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
    }
  };

  const handleCreatePost = async () => {
    if (!content.trim()) {
      alert('Please write something in your announcement');
      return;
    }

    if (!currentUser) {
      alert('User not authenticated');
      return;
    }

    setLoading(true);

    try {
      const uploadedImageUrl = imageUri ? await uploadImageToCloudinary(imageUri) : undefined;

      // Create post in Firebase with current user data
      await createPost(
        currentUser.id,
        currentUser.name,
        currentUser.role,
        currentUser.avatar || 'https://via.placeholder.com/50',
        content.split('\n')[0] || 'Announcement',
        content,
        uploadedImageUrl
      );

      setContent('');
      setImageUri(null);
      Alert.alert('Success', 'Post created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error creating post:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to create post: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create post</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={styles.userSection}>
        <Image
          source={{ uri: currentUser.avatar || 'https://via.placeholder.com/50' }}
          style={styles.userAvatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{currentUser.name}</Text>
          <View style={styles.privacyBadge}>
            <Text style={styles.privacyIcon}>👥</Text>
            <Text style={styles.privacyText}>Public</Text>
          </View>
        </View>
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
              onPress={() => setImageUri(null)}
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

      {/* Post Button Footer */}
      <View style={styles.footerSection}>
        <TouchableOpacity
          style={[styles.postButton, loading && styles.postButtonDisabled]}
          onPress={handleCreatePost}
          disabled={loading || !content.trim()}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...Fonts.semibold,
    fontSize: 15,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.md,
    alignSelf: 'flex-start',
  },
  privacyIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  privacyText: {
    ...Fonts.regular,
    fontSize: 12,
    color: Colors.text,
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
