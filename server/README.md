# P-ELEKTRONIKA BACKEND

The back-end runs on **Node.js** inside a **Docker** container. **Hono** provides HTTP routing, middlewares, and request handling.

---

## Getting Started

Install dependencies and start the development server:

```sh
pnpm install
pnpm run dev
```

The server will be available at `http://localhost:3000`.

---

## Database Migrations

Run migrations locally:

```sh
npx drizzle-kit generate
npx drizzle-kit migrate
```

Or inside a running Docker container:

```sh
docker compose exec <SERVICE_NAME> npx drizzle-kit generate
docker compose exec <SERVICE_NAME> npx drizzle-kit migrate
```

---

## Seeding

Seed scripts for core roles, permissions, and the admin user are defined in `package.json`. Run them via:

```sh
docker compose exec <SERVICE_NAME> pnpm run <SCRIPT>
```

For example, to seed roles when the service name is `server`:

```sh
docker compose exec server pnpm run seed:roles
```

---

## Technology Stack

| Tool                                       | Purpose                                          |
| ------------------------------------------ | ------------------------------------------------ |
| [Hono](https://hono.dev)                   | Lightweight web framework for cloud environments |
| [Drizzle ORM](https://orm.drizzle.team)    | Database migrations and type-safe queries        |
| [Better Auth](https://www.better-auth.com) | Type-safe authentication framework               |

---

## Project Structure

```
.
├── drizzle/                      # Drizzle-generated migration files
├── src/
│   ├── db/
│   │   ├── schema/               # Database schema definitions
│   │   └── connection.ts         # Drizzle connection client
│   ├── lib/
│   │   ├── app.ts                # Application initialisation
│   │   └── auth.ts               # Better Auth configuration
│   ├── middlewares/
│   │   └── index.ts
│   ├── routes/                   # API route handlers
│   ├── scripts/                  # Seeding and setup scripts
│   │   ├── seed-admin.ts
│   │   ├── seed-permissions.ts
│   │   ├── seed-roles.ts
│   │   └── set-policies.ts
│   ├── index.ts
│   └── main.ts
├── Dockerfile
├── drizzle.config.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── tsconfig.json
```
