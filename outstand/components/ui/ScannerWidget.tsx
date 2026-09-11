'use client';

import React, { useState } from 'react';
import { scanJob, scanMessage, scanPayment, scanRecruiter, scanUrl, ScanResult } from '@/services/scanService';
import RiskModal from './RiskModal';
import styles from './ScannerWidget.module.css';

interface ScannerWidgetProps {
  initialText?: string;
}

export default function ScannerWidget({ initialText = '' }: ScannerWidgetProps) {
  const [activeTab, setActiveTab] = useState<'job' | 'message' | 'payment' | 'recruiter' | 'url'>('job');
  const [loading, setLoading] = useState(false);
  const [activeResult, setActiveResult] = useState<ScanResult | null>(null);

  // Form States
  const [jobForm, setJobForm] = useState({
    title: '',
    companyName: '',
    description: initialText || '',
    salary: '',
    email: '',
    website: '',
  });

  const [messageForm, setMessageForm] = useState({
    message: initialText || '',
    platform: 'WhatsApp',
    senderEmail: '',
    senderPhone: '',
  });

  const [paymentForm, setPaymentForm] = useState({
    requestText: initialText || '',
    amount: '',
    method: 'Bank Transfer',
    reason: '',
  });

  const [recruiterForm, setRecruiterForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    profileUrl: '',
  });

  const [urlForm, setUrlForm] = useState({
    url: initialText || '',
  });

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (activeTab === 'job') {
        res = await scanJob(jobForm);
      } else if (activeTab === 'message') {
        res = await scanMessage(messageForm);
      } else if (activeTab === 'payment') {
        res = await scanPayment(paymentForm);
      } else if (activeTab === 'recruiter') {
        res = await scanRecruiter(recruiterForm);
      } else if (activeTab === 'url') {
        res = await scanUrl(urlForm);
      }
      if (res && res.scan) {
        setActiveResult(res.scan);
      }
    } catch (err) {
      console.error('Scan failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAutofillChip = (sampleText: string, mode: 'job' | 'message' | 'payment' | 'recruiter' | 'url') => {
    setActiveTab(mode);
    if (mode === 'job') {
      setJobForm({
        title: 'Remote Data Specialist',
        companyName: 'Global Apex Solutions',
        description: sampleText,
        salary: '$4,200/week',
        email: 'hr-apex@gmail.com',
        website: 'apex-solutions-fake.xyz',
      });
    } else if (mode === 'message') {
      setMessageForm((prev) => ({ ...prev, message: sampleText }));
    } else if (mode === 'payment') {
      setPaymentForm((prev) => ({ ...prev, requestText: sampleText, amount: '$89' }));
    } else if (mode === 'url') {
      setUrlForm({ url: sampleText });
    }
  };

  return (
    <>
      <div className={styles.widgetCard} data-border="true">
        {/* Scanner Mode Tabs */}
        <div className={styles.tabHeader}>
          {[
            { id: 'job', label: 'Job Offer', icon: '💼', desc: 'Postings & Roles' },
            { id: 'message', label: 'Message / DM', icon: '💬', desc: 'WhatsApp & SMS' },
            { id: 'payment', label: 'Payment Demand', icon: '💳', desc: 'Fees & Deposits' },
            { id: 'recruiter', label: 'Recruiter Identity', icon: '👤', desc: 'Emails & Profiles' },
            { id: 'url', label: 'URL Link', icon: '🌐', desc: 'Phishing Domains' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <div className={styles.tabIconLabel}>
                <span>{tab.icon}</span>
                <span className={styles.tabTitle}>{tab.label}</span>
              </div>
              <span className={styles.tabDesc}>{tab.desc}</span>
            </button>
          ))}
        </div>

        {/* Quick Sample Autofill Chips */}
        <div className={styles.chipBar}>
          <span className={styles.chipTitle}>✨ Try Samples:</span>
          {[
            { label: 'Suspicious Job Offer', mode: 'job', text: 'Earn up to $4,200/week working remote. A refundable registration training fee of $89 is required via Zelle before laptop dispatch.' },
            { label: 'Fake Package SMS', mode: 'message', text: 'URGENT: Your package delivery is held due to unpaid fee $2.99. Confirm immediately: verify-pkg-track.info' },
            { label: 'Urgent Payment Deposit', mode: 'payment', text: 'Required onboarding registration fee of $89 for home equipment shipment.' },
            { label: 'Phishing Domain', mode: 'url', text: 'https://verify-account-security-update.xyz' },
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              className={styles.chipBtn}
              onClick={() => handleAutofillChip(chip.text, chip.mode as any)}
            >
              ⚡ {chip.label}
            </button>
          ))}
        </div>

        {/* Form Container */}
        <form onSubmit={handleRunAudit} className={styles.formBody}>
          {activeTab === 'job' && (
            <div className={styles.fieldGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Job Title *</label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g. Remote Data Entry Specialist"
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Company Name *</label>
                <input
                  type="text"
                  required
                  value={jobForm.companyName}
                  onChange={(e) => setJobForm({ ...jobForm, companyName: e.target.value })}
                  placeholder="e.g. Tech Global Inc."
                  className={styles.input}
                />
              </div>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Job Description & Offer Details *</label>
                <textarea
                  required
                  rows={5}
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Paste the full job posting description text here..."
                  className={styles.textarea}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Salary Claimed</label>
                <input
                  type="text"
                  value={jobForm.salary}
                  onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                  placeholder="e.g. $4,000/week"
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Recruiter Email</label>
                <input
                  type="email"
                  value={jobForm.email}
                  onChange={(e) => setJobForm({ ...jobForm, email: e.target.value })}
                  placeholder="e.g. hr-tech@gmail.com"
                  className={styles.input}
                />
              </div>
            </div>
          )}

          {activeTab === 'message' && (
            <div className={styles.fieldGrid}>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Message Text Content *</label>
                <textarea
                  required
                  rows={5}
                  value={messageForm.message}
                  onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                  placeholder="Paste the SMS, WhatsApp, Telegram, or email message text..."
                  className={styles.textarea}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Sender Platform</label>
                <select
                  value={messageForm.platform}
                  onChange={(e) => setMessageForm({ ...messageForm, platform: e.target.value })}
                  className={styles.select}
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Telegram">Telegram</option>
                  <option value="SMS">SMS / Text</option>
                  <option value="Email">Email</option>
                  <option value="LinkedIn">LinkedIn DM</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Sender Email</label>
                <input
                  type="email"
                  value={messageForm.senderEmail}
                  onChange={(e) => setMessageForm({ ...messageForm, senderEmail: e.target.value })}
                  placeholder="e.g. hr.hiring@gmail.com"
                  className={styles.input}
                />
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className={styles.fieldGrid}>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Payment Demand Details *</label>
                <textarea
                  required
                  rows={5}
                  value={paymentForm.requestText}
                  onChange={(e) => setPaymentForm({ ...paymentForm, requestText: e.target.value })}
                  placeholder="Describe what payment is requested (registration fee, training charges, laptop deposit)..."
                  className={styles.textarea}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Requested Amount</label>
                <input
                  type="text"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  placeholder="e.g. $89 or ₹2,000"
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Payment Method</label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                  className={styles.select}
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI / GPay">UPI / GPay</option>
                  <option value="Crypto">Crypto (USDT/BTC)</option>
                  <option value="Gift Cards">Gift Cards</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'recruiter' && (
            <div className={styles.fieldGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Recruiter Name *</label>
                <input
                  type="text"
                  required
                  value={recruiterForm.name}
                  onChange={(e) => setRecruiterForm({ ...recruiterForm, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Recruiter Email Address *</label>
                <input
                  type="email"
                  required
                  value={recruiterForm.email}
                  onChange={(e) => setRecruiterForm({ ...recruiterForm, email: e.target.value })}
                  placeholder="e.g. sarah.hiring@gmail.com"
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Company Name</label>
                <input
                  type="text"
                  value={recruiterForm.company}
                  onChange={(e) => setRecruiterForm({ ...recruiterForm, company: e.target.value })}
                  placeholder="e.g. Acme Corp"
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={recruiterForm.profileUrl}
                  onChange={(e) => setRecruiterForm({ ...recruiterForm, profileUrl: e.target.value })}
                  placeholder="e.g. linkedin.com/in/sarah"
                  className={styles.input}
                />
              </div>
            </div>
          )}

          {activeTab === 'url' && (
            <div className={styles.fieldGrid}>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Suspicious Website or Link URL *</label>
                <input
                  type="url"
                  required
                  value={urlForm.url}
                  onChange={(e) => setUrlForm({ ...urlForm, url: e.target.value })}
                  placeholder="https://verify-account-security-update.xyz"
                  className={styles.input}
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className={styles.submitRow}>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Running Threat Audit...' : 'Run Fraud Audit →'}
            </button>
          </div>
        </form>
      </div>

      {/* Result Modal */}
      <RiskModal scan={activeResult} onClose={() => setActiveResult(null)} />
    </>
  );
}
