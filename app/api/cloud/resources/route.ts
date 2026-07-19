import { NextResponse } from "next/server";
import { cloudAdapter } from "@/src/lib/clouds/adapters";
import type { CloudProvider } from "@/src/lib/clouds/types";
const providers = ["aws", "azure", "gcp", "oci"];
export async function GET(request: Request) { const provider = new URL(request.url).searchParams.get("provider") || "aws"; if (!providers.includes(provider)) return NextResponse.json({ error: "Unsupported cloud provider" }, { status: 400 }); return NextResponse.json({ data: await cloudAdapter(provider as CloudProvider).listResources("demo-account") }); }
