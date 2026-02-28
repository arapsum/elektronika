# P-ELEKTRONIKA

An e-commerce web application shopfront designed to serve as the online
storefront for an electronics store selling **laptops, smartphones, accessories,
and other related hardware**.

The platform provides a fast, user-friendly shopping experience for customers, a
robust admin interface for store management, and a cloud-native backend
optimized for performance, observability, and scalability.

---

## Features

### Customer-Facing Web Front

- Browse products by category (laptops, phones, accessories, etc.)
- Search and filter products by price, brand, specifications, and availability
- Product detail pages with images, specifications, and stock status
- Shopping cart and checkout flow
- Secure user authentication and session management
- Order history and order status tracking
- Transactional email notifications (order confirmations, password resets)

### Admin Dashboard

- Product & category management
- Inventory and stock control
- Order management and fulfillment tracking
- Supplier and pricing management
- Role-based access control (RBAC)
- System monitoring and basic analytics

### Back-end & Infrastructure

- RESTful APIs for front-end and admin UI
- Authentication and authorization
- Media storage and delivery for product images
- Observability with logs, metrics, and traces
- Containerized deployment with reverse proxy and load balancing

---

## Technology Stack

### Front-end

- **React.js** – Component-based UI library
- **Astro** – Performance-focused framework

### Admin UI

- **React.js** – Interactive admin dashboard

### Back-end

- **Hono** – Lightweight, high-performance web framework optimized for
  Cloudflare

### Data Storage

- **PostgreSQL** – Primary relational database
- **Redis** – Caching, sessions, and ephemeral data
- **Drizzle** – Database schema migrations

### Authentication

- **Better Auth** – Type-safe authentication with session and provider support

### File Storage

- **Cloudinary** – Image storage, optimization, and CDN delivery

### E-mail Service

- **Gmail (SMTP)** – Transactional email delivery

### Testing

- **Vitest** – Unit and integration testing
- **K6** – Load and stress testing
- **Playwright** – End-to-end browser testing

### Containerisation & Orchestration

- **Docker** – Containerized development and deployment

### Observability & Monitoring

- **Prometheus** – Metrics collection
- **Grafana** – Dashboards and visualization
- **Loki** – Centralized logging
- **Tempo** – Distributed tracing

### Infrastructure

- **Traefik** – Reverse proxy, routing, and TLS management

---

## System Architecture

At a high level, the system is composed of:

- **Web Frontend (Astro + React)**\
  Serves customer-facing pages and interacts with backend APIs.

- **Admin UI (React.js + Tanstack-start)**\
  Provides management capabilities for products, orders, and users.

- **Backend API (Hono)**\
  Handles authentication, business logic, and database access.

- **Data Layer**
  - PostgreSQL for persistent data
  - Redis for caching and sessions

- **External Services**
  - Cloudinary for media storage
  - Gmail SMTP for email delivery

- **Infrastructure & Observability**
  - Traefik for routing
  - Prometheus, Grafana, Loki, and Tempo for monitoring and tracing

> 📌 **Note:**\
> A high-level system architecture diagram is included in the repository for
> reference. _(This diagram is conceptual and may evolve as the system
> matures.)_

---

## Project Structure (High Level)

```text
.
├── assets                    # Assets required by the project
│   └── design                # System design decisions
├── client/                   # Customer-facing web application (Astro + React)
├── admin/                    # Admin dashboard (React + Tanstack start)
├── server/                   # API services (Hono)
├── k6/                       # K6 Loading testing
├── compose.yaml              # Docker & infrastructure configs
├── redis/                    # Redis config configs
├── pnpm-workspace.yaml       # PNPM workspace configs
└── README.md
