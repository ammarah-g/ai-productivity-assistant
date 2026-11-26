import { createOpenAI } from "@ai-sdk/openai";
import { streamText, APICallError } from "ai";

const LOVABLE_AIG_RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

function createRunIdFetch() {
  let runId: string | undefined;
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    if (runId && !headers.has(LOVABLE_AIG_RUN_ID_HEADER)) headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);
    const response = await fetch(input, { ...init, headers });
    runId ??= response.headers.get(LOVABLE_AIG_RUN_ID_HEADER)?.trim() || undefined;
    return response;
  };
}

export type AiResult = { text: string; error?: undefined } | { text?: undefined; error: string };

export async function generateWithAi(instructions: string, prompt: string): Promise<AiResult> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return { error: "AI is not configured for this app yet." };
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: createRunIdFetch(),
  });
  try {
    const result = streamText({
      model: provider.responses("openai/gpt-6-astra"),
      instructions,
      messages: [{ role: "user", content: prompt }],
      maxRetries: 0,
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });
    const text = (await result.text).trim();
    const finish = await result.finishReason;
    if (!text) return { error: finish === "content-filter" ? "The AI declined this request." : "The AI returned an empty response. Please try again." };
    return { text };
  } catch (err) {
    console.error("AI gateway error", err);
    const status = APICallError.isInstance(err) ? err.statusCode : undefined;
    if (status === 429) return { error: "Too many requests right now. Please wait a moment and try again." };
    if (status === 402) return { error: "AI credits have run out for this workspace. Add credits to keep generating." };
    if (status === 403) return { error: "AI access is blocked for this workspace. A workspace admin needs to review AI settings." };
    return { error: "Something went wrong while generating. Please try again." };
  }
}
