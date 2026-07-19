# DeployPilotOS: Autonomous AI DevOps Agent
**Category:** Developer Tools  
**OpenAI Build Week 2026**

DeployPilotOS is an autonomous System Reliability Engineering (SRE) agent that monitors your production apps, diagnoses incidents in real-time, and runs recovery playbooks—without human intervention. 

Instead of waking up at 3 AM to stare at a wall of logs, DeployPilotOS acts as the ultimate on-call engineer: detecting anomalies, diagnosing the root cause using **GPT-5.6**, and executing automated YAML runbooks to mitigate downtime in seconds.

---

## Zero-Setup Simulated Sandbox Environment

We have built a **zero-setup simulated Sandbox environment** directly into the application so judges can experience a live 3 AM production outage resolution without needing to connect real Kubernetes clusters or AWS credentials!

### Local Setup Instructions
To run the project locally, you only need Node.js installed.

```bash
# 1. Clone the repository
git clone https://github.com/reach-Harishapc/DeployPilotOS.git
cd DeployPilotOS

# 2. Install dependencies
npm install

# 3. Start the application
npm run dev
```

### Running the Demo Instance
1. Open your browser to [http://localhost:3000](http://localhost:3000).
2. Click **Connect Your First Service** or navigate to the **Dashboard**.
3. In the Dashboard, click the **Simulate Incident (Zap Icon)** button in the top right.
4. **Watch the autonomous agent in action:**
   - **Detection:** It instantly flags `api-service` dropping to a P1 critical state.
   - **Diagnosis:** It fetches logs and streams a live GPT-5.6 investigation (Watch the "AI Insights" panel pulse and stream new insights in real-time!).
   - **Resolution:** It matches the root cause to a "DB Connection Pool" runbook and auto-resolves the outage in 9 seconds.
   - **Reporting:** Click into the active Incident to view the timeline and export the auto-generated PDF Post-Mortem.

---

## How We Used Codex & GPT-5.6

This project was conceived and built specifically to showcase the reasoning power of the latest OpenAI models in enterprise environments.

### Where Codex Accelerated Our Workflow
Codex acted as our lead frontend and architecture engineer. We used Codex to rapidly scaffold a complex, state-heavy Next.js application in mere hours. 
- **Complex UI Generation:** Codex generated the entire glassmorphic dark-mode dashboard, custom SVG logo rendering, and real-time pulsing CSS effects.
- **Architectural Decisions:** When we encountered Hydration Mismatch errors due to browser extensions, Codex instantly identified the issue and implemented `suppressHydrationWarning` at the Next.js root layout.
- **Data Simulation:** Codex wrote the complex `setInterval` math and React Hooks to simulate live, realistic-looking telemetry graphs and streaming log analysis without requiring a real backend.

### How GPT-5.6 Powers the Agent
While traditional developer AI tools are just "chatbots that write code," DeployPilotOS stretches the limits of GPT-5.6 as an **autonomous execution engine**. 

1. **Structured Outputs:** When telemetry spikes, the incident payload (recent logs and git commit diffs) is fed to GPT-5.6, enforcing a strict JSON schema that outputs a deterministic `rootCause` and `confidenceScore`.
2. **Embeddings (Semantic Matching):** The agent takes the AI-generated root cause and uses semantic embeddings to instantly match it to the closest YAML runbook (e.g., matching a log mentioning "pool exhausted" to the "DB Connection Pool Exhaustion" runbook).
3. **Realtime Voice API:** We designed the system architecture to deeply integrate with OpenAI's Realtime WebSocket API, allowing operators to enter a hands-free "Voice War Room" to verbally command the infrastructure during critical outages.

---

## Supported Platforms
- **Control Plane:** Next.js 14, React, TailwindCSS. (Can be run anywhere Node is supported).
- **Target Integrations (Architected for):** Kubernetes, AWS EKS, Datadog, PagerDuty, Slack, Vercel.

## License
MIT License.
