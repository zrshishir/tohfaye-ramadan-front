/**
 * Regression checks for the Quran reader's stored state.
 *
 *   npm run check:reader
 *
 * Reading position and bookmarks are user data, not cached API content, so the main
 * thing to guard is that they persist and are never confused with the cache layer.
 */

const store = {};
globalThis.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
  get length() { return Object.keys(store).length; },
  key: (i) => Object.keys(store)[i],
};

const reader = await import('@/services/reader.js');
const cache = await import('@/services/cache.js');
const {
  getReaderSettings, saveReaderSettings, fontClasses, FONT_SIZES,
  setLastRead, isBookmarked, toggleBookmark,
} = reader;

let failed = 0;
const check = (n, ok) => { console.log(`${ok ? '  PASS' : '  FAIL'}  ${n}`); if (!ok) failed++; };
const reset = () => Object.keys(store).forEach((k) => delete store[k]);

console.log('\ndefaults');
reset();
const d = getReaderSettings();
check('medium font by default', d.fontSize === 'md');
check('pronunciation shown by default', d.showPronunciation === true);
check('Bangla meaning shown by default', d.showBangla === true);
// English is the extra one, off until asked for.
check('English hidden by default', d.showEnglish === false);
check('no reading position yet', d.lastRead === null);
check('no bookmarks yet', Array.isArray(d.bookmarks) && d.bookmarks.length === 0);

console.log('\npreferences persist');
reset();
saveReaderSettings({ fontSize: 'xl', showEnglish: true });
const p = getReaderSettings();
check('font size saved', p.fontSize === 'xl');
check('translation toggle saved', p.showEnglish === true);
check('untouched keys keep defaults', p.showBangla === true);

console.log('\nfontClasses');
check('maps an id to classes', fontClasses('lg').arabic === 'text-3xl');
check('falls back to medium for junk', fontClasses('nope').arabic === 'text-2xl');
check('every size has both classes', FONT_SIZES.every((f) => f.arabic && f.translation));

console.log('\nreading position');
reset();
setLastRead({ suraId: '2', suraName: 'Al-Baqarah', ayatNo: 11, page: 2 });
const lr = getReaderSettings().lastRead;
check('position stored', lr.suraName === 'Al-Baqarah' && lr.ayatNo === 11);
check('page stored for resuming', lr.page === 2);
check('timestamped', typeof lr.at === 'number');
setLastRead({ suraId: '3', suraName: 'Ali Imran', ayatNo: 1, page: 1 });
check('overwritten rather than appended', getReaderSettings().lastRead.suraName === 'Ali Imran');

console.log('\nbookmarks');
reset();
const entry = { ayatId: 42, suraId: '2', suraName: 'Al-Baqarah', ayatNo: 35, page: 4 };
check('not bookmarked initially', isBookmarked(42) === false);
check('toggle returns true when adding', toggleBookmark(entry) === true);
check('now reported as bookmarked', isBookmarked(42) === true);
check('toggle returns false when removing', toggleBookmark(entry) === false);
check('no longer bookmarked', isBookmarked(42) === false);

reset();
toggleBookmark({ ...entry, ayatId: 1 });
toggleBookmark({ ...entry, ayatId: 2 });
const marks = getReaderSettings().bookmarks;
check('newest first', marks[0].ayatId === 2);
check('both retained', marks.length === 2);
check('bookmark keeps the page for resuming', marks[0].page === 4);

console.log('\nreader data is not cache');
reset();
saveReaderSettings({ fontSize: 'lg' });
toggleBookmark(entry);
setLastRead({ suraId: '1', suraName: 'Al-Fatihah', ayatNo: 1, page: 1 });
cache.clearAll();
cache.purgeLegacyKeys();
const survived = getReaderSettings();
check('font size survives clearAll + legacy purge', survived.fontSize === 'lg');
check('bookmarks survive', survived.bookmarks.length === 1);
check('reading position survives', survived.lastRead.suraName === 'Al-Fatihah');

console.log('\ncorrupt data');
reset();
store['reader'] = '{broken';
check('falls back to defaults', getReaderSettings().fontSize === 'md');

console.log(failed === 0 ? '\nAll checks passed.' : `\n${failed} check(s) failed.`);
process.exit(failed ? 1 : 0);
