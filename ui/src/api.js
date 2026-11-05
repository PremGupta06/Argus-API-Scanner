export async function health() {
  try {
    const res = await fetch('/api/health')
    return res.ok
  } catch {
    return false
  }
}

export async function startScan(payload) {
  const res = await fetch('/api/scans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Could not start the scan')
  return data.id
}

export async function getScan(id) {
  const res = await fetch('/api/scans/' + id)
  if (!res.ok) throw new Error('Scan not found')
  return res.json()
}