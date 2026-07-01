# Bootstrap Hosted Agent Pages

Smallest useful GitHub Pages template for a Bootstrap site with a hosted agent embedded through CopilotKit.

It is intentionally static:

- GitHub Pages hosts the built frontend from `dist/`.
- Your agent runs somewhere else and exposes an AG-UI HTTP endpoint.
- The frontend only needs `VITE_AGENT_URL`.

## Use this template

Copy the contents of this folder into a fresh repository root. Keep the included `.github/workflows/deploy.yml` at `.github/workflows/deploy.yml` in the new repository.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `VITE_AGENT_URL` in `.env.local`:

```env
VITE_AGENT_URL=https://your-hosted-agent.example.com/
```

Open `http://localhost:5173`. The Copilot popup appears when `VITE_AGENT_URL` is set.

## Deploy to GitHub Pages

1. In the new repository, go to **Settings > Pages**.
2. Set **Build and deployment** to **GitHub Actions**.
3. Add a repository variable named `VITE_AGENT_URL` with your hosted agent URL.
4. If deploying as a project site at `https://OWNER.github.io/REPO/`, add `VITE_BASE_PATH` with `/REPO/`. Leave it unset for a user or organization site.
5. Push to `main`.

The workflow builds the Vite app and deploys `dist/`.

## Hosted agent requirements

Your hosted agent must:

- speak AG-UI over HTTP
- be reachable from the browser
- allow CORS from `http://localhost:5173` for local development
- allow CORS from your GitHub Pages origin for production

Do not put secrets in this static site. If the agent needs keys, tokens, model credentials, or identity, keep them on the hosted agent side.

## Why this uses direct AG-UI

CopilotKit can also use a server-side Copilot Runtime. GitHub Pages cannot host that runtime, so this template uses CopilotKit's direct AG-UI agent connection for the simplest static-site setup.

If you need runtime middleware, server-side tools, auth brokering, or multiple private agents, add a tiny hosted runtime service and point `CopilotKit` at that service instead.

## Commands

```bash
npm run dev      # local development
npm run build    # type-check and build static files
npm run preview  # preview the production build locally
```

## Files

```text
src/App.tsx                 Page content and CopilotKit wiring
src/styles.css              Small amount of custom styling
.env.example                Local configuration example
.github/workflows/deploy.yml GitHub Pages deployment workflow
```
