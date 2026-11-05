import argparse
import sys

from scanner.models import SEVERITY_ORDER, ScanConfig, Severity
from scanner.report import build_summary, write_html, write_json
from scanner.runner import run_scan


def parse_args():
    p = argparse.ArgumentParser(description='API Security Scanner')
    p.add_argument('--target', required=True, help='base URL, e.g. http://127.0.0.1:5050')
    p.add_argument('--spec', required=True, help='OpenAPI file path or URL')
    p.add_argument('--token', help='Bearer token of user A')
    p.add_argument('--token-b', help='Bearer token of user B (improves BOLA detection)')
    p.add_argument('--own-id', type=int, default=1, help='object/user ID owned by user A')
    p.add_argument('--ids', default='', help='extra object IDs to try, comma separated')
    p.add_argument('--aggressive', action='store_true', help='enable checks that modify data')
    p.add_argument('--out', default='reports/report', help='output path without extension')
    p.add_argument('--fail-on', choices=[s.value for s in Severity], help='exit 1 if a finding is at least this severity')
    return p.parse_args()


def main():
    a = parse_args()
    print('Only scan systems you own or have permission to test.\n')
    config = ScanConfig(
        base_url=a.target, spec=a.spec, token=a.token, token_b=a.token_b,
        own_id=a.own_id, extra_ids=[i.strip() for i in a.ids.split(',') if i.strip()],
        aggressive=a.aggressive)
    findings = run_scan(config)
    write_json(findings, config, a.out + '.json')
    write_html(findings, config, a.out + '.html')
    print('\nSummary: ' + str(build_summary(findings)))
    print('Reports written to ' + a.out + '.json and ' + a.out + '.html')
    if a.fail_on:
        limit = SEVERITY_ORDER[Severity(a.fail_on)]
        if any(SEVERITY_ORDER[f.severity] >= limit for f in findings):
            sys.exit(1)


if __name__ == '__main__':
    main()