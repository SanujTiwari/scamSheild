'use client';

import React, { useState } from 'react';

export default function HistoryPage() {
  const [scans, setScans] = useState([
    { id: 'h-1', title: 'Remote Data Specialist — Wire Deposit', type: 'Job Offer', score: 92, level: 'Critical', date: '2026-09-10' },
    { id: 'h-2', title: 'URGENT Customs Fee $2.99 SMS', type: 'Message', score: 98, level: 'Critical', date: '2026-09-09' },
    { id: 'h-3', title: 'Registration Fee Demand ($89)', type: 'Payment', score: 88, level: 'High', date: '2026-09-08' },
    { id: 'h-4', title: 'Recruiter: HR Sarah Jenkins (Gmail)', type: 'Recruiter', score: 74, level: 'High', date: '2026-09-07' },
    { id: 'h-5', title: 'Google Technical Lead Application', type: 'Job Offer', score: 12, level: 'Cleared Safe', date: '2026-09-05' },
  ]);

  const handleDelete = (id: string) => {
    setScans(scans.filter((s) => s.id !== id));
  };

  return (
    <div style={{ padding: '120px 20px 80px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#c8ff00', letterSpacing: '2px', fontWeight: 'bold' }}>
          CASE FILE RECORDS
        </span>
        <h1 style={{ fontSize: '38px', fontWeight: '800', color: '#ffffff', marginTop: '8px' }}>
          Scan History & Threat Records
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '540px', margin: '12px auto 0 auto' }}>
          View, inspect details, export PDF reports, or delete historical scan case files.
        </p>
      </div>

      <div style={{ background: '#0b111a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', overflow: 'hidden' }} data-border="true">
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#080c13', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>
              <th style={{ padding: '16px 24px' }}>Date</th>
              <th style={{ padding: '16px 24px' }}>Case File Title</th>
              <th style={{ padding: '16px 24px' }}>Type</th>
              <th style={{ padding: '16px 24px' }}>Risk Score</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={{ padding: '18px 24px', fontFamily: 'monospace', color: '#94a3b8', fontSize: '12px' }}>{s.date}</td>
                <td style={{ padding: '18px 24px', fontWeight: '600' }}>{s.title}</td>
                <td style={{ padding: '18px 24px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#c8ff00', background: 'rgba(200,255,0,0.1)', padding: '3px 8px', borderRadius: '6px' }}>
                    {s.type}
                  </span>
                </td>
                <td style={{ padding: '18px 24px', fontFamily: 'monospace', fontWeight: 'bold', color: s.score >= 75 ? '#fb7185' : '#34d399' }}>
                  {s.score}/100 ({s.level})
                </td>
                <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => handleDelete(s.id)}
                    style={{ background: 'transparent', border: '1px solid rgba(244,63,94,0.3)', color: '#fb7185', padding: '6px 12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '11px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
