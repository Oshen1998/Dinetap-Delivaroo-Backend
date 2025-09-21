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
