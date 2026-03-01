/**
 * Calculate a compatibility score between the current user and a session.
 * Returns a number between 50–99.
 * 
 * @param {Object} currentUser - from your users table
 * @param {Object} session - from your sessions table (with host attached)
 */
export function getCompatibilityScore(currentUser, session) {
  let score = 50

  if (!currentUser) return score

  // +3- pts if user is enrolled in the session's course
  const userCourses = currentUser.courses || []
  const inSameCourse = userCourses.some(c => 
    session.course.toLowerCase().includes(c.toLowerCase())
  )
  if (inSameCourse) score += 30

  // +15 pts if study styles match
  if (currentUser.study_style === session.style) score += 15

  // +5 pts if same knowledge level (good for peer studying)
  if (currentUser.level === session.host?.level) score += 5

  // Cap at 99 - 100%
  return Math.min(score, 99)
}