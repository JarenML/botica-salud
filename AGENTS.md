# AGENTS.md — Botica Salud

Guidance for any AI agent (Claude Code, Codex, Cursor, etc.) working in this repository.

## Project North Star

> **"The goal is not to build an AI Pharmacy ERP. The goal is to demonstrate AI Engineering through a real Pharmacy ERP."**

Botica Salud is a functional pharmacy ERP being used as a demonstration platform for applied AI engineering (Agentic AI, MCP, RAG) — it is not a pharmacy ERP project in itself. It is the author's flagship portfolio project, meant to open conversations with HealthTech startup founders and international recruiters. It should never read or look like "a pharmacy CRUD."

## Decision Rule for Any Feature or Recommendation

Before proposing or implementing anything, evaluate:

**"Does this better demonstrate the author's capabilities as an AI Engineer and Product Engineer?"**

- If the answer is **yes** → it belongs in the current roadmap.
- If the answer is **no** → defer it to a later phase. Do not implement it now, even if it's "easy" or "expected" in a typical ERP. **Exception:** if it's an exceptionally strong ERP feature — high business impact, low effort, or a clear prerequisite for the AI showcase — treat it as a **yes** even if it doesn't directly demonstrate AI engineering.
- If something adds complexity without meaningful value → **recommend against** implementing it.

Business value comes first, technology comes second. Never build AI just because it looks impressive — every AI capability must solve a real pharmacy workflow.

## Horizons

- **Stage 1 — current (3-6 weeks):** an AI layer on top of the existing ERP. **Do NOT** redesign the ERP. **Do NOT** rebuild the application. The ERP already provides enough business context; the focus is the AI layer.
- **Stage 2 — long-term (6-24 months):** evolve toward a full AI-Native ERP (multi-agent, cloud, advanced analytics). This is vision, not day-to-day priority.

## Phase 1 — AI Showcase (current priority)

1. **AI Assistant** — natural language interface over the ERP (e.g. "which medicines are low on stock?", "which ones expire this month?", "generate today's summary"). The assistant must **query the real ERP, never invent data**.
2. **MCP** — the most important demonstration. Expose ERP capabilities as reusable MCP tools: `search_inventory`, `get_sales`, `search_customer`, `get_suppliers`, `get_low_stock`, `get_expiring_products`, `generate_purchase_order`. Principle: *"The AI doesn't know. The ERP knows. The AI orchestrates."*
3. **RAG** — answer questions using documentation (pharmacy regulations, medicine manuals, internal policies, FAQs), not just transactional data.
4. **Multi-step agentic workflow** — orchestrate several steps in a chain instead of answering isolated questions. Reference example: "we're running low on Paracetamol" → check inventory → analyze sales history → estimate demand → search supplier → generate a purchase order draft.

## Multi-Agent Layer (Stage 2, not yet in scope)

Future agents under consideration: Inventory Agent, Sales Agent, Procurement Agent, Analytics Agent, Compliance Agent, Customer Support Agent. Treat as roadmap only, not immediate work.

## Technical Philosophy

- Clean Architecture, modular design, SOLID, API-first, scalable folder structure.
- Avoid unnecessary complexity — the architecture must stay maintainable by a single person.
- Enterprise-grade practices without over-engineering.

## Frontend Styling: CSS → Tailwind (Strangler Fig)

Tailwind is installed (`@tailwindcss/vite`) and is now the default for **all new frontend work**, including any AI-showcase UI (chat panel, tool-call views, etc.). Legacy per-page `.css` files are migrated incrementally via the Strangler Fig pattern, not rewritten in one pass:

- A screen/component is migrated to Tailwind **only** when it's already being touched for a real reason (bug, feature, redesign request) — never as a standalone migration task. This keeps it from competing with Phase 1 priorities.
- When a screen reaches 100% Tailwind, delete its legacy `.css` file. A `.css` file left behind after migration is a dangling vine, not a finished migration.
- Track status in `frontend/CSS_MIGRATION.md`; update it whenever a screen's status changes.
- Gotcha (already hit once): any global reset (`* { ... }`) must live inside `@layer base { ... }`. Unlayered CSS always wins over Tailwind's layered utilities regardless of specificity, so a bare `* { padding: 0 }` silently breaks every `p-*`/`m-*` utility app-wide.

## Actual Repo Stack (verify before assuming)

- **Backend**: Node.js + Express 5, Prisma ORM (`@prisma/client`, `@prisma/adapter-pg`) on PostgreSQL. Structure: `routes/`, `controllers/`, `models/`, `middlewares/`, `services/`, `prisma/schema.prisma`.
- **Frontend**: React 19 + Vite + Tailwind CSS v4, React Router 7, Axios, jsPDF for reports. Structure: `src/components/`, `src/pages/`, `src/services/`, `src/utils/`.
- No test suite configured yet (`npm test` in backend is a placeholder).

## Potential AI Stack (to be evaluated, no final decision made)

Anthropic / OpenAI, LangGraph, MCP, RAG, vector database, structured outputs, function calling, streaming responses. Technology choices must always be justified by business value, not novelty.

## Cloud Vision (long-term, not a current priority)

AWS: ECS/Kubernetes, RDS (Postgres), S3, Cognito, Lambda, API Gateway, EventBridge, Bedrock.

## How the Agent Should Reason When Working in This Repo

Don't optimize only for "code that works." Think like a Staff Software Engineer, Product Engineer, AI Engineer, Software Architect, and Startup CTO at once. For every non-trivial recommendation, explain:

1. Why it matters.
2. Business value.
3. Technical trade-offs.
4. Scalability impact.
5. Whether it strengthens the AI showcase (Phase 1).
6. Whether it strengthens the repository as a flagship portfolio project.

Always challenge the assumptions behind a request instead of just executing it literally.

## Repository Quality Goals (portfolio objective)

The repo must communicate professionalism: a clear README, documentation, architecture diagrams, demos/GIFs, a deployment guide, a feature roadmap, and a clear development setup explanation. A visitor should understand both **what** the system does and **why** it was designed that way — it should not look like "a pharmacy CRUD" but like "an AI-first business platform demonstrating real-world software architecture."
