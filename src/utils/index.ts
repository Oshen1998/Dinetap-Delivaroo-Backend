export function msFromStr(s: string) {
  if (!s) return 30 * 24 * 60 * 60 * 1000;
  const num = parseInt(s.slice(0, -1), 10);
  const unit = s.slice(-1);
  switch (unit) {
    case 'm':
      return num * 60 * 1000;
    case 'h':
      return num * 60 * 60 * 1000;
    case 'd':
      return num * 24 * 60 * 60 * 1000;
    default:
      return parseInt(s, 10);
  }
}

export const removeUndefined = <T extends Record<string, any>>(
  obj: T
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
};

export const generateRandomNumber = (
  start: number,
  between: number
): number => {
  return Math.floor(Math.random() * between + start);
};

export const generateRandomEmoji = (text: string): string => {
  const emojis = ['😀', '🥳', '🚀', '🌟', '🌈', '💯', '✨', '🎉', '💡', '🔥'];

  const randomIndex1 = Math.floor(generateRandomNumber(0, emojis.length));

  const emoji1 = emojis[randomIndex1];

  return `${emoji1} ${text} ${emoji1}`;
};
