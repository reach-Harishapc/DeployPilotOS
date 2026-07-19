import { NextResponse } from "next/server";
export async function GET() { return NextResponse.json({ status: "ok", service: "deploypilot-control-plane", timestamp: new Date().toISOString() }); }
