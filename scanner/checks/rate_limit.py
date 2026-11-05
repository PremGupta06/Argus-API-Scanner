from .base import BaseCheck
from ..models import Finding, Severity
from ..utils import fill_path


class RateLimitCheck(BaseCheck):
    id = 'API4-RATE'
    ATTEMPTS = 30

    def pick_target(self):
        for ep in self.endpoints:
            if ep.method == 'POST' and any(w in ep.path.lower() for w in ('login', 'auth', 'token', 'signin')):
                return ep
        plain = [e for e in self.get_endpoints() if '{' not in e.path]
        return plain[0] if plain else None

    def run(self):
        ep = self.pick_target()
        if not ep:
            return []
        body = {f: 'test' for f in ep.body_fields} if ep.body_fields else None
        path = fill_path(ep.path, self.config.own_id)
        for _ in range(self.ATTEMPTS):
            kwargs = {'json': body} if (ep.method == 'POST' and body) else {}
            r = self.client.request(ep.method, path, auth=(ep.method != 'POST'), **kwargs)
            headers = [h.lower() for h in r.headers]
            if r.status_code == 429 or 'retry-after' in headers or any(h.startswith('x-ratelimit') for h in headers):
                return []
        return [Finding(
            check_id=self.id, title='No rate limiting detected', severity=Severity.MEDIUM,
            endpoint=ep.method + ' ' + ep.path,
            description='The endpoint accepted many rapid requests with no throttling, which enables brute force and abuse.',
            evidence=str(self.ATTEMPTS) + ' rapid requests, no HTTP 429 and no rate-limit headers',
            remediation='Add per-IP and per-account rate limits and return 429 with Retry-After.',
            owasp='API4:2023 Unrestricted Resource Consumption')]