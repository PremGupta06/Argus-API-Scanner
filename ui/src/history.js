const KEY = 'api-scanner-history'

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export function saveScan(job) {
  const entry = {
    id: job.id, date: new Date().toISOString(), target: job.target,
    duration: job.duration, summary: job.summary, findings: job.findings, events: [],
  }
  const list = [entry, ...loadHistory().filter((h) => h.id !== job.id)].slice(0, 10)
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    /* storage full or blocked */
  }
  return list
}

export function clearHistory() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}