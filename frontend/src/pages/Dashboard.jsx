import { useState, useEffect, useMemo } from "react";
import {
  ShieldAlert,
  Activity,
  CheckCircle,
  RefreshCcw,
  Plus,
  Briefcase,
  MessageSquare,
  CreditCard,
  UserCheck,
  Globe,
  Trash2,
  Eye,
  FileText,
  AlertTriangle,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import ChatBot from "../components/ChatBot";
import RiskCard from "../components/RiskCard";

import { getScanHistory, deleteScan } from "../services/scanService";
import { getHistory, deleteJob } from "../services/jobService";
import { generateAnalysisPDF } from "../utils/pdfExport";

function Dashboard() {
  const navigate = useNavigate();
  const [scans, setScans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [activeLevel, setActiveLevel] = useState("all");

  // Modal State
  const [selectedScan, setSelectedScan] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let allScans = [];
      try {
        const scanRes = await getScanHistory();
        if (scanRes && scanRes.scans) {
          allScans = scanRes.scans;
        }
      } catch (e) {
        console.error("V2 scan history fetch error:", e);
      }

      if (allScans.length === 0) {
        try {
          const legacyRes = await getHistory();
          if (legacyRes && legacyRes.jobs) {
            allScans = legacyRes.jobs.map((job) => ({
              id: job.id,
              scan_type: "job",
              input_data: { title: job.title, companyName: job.company_name, description: job.description },
              risk_score: job.risk_score,
              risk_level: job.risk_level,
              ai_explanation: job.ai_explanation,
              created_at: job.created_at,
              risk_factors: Array.isArray(job.reasons) ? job.reasons.map(r => ({ category: "Content Risk", reason: r, score: 15, severity: "High" })) : [],
            }));
          }
        } catch (legacyErr) {
          console.error("Legacy history fetch error:", legacyErr);
        }
      }

      setScans(allScans);
    } catch (error) {
      toast.error("Failed to load dashboard history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute Aggregated Statistics from real database scans
  const stats = useMemo(() => {
    const total = scans.length;
    let critical = 0;
    let high = 0;
    let medium = 0;
    let safeLow = 0;

    const distribution = { job: 0, message: 0, payment: 0, recruiter: 0, url: 0 };

    scans.forEach((s) => {
      const level = s.risk_level || s.riskLevel;
      const score = s.risk_score || s.riskScore || 0;
      const type = s.scan_type || s.scanType || "job";

      if (distribution[type] !== undefined) distribution[type]++;

      if (score >= 81 || level === "Critical Risk") critical++;
      else if (score >= 61 || level === "High Risk") high++;
      else if (score >= 41 || level === "Medium Risk") medium++;
      else safeLow++;
    });

    return { total, critical, high, medium, safeLow, distribution };
  }, [scans]);

  // Filtered Scans List
  const filteredScans = useMemo(() => {
    return scans.filter((s) => {
      const type = s.scan_type || s.scanType || "job";
      const level = s.risk_level || s.riskLevel || "";
      const inputStr = JSON.stringify(s.input_data || {}).toLowerCase();

      const matchesSearch = !searchQuery || inputStr.includes(searchQuery.toLowerCase());
      const matchesType = activeType === "all" || type === activeType;
      const matchesLevel =
        activeLevel === "all" ||
        (activeLevel === "critical" && (level === "Critical Risk" || (s.risk_score || 0) >= 81)) ||
        (activeLevel === "high" && level === "High Risk") ||
        (activeLevel === "medium" && level === "Medium Risk") ||
        (activeLevel === "safe" && (level === "Low Risk" || level === "Safe"));

      return matchesSearch && matchesType && matchesLevel;
    });
  }, [scans, searchQuery, activeType, activeLevel]);

  const handleDelete = async (scanId) => {
    if (!window.confirm("Are you sure you want to delete this scan record?")) return;
    try {
      await deleteScan(scanId);
      setScans(scans.filter((s) => s.id !== scanId));
      if (selectedScan && selectedScan.id === scanId) setSelectedScan(null);
      toast.success("Case file deleted");
    } catch (e) {
      try {
        await deleteJob(scanId);
        setScans(scans.filter((s) => s.id !== scanId));
        toast.success("Case file deleted");
      } catch (err) {
        toast.error("Failed to delete scan file");
      }
    }
  };

  const getScanTypeIcon = (type) => {
    if (type === "message") return <MessageSquare className="w-4 h-4 text-[#00D9FF]" />;
    if (type === "payment") return <CreditCard className="w-4 h-4 text-amber-400" />;
    if (type === "recruiter") return <UserCheck className="w-4 h-4 text-violet-400" />;
    if (type === "url") return <Globe className="w-4 h-4 text-indigo-400" />;
    return <Briefcase className="w-4 h-4 text-white" />;
  };

  const getTitle = (scan) => {
    const data = scan.input_data || {};
    if (scan.scan_type === "job") return `${data.title || "Job Scan"} — ${data.companyName || ""}`;
    if (scan.scan_type === "message") return `Message via ${data.platform || "Direct"}`;
    if (scan.scan_type === "payment") return `Payment Demand (${data.amount || "N/A"})`;
    if (scan.scan_type === "recruiter") return `Recruiter: ${data.name || data.email || "Unknown"}`;
    if (scan.scan_type === "url") return `URL: ${data.url || "Link"}`;
    return data.title || "Scam Analysis Case File";
  };

  if (isLoading) return <LoadingSpinner message="Loading Fraud Intelligence Console..." />;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2B231F] selection:bg-[#F4E2D8] selection:text-[#C86D51]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5DDD4] pb-6">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-widest text-[#C86D51] font-bold">
              AI Fraud Intelligence Unit
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[#2B231F] mt-1">
              Case File Dashboard
            </h1>
            <p className="text-[#665A54] text-[14px] mt-1 font-normal">
              Monitor real-time threat telemetry, scan distributions, and historical intake.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="font-sans text-xs uppercase tracking-widest border border-[#E5DDD4] bg-[#FDFBF7] hover:bg-[#F5EFEC] px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer text-[#2B231F] font-medium shadow-xs"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> Refresh
            </button>
            <button
              onClick={() => navigate("/scanner")}
              className="font-sans text-xs uppercase tracking-widest bg-[#C86D51] hover:bg-[#B3583C] text-white px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer font-bold shadow-xs"
            >
              <Plus className="w-4 h-4" /> Execute Scan
            </button>
          </div>
        </div>

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-5 rounded-2xl border border-[#E5DDD4] bg-[#FDFBF7] space-y-2 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#665A54] font-bold">Total Scans</span>
              <Activity className="w-4 h-4 text-[#A3958B]" />
            </div>
            <p className="font-sans text-3xl font-extrabold text-[#2B231F]">{stats.total}</p>
            <p className="text-[12px] text-[#665A54]">Processed across all modules</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="p-5 rounded-2xl border border-[#C86D51]/30 bg-[#F4E2D8]/50 space-y-2 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#C86D51] font-extrabold">Critical Risk</span>
              <ShieldAlert className="w-4 h-4 text-[#C86D51]" />
            </div>
            <p className="font-sans text-3xl font-extrabold text-[#C86D51]">{stats.critical}</p>
            <p className="text-[12px] text-[#B3583C] font-medium">Immediate caution required</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-5 rounded-2xl border border-[#C86D51]/20 bg-[#FDFBF7] space-y-2 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#C86D51] font-extrabold">High Risk</span>
              <AlertTriangle className="w-4 h-4 text-[#C86D51]" />
            </div>
            <p className="font-sans text-3xl font-extrabold text-[#C86D51]">{stats.high}</p>
            <p className="text-[12px] text-[#C86D51] font-medium">High probability scam flags</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="p-5 rounded-2xl border border-[#7B8C7B]/30 bg-[#E2E7E2]/50 space-y-2 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#7B8C7B] font-extrabold">Verified / Safe</span>
              <CheckCircle className="w-4 h-4 text-[#7B8C7B]" />
            </div>
            <p className="font-sans text-3xl font-extrabold text-[#7B8C7B]">{stats.safeLow}</p>
            <p className="text-[12px] text-[#5A6A5A] font-medium">Minimal threat profiles</p>
          </motion.div>
        </div>

        {/* Scam Type Distribution Breakdown */}
        <div className="p-6 rounded-2xl border border-[#E5DDD4] bg-[#FDFBF7] space-y-4 shadow-xs">
          <span className="font-sans text-[10px] uppercase tracking-widest text-[#665A54] block font-bold">
            Scam Type Distribution Breakdown
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { type: "job", label: "Job Scans", count: stats.distribution.job, icon: Briefcase },
              { type: "message", label: "Messages", count: stats.distribution.message, icon: MessageSquare },
              { type: "payment", label: "Payments", count: stats.distribution.payment, icon: CreditCard },
              { type: "recruiter", label: "Recruiters", count: stats.distribution.recruiter, icon: UserCheck },
              { type: "url", label: "URL Links", count: stats.distribution.url, icon: Globe },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.type} className="p-3.5 rounded-xl border border-[#E5DDD4] bg-[#F5EFEC] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#665A54]" />
                    <span className="font-display text-[13px] font-medium text-[#2B231F]">{item.label}</span>
                  </div>
                  <span className="font-sans text-[13px] font-bold text-[#C86D51]">{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#FDFBF7] p-4 rounded-2xl border border-[#E5DDD4] shadow-xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#665A54] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case files by keyword, title, sender, or entity..."
              className="w-full pl-10 pr-4 py-2 text-[13px] rounded-xl bg-[#F5EFEC] border border-[#E5DDD4] focus:border-[#C86D51] text-[#2B231F] outline-none placeholder-[#A3958B]"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={activeType}
              onChange={(e) => setActiveType(e.target.value)}
              className="px-3.5 py-2 rounded-xl font-sans text-xs uppercase tracking-wider bg-[#F5EFEC] border border-[#E5DDD4] text-[#2B231F] outline-none cursor-pointer font-medium"
            >
              <option value="all">All Scanner Types</option>
              <option value="job">Job Scans</option>
              <option value="message">Messages</option>
              <option value="payment">Payments</option>
              <option value="recruiter">Recruiters</option>
              <option value="url">URLs</option>
            </select>

            <select
              value={activeLevel}
              onChange={(e) => setActiveLevel(e.target.value)}
              className="px-3.5 py-2 rounded-xl font-sans text-xs uppercase tracking-wider bg-[#F5EFEC] border border-[#E5DDD4] text-[#2B231F] outline-none cursor-pointer font-medium"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical Risk (81-100)</option>
              <option value="high">High Risk (61-80)</option>
              <option value="medium">Medium Risk (41-60)</option>
              <option value="safe">Safe / Low Risk (0-40)</option>
            </select>
          </div>
        </div>

        {/* Case Files Feed */}
        {filteredScans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredScans.map((scan) => {
              const score = scan.risk_score || scan.riskScore || 0;
              const level = scan.risk_level || scan.riskLevel || "Low Risk";
              const type = scan.scan_type || scan.scanType || "job";

              return (
                <motion.div
                  key={scan.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="p-5 rounded-2xl border border-[#E5DDD4] bg-[#FDFBF7] flex flex-col justify-between space-y-4 hover:border-[#C86D51]/40 transition-all shadow-xs"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getScanTypeIcon(type)}
                        <span className="font-sans text-[10px] uppercase tracking-wider text-[#665A54] border border-[#E5DDD4] px-2 py-0.5 rounded-md bg-[#F5EFEC] font-semibold">
                          {type}
                        </span>
                      </div>
                      <span className="font-sans text-[10px] text-[#665A54]">
                        {new Date(scan.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-display font-semibold text-[16px] text-[#2B231F] line-clamp-1">
                      {getTitle(scan)}
                    </h3>

                    {scan.ai_explanation && (
                      <p className="text-[13px] text-[#665A54] line-clamp-2 leading-relaxed">
                        {scan.ai_explanation}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E5DDD4]">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-[11px] font-bold text-[#2B231F]">Score: {score}/100</span>
                      <span className={`font-sans text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        score >= 81 ? "border-[#C86D51] bg-[#F4E2D8] text-[#C86D51] font-bold" :
                        score >= 61 ? "border-[#C86D51]/60 bg-[#F4E2D8] text-[#C86D51] font-bold" :
                        score >= 41 ? "border-[#D9822B]/60 bg-[#F5EFEC] text-[#D9822B] font-semibold" :
                        "border-[#7B8C7B]/60 bg-[#E2E7E2] text-[#7B8C7B] font-semibold"
                      }`}>
                        {level}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedScan(scan)}
                        className="p-2 rounded-lg border border-[#E5DDD4] hover:bg-[#F5EFEC] text-[#2B231F] transition-colors cursor-pointer"
                        title="View Full Case File"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => generateAnalysisPDF(scan)}
                        className="p-2 rounded-lg border border-[#E5DDD4] hover:bg-[#F5EFEC] text-[#2B231F] transition-colors cursor-pointer"
                        title="Export PDF Report"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(scan.id)}
                        className="p-2 rounded-lg border border-[#E5DDD4] hover:bg-[#F4E2D8] text-[#C86D51] transition-colors cursor-pointer"
                        title="Delete Case File"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 rounded-2xl border border-dashed border-[#E5DDD4] bg-[#FDFBF7] text-center space-y-3">
            <ShieldAlert className="w-10 h-10 text-[#A3958B] mx-auto" />
            <h3 className="font-display font-semibold text-lg text-[#2B231F]">No Case Files Match Filter</h3>
            <p className="text-[13.5px] text-[#665A54] max-w-sm mx-auto">
              No scan records match your active search terms or risk filters. Try clearing your filters or execute a new scan.
            </p>
            <button
              onClick={() => navigate("/scanner")}
              className="font-sans text-xs uppercase tracking-widest bg-[#C86D51] hover:bg-[#B3583C] text-white px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer mt-2 font-bold"
            >
              Start New Scan
            </button>
          </div>
        )}
      </main>

      {/* Selected Scan Modal */}
      <AnimatePresence>
        {selectedScan && (
          <div className="fixed inset-0 z-50 bg-[#2B231F]/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl w-full my-8"
            >
              <RiskCard
                scan={selectedScan}
                onReset={() => setSelectedScan(null)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ChatBot />
    </div>
  );
}

export default Dashboard;