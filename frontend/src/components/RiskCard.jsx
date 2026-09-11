import { ShieldAlert, CheckCircle2, Info, Lightbulb, ArrowUpRight, Flag, Sparkles, AlertTriangle, Globe, Database, Cpu, ExternalLink, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function RiskCard({ scan, onReset }) {
  const navigate = useNavigate();
  if (!scan) return null;

  const score = scan.risk_score !== undefined ? scan.risk_score : scan.riskScore || 0;
  const level = scan.risk_level || scan.riskLevel || "Low Risk";
  const factors = scan.risk_factors || scan.riskFactors || [];
  const recommendations = scan.recommendations || [];
  const explanation = scan.ai_explanation || scan.aiExplanation || "";
  const confidence = scan.confidence;
  const sources = scan.sources || [];
  const scoreBreakdown = scan.scoreBreakdown;
  const threatIntelligence = scan.threatIntelligence;

  const getLevelBadgeClass = (l, s) => {
    if (s >= 81 || l === "Critical Risk") return "bg-rose-500/10 text-rose-400 border-rose-500/40 font-bold shadow-[0_0_15px_rgba(244,63,94,0.2)]";
    if (s >= 61 || l === "High Risk") return "bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold";
    if (s >= 41 || l === "Medium Risk") return "bg-amber-500/10 text-amber-400 border-amber-500/30 font-semibold";
    if (s >= 21 || l === "Low Risk") return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30 font-medium";
    return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30 font-semibold shadow-[0_0_15px_rgba(99,102,241,0.2)]";
  };

  const getSeverityBadgeClass = (severity) => {
    if (severity === "Critical" || severity === "High") return "bg-rose-500/20 text-rose-300 font-bold";
    if (severity === "Medium") return "bg-amber-500/20 text-amber-300 font-semibold";
    return "bg-white/10 text-[#94A3B8] font-medium";
  };

  const getSourceIcon = (source) => {
    if (source.includes("Google")) return <Globe className="w-3 h-3" />;
    if (source.includes("VirusTotal")) return <Database className="w-3 h-3" />;
    if (source.includes("WHOIS") || source.includes("RDAP")) return <ExternalLink className="w-3 h-3" />;
    if (source.includes("AI") || source.includes("Gemini")) return <Sparkles className="w-3 h-3" />;
    return <Cpu className="w-3 h-3" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-[#0B111A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-6"
    >
      {/* Header Banner */}
      <div className="p-6 sm:p-8 border-b border-white/10 bg-[#080C13]/80">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Circular Score Gauge & Verdict */}
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="7" className="text-white/10" />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  strokeWidth="7"
                  stroke={score >= 81 ? "#F43F5E" : score >= 61 ? "#F43F5E" : score >= 41 ? "#F59E0B" : "#6366F1"}
                  strokeDasharray="314.15"
                  initial={{ strokeDashoffset: 314.15 }}
                  animate={{ strokeDashoffset: 314.15 - (score / 100) * 314.15 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-3xl font-extrabold text-white tracking-tight">{score}</span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#94A3B8]">/ 100</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border ${getLevelBadgeClass(level, score)}`}>
                  {level}
                </span>
                {confidence !== undefined && confidence !== null && (
                  <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10 bg-[#05070B] text-[#94A3B8] font-semibold">
                    {Math.round(confidence * 100)}% Confidence
                  </span>
                )}
              </div>
              <h2 className="font-display font-bold text-2xl tracking-tight text-white">
                {score >= 61 ? "High Risk Scam Detected" : score >= 41 ? "Suspicious Activity Flagged" : "Verified Low Risk Profile"}
              </h2>
              <p className="text-[13px] text-[#94A3B8] leading-relaxed max-w-md">
                Calculated from multi-signal analysis combining rule-based detection, AI inspection, and external threat intelligence.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => {
                const reportText = `[ScamShield Threat Audit]\nVerdict: ${level} (Risk Score: ${score}/100)\nRisk Signals: ${factors.map(f => f.reason || f).join("; ")}\nRecommendations: ${recommendations.join("; ")}`;
                navigator.clipboard.writeText(reportText);
                toast.success("Audit Report copied to clipboard!");
              }}
              className="font-mono text-[11px] uppercase tracking-widest bg-[#05070B] border border-white/10 text-white px-3.5 py-2.5 rounded-xl hover:border-indigo-500/50 hover:text-indigo-400 transition-all cursor-pointer font-semibold flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Report
            </button>

            {onReset && (
              <button
                onClick={onReset}
                className="font-mono text-[11px] uppercase tracking-widest bg-[#05070B] border border-white/10 text-white px-3.5 py-2.5 rounded-xl hover:border-white/20 transition-all cursor-pointer font-medium"
              >
                Analyze Another
              </button>
            )}
            <button
              onClick={() => navigate("/dashboard")}
              className="font-mono text-[11px] uppercase tracking-widest bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2.5 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              Dashboard <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Analysis Sources Badges */}
        {sources.length > 0 && (
          <div className="mt-5 flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#94A3B8] font-bold">Analysis Sources:</span>
            {sources.map((source, i) => (
              <span
                key={i}
                className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/10 bg-[#05070B] text-white/70 font-medium flex items-center gap-1.5"
              >
                {getSourceIcon(source)} {source}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* AI Explanation Banner */}
      {explanation && (
        <div className="px-6 sm:px-8 py-5 border-b border-white/10 bg-[#080C13]/40 flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-[#05070B] border border-white/10 flex-shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-[13.5px] leading-relaxed text-white">
            <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400 block mb-1 font-bold">
              ScamShield AI Explanation Summary
            </span>
            {explanation}
          </div>
        </div>
      )}

      {/* Score Breakdown */}
      {scoreBreakdown && (scoreBreakdown.aiScore !== null || scoreBreakdown.intelScore !== null) && (
        <div className="px-6 sm:px-8 py-4 border-b border-white/10 bg-[#080C13]/20">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#94A3B8] font-bold block mb-3">
            Score Breakdown
          </span>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-[#05070B]">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-mono text-[11px] text-white font-semibold">
                Rules: {scoreBreakdown.ruleScore}/100
              </span>
              <span className="font-mono text-[9px] text-[#94A3B8]">
                ({Math.round(scoreBreakdown.ruleWeight * 100)}%)
              </span>
            </div>
            {scoreBreakdown.aiScore !== null && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-[#05070B]">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span className="font-mono text-[11px] text-white font-semibold">
                  AI: {scoreBreakdown.aiScore}/100
                </span>
                <span className="font-mono text-[9px] text-[#94A3B8]">
                  ({Math.round(scoreBreakdown.aiWeight * 100)}%)
                </span>
              </div>
            )}
            {scoreBreakdown.intelScore !== null && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-[#05070B]">
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-[11px] text-white font-semibold">
                  Intel: {scoreBreakdown.intelScore}/100
                </span>
                <span className="font-mono text-[9px] text-[#94A3B8]">
                  ({Math.round(scoreBreakdown.intelWeight * 100)}%)
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Threat Intelligence Section */}
      {threatIntelligence && threatIntelligence.findings && threatIntelligence.findings.length > 0 && (
        <div className="px-6 sm:px-8 py-5 border-b border-white/10 bg-[#080C13]/30">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 font-bold">
              External Threat Intelligence
            </span>
            <span className="font-mono text-[9px] text-[#94A3B8] uppercase tracking-wider">
              Domain: {threatIntelligence.domain}
            </span>
          </div>
          <div className="space-y-2">
            {threatIntelligence.findings.map((finding, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-white/10 bg-[#05070B]">
                <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5 ${getSeverityBadgeClass(finding.severity)}`}>
                  {finding.severity}
                </span>
                <div className="flex-1">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#94A3B8] font-semibold block mb-0.5">
                    {finding.source}
                  </span>
                  <p className="text-[12.5px] text-white leading-snug">{finding.finding}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Risk Factors & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
        {/* Left: Risk Factors */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-[16px] tracking-tight flex items-center gap-2 text-white">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Detected Risk Signals ({factors.length})
            </h3>
            <span className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold">
              Signal Breakdown
            </span>
          </div>

          {factors.length > 0 ? (
            <div className="space-y-3 pt-1">
              {factors.map((factor, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-white/10 bg-[#080C13] flex items-start justify-between gap-4 transition-all hover:border-white/20"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#94A3B8] font-semibold border border-white/10 px-2 py-0.5 rounded-md bg-[#05070B]">
                        {factor.category || "General"}
                      </span>
                      <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md ${getSeverityBadgeClass(factor.severity)}`}>
                        {factor.severity || "Flag"}
                      </span>
                    </div>
                    <p className="text-[13.5px] font-medium text-white leading-snug">
                      {factor.reason || factor.description || factor}
                    </p>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 flex-shrink-0">
                    +{factor.score || 15} pts
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-xl border border-dashed border-white/10 text-center text-[#94A3B8] text-[13.5px] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-indigo-400 mx-auto" />
              <p className="font-medium text-white">No High-Risk Red Flags Detected</p>
              <p className="text-xs text-[#94A3B8]">This opportunity passed all heuristic, AI, and threat intelligence checks.</p>
            </div>
          )}
        </div>

        {/* Right: Actionable Recommendations */}
        <div className="lg:col-span-5 p-6 sm:p-8 space-y-4 bg-[#080C13]/30">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-[16px] tracking-tight flex items-center gap-2 text-white">
              <Lightbulb className="w-4 h-4 text-violet-400" />
              Actionable Recommendations
            </h3>
            <span className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold">
              Advice
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl border border-white/10 bg-[#0B111A]">
                <span className="font-mono text-[10px] font-bold text-indigo-400 bg-[#05070B] w-5 h-5 rounded-md flex items-center justify-center border border-white/10 flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-[13px] text-white leading-relaxed font-normal">{rec}</p>
              </div>
            ))}
          </div>

          {/* Report Button */}
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={() => navigate("/report-scam", { state: { scan } })}
              className="w-full font-mono text-[11px] uppercase tracking-widest border border-rose-500/30 text-rose-400 bg-rose-500/10 hover:border-rose-500 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer font-semibold shadow-xs"
            >
              <Flag className="w-3.5 h-3.5" /> Report Flagged Opportunity
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
