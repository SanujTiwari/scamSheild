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

<<<<<<< HEAD
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
=======
/* Layered Sophisticated AI Scam Detection Core Visual (Organic Terracotta Palette) */
function AIScamDetectionCoreVisual() {
  return (
    <div className="relative w-full max-w-lg xl:max-w-xl aspect-square flex items-center justify-center mx-auto my-4 select-none">
      {/* 1. BACKGROUND LAYER: Warm Terracotta Ambient Glow */}
      <div className="absolute inset-0 bg-radial from-[#C86D51]/15 via-[#F4E2D8]/20 to-transparent blur-[80px] pointer-events-none opacity-90" />

      {/* 2. MID LAYER: Concentric Rings & Radial Grid */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        className="absolute inset-2 rounded-full border border-dashed border-[#E5DDD4] pointer-events-none"
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute inset-12 rounded-full border border-[#E5DDD4]/80 pointer-events-none"
      >
        <div className="absolute -top-1 left-1/2 w-2.5 h-2.5 rounded-full bg-[#C86D51] shadow-xs" />
        <div className="absolute -bottom-1 right-1/4 w-2.5 h-2.5 rounded-full bg-[#7B8C7B] shadow-xs" />
      </motion.div>

      {/* Inner scanning wave pulse */}
      <motion.div
        animate={{ scale: [0.85, 1.12, 0.85], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-24 rounded-full bg-gradient-to-tr from-[#F4E2D8] via-[#F5EFEC] to-transparent border border-[#C86D51]/30 pointer-events-none"
      />

      {/* 3. MAIN LAYER: AI Detection Core */}
      <motion.div
        animate={{ scale: [0.98, 1.03, 0.98] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 rounded-3xl bg-[#FDFBF7] backdrop-blur-xl border border-[#C86D51]/40 shadow-lg flex flex-col items-center justify-center gap-2.5 group cursor-pointer"
      >
        <div className="w-14 h-14 rounded-2xl bg-[#C86D51] p-[1px] shadow-xs">
          <div className="w-full h-full bg-[#FDFBF7] rounded-[15px] flex items-center justify-center">
            <Shield className="w-7 h-7 text-[#C86D51]" strokeWidth={2} />
          </div>
        </div>
        <div className="text-center space-y-0.5">
          <span className="font-sans text-[10px] uppercase tracking-widest text-[#C86D51] font-bold block">
            AI CORE ENGINE
          </span>
          <span className="font-sans text-[9px] text-[#665A54] block">Multi-Signal Active</span>
        </div>
      </motion.div>

      {/* 4. FOREGROUND LAYER: Integrated Signal Panels */}
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-4 left-0 z-20 px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-[#E5DDD4] shadow-md backdrop-blur-md flex items-center gap-2.5"
      >
        <div className="w-2 h-2 rounded-full bg-[#C86D51] animate-ping" />
        <div className="flex flex-col">
          <span className="font-sans text-[9px] uppercase tracking-widest text-[#665A54]">AI Analysis</span>
          <span className="font-sans text-[11px] font-bold text-[#2B231F]">Scanning Patterns...</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [5, -5, 5] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 -right-2 z-20 px-3.5 py-2.5 rounded-xl bg-[#F4E2D8] border border-[#C86D51]/30 shadow-md backdrop-blur-md flex items-center gap-2.5"
      >
        <AlertTriangle className="w-4 h-4 text-[#C86D51]" />
        <div className="flex flex-col">
          <span className="font-sans text-[9px] uppercase tracking-widest text-[#665A54]">Threat Signal</span>
          <span className="font-sans text-[11px] font-bold text-[#C86D51]">Suspicious Urgency</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [-7, 7, -7] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 right-2 z-20 px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#C86D51]/30 shadow-md backdrop-blur-md flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-lg bg-[#F4E2D8] border border-[#C86D51]/30 flex items-center justify-center font-sans text-xs font-bold text-[#C86D51]">
          82
        </div>
        <div className="flex flex-col">
          <span className="font-sans text-[9px] uppercase tracking-widest text-[#665A54]">Risk Score</span>
          <span className="font-sans text-[11px] font-bold text-[#C86D51]">High Risk Flag</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [6, -6, 6] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-4 -left-2 z-20 px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-[#7B8C7B]/30 shadow-md backdrop-blur-md flex items-center gap-2.5"
      >
        <ShieldCheck className="w-4 h-4 text-[#7B8C7B]" />
        <div className="flex flex-col">
          <span className="font-sans text-[9px] uppercase tracking-widest text-[#665A54]">Domain Check</span>
          <span className="font-sans text-[11px] font-bold text-[#7B8C7B]">Verified Safe</span>
        </div>
      </motion.div>
>>>>>>> 57c2efb54ec5d38d75b24d46e7777c2a7ce487d1
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
    <div className="min-h-screen bg-[#FDFBF7] text-[#2B231F] selection:bg-[#F4E2D8] selection:text-[#C86D51] overflow-x-hidden font-sans">
      {/* Background Continuous Ambient Layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-radial from-[#F4E2D8]/50 via-[#F5EFEC]/30 to-transparent blur-[120px]" />
        <div className="absolute top-[35%] right-0 w-[500px] h-[500px] bg-radial from-[#F4E2D8]/40 to-transparent blur-[140px]" />
        <div className="absolute top-[65%] left-0 w-[500px] h-[500px] bg-radial from-[#E2E7E2]/40 to-transparent blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5ddd440_1px,transparent_1px),linear-gradient(to_bottom,#e5ddd440_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
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
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C86D51]/30 bg-[#F5EFEC] shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C86D51]" />
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#C86D51] font-bold">
                AI-POWERED SCAM PROTECTION
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="space-y-2"
            >
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#2B231F] leading-[1.08]">
                Think It's a Scam?
              </h1>
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#C86D51] leading-[1.08]">
                Let ScamShield Check It.
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.16 }}
              className="text-[#665A54] text-[16px] sm:text-[17px] leading-relaxed max-w-xl font-normal mx-auto lg:mx-0"
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
                className="w-full sm:w-auto group font-sans text-xs uppercase tracking-widest bg-[#C86D51] hover:bg-[#B3583C] text-white px-7 py-3.5 rounded-xl font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                Scan for Scam
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <button
                onClick={scrollToHowItWorks}
                className="w-full sm:w-auto font-sans text-xs uppercase tracking-widest border border-[#E5DDD4] bg-[#FDFBF7] hover:bg-[#F5EFEC] text-[#2B231F] px-7 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer font-medium"
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
        <section id="scanner-section" className="py-20 border-y border-[#E5DDD4] bg-[#F5EFEC]/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="text-center space-y-2.5">
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#C86D51] font-bold">
                Instant Threat Assessment
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[#2B231F]">
                Check Before You Trust.
              </h2>
              <p className="text-[#665A54] text-[15px] max-w-xl mx-auto leading-relaxed">
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
        <section className="py-20 border-b border-[#E5DDD4]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="max-w-xl space-y-2.5">
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#7B8C7B] font-bold">
                Platform Capabilities
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[#2B231F]">
                Scams Move Fast. Stay Ahead.
              </h2>
              <p className="text-[#665A54] text-[15px] leading-relaxed">
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
                    className="p-6 rounded-2xl bg-[#FDFBF7] border border-[#E5DDD4] space-y-3 hover:border-[#C86D51]/40 transition-all shadow-xs"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#F5EFEC] border border-[#E5DDD4] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#C86D51]" />
                    </div>
                    <h3 className="font-display font-semibold text-[16px] text-[#2B231F]">{cap.title}</h3>
                    <p className="text-[13px] text-[#665A54] leading-relaxed">{cap.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. HOW IT WORKS PIPELINE */}
        <section id="how-it-works" className="py-24 border-b border-[#E5DDD4] bg-[#F5EFEC]/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
            <div className="max-w-xl space-y-2.5">
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#C86D51] font-bold">
                System Workflow
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[#2B231F]">
                How ScamShield Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-[2px] bg-[#E5DDD4] z-0" />

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
                  className="space-y-3.5 p-6 rounded-2xl bg-[#FDFBF7] border border-[#E5DDD4] relative z-10 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs font-bold text-white bg-[#C86D51] px-2.5 py-1 rounded-md">
                      {step.n}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-[#C86D51]" />
                  </div>
                  <h3 className="font-display font-semibold text-[17px] text-[#2B231F] pt-1">{step.title}</h3>
                  <p className="text-[13.5px] text-[#665A54] leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CTA SECTION */}
        <section className="py-24 relative overflow-hidden bg-[#F4E2D8]/30">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E5DDD4] bg-[#FDFBF7]">
              <ShieldCheck className="w-4 h-4 text-[#C86D51]" />
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#665A54] font-bold">
                Instant Protection
              </span>
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-[#2B231F]">
              Before You Trust It, Scan It.
            </h2>

            <p className="text-[#665A54] text-[16.5px] max-w-xl mx-auto leading-relaxed font-normal">
              Give ScamShield a suspicious message, job offer, or link and find out what the signals say.
            </p>

            <button
              onClick={scrollToScanner}
              className="font-sans text-xs uppercase tracking-widest bg-[#C86D51] hover:bg-[#B3583C] text-white px-8 py-3.5 rounded-xl font-bold transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
            >
              Start Scanning
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* 6. FOOTER */}
        <footer className="border-t border-[#E5DDD4] bg-[#F5EFEC] py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#C86D51] p-[1px]">
                <div className="w-full h-full bg-[#FDFBF7] rounded-[7px] flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-[#C86D51]" />
                </div>
              </div>
              <span className="font-display font-bold text-[16px] text-[#2B231F]">ScamShield</span>
            </div>

            <p className="font-sans text-[11px] text-[#665A54] uppercase tracking-widest">
              AI-powered protection against scams. © 2026 ScamShield.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
