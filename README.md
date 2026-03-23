# Chat Web Application

A modern, minimal chat UI similar to ChatGPT / chat.langchain.com with WebSocket streaming, session history, and dark mode.

## Tech Stack

- **Backend:** Node.js, Express, WebSocket (ws)
- **Frontend:** React, Vite, Tailwind CSS
- **Storage:** In-memory (no database)

## Features

- Chat UI with user and AI message bubbles
- Left sidebar with conversation history
- Real-time streaming responses over WebSocket
- Create new chat sessions and switch between them
- Loading indicator while the AI responds
- Responsive layout with collapsible sidebar
- Dark mode UI

## Project Structure

```
backend/
  server.js           # Express + WebSocket server
  routes/             # API routes
  controllers/        # Chat + WebSocket handlers
  store/              # In-memory session store

frontend/
  src/
    components/       # Sidebar, MessageBubble, ChatInput, LoadingIndicator
    pages/            # ChatPage
    api/              # REST client
    hooks/            # useWebSocket
    styles/           # Tailwind + global CSS
```

## Run Locally

### Prerequisites

- Node.js 18+ (or 20+ recommended)

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Server runs at **http://localhost:3001**.

### 2. Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**. Vite proxies `/api` and `/ws` to the backend.

### 3. Open the app

Visit **http://localhost:5173** and start chatting. The backend simulates streaming AI responses; you can replace this with a real LLM later.

---

## Run with Docker

From the project root:

```bash
docker compose up --build
```

- Frontend: **http://localhost:13000**
- Backend is used via frontend proxy (no need to open the backend port in the browser).

> **Note:** Host ports **13000** (frontend) and **13001** (backend) avoid common Windows issues: IIS on port 80, and Hyper-V/WSL **reserving** ports like 3000–3001 so Docker cannot bind them (`bind: ... forbidden`).

To stop:

```bash
docker compose down
```

### Docker development (no rebuild on every code change)

Production-style `docker compose up --build` bakes the frontend into an image; **any UI change requires `--build`** unless you use dev mounts.

**Option A — simplest:** run Node on the host (see [Run Locally](#run-locally)) and skip Docker while coding.

**Option B — Docker with hot reload:** use the dev compose file (bind-mounts your code, runs Vite + `node --watch`):

```bash
docker compose -f docker-compose.dev.yml up
```

- App: **http://localhost:13000** (Vite dev server)
- Edit files on disk → browser updates without rebuilding images.
- First start runs `npm ci` in the containers (can take a minute); named volumes cache `node_modules` for Linux.
- If `package.json` / lockfiles change, recreate containers: `docker compose -f docker-compose.dev.yml down` then `up` again.

### If localhost:3000 shows "Can't reach this page" / connection refused

1. **Restart and rebuild:** Stop with `Ctrl+C`, then run:
   ```bash
   docker compose down
   docker compose up --build
   ```
2. **Check ports are published:** Run `docker compose ps` and confirm the frontend shows `0.0.0.0:3000->80/tcp` or `127.0.0.1:3000->80/tcp`.
3. **Try 127.0.0.1:** In the browser use **http://127.0.0.1:3000** instead of `localhost`.
4. **Docker Desktop (Windows):** Ensure Docker Desktop is running and using WSL2. In Settings → Resources → WSL Integration, enable integration for your distro. Restart Docker Desktop and try again.
5. **Firewall:** Temporarily allow Node/nginx or Docker through Windows Firewall, or disable it briefly to test.

### If `docker compose up` fails: "ports are not available" / "bind: ... forbidden" (Windows)

Windows (Hyper-V / WSL) sometimes **reserves** TCP port ranges, so Docker cannot bind to `3000` or `3001`.

1. **See excluded ranges** (PowerShell as Administrator):
   ```powershell
   netsh interface ipv4 show excludedportrange protocol=tcp
   ```
   If `3000`–`3001` fall inside a range, pick host ports **outside** it (e.g. `13000`, `13001`).

2. **Edit `docker-compose.yml`** — map different **host** ports, e.g.:
   ```yaml
   ports:
     - "13001:3001"   # backend
   ```
   and for frontend:
   ```yaml
   ports:
     - "13000:80"
   ```
   Then open **http://localhost:13000** in the browser.

3. **Restart** Docker Desktop or Windows if ranges changed after updates.

---

## API Overview

### REST

| Method | Path | Description |
|--------|------|-------------|
| POST   | /api/sessions | Create a new chat session |
| GET    | /api/sessions | List all sessions |
| GET    | /api/sessions/:id | Get session and messages |
| PATCH  | /api/sessions/:id | Update session (e.g. title) |
| DELETE | /api/sessions/:id | Delete session |
| GET    | /api/sessions/:sessionId/messages | Get messages |
| POST   | /api/sessions/:sessionId/messages | Add a message (role + content) |

### WebSocket

- **URL:** `ws://localhost:3001/ws` (or same host when behind proxy)
- **Query:** `?sessionId=<id>` (optional; omit to create a new session on first message)

**Client → Server**

```json
{ "type": "chat", "sessionId": "<id or null>", "content": "User message" }
```

**Server → Client**

- `session` – new session created (when no sessionId sent)
- `user_message` – echo of the user message
- `start` – streaming started
- `chunk` – streamed token: `{ "type": "chunk", "id": "<messageId>", "content": "..." }`
- `done` – full assistant message
- `error` – error payload

---

## Customization

- **Real LLM:** Replace the simulated streaming in `backend/controllers/websocket.js` with your LLM API (e.g. OpenAI, Anthropic) and stream tokens over the same WebSocket events.
- **Persistence:** Swap `backend/store/sessions.js` for a database (e.g. SQLite, PostgreSQL) using the same function signatures.
