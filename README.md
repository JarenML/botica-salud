# botica-salud

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/JarenML/botica-salud)

## Development with Docker

Requires Docker and Docker Compose. Before starting the containers, make sure `backend/.env` and `frontend/.env` exist (copy them from their `.env.example` files if they don't).

```bash
docker compose -f docker-compose-dev.yml up -d
```

- Backend: http://localhost:3000 (docs at `/api-docs`)
- Frontend: http://localhost:5173
- Postgres: localhost:5433 (mapped to avoid clashing with a native Postgres install on 5432)

The backend applies Prisma migrations automatically on startup. The `backend/` and `frontend/` code is mounted as a volume, so changes are reflected via hot reload without rebuilding the image. If you add a new dependency (`npm install`), rebuild with `docker compose -f docker-compose-dev.yml build`.

To stop everything: `docker compose -f docker-compose-dev.yml down` (add `-v` to also delete Postgres data).

Tip: to avoid repeating `-f docker-compose-dev.yml` on every command, export `export COMPOSE_FILE=docker-compose-dev.yml` in your shell.
