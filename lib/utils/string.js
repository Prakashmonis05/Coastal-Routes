/**
 * Normalizes stop names and search queries:
 * converts to lowercase, removes accents/diacritics,
 * trims extra spaces and replaces special characters.
 */
export function normalizeName(str) {
  if (!str) return "";
  return str
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s]/g, " ")     // replace punctuation with space
    .replace(/\s+/g, " ")             // collapse multi-spaces
    .trim();
}

/**
 * Format date for clean display
 */
export function formatDate(date) {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}
