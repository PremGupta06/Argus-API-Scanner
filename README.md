# APIScan

**An API security scanner with a live dashboard.** Import an OpenAPI spec, run OWASP API Top 10 checks, and get a prioritised report with evidence and fixes.

[**Live demo**](https://YOUR-APP.onrender.com) | [Report a bug](https://github.com/YOUR-USERNAME/YOUR-REPO/issues)

![Landing page](<img width="1493" height="881" alt="{830FFC02-E502-43CB-8868-588D24E80102}" src="https://github.com/user-attachments/assets/3fd27fcf-8f73-4f52-bdca-7e1b87afc865" />
)

> **Legal and ethical use:** only scan APIs you own or have written permission to test.

---

## Features

- **6 security checks** mapped to the OWASP API Security Top 10 (2023)
- **Live scan progress**: watch each check run in real time
- **Risk score and grade** (A to F) with animated severity cards you can click to filter
- **Search and expand findings** to see the description, evidence and how to fix each one
- **Scan history** saved in your browser, plus **JSON export**
- **Command-line mode** with a CI-friendly exit code (`--fail-on high`)
- **OpenAPI 3 import** from a file path, a URL or an upload
- **Safe by default**: checks that modify data are opt-in ("aggressive mode")
- **Two built-in vulnerable lab APIs** so you can try everything safely

| Scan in progress | Results |
|---|---|
| ![Scanning](docs/screenshots/scanning.png) | ![Results](docs/screenshots/results.png) |

## Security checks

| Check | What it finds | OWASP API Top 10 |
|---|---|---|
| Broken authentication | Endpoints the spec marks as protected that answer without a valid token | API2:2023 |
| BOLA | Reading objects that belong to other users by changing an ID | API1:2023 |
| Excessive data exposure | Password hashes, secrets, tokens and personal data in responses | API3:2023 |
| Mass assignment | Privileged fields such as `is_admin` accepted from the client (aggressive mode) | API3:2023 |
| Rate limiting | No throttling on login or other endpoints | API4:2023 |
| Security misconfiguration | Missing hardening headers and leaked server versions | API8:2023 |

## How it works

```text
Browser (React UI)  --/api-->  Flask API  -->  Scan engine  -->  Target API
```

1. You give the scanner a target URL and its OpenAPI spec.
2. The engine turns the spec into a list of endpoints and runs each check against the target.
3. The UI polls the API for progress events, then shows the results.

## Tech stack

- **Scan engine:** Python, httpx, PyYAML, Jinja2
- **API:** Flask (served with gunicorn in production)
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Lucide icons
- **Packaging:** Docker

## Getting started

### Prerequisites

- Python 3.10 or newer
- Node.js 20 or newer (LTS)

### 1. Install

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO

python -m venv venv
# Windows PowerShell: venv/Scripts/Activate.ps1
# macOS / Linux:      source venv/bin/activate
pip install -r requirements.txt

cd ui
npm install
cd ..
```

### 2. Run the app (three terminals)

```bash
# Terminal 1: the vulnerable lab API (port 5050)
python lab/vuln_app.py

# Terminal 2: the scanner API (port 8000)
python api.py

# Terminal 3: the website (port 5173)
cd ui
npm run dev
```

Open **http://localhost:5173**, click **Use lab demo**, then **Start scan**.

Expected result on the lab API: **8 findings** (4 High, 2 Medium, 2 Low).

### 3. Or use the command line

```bash
python main.py --target http://127.0.0.1:5050 --spec lab/openapi.yaml \
  --token token-alice --token-b token-bob --own-id 1 --aggressive
```

Reports are written to `reports/report.html` and `reports/report.json`.

| Option | Meaning |
|---|---|
| `--target` | Base URL of the API to scan |
| `--spec` | OpenAPI file path or URL |
| `--token`, `--token-b` | Bearer tokens for two different users (improves BOLA detection) |
| `--own-id` | The object or user ID that belongs to the first user |
| `--ids` | Extra object IDs to try, comma separated |
| `--aggressive` | Enable checks that modify data (mass assignment) |
| `--fail-on` | Exit with code 1 if a finding reaches this severity (for CI) |
| `--out` | Output path without extension |

## Demo credentials (lab APIs only)

| Lab | Target | Spec | Tokens |
|---|---|---|---|
| Lab 1 | `http://127.0.0.1:5050` | `lab/openapi.yaml` | `token-alice`, `token-bob` |
| Lab 2 | `http://127.0.0.1:5060` | `lab/openapi2.yaml` | `tok-carol`, `tok-dave` |

Lab 2 (`python lab/vuln_app2.py`) is partly secure on purpose: it should produce 4 findings and stay quiet about rate limiting, mass assignment and its profile endpoints.

## Project structure

```text
.
├── api.py            Flask API (scans, contact form, serves the built site)
├── main.py           Command-line scanner
├── Dockerfile
├── lab/              Deliberately vulnerable demo APIs and their OpenAPI specs
├── scanner/          Scan engine
│   ├── checks/       One file per security check
│   ├── runner.py     Runs the checks and reports progress
│   └── report.py     JSON and HTML reports
├── tests/
└── ui/               React + Tailwind website and dashboard
```

## Deployment

The included `Dockerfile` builds the website and runs everything with one process.

```bash
docker build -t apiscan .
docker run -p 8000:8000 apiscan
```

It starts in **demo mode** (`DEMO_MODE=1`): the server runs the lab APIs inside the container and **refuses to scan any other target**. This keeps a public deployment from being used as an open request proxy. To use the scanner on your own APIs, run it locally as described above.

## Security notes

- The scanner sends real requests to whatever target you give it. Only use it on systems you are authorised to test.
- Never expose a copy with demo mode turned off to the public internet without authentication and network restrictions.
- The contact form is rate limited and has a spam trap, and the server sends basic security headers.

## Tests

```bash
python -m pytest
```

## Roadmap

- [ ] SARIF export for code-scanning tools
- [ ] GitHub Action for CI pipelines
- [ ] JWT checks (algorithm none, weak secrets)
- [ ] Docker Compose setup for the full stack
- [ ] More checks: SSRF indicators, CORS misconfiguration

## License

MIT. Add a `LICENSE` file to the repo root (GitHub can generate one when you click **Add file** and then **Create new file** named `LICENSE`).

## Author

Built by **YOUR NAME**. [LinkedIn](https://www.linkedin.com/in/YOUR-PROFILE) | [GitHub](https://github.com/YOUR-USERNAME)
