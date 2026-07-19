import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";

export default function QuickstartPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 font-sans p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        <header className="flex items-center gap-4 border-b border-white/5 pb-6">
          <Link href="/docs" className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Terminal size={20} className="text-emerald-400" /> Quickstart Guide
            </h1>
            <p className="text-xs text-zinc-500 mt-1">Get DeployPilotOS running locally in under 3 minutes.</p>
          </div>
        </header>
        
        <div className="prose prose-invert prose-sm max-w-none text-zinc-400 font-sans pb-20">
          <h2 className="text-white text-xl font-bold mb-4 mt-2 border-b border-white/10 pb-2">1. Product Overview & Business Outcomes</h2>
          <p className="mb-4 text-sm leading-relaxed">
            DeployPilotOS is a highly scalable, autonomous AI Site Reliability Engineer (SRE). By combining deterministic infrastructure management with OpenAI's advanced reasoning capabilities, DeployPilotOS aims to revolutionize enterprise DevOps and incident response.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-xl hover:bg-zinc-900 transition-colors">
              <h3 className="text-white font-bold mb-1.5 flex items-center gap-2">🎯 Target ARR / MRR</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Targeting <strong>$5M ARR</strong> within 18 months via Enterprise SaaS licensing ($10k/mo base platform fee + $500/node active monitoring fee). Expected $416k MRR by end of Q4.</p>
            </div>
            <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-xl hover:bg-zinc-900 transition-colors">
              <h3 className="text-white font-bold mb-1.5 flex items-center gap-2">💰 Cost Reduction</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Reduces average MTTR (Mean Time To Resolution) from 45 minutes to under 2 minutes, saving enterprise clients an estimated <strong>$300,000 per hour</strong> of downtime prevented.</p>
            </div>
            <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-xl hover:bg-zinc-900 transition-colors">
              <h3 className="text-white font-bold mb-1.5 flex items-center gap-2">🚀 Market Position</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Positioned to disrupt traditional incident management tools like PagerDuty by executing autonomous remediations rather than just triggering alerts.</p>
            </div>
          </div>

          <h2 className="text-white text-xl font-bold mb-4 mt-8 border-b border-white/10 pb-2">2. Local Installation</h2>
          <p className="mb-3">Clone the repository and install dependencies (Node.js 18.x required):</p>
          <div className="bg-zinc-900/80 border border-white/5 p-4 rounded-lg font-mono text-[11px] text-cyan-400 mb-6 whitespace-pre overflow-x-auto shadow-inner">
{`git clone https://github.com/deploypilot/deploypilot.git
cd deploypilot
npm install
cp .env.example .env.local
# Add OPENAI_API_KEY="sk-..." to .env.local
npm run dev`}
          </div>

          <h2 className="text-white text-xl font-bold mb-4 mt-12 border-b border-white/10 pb-2">3. Cloud Deployment Strategies</h2>
          <p className="mb-6 text-sm leading-relaxed">DeployPilotOS is designed to be cloud-agnostic and container-native. Below are the standard operating procedures for deploying the Mission Control platform across major infrastructure providers.</p>
          
          <div className="space-y-6">
            {/* AWS */}
            <div className="border border-white/5 bg-zinc-900/30 p-6 rounded-xl hover:border-white/10 transition-colors">
              <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2"><span className="text-[#FF9900]">AWS</span> Elastic Kubernetes Service (EKS)</h3>
              <p className="mb-4 text-xs">For AWS, we deploy DeployPilotOS using Helm charts integrated with AWS Secrets Manager.</p>
              <ul className="list-disc ml-5 mb-4 space-y-2 text-xs">
                <li>Create an EKS cluster with managed node groups (t3.xlarge recommended for core services).</li>
                <li>Provision an RDS PostgreSQL instance for persistent state and DynamoDB for high-throughput metric ingestion.</li>
                <li>Deploy the <code className="bg-white/10 px-1.5 py-0.5 rounded text-cyan-400">deploypilot-agent</code> daemonset across all worker nodes to collect low-level cgroup metrics.</li>
              </ul>
              <div className="bg-zinc-950 p-4 rounded-lg font-mono text-[11px] text-zinc-300">
                aws eks update-kubeconfig --name dp-prod --region us-east-1<br/>
                helm upgrade --install deploypilot ./charts/deploypilot -f values.aws.yaml
              </div>
            </div>

            {/* GCP */}
            <div className="border border-white/5 bg-zinc-900/30 p-6 rounded-xl hover:border-white/10 transition-colors">
              <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2"><span className="text-[#4285F4]">GCP</span> Google Kubernetes Engine (GKE)</h3>
              <p className="mb-4 text-xs">GCP deployments leverage GKE Autopilot for zero-ops cluster management and Cloud Spanner for global state synchronization.</p>
              <ul className="list-disc ml-5 mb-4 space-y-2 text-xs">
                <li>Enable Workload Identity to securely bind K8s Service Accounts to GCP IAM roles.</li>
                <li>Configure Pub/Sub topics to pipe raw logs directly into the DeployPilotOS Diagnosis Engine.</li>
              </ul>
              <div className="bg-zinc-950 p-4 rounded-lg font-mono text-[11px] text-zinc-300">
                gcloud container clusters get-credentials dp-prod-gke --region us-central1<br/>
                kubectl apply -k kustomize/overlays/gcp
              </div>
            </div>

            {/* Azure */}
            <div className="border border-white/5 bg-zinc-900/30 p-6 rounded-xl hover:border-white/10 transition-colors">
              <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2"><span className="text-[#00A4EF]">Azure</span> Kubernetes Service (AKS)</h3>
              <p className="mb-4 text-xs">Azure deployments utilize Azure Key Vault for secret rotation and Azure Monitor integration.</p>
              <ul className="list-disc ml-5 space-y-2 text-xs">
                <li>Deploy using Terraform modules available in the <code className="bg-white/10 px-1.5 py-0.5 rounded text-cyan-400">/terraform/azure</code> directory.</li>
                <li>VNet integration is required to allow the DeployPilotOS agent to reach private AKS endpoint APIs safely.</li>
              </ul>
            </div>

            {/* OCI */}
            <div className="border border-white/5 bg-zinc-900/30 p-6 rounded-xl hover:border-white/10 transition-colors">
              <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2"><span className="text-[#C74634]">OCI</span> Oracle Cloud Infrastructure</h3>
              <p className="mb-4 text-xs">For OCI, DeployPilotOS runs on OKE (Oracle Kubernetes Engine) utilizing ARM-based Ampere A1 compute instances for extreme cost efficiency.</p>
              <ul className="list-disc ml-5 space-y-2 text-xs">
                <li>Integrates with OCI Streaming Service (OSS) for Kafka-compatible event ingestion.</li>
                <li>Requires configuring OCI Vault for secure OpenAI API key storage.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
