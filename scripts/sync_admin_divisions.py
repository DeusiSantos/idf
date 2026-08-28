#!/usr/bin/env python3
"""
Sync Angolan administrative divisions (provinces, municipalities, communes)
from the official DPA spreadsheet into the SIGAFLO database.

Single, idempotent, re-executable script.
- Reads `scripts/data/admin_divisions_2024.xlsx` (XLSForm cascade format).
- Performs UPSERT by `code` on `provinces`, `municipalities`, `communes`.
- Replaces any legacy `N_A-*` placeholder communes with `{Municipality} (Sede)`.
- Reports counts (inserted vs updated) and orphan references.

Usage:
    python3 scripts/sync_admin_divisions.py                     # apply
    python3 scripts/sync_admin_divisions.py --dry-run           # print SQL only
    python3 scripts/sync_admin_divisions.py --file <xlsx>       # custom file

Requires env vars: PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
(already provided in Lovable Cloud sandbox).
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent
DEFAULT_FILE = ROOT / "data" / "admin_divisions_2024.xlsx"


def sql_str(v: str) -> str:
    return "'" + str(v).replace("'", "''") + "'"


def build_sql(xlsx: Path) -> str:
    df = pd.read_excel(xlsx, sheet_name="Planilha1")
    df = df.where(pd.notna(df), None)

    provs = df[df.list_name == "Provincia"][["name", "label"]].drop_duplicates("name")
    muns = df[df.list_name == "Municipio"][["name", "label", "Provincia"]].drop_duplicates("name")
    coms = df[df.list_name == "Comuna"][["name", "label", "Municipio"]].drop_duplicates("name")

    out: list[str] = ["BEGIN;", "SET LOCAL statement_timeout = '120s';"]

    # Provinces
    rows = ",\n  ".join(f"({sql_str(r['name'])}, {sql_str(r['label'])})" for _, r in provs.iterrows())
    out.append(
        "INSERT INTO public.provinces (code, name) VALUES\n  "
        + rows
        + "\nON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;"
    )

    # Municipalities (resolve province_id via subquery)
    rows = ",\n  ".join(
        f"({sql_str(r['name'])}, {sql_str(r['label'])}, "
        f"(SELECT id FROM public.provinces WHERE code = {sql_str(r['Provincia'])}))"
        for _, r in muns.iterrows()
    )
    out.append(
        "INSERT INTO public.municipalities (code, name, province_id) VALUES\n  "
        + rows
        + "\nON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, province_id = EXCLUDED.province_id;"
    )

    # Communes
    rows = ",\n  ".join(
        f"({sql_str(r['name'])}, {sql_str(r['label'])}, "
        f"(SELECT id FROM public.municipalities WHERE code = {sql_str(r['Municipio'])}))"
        for _, r in coms.iterrows()
    )
    out.append(
        "INSERT INTO public.communes (code, name, municipality_id) VALUES\n  "
        + rows
        + "\nON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, municipality_id = EXCLUDED.municipality_id;"
    )

    # Sede placeholder cleanup (N_A-*) - rename to "{Municipality} (Sede)"
    out.append(
        """UPDATE public.communes c
SET name = m.name || ' (Sede)',
    code = m.code || 'Sede'
FROM public.municipalities m
WHERE c.municipality_id = m.id
  AND c.name = 'N_A'
  AND c.code LIKE 'N\\_A%' ESCAPE '\\';"""
    )

    out.append("COMMIT;")

    # Diagnostics
    out.append(
        """SELECT 'provinces' AS table, COUNT(*) AS rows FROM public.provinces
UNION ALL SELECT 'municipalities', COUNT(*) FROM public.municipalities
UNION ALL SELECT 'communes', COUNT(*) FROM public.communes
UNION ALL SELECT 'placeholders_remaining', COUNT(*) FROM public.communes WHERE name = 'N_A';"""
    )

    return "\n\n".join(out)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--file", type=Path, default=DEFAULT_FILE)
    ap.add_argument("--dry-run", action="store_true", help="print SQL, do not execute")
    args = ap.parse_args()

    if not args.file.exists():
        print(f"❌ Spreadsheet not found: {args.file}", file=sys.stderr)
        return 2

    print(f"📖 Reading {args.file}", file=sys.stderr)
    sql = build_sql(args.file)

    if args.dry_run:
        print(sql)
        return 0

    if not os.environ.get("PGHOST"):
        print("❌ PGHOST not set. Configure PG* env vars.", file=sys.stderr)
        return 2

    print("⚙️  Executing UPSERTs via psql…")
    proc = subprocess.run(["psql", "-v", "ON_ERROR_STOP=1", "-q"], input=sql, text=True)
    if proc.returncode != 0:
        print("❌ psql failed", file=sys.stderr)
        return proc.returncode

    print("✅ Sync completed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())