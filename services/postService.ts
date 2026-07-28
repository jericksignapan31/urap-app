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
  arrayUnion,
  arrayRemove,
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
      likesCount: 0,
      likes: [], // Array of user IDs who liked this post
    });
    console.log('Post created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Get all posts ordered by createdAt (newest first)
export const getAllPosts = async (currentUserId?: string): Promise<Post[]> => {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const likes = data.likes || [];
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
        likesCount: data.likesCount || 0,
        liked: currentUserId ? likes.includes(currentUserId) : false,
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

// Like a post
export const likePost = async (postId: string, userId: string) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (postSnap.exists()) {
      const likes = postSnap.data().likes || [];
      
      // If user hasn't already liked this post
      if (!likes.includes(userId)) {
        await updateDoc(postRef, {
          likes: arrayUnion(userId),
          likesCount: likes.length + 1,
          updatedAt: Timestamp.now(),
        });
      }
    }
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

// Unlike a post
export const unlikePost = async (postId: string, userId: string) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (postSnap.exists()) {
      const likes = postSnap.data().likes || [];
      
      // If user has liked this post
      if (likes.includes(userId)) {
        await updateDoc(postRef, {
          likes: arrayRemove(userId),
          likesCount: Math.max(0, likes.length - 1),
          updatedAt: Timestamp.now(),
        });
      }
    }
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
};
