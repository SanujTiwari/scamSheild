/**
 * Homepage hero content.
 *
 * In the export the headline was split into one <span> per character to drive
 * Framer's text-reveal animation. Here it stays a plain string — the Reveal
 * component does the splitting at render time, so you edit normal sentences.
 */

export interface HeroStat {
  value: string;
  /** Rendered immediately after the value, e.g. the "+" in "50+". */
  suffix?: string;
  label: string;
}

export interface HeroContent {
  badge: {
    text: string;
    starsIcon: string;
    avatarIcon: string;
  };
  heading: string;
  subheading: string;
  primaryCta: { label: string; href: string };
  note: { text: string; icon: string };
  stats: HeroStat[];
  marquee: {
    title: string;
    /** Logos cycle infinitely; the component duplicates the list itself. */
    logos: { src: string; alt: string }[];
  };
  background: {
    pattern: string;
    lightLeft: string;
    lightRight: string;
  };
}

export const hero: HeroContent = {
  badge: {
    text: 'AI Scam Detection • 99.4% Accuracy',
    starsIcon: '/assets/media/InL2lTTFiMLfaRpROnHZUbLtMKE.svg',
    avatarIcon: '/assets/media/WxkrmjQWjYAfP1IM3c93O6EITAc.svg',
  },

  heading: 'Detect Job Scams Before They Cost You',
  subheading:
    'Multi-source AI platform evaluating job postings, recruiter profiles, advance payment demands, and malicious links in real time.',

  primaryCta: { label: 'Analyze Job Offer', href: '#scanners' },

  note: {
    text: 'Instant 0–100 Risk Score & Detailed Explanations',
    icon: '/assets/media/Q4pdwonAT329eMKcy1U33qS8WY.svg',
  },

  stats: [
    { value: '10K', suffix: '+', label: 'Scams Flagged' },
    { value: '99.4', suffix: '%', label: 'Detection Accuracy' },
    { value: '6', suffix: '+', label: 'AI Scanner Engines' },
    { value: '0', suffix: '$', label: 'Upfront Risk to You' },
  ],

  marquee: {
    title: 'Trusted by job seekers and career professionals worldwide',
    logos: [
      { src: '/assets/media/NuGqmqFyhLOJdkv3Ya0E0w13WLU.svg', alt: 'Partner logo' },
      { src: '/assets/media/PxXY0ZbAPNduG77K1nPw4rKpL0.svg', alt: 'Partner logo' },
      { src: '/assets/media/fuF1KOkpWo5egYAcHSQgYR5K4R4.svg', alt: 'Partner logo' },
      { src: '/assets/media/u6slmmBj0EoSrOhCVCP1FiHnq3Y.svg', alt: 'Partner logo' },
      { src: '/assets/media/WkmGdT6X97LVdM5JygTrjsiyklU.svg', alt: 'Partner logo' },
      { src: '/assets/media/5db7fP9iHNnx9yrqLHhrahtHCpw.svg', alt: 'Partner logo' },
    ],
  },

  background: {
    pattern: '/assets/media/BtlaHSBVpP1o4SpXdJy2V9cdWF0.png',
    lightLeft: '/assets/media/uYkLP5SiUycWQryE3EWbrjbhiE.svg',
    lightRight: '/assets/media/OEy9gAODlW0zXdPu7Uts9Eeyk.svg',
  },
};
