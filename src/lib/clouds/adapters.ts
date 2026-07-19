import type { CloudAction, CloudActionResult, CloudAdapter, CloudProvider, CloudResource } from "./types";

class ProviderAdapter implements CloudAdapter {
  constructor(public provider: CloudProvider) {}
  async listResources(accountId: string): Promise<CloudResource[]> { return [{ id: `${this.provider}:${accountId}:api`, provider: this.provider, type: this.resourceType(), region: "demo-region-1", status: "healthy", replicas: 3, version: "v2.4.1" }]; }
  async execute(action: CloudAction): Promise<CloudActionResult> { return { accepted: true, provider: this.provider, action: action.type, message: `[demo] ${action.type} accepted for ${action.resourceId}`, timestamp: new Date().toISOString() }; }
  private resourceType() { return { aws: "ecs-service", azure: "aks-deployment", gcp: "cloud-run-service", oci: "oci-container-instance" }[this.provider]; }
}
const adapters: Record<CloudProvider, CloudAdapter> = { aws: new ProviderAdapter("aws"), azure: new ProviderAdapter("azure"), gcp: new ProviderAdapter("gcp"), oci: new ProviderAdapter("oci") };
export const cloudAdapter = (provider: CloudProvider) => adapters[provider];
