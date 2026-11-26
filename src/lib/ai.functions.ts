import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateWithAi } from "./ai.server";

const BASE =
  "You are a meticulous workplace productivity assistant. Write in clear, professional English using simple Markdown (## headings, - bullets, **bold**). Never invent facts the user did not provide; when information is missing, use a bracketed placeholder like [Date]. Output only the deliverable, without preamble or closing commentary.";

const emailInput = z.object({
  purpose: z.string().min(3).max(4000),
  recipient: z.string().max(200),
  sender: z.string().max(200),
  keyPoints: z.string().max(4000),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
  length: z.enum(["Short", "Medium", "Detailed"]),
});

const TONE: Record<string, string> = {
  Formal: "Formal: courteous, precise, polished corporate register, no contractions or slang.",
  Friendly: "Friendly: warm, approachable and conversational while staying professional.",
  Persuasive: "Persuasive: confident and benefit-led, address likely objections, end with a clear, specific call to action.",
};

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d) => emailInput.parse(d))
  .handler(async ({ data }) => {
    const instructions = `${BASE}
Task: draft one professional email.
Tone — ${TONE[data.tone]}
Length — ${data.length} (Short ≈ 80–120 words, Medium ≈ 150–220, Detailed ≈ 250–350).
Format exactly:
Subject: <a specific subject line>

<greeting>,

<body paragraphs>

<sign-off>,
<sender name>
Use plain text for the email (no Markdown headings). Personalise with every detail supplied.`;
    const prompt = `Purpose: ${data.purpose}
Recipient: ${data.recipient || "[Recipient]"}
Sender: ${data.sender || "[Your name]"}
Key points to include:
${data.keyPoints || "(none beyond the purpose)"}`;
    return generateWithAi(instructions, prompt);
  });

const plannerInput = z.object({
  mode: z.enum(["Daily", "Weekly"]),
  startDate: z.string().max(40),
  workHours: z.string().max(60),
  tasks: z
    .array(
      z.object({
        title: z.string().min(1).max(300),
        deadline: z.string().max(40),
        priority: z.enum(["High", "Medium", "Low"]),
        estimate: z.string().max(40),
      }),
    )
    .min(1)
    .max(40),
  notes: z.string().max(2000),
});

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((d) => plannerInput.parse(d))
  .handler(async ({ data }) => {
    const instructions = `${BASE}
Task: build a realistic ${data.mode.toLowerCase()} schedule.
Steps:
1. Classify every task on the Eisenhower matrix (urgency from the deadline relative to the start date; importance from priority).
2. Output these sections in order:
## Priority Matrix
- **Do first (urgent & important):** ...
- **Schedule (important, not urgent):** ...
- **Delegate (urgent, less important):** ...
- **Eliminate or defer:** ...
## ${data.mode === "Daily" ? "Today's Schedule" : "Weekly Schedule"}
${data.mode === "Daily" ? "Time-blocked list like `- 09:00–10:30 · Task — note`." : "One ### heading per day (with date) and time-blocked bullets under each."}
Respect working hours, place deep work early, include short breaks, never schedule a task after its deadline, and keep a small buffer.
## Focus Tips
3–5 tips specific to these tasks.
If the workload cannot fit, say so plainly under a final "## Risks" section.`;
    const list = data.tasks
      .map((t, i) => `${i + 1}. ${t.title} | priority: ${t.priority} | deadline: ${t.deadline || "none"} | estimate: ${t.estimate || "unknown"}`)
      .join("\n");
    const prompt = `Start date: ${data.startDate || "today"}
Working hours: ${data.workHours || "09:00–17:00"}
Tasks:
${list}
Extra notes: ${data.notes || "none"}`;
    return generateWithAi(instructions, prompt);
  });

const researchInput = z.object({
  topic: z.string().min(3).max(20000),
  goal: z.string().max(500),
  depth: z.enum(["Brief", "Standard", "In-depth"]),
});

export const generateResearch = createServerFn({ method: "POST" })
  .inputValidator((d) => researchInput.parse(d))
  .handler(async ({ data }) => {
    const instructions = `${BASE}
Task: act as a research analyst. The user gives either a topic or pasted article text.
If it is article text, ground everything in that text only. If it is a topic, use well-established general knowledge and flag anything uncertain or time-sensitive.
Depth: ${data.depth} (Brief ≈ 200 words, Standard ≈ 400, In-depth ≈ 700).
Output sections:
## Summary
## Key Insights
(numbered, each with a bold one-line headline and a short explanation)
## Recommendations
(actionable next steps tailored to the stated goal)
## Open Questions
(what to verify or explore further)`;
    const prompt = `Goal / audience: ${data.goal || "general professional understanding"}
Input:
"""
${data.topic}
"""`;
    return generateWithAi(instructions, prompt);
  });
