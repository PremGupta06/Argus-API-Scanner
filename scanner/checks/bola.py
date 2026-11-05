from .base import BaseCheck
from ..models import Finding, Severity
from ..utils import fill_path, count_params

OWNER_KEYS = ('owner_id', 'user_id', 'userid', 'owner', 'created_by')


class BolaCheck(BaseCheck):
    id = 'API1-BOLA'

    def candidates(self):
        return [str(i) for i in range(1, 6)] + list(self.config.extra_ids)

    def fetch(self, ep, obj_id, token=None):
        r = self.client.request('GET', fill_path(ep.path, obj_id), token=token)
        if r.status_code != 200:
            return None
        try:
            return r.json()
        except ValueError:
            return None

    def run(self):
        findings = []
        for ep in self.get_endpoints():
            if count_params(ep.path) != 1 or not ep.requires_auth:
                continue
            readable = {}
            for obj_id in self.candidates():
                data = self.fetch(ep, obj_id)
                if data is not None:
                    readable[obj_id] = data

            foreign = set()
            for obj_id, data in readable.items():
                if isinstance(data, dict):
                    for key, value in data.items():
                        if key.lower() in OWNER_KEYS and str(value) != str(self.config.own_id):
                            foreign.add(obj_id)
            if foreign:
                findings.append(Finding(
                    check_id=self.id, title='BOLA: can read objects owned by other users',
                    severity=Severity.HIGH, endpoint='GET ' + ep.path,
                    description='User A retrieved objects whose owner field belongs to someone else.',
                    evidence='IDs readable but owned by others: ' + ', '.join(sorted(foreign)),
                    remediation='Check that the authenticated user owns the object on every request.',
                    owasp='API1:2023 Broken Object Level Authorization'))
                continue

            if self.config.token_b and len(readable) >= 2:
                shared = [i for i in readable if self.fetch(ep, i, self.config.token_b) is not None]
                if len(shared) >= 2:
                    findings.append(Finding(
                        check_id=self.id, title='Possible BOLA: objects readable by multiple users',
                        severity=Severity.MEDIUM, endpoint='GET ' + ep.path,
                        description='Two different users can both read the same objects, so access may not be scoped per owner.',
                        evidence='IDs readable by both users: ' + ', '.join(sorted(shared)) + ' (verify manually)',
                        remediation='Scope queries to the authenticated user and add object-level authorization.',
                        owasp='API1:2023 Broken Object Level Authorization'))
        return findings