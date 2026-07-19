import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col py-12 px-6 max-w-3xl mx-auto relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-2 mb-12 w-fit relative z-10">
        <ArrowLeft size={16} /> Back to Home
      </Link>
      
      <div className="flex items-center gap-3 mb-10 relative z-10">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
          <Scale size={20} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Terms of Service</h1>
      </div>
      
      <div className="flex flex-col gap-6 text-zinc-400 text-sm leading-relaxed relative z-10">
        <p className="text-zinc-500">Last updated: October 14, 2026</p>
        
        <h2 className="text-xl font-bold text-white mt-4 tracking-tight">1. Acceptance of Terms</h2>
        <p>
          By accessing and utilizing DeployPilotOS's autonomous SRE platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using or accessing this service.
        </p>

        <h2 className="text-xl font-bold text-white mt-4 tracking-tight">2. Autonomous Agent Permissions</h2>
        <p>
          By enabling DeployPilotOS's execution agents, you grant the platform the necessary IAM permissions to restart services, scale infrastructure, and rollback deployments on your behalf. You are responsible for ensuring that the provided IAM roles adhere to the principle of least privilege.
        </p>

        <h2 className="text-xl font-bold text-white mt-4 tracking-tight">3. Service Level Agreement (SLA)</h2>
        <p>
          We guarantee a 99.99% uptime for the DeployPilotOS control plane. However, DeployPilotOS is not liable for infrastructure downtime caused by underlying cloud provider outages, misconfigured user playbooks, or invalid git deployments.
        </p>
      </div>
    </main>
  );
}
