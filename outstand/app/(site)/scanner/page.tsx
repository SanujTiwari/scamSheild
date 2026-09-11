import React from 'react';
import ScannerWidget from '@/components/ui/ScannerWidget';

export default function ScannerPage() {
  return (
    <div style={{ padding: '120px 20px 80px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#c8ff00', letterSpacing: '2px', fontWeight: 'bold' }}>
          AI MULTI-TYPE THREAT AUDIT
        </span>
        <h1 style={{ fontSize: '40px', fontWeight: '800', color: '#ffffff', marginTop: '8px' }}>
          JobShield Threat Scanner
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '600px', margin: '12px auto 0 auto' }}>
          Analyze job listings, recruiter messages, deposit requests, and phishing links in real time with normalized risk scoring.
        </p>
      </div>

      <ScannerWidget />
    </div>
  );
}
