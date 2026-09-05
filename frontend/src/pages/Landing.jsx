import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  Activity,
  Cpu,
  Layers,
  FileCheck2,
  Scan,
} from "lucide-react";

import Navbar from "../components/Navbar";
import ScannerForm from "../components/ScannerForm";
import RiskCard from "../components/RiskCard";

/* Layered Sophisticated AI Scam Detection Core Visual */
function AIScamDetectionCoreVisual() {
  return (
    <div className="relative w-full max-w-lg xl:max-w-xl aspect-square flex items-center justify-center mx-auto my-4 select-none">
      {/* 1. BACKGROUND LAYER: Large Ambient Soft Glow */}
      <div className="absolute inset-0 bg-radial from-indigo-600/20 via-violet-600/10 to-transparent blur-[80px] pointer-events-none opacity-80" />

      {/* 2. MID LAYER: Concentric Rings & Radial Grid */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        className="absolute inset-2 rounded-full border border-dashed border-white/10 pointer-events-none"
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute inset-12 rounded-full border border-white/[0.08] pointer-events-none"
      >
        <div className="absolute -top-1 left-1/2 w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_12px_#6366f1]" />
        <div className="absolute -bottom-1 right-1/4 w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_12px_#8b5cf6]" />
      </motion.div>

      {/* Inner scanning wave pulse */}
      <motion.div
        animate={{ scale: [0.85, 1.12, 0.85], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-24 rounded-full bg-gradient-to-tr from-indigo-500/10 via-violet-500/5 to-transparent border border-indigo-500/20 pointer-events-none"
      />

      {/* 3. MAIN LAYER: AI Detection Core */}
      <motion.div
        animate={{ scale: [0.98, 1.03, 0.98] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 rounded-3xl bg-[#0B111A]/90 backdrop-blur-xl border border-indigo-500/40 shadow-[0_0_50px_rgba(99,102,241,0.25)] flex flex-col items-center justify-center gap-2.5 group cursor-pointer"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 p-[1px] shadow-[0_0_20px_rgba(99,102,241,0.4)]">
          <div className="w-full h-full bg-[#05070B] rounded-[15px] flex items-center justify-center">
            <Shield className="w-7 h-7 text-indigo-400" strokeWidth={2} />
          </div>
        </div>
        <div className="text-center space-y-0.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400 font-bold block">
            AI CORE ENGINE
          </span>
          <span className="font-mono text-[9px] text-[#94A3B8] block">Multi-Signal Active</span>
        </div>
      </motion.div>

      {/* 4. FOREGROUND LAYER: Integrated Signal Panels */}
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-4 left-0 z-20 px-3.5 py-2 rounded-xl bg-[#0B111A]/90 border border-white/10 shadow-2xl backdrop-blur-md flex items-center gap-2.5"
      >
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
        <div className="flex flex-col">
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#94A3B8]">AI Analysis</span>
          <span className="font-mono text-[11px] font-bold text-white">Scanning Patterns...</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [5, -5, 5] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 -right-2 z-20 px-3.5 py-2.5 rounded-xl bg-[#0B111A]/90 border border-rose-500/30 shadow-2xl backdrop-blur-md flex items-center gap-2.5"
      >
        <AlertTriangle className="w-4 h-4 text-rose-400" />
        <div className="flex flex-col">
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#94A3B8]">Threat Signal</span>
          <span className="font-mono text-[11px] font-bold text-rose-400">Suspicious Urgency</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [-7, 7, -7] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 right-2 z-20 px-4 py-2.5 rounded-xl bg-[#0B111A]/90 border border-violet-500/30 shadow-2xl backdrop-blur-md flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-lg bg-[#05070B] border border-violet-500/30 flex items-center justify-center font-mono text-xs font-bold text-violet-400">
          82
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#94A3B8]">Risk Score</span>
          <span className="font-mono text-[11px] font-bold text-violet-400">High Risk Flag</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [6, -6, 6] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-4 -left-2 z-20 px-3.5 py-2 rounded-xl bg-[#0B111A]/90 border border-indigo-500/30 shadow-2xl backdrop-blur-md flex items-center gap-2.5"
      >
        <ShieldCheck className="w-4 h-4 text-indigo-400" />
        <div className="flex flex-col">
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#94A3B8]">Domain Check</span>
          <span className="font-mono text-[11px] font-bold text-indigo-400">Verified Safe</span>
        </div>
      </motion.div>
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

          {/* Right Visual Core Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <AIScamDetectionCoreVisual />
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
