import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Post } from '../types';

// Create a new post
export const createPost = async (
  authorId: string,
  authorName: string,
  authorRole: string,
  authorAvatar: string,
  title: string,
  content: string,
  image?: string
) => {
  try {
    const postsRef = collection(db, 'posts');
    const docRef = await addDoc(postsRef, {
      authorId,
      author: {
        name: authorName,
        avatar: authorAvatar,
        role: authorRole,
      },
      title,
      content,
      image: image || null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      commentsCount: 0,
    });
    console.log('Post created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Get all posts ordered by createdAt (newest first)
export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        authorId: data.authorId,
        author: data.author,
        title: data.title,
        content: data.content,
        image: data.image,
        createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
        commentsCount: data.commentsCount || 0,
      } as Post);
    });

    return posts;
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
};

// Get a single post by ID
export const getPostById = async (postId: string): Promise<Post | null> => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const data = postSnap.data();
      return {
        id: postSnap.id,
        authorId: data.authorId,
        author: data.author,
        title: data.title,
        content: data.content,
        image: data.image,
        createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
        commentsCount: data.commentsCount || 0,
      } as Post;
    }
    return null;
  } catch (error) {
    console.error('Error getting post:', error);
    throw error;
  }
};

// Update a post
export const updatePost = async (
  postId: string,
  updates: Partial<Post>
) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    console.log('Post updated:', postId);
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// Delete a post
export const deletePost = async (postId: string) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
    console.log('Post deleted:', postId);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// Increment comments count
export const incrementCommentsCount = async (postId: string) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      const currentCount = postSnap.data().commentsCount || 0;
      await updateDoc(postRef, {
        commentsCount: currentCount + 1,
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error incrementing comments count:', error);
    throw error;
  }
};

// Decrement comments count
export const decrementCommentsCount = async (postId: string) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      const currentCount = postSnap.data().commentsCount || 0;
      await updateDoc(postRef, {
        commentsCount: Math.max(0, currentCount - 1),
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error decrementing comments count:', error);
    throw error;
  }
};
