from dataclasses import dataclass, field
from enum import Enum


class Severity(str, Enum):
    INFO = 'info'
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'
    CRITICAL = 'critical'


SEVERITY_ORDER = {
    Severity.INFO: 0, Severity.LOW: 1, Severity.MEDIUM: 2,
    Severity.HIGH: 3, Severity.CRITICAL: 4,
}


@dataclass
class Endpoint:
    method: str
    path: str
    requires_auth: bool = False
    body_fields: list = field(default_factory=list)


@dataclass
class Finding:
    check_id: str
    title: str
    severity: Severity
    endpoint: str
    description: str
    evidence: str
    remediation: str
    owasp: str = ''

    def to_dict(self):
        data = self.__dict__.copy()
        data['severity'] = self.severity.value
        return data


@dataclass
class ScanConfig:
    base_url: str
    spec: str
    token: str | None = None
    token_b: str | None = None
    own_id: int = 1
    extra_ids: list = field(default_factory=list)
    aggressive: bool = False