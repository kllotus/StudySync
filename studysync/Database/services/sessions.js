import { supabase } from '../lib/supabase'

/**
 * Fetch all active sessions, with the host's profile attached.

 */
export async function getActiveSessions() {
  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      host:users(id, name, study_style, level)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Post a new study session.
 * Called when user submits your PostModal form.
 */
export async function createSession({ course, topic, location, time, style, tags = [] }) {
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('sessions')
    .insert({
      host_id: user.id,
      course,
      topic,
      location,
      time_window: time,
      style,
      tags,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Join a session. 
 * Called when user clicks "Join Session →" on a SessionCard.
 */
export async function joinSession(sessionId) {
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('session_members')
    .insert({ session_id: sessionId, user_id: user.id })

  if (error) throw error
}

/**
 * Leave a session.
 */
export async function leaveSession(sessionId) {
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('session_members')
    .delete()
    .match({ session_id: sessionId, user_id: user.id })

  if (error) throw error
}

/**
 * Get all sessions the current user has joined.
 * Powers your "My Sessions" tab.
 */
export async function getJoinedSessions() {
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('session_members')
    .select(`
      joined_at,
      session:sessions(
        *,
        host:users(name, study_style, level)
      )
    `)
    .eq('user_id', user.id)
    .order('joined_at', { ascending: false })

  if (error) throw error
  return data.map(row => row.session) // flatten
}

/**
 * Delete a session (only the host can do this — enforced by RLS).
 */
export async function deleteSession(sessionId) {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', sessionId)

  if (error) throw error
}