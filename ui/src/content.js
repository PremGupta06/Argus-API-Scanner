import { Database, Gauge, KeyRound, Layers, ListChecks, Radar, ShieldAlert, ShieldCheck, Upload, Users } from 'lucide-react'

export const COVERAGE = [
  'Broken object-level authorization',
  'Broken authentication',
  'Excessive data exposure',
  'Mass assignment',
  'Missing rate limiting',
  'Security misconfiguration',
  'Missing security headers',
  'Information disclosure',
]

export const STATS = [
  { value: 6, label: 'Security checks', note: 'Mapped to the OWASP API Top 10' },
  { value: 5, prefix: '<', suffix: 's', label: 'Typical scan time', note: 'On a small API' },
  { value: 100, suffix: '%', label: 'Runs locally', note: 'Your data stays with you' },
  { value: 2, label: 'Ways to export', note: 'Dashboard view and JSON file' },
]

export const FEATURES = [
  {
    id: 'auth', icon: KeyRound, title: 'Broken authentication', owasp: 'API2:2023', severity: 'high',
    summary: 'Finds endpoints that the spec marks as protected but that still answer without a valid token.',
    example: ['GET /api/admin/stats', 'Authorization: (none)', '', 'HTTP 200 OK   <- should be 401'],
    fix: 'Enforce authentication in middleware for every protected route.',
  },
  {
    id: 'bola', icon: Users, title: 'Object-level access (BOLA)', owasp: 'API1:2023', severity: 'high',
    summary: 'Signs in as one user, then changes object IDs to see whether other peoples data can be read.',
    example: ['GET /api/orders/2', 'Authorization: Bearer token-alice', '', 'owner_id: 2   <- belongs to another user'],
    fix: 'Check that the signed-in user owns the object on every request.',
  },
  {
    id: 'exposure', icon: Database, title: 'Excessive data exposure', owasp: 'API3:2023', severity: 'high',
    summary: 'Scans responses for password hashes, secrets, tokens and personal data that clients should never receive.',
    example: ['GET /api/users/1', '', 'password_hash: 5f4dcc3b...', 'ssn: 111-22-3333'],
    fix: 'Return only the fields the client needs, using response allow-lists.',
  },
  {
    id: 'mass', icon: Layers, title: 'Mass assignment', owasp: 'API3:2023', severity: 'high',
    summary: 'Sends privileged fields such as is_admin and checks whether the server accepts them. Opt-in, because it modifies data.',
    example: ['PUT /api/users/1', 'body: is_admin=true, role=admin', '', 'response: is_admin=true   <- accepted'],
    fix: 'Bind only an explicit allow-list of request fields.',
  },
  {
    id: 'rate', icon: Gauge, title: 'Missing rate limiting', owasp: 'API4:2023', severity: 'medium',
    summary: 'Fires rapid requests at login and other endpoints to see whether any throttling exists.',
    example: ['POST /login   x30 in two seconds', '', 'HTTP 401 x30   <- no 429, no Retry-After'],
    fix: 'Add per-IP and per-account limits and return 429 with a Retry-After header.',
  },
  {
    id: 'headers', icon: ShieldAlert, title: 'Security misconfiguration', owasp: 'API8:2023', severity: 'low',
    summary: 'Checks for missing hardening headers and for server or framework versions leaking in responses.',
    example: ['GET /api/admin/stats', '', 'missing: x-content-type-options, cache-control', 'server: Werkzeug/3.0 Python/3.10'],
    fix: 'Add hardening headers and hide server and framework versions.',
  },
]

export const STEPS = [
  { icon: Upload, title: 'Import your spec', text: 'Paste a URL, give a file path or upload an OpenAPI 3 file.' },
  { icon: ShieldCheck, title: 'Confirm permission', text: 'Add tokens, choose options and confirm you are allowed to test the API.' },
  { icon: Radar, title: 'Scan live', text: 'Watch every check run and finish in real time.' },
  { icon: ListChecks, title: 'Fix and export', text: 'Filter findings, read the evidence and fixes, then export JSON.' },
]

export const WORKFLOW = [
  { name: 'OpenAPI 3', status: 'ready' },
  { name: 'CLI', status: 'ready' },
  { name: 'JSON export', status: 'ready' },
  { name: 'GitHub Actions', status: 'planned' },
  { name: 'Docker', status: 'planned' },
  { name: 'SARIF', status: 'planned' },
]

export const FAQ = [
  {
    q: 'Is it safe to run a scan?',
    a: 'Most checks only read data. The mass assignment check changes data, so it stays off unless you enable aggressive mode. Always scan test environments or APIs you own.',
  },
  {
    q: 'Does my data leave my computer?',
    a: 'No. The scanner runs on your machine and talks only to the API you point it at. Scan history is kept in your browser storage.',
  },
  {
    q: 'What do I need to start?',
    a: 'The base URL of the API and its OpenAPI spec. Tokens for two different users give the best coverage for object-level access checks.',
  },
  {
    q: 'Can I use it in CI/CD?',
    a: 'Yes. The command line version supports --fail-on, so a pipeline can fail when findings reach a chosen severity. A ready-made GitHub Action is planned.',
  },
  {
    q: 'Which vulnerabilities are covered?',
    a: 'Six checks mapped to the OWASP API Security Top 10: broken authentication, BOLA, excessive data exposure, mass assignment, rate limiting and security misconfiguration.',
  },
]