import { useState } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import ScannerForm from "../components/ScannerForm";
import RiskCard from "../components/RiskCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ChatBot from "../components/ChatBot";

export default function Scanner() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const initialScanText = location.state?.initialScan || "";

  const handleScanSubmit = (scanType, response) => {
    if (response && response.scan) {
      setScanResult(response.scan);
    }
  };

  return (
    <div className="js-root min-h-screen bg-[#05070B] text-[#F8FAFC]">
      {isLoading && <LoadingSpinner message="ScamShield AI is analyzing evidence against threat database..." />}
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Page Title Header */}
        <div className="max-w-2xl mb-8 space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 text-indigo-400 rounded-full font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              Real-Time Verification Engine Active
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-white">
            Multi-Type Threat & Fraud Sandbox
          </h1>
          <p className="text-[#94A3B8] text-[15px] leading-relaxed">
            Submit job offers, suspicious messages, payment demands, recruiter details, or URLs for real-time tri-engine fraud analysis.
          </p>
        </div>

        {/* Scanner Form */}
        <ScannerForm
          onSubmit={handleScanSubmit}
          isLoading={isLoading}
          initialScanText={initialScanText}
        />

        {/* Explainable Results Section */}
        {scanResult && (
          <div className="mt-10 animate-fade-in">
            <RiskCard
              scan={scanResult}
              onReset={() => setScanResult(null)}
            />
          </div>
        )}
      </main>

      <ChatBot />
    </div>
  );
}
