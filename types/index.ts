// User roles
export type UserRole = 'admin' | 'user';

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

// Post/Announcement type
export interface Post {
  id: string;
  authorId: string;
  author: {
    name: string;
    avatar?: string;
    role: UserRole;
  };
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  commentsCount: number;
  likesCount: number;
  liked?: boolean; // Whether current user has liked this post
}

// Comment type
export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
}

// Comment type
export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: {
    name: string;
    avatar?: string;
    role: UserRole;
  };
  content: string;
  createdAt: string;
}
