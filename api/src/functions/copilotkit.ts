import { Readable } from "node:stream";
import type { ReadableStream as WebReadableStream } from "node:stream/web";

import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from "@azure/functions";
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";

import { foundryAgent } from "../foundryAgent.js";

const basePath = "/api/copilotkit";
const runtime = new CopilotRuntime({
  agents: {
    default: foundryAgent,
  },
  runner: new InMemoryAgentRunner(),
});
const handler = createCopilotRuntimeHandler({
  runtime,
  basePath,
  cors: true,
});

export async function copilotkit(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(`CopilotKit runtime request: ${request.method} ${request.url}`);

  if (request.method === "OPTIONS") {
    return {
      status: 204,
      headers: corsHeaders(),
    };
  }

  const webRequest = new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.text(),
  });
  const response = await handler(webRequest);

  return {
    status: response.status,
    headers: mergeHeaders(response.headers, corsHeaders()),
    body: response.body
      ? Readable.fromWeb(response.body as unknown as WebReadableStream)
      : undefined,
  };
}

function mergeHeaders(...headers: HeadersInit[]): Record<string, string> {
  const merged = new Headers();
  for (const headerSet of headers) {
    new Headers(headerSet).forEach((value, key) => merged.set(key, value));
  }

  return Object.fromEntries(merged.entries());
}

function corsHeaders(): Record<string, string> {
  return {
    "access-control-allow-origin": process.env.ALLOWED_ORIGIN ?? "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,authorization,x-copilotkit-runtime-client-gql-version",
  };
}

app.http("copilotkit", {
  route: "copilotkit/{*path}",
  methods: ["GET", "POST", "OPTIONS"],
  authLevel: "anonymous",
  handler: copilotkit,
});
