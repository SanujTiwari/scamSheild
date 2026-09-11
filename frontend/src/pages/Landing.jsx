import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Search,
  FileSearch,
  Sparkles,
  Zap,
  Globe,
  Briefcase,
  MessageSquare,
  CreditCard,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Activity,
  Cpu,
  Layers,
  FileCheck2,
  Scan,
} from "lucide-react";

import Navbar from "../components/Navbar";
import ScannerForm from "../components/ScannerForm";
import RiskCard from "../components/RiskCard";

/* Sleek Authentic Live Security Telemetry Console Preview */
function LiveSecurityConsoleVisual() {
  const [activeTab, setActiveTab] = useState("telemetry");

  const demoScans = [
    {
      title: "Remote Data Specialist — Wire Deposit Fee Required",
      type: "Job Posting",
      score: 92,
      time: "Just now",
      signals: ["Refundable equipment fee demanded via Zelle", "Domain registered 3 days ago", "Recruiter email domain mismatch"],
      status: "Threat Blocked",
    },
    {
      title: "Google Senior Tech Lead Opportunity",
      type: "LinkedIn Offer",
      score: 12,
      time: "3 mins ago",
      signals: ["Official google.com hiring portal", "Verified corporate email header", "Standard interview process"],
      status: "Cleared Safe",
    },
    {
      title: "URGENT: Unpaid Customs Fee $2.99",
      type: "SMS Phishing",
      score: 98,
      time: "7 mins ago",
      signals: ["Known spoofed postal tracking gateway", "High-urgency click deadline", "Blacklisted IP subnet"],
      status: "Threat Blocked",
    },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto rounded-2xl bg-[#0B111A] border border-white/10 shadow-2xl overflow-hidden select-none">
      {/* App Window Top Header */}
      <div className="bg-[#080C13] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/80" />
          </div>
          <span className="font-mono text-[10.5px] text-[#94A3B8] ml-2 flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-indigo-400" /> scamshield.ai/live-console
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="font-mono text-[9.5px] text-indigo-400 uppercase tracking-wider font-bold">
            Live Engine Active
          </span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-white/10 bg-[#080C13]/60 px-3 pt-2 gap-2 font-mono text-[10px] uppercase tracking-wider">
        <button
          type="button"
          onClick={() => setActiveTab("telemetry")}
          className={`px-3 py-1.5 rounded-t-lg transition-all cursor-pointer font-semibold ${
            activeTab === "telemetry"
              ? "bg-[#0B111A] border-t border-x border-white/10 text-white"
              : "text-[#94A3B8] hover:text-white"
          }`}
        >
          Live Telemetry
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("intel")}
          className={`px-3 py-1.5 rounded-t-lg transition-all cursor-pointer font-semibold ${
            activeTab === "intel"
              ? "bg-[#0B111A] border-t border-x border-white/10 text-white"
              : "text-[#94A3B8] hover:text-white"
          }`}
        >
          Domain Intel
        </button>
      </div>

      {/* Console Content */}
      <div className="p-5 space-y-4">
        {/* Featured Live Threat Alert */}
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-rose-400" /> Threat Intercepted
              </span>
              <span className="font-mono text-[10px] text-[#94A3B8]">{demoScans[0].time}</span>
            </div>
            <span className="font-mono text-[11px] font-extrabold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-md border border-rose-500/20">
              Risk: {demoScans[0].score}/100
            </span>
          </div>

          <div>
            <h4 className="font-display font-semibold text-[14px] text-white">
              {demoScans[0].title}
            </h4>
            <p className="font-mono text-[10px] text-[#94A3B8] mt-0.5">
              Category: {demoScans[0].type} • Status: {demoScans[0].status}
            </p>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-rose-500/20">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#94A3B8] font-bold block">
              Flagged Risk Signals:
            </span>
            {demoScans[0].signals.map((sig, i) => (
              <div key={i} className="flex items-center gap-2 font-mono text-[11px] text-rose-200">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                <span>{sig}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Stream List */}
        <div className="space-y-2">
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#94A3B8] font-bold block">
            Real-Time Analysis Feed:
          </span>
          {demoScans.slice(1).map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-white/10 bg-[#080C13] flex items-center justify-between text-xs hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full ${item.score > 50 ? "bg-rose-400" : "bg-indigo-400"}`} />
                <div>
                  <p className="font-display font-medium text-white text-[12.5px] truncate max-w-[200px] sm:max-w-[240px]">
                    {item.title}
                  </p>
                  <p className="font-mono text-[9.5px] text-[#94A3B8]">{item.type} • {item.time}</p>
                </div>
              </div>
              <span className={`font-mono text-[9.5px] uppercase font-bold px-2 py-0.5 rounded-md ${
                item.score > 50
                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);

  const scrollToScanner = () => {
    const el = document.getElementById("scanner-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F8FAFC] selection:bg-indigo-500 selection:text-white overflow-x-hidden font-sans">
      {/* Background Continuous Ambient Layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-radial from-indigo-600/15 via-violet-600/5 to-transparent blur-[120px]" />
        <div className="absolute top-[35%] right-0 w-[500px] h-[500px] bg-radial from-violet-600/10 to-transparent blur-[140px]" />
        <div className="absolute top-[65%] left-0 w-[500px] h-[500px] bg-radial from-indigo-600/10 to-transparent blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* 1. HERO SECTION */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-[#080C13] shadow-[0_0_15px_rgba(99,102,241,0.15)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400 font-bold">
                AI-POWERED SCAM PROTECTION
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="space-y-2"
            >
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.08]">
                Think It's a Scam?
              </h1>
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent leading-[1.08]">
                Let ScamShield Check It.
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.16 }}
              className="text-[#94A3B8] text-[16px] sm:text-[17px] leading-relaxed max-w-xl font-normal mx-auto lg:mx-0"
            >
              Analyze suspicious messages, job offers, links, and online content with AI-powered scam detection before you take the risk.
            </motion.p>

            {/* Hero CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.24 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <button
                onClick={scrollToScanner}
                className="w-full sm:w-auto group font-mono text-[11.5px] uppercase tracking-widest bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-7 py-3.5 rounded-xl font-bold hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                Scan for Scam
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <button
                onClick={scrollToHowItWorks}
                className="w-full sm:w-auto font-mono text-[11.5px] uppercase tracking-widest border border-white/10 bg-[#080C13] hover:bg-white/5 text-white px-7 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer font-medium"
              >
                How It Works
              </button>
            </motion.div>
          </div>

          {/* Right Visual Column (Live Security Telemetry Console) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <LiveSecurityConsoleVisual />
          </motion.div>
        </section>

        {/* 2. SCANNER INTERACTION SECTION */}
        <section id="scanner-section" className="py-20 border-y border-white/10 bg-[#080C13]/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="text-center space-y-2.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400 font-bold">
                Instant Threat Assessment
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-white">
                Check Before You Trust.
              </h2>
              <p className="text-[#94A3B8] text-[15px] max-w-xl mx-auto leading-relaxed">
                Analyze suspicious messages, job offers, links, and other content before you take the risk.
              </p>
            </div>

            {/* Embedded Scanner */}
            <ScannerForm
              isLoading={false}
              onSubmit={async (type, res) => {
                setScanResult(res.scan);
              }}
            />

            {/* Animated Result Reveal */}
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="pt-4"
              >
                <RiskCard scan={scanResult} onReset={() => setScanResult(null)} />
              </motion.div>
            )}
          </div>
        </section>

        {/* 3. CAPABILITIES */}
        <section className="py-20 border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="max-w-xl space-y-2.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-violet-400 font-bold">
                Platform Capabilities
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-white">
                Scams Move Fast. Stay Ahead.
              </h2>
              <p className="text-[#94A3B8] text-[15px] leading-relaxed">
                ScamShield analyzes suspicious signals so you can make safer decisions before clicking, paying, or responding.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { title: "AI Risk Analysis", icon: Activity, desc: "Evaluates language patterns, urgency phrasing, and seller reputation." },
                { title: "Instant Detection", icon: Zap, desc: "Provides immediate multi-point risk scores in under two seconds." },
                { title: "Multi-Signal Scanning", icon: Layers, desc: "Cross-checks domain SSL, contact channels, and payment demands." },
                { title: "Safer Decisions", icon: ShieldCheck, desc: "Delivers plain-language threat explanations with action advice." },
              ].map((cap, i) => {
                const Icon = cap.icon;
                return (
                  <motion.div
                    key={i}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 rounded-2xl bg-[#0B111A] border border-white/10 space-y-3 hover:border-indigo-500/40 transition-all shadow-xl"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#080C13] border border-white/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="font-display font-semibold text-[16px] text-white">{cap.title}</h3>
                    <p className="text-[13px] text-[#94A3B8] leading-relaxed">{cap.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. HOW IT WORKS PIPELINE */}
        <section id="how-it-works" className="py-24 border-b border-white/10 bg-[#080C13]/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
            <div className="max-w-xl space-y-2.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400 font-bold">
                System Workflow
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-white">
                How ScamShield Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400 z-0 opacity-40" />

              {[
                { n: "01", title: "Paste or Upload", desc: "Submit suspicious messages, job postings, recruiter DMs, or links." },
                { n: "02", title: "AI Analysis", desc: "Our core engine evaluates heuristics, domain age, and urgency keywords." },
                { n: "03", title: "Threat Detection", desc: "Cross-checks signals against confirmed fraud patterns and payment traps." },
                { n: "04", title: "Risk Decision", desc: "Receive a clear 0–100 Risk Score with explicit safety recommendations." },
              ].map((step, idx) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="space-y-3.5 p-6 rounded-2xl bg-[#0B111A] border border-white/10 relative z-10 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white bg-indigo-600 px-2.5 py-1 rounded-md">
                      {step.n}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#6366f1]" />
                  </div>
                  <h3 className="font-display font-semibold text-[17px] text-white pt-1">{step.title}</h3>
                  <p className="text-[13.5px] text-[#94A3B8] leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CTA SECTION */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-[#0B111A]">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#94A3B8] font-bold">
                Instant Protection
              </span>
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-white">
              Before You Trust It, Scan It.
            </h2>

            <p className="text-[#94A3B8] text-[16.5px] max-w-xl mx-auto leading-relaxed font-normal">
              Give ScamShield a suspicious message, job offer, or link and find out what the signals say.
            </p>

            <button
              onClick={scrollToScanner}
              className="font-mono text-[11.5px] uppercase tracking-widest bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all inline-flex items-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              Start Scanning
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* 6. FOOTER */}
        <footer className="border-t border-white/10 bg-[#080C13] py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 p-[1px]">
                <div className="w-full h-full bg-[#05070B] rounded-[7px] flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                </div>
              </div>
              <span className="font-display font-bold text-[16px] text-white">ScamShield</span>
            </div>

            <p className="font-mono text-[11px] text-[#94A3B8] uppercase tracking-widest">
              AI-powered protection against scams. © 2026 ScamShield.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
