# Bootstrap Foundry Agent Pages

Full starter template for a GitHub Pages site with a chat agent end users can talk to.

It includes:

- a Bootstrap + Vite + React frontend for GitHub Pages,
- a CopilotKit popup connected to a backend runtime,
- a Microsoft Foundry prompt-agent definition,
- an Azure Functions runtime API that invokes the prompt agent securely,
- GitHub Actions workflows to provision Azure, deploy the agent, deploy the runtime, and deploy Pages.
- GitHub Copilot instructions, a setup skill, and a reusable prompt for fast initialization.

## Architecture

```text
User browser
  -> GitHub Pages static site
  -> CopilotKit runtime URL
  -> Azure Functions API
  -> Microsoft Foundry prompt agent
```

The browser never stores Foundry credentials. Azure Functions uses server-side Azure identity to call Foundry.

## Quick start

Create a repository from this template, then configure these repository variables:

```text
AZURE_CLIENT_ID              GitHub OIDC app/client ID
AZURE_TENANT_ID              Azure tenant ID
AZURE_SUBSCRIPTION_ID        Azure subscription ID
AZURE_RESOURCE_GROUP         Resource group for the runtime, for example rg-agent-pages-demo
AZURE_LOCATION               Azure region, for example westeurope
AZURE_STORAGE_ACCOUNT_NAME   Globally unique storage account name
AZURE_FUNCTIONAPP_NAME       Globally unique Function App name
AZURE_AI_ACCOUNT_RESOURCE_ID Resource ID of the Azure AI Services / Foundry account
PROJECT_ENDPOINT             Foundry project endpoint, for example https://<resource>.services.ai.azure.com/api/projects/<project>
AGENT_NAME                   Prompt agent name, default bootstrap-pages-agent
MODEL_DEPLOYMENT_NAME        Foundry model deployment name, for example gpt-5-mini
GITHUB_PAGES_ORIGIN          Pages origin, for example https://<owner>.github.io
VITE_COPILOT_RUNTIME_URL     https://<function-app>.azurewebsites.net/api/copilotkit
ENABLE_PAGES_DEPLOY          Set to true after enabling GitHub Pages
```

Then run the workflows in this order:

1. **Provision Azure runtime** creates the Function App and assigns its managed identity `Foundry User`.
2. **Deploy Foundry prompt agent** creates a prompt-agent version from `agent/instructions.md`.
3. **Deploy runtime API** deploys the Azure Functions CopilotKit runtime and sets app settings.
4. In **Settings > Pages**, set **Build and deployment** to **GitHub Actions**.
5. Set `ENABLE_PAGES_DEPLOY=true`.
6. **Deploy static site to GitHub Pages** publishes the Bootstrap frontend.

The Pages workflow is guarded by `ENABLE_PAGES_DEPLOY` so a repository created from this template does not fail before Pages is enabled.

## Use GitHub Copilot to initialize it

This template includes Copilot helper files:

| File | Purpose |
| --- | --- |
| `.github/copilot-instructions.md` | Repository-wide Copilot guidance and guardrails |
| `.github/skills/bootstrap-foundry-pages/SKILL.md` | Setup workflow skill for initializing and deploying this template |
| `.github/prompts/initialize-template.prompt.md` | Reusable prompt to drive template initialization |

In Copilot Chat, use the prompt file or ask:

```text
Use the bootstrap-foundry-pages skill and initialize this template for my agent demo.
```

Copilot should collect missing values, customize `agent/instructions.md`, update `agent/prompt-agent.json`, and guide you through the workflows in the correct order.

## Customize the agent

Edit:

```text
agent/instructions.md
agent/prompt-agent.json
```

`agent/prompt-agent.json` controls the default agent name and model:

```json
{
  "name": "bootstrap-pages-agent",
  "model": "gpt-5-mini",
  "instructionsFile": "instructions.md"
}
```

The deploy script creates a new prompt-agent version:

```bash
python agent/deploy_prompt_agent.py
```

For local use:

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r agent\requirements.txt
az login
$env:PROJECT_ENDPOINT="https://<resource>.services.ai.azure.com/api/projects/<project>"
python agent\deploy_prompt_agent.py
```

## Run locally

Frontend:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `.env.local` to your runtime API:

```env
VITE_COPILOT_RUNTIME_URL=http://localhost:7071/api/copilotkit
```

Runtime API:

```bash
cd api
npm install
copy local.settings.sample.json local.settings.json
npm start
```

On macOS/Linux, use `cp local.settings.sample.json local.settings.json`.

Update `api/local.settings.json` with your Foundry project endpoint, agent name, and allowed frontend origin. Run `az login` locally so `DefaultAzureCredential` can authenticate.

## GitHub Actions workflows

| Workflow | Purpose |
| --- | --- |
| `.github/workflows/provision-azure.yml` | Creates the Azure Functions runtime and assigns managed identity access to Foundry |
| `.github/workflows/deploy-agent.yml` | Creates a Foundry prompt-agent version |
| `.github/workflows/deploy-runtime.yml` | Builds and deploys the Azure Functions runtime API |
| `.github/workflows/deploy.yml` | Builds and deploys the static GitHub Pages frontend |

## Security notes

- Do not put Azure credentials, model keys, or Foundry tokens in the frontend.
- Use GitHub OIDC for workflow authentication.
- Use managed identity for the deployed Function App.
- Keep CORS scoped with `GITHUB_PAGES_ORIGIN` / `ALLOWED_ORIGIN`; use `*` only for throwaway demos.
- The Function App identity needs `Foundry User` on the Azure AI Services / Foundry account scope.

## Project layout

```text
src/                         GitHub Pages frontend
api/                         Azure Functions CopilotKit runtime
agent/                       Foundry prompt-agent definition and deploy script
.github/workflows/           Provisioning and deployment workflows
.github/skills/              Copilot skill for template initialization
.github/prompts/             Reusable Copilot prompt files
.github/copilot-instructions.md Repository-wide Copilot instructions
.env.example                 Frontend local configuration
```

## Commands

```bash
npm run dev      # frontend development
npm run build    # frontend type-check and build
npm run preview  # preview the production frontend locally

cd api
npm run build    # runtime API type-check and build
npm start        # runtime API local development
```
