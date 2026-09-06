import { useState, useEffect } from "react";
import {
  Briefcase,
  MessageSquare,
  CreditCard,
  UserCheck,
  Globe,
  Search,
  Building2,
  Send,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { scanJob, scanMessage, scanPayment, scanRecruiter, scanUrl } from "../services/scanService";

export default function ScannerForm({ onSubmit, isLoading: parentLoading, initialScanText = "" }) {
  const [activeTab, setActiveTab] = useState("job");
  const [loading, setLoading] = useState(false);

  // Form State per scanner
  const [jobForm, setJobForm] = useState({
    title: "",
    companyName: "",
    description: initialScanText || "",
    salary: "",
    email: "",
    phone: "",
    website: "",
  });

  const [messageForm, setMessageForm] = useState({
    message: initialScanText || "",
    senderEmail: "",
    senderPhone: "",
    platform: "WhatsApp",
  });

  const [paymentForm, setPaymentForm] = useState({
    requestText: initialScanText || "",
    amount: "",
    reason: "",
    method: "Bank Transfer",
    senderInfo: "",
  });

  const [recruiterForm, setRecruiterForm] = useState({
    name: initialScanText || "",
    email: "",
    phone: "",
    company: "",
    profileUrl: "",
  });

  const [urlForm, setUrlForm] = useState({
    url: initialScanText || "",
  });

  useEffect(() => {
    if (initialScanText) {
      if (initialScanText.startsWith("http://") || initialScanText.startsWith("https://")) {
        setActiveTab("url");
        setUrlForm({ url: initialScanText });
      } else {
        setJobForm((prev) => ({ ...prev, description: initialScanText }));
      }
    }
  }, [initialScanText]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (activeTab === "job") {
        res = await scanJob(jobForm);
      } else if (activeTab === "message") {
        res = await scanMessage(messageForm);
      } else if (activeTab === "payment") {
        res = await scanPayment(paymentForm);
      } else if (activeTab === "recruiter") {
        res = await scanRecruiter(recruiterForm);
      } else if (activeTab === "url") {
        res = await scanUrl(urlForm);
      }
      if (onSubmit) {
        onSubmit(activeTab, res);
      }
      toast.success("Analysis Complete!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete scan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "job", label: "Job Offer", icon: Briefcase, desc: "Job Postings & Roles" },
    { id: "message", label: "Message / DM", icon: MessageSquare, desc: "WhatsApp & Telegram" },
    { id: "payment", label: "Payment Demand", icon: CreditCard, desc: "Fees & Deposits" },
    { id: "recruiter", label: "Recruiter Identity", icon: UserCheck, desc: "Emails & Profiles" },
    { id: "url", label: "URL Link", icon: Globe, desc: "Phishing Domains" },
  ];

  const handleAutofillChip = (sampleText, mode = "job") => {
    setActiveTab(mode);
    if (mode === "job") {
      setJobForm({
        title: "Remote Data Specialist",
        companyName: "Global Apex Solutions",
        description: sampleText,
        salary: "$4,200/week",
        email: "hr-apex@gmail.com",
        phone: "+1 555-0182",
        website: "apex-solutions-fake.xyz",
      });
    } else if (mode === "message") {
      setMessageForm((prev) => ({ ...prev, message: sampleText }));
    } else if (mode === "payment") {
      setPaymentForm((prev) => ({ ...prev, requestText: sampleText, amount: "$89" }));
    }
  };

  const isExecuting = loading || parentLoading;

  return (
    <div className="rounded-3xl bg-[#FDFBF7] border border-[#E5DDD4] shadow-md overflow-hidden relative">
      {/* Top Scanner Mode Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-[#E5DDD4] bg-[#F5EFEC] p-2 gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative p-3 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive ? "text-[#2B231F] font-semibold" : "text-[#665A54] hover:bg-[#E5DDD4]/40"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeScannerTab"
                  className="absolute inset-0 rounded-xl bg-[#FDFBF7] border border-[#C86D51]/30 shadow-xs"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${isActive ? "text-[#C86D51]" : "text-[#A3958B]"}`} />
                <span className="font-display font-semibold text-[13px] tracking-tight">
                  {tab.label}
                </span>
              </div>
              <span className="relative z-10 font-sans text-[10px] text-[#665A54] truncate hidden sm:block">
                {tab.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quick Sample Autofill Chips */}
      <div className="px-6 pt-5 flex items-center gap-2 overflow-x-auto">
        <span className="font-sans text-[10px] uppercase tracking-wider text-[#C86D51] flex items-center gap-1 font-bold flex-shrink-0">
          <Sparkles className="w-3 h-3 text-[#C86D51]" /> Sample Scenarios:
        </span>
        {[
          { label: "Suspicious Job Offer", mode: "job", text: "Earn up to $4,200/week working from home. A refundable training fee of $89 is required via Zelle before equipment dispatch." },
          { label: "Fake Delivery Message", mode: "message", text: "URGENT: Your package is held due to unpaid fee $2.99. Click here to confirm payment immediately: verify-pkg-track.info" },
          { label: "Investment Offer", mode: "message", text: "Guaranteed 300% daily returns on crypto trading. Contact account manager on Telegram @crypto_wealth_exec." },
          { label: "Urgent Payment Request", mode: "payment", text: "Required onboarding fee of $89 for laptop shipment deposit." },
        ].map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleAutofillChip(chip.text, chip.mode)}
            className="px-3 py-1 rounded-full border border-[#E5DDD4] bg-[#F5EFEC] hover:border-[#C86D51] font-sans text-[10px] uppercase tracking-wider text-[#665A54] hover:text-[#2B231F] transition-all cursor-pointer whitespace-nowrap"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Form Fields */}
      <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === "job" && (
            <motion.div
              key="job"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#00F5A0] font-bold">
                    Job Title *
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                      placeholder="e.g. Remote Data Entry Specialist"
                      className="w-full pl-10 pr-4 py-2.5 text-[14px] rounded-xl bg-[#080C13] border border-white/10 focus:border-[#00F5A0] text-white outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#00F5A0] font-bold">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={jobForm.companyName}
                      onChange={(e) => setJobForm({ ...jobForm, companyName: e.target.value })}
                      placeholder="e.g. Tech Global Inc."
                      className="w-full pl-10 pr-4 py-2.5 text-[14px] rounded-xl bg-[#080C13] border border-white/10 focus:border-[#00F5A0] text-white outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#00F5A0] font-bold">
                  Job Description & Offer Content *
                </label>
                <textarea
                  required
                  rows="6"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Paste the full job posting description text here..."
                  className="w-full p-4 text-[14px] rounded-xl bg-[#080C13] border border-white/10 focus:border-[#00F5A0] text-white outline-none transition-colors resize-y leading-relaxed font-normal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold">Salary Claimed</label>
                  <input
                    type="text"
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                    placeholder="e.g. $4,000/week"
                    className="w-full px-3.5 py-2 text-[13px] rounded-xl bg-[#080C13] border border-white/10 focus:border-[#00F5A0] text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold">Recruiter Email</label>
                  <input
                    type="email"
                    value={jobForm.email}
                    onChange={(e) => setJobForm({ ...jobForm, email: e.target.value })}
                    placeholder="e.g. hr-tech@gmail.com"
                    className="w-full px-3.5 py-2 text-[13px] rounded-xl bg-[#080C13] border border-white/10 focus:border-[#00F5A0] text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold">Company Website</label>
                  <input
                    type="text"
                    value={jobForm.website}
                    onChange={(e) => setJobForm({ ...jobForm, website: e.target.value })}
                    placeholder="e.g. techglobal.com"
                    className="w-full px-3.5 py-2 text-[13px] rounded-xl bg-[#080C13] border border-white/10 focus:border-[#00F5A0] text-white outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "message" && (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#00F5A0] font-bold">
                  Message Content *
                </label>
                <textarea
                  required
                  rows="6"
                  value={messageForm.message}
                  onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                  placeholder="Paste the SMS, WhatsApp, Telegram, or email message text..."
                  className="w-full p-4 text-[14px] rounded-xl bg-[#080C13] border border-white/10 focus:border-[#00F5A0] text-white outline-none transition-colors resize-y leading-relaxed font-normal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold">Sender Platform</label>
                  <select
                    value={messageForm.platform}
                    onChange={(e) => setMessageForm({ ...messageForm, platform: e.target.value })}
                    className="w-full px-3.5 py-2 text-[13px] rounded-xl bg-[#080C13] border border-white/10 text-white outline-none"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Telegram">Telegram</option>
                    <option value="SMS">SMS / Text</option>
                    <option value="Email">Email</option>
                    <option value="LinkedIn">LinkedIn DM</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold">Sender Email</label>
                  <input
                    type="email"
                    value={messageForm.senderEmail}
                    onChange={(e) => setMessageForm({ ...messageForm, senderEmail: e.target.value })}
                    placeholder="e.g. recruiter@gmail.com"
                    className="w-full px-3.5 py-2 text-[13px] rounded-xl bg-[#080C13] border border-white/10 text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold">Sender Phone</label>
                  <input
                    type="text"
                    value={messageForm.senderPhone}
                    onChange={(e) => setMessageForm({ ...messageForm, senderPhone: e.target.value })}
                    placeholder="e.g. +1 555-0192"
                    className="w-full px-3.5 py-2 text-[13px] rounded-xl bg-[#080C13] border border-white/10 text-white outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#00F5A0] font-bold">
                  Payment Demand Details *
                </label>
                <textarea
                  required
                  rows="5"
                  value={paymentForm.requestText}
                  onChange={(e) => setPaymentForm({ ...paymentForm, requestText: e.target.value })}
                  placeholder="Explain what payment is being requested (e.g., registration fee, training charge, laptop deposit)..."
                  className="w-full p-4 text-[14px] rounded-xl bg-[#080C13] border border-white/10 focus:border-[#00F5A0] text-white outline-none transition-colors resize-y leading-relaxed font-normal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold">Requested Amount</label>
                  <input
                    type="text"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    placeholder="e.g. $89 or ₹2,000"
                    className="w-full px-3.5 py-2 text-[13px] rounded-xl bg-[#080C13] border border-white/10 text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold">Payment Method</label>
                  <select
                    value={paymentForm.method}
                    onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                    className="w-full px-3.5 py-2 text-[13px] rounded-xl bg-[#080C13] border border-white/10 text-white outline-none"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="UPI / GPay">UPI / GPay</option>
                    <option value="Crypto">Crypto (USDT/BTC)</option>
                    <option value="Gift Cards">Gift Cards</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold">Claimed Reason</label>
                  <input
                    type="text"
                    value={paymentForm.reason}
                    onChange={(e) => setPaymentForm({ ...paymentForm, reason: e.target.value })}
                    placeholder="e.g. Refundable onboarding kit"
                    className="w-full px-3.5 py-2 text-[13px] rounded-xl bg-[#080C13] border border-white/10 text-white outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "recruiter" && (
            <motion.div
              key="recruiter"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#00F5A0] font-bold">
                    Recruiter Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={recruiterForm.name}
                    onChange={(e) => setRecruiterForm({ ...recruiterForm, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-4 py-2.5 text-[14px] rounded-xl bg-[#080C13] border border-white/10 text-white outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#00F5A0] font-bold">
                    Recruiter Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={recruiterForm.email}
                    onChange={(e) => setRecruiterForm({ ...recruiterForm, email: e.target.value })}
                    placeholder="e.g. sarah.hiring@gmail.com"
                    className="w-full px-4 py-2.5 text-[14px] rounded-xl bg-[#080C13] border border-white/10 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold">Company Affiliation</label>
                  <input
                    type="text"
                    value={recruiterForm.company}
                    onChange={(e) => setRecruiterForm({ ...recruiterForm, company: e.target.value })}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-3.5 py-2 text-[13px] rounded-xl bg-[#080C13] border border-white/10 text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold">Phone Number</label>
                  <input
                    type="text"
                    value={recruiterForm.phone}
                    onChange={(e) => setRecruiterForm({ ...recruiterForm, phone: e.target.value })}
                    placeholder="e.g. +1 555-0199"
                    className="w-full px-3.5 py-2 text-[13px] rounded-xl bg-[#080C13] border border-white/10 text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold">LinkedIn / Profile URL</label>
                  <input
                    type="text"
                    value={recruiterForm.profileUrl}
                    onChange={(e) => setRecruiterForm({ ...recruiterForm, profileUrl: e.target.value })}
                    placeholder="e.g. linkedin.com/in/sarah"
                    className="w-full px-3.5 py-2 text-[13px] rounded-xl bg-[#080C13] border border-white/10 text-white outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "url" && (
            <motion.div
              key="url"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#00F5A0] font-bold">
                  Suspicious Link or Website URL *
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
                  <input
                    type="url"
                    required
                    value={urlForm.url}
                    onChange={(e) => setUrlForm({ ...urlForm, url: e.target.value })}
                    placeholder="https://verify-account-now.xyz"
                    className="w-full pl-10 pr-4 py-3 text-[14px] rounded-xl bg-[#080C13] border border-white/10 focus:border-[#00F5A0] text-white outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Action CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isExecuting}
            className="w-full font-mono text-[12px] uppercase tracking-widest bg-gradient-to-r from-[#00F5A0] to-[#00D9FF] text-[#05070B] py-4 rounded-xl font-bold hover:shadow-[0_0_25px_rgba(0,245,160,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
          >
            {isExecuting ? (
              <>
                <div className="w-4 h-4 border-2 border-[#05070B] border-t-transparent rounded-full animate-spin" />
                Analyzing with ScamShield...
              </>
            ) : (
              <>
                Analyze with ScamShield <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
