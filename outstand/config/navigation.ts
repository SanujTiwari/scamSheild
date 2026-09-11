/**
 * Navigation.
 *
 * `mainNav` drives the desktop header tabs and the mobile menu.
 * `allPagesMenu` is the "All pages" dropdown in the desktop header.
 * `footerNav` drives the four link columns in the footer.
 *
 * The original template shipped a Blogs page; it was excluded from this
 * conversion, so no Blogs entries appear here or anywhere else.
 */

export interface NavLink {
  label: string;
  href: string;
  /** External links open in a new tab and get rel="noreferrer". */
  external?: boolean;
}

export interface NavColumn {
  title: string;
  links: NavLink[];
}

/** Header tabs, in order, left to right. */
export const mainNav: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Scanner', href: '/scanner' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'History', href: '/history' },
  { label: 'Resume Match', href: '/resume-match' },
];

/** Contents of the "All pages" dropdown in the desktop header. */
export const allPagesMenu: NavLink[] = [
  { label: 'Home Page', href: '/' },
  { label: 'Multi-Type Scanner', href: '/scanner' },
  { label: 'User Dashboard V2', href: '/dashboard' },
  { label: 'Scan History', href: '/history' },
  { label: 'ATS Resume Matcher', href: '/resume-match' },
  { label: 'Report Scam V2', href: '/report-scam' },
  { label: 'Safety Center', href: '/safety-center' },
  { label: 'Login / Register', href: '/auth' },
  { label: 'Admin Dashboard', href: '/admin' },
];

/** Footer link columns, in order, left to right. */
export const footerNav: NavColumn[] = [
  {
    title: 'Scanners',
    links: [
      { label: 'Job Scam Scanner', href: '/#scanners' },
      { label: 'Recruiter Inspector', href: '/#scanners' },
      { label: 'Payment Guard', href: '/#scanners' },
      { label: 'URL & Domain Verification', href: '/#scanners' },
      { label: 'Risk Score Breakdown', href: '/#scanners' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Why JobShield', href: '/#why-us' },
      { label: 'Core Capabilities', href: '/#expertise' },
      { label: 'Key Benefits', href: '/#benefits' },
      { label: 'Detection Features', href: '/#features' },
      { label: 'Safety Guarantee', href: '/#values' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Security Values', href: '/#values' },
      { label: 'Scam FAQ’s', href: '/#faq' },
      { label: 'User Reports', href: '/#testimonials' },
      { label: 'Contact Security Team', href: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Mission', href: '/about#our-story' },
      { label: 'Security Standards', href: '/about#our-culture' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
    ],
  },
];

/** Social profiles, used by the footer and the contact page. */
export const socialLinks: NavLink[] = [
  { label: 'X', href: 'https://x.com/', external: true },
  { label: 'Instagram', href: 'https://www.instagram.com/', external: true },
  { label: 'Facebook', href: 'https://www.facebook.com/', external: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', external: true },
];
