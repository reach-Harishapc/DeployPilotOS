export type CloudProvider = "aws" | "azure" | "gcp" | "oci";
export type CloudResource = { id: string; provider: CloudProvider; type: string; region: string; status: "healthy" | "degraded" | "down"; replicas?: number; version?: string };
export type CloudAction = { type: "restart" | "scale" | "rollback" | "health_check"; resourceId: string; replicas?: number; targetVersion?: string; reason: string };
export type CloudActionResult = { accepted: boolean; provider: CloudProvider; action: CloudAction["type"]; message: string; timestamp: string };
export interface CloudAdapter { provider: CloudProvider; listResources(accountId: string): Promise<CloudResource[]>; execute(action: CloudAction): Promise<CloudActionResult>; }
