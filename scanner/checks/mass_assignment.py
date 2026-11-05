from .base import BaseCheck
from ..models import Finding, Severity
from ..utils import fill_path


class MassAssignmentCheck(BaseCheck):
    id = 'API3-MASS'
    aggressive = True
    PAYLOAD = {'is_admin': True, 'role': 'admin', 'admin': True, 'isAdmin': True}

    def run(self):
        findings = []
        for ep in self.endpoints:
            if ep.method not in ('POST', 'PUT', 'PATCH'):
                continue
            if any(w in ep.path.lower() for w in ('login', 'auth', 'token')):
                continue
            payload = {k: v for k, v in self.PAYLOAD.items() if k not in ep.body_fields}
            r = self.client.request(ep.method, fill_path(ep.path, self.config.own_id), json=payload)
            if not 200 <= r.status_code < 300:
                continue
            try:
                data = r.json()
            except ValueError:
                continue
            if not isinstance(data, dict):
                continue
            accepted = [k for k, v in payload.items() if data.get(k) == v]
            if accepted:
                findings.append(Finding(
                    check_id=self.id, title='Mass assignment: privileged fields accepted',
                    severity=Severity.HIGH, endpoint=ep.method + ' ' + ep.path,
                    description='The server bound client-supplied fields that are not part of the documented request body.',
                    evidence='Server accepted and returned: ' + ', '.join(accepted),
                    remediation='Bind only an explicit allow-list of fields from the request body.',
                    owasp='API3:2023 Broken Object Property Level Authorization'))
        return findings