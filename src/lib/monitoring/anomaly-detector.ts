export type MetricSample = { latencyMs?: number; errorRate?: number; cpuPercent?: number; memPercent?: number; timestamp: string };
export type Anomaly = { detected: boolean; severity: "P1" | "P2" | "P3" | "P4"; reasons: string[] };
export function detectAnomaly(samples: MetricSample[], thresholds: { latencyMs: number; errorRate: number }): Anomaly {
  const current = samples.at(-1); if (!current) return { detected: false, severity: "P4", reasons: [] };
  const baseline = samples.slice(-31, -1); const average = (key: keyof MetricSample) => baseline.length ? baseline.reduce((sum, item) => sum + (Number(item[key]) || 0), 0) / baseline.length : 0;
  const reasons: string[] = []; const baselineLatency = average("latencyMs");
  if ((current.latencyMs ?? 0) > thresholds.latencyMs || (baselineLatency > 0 && (current.latencyMs ?? 0) > baselineLatency * 3)) reasons.push(`Latency ${current.latencyMs}ms exceeds rolling baseline.`);
  if ((current.errorRate ?? 0) > thresholds.errorRate) reasons.push(`Error rate ${(current.errorRate! * 100).toFixed(2)}% exceeds threshold.`);
  const severity = (current.errorRate ?? 0) > .2 || (current.latencyMs ?? 0) > thresholds.latencyMs * 2 ? "P1" : reasons.length ? "P2" : "P4";
  return { detected: reasons.length > 0, severity, reasons };
}
