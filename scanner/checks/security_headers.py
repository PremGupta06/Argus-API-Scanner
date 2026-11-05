from .base import BaseCheck
from ..models import Finding, Severity


class SecurityHeadersCheck(BaseCheck):
    id = 'SEC-HEADERS'
    WANTED = ['x-content-type-options', 'cache-control']
    LEAKY = ['server', 'x-powered-by']

    def run(self):
        targets = [e for e in self.get_endpoints() if '{' not in e.path]
        if not targets:
            return []
        ep = targets[0]
        r = self.client.request('GET', ep.path)
        findings = []

        missing = [h for h in self.WANTED if h not in r.headers]
        if self.config.base_url.startswith('https') and 'strict-transport-security' not in r.headers:
            missing.append('strict-transport-security')
        if missing:
            findings.append(Finding(
                check_id=self.id, title='Missing security headers', severity=Severity.LOW,
                endpoint='GET ' + ep.path,
                description='The response lacks headers that harden browsers and caches.',
                evidence='Missing: ' + ', '.join(missing),
                remediation='Add X-Content-Type-Options: nosniff, Cache-Control: no-store, and HSTS on HTTPS.',
                owasp='API8:2023 Security Misconfiguration'))

        leaks = [h + ': ' + r.headers[h] for h in self.LEAKY if h in r.headers]
        if leaks:
            findings.append(Finding(
                check_id=self.id, title='Technology disclosure in headers', severity=Severity.LOW,
                endpoint='GET ' + ep.path,
                description='Server and framework versions help attackers pick known exploits.',
                evidence='; '.join(leaks),
                remediation='Remove or genericise the Server and X-Powered-By headers.',
                owasp='API8:2023 Security Misconfiguration'))
        return findings