# DeployPilotOS — Autonomous AI DevOps Agent
### OpenAI Build Week 2026 — Developer Tools Track
---

## The Big Idea

**DeployPilotOS** is the world's first **autonomous AI DevOps agent** that monitors your production apps, diagnoses incidents in real time, runs recovery playbooks, and rolls back bad deploys — all without a human needing to lift a finger.

Every dev team has experienced this: 3 AM, production is down, you're staring at a wall of logs trying to figure out what went wrong. DeployPilotOS is the senior SRE engineer that never sleeps. It watches your stack 24/7, understands what "normal" looks like, and when something breaks — it acts.

**This is not a dashboard. This is an agent that DOES things.**

---

## Problem Statement

Production incidents are expensive:
- Average cost of downtime: **$5,600/minute** (Gartner)
- Average time to detect an incident: **207 days** for security breaches
- Average MTTR (Mean Time to Recover): **4.2 hours** for most teams
- On-call engineers are burned out, woken at 3 AM, and spend hours debugging

Current tools (Datadog, PagerDuty, Grafana) send **alerts** — then leave humans to figure out what's wrong. They are reactive dashboards, not intelligent agents.

**DeployPilotOS closes the loop:** detect → diagnose → act → report. Autonomously.

---

## OpenAI APIs Used — Maximum Technical Score

| OpenAI API | How DeployPilotOS Uses It |
|---|---|
| **GPT-5.6 + Function Calling** | Core reasoning engine — reads logs, diagnoses root cause, decides actions |
| **Assistants API** | Persistent agent with memory of your infrastructure and past incidents |
| **Realtime API (WebSockets)** | Voice Incident Commander — talk to DeployPilotOS live during outages |
| **Structured Outputs** | Every agent decision is a guaranteed-valid JSON action plan |
| **GPT-5.6 Streaming** | Live streaming diagnosis narration in the UI |
| **Embeddings API** | Semantic log search + pattern matching across historical incidents |
| **TTS API** | DeployPilotOS reads incident alerts aloud (voice notifications) |
| **Moderation API** | Screens runbook commands before execution for safety |

---

## Core Features

### 1.Real-Time Anomaly Detection
- DeployPilotOS continuously polls your services' metrics via configurable adapters:
  - HTTP health endpoints
  - Response time / latency spikes
  - Error rate (4xx/5xx) thresholds
  - CPU / Memory (from Docker stats API or cloud provider APIs)
  - Custom metrics via webhook push
- Anomaly detection uses a **rolling baseline model**: GPT-5.6 analyzes the last N data points and determines if current behavior is statistically anomalous
- When anomaly detected → **Incident opened automatically**
- Severity scored: `P1 (Critical) | P2 (High) | P3 (Medium) | P4 (Low)`

### 2.Incident Auto-Diagnosis
- When an incident opens, the **GPT-5.6 Diagnosis Agent** activates:
  - Fetches recent logs from the affected service (last 500 lines)
  - Fetches recent deploy history (what changed recently?)
  - Reads error traces / stack traces
  - Correlates with other services (is it upstream/downstream?)
  - Reasons step-by-step (Chain of Thought) to find root cause
- Output: a **human-readable diagnosis card**:
  - Root cause (best hypothesis)
  - Evidence (specific log lines, metrics that support the hypothesis)
  - Confidence score (0-100%)
  - Recommended actions (ordered by likelihood of success)
- Streams in real-time to the UI as the AI thinks

### 3.Autonomous Runbook Execution
- Pre-define runbooks in plain English (e.g., "If the API is slow, restart the web workers")
- DeployPilotOS matches incidents to runbooks using Embeddings (semantic matching)
- Agent executes runbook steps autonomously via **Function Calling**:
  - Restart a service
  - Scale up replicas
  - Clear a cache
  - Rotate secrets
  - Run a database vacuum
  - Flush a queue
  - Call a custom webhook
- Each step is **narrated in the UI**: "Executing step 2: Restarting web-server-01..."
- Each step is **safety-screened** via Moderation API before execution
- Full audit trail of every action taken

### 4.Auto Rollback
- DeployPilotOS tracks every deploy with timestamps and version IDs
- When diagnosis confidence is high (>80%) and root cause is "bad deploy":
  - Proposes rollback with explanation: "Deploy v2.3.1 (pushed 14 minutes ago) introduced a breaking DB migration. Rolling back to v2.3.0."
  - **One-click human confirmation** OR **fully autonomous** (configurable)
  - Executes rollback via configured integration (GitHub Actions trigger, Vercel API, Railway API, Render API, Docker tag swap, Kubernetes rollout undo)
  - Verifies health after rollback (runs health check suite)
  - Marks incident resolved if health restored

### 5.Slack / Notification Integration
- Every incident triggers a rich **Slack notification** written by GPT-5.6:
  - Incident title + severity badge
  - Auto-diagnosis summary (plain English, no jargon)
  - Actions taken so far
  - Current status (Investigating / Mitigating / Resolved)
  - Link to full incident in DeployPilotOS dashboard
- **Incident update messages** sent as AI continues diagnosing
- **Resolution message** with root cause + actions taken + time to resolve
- Also supports: Email, PagerDuty webhook, Discord, Microsoft Teams

### 6.Voice Incident Commander (Realtime API — MOST IMPRESSIVE)
- During a P1/P2 incident, click **"Start War Room"**
- Full-screen voice UI powered by **OpenAI Realtime API**
- Talk to DeployPilotOS like you're on a conference call:
  - *"What's the current status?"*
  - *"What logs are you seeing?"*
  - *"Try restarting the API server"*
  - *"Roll back to the last stable version"*
  - *"What happened to cause this?"*
  - *"Send a status update to Slack"*
- DeployPilotOS responds in natural spoken voice (TTS)
- **Takes real actions** based on voice commands (Function Calling during voice session)
- Full transcript saved to incident timeline
- **This is the demo moment that wins the hackathon**

### 7.Multi-Service Support
- Register unlimited services in the dashboard
- Each service has:
  - Name + environment (production/staging/dev)
  - Health check URL
  - Log source (file path, API, or webhook)
  - Deploy integration
  - Runbook library
  - Alert thresholds (customizable)
- **Service Map View**: Visual graph showing dependencies between services
- Incident correlation: "API-Service is down because DB-Service (its dependency) is down"
- **Global status page** — public-facing status page auto-generated and auto-updated

### BONUS: AI Post-Mortem Generator
- After incident resolves, DeployPilotOS automatically drafts the post-mortem:
  - Timeline of events
  - Root cause analysis
  - What went well / what went wrong
  - Action items to prevent recurrence
- Formatted as Markdown, exportable, editable before sharing

---

## Application Screens — Detailed UI Spec

---

### SCREEN 1: Landing Page (`/`)

**Layout:** Full-screen dark hero

**Visual theme:**
- Deep space black background: `#050510`
- Floating particle grid (like a server network diagram) — animated CSS canvas
- Subtle green "pulse" dots traveling along grid lines (simulating live monitoring)
- Color palette: near-black bg + electric green (`#00FF88`) + electric blue (`#0EA5E9`) + red alert (`#EF4444`)

**Hero Section:**
- Badge: `🟢 Live Monitoring Active` (pulsing green dot)
- Headline: `"Your Production App Just Failed."` — 72px bold, white
- Sub-headline: `"DeployPilotOS diagnosed it in 8 seconds. Rolled back. Done."` — 24px, muted gray
- Primary CTA: `"Connect Your First Service →"` — green gradient button, large
- Secondary CTA: `"Watch Live Demo"` — opens a recorded demo modal

**Live Demo Strip (animated):**
- Auto-playing terminal-style animation showing:
  ```
  [23:47:02] 🔴 P1 INCIDENT DETECTED — api-service latency spike (847ms avg)
  [23:47:03] 🤖 DeployPilotOS: Fetching last 500 log lines...
  [23:47:05] 🤖 DeployPilotOS: Found DB connection pool exhausted (pool_size=10, waiting=47)
  [23:47:06] 🤖 DeployPilotOS: Matched runbook: "DB Connection Pool Exhaustion"
  [23:47:07] ⚙️  Executing: Increase pool_size to 50, restart connection manager
  [23:47:12] ✅ Health check passed. Latency: 43ms. Incident resolved in 10s.
  ```
- Text appears character-by-character (typewriter effect)
- Real-time looking, scary accurate

**Feature Cards Row:**
5 cards in a horizontal scroll:
- 🔴 Detect — animated chart with spike
- 🔬 Diagnose — animated log lines with highlight
- ⚙️ Execute — animated terminal running commands
- 🔄 Rollback — animated version number reverting
- 🎙️ Voice — animated waveform

**Trusted by developers section:**
- Tech stack logos: GitHub, Vercel, Railway, Docker, Kubernetes, AWS

---

### SCREEN 2: Dashboard — Mission Control (`/dashboard`)

**Layout:** Dark "war room" aesthetic — full information density

**Top Status Bar (always visible):**
- Left: DeployPilotOS logo + `"Agent Status: 🟢 All Systems Go"` OR `"🔴 1 Active Incident"`
- Center: Live clock + `"Monitoring 4 services"`
- Right: Profile + Settings gear

**Left Sidebar — Service Navigator:**
- List of registered services with live status dots:
  - `🟢 api-service` — latency: 42ms
  - `🟢 web-frontend` — uptime: 100%
  - `🟡 database-primary` — CPU: 78%
  - `🔴 worker-service` — INCIDENT
- Click service → right panel updates
- `"+ Add Service"` at bottom

**Main Content — Dashboard Grid:**

**Row 1: Active Incidents Panel (full width — shown when incident exists)**
- Red glowing card: `"🔴 P1 INCIDENT — worker-service"`
- Timer: `"Open for 4m 23s"`
- AI Diagnosis progress: `"Analyzing logs... (Step 2/4)"`
- Streaming text area showing AI reasoning in real-time
- Action buttons: `"Take Over"` | `"Start War Room 🎙️"` | `"View Full Incident"`

**Row 2: 4 Stat Widgets**
- `Total Services: 4` (icon: server stack)
- `Incidents Today: 2` — `"1 auto-resolved, 1 open"` (icon: alert)
- `Avg MTTR: 3m 42s` (icon: clock with down-arrow, green)
- `Uptime SLA: 99.97%` — this month (icon: checkmark)

**Row 3: 2-column split**
- Left: `"Service Health Timeline"` — Recharts timeline showing each service's status over 24h (green/yellow/red bands)
- Right: `"Recent Activity"` — chronological list of AI actions with timestamps

**Row 4: 2-column split**
- Left: `"Incident History"` — table with: service | severity | root cause | resolved by | MTTR
- Right: `"AI Insights"` — GPT-generated patterns: `"worker-service has failed 3 times this week, all after deploys between 2-4 PM. Consider staging validation gates."`

---

### SCREEN 3: Service Detail (`/services/[id]`)

**Layout:** 3-column at 25% / 50% / 25%

**Left Column — Service Info Panel:**
- Service name + environment badge (PROD/STAGING/DEV)
- Status indicator (animated: pulsing green or red)
- Stats: Uptime % | Avg Latency | Error Rate | Deploy Count
- `"Run Health Check"` button
- `"Simulate Incident"` button (for demo!)
- Connected integrations: GitHub ✓ | Slack ✓ | Vercel ✓

**Center Column — Metrics Charts:**
- Tab strip: `Latency | Error Rate | CPU | Memory | Custom`
- Recharts LineChart per metric:
  - X-axis: last 1h/6h/24h/7d (toggle)
  - Anomaly regions highlighted in red background
  - Tooltips with exact values + timestamps
- Below charts: **Live Log Stream**:
  - Scrolling terminal-style log view (dark bg, monospace)
  - Color-coded: ERROR (red), WARN (yellow), INFO (white), DEBUG (gray)
  - `"AI Analyze These Logs"` button → GPT summarizes the log stream

**Right Column — Runbooks:**
- List of registered runbooks for this service
- Each runbook: name + trigger description + step count + last used
- `"+ Add Runbook"` button → plain English input
- `"Test Runbook"` button → dry run (shows what WOULD be executed)
- `"Edit Runbook"` → opens step editor

---

### SCREEN 4: Incident Detail (`/incidents/[id]`)

**This is the most important screen. It must feel like a real-time war room.**

**Layout:** Full-width immersive

**Incident Header:**
- Large severity badge: `🔴 P1 CRITICAL` (pulsing red glow)
- Incident title (AI-generated): `"API Timeout Cascade — DB Connection Pool Exhausted"`
- Service + environment + start time + duration timer (counting up)
- Status: `"Investigating → Mitigating → Resolved"` (step indicator)
- Action buttons: `"🎙️ Start War Room"` | `"📋 Create Runbook"` | `"✅ Resolve Manually"`

**2-column layout below header:**

**Left Column (60%): AI Investigation Feed**

This is a live, streaming feed of the AI agent working:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DeployPilotOS Agent — Incident Investigation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[23:47:03] Starting investigation...

[23:47:03] 📥 Fetching logs from api-service (last 500 lines)
           → Retrieved 500 lines (last 8 minutes)

[23:47:04] 🔍 Analyzing log patterns...
           
           I can see a pattern starting at 23:46:51:
           
           ERROR: Connection pool timeout after 30s (x47 occurrences)
           WARN:  Pool utilization at 100% (pool_size=10)
           INFO:  Deploy v2.4.1 completed at 23:46:30
           
           Hypothesis forming: The deploy at 23:46:30 introduced a 
           change that exhausted the connection pool.

[23:47:05] 📋 Checking recent deploy history...
           → v2.4.1 deployed 1m 21s ago
           → Changed files: database/config.py, api/middleware.py
           → Diff shows pool_size reduced from 25 → 10 (REGRESSION)

[23:47:06] 🎯 Root Cause Identified (Confidence: 94%)
           
           Deploy v2.4.1 accidentally reduced connection pool size
           from 25 to 10 in database/config.py (line 47).
           Under normal load, the API requires ~18 connections.
           With pool_size=10, connections queue and timeout.

[23:47:06] 📚 Matching runbook... 
           → Found: "Connection Pool Exhaustion Recovery"
           → Similarity score: 0.94

[23:47:07] ⚙️ Executing Runbook Step 1/3:
           Increasing pool_size to 30 (safe margin above peak load)
           → Running: UPDATE db_config SET pool_size=30...
           → ✅ Done

[23:47:09] ⚙️ Executing Runbook Step 2/3:
           Restarting connection manager to apply config
           → Running: systemctl restart connection-manager
           → ✅ Done

[23:47:11] 🔄 Running health check...
           → API latency: 38ms (was 847ms) ✅
           → Error rate: 0.001% (was 23.4%) ✅
           → Connection pool utilization: 42% ✅

[23:47:12] ✅ INCIDENT RESOLVED — Total time: 9 seconds

           Root cause: Deploy v2.4.1 regression (pool_size 25→10)
           Actions taken: Increased pool_size to 30, restarted manager
           Recommendation: Fix config.py line 47 and redeploy
```

- Text streams in token-by-token (GPT streaming)
- Each step has a small status icon that animates: spinner → ✅ or ❌
- Code/log excerpts shown in monospace with syntax highlighting
- Entire feed is scrollable and searchable

**Right Column (40%): Incident Sidebar**

- **Timeline** (vertical, with timestamps):
  - 23:47:02 — Anomaly detected
  - 23:47:03 — Agent activated
  - 23:47:06 — Root cause identified
  - 23:47:07 — Runbook started
  - 23:47:12 — Resolved
  
- **Evidence Panel**:
  - Log lines that triggered the alert (highlighted)
  - Deploy that caused it (linked to GitHub commit)
  - Metric charts zoomed into incident window

- **Actions Taken** (audit log):
  - Checklist of every command the AI executed
  - Each with: command | status | time | output preview

- **Slack Notifications Sent**:
  - Preview of each Slack message sent during incident
  - Timestamps

- **Post-Mortem (after resolution)**:
  - `"📋 Generate Post-Mortem"` button
  - GPT auto-drafts full post-mortem document
  - Editable before sharing

---

### SCREEN 5: Voice Incident Commander (`/incidents/[id]/voice`)

**Layout:** Full-screen takeover — like a video call interface

**Background:** Very dark, near-black with subtle animated radar-sweep circle

**Center: AI Agent Avatar**
- Large circular avatar with animated state:
  - **Idle:** Slow pulse, soft blue glow, `"DeployPilotOS — Ready"`
  - **Listening:** Bright green ring expanding outward, microphone icon
  - **Speaking:** Waveform bars animating in/out (audio output)
  - **Executing action:** Spinner ring, `"Executing..."` text

**Live Transcript Area** (below avatar):
- Human speech: right-aligned, blue bubble
- AI speech: left-aligned, dark card with gradient border
- Transcript streams in real-time
- Example flow:
  ```
  You: "What's the current status?"
  DeployPilotOS: "We have a P1 incident on api-service. Latency 
                is at 847ms, up from 40ms. I've identified the 
                root cause as a connection pool regression in 
                the latest deploy. I'm currently running the 
                recovery runbook. Step 2 of 3 complete."
  
  You: "How long until resolved?"
  DeployPilotOS: "Estimated 15 seconds. Running the final health 
                check now."
  
  You: "Send a Slack update to the team."
  DeployPilotOS: "Done. I've sent an update to #incidents with 
                current status and ETA."
  ```

**Bottom Controls:**
- Large mic button (center) — tap to toggle
- `"End Session"` button (saves full transcript)
- `"Switch to Text"` button

---

### SCREEN 6: Service Setup Wizard (`/services/new`)

**Multi-step wizard — clean, guided experience**

**Step 1: Service Basics**
- Service name input
- Environment selector (radio pills): `Production | Staging | Development`
- Description (optional)

**Step 2: Health Check**
- Health endpoint URL input
- Check interval (slider: 10s / 30s / 1m / 5m)
- Alert threshold (response time ms + error rate %)
- `"Test Connection"` button → live check with result

**Step 3: Logs**
- Log source selector:
  - `HTTP Webhook (POST logs to DeployPilotOS endpoint)`
  - `File path (if running locally)`
  - `Vercel Logs API`
  - `Railway Logs API`
  - `AWS CloudWatch`
- Setup instructions shown inline per selection
- `"Send Test Log"` button

**Step 4: Deploy Integration**
- Platform selector (card grid with logos):
  - Vercel | Railway | Render | Fly.io | Heroku | GitHub Actions | Docker | Kubernetes | Custom Webhook
- Auth/API key input per platform
- `"Fetch Recent Deploys"` button to verify integration

**Step 5: Runbooks**
- 3 pre-built runbook templates to enable:
  - "High Memory — Restart service"
  - "Slow Response — Scale up replicas"
  - "Error Spike — Roll back last deploy"
- Toggle each on/off
- `"Add Custom Runbook"` → plain English textarea input

**Step 6: Notifications**
- Slack webhook URL input
- Test message button
- Email input
- PagerDuty integration key (optional)

**Completion:**
- Success animation: rocket launching with confetti
- `"Go to Dashboard"` button
- `"Simulate an Incident"` button (great for demo!)

---

### SCREEN 7: Runbook Editor (`/runbooks/[id]`)

**Layout:** Side by side — editor left, preview right

**Left — Editor:**
- Runbook name
- Trigger description (natural language): `"When the API latency exceeds 500ms for more than 2 minutes"`
- Steps list (drag-to-reorder):
  - Each step: action type dropdown + parameters + description
  - Action types:
    - `HTTP Request` (GET/POST to any URL)
    - `Restart Service` (via platform API)
    - `Scale Replicas` (increase/decrease)
    - `Run Command` (shell command via agent)
    - `Send Notification` (Slack/email)
    - `Wait` (N seconds)
    - `Health Check` (verify recovery)
    - `Rollback Deploy` (to previous version)
  - `"+ Add Step"` button
- Safety settings: `"Require human approval before execution"` toggle per step

**Right — Preview:**
- Live preview of what the runbook looks like when executing
- Shows formatted steps as they'd appear in the incident feed
- `"Test Run (Dry Mode)"` button — simulates execution, shows what WOULD happen

---

### SCREEN 8: Status Page (`/status/[org-slug]`)

**Public-facing status page (shareable link)**

**Layout:** Clean, minimal — designed for end users checking if service is down

- Service grid showing current status for all public services
- Uptime percentage badges (30-day rolling)
- Active incident banner (if any) with plain-English explanation
- Incident history (last 90 days)
- Subscribe to updates (email)

---

### SCREEN 9: Settings (`/settings`)

**Sections:**

**General:**
- Organization name + logo
- Timezone
- Default alert thresholds

**AI Configuration:**
- Autonomy level: `"Ask before every action"` → `"Act, then notify"` → `"Fully autonomous"` (slider)
- Runbook confidence threshold (minimum confidence % before auto-executing)
- Rollback: `"Always ask"` / `"Auto-rollback above X% confidence"`

**Integrations:**
- Slack: connected workspace + channel mapping
- Email: SMTP config or send grid
- PagerDuty: API key
- GitHub: OAuth connected
- Platform APIs: Vercel / Railway / Render / etc.

**API Keys:**
- DeployPilotOS API key (for webhook log ingestion)
- Webhook URL for receiving deploy events

---

## Complete File & Folder Architecture

```
DeployPilotOS/
│
├── app/                                        # Next.js 14 App Router
│   ├── layout.tsx                              # Root layout (sidebar + top bar)
│   ├── page.tsx                                # Landing page (/)
│   │
│   ├── dashboard/
│   │   └── page.tsx                            # Mission Control dashboard
│   │
│   ├── services/
│   │   ├── page.tsx                            # Services list
│   │   ├── new/
│   │   │   └── page.tsx                        # New service setup wizard
│   │   └── [id]/
│   │       └── page.tsx                        # Service detail + metrics + logs
│   │
│   ├── incidents/
│   │   ├── page.tsx                            # Incidents list/history
│   │   └── [id]/
│   │       ├── page.tsx                        # Incident detail + AI investigation feed
│   │       └── voice/
│   │           └── page.tsx                    # Voice Incident Commander (Realtime API)
│   │
│   ├── runbooks/
│   │   ├── page.tsx                            # Runbooks library
│   │   ├── new/
│   │   │   └── page.tsx                        # Create runbook
│   │   └── [id]/
│   │       └── page.tsx                        # Runbook editor
│   │
│   ├── status/
│   │   └── [slug]/
│   │       └── page.tsx                        # Public status page
│   │
│   ├── demo/
│   │   └── page.tsx                            # Demo mode (simulates a full incident)
│   │
│   ├── settings/
│   │   └── page.tsx                            # Settings
│   │
│   └── api/                                    # API Routes
│       │
│       ├── agents/
│       │   ├── diagnose/
│       │   │   └── route.ts                    # POST: Start GPT-5.6 diagnosis on incident
│       │   ├── execute-runbook/
│       │   │   └── route.ts                    # POST: Agent executes runbook steps
│       │   └── rollback/
│       │       └── route.ts                    # POST: Agent initiates rollback
│       │
│       ├── services/
│       │   ├── route.ts                        # GET: list | POST: create service
│       │   ├── [id]/
│       │   │   ├── route.ts                    # GET | PUT | DELETE service
│       │   │   ├── health/
│       │   │   │   └── route.ts                # POST: Run health check
│       │   │   ├── metrics/
│       │   │   │   └── route.ts                # GET: Fetch metrics for service
│       │   │   └── logs/
│       │   │       └── route.ts                # GET: Fetch recent logs
│       │   └── [id]/ingest-logs/
│       │       └── route.ts                    # POST: Webhook endpoint — receive logs from service
│       │
│       ├── incidents/
│       │   ├── route.ts                        # GET: list | POST: create/open incident
│       │   ├── [id]/
│       │   │   ├── route.ts                    # GET | PUT incident
│       │   │   ├── resolve/
│       │   │   │   └── route.ts                # POST: Resolve incident
│       │   │   ├── postmortem/
│       │   │   │   └── route.ts                # POST: Generate post-mortem via GPT
│       │   │   └── timeline/
│       │   │       └── route.ts                # GET: Incident event timeline
│       │   └── detect/
│       │       └── route.ts                    # POST: Called by monitoring loop — check for anomalies
│       │
│       ├── runbooks/
│       │   ├── route.ts                        # GET | POST
│       │   ├── [id]/
│       │   │   └── route.ts                    # GET | PUT | DELETE
│       │   └── match/
│       │       └── route.ts                    # POST: Find best runbook for incident (Embeddings)
│       │
│       ├── deploys/
│       │   └── route.ts                        # POST: Receive deploy webhook events
│       │
│       ├── voice/
│       │   └── session/
│       │       └── route.ts                    # POST: Create Realtime API ephemeral session token
│       │
│       ├── notifications/
│       │   ├── slack/
│       │   │   └── route.ts                    # POST: Send Slack message via GPT-written content
│       │   └── email/
│       │       └── route.ts                    # POST: Send email notification
│       │
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts                    # NextAuth
│
│
├── components/
│   │
│   ├── layout/
│   │   ├── Sidebar.tsx                         # Left nav: services list + main nav
│   │   ├── TopBar.tsx                          # Global status bar + clock + alerts
│   │   ├── GlobalAlertBanner.tsx               # Red banner when P1 incident active
│   │   └── MobileNav.tsx                       # Mobile bottom nav
│   │
│   ├── landing/
│   │   ├── Hero.tsx                            # Main hero with terminal animation
│   │   ├── TerminalDemo.tsx                    # Typewriter terminal animation
│   │   ├── FeatureStrip.tsx                    # 5 feature cards
│   │   └── IntegrationLogos.tsx                # GitHub/Vercel/Docker/etc logos
│   │
│   ├── dashboard/
│   │   ├── ServiceSidebar.tsx                  # Left sidebar with live service status
│   │   ├── ActiveIncidentBanner.tsx            # Top priority — full-width incident card
│   │   ├── StatCards.tsx                       # 4 stat metric cards
│   │   ├── ServiceHealthTimeline.tsx           # Recharts timeline of service statuses
│   │   ├── ActivityFeed.tsx                    # Chronological AI action list
│   │   ├── IncidentHistoryTable.tsx            # Past incidents table
│   │   └── AIInsightsPanel.tsx                 # GPT-generated pattern insights
│   │
│   ├── services/
│   │   ├── ServiceCard.tsx                     # Service list card with status dot
│   │   ├── ServiceStatusBadge.tsx              # 🟢🟡🔴 status indicator
│   │   ├── MetricsChart.tsx                    # Recharts line chart with anomaly regions
│   │   ├── LiveLogStream.tsx                   # Real-time scrolling log viewer
│   │   ├── RunbookList.tsx                     # Service runbooks panel
│   │   └── setup/
│   │       ├── WizardContainer.tsx             # Multi-step wizard controller
│   │       ├── Step1Basics.tsx
│   │       ├── Step2HealthCheck.tsx
│   │       ├── Step3Logs.tsx
│   │       ├── Step4Deploys.tsx
│   │       ├── Step5Runbooks.tsx
│   │       └── Step6Notifications.tsx
│   │
│   ├── incidents/
│   │   ├── IncidentBadge.tsx                   # P1/P2/P3/P4 severity badge
│   │   ├── IncidentCard.tsx                    # Incident list card
│   │   ├── AIInvestigationFeed.tsx             # THE MAIN COMPONENT — streaming AI reasoning
│   │   ├── InvestigationStep.tsx               # Individual step in the investigation feed
│   │   ├── EvidencePanel.tsx                   # Log lines + metrics evidence sidebar
│   │   ├── ActionAuditLog.tsx                  # Every action taken by AI, with status
│   │   ├── IncidentTimeline.tsx                # Vertical event timeline
│   │   ├── RunbookExecutionTracker.tsx         # Step-by-step runbook progress UI
│   │   ├── SlackMessagePreview.tsx             # Preview of Slack notifications sent
│   │   ├── PostMortemPanel.tsx                 # AI-generated post-mortem editor
│   │   └── IncidentStatusStepper.tsx           # Investigating→Mitigating→Resolved
│   │
│   ├── voice/
│   │   ├── VoiceCommanderModal.tsx             # Full-screen Realtime API voice UI
│   │   ├── AgentAvatar.tsx                     # Animated avatar (idle/listening/speaking)
│   │   ├── WaveformVisualizer.tsx              # Audio waveform animation
│   │   ├── LiveTranscript.tsx                  # Real-time speech transcript
│   │   └── VoiceActionIndicator.tsx            # "Executing: Restarting service..."
│   │
│   ├── runbooks/
│   │   ├── RunbookCard.tsx                     # Runbook library card
│   │   ├── RunbookEditor.tsx                   # Step-by-step editor
│   │   ├── RunbookStep.tsx                     # Individual runbook step editor
│   │   ├── RunbookPreview.tsx                  # Preview pane
│   │   └── StepActionSelector.tsx             # Action type dropdown
│   │
│   └── ui/
│       ├── Button.tsx                          # Primary/Secondary/Danger/Ghost variants
│       ├── Card.tsx                            # Glass dark card
│       ├── Badge.tsx                           # Severity + status badges
│       ├── Modal.tsx                           # Framer Motion modal
│       ├── Drawer.tsx                          # Right slide-in drawer
│       ├── Terminal.tsx                        # Styled terminal output component
│       ├── StatusDot.tsx                       # Animated green/yellow/red status dot
│       ├── Skeleton.tsx                        # Loading skeleton
│       ├── StreamingText.tsx                   # Token-by-token streaming text display
│       ├── Tooltip.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Toggle.tsx
│       ├── ProgressBar.tsx
│       ├── EmptyState.tsx
│       └── CodeBlock.tsx                       # Syntax-highlighted code/log display
│
│
├── lib/
│   ├── openai/
│   │   ├── client.ts                           # OpenAI SDK client singleton
│   │   ├── diagnose.ts                         # GPT-5.6 incident diagnosis (streaming)
│   │   ├── postmortem.ts                       # GPT-5.6 post-mortem generation
│   │   ├── slack-writer.ts                     # GPT writes Slack incident messages
│   │   ├── runbook-matcher.ts                  # Embeddings-based runbook matching
│   │   ├── embeddings.ts                       # Generate + compare embeddings
│   │   ├── realtime-session.ts                 # Realtime API session token creation
│   │   ├── tts.ts                              # TTS for voice notifications
│   │   ├── moderation.ts                       # Screen runbook commands for safety
│   │   └── assistants.ts                       # Assistants API for persistent memory
│   │
│   ├── prompts/
│   │   ├── diagnosis.ts                        # System prompt: incident root cause analysis
│   │   ├── postmortem.ts                       # System prompt: post-mortem generation
│   │   ├── slack-message.ts                    # System prompt: Slack notification writer
│   │   ├── insights.ts                         # System prompt: pattern insights
│   │   ├── voice-commander.ts                  # System prompt: Realtime API voice agent
│   │   └── function-tools.ts                   # All function calling tool definitions
│   │
│   ├── integrations/
│   │   ├── slack.ts                            # Slack Webhook API client
│   │   ├── vercel.ts                           # Vercel API: deploys + rollback
│   │   ├── railway.ts                          # Railway API: deploys + restart
│   │   ├── render.ts                           # Render API: deploys + rollback
│   │   ├── github.ts                           # GitHub API: commit info, deploy status
│   │   ├── docker.ts                           # Docker API: container restart + scale
│   │   └── health-checker.ts                   # HTTP health check poller
│   │
│   ├── monitoring/
│   │   ├── anomaly-detector.ts                 # Rolling baseline anomaly detection
│   │   ├── incident-manager.ts                 # Open/update/close incidents
│   │   ├── runbook-executor.ts                 # Execute runbook steps safely
│   │   └── monitoring-loop.ts                  # Background polling loop (setInterval)
│   │
│   ├── db/
│   │   ├── prisma.ts                           # Prisma client singleton
│   │   ├── services.ts                         # Service CRUD
│   │   ├── incidents.ts                        # Incident CRUD
│   │   ├── runbooks.ts                         # Runbook CRUD + embedding storage
│   │   └── metrics.ts                          # Metrics storage and retrieval
│   │
│   └── utils/
│       ├── date.ts                             # Date formatting
│       ├── severity.ts                         # Severity scoring helpers
│       ├── log-parser.ts                       # Parse different log formats
│       └── context-builder.ts                  # Build incident context for GPT
│
│
├── hooks/
│   ├── useIncidentFeed.ts                      # SSE/WebSocket for live incident updates
│   ├── useStreamingDiagnosis.ts                # Stream GPT diagnosis tokens to UI
│   ├── useRealtimeVoice.ts                     # Realtime API WebSocket voice hook
│   ├── useHealthPoller.ts                      # Client-side service health polling
│   ├── useServices.ts                          # SWR services data fetching
│   ├── useIncidents.ts                         # SWR incidents data fetching
│   └── useMetrics.ts                           # SWR metrics data fetching
│
│
├── types/
│   ├── index.ts                                # Main types
│   ├── incidents.ts                            # Incident-related types
│   ├── services.ts                             # Service-related types
│   └── runbooks.ts                             # Runbook types
│
│
├── prisma/
│   ├── schema.prisma                           # Database schema
│   └── seed.ts                                 # Demo data (pre-seeded incident + service)
│
│
├── styles/
│   └── globals.css                             # CSS variables + base styles + animations
│
├── public/
│   ├── logo.svg
│   └── icons/
│
├── .env.local
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

##  Database Schema (Prisma — SQLite)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Organization {
  id          String      @id @default(cuid())
  name        String
  slug        String      @unique        // for public status page URL
  autonomy    String      @default("notify")  // ask | notify | full
  rollbackConfidence Float @default(0.8)
  assistantId String?     // OpenAI Assistants API ID
  createdAt   DateTime    @default(now())
  users       User[]
  services    Service[]
}

model User {
  id              String        @id @default(cuid())
  email           String        @unique
  name            String?
  organizationId  String
  organization    Organization  @relation(fields: [organizationId], references: [id])
  createdAt       DateTime      @default(now())
}

model Service {
  id              String        @id @default(cuid())
  orgId           String
  organization    Organization  @relation(fields: [orgId], references: [id])
  name            String
  description     String?
  environment     String        @default("production")  // production | staging | development
  healthUrl       String?       // Health check endpoint
  checkInterval   Int           @default(30)            // seconds
  latencyThreshold Int          @default(500)           // ms
  errorRateThreshold Float      @default(0.05)          // 5%
  status          String        @default("healthy")     // healthy | degraded | down | unknown
  uptimePercent   Float         @default(100.0)
  avgLatency      Float?
  currentErrorRate Float?
  logWebhookToken String        @unique @default(cuid())  // Token for log ingestion endpoint
  slackWebhook    String?
  notifyEmails    String?       // JSON array of emails
  platforms       String?       // JSON: { vercel: {...}, railway: {...}, ... }
  isPublic        Boolean       @default(false)         // Show on public status page
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  incidents       Incident[]
  metrics         Metric[]
  deploys         Deploy[]
  runbooks        Runbook[]
  logs            LogEntry[]
}

model Incident {
  id              String        @id @default(cuid())
  serviceId       String
  service         Service       @relation(fields: [serviceId], references: [id])
  title           String        // AI-generated title
  severity        String        @default("P2")          // P1 | P2 | P3 | P4
  status          String        @default("open")        // open | investigating | mitigating | resolved
  rootCause       String?       // GPT-identified root cause
  rootCauseConfidence Float?    // 0.0 - 1.0
  triggerMetric   String?       // What metric triggered the alert
  triggerValue    String?       // The value that triggered it
  diagnosis       String?       // Full GPT diagnosis JSON
  runbookId       String?       // Which runbook was used
  actionsLog      String?       // JSON array of actions taken
  resolvedBy      String?       // "agent" | "human"
  mttr            Int?          // Seconds to resolve
  postMortem      String?       // AI-generated post-mortem markdown
  voiceTranscript String?       // Voice session transcript
  openedAt        DateTime      @default(now())
  resolvedAt      DateTime?
  updatedAt       DateTime      @updatedAt
  events          IncidentEvent[]
}

model IncidentEvent {
  id          String      @id @default(cuid())
  incidentId  String
  incident    Incident    @relation(fields: [incidentId], references: [id])
  type        String      // detected | agent_started | hypothesis | action | health_check | resolved | notification | human_comment
  content     String      // Human-readable description
  data        String?     // JSON additional data
  actor       String      @default("agent")  // "agent" | "human"
  timestamp   DateTime    @default(now())
}

model Runbook {
  id          String      @id @default(cuid())
  serviceId   String
  service     Service     @relation(fields: [serviceId], references: [id])
  name        String
  description String      // Natural language trigger description
  steps       String      // JSON array of step objects
  embedding   String?     // JSON float[] for semantic matching
  lastUsed    DateTime?
  useCount    Int         @default(0)
  isEnabled   Boolean     @default(true)
  requireApproval Boolean @default(false)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Metric {
  id          String      @id @default(cuid())
  serviceId   String
  service     Service     @relation(fields: [serviceId], references: [id])
  timestamp   DateTime    @default(now())
  latencyMs   Float?
  errorRate   Float?
  cpuPercent  Float?
  memPercent  Float?
  requestCount Int?
  customMetrics String?   // JSON for any additional metrics
}

model Deploy {
  id          String      @id @default(cuid())
  serviceId   String
  service     Service     @relation(fields: [serviceId], references: [id])
  version     String
  commitSha   String?
  commitMsg   String?
  author      String?
  platform    String?     // vercel | railway | github-actions | etc
  status      String      @default("success")  // pending | success | failed | rolled-back
  deployedAt  DateTime    @default(now())
  rollbackOf  String?     // ID of deploy that this rolls back
}

model LogEntry {
  id          String      @id @default(cuid())
  serviceId   String
  service     Service     @relation(fields: [serviceId], references: [id])
  level       String      @default("INFO")  // ERROR | WARN | INFO | DEBUG
  message     String
  source      String?
  metadata    String?     // JSON additional fields
  timestamp   DateTime    @default(now())
}
```

---

## GPT Agent Design — The Brain

### Diagnosis Agent Prompt
```typescript
// lib/prompts/diagnosis.ts
export const DIAGNOSIS_SYSTEM_PROMPT = `
You are DeployPilotOS, an elite Site Reliability Engineer AI agent.
You have been activated to diagnose a production incident.

You think step-by-step, like a real senior engineer investigating an outage.
You are methodical, specific, and data-driven. You reference exact log lines, 
exact timestamps, and exact metrics.

You ALWAYS:
1. State what you're doing before you do it
2. Show the evidence you're examining
3. Form a clear hypothesis with confidence level
4. Recommend specific actions ordered by likelihood of success

You NEVER:
- Give vague answers
- Blame unknown causes without evidence
- Recommend actions without explaining why

SERVICE CONTEXT:
{serviceContext}

RECENT DEPLOY HISTORY:
{deployHistory}

CURRENT METRICS:
{currentMetrics}

RECENT LOGS (last 500 lines):
{recentLogs}

BASELINE (normal behavior):
{baseline}

Diagnose this incident. Think out loud. Be specific. Be fast.
`;
```

### Function Calling Tools (Agent Capabilities)
```typescript
// lib/prompts/function-tools.ts
export const AGENT_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'fetch_logs',
      description: 'Fetch recent logs from the service for analysis',
      parameters: {
        type: 'object',
        properties: {
          serviceId: { type: 'string' },
          lines: { type: 'number', description: 'Number of log lines to fetch (max 1000)' },
          level: { type: 'string', enum: ['ERROR', 'WARN', 'INFO', 'DEBUG', 'ALL'] }
        },
        required: ['serviceId']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_recent_deploys',
      description: 'Get the deploy history for a service to check for recent changes',
      parameters: {
        type: 'object',
        properties: {
          serviceId: { type: 'string' },
          hours: { type: 'number', description: 'Look back this many hours (default 24)' }
        },
        required: ['serviceId']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'restart_service',
      description: 'Restart the service via its configured platform integration',
      parameters: {
        type: 'object',
        properties: {
          serviceId: { type: 'string' },
          reason: { type: 'string', description: 'Human-readable reason for restart' }
        },
        required: ['serviceId', 'reason']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'rollback_deploy',
      description: 'Roll back to the previous stable deploy version',
      parameters: {
        type: 'object',
        properties: {
          serviceId: { type: 'string' },
          targetVersion: { type: 'string', description: 'Version to roll back to' },
          reason: { type: 'string' }
        },
        required: ['serviceId', 'reason']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'run_health_check',
      description: 'Run the health check endpoint and return the result',
      parameters: {
        type: 'object',
        properties: {
          serviceId: { type: 'string' }
        },
        required: ['serviceId']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'scale_service',
      description: 'Scale the service up or down (increase/decrease replicas)',
      parameters: {
        type: 'object',
        properties: {
          serviceId: { type: 'string' },
          replicas: { type: 'number', description: 'Target number of replicas' },
          reason: { type: 'string' }
        },
        required: ['serviceId', 'replicas', 'reason']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'send_slack_notification',
      description: 'Send an incident status update to Slack',
      parameters: {
        type: 'object',
        properties: {
          serviceId: { type: 'string' },
          message: { type: 'string', description: 'The message content' },
          severity: { type: 'string', enum: ['P1', 'P2', 'P3', 'P4'] }
        },
        required: ['serviceId', 'message']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'call_webhook',
      description: 'Call a custom HTTP webhook (e.g., clear cache, flush queue)',
      parameters: {
        type: 'object',
        properties: {
          url: { type: 'string' },
          method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'DELETE'] },
          body: { type: 'object' },
          reason: { type: 'string' }
        },
        required: ['url', 'method', 'reason']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'resolve_incident',
      description: 'Mark the incident as resolved after confirming service recovery',
      parameters: {
        type: 'object',
        properties: {
          incidentId: { type: 'string' },
          summary: { type: 'string', description: 'Summary of what was done and why it worked' }
        },
        required: ['incidentId', 'summary']
      }
    }
  }
];
```

### Realtime API Voice Commander Prompt
```typescript
// lib/prompts/voice-commander.ts
export const VOICE_COMMANDER_PROMPT = `
You are DeployPilotOS, an AI SRE agent responding in a live incident war room.

You are speaking directly to a developer who needs rapid, clear information 
and decisive action. You speak in short, confident sentences. No filler. 
No unnecessary caveats. Like a senior engineer on a call.

Current incident context:
{incidentContext}

You have full access to all diagnostic tools and can take real actions.
When asked to take an action (restart, rollback, notify), do it immediately 
and confirm when done.

Keep responses under 3 sentences unless more detail is explicitly requested.
Use specific numbers and timestamps when possible.
`;
```

---

## 🎨 Design System

### Color Palette — DevOps War Room Aesthetic
```css
:root {
  /* Backgrounds — deep dark, like a server room at night */
  --bg-base:       #050510;   /* Deepest background */
  --bg-surface:    #0A0A18;   /* Page background */
  --bg-elevated:   #0F0F22;   /* Card background */
  --bg-overlay:    #15152E;   /* Modal background */

  /* Borders */
  --border-subtle:  rgba(255,255,255,0.05);
  --border-default: rgba(255,255,255,0.08);
  --border-strong:  rgba(255,255,255,0.12);

  /* Status Colors */
  --green-400:  #4ADE80;
  --green-500:  #22C55E;
  --green-glow: rgba(74,222,128,0.25);

  --yellow-400: #FACC15;
  --yellow-500: #EAB308;
  --yellow-glow: rgba(250,204,21,0.25);

  --red-400:    #F87171;
  --red-500:    #EF4444;
  --red-glow:   rgba(239,68,68,0.25);
  --red-deep:   rgba(239,68,68,0.08);

  /* Brand */
  --blue-400:   #60A5FA;
  --blue-500:   #3B82F6;
  --blue-600:   #2563EB;
  --cyan-400:   #22D3EE;
  --cyan-500:   #06B6D4;

  /* Text */
  --text-primary:   #F0F0F8;
  --text-secondary: #9090A8;
  --text-muted:     #606075;
  --text-code:      #A5F3FC;    /* Light cyan for log/code text */

  /* Gradients */
  --gradient-brand:   linear-gradient(135deg, #2563EB 0%, #06B6D4 100%);
  --gradient-danger:  linear-gradient(135deg, #EF4444 0%, #F97316 100%);
  --gradient-success: linear-gradient(135deg, #22C55E 0%, #06B6D4 100%);

  /* Glassmorphism */
  --glass-bg:     rgba(255,255,255,0.03);
  --glass-border: rgba(255,255,255,0.07);
  --glass-blur:   blur(24px);

  /* Special: terminal font */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
  --font-sans: 'Inter', -apple-system, sans-serif;
}

/* Pulsing status dot */
@keyframes statusPulse {
  0%   { box-shadow: 0 0 0 0 rgba(74,222,128,0.6); }
  70%  { box-shadow: 0 0 0 8px rgba(74,222,128,0); }
  100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); }
}

.status-dot-green { 
  background: var(--green-400);
  border-radius: 50%;
  animation: statusPulse 2s infinite;
}

/* Red alert pulse (more urgent) */
@keyframes alertPulse {
  0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.8); }
  70%  { box-shadow: 0 0 0 12px rgba(239,68,68,0); }
  100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
}

.status-dot-red {
  background: var(--red-400);
  border-radius: 50%;
  animation: alertPulse 1s infinite;
}

/* Radar sweep (voice UI background) */
@keyframes radarSweep {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Terminal text appear */
@keyframes typeIn {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}

.terminal-line {
  animation: typeIn 0.15s ease-out forwards;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.7;
}
```

---

##  Environment Variables

```bash
# .env.local

# ── OpenAI ──────────────────────────────────────
OPENAI_API_KEY=sk-...

# ── Database ─────────────────────────────────────
DATABASE_URL="file:./dev.db"

# ── Auth ─────────────────────────────────────────
NEXTAUTH_SECRET=your-32-char-secret
NEXTAUTH_URL=http://localhost:3000

# ── Integrations (optional — skip for demo) ──────
SLACK_DEFAULT_WEBHOOK=https://hooks.slack.com/...
VERCEL_TOKEN=...
RAILWAY_TOKEN=...
GITHUB_TOKEN=...

# ── App ───────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=DeployPilotOS

# ── Demo Mode ─────────────────────────────────────
DEMO_MODE=true       # Enables simulated metrics (no real services needed)
```

---

##  Setup Instructions

```bash
# 1. Clone and install
git clone https://github.com/yourusername/DeployPilotOS.git
cd DeployPilotOS && npm install

# 2. Add only your OpenAI API key
echo "OPENAI_API_KEY=sk-..." >> .env.local

# 3. Setup DB and run
npx prisma generate && npx prisma db push && npx prisma db seed && npm run dev
```

**Then open: `http://localhost:3000/demo`**

The demo mode pre-loads:
- 2 registered services (api-service + worker-service)
- 14 days of historical metrics
- 1 active P1 incident (in progress)
- 3 pre-built runbooks
- Full incident history with post-mortems

**Demo button:** `"Simulate Incident"` on any service triggers a fake incident and you watch the full AI diagnosis + auto-resolution flow live.

---

## Package Dependencies

```json
{
  "dependencies": {
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "openai": "^4.52.0",
    "@prisma/client": "^5.16.0",
    "next-auth": "^4.24.7",
    "framer-motion": "^11.3.2",
    "recharts": "^2.12.7",
    "tailwindcss": "^3.4.6",
    "ai": "^3.3.0",
    "swr": "^2.2.5",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.4.0",
    "date-fns": "^3.6.0",
    "lucide-react": "^0.417.0",
    "react-hot-toast": "^2.4.1",
    "zod": "^3.23.8",
    "axios": "^1.7.2",
    "react-textarea-autosize": "^8.5.3",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-tooltip": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.0"
  },
  "devDependencies": {
    "typescript": "^5.5.3",
    "@types/react": "^18.3.3",
    "@types/node": "^20.14.10",
    "prisma": "^5.16.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.40"
  }
}
```

---


---

*DeployPilotOS — Built for OpenAI Build Week 2026*  
*Track: Developer Tools | The AI SRE That Never Sleeps*  
*Powered by: GPT-5.6 · Realtime API · Function Calling · Embeddings · Assistants API · TTS · Structured Outputs · Moderation API*
