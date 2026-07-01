# Copilot instructions for this template

This repository is a full starter template for a GitHub Pages site with an end-user chat agent:

```text
GitHub Pages static frontend -> CopilotKit popup -> Azure Functions runtime API -> Microsoft Foundry prompt agent
```

## Primary goal

Help users quickly initialize a working demo from this template. Prefer simple, guided setup over custom architecture unless the user explicitly asks to redesign it.

## Repository structure

- `src/` - Vite + React + Bootstrap frontend for GitHub Pages.
- `api/` - Azure Functions TypeScript runtime API that hosts CopilotKit Runtime and invokes Foundry.
- `agent/` - Foundry prompt-agent config, instructions, and deploy script.
- `.github/workflows/` - Azure provisioning, agent deploy, runtime deploy, and Pages deploy workflows.
- `.github/skills/bootstrap-foundry-pages/` - Copilot skill for initializing this template.
- `.github/prompts/initialize-template.prompt.md` - reusable prompt for setup.

## Default setup path

When asked to initialize or configure the template, follow this order:

1. Ask for only missing values: GitHub Pages origin, Azure subscription/tenant, Azure region, Foundry project endpoint, Azure AI account resource ID, model deployment name, and desired agent name.
2. Update `agent/instructions.md` for the intended end-user scenario.
3. Update `agent/prompt-agent.json` with the chosen `name` and `model`.
4. Configure repository variables listed in `README.md`.
5. Run workflows in this order:
   - `Provision Azure runtime`
   - `Deploy Foundry prompt agent`
   - `Deploy runtime API`
   - enable GitHub Pages in repository settings
   - set `ENABLE_PAGES_DEPLOY=true`
   - `Deploy static site to GitHub Pages`

## Guardrails

- Never put Azure credentials, Foundry tokens, model keys, or client secrets in frontend code, `.env.example`, docs, or committed settings.
- Keep Foundry access server-side in `api/`.
- Use GitHub OIDC and managed identity for deployed Azure access.
- Keep CORS scoped with `GITHUB_PAGES_ORIGIN` / `ALLOWED_ORIGIN`; use `*` only for throwaway local demos.
- Do not remove the `ENABLE_PAGES_DEPLOY` guard unless GitHub Pages is already enabled.
- Do not make runtime deployment run automatically on every push unless Azure variables and permissions are known to be configured.

## Validation commands

Run these after code changes:

```bash
npm run build
cd api
npm run build
```

For documentation-only changes, no build is required.

## Conventions

- Keep the template beginner-friendly.
- Prefer repository variables over secrets for non-sensitive values.
- Prefer secrets only for values that are actually sensitive.
- Keep examples copy/pasteable for GitHub Actions and local Windows PowerShell.
- Use `DefaultAzureCredential` locally and managed identity/workload identity in Azure.
