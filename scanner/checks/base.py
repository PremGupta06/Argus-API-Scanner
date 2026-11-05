from abc import ABC, abstractmethod


class BaseCheck(ABC):
    id = 'BASE'
    aggressive = False  # True means the check modifies data on the target

    def __init__(self, client, endpoints, config):
        self.client = client
        self.endpoints = endpoints
        self.config = config

    def get_endpoints(self):
        return [e for e in self.endpoints if e.method == 'GET']

    @abstractmethod
    def run(self):
        """Return a list of Finding objects."""