/**
 * Accounts are optional. Everything in the app works signed out — an account exists
 * only so bookmarks and tasbih counts follow a user between devices.
 *
 * The token is kept apart from cached content so a cache purge never signs anyone out.
 */

import api, { unwrap } from '@/services/api';
import { getReaderSettings, saveReaderSettings } from '@/services/reader';

const KEY = 'auth';

export function getAuth() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
}

export const isSignedIn = () => Boolean(getAuth().token);

function setAuth(token, user) {
  localStorage.setItem(KEY, JSON.stringify({ token, user }));
}

function clearAuth() {
  localStorage.removeItem(KEY);
}

// ------------------------------------------------------------------ session

export async function register({ name, email, password, passwordConfirmation }) {
  const data = unwrap(await api.post('/auth/register', {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation,
  }), null);

  setAuth(data.token, data.user);
  await syncOnSignIn();
  return data.user;
}

export async function login({ email, password }) {
  const data = unwrap(await api.post('/auth/login', { email, password }), null);

  setAuth(data.token, data.user);
  await syncOnSignIn();
  return data.user;
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // A revoked or expired token still means signing out locally.
    console.error('Logout request failed:', error);
  }
  clearAuth();
}

export async function deleteAccount(password) {
  await api.delete('/auth/account', { data: { password } });
  clearAuth();
}

// --------------------------------------------------------------------- sync

/**
 * Push what is on this device, then adopt the merged set the server returns.
 *
 * The server merges rather than replaces, so reading on a phone before signing up does
 * not lose those bookmarks, and signing in on a second device does not wipe the account.
 */
export async function syncOnSignIn() {
  await syncBookmarks();
  await syncTasbih();
}

async function syncBookmarks() {
  const local = getReaderSettings().bookmarks ?? [];

  try {
    const merged = unwrap(await api.post('/bookmarks/sync', {
      bookmarks: local.map((b) => ({
        ayat_id: b.ayatId,
        sura_id: Number(b.suraId) || null,
        ayat_no: b.ayatNo ?? null,
        page: b.page ?? null,
      })),
    }));

    saveReaderSettings({
      bookmarks: merged.map((b) => ({
        ayatId: b.ayat_id,
        suraId: String(b.sura_id ?? b.ayat?.sura_id ?? ''),
        suraName: b.sura?.name ?? '',
        ayatNo: b.ayat_no ?? b.ayat?.ayat_no ?? null,
        page: b.page ?? 1,
        at: new Date(b.created_at ?? Date.now()).getTime(),
      })),
    });
  } catch (error) {
    // Sync is best-effort: failing to merge must not block signing in.
    console.error('Bookmark sync failed:', error);
  }
}

async function syncTasbih() {
  let local = [];
  try {
    local = JSON.parse(localStorage.getItem('tasbih') ?? '{}')?.tasbihs ?? [];
  } catch {
    local = [];
  }

  if (!local.length) return;

  try {
    const merged = unwrap(await api.post('/tasbih/sync', { tasbih: local }), null);

    if (merged?.tasbih) {
      localStorage.setItem('tasbih', JSON.stringify({ tasbihs: merged.tasbih }));
    }
  } catch (error) {
    console.error('Tasbih sync failed:', error);
  }
}
