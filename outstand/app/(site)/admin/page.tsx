'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  FileCheck2, 
  Clock, 
  RefreshCcw, 
  Check, 
  X, 
  Search, 
  Shield, 
  AlertTriangle,
  Ban,
  Plus
} from 'lucide-react';
import styles from './Admin.module.css';

interface AdminReport {
  id: string;
  scam_type: string;
  company_name: string;
  recruiter_info: string;
  description: string;
  evidence: string;
  status: string;
  user_email: string;
  created_at: string;
}

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalUsers: 1420,
    totalScans: 8940,
    criticalScans: 642,
    pendingReports: 14,
  });

  const [reports, setReports] = useState<AdminReport[]>([
    {
      id: 'rep-1',
      scam_type: 'Fake Job Offer',
      company_name: 'Apex Global Impersonator Inc',
      recruiter_info: 'hr-apex@gmail.com',
      description: 'Demand candidate deposit $1,200 for remote work workstation setup via Zelle.',
      evidence: 'Wire request PDF & Telegram chats',
      status: 'Pending',
      user_email: 'seeker1@gmail.com',
      created_at: new Date().toISOString()
    },
    {
      id: 'rep-2',
      scam_type: 'Phishing URL',
      company_name: 'FastCareer-Portal.xyz',
      recruiter_info: '+1 415-890-3321',
      description: 'Unsolicited SMS directing to phishing site collecting SSN and banking credentials.',
      evidence: 'SMS screenshot: "Claim your $85/hr position"',
      status: 'Under Review',
      user_email: 'user_target@yahoo.com',
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'rep-3',
      scam_type: 'Upfront Payment',
      company_name: 'CyberWork Solutions Ltd',
      recruiter_info: 'recruitment@cyberwork-fake.site',
      description: 'Asked candidate for $250 registration charge before releasing contract.',
      evidence: 'Bank transfer routing instructions',
      status: 'Confirmed',
      user_email: 'dev_security@outlook.com',
      created_at: new Date(Date.now() - 172800000).toISOString()
    }
  ]);

  const [blacklistedDomains, setBlacklistedDomains] = useState([
    'cyberwork-fake.site',
    'fastcareer-portal.xyz',
    'apex-hr-verify.info',
    'telegram-recruiter-portal.top'
  ]);

  const [newDomain, setNewDomain] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notification, setNotification] = useState<string | null>(null);

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    setNotification(`Report status updated to ${newStatus}`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    setBlacklistedDomains([newDomain.trim(), ...blacklistedDomains]);
    setNewDomain('');
    setNotification(`Domain ${newDomain} added to threat blacklist`);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredReports = reports.filter(r => 
    statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase()
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <span className={styles.categoryPill}>SECURITY OPERATIONS CLEARANCE</span>
          <h1 className={styles.title}>Admin Control Center</h1>
          <p className={styles.subtitle}>
            Platform-wide scam mitigation, flagged user reports moderation, and malicious domain blacklisting.
          </p>
        </div>

        <button onClick={() => setNotification('Admin metrics refreshed')} className={styles.refreshBtn}>
          <RefreshCcw size={14} /> Refresh Feed
        </button>
      </header>

      {notification && (
        <div className={styles.notification}>
          <ShieldAlert size={16} /> {notification}
        </div>
      )}

      {/* Metrics Row */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard} data-border="true">
          <div className={styles.statTop}>
            <span>Registered Users</span>
            <Users size={16} className={styles.dimIcon} />
          </div>
          <p className={styles.statVal}>{stats.totalUsers.toLocaleString()}</p>
        </div>

        <div className={styles.statCard} data-border="true">
          <div className={styles.statTop}>
            <span>Total Scam Scans</span>
            <FileCheck2 size={16} className={styles.dimIcon} />
          </div>
          <p className={styles.statVal}>{stats.totalScans.toLocaleString()}</p>
        </div>

        <div className={styles.statCardDanger} data-border="true">
          <div className={styles.statTop}>
            <span>Critical Risk Flagged</span>
            <ShieldAlert size={16} className={styles.dangerIcon} />
          </div>
          <p className={styles.statValDanger}>{stats.criticalScans}</p>
        </div>

        <div className={styles.statCardWarn} data-border="true">
          <div className={styles.statTop}>
            <span>Pending Moderation</span>
            <Clock size={16} className={styles.warnIcon} />
          </div>
          <p className={styles.statValWarn}>{stats.pendingReports}</p>
        </div>
      </div>

      <div className={styles.adminGrid}>
        {/* Reports Moderation Feed */}
        <div className={styles.reportsSection} data-border="true">
          <div className={styles.sectionHeader}>
            <div>
              <h2>User Scam Reports ({filteredReports.length})</h2>
              <p>Review and confirm suspicious job offers submitted by candidates</p>
            </div>

            <div className={styles.filterGroup}>
              <label>Filter Status:</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">All Reports</option>
                <option value="pending">Pending</option>
                <option value="under review">Under Review</option>
                <option value="confirmed">Confirmed</option>
              </select>
            </div>
          </div>

          <div className={styles.reportsList}>
            {filteredReports.map(r => (
              <div key={r.id} className={styles.reportCard}>
                <div className={styles.reportHeader}>
                  <div className={styles.typeBadge}>
                    <span>{r.scam_type}</span>
                    <small>Reporter: {r.user_email}</small>
                  </div>
                  <span className={`${styles.statusChip} ${
                    r.status === 'Confirmed' ? styles.statusConfirmed :
                    r.status === 'Under Review' ? styles.statusReview : styles.statusPending
                  }`}>
                    {r.status}
                  </span>
                </div>

                <div className={styles.reportContent}>
                  <h3>{r.company_name}</h3>
                  <span className={styles.contactInfo}>Contact: {r.recruiter_info}</span>
                  <p>{r.description}</p>

                  {r.evidence && (
                    <div className={styles.evidenceBox}>
                      <strong>Evidence Log:</strong> {r.evidence}
                    </div>
                  )}
                </div>

                <div className={styles.reportActions}>
                  <span className={styles.actionLabel}>Change Status:</span>
                  <button onClick={() => handleStatusUpdate(r.id, 'Under Review')} className={styles.btnWarn}>
                    Under Review
                  </button>
                  <button onClick={() => handleStatusUpdate(r.id, 'Confirmed')} className={styles.btnDanger}>
                    Confirm Scam
                  </button>
                  <button onClick={() => handleStatusUpdate(r.id, 'Dismissed')} className={styles.btnDim}>
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Domain Blacklist Panel */}
        <div className={styles.blacklistSection} data-border="true">
          <div className={styles.sectionHeader}>
            <div>
              <h2>Domain Blacklist Registry</h2>
              <p>Add known phishing URLs to trigger automatic 100% risk warnings</p>
            </div>
          </div>

          <form onSubmit={handleAddDomain} className={styles.domainForm}>
            <input
              type="text"
              placeholder="e.g. suspicious-job-portal.xyz"
              value={newDomain}
              onChange={e => setNewDomain(e.target.value)}
            />
            <button type="submit" className={styles.addBtn}>
              <Plus size={14} /> Add Domain
            </button>
          </form>

          <div className={styles.domainList}>
            {blacklistedDomains.map((domain, i) => (
              <div key={i} className={styles.domainItem}>
                <span className={styles.domainName}><Ban size={14} className={styles.dangerIcon} /> {domain}</span>
                <span className={styles.domainTag}>AUTO-BLOCKED</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
