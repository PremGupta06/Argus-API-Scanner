import httpx


class ApiClient:
    def __init__(self, base_url, token=None, timeout=10):
        self.base_url = base_url.rstrip('/')
        self.token = token
        self.http = httpx.Client(timeout=timeout, follow_redirects=False)

    def request(self, method, path, auth=True, token=None, **kwargs):
        headers = kwargs.pop('headers', {})
        use_token = token if token is not None else self.token
        if auth and use_token:
            headers['Authorization'] = 'Bearer ' + use_token
        return self.http.request(method, self.base_url + path, headers=headers, **kwargs)