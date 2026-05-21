# VR Home Construction — Backend

Добро пожаловать в backend часть проекта VR Home Construction. Этот README объясняет архитектуру, запуск, тестирование и основные API-эндпойнты сервера.

## Краткое описание

Backend реализован на Go и предоставляет REST API для фронтенд-части 3D-редактора интерьеров. Хранение данных выполнено в MongoDB. Архитектура — слоистая: handlers → services → repositories → database.

Технологии:
- Go (модульная структура)
- Gin (HTTP routing)
- MongoDB (хранение документов)
- Docker / Docker Compose

## Структура проекта (важные директории)

- `cmd/server` — точка входа приложения
- `internal/config` — загрузка конфигурации (env vars)
- `internal/database` — подключение к MongoDB
- `internal/models` — описания сущностей (Project, Folder, Layout, User)
- `internal/repositories` — доступ к данным (CRUD)
- `internal/services` — бизнес-логика
- `internal/handlers` — HTTP-эндпойнты
- `internal/middleware` — CORS и прочие middleware

## Быстрый старт

Рекомендуемый способ — через Docker Compose.

1. Перейдите в папку backend:

```bash
cd /Users/execada/GolandProjects/VRHomeConstruction/backend
```

2. Поднимите сервисы:

```bash
docker-compose up --build
```

3. По умолчанию сервер будет доступен на `http://localhost:8080`.

### Локальный запуск без Docker

Требуется установленный MongoDB и Go.

```bash
go mod download

go run ./cmd/server/main.go
```

Если MongoDB запущена локально на стандартном порту, по умолчанию сервер подключится к `mongodb://localhost:27017`.

## Переменные окружения

Конфигурация читается из окружения. Основные переменные:

- `PORT` — порт сервера (по умолчанию `8080`)
- `MONGO_URI` — URI подключения к MongoDB (например `mongodb://localhost:27017`)

Можно создать `.env` файл рядом с `docker-compose.yml` или передавать переменные в среде выполнения контейнера.

## API — краткая документация

Базовый префикс: `/api`

Проекты (Projects):

- `GET /api/projects` — получить список проектов (поддерживает `page`, `limit`, `status`)
- `GET /api/projects/:id` — получить проект по ID
- `POST /api/projects` — создать проект
- `PUT /api/projects/:id` — обновить проект (включая `roomData`)
- `DELETE /api/projects/:id` — удалить проект

Папки (Folders):

- `GET /api/folders` — получить дерево папок
- `POST /api/folders` — создать папку
- `PUT /api/folders/:id` — обновить папку
- `DELETE /api/folders/:id` — удалить папку

Раскладки (Layouts):

- `GET /api/layouts` — получить все раскладки
- `POST /api/layouts` — создать раскладку
- `PUT /api/layouts/:id` — обновить раскладку
- `DELETE /api/layouts/:id` — удалить раскладку

Пример: создание проекта

```bash
curl -X POST http://localhost:8080/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Гостиная","template":"modern"}'
```

## Модели данных (кратко)

- Project — содержит метаданные и `roomData` (dimensions, openings, partitions, furniture и т.д.)
- Folder — иерархическая сущность с `parentId`, `projectIds` и `childFolderIds`
- Layout — шаблон/раскладка

Подробные структуры находятся в `internal/models`.

## Архитектура и потоки данных

1. Handler принимает HTTP-запрос, парсит JSON и валидирует вход.
2. Handler вызывает соответствующий Service, который реализует бизнес-логику.
3. Service использует Repository для чтения/записи данных в MongoDB.
4. Repository работает с коллекциями через `internal/database`.

Такой подход упрощает тестирование и развитие — можно мокать репозитории при тестах сервисов.

## Тестирование

Запуск всех тестов:

```bash
go test ./... -v
```

Рекомендуется покрыть юнит-тестами `services` и `repositories`. Для интеграционных тестов удобно использовать тестовую MongoDB (docker контейнер) или in-memory mock.

## Разработка и отладка

- Логи и паники: можно добавить recovery middleware и structured logging (zap/logrus).
- При изменении моделей — не забывать обновлять BSON-теги и индексы в MongoDB.

## Производство: рекомендации

- Добавить аутентификацию/авторизацию (JWT).
- Настроить TLS/HTTPS и reverse proxy (nginx или cloud LB).
- Добавить мониторинг (Prometheus) и лог-агрегатор (ELK/Graylog).
- Использовать ReplicaSet/Managed MongoDB для отказоустойчивости и резервного копирования.

## Отладка проблем

- Если сервер не стартует — проверьте `MONGO_URI` и доступность MongoDB.
- Проверьте права доступа на порты и переменные окружения в контейнере.
- Смотрите логи контейнера: `docker-compose logs -f`.

## Контрибьюция

Если планируете внести изменения:

1. Создайте ветку `feature/your-feature`.
2. Покройте критичные участки тестами.
3. Откройте Pull Request с описанием изменений.

## Контакты

Если нужны дополнительные пояснения по коду — пишите в issues репозитория или свяжитесь с автором проекта.

---

Этот README даёт практическое руководство для запуска и разработки backend части проекта. Если хотите, могу добавить автоматически генерируемую OpenAPI/Swagger-спецификацию и пример Postman коллекции.

