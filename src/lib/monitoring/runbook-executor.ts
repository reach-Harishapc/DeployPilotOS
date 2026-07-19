import { cloudAdapter } from "@/src/lib/clouds/adapters";
import type { CloudAction, CloudProvider } from "@/src/lib/clouds/types";
export type ExecutionPolicy = { autonomy: "ask" | "notify" | "full"; requireApproval: boolean; provider: CloudProvider };
export async function executeRunbook(actions: CloudAction[], policy: ExecutionPolicy) {
  if (policy.requireApproval || policy.autonomy === "ask") return { status: "approval_required" as const, actions };
  const results = []; for (const action of actions) results.push(await cloudAdapter(policy.provider).execute(action));
  return { status: "completed" as const, results };
}
