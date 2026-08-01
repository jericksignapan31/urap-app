// Mentions are stored inline in comment text as @[Name](userId) so the
// author's exact display name at mention-time is preserved even if they
// later rename, while still letting the mention link to their profile.
const MENTION_PATTERN = /@\[([^\]]+)\]\(([^)]+)\)/g;

export interface MentionSegment {
  text: string;
  userId?: string;
}

export const parseMentions = (content: string): MentionSegment[] => {
  const segments: MentionSegment[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(MENTION_PATTERN)) {
    const [full, name, userId] = match;
    const index = match.index ?? 0;

    if (index > lastIndex) {
      segments.push({ text: content.slice(lastIndex, index) });
    }
    segments.push({ text: `@${name}`, userId });
    lastIndex = index + full.length;
  }

  if (lastIndex < content.length) {
    segments.push({ text: content.slice(lastIndex) });
  }

  return segments;
};

export const encodeMentions = (
  text: string,
  mentions: { id: string; name: string }[]
): string => {
  let encoded = text;
  for (const mention of mentions) {
    if (encoded.includes(`@${mention.name}`)) {
      encoded = encoded.replace(`@${mention.name}`, `@[${mention.name}](${mention.id})`);
    }
  }
  return encoded;
};
