import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Comment } from '../types';
import { incrementCommentsCount, decrementCommentsCount } from './postService';

// Create a new comment
export const createComment = async (
  postId: string,
  authorId: string,
  authorName: string,
  authorRole: string,
  authorAvatar: string,
  content: string
) => {
  try {
    const commentsRef = collection(db, 'comments');
    const docRef = await addDoc(commentsRef, {
      postId,
      authorId,
      author: {
        name: authorName,
        avatar: authorAvatar,
        role: authorRole,
      },
      content,
      createdAt: Timestamp.now(),
    });

    // Increment comments count in post
    await incrementCommentsCount(postId);

    console.log('Comment created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

// Get all comments for a specific post
export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  try {
    const commentsRef = collection(db, 'comments');
    const q = query(
      commentsRef,
      where('postId', '==', postId),
      orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);

    const comments: Comment[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      comments.push({
        id: doc.id,
        postId: data.postId,
        authorId: data.authorId,
        author: data.author,
        content: data.content,
        createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
      } as Comment);
    });

    return comments;
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (commentId: string, postId: string) => {
  try {
    const commentRef = doc(db, 'comments', commentId);
    await deleteDoc(commentRef);

    // Decrement comments count in post
    await decrementCommentsCount(postId);

    console.log('Comment deleted:', commentId);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Get comments count for a post
export const getCommentsCount = async (postId: string): Promise<number> => {
  try {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('postId', '==', postId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting comments count:', error);
    throw error;
  }
};
