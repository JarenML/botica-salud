# Prisma Commands

1. `npx prisma migrate deploy` → creates the tables in the DB from the migrations already in the repo (`0_init` in this case). Run once when pulling the project (new dev or you).
2. `npx prisma generate` → generates the JS client, to use `prisma.producto.findMany()` etc. in the code.
3. When you change something: edit `schema.prisma` → `npx prisma migrate dev --name something` → creates the new migration, applies it, and regenerates the client automatically (no need for `generate` separately, unlike steps 1-2).
4. `npx prisma studio` → opens GUI at `localhost:5555` to view/edit data.
5. `npx prisma migrate status` → checks if your DB is up to date with the repo's migrations (or if there's drift).
