#!/usr/bin/env bash
set -o errexit

python scripts/apply_migrations.py

exec gunicorn --workers 2 --threads 4 --timeout 120 --bind 0.0.0.0:$PORT app.app:app
