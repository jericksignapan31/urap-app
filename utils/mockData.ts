import { Post, Comment, User } from '../types';

// Mock current user
export const currentUser: User = {
  id: '1',
  name: 'John Rider',
  email: 'john@urap.ph',
  role: 'user',
  verified: true,
  avatar: 'https://via.placeholder.com/50',
  createdAt: '2024-01-01',
};

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Rider',
    email: 'john@urap.ph',
    role: 'user',
    verified: true,
    avatar: 'https://via.placeholder.com/50',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Maria Admin',
    email: 'maria@urap.ph',
    role: 'admin',
    verified: true,
    avatar: 'https://via.placeholder.com/50',
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'Pedro Rider',
    email: 'pedro@urap.ph',
    role: 'user',
    verified: true,
    avatar: 'https://via.placeholder.com/50',
    createdAt: '2024-01-02',
  },
];

// Mock posts
export const mockPosts: Post[] = [
  {
    id: '1',
    authorId: '2',
    author: {
      name: 'Maria Admin',
      role: 'admin',
      avatar: 'https://via.placeholder.com/50',
    },
    title: 'Safety Reminder',
    content: 'Always wear your helmet when riding. Safety is our priority! Remember to check your vehicle before every trip.',
    image: 'https://via.placeholder.com/400x200?text=Safety',
    createdAt: '2024-07-27T10:30:00Z',
    updatedAt: '2024-07-27T10:30:00Z',
    commentsCount: 5,
    likesCount: 0,
  },
  {
    id: '2',
    authorId: '2',
    author: {
      name: 'Maria Admin',
      role: 'admin',
      avatar: 'https://via.placeholder.com/50',
    },
    title: 'URAP Monthly Meetup',
    content: 'Join us for our monthly meetup this Saturday at the city plaza. We will discuss new routes and safety protocols.',
    image: 'https://via.placeholder.com/400x200?text=Meetup',
    createdAt: '2024-07-26T14:15:00Z',
    updatedAt: '2024-07-26T14:15:00Z',
    commentsCount: 12,
    likesCount: 0,
  },
  {
    id: '3',
    authorId: '2',
    author: {
      name: 'Maria Admin',
      role: 'admin',
      avatar: 'https://via.placeholder.com/50',
    },
    title: 'New Riding Routes Available',
    content: 'We have added 5 new safe riding routes in the northern area. Check the routes section in the app for details.',
    createdAt: '2024-07-25T09:00:00Z',
    updatedAt: '2024-07-25T09:00:00Z',
    commentsCount: 8,
    likesCount: 0,
  },
];

// Mock comments
export const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    authorId: '1',
    author: {
      name: 'John Rider',
      role: 'user',
      avatar: 'https://via.placeholder.com/40',
    },
    content: 'Great reminder! I always check my helmet before riding.',
    createdAt: '2024-07-27T11:00:00Z',
  },
  {
    id: '2',
    postId: '1',
    authorId: '3',
    author: {
      name: 'Pedro Rider',
      role: 'user',
      avatar: 'https://via.placeholder.com/40',
    },
    content: 'Thanks for the tips. Safety first!',
    createdAt: '2024-07-27T11:30:00Z',
  },
  {
    id: '3',
    postId: '2',
    authorId: '1',
    author: {
      name: 'John Rider',
      role: 'user',
      avatar: 'https://via.placeholder.com/40',
    },
    content: 'What time is the meetup exactly?',
    createdAt: '2024-07-26T15:00:00Z',
  },
];
