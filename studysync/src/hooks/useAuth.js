import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getCurrentUserProfile } from '../services/auth'

/**
 * useAuth
 * 
 * Tracks whether the user is logged in and loads their profile.
 * Use this at the top of your App.jsx to replace the useState(null) user check.
 * 
 * @returns {{ user, loading, setUser }}
 */
export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if there's already a logged-in session
    async function loadUser() {
      const profile = await getCurrentUserProfile()
      setUser(profile)
      setLoading(false)
    }

    loadUser()

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        const profile = await getCurrentUserProfile()
        setUser(profile)
      }
      if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading, setUser }
}