import { supabase } from '../lib/supabase'

export async function signUpAndSaveProfile(email, password, profileData) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })
  if (authError) throw authError

  const { error: profileError } = await supabase.from('users').insert({
    id: authData.user.id,
    name: profileData.name,
    major: profileData.major,
    courses: profileData.courses.split(',').map(c => c.trim()),
    study_style: profileData.style,
    level: profileData.level,
  })

  if (profileError) throw profileError
  return authData.user
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.user
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUserProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single()
  if (error) throw error
  return data
}