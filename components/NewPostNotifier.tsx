import { useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { subscribeToPosts } from '../services/postService';
import { requestNotificationPermissions, notifyNewPost } from '../services/notificationService';

// Watches the live posts feed for the whole time the user is logged in
// (regardless of which tab is active) and fires a local notification +
// badge bump for posts authored by someone else. Mounted once at the app
// root so it isn't tied to HomeScreen being mounted/focused.
export default function NewPostNotifier() {
  const { currentUser } = useUser();
  const knownPostIds = useRef<Set<string> | null>(null);

  useEffect(() => {
    if (!currentUser) {
      knownPostIds.current = null;
      return;
    }

    requestNotificationPermissions();

    const unsubscribe = subscribeToPosts(currentUser.id, (posts) => {
      if (knownPostIds.current === null) {
        // First snapshot after login/mount is the existing feed, not new
        // posts — just record it as the baseline without notifying.
        knownPostIds.current = new Set(posts.map((p) => p.id));
        return;
      }

      const newPosts = posts.filter(
        (post) => !knownPostIds.current!.has(post.id) && post.authorId !== currentUser.id
      );

      knownPostIds.current = new Set(posts.map((p) => p.id));

      for (const post of newPosts) {
        notifyNewPost(post.author.name, post.title);
      }
    });

    return () => unsubscribe();
  }, [currentUser?.id]);

  return null;
}
