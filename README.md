# DeployPilotOS

DeployPilotOS is an autonomous AI DevOps agent demo: it detects production anomalies, investigates logs and deploys, recommends recovery actions, and demonstrates a complete auto-resolution flow.

## Run the judge demo

```bash
npm install
npm run db:generate
npm run dev
```

Open [http://localhost:3000/demo](http://localhost:3000/demo), then click **Simulate incident**. The P1 incident opens, the investigation narrates its evidence, and the recovery auto-resolves in roughly nine seconds.

Demo mode is enabled by default (`DEMO_MODE=true` in `.env`) and needs no service accounts or API key.

## AI diagnosis engine

`POST /api/diagnose` returns a strict structured diagnosis: root cause, confidence, evidence, ordered actions, and investigation narration. In demo mode it uses the seeded deterministic incident; when `DEMO_MODE=false` and `OPENAI_API_KEY` is set, it calls the OpenAI Responses API with JSON Schema structured output.

Configuration is documented in [`.env.example`](.env.example). The default model is configurable with `OPENAI_MODEL`.

## Persistence

The complete SQLite Prisma schema is in [`prisma/schema.prisma`](prisma/schema.prisma), covering organizations, users, services, incidents and events, runbooks, metrics, deploys, and logs. Run `npm run db:push` to create the local database after generating the client.

## Cloud control plane

DeployPilotOS has a provider-neutral execution boundary for **AWS, Azure, Google Cloud, and Oracle Cloud Infrastructure (OCI)**. Cloud credentials are represented only by a secret-manager reference; raw credentials are never stored in the database. The normalized `CloudAccount` and `CloudResource` models keep multi-cloud services queryable and scalable.

| Capability | API | Notes |
| --- | --- | --- |
| Service registry | `GET/POST /api/services` | Multi-service inventory with provider validation |
| Cloud discovery | `GET /api/cloud/resources?provider=aws|azure|gcp|oci` | Maps providers to ECS, AKS, Cloud Run, or OCI resources |
| Anomaly detection | `POST /api/monitoring/detect` | Rolling baseline plus latency and error-rate thresholds |
| Recovery execution | `POST /api/runbooks/execute` | Restart, scale, rollback, and health-check actions gated by autonomy policy |
| Platform health | `GET /api/health` | Liveness endpoint for cloud load balancers |

In demo mode the adapters return safe simulated cloud results. Production adapters should receive workload identity / IAM role references via `CloudAccount.credentialRef`, rather than access keys in environment variables.
