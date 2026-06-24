import { initialProperties } from './data.js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const TABLE = import.meta.env.VITE_SUPABASE_TABLE || 'properties'
const LS_KEY = 'ab-realty-properties'

const headers = SUPABASE_KEY ? {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation'
} : {}

export const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY)

export async function getProperties() {
  if (hasSupabase) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?select=*&order=created_at.desc`, { headers })
    if (!res.ok) throw new Error('Could not load Supabase properties')
    const rows = await res.json()
    return rows.length ? rows : initialProperties
  }
  const stored = localStorage.getItem(LS_KEY)
  return stored ? JSON.parse(stored) : initialProperties
}

export async function saveProperty(property) {
  const item = { ...property, updated_at: new Date().toISOString() }
  if (hasSupabase) {
    const method = item.id ? 'PATCH' : 'POST'
    const url = item.id
      ? `${SUPABASE_URL}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(item.id)}`
      : `${SUPABASE_URL}/rest/v1/${TABLE}`
    const body = JSON.stringify(item.id ? item : { ...item, id: crypto.randomUUID() })
    const res = await fetch(url, { method, headers, body })
    if (!res.ok) throw new Error('Could not save property')
    const data = await res.json()
    return data[0]
  }
  const properties = await getProperties()
  const saved = item.id ? item : { ...item, id: crypto.randomUUID() }
  const next = properties.some(p => p.id === saved.id)
    ? properties.map(p => p.id === saved.id ? saved : p)
    : [saved, ...properties]
  localStorage.setItem(LS_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event('properties-updated'))
  return saved
}

export async function deleteProperty(id) {
  if (hasSupabase) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE', headers })
    if (!res.ok) throw new Error('Could not delete property')
    return true
  }
  const properties = await getProperties()
  localStorage.setItem(LS_KEY, JSON.stringify(properties.filter(p => p.id !== id)))
  window.dispatchEvent(new Event('properties-updated'))
  return true
}
