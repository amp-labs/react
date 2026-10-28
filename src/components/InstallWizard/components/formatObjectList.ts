/** "messages", "messages and channels", "messages, channels and users". */
export function formatObjectList(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";

  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}
