import os
import re
import sys
from pathlib import Path

import psycopg2


MIGRATIONS_DIR = Path(__file__).resolve().parent.parent / "migrations"
VERSION_RE = re.compile(r"^V(\d+)__.*\.sql$", re.IGNORECASE)


def load_migrations():
    found = {}
    for path in MIGRATIONS_DIR.glob("V*__*.sql"):
        match = VERSION_RE.match(path.name)
        if not match:
            continue
        version = int(match.group(1))
        if version in found:
            raise SystemExit(f"Duplicate migration version {version}: {found[version].name} and {path.name}")
        found[version] = path
    return sorted(found.items())


def main():
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("DATABASE_URL is not set", file=sys.stderr)
        sys.exit(1)

    migrations = load_migrations()
    if not migrations:
        print(f"No migration files found in {MIGRATIONS_DIR}", file=sys.stderr)
        sys.exit(1)

    conn = psycopg2.connect(database_url)
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS schema_migrations (
                    version INTEGER PRIMARY KEY,
                    filename TEXT NOT NULL,
                    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
                )
                """
            )
            cur.execute("SELECT version FROM schema_migrations")
            applied = {row[0] for row in cur.fetchall()}
    except Exception:
        conn.rollback()
        raise

    pending = [(version, path) for version, path in migrations if version not in applied]
    if not pending:
        print(f"Database is up to date ({len(applied)} migrations already applied)")
        return

    for version, path in pending:
        sql = path.read_text(encoding="utf-8")
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                cur.execute(
                    "INSERT INTO schema_migrations (version, filename) VALUES (%s, %s)",
                    (version, path.name),
                )
            conn.commit()
            print(f"Applied V{version}: {path.name}")
        except Exception as e:
            conn.rollback()
            print(f"FAILED applying V{version} ({path.name}): {e}", file=sys.stderr)
            sys.exit(1)

    print(f"Done. Applied {len(pending)} migration(s), total {len(applied) + len(pending)}")


if __name__ == "__main__":
    main()
