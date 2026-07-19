import { openai } from "./client";
import { DIAGNOSIS_SYSTEM_PROMPT } from "@/src/lib/prompts/diagnosis";

export type Diagnosis = {
  rootCause: string;
  confidence: number;
  evidence: string[];
  actions: { action: string; rationale: string; risk: "low" | "medium" | "high" }[];
  narration: string[];
};

export type IncidentContext = { service: string; metrics: string; logs: string; deploys: string };

export const demoDiagnosis: Diagnosis = {
  rootCause: "Deploy v2.4.1 reduced the database connection pool from 25 to 10. Under normal load, requests queued until they timed out.",
  confidence: 94,
  evidence: [
    "23:46:30 — Deploy v2.4.1 completed.",
    "23:46:51 — Connection pool timeout begins; 47 occurrences in 8 minutes.",
    "Pool utilization reached 100% at pool_size=10 while normal peak requires ~18 connections.",
  ],
  actions: [
    { action: "Restore pool_size to 30", rationale: "Creates safe headroom above peak concurrent demand.", risk: "low" },
    { action: "Restart the connection manager", rationale: "Applies the corrected pool configuration.", risk: "low" },
    { action: "Roll back v2.4.1 and add a configuration guardrail", rationale: "Removes the regression and prevents recurrence.", risk: "medium" },
  ],
  narration: [
    "Fetching the last 500 log lines and recent deployment history…",
    "I found a sharp timeout pattern beginning 21 seconds after v2.4.1 completed.",
    "The deployment changed pool_size from 25 to 10; current demand requires approximately 18 connections.",
    "Root cause identified with 94% confidence. Matching the Connection Pool Exhaustion Recovery runbook.",
  ],
};

export async function diagnoseIncident(context: IncidentContext): Promise<Diagnosis> {
  if (!openai || process.env.DEMO_MODE === "true") return demoDiagnosis;
  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.6",
    instructions: DIAGNOSIS_SYSTEM_PROMPT,
    input: `SERVICE: ${context.service}\nMETRICS: ${context.metrics}\nDEPLOYS: ${context.deploys}\nLOGS:\n${context.logs}`,
    text: { format: { type: "json_schema", name: "incident_diagnosis", strict: true, schema: {
      type: "object", additionalProperties: false,
      properties: {
        rootCause: { type: "string" }, confidence: { type: "number" }, evidence: { type: "array", items: { type: "string" } },
        actions: { type: "array", items: { type: "object", additionalProperties: false, properties: { action: { type: "string" }, rationale: { type: "string" }, risk: { type: "string", enum: ["low", "medium", "high"] } }, required: ["action", "rationale", "risk"] } },
        narration: { type: "array", items: { type: "string" } },
      }, required: ["rootCause", "confidence", "evidence", "actions", "narration"],
    } } },
  });
  return JSON.parse(response.output_text) as Diagnosis;
}
