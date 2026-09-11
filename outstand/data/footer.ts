/**
 * Footer call-to-action copy.
 *
 * The headline is split into parts so you can pick out phrases in the brand
 * accent colour without touching JSX — set `accent: true` on any part.
 */

export interface HeadlinePart {
  text: string;
  accent?: boolean;
}

export interface FooterCta {
  eyebrow: string;
  headline: HeadlinePart[];
  button: { label: string; href: string };
}

export const footerCta: FooterCta = {
  eyebrow: 'Stay Safe While Job Hunting',
  headline: [
    { text: 'Protect your ' },
    { text: 'career search', accent: true },
    { text: ' with ' },
    { text: 'real-time AI scam detection', accent: true },
    { text: ' today.' },
  ],
  button: {
    label: 'Analyze Offer Now',
    href: '#scanners',
  },
};
