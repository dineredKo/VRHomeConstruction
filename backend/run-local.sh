#!/bin/bash
# Бэкенд локально — Gmail SMTP работает (из Docker почта не уходит).
set -e
cd "$(dirname "$0")"

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

export MONGO_URI="${MONGO_URI_LOCAL:-mongodb://localhost:27017}"
export SMTP_LOG_ONLY=false
export PORT="${PORT:-8080}"

echo "MongoDB: $MONGO_URI"
echo "SMTP: ${SMTP_HOST:-не задан} (LOG_ONLY=$SMTP_LOG_ONLY)"
echo "API: http://localhost:$PORT"

exec go run ./cmd/server/main.go
