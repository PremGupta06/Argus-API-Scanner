import json
import os
import tempfile
import threading
import time
import uuid

from flask import Flask, jsonify, request, send_from_directory
from werkzeug.middleware.proxy_fix import ProxyFix

from scanner.models import ScanConfig
from scanner.report import build_summary
from scanner.runner import run_scan

BASE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(BASE, 'ui', 'dist')
MESSAGES = os.path.join(BASE, 'messages.jsonl')

DEMO = os.environ.get('DEMO_MODE') == '1'
DEMO_TARGETS = {
    'http://127.0.0.1:5050': 'lab/openapi.yaml',
    'http://127.0.0.1:5060': 'lab/openapi2.yaml',
}
MAX_JOBS = 200

app = Flask(__name__)
if DEMO:
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1)
JOBS = {}
HITS = {}
LOCK = threading.Lock()


def start_demo_labs():
    from lab.vuln_app import app as lab1
    threading.Thread(
        target=lambda: lab1.run(host='127.0.0.1', port=5050, use_reloader=False), daemon=True).start()
    try:
        from lab.vuln_app2 import app as lab2
        threading.Thread(
            target=lambda: lab2.run(host='127.0.0.1', port=5060, use_reloader=False), daemon=True).start()
    except ImportError:
        pass


if DEMO:
    start_demo_labs()


@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    if request.path.startswith('/api/'):
        response.headers['Cache-Control'] = 'no-store'
    return response


def too_many(key, limit=5, window=3600):
    now = time.time()
    recent = [t for t in HITS.get(key, []) if now - t < window]
    recent.append(now)
    HITS[key] = recent
    return len(recent) > limit


def run_job(job_id, config, temp_path):
    job = JOBS[job_id]
    started = time.time()

    def on_event(event):
        with LOCK:
            job['events'].append(event)

    try:
        findings = run_scan(config, on_event, pause=0.4)
        update = {
            'findings': [f.to_dict() for f in findings],
            'summary': build_summary(findings),
            'status': 'done',
        }
    except Exception as exc:
        update = {'status': 'error', 'error': str(exc)}
    update['duration'] = round(time.time() - started, 1)
    with LOCK:
        job.update(update)
    if temp_path and os.path.exists(temp_path):
        os.remove(temp_path)


@app.get('/api/health')
def health():
    return jsonify({'ok': True, 'demo': DEMO})


@app.post('/api/scans')
def start_scan():
    data = request.get_json(silent=True) or {}
    target = str(data.get('target') or '').strip()
    spec = str(data.get('spec') or '').strip()
    spec_text = data.get('spec_text') or ''
    if not target.startswith(('http://', 'https://')):
        return jsonify({'error': 'Target must start with http:// or https://'}), 400
    if DEMO:
        if target.rstrip('/') not in DEMO_TARGETS:
            return jsonify({'error': 'Demo mode: only the built-in lab APIs can be scanned. Use the Use lab demo button.'}), 403
        if not spec_text and spec not in DEMO_TARGETS.values():
            return jsonify({'error': 'Demo mode: use lab/openapi.yaml or upload a spec file.'}), 403
        if too_many('scan:' + str(request.remote_addr), limit=30):
            return jsonify({'error': 'Too many scans from your address. Please try again later.'}), 429
    temp_path = None
    if spec_text:
        handle = tempfile.NamedTemporaryFile('w', suffix='.yaml', delete=False, encoding='utf-8')
        handle.write(spec_text)
        handle.close()
        temp_path = spec = handle.name
    if not spec:
        return jsonify({'error': 'Provide an OpenAPI spec (upload, path or URL)'}), 400
    try:
        own_id = int(data.get('own_id') or 1)
    except ValueError:
        return jsonify({'error': 'Object ID must be a number'}), 400
    ids = [i.strip() for i in str(data.get('ids') or '').split(',') if i.strip()]
    config = ScanConfig(
        base_url=target, spec=spec, token=data.get('token') or None,
        token_b=data.get('token_b') or None, own_id=own_id, extra_ids=ids,
        aggressive=bool(data.get('aggressive')))
    job_id = uuid.uuid4().hex[:10]
    with LOCK:
        JOBS[job_id] = {
            'id': job_id, 'status': 'running', 'target': target, 'events': [],
            'findings': [], 'summary': {}, 'error': None, 'duration': None,
        }
        while len(JOBS) > MAX_JOBS:
            JOBS.pop(next(iter(JOBS)))
    threading.Thread(target=run_job, args=(job_id, config, temp_path), daemon=True).start()
    return jsonify({'id': job_id}), 202


@app.get('/api/scans/<job_id>')
def get_scan(job_id):
    with LOCK:
        job = JOBS.get(job_id)
        if not job:
            return jsonify({'error': 'Scan not found'}), 404
        return jsonify(job)


@app.post('/api/contact')
def contact():
    data = request.get_json(silent=True) or {}
    if data.get('website'):
        return jsonify({'ok': True})
    name = str(data.get('name') or '').strip()[:100]
    email = str(data.get('email') or '').strip()[:150]
    message = str(data.get('message') or '').strip()[:2000]
    if not name or '@' not in email or len(message) < 10:
        return jsonify({'error': 'Enter your name, a valid email and a message of at least 10 characters.'}), 400
    if too_many('contact:' + str(request.remote_addr)):
        return jsonify({'error': 'Too many messages. Please try again later.'}), 429
    entry = {'time': time.strftime('%Y-%m-%d %H:%M:%S'), 'name': name, 'email': email, 'message': message}
    with LOCK:
        with open(MESSAGES, 'a', encoding='utf-8') as fh:
            print(json.dumps(entry), file=fh)
    return jsonify({'ok': True})


@app.get('/', defaults={'path': ''})
@app.get('/<path:path>')
def website(path):
    if path.startswith('api/'):
        return jsonify({'error': 'Not found'}), 404
    if path and os.path.isfile(os.path.join(DIST, path)):
        return send_from_directory(DIST, path)
    if os.path.isfile(os.path.join(DIST, 'index.html')):
        return send_from_directory(DIST, 'index.html')
    return jsonify({'error': 'UI not built yet. Run npm run build inside the ui folder.'}), 404


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000)