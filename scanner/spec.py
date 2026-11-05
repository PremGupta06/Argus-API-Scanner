from pathlib import Path

import httpx
import yaml

from .models import Endpoint

HTTP_METHODS = {'get', 'post', 'put', 'patch', 'delete'}


def load_spec(source):
    if source.startswith('http'):
        text = httpx.get(source, timeout=10).text
    else:
        text = Path(source).read_text(encoding='utf-8')
    return yaml.safe_load(text)


def _resolve(spec, node):
    if isinstance(node, dict) and '$ref' in node:
        current = spec
        for part in node['$ref'].lstrip('#/').split('/'):
            current = current[part]
        return _resolve(spec, current)
    return node


def parse_endpoints(spec):
    endpoints = []
    for path, item in spec.get('paths', {}).items():
        for method, op in item.items():
            if method.lower() not in HTTP_METHODS:
                continue
            requires_auth = bool(op.get('security', spec.get('security')))
            body = _resolve(spec, op.get('requestBody', {}))
            schema = body.get('content', {}).get('application/json', {}).get('schema', {})
            schema = _resolve(spec, schema)
            fields = list(schema.get('properties', {}).keys())
            endpoints.append(Endpoint(method.upper(), path, requires_auth, fields))
    return endpoints