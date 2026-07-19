import { NextResponse } from "next/server";
import { diagnoseIncident } from "@/src/lib/openai/diagnose";

export async function POST(request: Request) {
  const body = await request.json();
  const diagnosis = await diagnoseIncident({
    service: body.service || "api-service",
    metrics: body.metrics || "Latency 847ms; error rate 23.4%; normal latency 42ms.",
    deploys: body.deploys || "v2.4.1 deployed at 23:46:30; changed database/config.py.",
    logs: body.logs || "ERROR Connection pool timeout after 30s (x47)\nWARN Pool utilization 100% pool_size=10",
  });
  return NextResponse.json(diagnosis);
}
