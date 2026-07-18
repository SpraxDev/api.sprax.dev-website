/**
 * Recursively shortens long string values so a JSON document (e.g. a profile
 * with base64 texture blobs) fits a collapsed preview.
 */
export function abridgeStrings(value: unknown, maxLength = 40): unknown {
  if (typeof value === 'string') {
    return value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;
  }
  if (Array.isArray(value)) {
    return value.map((entry) => abridgeStrings(entry, maxLength));
  }
  if (typeof value === 'object' && value != null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, abridgeStrings(entry, maxLength)])
    );
  }
  return value;
}
