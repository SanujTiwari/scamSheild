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
    // ScannerForm already called the API — we just receive the response here
    if (response && response.scan) {
      setScanResult(response.scan);
    }
  };

  return (
    <div className="js-root min-h-screen bg-[var(--paper)]">
      {isLoading && <LoadingSpinner message="ScamShield AI is analyzing evidence against threat database..." />}
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Page Title Header */}
        <div className="max-w-2xl mb-8 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-widest border border-[var(--line)] px-2.5 py-1 text-[var(--ink-dim)]">
            Evidence Intake Engine
          </span>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight text-[var(--ink)]">
            Multi-Type Scam Scanner
          </h1>
          <p className="text-[var(--ink-dim)] text-[15px] leading-relaxed">
            Select a scanner category below. ScamShield evaluates submitted details against rule sets, pattern indicators, and AI analysis.
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
          <RiskCard
            scan={scanResult}
            onReset={() => setScanResult(null)}
          />
        )}
      </main>

      <ChatBot />
    </div>
  );
}
