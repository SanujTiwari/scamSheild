/**
 * FAQ content.
 *
 * The original renders answers only while an item is expanded, so they do not
 * exist in a static capture. These were recovered by driving the accordion in a
 * real browser; the text is verbatim from the original.
 *
 * Each page's list is keyed separately because the three FAQ sections differ.
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export const homeFaq: FaqItem[] = [
  {
    question: 'How does JobShield evaluate whether a job offer is a scam?',
    answer:
      'JobShield analyzes multi-source indicators including salary rationality, urgency cues in job descriptions, upfront fee demands, recruiter domain age, and structural URL safety to generate a normalized 0–100 risk score.',
  },
  {
    question: 'What types of job scams can JobShield detect?',
    answer:
      'Our scanners detect fake job postings, recruiter impersonations, advance fee & laptop equipment deposit scams, phishing messages on WhatsApp/Telegram/Email, and spoofed company verification links.',
  },
  {
    question: 'What should I do if JobShield flags a high risk score?',
    answer:
      'A high risk score indicates multiple scam red flags. JobShield provides actionable recommendations: never send advance money or crypto, verify recruiter emails directly via official company channels, and report suspicious listings.',
  },
  {
    question: 'Is my uploaded data and message copy kept private?',
    answer:
      'Yes. All scanned text and URLs are evaluated strictly for threat intelligence analysis. We do not store personal financial data or sell your information.',
  },
  {
    question: 'How does the Recruiter & Domain Inspector work?',
    answer:
      'We cross-reference the recruiter’s email domain and profile against WHOIS domain age databases, official company registries, and known scam domain blacklists.',
  },
  {
    question: 'Why do scammers ask for registration fees or equipment money?',
    answer:
      'Legitimate employers NEVER ask candidates to pay for background checks, application fees, or software starter kits. Advance payment requests are 100% indicative of upfront payment fraud.',
  },
];

export const servicesFaq: FaqItem[] = [...homeFaq];

export const contactFaq: FaqItem[] = [...homeFaq];

