/**
 * Quran reader preferences and reading position.
 *
 * Kept out of the cache layer deliberately: this is user data, not cached API content,
 * so it must never be purged by a TTL or a version bump.
 */

const KEY = 'reader';

export const FONT_SIZES = [
  { id: 'sm', label: 'A',  arabic: 'text-xl',  translation: 'text-sm' },
  { id: 'md', label: 'A',  arabic: 'text-2xl', translation: 'text-base' },
  { id: 'lg', label: 'A',  arabic: 'text-3xl', translation: 'text-lg' },
  { id: 'xl', label: 'A',  arabic: 'text-4xl', translation: 'text-xl' },
];

const defaults = () => ({
  fontSize: 'md',
  showBangla: true,
  showEnglish: true,
  showMeaning: false,
  lastRead: null,      // { suraId, suraName, ayatNo, page, at }
  bookmarks: [],       // [{ ayatId, suraId, suraName, ayatNo, page, at }]
});

export function getReaderSettings() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaults(), ...JSON.parse(raw) } : defaults();
  } catch {
    return defaults();
  }
}

export function saveReaderSettings(patch) {
  const next = { ...getReaderSettings(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function fontClasses(id) {
  return FONT_SIZES.find((f) => f.id === id) ?? FONT_SIZES[1];
}

/** Remember where the reader got to, so it can be resumed from the sura list. */
export function setLastRead(entry) {
  return saveReaderSettings({ lastRead: { ...entry, at: Date.now() } });
}

export function isBookmarked(ayatId) {
  return getReaderSettings().bookmarks.some((b) => b.ayatId === ayatId);
}

/** Returns true when the ayat ended up bookmarked. */
export function toggleBookmark(entry) {
  const { bookmarks } = getReaderSettings();
  const existing = bookmarks.findIndex((b) => b.ayatId === entry.ayatId);

  if (existing >= 0) {
    bookmarks.splice(existing, 1);
    saveReaderSettings({ bookmarks });
    return false;
  }

  // Newest first, so the list reads as a history.
  bookmarks.unshift({ ...entry, at: Date.now() });
  saveReaderSettings({ bookmarks });
  return true;
}
