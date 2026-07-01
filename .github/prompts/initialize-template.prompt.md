---
mode: agent
description: Initialize this repository from the Bootstrap Foundry Agent Pages template.
---

Initialize this template into a working GitHub Pages site with an end-user chat agent.

Follow `.github/copilot-instructions.md` and use the `bootstrap-foundry-pages` skill. Do not redesign the architecture unless I explicitly ask.

Tasks:

1. Ask me for any missing setup values from the README quick start.
2. Customize `agent/instructions.md` for my target audience and use case.
3. Update `agent/prompt-agent.json` with my agent name and model deployment.
4. Tell me exactly which repository variables to set.
5. Guide me through the workflows in the correct order:
   - Provision Azure runtime
   - Deploy Foundry prompt agent
   - Deploy runtime API
   - enable GitHub Pages
   - set `ENABLE_PAGES_DEPLOY=true`
   - Deploy static site to GitHub Pages
6. Keep secrets out of source control and keep Foundry calls server-side in `api/`.

Before finishing, validate any code changes with:

```bash
npm run build
cd api
npm run build
```
