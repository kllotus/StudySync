import { supabase } from './supabase'

const themeCache = {}

export async function getSchoolTheme(email) {
  const domain = email.split("@")[1]?.toLowerCase()
  if (!domain?.endsWith(".edu")) return null
  if (themeCache[domain]) return themeCache[domain]

  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .eq('domain', domain)
    .single()

  if (error || !data) {
    // Unknown .edu — still let them in with default theme
    return { primary: "#A78BFA", secondary: "#5EEAD4", logo: "🎓", name: domain }
  }

  const theme = {
    name: data.name,
    shortName: data.short_name,
    primary: data.primary_color,
    secondary: data.secondary_color,
    logoUrL: data.logo_urL,
    accentDim: hexToRgba(data.primary_color, 0.15),
    accentText: lightenHex(data.primary_color),
  }

  themeCache[domain] = theme
  return theme
}

export function isEduEmail(email) {
  if (!email?.includes("@")) return false
  return email.split("@")[1]?.toLowerCase().endsWith(".edu") ?? false
}

export function getSchoolNameFromEmail(email) {
  const domain = email.split("@")[1]?.toLowerCase()
  return domain?.replace(".edu", "").toUpperCase() || ""
}

function hexToRgba(hex, opacity) {
  if (!hex?.startsWith("#")) return `rgba(167,139,250,${opacity})`
  const r = parseInt(hex.slice(1,3), 16)
  const g = parseInt(hex.slice(3,5), 16)
  const b = parseInt(hex.slice(5,7), 16)
  return `rgba(${r},${g},${b},${opacity})`
}

function lightenHex(hex) {
  if (!hex?.startsWith("#")) return "#C4B5FD"
  const r = Math.min(255, parseInt(hex.slice(1,3), 16) + 60)
  const g = Math.min(255, parseInt(hex.slice(3,5), 16) + 60)
  const b = Math.min(255, parseInt(hex.slice(5,7), 16) + 60)
  return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`
}