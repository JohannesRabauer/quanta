/**
 * Splits a comma-separated string into a trimmed, non-empty array of strings.
 */
export function parseList(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

/**
 * Normalizes a comma-separated string into a stable, de-duplicated list representation.
 */
export function normalizeListInput(value: string): string {
  return Array.from(new Set(parseList(value))).join(", ");
}
