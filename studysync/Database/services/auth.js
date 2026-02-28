import { supabase } from "../lib/supabase"

/**
 * Sign out the current user.
 */
export async function signOut(){
  const {error} = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Get the currently logged-in user's full profile.
 */
export async function getCurrentUserProfile() {
  const {data: {user}} = await supabase.auth.getUser()
  if (!user) return null

  const {data: error} = await supabase
  .from('users')
  .select('*')
  .eq('id', user.id)
  .single()
  
  if (error) throw error
  return data
}