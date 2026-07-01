# Bootstrap Foundry Agent Pages

Smallest useful GitHub Pages template for a Bootstrap site with CopilotKit and a Microsoft Foundry prompt agent.

It is intentionally split into two simple parts:

- GitHub Pages hosts the static frontend from `dist/`.
- Microsoft Foundry hosts the prompt agent definition.
- A small backend Copilot Runtime endpoint calls Foundry securely.

GitHub Pages is static, so do not put Foundry credentials or API keys in the browser.

## Use this template

Create a new repository from this template, then run:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `VITE_COPILOT_RUNTIME_URL` in `.env.local`:

```env
VITE_COPILOT_RUNTIME_URL=https://your-copilot-runtime.example.com/api/copilotkit
```

Open `http://localhost:5173`. The Copilot popup appears when `VITE_COPILOT_RUNTIME_URL` is set.

## Deploy the Foundry prompt agent

The prompt agent lives in:

```text
agent/prompt-agent.json
agent/instructions.md
agent/deploy_prompt_agent.py
```

Edit `agent/instructions.md` and optionally change the default agent name or model in `agent/prompt-agent.json`.

### Local deploy

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r agent/requirements.txt
az login
$env:PROJECT_ENDPOINT="https://<resource>.services.ai.azure.com/api/projects/<project>"
python agent/deploy_prompt_agent.py
```

On macOS/Linux, set the endpoint with:

```bash
export PROJECT_ENDPOINT="https://<resource>.services.ai.azure.com/api/projects/<project>"
```

The script creates a new prompt-agent version using `DefaultAzureCredential` and writes local deployment metadata to `.foundry/prompt-agent.json`.

### GitHub Actions deploy

Use `.github/workflows/deploy-agent.yml` to deploy the prompt agent manually from GitHub Actions.

Configure OIDC login values as repository variables or secrets:

```text
AZURE_CLIENT_ID
AZURE_TENANT_ID
AZURE_SUBSCRIPTION_ID
PROJECT_ENDPOINT
AGENT_NAME
MODEL_DEPLOYMENT_NAME
```

Required Azure permissions:

- The workflow identity must be allowed to sign in to Azure with GitHub OIDC.
- The identity needs access to the Foundry project, typically `Foundry User`.
- The model named by `MODEL_DEPLOYMENT_NAME` must already be deployed in the Foundry project.

## Connect CopilotKit to the prompt agent

The frontend uses:

```tsx
<CopilotKit runtimeUrl={runtimeUrl}>
  <CopilotPopup />
</CopilotKit>
```

That runtime URL should be a small backend API that:

1. receives CopilotKit chat requests,
2. authenticates to Foundry with managed identity, workload identity, or another server-side credential,
3. invokes the prompt agent,
4. returns the response to CopilotKit.

Good places for that runtime are Azure Functions, Azure Container Apps, App Service, Cloudflare Workers, Vercel, or any small service you already operate.

Do not call Foundry directly from the GitHub Pages frontend unless you have a deliberate public, browser-safe auth design.

## Deploy the static site to GitHub Pages

1. In the new repository, go to **Settings > Pages**.
2. Set **Build and deployment** to **GitHub Actions**.
3. Add a repository variable named `VITE_COPILOT_RUNTIME_URL` with your runtime URL.
4. If deploying as a project site at `https://OWNER.github.io/REPO/`, add `VITE_BASE_PATH` with `/REPO/`. Leave it unset for a user or organization site.
5. Push to `main`.

The workflow builds the Vite app and deploys `dist/`.

## Commands

```bash
npm run dev      # local development
npm run build    # type-check and build static files
npm run preview  # preview the production build locally
```

## Files

```text
src/App.tsx                  Page content and CopilotKit wiring
src/styles.css               Small amount of custom styling
agent/prompt-agent.json      Prompt agent name/model config
agent/instructions.md        Prompt agent instructions
agent/deploy_prompt_agent.py Foundry prompt agent deploy script
.env.example                 Local configuration example
.github/workflows/deploy.yml Static GitHub Pages deployment workflow
.github/workflows/deploy-agent.yml Foundry prompt agent deployment workflow
```
