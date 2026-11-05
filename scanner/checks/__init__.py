from .security_headers import SecurityHeadersCheck
from .missing_auth import MissingAuthCheck
from .rate_limit import RateLimitCheck
from .data_exposure import DataExposureCheck
from .bola import BolaCheck
from .mass_assignment import MassAssignmentCheck

ALL_CHECKS = [
    SecurityHeadersCheck,
    MissingAuthCheck,
    RateLimitCheck,
    DataExposureCheck,
    BolaCheck,
    MassAssignmentCheck,
]