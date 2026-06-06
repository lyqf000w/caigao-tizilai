import type { PracticeSession } from '../types/practice'

const STORAGE_KEY = 'cgttl_sessions_v1'
const FAVORITE_KEY = 'cgttl_favorites_v1'

export function readSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as PracticeSession[]
  } catch {
    return []
  }
}

export function persistSessions(sessions: PracticeSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export function readFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITE_KEY) || '[]') as string[]
  } catch {
    return []
  }
}

export function persistFavorites(favorites: string[]) {
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites))
}
