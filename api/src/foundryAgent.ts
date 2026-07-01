import { randomUUID } from "node:crypto";

import { EventType, type BaseEvent } from "@ag-ui/client";
import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";
import { BuiltInAgent } from "@copilotkit/runtime/v2";

const projectEndpoint = requiredSetting("PROJECT_ENDPOINT");
const agentName = requiredSetting("AGENT_NAME");

const project = new AIProjectClient(projectEndpoint, new DefaultAzureCredential());
const openai = project.getOpenAIClient();

export const foundryAgent = new BuiltInAgent({
  type: "custom",
  factory: async function* ({ input, abortSignal }) {
    const prompt = formatMessages(input.messages as unknown[]);
    const response = await openai.responses.create(
      {
        input: prompt,
      },
      {
        body: { agent: { name: agentName, type: "agent_reference" } },
        signal: abortSignal,
      },
    );

    yield {
      type: EventType.TEXT_MESSAGE_CHUNK,
      role: "assistant",
      messageId: randomUUID(),
      delta: response.output_text ?? "",
    } satisfies BaseEvent;
  },
});

function requiredSetting(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required app setting: ${name}`);
  }

  return value;
}

function formatMessages(messages: unknown[]): string {
  return messages
    .map((message) => {
      const role = getStringProperty(message, "role") ?? "user";
      return `${role}: ${extractMessageText(message)}`;
    })
    .filter((line) => line.trim().length > 0)
    .join("\n\n");
}

function extractMessageText(message: unknown): string {
  const content = getProperty(message, "content");
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content.map(extractContentPartText).filter(Boolean).join("\n");
  }

  return "";
}

function extractContentPartText(part: unknown): string {
  if (typeof part === "string") {
    return part;
  }

  return getStringProperty(part, "text") ?? "";
}

function getStringProperty(value: unknown, property: string): string | undefined {
  const propertyValue = getProperty(value, property);
  return typeof propertyValue === "string" ? propertyValue : undefined;
}

function getProperty(value: unknown, property: string): unknown {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  return (value as Record<string, unknown>)[property];
}
