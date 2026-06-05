import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = (url && key) ? createClient(url, key) : null

// ── Device ID — identifie le téléphone d'Adèle ───────────────────────
export function getDeviceId() {
  let id = localStorage.getItem('hockeyDeviceId')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('hockeyDeviceId', id)
  }
  return id
}
