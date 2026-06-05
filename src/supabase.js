import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
  || 'https://ajrzndegtmjfehznwpyz.supabase.co'

const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  || 'sb_publishable_BMJrgc1L_lLYmqXEP1_F0A_CyYCH-1e'

export const supabase = createClient(url, key)

// ── Device ID — identifie le téléphone d'Adèle ───────────────────────
export function getDeviceId() {
  let id = localStorage.getItem('hockeyDeviceId')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('hockeyDeviceId', id)
  }
  return id
}
