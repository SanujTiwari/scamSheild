'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  AlertTriangle, 
  Send, 
  Building2, 
  User, 
  FileText, 
  CheckCircle2, 
  ShieldAlert, 
  ExternalLink, 
  Clock, 
  Search,
  DollarSign
} from 'lucide-react';
import { submitScamReport, getScamReports, ScamReport } from '@/services/scanService';
import styles from './ReportScam.module.css';

export default function ReportScamPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    scamType: 'job',
    companyName: '',
    recruiterInfo: '',
    amountLost: '$0',
    description: '',
    evidence: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reports, setReports] = useState<ScamReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadReports() {
      const res = await getScamReports();
      setReports(res.reports || []);
    }
    loadReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      alert('Please provide a description of the scam attempt');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitScamReport(formData);
      setSubmitted(true);
      const updated = await getScamReports();
      setReports(updated.reports || []);
    } catch (err) {
      alert('Failed to submit scam report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReports = reports.filter(r => 
    r.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.scamType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.categoryPill}>COMMUNITY THREAT INTELLIGENCE</span>
        <h1 className={styles.title}>Report Fraud & Scam Offers</h1>
        <p className={styles.subtitle}>
          Flag fraudulent recruiters, fake check scams, and phishing domains to protect job seekers across the JobShield network.
        </p>
      </header>

      <div className={styles.layoutGrid}>
        {/* Left Column: Form */}
        <div className={styles.formCard} data-border="true">
          {submitted ? (
            <div className={styles.successState}>
              <CheckCircle2 size={48} className={styles.neonIcon} />
              <h2>Report Logged in Threat Database</h2>
              <p>
                Thank you for contributing to job seeker safety. Our intelligence unit has cataloged your submission for verification.
              </p>
              <div className={styles.successActions}>
                <button onClick={() => setSubmitted(false)} className={styles.btnSecondary}>
                  File Another Report
                </button>
                <button onClick={() => router.push('/dashboard')} className={styles.btnPrimary}>
                  Go to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <h2 className={styles.formTitle}>
                <ShieldAlert size={20} className={styles.warnIcon} /> Submit New Scam Case
              </h2>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Scam Category *</label>
                  <select
                    value={formData.scamType}
                    onChange={e => setFormData({ ...formData, scamType: e.target.value })}
                  >
                    <option value="job">Fake Job Offer / Counterfeit Check</option>
                    <option value="message">Phishing Email / SMS / DM</option>
                    <option value="payment">Advance Deposit / Registration Fee</option>
                    <option value="recruiter">Impersonated Recruiter Profile</option>
                    <option value="url">Fake Portal / Malicious URL</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label>Alleged Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Tech (Impersonated)"
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Contact Info (Email / Phone / Telegram)</label>
                  <input
                    type="text"
                    placeholder="e.g. hr-fakecompany@gmail.com, +1 555-0192"
                    value={formData.recruiterInfo}
                    onChange={e => setFormData({ ...formData, recruiterInfo: e.target.value })}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Financial Loss Amount (If Any)</label>
                  <input
                    type="text"
                    placeholder="e.g. $0 or $2,500"
                    value={formData.amountLost}
                    onChange={e => setFormData({ ...formData, amountLost: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Detailed Scam Circumstances *</label>
                <textarea
                  rows={4}
                  placeholder="Describe what occurred, how you were contacted, and what was demanded..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Supporting Evidence / Message Copy / Web Links</label>
                <textarea
                  rows={3}
                  placeholder="Paste email headers, wire instructions, or suspicious portal links..."
                  value={formData.evidence}
                  onChange={e => setFormData({ ...formData, evidence: e.target.value })}
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Cataloging Report...' : 'Submit Scam Report'} <Send size={16} />
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Live Community Reports Feed */}
        <div className={styles.feedCard} data-border="true">
          <div className={styles.feedHeader}>
            <div>
              <h3>Verified Threat Feed</h3>
              <p>Recent community reports flagged by JobShield threat analysts</p>
            </div>

            <div className={styles.searchBar}>
              <Search size={14} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search reported companies..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.reportsList}>
            {filteredReports.map(r => (
              <div key={r.id} className={styles.reportItem}>
                <div className={styles.reportTop}>
                  <span className={styles.companyName}>{r.companyName}</span>
                  <span className={`${styles.statusBadge} ${r.status === 'Verified Scam' ? styles.statusDanger : styles.statusWarn}`}>
                    {r.status}
                  </span>
                </div>

                <div className={styles.scamMeta}>
                  <span className={styles.scamType}>{r.scamType}</span>
                  {r.amountLost && r.amountLost !== '$0' && (
                    <span className={styles.lossAmount}><DollarSign size={12} /> {r.amountLost} Lost</span>
                  )}
                </div>

                <p className={styles.reportDesc}>{r.description}</p>

                <div className={styles.reportFooter}>
                  <span><User size={12} /> {r.contactMethod}</span>
                  <span><Clock size={12} /> {new Date(r.reportedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
