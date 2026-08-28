#!/usr/bin/env python3
"""Geographic integrity tests for provinces → municipalities → communes.

Run after every migration that touches the administrative divisions:
    python3 scripts/test_geo_integrity.py

Requires the standard PG* env vars (PGHOST, PGUSER, PGPASSWORD, PGDATABASE).
Exits 0 on success, 1 if any check fails. Designed for CI pipelines.
"""
from __future__ import annotations

import os
import subprocess
import sys
from dataclasses import dataclass, field

EXPECTED = {"provinces": 21, "municipalities": 325, "communes": 541}

CHECKS: list[tuple[str, str, str]] = [
    # (id, description, SQL returning a single integer "failures" count)
    (
        "totals_provinces",
        f"Total de províncias deve ser {EXPECTED['provinces']}",
        f"SELECT abs((SELECT count(*) FROM provinces) - {EXPECTED['provinces']})",
    ),
    (
        "totals_municipalities",
        f"Total de municípios deve ser {EXPECTED['municipalities']}",
        f"SELECT abs((SELECT count(*) FROM municipalities) - {EXPECTED['municipalities']})",
    ),
    (
        "totals_communes",
        f"Total de comunas deve ser {EXPECTED['communes']}",
        f"SELECT abs((SELECT count(*) FROM communes) - {EXPECTED['communes']})",
    ),
    (
        "no_orphan_municipalities",
        "Nenhum município pode ficar sem província",
        "SELECT count(*) FROM municipalities m "
        "LEFT JOIN provinces p ON p.id = m.province_id "
        "WHERE m.province_id IS NULL OR p.id IS NULL",
    ),
    (
        "no_orphan_communes",
        "Nenhuma comuna pode ficar sem município",
        "SELECT count(*) FROM communes c "
        "LEFT JOIN municipalities m ON m.id = c.municipality_id "
        "WHERE c.municipality_id IS NULL OR m.id IS NULL",
    ),
    (
        "unique_province_codes",
        "Códigos de província devem ser únicos",
        "SELECT count(*) FROM (SELECT code FROM provinces "
        "WHERE code IS NOT NULL GROUP BY code HAVING count(*) > 1) d",
    ),
    (
        "unique_municipality_codes",
        "Códigos de município devem ser únicos",
        "SELECT count(*) FROM (SELECT code FROM municipalities "
        "WHERE code IS NOT NULL GROUP BY code HAVING count(*) > 1) d",
    ),
    (
        "unique_commune_codes",
        "Códigos de comuna devem ser únicos",
        "SELECT count(*) FROM (SELECT code FROM communes "
        "WHERE code IS NOT NULL GROUP BY code HAVING count(*) > 1) d",
    ),
    (
        "no_missing_province_codes",
        "Todas as províncias devem ter código não vazio",
        "SELECT count(*) FROM provinces WHERE code IS NULL OR btrim(code) = ''",
    ),
    (
        "no_missing_municipality_codes",
        "Todos os municípios devem ter código não vazio",
        "SELECT count(*) FROM municipalities WHERE code IS NULL OR btrim(code) = ''",
    ),
    (
        "no_missing_commune_codes",
        "Todas as comunas devem ter código não vazio",
        "SELECT count(*) FROM communes WHERE code IS NULL OR btrim(code) = ''",
    ),
    (
        "no_placeholder_communes",
        "Não podem existir comunas placeholder 'N_A' ou 'N/A'",
        "SELECT count(*) FROM communes "
        r"WHERE name LIKE 'N\_A%' ESCAPE '\' "
        r"OR name = 'N/A' "
        r"OR code LIKE 'N\_A-%' ESCAPE '\'",
    ),
]


@dataclass
class Result:
    passed: list[str] = field(default_factory=list)
    failed: list[tuple[str, str, int]] = field(default_factory=list)


def run_sql(sql: str) -> int:
    out = subprocess.run(
        ["psql", "-tA", "-c", sql],
        capture_output=True,
        text=True,
        check=False,
    )
    if out.returncode != 0:
        raise RuntimeError(f"psql failed: {out.stderr.strip()}")
    raw = out.stdout.strip().splitlines()
    return int(raw[0]) if raw else 0


def main() -> int:
    if not os.environ.get("PGHOST"):
        print("ERROR: PGHOST is not set; cannot run geo integrity checks.", file=sys.stderr)
        return 2

    result = Result()
    for check_id, description, sql in CHECKS:
        try:
            failures = run_sql(sql)
        except Exception as exc:  # noqa: BLE001
            print(f"  ✗ {check_id}: {description} — erro: {exc}")
            result.failed.append((check_id, description, -1))
            continue
        if failures == 0:
            print(f"  ✓ {check_id}: {description}")
            result.passed.append(check_id)
        else:
            print(f"  ✗ {check_id}: {description} — {failures} violações")
            result.failed.append((check_id, description, failures))

    total = len(CHECKS)
    print()
    print(f"Resultado: {len(result.passed)}/{total} verificações passaram.")
    if result.failed:
        print("\nFalhas detectadas:")
        for cid, desc, n in result.failed:
            print(f"  - [{cid}] {desc} ({n} ocorrências)")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())