# CSS → Tailwind Migration (Strangler Fig)

See the full rule in [`AGENTS.md`](../AGENTS.md#frontend-styling-css--tailwind-strangler-fig).

Short rule: a screen is migrated to Tailwind only when it's touched for a real reason (bug/feature), never as a standalone task. Once a screen reaches 100% Tailwind, its legacy `.css` file is deleted and this table is updated.

| CSS file | Component/Page | Status |
|---|---|---|
| `header.css` | Header | Pending |
| `home.css` | Home | Pending |
| ~~`auth.css`~~ | Login / Register | **Done** — both forms are pure Tailwind; `auth.css` deleted |
| `inventario.css` | Inventory | Pending |
| `category.css` | Categories | Pending |
| `client.css` | Clients | Pending (`.hidden` rule isolated in `@layer components`) |
| `supplier.css` | Suppliers | Pending |
| `sale.css` | Sales | Pending |
| `register_sale.css` | Register Sale | Pending |

**New:** any new UI (AI Assistant, MCP, etc.) is built directly in Tailwind, without going through this table.
