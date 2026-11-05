from flask import Flask, jsonify, request

app = Flask(__name__)

USERS = {
    1: {'id': 1, 'username': 'alice', 'email': 'alice@example.com',
        'password_hash': '5f4dcc3b5aa765d61d8327deb882cf99', 'ssn': '111-22-3333', 'is_admin': False},
    2: {'id': 2, 'username': 'bob', 'email': 'bob@example.com',
        'password_hash': '482c811da5d5b4bc6d497ffa98491e38', 'ssn': '444-55-6666', 'is_admin': False},
}
ORDERS = {
    1: {'id': 1, 'owner_id': 1, 'item': 'Laptop', 'total': 1200},
    2: {'id': 2, 'owner_id': 2, 'item': 'Phone', 'total': 800},
    3: {'id': 3, 'owner_id': 1, 'item': 'Monitor', 'total': 300},
}
TOKENS = {'token-alice': 1, 'token-bob': 2}


def current_user():
    header = request.headers.get('Authorization', '')
    if header.startswith('Bearer '):
        return USERS.get(TOKENS.get(header[7:]))
    return None


def unauthorized():
    return jsonify({'error': 'unauthorized'}), 401


@app.post('/login')
def login():  # FLAW: no rate limiting, so passwords can be brute-forced
    data = request.get_json(silent=True) or {}
    for user in USERS.values():
        if data.get('username') == user['username'] and data.get('password') == 'password123':
            return jsonify({'token': 'token-' + user['username']})
    return jsonify({'error': 'invalid credentials'}), 401


@app.get('/api/orders/<int:order_id>')
def get_order(order_id):
    if not current_user():
        return unauthorized()
    order = ORDERS.get(order_id)
    if not order:
        return jsonify({'error': 'not found'}), 404
    return jsonify(order)  # FLAW: no ownership check (BOLA)


@app.get('/api/users/<int:user_id>')
def get_user(user_id):
    if not current_user():
        return unauthorized()
    user = USERS.get(user_id)
    if not user:
        return jsonify({'error': 'not found'}), 404
    return jsonify(user)  # FLAW: leaks password hash and SSN, plus BOLA


@app.put('/api/users/<int:user_id>')
def update_user(user_id):
    if not current_user():
        return unauthorized()
    user = USERS.get(user_id)
    if not user:
        return jsonify({'error': 'not found'}), 404
    user.update(request.get_json(silent=True) or {})  # FLAW: mass assignment
    return jsonify(user)


@app.get('/api/admin/stats')
def admin_stats():
    # FLAW: the spec says a token is required, but nothing checks it
    return jsonify({'users': len(USERS), 'orders': len(ORDERS)})


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5050)