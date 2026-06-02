/**
 * Splits a comma-separated string into a trimmed, non-empty array of strings.
 */
export function parseList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}
