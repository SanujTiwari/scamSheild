'use client';

import React from 'react';
import { ScanResult } from '@/services/scanService';
import styles from './RiskModal.module.css';

interface RiskModalProps {
  scan: ScanResult | null;
  onClose: () => void;
}

export default function RiskModal({ scan, onClose }: RiskModalProps) {
  if (!scan) return null;

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#f43f5e'; // Red
    if (score >= 45) return '#f59e0b'; // Yellow
    return '#10b981'; // Green
  };

  const getBadgeClass = (score: number) => {
    if (score >= 75) return styles.badgeCritical;
    if (score >= 45) return styles.badgeWarning;
    return styles.badgeSafe;
  };

  const scoreColor = getScoreColor(scan.riskScore);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} data-border="true">
        {/* Modal Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <span className={`${styles.badge} ${getBadgeClass(scan.riskScore)}`}>
              {scan.riskLevel} Risk ({scan.riskScore}/100)
            </span>
            <h3 className={styles.title}>{scan.title}</h3>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Modal Content Body */}
        <div className={styles.body}>
          {/* Risk Gauge Bar */}
          <div className={styles.gaugeContainer}>
            <div className={styles.gaugeLabelRow}>
              <span>Normalized Risk Level</span>
              <span style={{ color: scoreColor, fontWeight: 'bold' }}>{scan.riskScore}% Threat Probability</span>
            </div>
            <div className={styles.gaugeBarTrack}>
              <div
                className={styles.gaugeBarFill}
                style={{ width: `${scan.riskScore}%`, backgroundColor: scoreColor }}
              />
            </div>
          </div>

          {/* Action Recommendation Box */}
          <div className={`${styles.recommendationBox} ${scan.riskScore >= 60 ? styles.recDanger : styles.recSafe}`}>
            <h4 className={styles.recTitle}>Safety Recommendation</h4>
            <p className={styles.recText}>{scan.recommendation}</p>
          </div>

          {/* Risk Factors List */}
          <div className={styles.sectionGroup}>
            <h4 className={styles.sectionHeading}>Flagged Threat Indicators ({scan.riskFactors.length})</h4>
            <div className={styles.factorList}>
              {scan.riskFactors.map((factor, idx) => (
                <div key={idx} className={styles.factorCard} data-border="true">
                  <div className={styles.factorHeader}>
                    <span className={styles.factorCategory}>{factor.category}</span>
                    <span className={`${styles.severityPill} ${factor.severity === 'high' ? styles.sevHigh : styles.sevMed}`}>
                      {factor.severity.toUpperCase()} SEVERITY
                    </span>
                  </div>
                  <h5 className={styles.factorName}>{factor.factor}</h5>
                  <p className={styles.factorDesc}>{factor.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cleared Signals */}
          {scan.clearedSignals && scan.clearedSignals.length > 0 && (
            <div className={styles.sectionGroup}>
              <h4 className={styles.sectionHeading}>Cleared Safety Signals</h4>
              <ul className={styles.clearedList}>
                {scan.clearedSignals.map((signal, idx) => (
                  <li key={idx} className={styles.clearedItem}>
                    <span className={styles.checkIcon}>✓</span> {signal}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={styles.footer}>
          <button type="button" className={styles.copyBtn} onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(scan, null, 2));
            alert('Scan report copied to clipboard!');
          }}>
            Copy Threat Report
          </button>
          <button type="button" className={styles.actionBtn} onClick={onClose}>
            Done / Close Audit
          </button>
        </div>
      </div>
    </div>
  );
}
