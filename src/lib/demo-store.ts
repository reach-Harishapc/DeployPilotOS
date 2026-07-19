import type { MetricSample } from "./monitoring/anomaly-detector";
export const demoServices = [{ id: "api-service", name: "api-service", environment: "production", provider: "aws", status: "healthy", latencyThreshold: 500, errorRateThreshold: .05 }, { id: "worker-service", name: "worker-service", environment: "production", provider: "gcp", status: "healthy", latencyThreshold: 500, errorRateThreshold: .05 }];
export const metricsByService = new Map<string, MetricSample[]>();
