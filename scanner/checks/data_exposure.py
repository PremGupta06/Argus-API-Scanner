import re

from .base import BaseCheck
from ..models import Finding, Severity
from ..utils import fill_path

SENSITIVE_KEYS = re.compile(r'(pass|hash|secret|token|api[_-]?key|ssn|card|cvv|private[_-]?key|salt)', re.I)
SSN_VALUE = re.compile(r'[0-9]{3}-[0-9]{2}-[0-9]{4}')


def walk(obj, prefix=''):
    if isinstance(obj, dict):
        for key, value in obj.items():
            yield prefix + key, value
            yield from walk(value, prefix + key + '.')
    elif isinstance(obj, list):
        for item in obj[:5]:
            yield from walk(item, prefix)


class DataExposureCheck(BaseCheck):
    id = 'API3-EXPOSURE'

    def run(self):
        findings = []
        for ep in self.get_endpoints():
            r = self.client.request('GET', fill_path(ep.path, self.config.own_id))
            if r.status_code != 200:
                continue
            try:
                data = r.json()
            except ValueError:
                continue
            hits = set()
            for key, value in walk(data):
                name = key.split('.')[-1]
                if SENSITIVE_KEYS.search(name) or (isinstance(value, str) and SSN_VALUE.search(value)):
                    hits.add(key)
            if hits:
                findings.append(Finding(
                    check_id=self.id, title='Sensitive data exposed in response', severity=Severity.HIGH,
                    endpoint='GET ' + ep.path,
                    description='The API returns fields that clients should never receive.',
                    evidence='Sensitive fields: ' + ', '.join(sorted(hits)),
                    remediation='Return only the fields the client needs (response DTOs/allow-lists).',
                    owasp='API3:2023 Broken Object Property Level Authorization'))
        return findings