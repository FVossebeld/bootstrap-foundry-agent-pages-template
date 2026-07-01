import argparse
import json
import os
from pathlib import Path

from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import PromptAgentDefinition
from azure.identity import DefaultAzureCredential


def read_config(path: Path) -> dict[str, str]:
    with path.open(encoding="utf-8") as file:
        config = json.load(file)

    instructions_file = config.get("instructionsFile")
    if instructions_file:
        instructions_path = path.parent / instructions_file
        config["instructions"] = instructions_path.read_text(encoding="utf-8")

    return config


def required(value: str | None, name: str) -> str:
    if not value:
        raise SystemExit(f"Missing {name}. Set it in the agent config, workflow input, or environment.")
    return value


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a Microsoft Foundry prompt agent version.")
    parser.add_argument("--config", default="agent/prompt-agent.json", help="Path to the prompt agent config.")
    parser.add_argument("--output", default=".foundry/prompt-agent.json", help="Where to write deployment metadata.")
    args = parser.parse_args()

    config_path = Path(args.config)
    config = read_config(config_path)

    project_endpoint = required(
        os.getenv("PROJECT_ENDPOINT")
        or os.getenv("AZURE_AI_PROJECT_ENDPOINT")
        or os.getenv("AZURE_AIPROJECT_ENDPOINT"),
        "PROJECT_ENDPOINT",
    )
    agent_name = required(os.getenv("AGENT_NAME") or config.get("name"), "AGENT_NAME")
    model = required(os.getenv("MODEL_DEPLOYMENT_NAME") or config.get("model"), "MODEL_DEPLOYMENT_NAME")
    instructions = required(config.get("instructions"), "instructions")

    project = AIProjectClient(
        endpoint=project_endpoint,
        credential=DefaultAzureCredential(),
    )

    agent = project.agents.create_version(
        agent_name=agent_name,
        definition=PromptAgentDefinition(
            model=model,
            instructions=instructions,
        ),
    )

    metadata = {
        "id": agent.id,
        "name": agent.name,
        "version": agent.version,
        "model": model,
        "projectEndpoint": project_endpoint,
    }

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(metadata, indent=2))


if __name__ == "__main__":
    main()
