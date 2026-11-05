import time

from flask import Flask, jsonify, request

app = Flask(__name__)

USERS = {
    1: {'id': 1, 'name': 'Carol', 'email': 'carol@example.com', 'role': 'user'},
    2: {'id': 2, 'name': 'Dave', 'email': 'dave@example.com', 'role': 'user'},
}
ACCOUNTS = {
    1: {'id': 1, 'user_id': 1, 'iban': 'DE89370400440532013000', 'balance': 2500,
        'card_number': '4111111111111111', 'api_key': 'sk_live_carol_123'},
    2: {'id': 2, 'user_id': 2, 'iban': 'DE75512108001245126199', 'balance': 1800,
        'card_number': '5500005555555559', 'api_key': 'sk_live_dave_456'},
    3: {'id': 3, 'user_id': 2, 'iban': 'DE02120300000000202051', 'balance': 900,
        'card_number': '340000000000009', 'api_key': 'sk_live_dave_789'},
}
TOKENS = {'tok-carol': 1, 'tok-dave': 2}
ATTEMPTS = {}


@app.after_request
def harden(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Cache-Control'] = 'no-store'
    return response


def current_user():
    header = request.headers.get('Authorization', '')
    if header.startswith('Bearer '):
        return USERS.get(TOKENS.get(header[7:]))
    return None


def too_many_attempts(ip):
    now = time.time()
    recent = [t for t in ATTEMPTS.get(ip, []) if now - t < 60]
    recent.append(now)
    ATTEMPTS[ip] = recent
    return len(recent) > 5


@app.post('/auth/login')
def login():  # GOOD: rate limited
    if too_many_attempts(request.remote_addr):
        response = jsonify({'error': 'too many attempts'})
        response.headers['Retry-After'] = '60'
        return response, 429
    data = request.get_json(silent=True) or {}
    for user in USERS.values():
        if data.get('username') == user['name'].lower() and data.get('password') == 'secret456':
            return jsonify({'token': 'tok-' + user['name'].lower()})
    return jsonify({'error': 'invalid credentials'}), 401


@app.get('/api/accounts/<int:account_id>')
def get_account(account_id):
    if not current_user():
        return jsonify({'error': 'unauthorized'}), 401
    account = ACCOUNTS.get(account_id)
    if not account:
        return jsonify({'error': 'not found'}), 404
    return jsonify(account)  # FLAW: no owner check (BOLA) and leaks card number + API key


@app.get('/api/profile/<int:user_id>')
def get_profile(user_id):  # GOOD: owner check
    me = current_user()
    if not me:
        return jsonify({'error': 'unauthorized'}), 401
    if me['id'] != user_id:
        return jsonify({'error': 'forbidden'}), 403
    return jsonify(me)


@app.patch('/api/profile/<int:user_id>')
def update_profile(user_id):  # GOOD: allow-list, no mass assignment
    me = current_user()
    if not me:
        return jsonify({'error': 'unauthorized'}), 401
    if me['id'] != user_id:
        return jsonify({'error': 'forbidden'}), 403
    data = request.get_json(silent=True) or {}
    for field in ('name', 'email'):
        if field in data:
            me[field] = str(data[field])[:100]
    return jsonify(me)


@app.get('/api/reports/summary')
def summary():
    # FLAW: the spec says a token is required, but nothing checks it
    return jsonify({'accounts': len(ACCOUNTS), 'total_balance': sum(a['balance'] for a in ACCOUNTS.values())})


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5060)