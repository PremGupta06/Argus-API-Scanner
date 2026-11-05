import re

PARAM_RE = re.compile(r'[{][^}]+[}]')


def fill_path(path, value):
    return PARAM_RE.sub(str(value), path)


def count_params(path):
    return len(PARAM_RE.findall(path))