'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Trash2, 
  Briefcase, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Undo2,
  FileCheck,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Search
} from 'lucide-react';
import { 
  matchResume, 
  getResumeHistory, 
  deleteResumeMatch, 
  ResumeMatchResult, 
  getScanHistory, 
  ScanResult 
} from '@/services/scanService';
import styles from './ResumeMatch.module.css';

export default function ResumeMatchPage() {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [resumeSource, setResumeSource] = useState<'upload' | 'paste'>('upload');
  const [jobSource, setJobSource] = useState<'history' | 'paste'>('paste');

  const [scannedJobs, setScannedJobs] = useState<ScanResult[]>([]);
  const [matchHistory, setMatchHistory] = useState<ResumeMatchResult[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');

  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    description: '',
    resumeText: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResumeMatchResult | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [jobsRes, historyRes] = await Promise.all([
          getScanHistory(),
          getResumeHistory()
        ]);
        setScannedJobs(jobsRes.history || []);
        setMatchHistory(historyRes.history || []);
      } catch (err) {
        console.error('Failed loading resume match history:', err);
      }
    }
    loadData();
  }, []);

  const handleJobSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedJobId(id);
    const found = scannedJobs.find(j => j.id === id);
    if (found) {
      setFormData(prev => ({
        ...prev,
        jobTitle: found.title || 'Target Job Role',
        companyName: 'Scanned Organization',
        description: found.explanation || found.recommendation || '',
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 4 * 1024 * 1024) {
      alert('File size must be under 4MB');
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => {
      setFileBase64((reader.result as string).split(',')[1] || '');
    };
    reader.readAsDataURL(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobTitle || !formData.companyName) {
      alert('Please enter job title and company name');
      return;
    }
    if (resumeSource === 'paste' && !formData.resumeText.trim()) {
      alert('Please paste your resume text');
      return;
    }

    setIsLoading(true);
    setNotification(null);

    const payload = {
      jobTitle: formData.jobTitle,
      companyName: formData.companyName,
      description: formData.description,
      resumeText: formData.resumeText,
      resumeFile: fileBase64,
    };

    try {
      const res = await matchResume(payload);
      setResult(res.match);
      setNotification('Resume compatibility analysis completed!');
      const updatedHist = await getResumeHistory();
      setMatchHistory(updatedHist.history || []);
    } catch (err) {
      alert('Failed to analyze resume match.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this comparison report?')) return;
    await deleteResumeMatch(id);
    setMatchHistory(prev => prev.filter(m => m.id !== id));
    if (result?.id === id) setResult(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <span className={styles.categoryPill}>ATS & RESUME SCAM MATCHING ENGINE</span>
          <h1 className={styles.title}>Resume & Job Scanner</h1>
          <p className={styles.subtitle}>
            Detect missing skill gaps, optimize ATS keywords, and identify suspicious mismatch signals before applying.
          </p>
        </div>

        <div className={styles.tabToggle}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'new' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('new')}
          >
            <Sparkles size={14} /> Analyze Match
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'history' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <FileText size={14} /> History ({matchHistory.length})
          </button>
        </div>
      </header>

      {notification && (
        <div className={styles.notification}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      {activeTab === 'new' && (
        <div className={styles.grid}>
          {/* Form Side */}
          <div className={`${styles.formCard} ${result ? styles.formCompact : ''}`} data-border="true">
            {result && (
              <button onClick={() => setResult(null)} className={styles.resetBtn}>
                <Undo2 size={14} /> Start New Resume Comparison
              </button>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formSection}>
                <div className={styles.sectionHeading}>
                  <Briefcase size={16} className={styles.neonIcon} />
                  <h3>1. Target Job Details</h3>
                </div>

                <div className={styles.inputGroup}>
                  <label>Company / Organization Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Cyber Security Ltd"
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Target Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Frontend Developer"
                    value={formData.jobTitle}
                    onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Job Description & Requirements</label>
                  <textarea
                    rows={4}
                    placeholder="Paste the full job description or key technical requirements..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formSection}>
                <div className={styles.sectionHeading}>
                  <FileText size={16} className={styles.neonIcon} />
                  <h3>2. Candidate Resume Input</h3>
                </div>

                <div className={styles.togglePills}>
                  <button
                    type="button"
                    className={resumeSource === 'upload' ? styles.activePill : ''}
                    onClick={() => setResumeSource('upload')}
                  >
                    <Upload size={12} /> Upload File (PDF/TXT)
                  </button>
                  <button
                    type="button"
                    className={resumeSource === 'paste' ? styles.activePill : ''}
                    onClick={() => setResumeSource('paste')}
                  >
                    <FileText size={12} /> Paste Plain Text
                  </button>
                </div>

                {resumeSource === 'upload' ? (
                  <div className={styles.fileDropZone}>
                    <input type="file" accept=".pdf,.txt" onChange={handleFileUpload} id="resume-file" hidden />
                    <label htmlFor="resume-file" className={styles.fileLabel}>
                      <Upload size={24} className={styles.neonIcon} />
                      <span>{file ? file.name : 'Click to upload resume PDF or TXT'}</span>
                      <small>Max file size: 4MB</small>
                    </label>
                  </div>
                ) : (
                  <div className={styles.inputGroup}>
                    <textarea
                      rows={5}
                      placeholder="Paste your full resume text including work experience, skills, and education..."
                      value={formData.resumeText}
                      onChange={e => setFormData({ ...formData, resumeText: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw size={16} className={styles.spinning} /> Analyzing Skill Compatibility...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Run ATS & Threat Compatibility Check
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Side */}
          {result && (
            <div className={styles.resultCard} data-border="true">
              <div className={styles.resultHeader}>
                <div>
                  <span className={styles.resultTag}>{result.companyName}</span>
                  <h2>{result.jobTitle}</h2>
                </div>
                <div className={styles.overallScoreBadge}>
                  <span className={styles.scoreVal}>{result.overallMatch}%</span>
                  <span className={styles.scoreLbl}>Overall Match</span>
                </div>
              </div>

              <div className={styles.scoresGrid}>
                <div className={styles.scoreItem}>
                  <span className={styles.scoreNum}>{result.matchScore}%</span>
                  <span className={styles.scoreName}>Skill Alignment</span>
                </div>
                <div className={styles.scoreItem}>
                  <span className={styles.scoreNum}>{result.atsCompatibilityScore}%</span>
                  <span className={styles.scoreName}>ATS Parser Score</span>
                </div>
                <div className={styles.scoreItem}>
                  <span className={styles.scoreNum}>{result.legitimacyScore}%</span>
                  <span className={styles.scoreName}>Employer Trust</span>
                </div>
              </div>

              <div className={styles.analysisBlock}>
                <h3><CheckCircle2 size={16} className={styles.neonText} /> Matched Skill Signals</h3>
                <div className={styles.chipCloud}>
                  {result.matchedSkills.map((sk, i) => (
                    <span key={i} className={styles.matchedChip}>{sk}</span>
                  ))}
                </div>
              </div>

              <div className={styles.analysisBlock}>
                <h3><AlertTriangle size={16} className={styles.warnText} /> Critical Missing Keywords</h3>
                <div className={styles.chipCloud}>
                  {result.missingSkills.map((sk, i) => (
                    <span key={i} className={styles.missingChip}>{sk}</span>
                  ))}
                </div>
              </div>

              <div className={styles.analysisBlock}>
                <h3><Sparkles size={16} className={styles.neonText} /> Tailored Action Plan</h3>
                <ul className={styles.actionList}>
                  {result.actionPlan.map((act, i) => (
                    <li key={i}><ArrowRight size={14} className={styles.neonText} /> {act}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className={styles.historyGrid}>
          {matchHistory.length === 0 ? (
            <div className={styles.emptyState} data-border="true">
              <FileText size={36} className={styles.dimIcon} />
              <p>No resume comparison history found yet.</p>
              <button onClick={() => setActiveTab('new')} className={styles.actionBtn}>
                Run First Analysis
              </button>
            </div>
          ) : (
            matchHistory.map(item => (
              <div key={item.id} className={styles.historyCard} data-border="true" onClick={() => { setResult(item); setActiveTab('new'); }}>
                <div className={styles.historyMeta}>
                  <div>
                    <span className={styles.companyName}>{item.companyName}</span>
                    <h3 className={styles.jobTitle}>{item.jobTitle}</h3>
                  </div>
                  <div className={styles.historyScore}>
                    <span>{item.overallMatch}%</span>
                  </div>
                </div>

                <p className={styles.historySummary}>{item.summary}</p>

                <div className={styles.historyFooter}>
                  <span className={styles.date}>{new Date(item.analyzedAt).toLocaleDateString()}</span>
                  <button className={styles.deleteBtn} onClick={e => handleDelete(item.id, e)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
