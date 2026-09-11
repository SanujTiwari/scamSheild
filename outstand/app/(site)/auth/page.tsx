'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Zap 
} from 'lucide-react';
import styles from './Auth.module.css';

export default function AuthPage() {
  const router = useRouter();
  const [isLoginState, setIsLoginState] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('token', 'demo-token-active');
      localStorage.setItem('user', JSON.stringify({ name: formData.name || 'Demo Investigator', email: formData.email }));
      setIsLoading(false);
      router.push('/dashboard');
    }, 600);
  };

  const handleDemoLogin = (role: 'user' | 'admin') => {
    setIsLoading(true);
    setTimeout(() => {
      if (role === 'admin') {
        localStorage.setItem('token', 'admin-token-active');
        localStorage.setItem('user', JSON.stringify({ name: 'Security Administrator', email: 'admin@jobshield.ai', role: 'admin' }));
        router.push('/admin');
      } else {
        localStorage.setItem('token', 'user-token-active');
        localStorage.setItem('user', JSON.stringify({ name: 'Threat Analyst', email: 'analyst@jobshield.ai', role: 'user' }));
        router.push('/dashboard');
      }
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className={styles.container}>
      <div className={styles.authBox} data-border="true">
        {/* Left Column: Form */}
        <div className={styles.formCol}>
          <div className={styles.headerBadge}>
            <span className={styles.pulsingDot} />
            <span className={styles.badgeText}>AUTHENTICATION PORTAL // CLEARANCE</span>
          </div>

          <h1 className={styles.title}>
            {isLoginState ? 'Sign In to JobShield' : 'Create Investigator Account'}
          </h1>

          <p className={styles.toggleText}>
            {isLoginState ? (
              <>
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => setIsLoginState(false)}>
                  Sign up free &rarr;
                </button>
              </>
            ) : (
              <>
                Already registered?{' '}
                <button type="button" onClick={() => setIsLoginState(true)}>
                  Sign in &rarr;
                </button>
              </>
            )}
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {!isLoginState && (
              <div className={styles.inputGroup}>
                <label>Full Name *</label>
                <div className={styles.inputWrapper}>
                  <User size={16} className={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="e.g. Alex Morgan"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            <div className={styles.inputGroup}>
              <label>Email Address *</label>
              <div className={styles.inputWrapper}>
                <Mail size={16} className={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="you@domain.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Password *</label>
              <div className={styles.inputWrapper}>
                <KeyRound size={16} className={styles.inputIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? 'Verifying Credentials...' : (isLoginState ? 'Sign In' : 'Create Account')} <ArrowRight size={16} />
            </button>

            {/* Instant Demo Login Chips */}
            <div className={styles.demoSection}>
              <span className={styles.demoLabel}>Instant Demo One-Click Access:</span>
              <div className={styles.demoBtns}>
                <button type="button" onClick={() => handleDemoLogin('user')} className={styles.demoUserBtn}>
                  <Zap size={12} /> Login as Demo User
                </button>
                <button type="button" onClick={() => handleDemoLogin('admin')} className={styles.demoAdminBtn}>
                  <ShieldCheck size={12} /> Login as Admin Panel
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Showcase */}
        <div className={styles.showcaseCol}>
          <div className={styles.showcaseContent}>
            <div className={styles.showcaseBadge}>
              <ShieldCheck size={14} className={styles.neonIcon} />
              <span>MULTI-TYPE SCAM DEFENSE</span>
            </div>

            <h2>Detect Scams Before They Cost You.</h2>
            <p>
              Scan job postings, recruiter messages, payment requests, company profiles, and suspicious links with instant AI explanations.
            </p>

            <div className={styles.featuresList}>
              <div className={styles.featureItem}>
                <CheckCircle2 size={16} className={styles.neonIcon} />
                <span>99.8% Multi-Source Signal Scoring</span>
              </div>
              <div className={styles.featureItem}>
                <CheckCircle2 size={16} className={styles.neonIcon} />
                <span>Real-Time Domain & SSL Verification</span>
              </div>
              <div className={styles.featureItem}>
                <CheckCircle2 size={16} className={styles.neonIcon} />
                <span>ATS Compatibility & Resume Matching</span>
              </div>
            </div>
          </div>

          <div className={styles.showcaseFooter}>
            <span><Lock size={12} className={styles.neonIcon} /> JobShield Core Engine</span>
            <span>256-Bit Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
