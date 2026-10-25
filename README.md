# featureflag-dashboard

A small feature-management platform: create flags, configure them per environment, and roll features out to a percentage of users without deploying code.

React + Vite (client) · Node + Express (server) · MongoDB · plain JavaScript.

## Structure

```
client/   React dashboard
server/   Express API + MongoDB models
```

## Run locally

You need Node 20.6+ and a MongoDB database (local or Atlas).

```bash
# 1. API
cd server
cp .env.example .env        # then set MONGODB_URI
npm install
npm run seed                # optional: loads 12 sample flags
npm run dev                 # http://localhost:5000

# 2. Dashboard (new terminal)
cd client
npm install
npm run dev                 # http://localhost:5173
```

## API

| Method | Endpoint                              | Purpose                                  |
| ------ | ------------------------------------- | ---------------------------------------- |
| GET    | /api/flags                            | List flags                               |
| POST   | /api/flags                            | Create a flag                            |
| PATCH  | /api/flags/:id                        | Edit details and per-environment rollout |
| PATCH  | /api/flags/:id/environments/:env      | Turn a flag on/off in one environment    |
| DELETE | /api/flags/:id                        | Delete a flag                            |
| POST   | /api/flags/restore                    | Undo a delete                            |
| GET    | /api/audit-logs                       | Change history                           |

## Roadmap

- [x] **Phase 1** – Dashboard UI with mock data
- [x] **Phase 2** – Express + MongoDB backend, real CRUD, TanStack Query, audit log stored in the database
- [ ] **Phase 3** – Server-side search/filter/sort/pagination, table state in the URL, optimistic updates
- [ ] **Phase 4** – Stable percentage-rollout evaluation endpoint + demo app
- [ ] **Phase 5** – Auth, roles, confirm flows, tests

## Design notes

- Each flag stores `enabled` and `rollout` **per environment**.
- The toggle endpoint takes an explicit `enabled` value instead of flipping, so retries and Undo are safe.
- Every change writes an audit entry on the server, in the same request that makes the change.
- The flag `key` is immutable: code references it.
