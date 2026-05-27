#!/bin/bash
# MongoDB в Docker, бэкенд локально (почта Gmail), фронтенд на :3000
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "=== VR Home Construction ==="

echo "1/4 MongoDB (Docker)..."
(cd backend && docker compose up -d mongodb)
docker compose -f backend/docker-compose.yml stop backend 2>/dev/null || true

echo "2/4 Ожидание MongoDB..."
sleep 2

echo "3/4 Backend локально (Gmail SMTP)..."
if lsof -ti:8080 >/dev/null 2>&1; then
  echo "Порт 8080 занят — останавливаю старый процесс..."
  lsof -ti:8080 | xargs kill -9 2>/dev/null || true
  sleep 1
fi

(cd backend && chmod +x run-local.sh && ./run-local.sh) &
BACKEND_PID=$!

echo "Ожидание API..."
for i in $(seq 1 30); do
  if curl -s -m 2 "http://localhost:8080/api/layouts" >/dev/null 2>&1; then
    echo "Backend готов: http://localhost:8080"
    break
  fi
  if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "Бэкенд упал. Смотрите вывод выше."
    exit 1
  fi
  sleep 1
done

echo "4/4 Frontend http://localhost:3000 ..."
npm run dev
