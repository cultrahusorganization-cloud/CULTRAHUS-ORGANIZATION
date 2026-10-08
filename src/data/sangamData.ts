export interface FestivalPillar {
  title: string;
  badge: string;
  tagline: string;
  description: string;
  color: string;
  iconName?: string;
}

export const FESTIVAL_PILLARS: FestivalPillar[] = [
  {
    title: "Grand Garba & Dandiya Raas",
    badge: "Traditional Extravaganza",
    tagline: "Authentic Folk Dhol & Community Circles",
    description: "Open-air energetic Garba Raas featuring live Gujarati percussionists, authentic dholak beats, traditional choreography, and non-stop dancing circles under festive illumination.",
    color: "border-[#c59a3f]/40 bg-[#faf6eb]"
  },
  {
    title: "Celebrity Guest DJ Night",
    badge: "Electronic Sangeet Finale",
    tagline: "Bass Drops, Concert Lasers & EDM Beats",
    description: "Youth dance explosion headlined by celebrity guest DJ spinning festival remixes, Punjabi-Bollywood bangers, pulsating bass drops, and dynamic concert visual projections.",
    color: "border-[#43522e]/40 bg-[#e2ead7]/60"
  },
  {
    title: "Concert Stage & Light Spectacle",
    badge: "Audiovisual Production",
    tagline: "Laser Beams, Smoke Cannons & Sound Systems",
    description: "State-of-the-art pro sound line arrays, sweeping multi-color beam lights, CO2 blasters, and immersive atmospheric stagecraft inside the Gurgaon University amphitheatre.",
    color: "border-[#5b6e41]/35 bg-[#e8ede0]/60"
  },
  {
    title: "Food & Refreshment Promenade",
    badge: "Festive Delicacies",
    tagline: "Chaat, Mocktails & Street Snacks",
    description: "Curated student-friendly food court with authentic festive treats, coolers, energy drinks, and gourmet evening snacks to keep your dance energy peaking all night.",
    color: "border-[#708051]/40 bg-[#f4efe4]/80"
  }
];

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const FESTIVAL_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    category: "Tickets",
    question: "What passes are available for 18 October?",
    answer: "There are only two official passes: ₹250 for Single Person Entry and ₹400 for Couple Entry. Both passes grant complete, all-access entry to both Garba Night and the Celebrity DJ Night on 18 October 2026 at Gurgaon University."
  },
  {
    id: "faq-2",
    category: "Venue",
    question: "Where is the event taking place on 18 October?",
    answer: "The event is hosted at Gurgaon University Campus (Sector 51, Gurugram, Haryana). Entry will be managed via Main Gate 1 with rapid security pass verification."
  },
  {
    id: "faq-3",
    category: "Inclusions",
    question: "Do the passes include both Garba Night and DJ Night?",
    answer: "Yes, both the ₹250 Single Person Pass and ₹400 Couple Pass grant complete access to both Grand Garba Raas and the Celebrity DJ Night at Gurgaon University."
  },
  {
    id: "faq-4",
    category: "Verification",
    question: "How do I look up and verify my booked pass?",
    answer: "You can use the 'Lookup Pass' feature right on the website. Simply enter your Unique Letter Security Code (e.g. SNGM-TKT-XXXXX) or registered 10-digit WhatsApp number to instantly verify your pass, see confirmation details, and view or print your digital pass credential."
  },
  {
    id: "faq-5",
    category: "Entry Rules",
    question: "Do I need a QR code for entry?",
    answer: "No QR code is needed! You only need your Unique Letter Security Code (e.g. SNGM-TKT-XXXXX) and registered name. Present your digital pass or unique letter code at the Gurgaon University security checkpoint for instant RFID wristband issuance."
  }
];

export interface DaySchedule {
  dayNumber: number;
  dayLabel: string;
  tagline: string;
  events: string[];
}

export const SANGAM_SCHEDULE: DaySchedule[] = [
  {
    dayNumber: 1,
    dayLabel: '18 OCTOBER 2026',
    tagline: 'Garba Night & Celebrity DJ Night at Gurgaon University',
    events: [
      'Traditional Festive Welcome',
      'Grand Garba & Dandiya Raas',
      'Celebrity DJ Night & EDM Euphoria'
    ]
  }
];

export interface TicketTier {
  id: 'single_person' | 'couple' | string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  food: string;
  badge?: string;
  popular?: boolean;
  entryType?: 'single' | 'couple';
  inclusions?: string;
}

export const TICKET_TIERS: TicketTier[] = [
  {
    id: 'single_person',
    name: 'Single Person Entry',
    price: 250,
    badge: 'Single Person Pass',
    entryType: 'single',
    description: 'Entry pass for 1 person on 18 October at Gurgaon University. Includes complete access to Garba Night and DJ Night celebrations.',
    features: [
      'Entry for 1 Person (Single Entry)',
      'Grand Garba Night & Dandiya Access',
      'Celebrity DJ Night & EDM Finale Access',
      'Unique Letter Security Code (No QR Code Needed)',
      'Instant Pass Lookup & Mobile Access'
    ],
    inclusions: 'Garba Night & DJ Night Included',
    food: 'Full Event Entry (1 Person)'
  },
  {
    id: 'couple',
    name: 'Couple Entry',
    price: 400,
    popular: true,
    badge: 'Couple Pass (2 Persons)',
    entryType: 'couple',
    description: 'Entry pass for Couple (2 persons) on 18 October at Gurgaon University. Includes complete access to Garba Night and DJ Night celebrations for both.',
    features: [
      'Entry for Couple (2 Persons Entry)',
      'Grand Garba Night Access (For Both)',
      'Celebrity DJ Night Access (For Both)',
      'Unique Letter Security Code (No QR Code Needed)',
      'Instant Pass Lookup & Mobile Access'
    ],
    inclusions: 'Garba Night & DJ Night Included for Couple',
    food: 'Full Event Entry (2 Persons)'
  }
];

export const SCHEDULE_TIMELINE: { title: string; venue: string; description: string; time?: string }[] = [];

export interface SecretariatDept {
  id: string;
  label: string;
  description: string;
}

export const SECRETARIAT_DEPTS: SecretariatDept[] = [
  {
    id: "MANAGEMENT",
    label: "MANAGEMENT",
    description: "Event operations, crowd management, timeline execution, and overall venue coordination."
  },
  {
    id: "CONTENT",
    label: "CONTENT",
    description: "Curating speeches, drafting official communication, anchor scripts, and event documentation."
  },
  {
    id: "GRAPHICS",
    label: "GRAPHICS",
    description: "Visual identity, banner design, stage visuals, digital assets, and print collaterals."
  },
  {
    id: "OUTREACH",
    label: "OUTREACH",
    description: "Public relations, institutional tie-ups, VIP invitations, college delegation outreach."
  },
  {
    id: "FINANCE",
    label: "FINANCE",
    description: "Budget tracking, vendor billing, ticket logistics, resource allocation, and accounts."
  }
];

export interface SponsorTier {
  id: string;
  amount: number;
  rateLabel: string;
  name: string;
  headline: string;
  badge?: string;
  isPopular?: boolean;
  colorBg: string;
  colorBorder: string;
  colorAccent: string;
  features: string[];
}

export const SPONSOR_TIERS: SponsorTier[] = [
  {
    id: "Silver Partner",
    amount: 25000,
    rateLabel: "₹25,000",
    name: "Silver Partner",
    headline: "A clear first step into the Sangam community, built for meaningful visibility.",
    colorBg: "bg-[#faf8f5]",
    colorBorder: "border-[#cfc4ad]",
    colorAccent: "text-[#5a6c42]",
    features: [
      "Brand logo on select event collateral and communication materials",
      "Mention in official digital circulars & souvenir dossier",
      "Social media acknowledgment across festival handles",
      "2 Complimentary VIP Access Passes to Garba & DJ Night",
      "Official Certificate of Cultural Patronage"
    ]
  },
  {
    id: "Gold Partner",
    amount: 50000,
    rateLabel: "₹50,000",
    name: "Gold Partner",
    headline: "Bring your brand into the festival conversation with audience engagement.",
    colorBg: "bg-[#faf8f5]",
    colorBorder: "border-[#cfc4ad]",
    colorAccent: "text-[#b3832f]",
    features: [
      "Prominent logo featured on promotional print, web & stage rollups",
      "Dedicated experiential booth / activation desk at festival promenade",
      "Targeted social media spotlight with brand narrative mention",
      "5 Complimentary VIP Access Passes with front-tier seating",
      "Opportunity to distribute promotional brochures or brand samples",
      "Official Cultural Patronage Plaque & Stage Recognition"
    ]
  },
  {
    id: "Platinum Partner",
    amount: 75000,
    rateLabel: "₹75,000",
    name: "Platinum Partner",
    headline: "High-impact visibility designed to put your brand at the heart of the celebration.",
    badge: "High Impact",
    colorBg: "bg-[#fcfaf7]",
    colorBorder: "border-[#94a3b8]",
    colorAccent: "text-[#334155]",
    features: [
      "Prominent logo placement on main concert stage wings & banners",
      "Premium exhibition & experiential engagement space at entrance foyer",
      "Verbal acknowledgments by festival anchors before headline DJ show",
      "Co-branded stage track association",
      "8 Complimentary All-Access VIP Passes & Delegate kits",
      "Dedicated digital push with product/brand integration reel"
    ]
  },
  {
    id: "Presenting Partner",
    amount: 100000,
    rateLabel: "₹1,00,000",
    name: "Presenting Partner",
    headline: "Headline title association: Own the spotlight and lead the celebration.",
    badge: "Exclusive Title",
    isPopular: true,
    colorBg: "bg-[#fdfbf6]",
    colorBorder: "border-[#3b4928]",
    colorAccent: "text-[#3b4928]",
    features: [
      'Headline Title: "Cultrahus Sangam Presented by [Your Brand]"',
      "Largest logo prominence on main concert backdrop & outdoor arches",
      "Prime large-format experiential activation pavilion at festival grounds",
      "Keynote / Guest of Honour slot during Grand Opening Ceremony",
      "15 Complimentary Sovereign VIP Passes + Royal Banquet Hospitality",
      "Exclusive press kit quote and premier listing across social channels"
    ]
  }
];

export const PARLIAMENT_TRACKS = [
  "Garba Folk Traditions & Performing Arts",
  "Modern Youth Cultural Festivities",
  "Campus Arts Coordination & Logistics"
];

export const PARTICIPATION_CATEGORIES = [
  "Garba Group Entry",
  "Student Youth Delegate"
];

