from .base import BaseCheck
from ..models import Finding, Severity
from ..utils import fill_path


class MissingAuthCheck(BaseCheck):
    id = 'API2-AUTH'

    def run(self):
        findings = []
        attempts = (('no token', {'auth': False}), ('a fake token', {'token': 'invalid.token.value'}))
        for ep in self.get_endpoints():
            if not ep.requires_auth:
                continue
            path = fill_path(ep.path, self.config.own_id)
            for label, kwargs in attempts:
                r = self.client.request('GET', path, **kwargs)
                if 200 <= r.status_code < 300:
                    findings.append(Finding(
                        check_id=self.id, title='Protected endpoint accessible without valid auth',
                        severity=Severity.HIGH, endpoint='GET ' + ep.path,
                        description='The spec marks this endpoint as authenticated, but the server returned data anyway.',
                        evidence='Request with ' + label + ' returned HTTP ' + str(r.status_code),
                        remediation='Enforce authentication in middleware for every protected route.',
                        owasp='API2:2023 Broken Authentication'))
                    break
        return findings