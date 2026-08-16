# botica-salud

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/JarenML/botica-salud)

## Desarrollo con Docker

Requiere Docker y Docker Compose. Antes de levantar los contenedores, asegurate de tener `backend/.env` y `frontend/.env` (copialos desde sus `.env.example` si no existen).

```bash
docker compose -f docker-compose-dev.yml up -d
```

- Backend: http://localhost:3000 (docs en `/api-docs`)
- Frontend: http://localhost:5173
- Postgres: localhost:5432

El backend aplica las migraciones de Prisma automaticamente al iniciar. El codigo de `backend/` y `frontend/` esta montado como volumen, asi que los cambios se reflejan con hot reload sin reconstruir la imagen. Si agregas una dependencia nueva (`npm install`), reconstruye con `docker compose -f docker-compose-dev.yml build`.

Para detener todo: `docker compose -f docker-compose-dev.yml down` (agrega `-v` para borrar tambien los datos de Postgres).

Tip: para no repetir `-f docker-compose-dev.yml` en cada comando, exporta `export COMPOSE_FILE=docker-compose-dev.yml` en tu shell.
