export type RegistrationType = 'delegate' | 'ticket' | 'troupe' | 'secretariat' | 'sponsor' | 'inquiry';

export type RegistrationStatus = 'confirmed' | 'pending' | 'checked-in' | 'cancelled' | 'under-review';

export interface RegistrationRecord {
  id: string;
  uniqueCode: string; // e.g. SNGM-DEL-89421 or SNGM-TKT-29402
  type: RegistrationType;
  name: string;
  email: string;
  phone?: string;
  organization?: string; // college / institution / troupe / brand
  designation?: string;
  cityState?: string;
  
  // Delegate specific
  participationCategory?: string; // Solo Dance, Stage Play, etc.
  parliamentTrack?: string;
  priorExperience?: string;
  accessCode?: string;

  // Ticket specific
  ticketTier?: 'classic' | 'royal' | 'sovereign' | 'Standard' | 'VIP' | 'Speaker' | 'Student' | 'Executive';
  tierName?: string;
  quantity?: number;
  seats?: string[];
  foodAddon?: string;

  // Troupe specific
  troupeName?: string;
  playTitle?: string;
  playwright?: string;
  director?: string;
  contactPerson?: string;
  castCrewCount?: number;
  durationMinutes?: number;
  synopsis?: string;
  technicalRider?: string;

  // Secretariat specific
  department?: 'MANAGEMENT' | 'CONTENT' | 'GRAPHICS' | 'OUTREACH' | 'FINANCE' | string;
  whyJoin?: string;
  timeCommitment?: string;
  referredBy?: string;

  // Sponsor specific
  sponsorTier?: string;
  brandName?: string;
  proposalNotes?: string;

  // Inquiry specific
  inquiryCategory?: string;
  subject?: string;
  message?: string;

  amountPaid?: number;
  status: RegistrationStatus;
  source: 'vercel' | 'gemini_app' | 'direct';
  notes?: string;
  createdAt: string; // ISO string
  checkedInAt?: string;

  // UI helpers
  _category?: 'delegates' | 'tickets' | 'plays' | 'secretariat' | 'sponsors' | 'inquiries';
}

export interface DigitalPassData {
  type: string;
  code: string;
  title: string;
  fullName: string;
  email: string;
  phone?: string;
  detail1Label?: string;
  detail1Value?: string;
  detail2Label?: string;
  detail2Value?: string;
  seats?: string[];
  feePaid?: string;
  status?: string;
  issuedIst?: string;
}

export interface RegistrationStats {
  total: number;
  delegates: number;
  tickets: number;
  plays: number;
  secretariat: number;
  sponsors: number;
  inquiries: number;
  checkedIn: number;
  totalRevenue: number;
}

export type ThemePalette = 'indigo' | 'amber' | 'cyan' | 'emerald' | 'light';

export interface AppThemeConfig {
  id: ThemePalette;
  name: string;
  bodyBg: string;
  textPrimary: string;
  textMuted: string;
  cardBg: string;
  cardBorder: string;
  accentBg: string;
  accentText: string;
  accentBadge: string;
  navBg: string;
  navBorder: string;
  activeNavTab: string;
  dotColor: string;
  ringColor: string;
}
