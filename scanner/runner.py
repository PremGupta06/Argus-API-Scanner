import time

from .checks import ALL_CHECKS
from .client import ApiClient
from .models import SEVERITY_ORDER
from .spec import load_spec, parse_endpoints


def run_scan(config, on_event=None, pause=0):
    emit = on_event or (lambda event: None)
    endpoints = parse_endpoints(load_spec(config.spec))
    print('[+] Loaded ' + str(len(endpoints)) + ' endpoints from the spec')
    emit({'type': 'spec_loaded', 'endpoints': len(endpoints)})

    client = ApiClient(config.base_url, config.token)
    try:
        client.request('GET', '/', auth=False)
    except Exception as exc:
        raise RuntimeError('Cannot reach ' + config.base_url + ' (' + type(exc).__name__ + '). Is the target running?')

    findings = []
    for check_class in ALL_CHECKS:
        name = check_class.__name__
        check = check_class(client, endpoints, config)
        if check.aggressive and not config.aggressive:
            print('[-] Skipping ' + name + ' (modifies data, use --aggressive)')
            emit({'type': 'check_skipped', 'check': name})
            continue
        print('[*] Running ' + name + ' ...')
        emit({'type': 'check_start', 'check': name})
        time.sleep(pause)
        try:
            results = check.run()
        except Exception as exc:
            print('[!] ' + name + ' failed: ' + str(exc))
            emit({'type': 'check_error', 'check': name, 'message': str(exc)})
            continue
        print('    -> ' + str(len(results)) + ' finding(s)')
        emit({'type': 'check_done', 'check': name, 'count': len(results)})
        time.sleep(pause)
        findings.extend(results)
    findings.sort(key=lambda f: SEVERITY_ORDER[f.severity], reverse=True)
    return findings