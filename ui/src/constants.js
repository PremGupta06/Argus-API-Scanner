export const CHECKS = [
  { key: 'SecurityHeadersCheck', label: 'Security headers', desc: 'Hardening headers and server leaks' },
  { key: 'MissingAuthCheck', label: 'Authentication', desc: 'Protected routes open without a token' },
  { key: 'RateLimitCheck', label: 'Rate limiting', desc: 'Brute-force and abuse protection' },
  { key: 'DataExposureCheck', label: 'Data exposure', desc: 'Secrets and personal data in responses' },
  { key: 'BolaCheck', label: 'Object-level access (BOLA)', desc: 'Reading objects that belong to others' },
  { key: 'MassAssignmentCheck', label: 'Mass assignment', desc: 'Privileged fields accepted from clients' },
]

export const SEVERITIES = ['critical', 'high', 'medium', 'low', 'info']

export const SEV_STYLE = {
  critical: { text: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/40', dot: 'bg-red-500' },
  high: { text: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/40', dot: 'bg-orange-500' },
  medium: { text: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/40', dot: 'bg-amber-500' },
  low: { text: 'text-sky-400', bg: 'bg-sky-500/15', border: 'border-sky-500/40', dot: 'bg-sky-500' },
  info: { text: 'text-slate-400', bg: 'bg-slate-500/15', border: 'border-slate-500/40', dot: 'bg-slate-500' },
}

const PENALTY = { critical: 40, high: 18, medium: 7, low: 2, info: 0 }

export function riskScore(findings) {
  const total = findings.reduce((sum, f) => sum + PENALTY[f.severity], 0)
  return Math.max(0, 100 - total)
}

export function gradeOf(score) {
  if (score >= 90) return 'A'
  if (score >= 75) return 'B'
  if (score >= 60) return 'C'
  if (score >= 40) return 'D'
  return 'F'
}