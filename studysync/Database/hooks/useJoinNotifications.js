import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * useJoinNotifications
 * 
 * When someone joins your session, you get a real-time notification.
 * Use this in your main app to show a toast/alert to the session host.
 * 
 * @param {string} sessionId - the session to watch (your hosted session)
 * @returns {{ notifications: Array, clearNotifications: Function }}
 */
export function useJoinNotifications(sessionId) {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (!sessionId) return

    const channel = supabase
      .channel(`session-joins-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'session_members',
          filter: `session_id=eq.${sessionId}`,
        },
        async (payload) => {
          // Fetch the joining user's name
          const { data: joiner } = await supabase
            .from('users')
            .select('name')
            .eq('id', payload.new.user_id)
            .single()

          if (joiner) {
            setNotifications(prev => [
              ...prev,
              { id: Date.now(), message: `${joiner.name} joined your session!` }
            ])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId])

  function clearNotifications() {
    setNotifications([])
  }

  return { notifications, clearNotifications }
}