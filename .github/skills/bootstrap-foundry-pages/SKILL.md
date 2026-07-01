---
name: bootstrap-foundry-pages
description: |
  Initialize and customize this Bootstrap GitHub Pages + CopilotKit + Microsoft Foundry prompt-agent template.
  Use when the user asks to set up, initialize, configure, deploy, or customize this template for a working end-user chat page.
  Triggers: "initialize this template", "set up the agent page", "configure Foundry", "deploy the GitHub Pages agent", "make this template work".
---

# Bootstrap Foundry Agent Pages

Use this skill to quickly turn this template into a working GitHub Pages site where end users can chat with a Microsoft Foundry prompt agent.

## What this template deploys

```text
End user browser
  -> GitHub Pages Bootstrap frontend
  -> CopilotKit popup
  -> Azure Functions runtime API
  -> Microsoft Foundry prompt agent
```

## Required inputs

Collect only values that are missing:

| Value | Where it is used |
| --- | --- |
| `AZURE_CLIENT_ID` | GitHub OIDC login |
| `AZURE_TENANT_ID` | GitHub OIDC login |
| `AZURE_SUBSCRIPTION_ID` | GitHub OIDC login and provisioning |
| `AZURE_RESOURCE_GROUP` | Runtime resource group |
| `AZURE_LOCATION` | Azure region |
| `AZURE_STORAGE_ACCOUNT_NAME` | Function App storage |
| `AZURE_FUNCTIONAPP_NAME` | Runtime API hostname |
| `AZURE_AI_ACCOUNT_RESOURCE_ID` | Scope for assigning `Foundry User` to the Function App identity |
| `PROJECT_ENDPOINT` | Foundry project endpoint |
| `AGENT_NAME` | Foundry prompt-agent name |
| `MODEL_DEPLOYMENT_NAME` | Existing Foundry model deployment |
| `GITHUB_PAGES_ORIGIN` | CORS allow-list |
| `VITE_COPILOT_RUNTIME_URL` | Frontend runtime URL |
| `ENABLE_PAGES_DEPLOY` | Set to `true` only after Pages is enabled |

## Initialization workflow

1. **Customize the prompt agent**
   - Edit `agent/instructions.md` for the user's scenario.
   - Edit `agent/prompt-agent.json` if the agent name or model should change.

2. **Configure repository variables**
   - Add the variables listed above in GitHub repository settings.
   - Use secrets only for sensitive values.
   - Do not commit credentials.

3. **Provision Azure**
   - Run the `Provision Azure runtime` workflow.
   - Confirm the Function App managed identity receives `Foundry User` on the Azure AI account scope.

4. **Deploy the agent**
   - Run the `Deploy Foundry prompt agent` workflow.
   - If it fails due to missing model deployment or RBAC, fix that in Foundry/Azure before continuing.

5. **Deploy the runtime**
   - Run the `Deploy runtime API` workflow.
   - Confirm the runtime URL is `https://<AZURE_FUNCTIONAPP_NAME>.azurewebsites.net/api/copilotkit`.

6. **Deploy Pages**
   - In repository settings, set Pages deployment source to GitHub Actions.
   - Set `ENABLE_PAGES_DEPLOY=true`.
   - Run or push to trigger `Deploy static site to GitHub Pages`.

## Local development workflow

Frontend:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Runtime API:

```bash
cd api
npm install
cp local.settings.sample.json local.settings.json
npm start
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env.local
Set-Location api
Copy-Item local.settings.sample.json local.settings.json
```

Run `az login` locally so `DefaultAzureCredential` can call Foundry.

## Validation

For code changes, run:

```bash
npm run build
cd api
npm run build
```

For prompt-only changes in `agent/instructions.md`, no TypeScript build is required.

## Common fixes

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Pages workflow is skipped | `ENABLE_PAGES_DEPLOY` is not `true` | Enable Pages, then set the variable |
| Pages deploy returns `Not Found` | Pages is not enabled | Set Pages source to GitHub Actions |
| Azure login fails | Missing OIDC variables or federated credential | Configure `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, and federated credentials |
| Runtime returns auth errors | Function identity lacks Foundry access | Assign `Foundry User` on the Azure AI account scope |
| Browser CORS error | `GITHUB_PAGES_ORIGIN` / `ALLOWED_ORIGIN` mismatch | Set the exact Pages origin |
| Agent says generic things | Instructions are still default | Rewrite `agent/instructions.md` for the demo scenario |

## Security rules

- Never expose Foundry credentials in the browser.
- Never commit `.env`, `.env.local`, `api/local.settings.json`, or generated `.foundry` metadata.
- Keep the Foundry call inside `api/`.
- Prefer managed identity and GitHub OIDC over keys or publish profiles.
