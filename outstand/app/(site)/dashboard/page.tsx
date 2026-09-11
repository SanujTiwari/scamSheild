'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ScanItem {
  id: string;
  type: string;
  title: string;
  score: number;
  level: string;
  date: string;
  explanation: string;
}

export default function DashboardPage() {
  const [scans, setScans] = useState<ScanItem[]>([
    {
      id: 'scan-1',
      type: 'job',
      title: 'Remote Data Specialist — Global Apex',
      score: 92,
      level: 'Critical Risk',
      date: '2026-09-10',
      explanation: 'Refundable equipment fee demanded via Zelle before interview.',
    },
    {
      id: 'scan-2',
      type: 'recruiter',
      title: 'Recruiter: Sarah Jenkins (Gmail domain)',
      score: 74,
      level: 'High Risk',
      date: '2026-09-09',
      explanation: 'Free email address mismatching corporate company name.',
    },
    {
      id: 'scan-3',
      type: 'payment',
      title: 'Onboarding Fee Demand ($89)',
      score: 88,
      level: 'Critical Risk',
      date: '2026-09-08',
      explanation: 'Unusual advance deposit request for home office setup.',
    },
    {
      id: 'scan-4',
      type: 'url',
      title: 'URL: verify-account-security-update.xyz',
      score: 95,
      level: 'Critical Risk',
      date: '2026-09-07',
      explanation: 'Known spoofed domain with low-cost TLD.',
    },
    {
      id: 'scan-5',
      type: 'job',
      title: 'Senior Software Engineer — Google',
      score: 12,
      level: 'Cleared Safe',
      date: '2026-09-05',
      explanation: 'Verified corporate domain & standard hiring process.',
    },
  ]);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filtered = scans.filter((s) => {
    const matchesType = filterType === 'all' || s.type === filterType;
    const matchesSearch = !search || s.title.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalScans = scans.length;
  const criticalCount = scans.filter((s) => s.score >= 80).length;
  const highCount = scans.filter((s) => s.score >= 60 && s.score < 80).length;
  const safeCount = scans.filter((s) => s.score < 60).length;

  return (
    <div style={{ padding: '120px 20px 80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '24px', marginBottom: '32px' }}>
        <div>
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#c8ff00', letterSpacing: '2px', fontWeight: 'bold' }}>
            AI FRAUD INTELLIGENCE UNIT
          </span>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#ffffff', margin: '4px 0 0 0' }}>
            Case File Dashboard
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>
            Monitor real-time threat telemetry, scan distributions, and historical intake.
          </p>
        </div>
        <Link
          href="/scanner"
          style={{
            background: '#c8ff00',
            color: '#0d0e12',
            fontFamily: 'monospace',
            fontWeight: '800',
            fontSize: '13px',
            padding: '12px 24px',
            borderRadius: '12px',
            textDecoration: 'none',
            textTransform: 'uppercase',
            boxShadow: '0 0 20px rgba(200,255,0,0.3)',
          }}
        >
          + Execute New Scan
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: '#0b111a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '24px' }} data-border="true">
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Total Scans</span>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#ffffff', marginTop: '8px' }}>{totalScans}</div>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Processed across all engines</span>
        </div>

        <div style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '20px', padding: '24px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#fb7185', textTransform: 'uppercase', fontWeight: 'bold' }}>Critical Risk</span>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#fb7185', marginTop: '8px' }}>{criticalCount}</div>
          <span style={{ fontSize: '12px', color: '#fb7185' }}>Immediate caution required</span>
        </div>

        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '20px', padding: '24px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#fbbf24', textTransform: 'uppercase', fontWeight: 'bold' }}>High Risk</span>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#fbbf24', marginTop: '8px' }}>{highCount}</div>
          <span style={{ fontSize: '12px', color: '#fbbf24' }}>High probability scam flags</span>
        </div>

        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '20px', padding: '24px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#34d399', textTransform: 'uppercase', fontWeight: 'bold' }}>Verified / Safe</span>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#34d399', marginTop: '8px' }}>{safeCount}</div>
          <span style={{ fontSize: '12px', color: '#34d399' }}>Minimal threat profiles</span>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div style={{ background: '#0b111a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px 24px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', marginBottom: '24px' }} data-border="true">
        <input
          type="text"
          placeholder="Search case files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ background: '#080c13', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 16px', color: '#fff', fontSize: '14px', flex: 1, minWidth: '220px', outline: 'none' }}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ background: '#080c13', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 16px', color: '#fff', fontFamily: 'monospace', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
        >
          <option value="all">ALL MODULE TYPES</option>
          <option value="job">JOB SCANS</option>
          <option value="message">MESSAGES</option>
          <option value="payment">PAYMENTS</option>
          <option value="recruiter">RECRUITERS</option>
          <option value="url">URL LINKS</option>
        </select>
      </div>

      {/* Case Files Feed List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {filtered.map((s) => (
          <div key={s.id} style={{ background: '#0b111a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', gap: '16px' }} data-border="true">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#c8ff00', background: 'rgba(200,255,0,0.1)', border: '1px solid rgba(200,255,0,0.2)', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                  {s.type} SCAN
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8' }}>{s.date}</span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', margin: '0 0 8px 0' }}>{s.title}</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{s.explanation}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold', color: s.score >= 75 ? '#fb7185' : '#34d399' }}>
                Score: {s.score}/100
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 'bold', padding: '4px 10px', borderRadius: '8px', background: s.score >= 75 ? 'rgba(244,63,94,0.15)' : 'rgba(16,185,129,0.15)', color: s.score >= 75 ? '#fb7185' : '#34d399' }}>
                {s.level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
