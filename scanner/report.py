import json
from collections import Counter
from datetime import datetime
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape

TEMPLATES = Path(__file__).parent / 'templates'


def build_summary(findings):
    counts = Counter(f.severity.value for f in findings)
    return {s: counts.get(s, 0) for s in ('critical', 'high', 'medium', 'low', 'info')}


def _stamp():
    return datetime.now().isoformat(timespec='seconds')


def write_json(findings, config, path):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    data = {
        'target': config.base_url,
        'generated': _stamp(),
        'summary': build_summary(findings),
        'findings': [f.to_dict() for f in findings],
    }
    Path(path).write_text(json.dumps(data, indent=2), encoding='utf-8')


def write_html(findings, config, path):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    env = Environment(loader=FileSystemLoader(TEMPLATES), autoescape=select_autoescape(['html']))
    html = env.get_template('report.html').render(
        target=config.base_url, generated=_stamp(),
        summary=build_summary(findings), findings=findings)
    Path(path).write_text(html, encoding='utf-8')