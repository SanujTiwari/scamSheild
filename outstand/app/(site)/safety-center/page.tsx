'use client';

import Link from 'next/link';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Lock, 
  DollarSign, 
  Globe, 
  Mail, 
  PhoneCall, 
  HelpCircle 
} from 'lucide-react';
import styles from './SafetyCenter.module.css';

export default function SafetyCenterPage() {
  const guides = [
    {
      icon: DollarSign,
      title: 'Upfront Payment & Advance Fee Fraud',
      badge: 'CRITICAL THREAT',
      desc: 'Legitimate employers never charge candidates for onboarding kits, laptop equipment deposits, or background checks.',
      rules: [
        'Never transfer funds via Zelle, UPI, wire, or cryptocurrency for any job position.',
        'Beware of counterfeit check schemes where you are asked to deposit a check and refund the surplus.',
        'Report any demand for registration or training fees immediately.'
      ]
    },
    {
      icon: Mail,
      title: 'Recruiter Email & Domain Impersonation',
      badge: 'HIGH FREQUENCY',
      desc: 'Scammers regularly use free public webmail accounts (@gmail.com, @yahoo.com) or lookalike typo domains.',
      rules: [
        'Inspect email headers and check domain extension authenticity.',
        'Cross-reference recruiter profiles on LinkedIn and official corporate staff rosters.',
        'Insist on written email offers originating from official company servers.'
      ]
    },
    {
      icon: PhoneCall,
      title: 'Off-Platform Instant Messaging Handoffs',
      badge: 'COMMON PATTERN',
      desc: 'Conducting text-only interviews exclusively via Telegram, WhatsApp, or Signal without video verification.',
      rules: [
        'Established companies conduct structured video interviews via Teams, Zoom, or Google Meet.',
        'Be cautious if recruiters refuse live video calls or direct phone conversations.',
        'Never click external attachment links sent over unverified chat apps.'
      ]
    },
    {
      icon: Globe,
      title: 'Phishing Landing Pages & Cheap TLDs',
      badge: 'TECHNICAL RISK',
      desc: 'Phishing portals mimic authentic corporate career portals using cheap domain extensions (.xyz, .top, .info).',
      rules: [
        'Verify that domain addresses begin with HTTPS and carry valid SSL certificates.',
        'Perform WHOIS lookup checks to check domain creation age.',
        'Never submit banking passwords or SSN/ID details on unfamiliar links.'
      ]
    },
    {
      icon: Lock,
      title: 'Identity & Banking Credential Theft',
      badge: 'HIGH SEVERITY',
      desc: 'Fraudulent agents harvest tax documents, government IDs (SSN/Aadhaar), or OTP codes for identity theft.',
      rules: [
        'Never share OTPs, PIN numbers, or online banking credentials under any pretext.',
        'Provide tax forms only after verifying a written, formal offer letter.',
        'Retain transcript copies of all recruiter communications.'
      ]
    }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.categoryPill}>THREAT INTELLIGENCE & PREVENTION HUB</span>
        <h1 className={styles.title}>JobShield Safety Center</h1>
        <p className={styles.subtitle}>
          Essential guidelines, red flags, and preventative steps to protect yourself against employment fraud, phishing, and payment scams.
        </p>
      </header>

      {/* CTA Card */}
      <div className={styles.ctaCard} data-border="true">
        <div>
          <h2>Have a suspicious offer or recruiter message?</h2>
          <p>Run it through JobShield&apos;s Multi-Indicator Threat Scanner to evaluate risk signals in seconds.</p>
        </div>
        <Link href="/scanner" className={styles.ctaBtn}>
          Launch Scam Scanner <ArrowRight size={16} />
        </Link>
      </div>

      {/* Guides Grid */}
      <div className={styles.guidesSection}>
        <h2 className={styles.sectionTitle}>Threat Vectors & Safety Protocols</h2>

        <div className={styles.grid}>
          {guides.map((g, idx) => {
            const Icon = g.icon;
            return (
              <div key={idx} className={styles.guideCard} data-border="true">
                <div className={styles.guideTop}>
                  <div className={styles.iconBox}>
                    <Icon size={20} className={styles.neonIcon} />
                  </div>
                  <span className={styles.badge}>{g.badge}</span>
                </div>

                <h3 className={styles.guideTitle}>{g.title}</h3>
                <p className={styles.guideDesc}>{g.desc}</p>

                <div className={styles.rulesList}>
                  <span className={styles.rulesHeader}>Key Safety Rules:</span>
                  <ul>
                    {g.rules.map((rule, rIdx) => (
                      <li key={rIdx}>
                        <CheckCircle size={14} className={styles.neonIcon} />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
