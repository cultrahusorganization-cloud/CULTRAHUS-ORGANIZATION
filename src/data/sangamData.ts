export interface FestivalPillar {
  title: string;
  badge: string;
  tagline: string;
  description: string;
  color: string;
}

export const FESTIVAL_PILLARS: FestivalPillar[] = [
  {
    title: "Theatre & Nukkad Natak",
    badge: "Flagship Conclave",
    tagline: "Proscenium Grandeur & Street Voices",
    description: "From introspective proscenium productions with intricate lighting cues to raw, pulse-pounding street plays in the open amphitheatre.",
    color: "border-[#5b6e41]/40 bg-[#ebf0e2]/60"
  },
  {
    title: "Indian Dance Assemblies",
    badge: "Heritage & Modern",
    tagline: "Kathak, Odissi, Bharatnatyam & Fusion",
    description: "Expressive mudras, rigorous footwork, and contemporary physical theatre celebrating timeless aesthetic rasas.",
    color: "border-[#708051]/40 bg-[#f4efe4]/80"
  },
  {
    title: "Live Music Bands & Fusion",
    badge: "Acoustic & Electric",
    tagline: "Sufi, Folk Rock & Hindustani Grooves",
    description: "High-octane collegiate and professional ensembles uniting sarangi, electric bass, dholak, and soul-stirring vocal melodies.",
    color: "border-[#5b6e41]/35 bg-[#e8ede0]/60"
  },
  {
    title: "Dandiya & Garba Raas",
    badge: "Cultural Festive",
    tagline: "Traditional Rhythms & Community Circles",
    description: "An open-air evening extravaganza of traditional dhol rhythms, authentic choreography, and colorful festive attire.",
    color: "border-[#c59a3f]/40 bg-[#faf6eb]"
  },
  {
    title: "Celebrity Guest DJ & EDM",
    badge: "Youth Euphoria",
    tagline: "Electronic Sangeet & Soundscapes",
    description: "Grand festival finale bringing youth energy with headliner festival remixes, bass drops, and visual stage projections.",
    color: "border-[#43522e]/40 bg-[#e2ead7]/60"
  }
];

export interface Dignitary {
  name: string;
  role: string;
  title: string;
  image: string;
}

export const DIGNITARIES: Dignitary[] = [
  {
    name: "Prof. Virendra N. Kaul",
    role: "Festival Chairman & Senior Dramaturge",
    title: "Former Dean, National School of Drama, New Delhi",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
  },
  {
    name: "Padmashri Smt. Meenakshi Sanyal",
    role: "Dean of Performing Arts & Classical Choreography",
    title: "Distinguished Fellow, Sangeet Natak Akademi",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
  },
  {
    name: "Dr. Harshavardhan Trivedi",
    role: "Chairperson, Cultural Parliament & Policy Forum",
    title: 'Author of "The Theatre of the Indian Republic"',
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80"
  },
  {
    name: "Rituja Sen Choudhury",
    role: "Convenor, Secretariat & Youth Council",
    title: "Founder, Cultrahus Heritage & Arts Initiative",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80"
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
    category: "Registration",
    question: "What is included in the ₹650 Accredited Delegate Pass?",
    answer: "The ₹650 Delegate Accreditation grants you all-day VIP access across all 5 festival stages and performance halls, an official Delegate Kit with the 2026 Conclave Monograph, voting rights in the Cultural Parliament session, and an authenticated digital certificate of representation."
  },
  {
    id: "faq-2",
    category: "Tickets",
    question: "How do Conclave Ticket passes differ between Classic, Royal, and VIP Sovereign?",
    answer: "Classic (₹400, crossed from ₹600) offers general amphitheatre & auditorium entry with no food included. Royal (₹600, crossed from ₹900) includes reserved mid-tier auditorium seating and a high-tea refreshment box. VIP Sovereign (₹800, crossed from ₹1,200) guarantees front-row seating (Rows A-B), fast-track security access, and food included (complimentary royal banquet dining). IMPORTANT: Every pass tier includes complete unrestricted entry to both the Grand Garba Night / Dandiya Raas and the Celebrity DJ Night at zero extra charge!"
  },
  {
    id: "faq-3",
    category: "Participation",
    question: "How are theatre troupes and street plays selected?",
    answer: "Troupes submit their play details, synopsis, and technical riders via the Troupe Registration portal. Our jury panel curates 16 proscenium productions and 24 street play finalists. All selected troupes receive official letters of invitation."
  },
  {
    id: "faq-4",
    category: "Venue",
    question: "Where is Cultrahus Sangam 2026 taking place, and how do I reach it?",
    answer: "Venue: TBA (To Be Announced). The official venue for Cultrahus Sangam 2026 is currently being finalized and will be announced shortly (TBA) to accommodate 1,200+ delegates, proscenium theatre stages, and cultural pavilions. All confirmed delegates, collegiate troupes, and ticket holders will receive exact location coordinates, gate access passes, and transit guidelines via WhatsApp and registered Email as soon as announced."
  },
  {
    id: "faq-5",
    category: "Registration",
    question: "What happens immediately after I submit my delegate or ticket form?",
    answer: "You will receive an instant official reference code (e.g. SNGM-DEL-XXXXX or SNGM-TKT-XXXXX) along with a verifiable digital pass preview containing a secure QR code and audit metadata. You can save, print, or download your pass immediately."
  }
];

export const PARLIAMENT_TRACKS = [
  "Youth & Performing Arts National Policy",
  "Theatre as Democratic Dialogue & Free Speech",
  "Preserving Regional Folk Traditions in Modern Times",
  "Public Funding, Copyrights & Artist Welfare"
];

export const PARTICIPATION_CATEGORIES = [
  "Solo Dance",
  "Stage Play (Proscenium)",
  "Street Play (Nukkad Natak)",
  "Classical Vocal / Instrumental",
  "Contemporary Physical Theatre",
  "Academic Scholar / Dramaturgy Observer",
  "Student Youth Delegate"
];

export interface TicketTier {
  id: 'classic' | 'royal' | 'sovereign';
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  features: string[];
  food: string;
  badge?: string;
  popular?: boolean;
}

export const TICKET_TIERS: TicketTier[] = [
  {
    id: 'classic',
    name: 'Classic Pass',
    price: 400,
    originalPrice: 600,
    description: 'General amphitheatre & auditorium entry pass for culture enthusiasts.',
    features: [
      'Access to open amphitheatre & general auditorium zone',
      'Unrestricted entry to Dandiya & Garba Raas celebration',
      'Full entry to Celebrity DJ & EDM Finale',
      'Digital attendance credentials with QR code',
      'No food included (cafeteria stalls available on-site)'
    ],
    food: 'No food included'
  },
  {
    id: 'royal',
    name: 'Royal Pass',
    price: 600,
    originalPrice: 900,
    popular: true,
    badge: 'Best Value',
    description: 'Reserved mid-tier auditorium seating + high-tea refreshment box.',
    features: [
      'Reserved middle-tier seats in main proscenium auditorium',
      'Complimentary High-Tea Refreshment Box with beverage',
      'Complete access to Dandiya & Garba Raas celebration',
      'Full entry to Celebrity DJ & EDM Finale',
      'Priority festival registration check-in counter',
      'Commemorative festival wristband'
    ],
    food: 'High-Tea Refreshment Box Included'
  },
  {
    id: 'sovereign',
    name: 'VIP Sovereign Pass',
    price: 800,
    originalPrice: 1200,
    badge: 'Premium VIP',
    description: 'Front-row seating, fast-track access, and royal banquet dining included.',
    features: [
      'Prime Front-Row Seating (Rows A-B) with supreme acoustic view',
      'Complimentary Royal Banquet Dining (Sattvic / Chef Dinner)',
      'Fast-track VIP security and expedited stage entry',
      'Complete access to Dandiya & Garba Raas celebration',
      'Full entry to Celebrity DJ & EDM Finale',
      'Festival Welcome Kit with souvenir monograph',
      'Access to VIP lounge and artist meet-and-greet foyer'
    ],
    food: 'Complimentary Royal Banquet Dining Included'
  }
];

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
      "2 Complimentary VIP Access Passes to all theatrical showcases",
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
      "Prominent logo placement on main auditorium proscenium wings & banners",
      "Premium exhibition & experiential engagement space at entrance foyer",
      "Verbal acknowledgments by festival anchors before headline theatricals",
      "Co-branded stage track association (e.g., Nukkad or Classical Track)",
      "8 Complimentary All-Access VIP Passes & Delegate kits",
      "Dedicated digital push with product/brand integration reel"
    ]
  },
  {
    id: "Presenting Partner",
    amount: 100000,
    rateLabel: "₹1,00,000",
    name: "Presenting Partner",
    headline: "Headline title association: Own the spotlight and lead the national conclave.",
    badge: "Exclusive Title",
    isPopular: true,
    colorBg: "bg-[#fdfbf6]",
    colorBorder: "border-[#3b4928]",
    colorAccent: "text-[#3b4928]",
    features: [
      'Headline Title: "Cultrahus Sangam 2026 Presented by [Your Brand]"',
      "Largest logo prominence on main auditorium backdrop & outdoor arches",
      "Prime large-format experiential activation pavilion at festival grounds",
      "Keynote / Guest of Honour slot during National Conclave Valedictory Ceremony",
      "Broadcast of 60-second corporate film inside main auditorium before headline shows",
      "15 Complimentary Sovereign VIP Passes + Royal Banquet Hospitality",
      "Exclusive press kit quote and premier listing across national media dispatches"
    ]
  }
];

export const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Proscenium Lighting & Climax Monologue",
    category: "Theatre",
    url: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    title: "Street Theatre (Nukkad) High-Decibel Circle",
    category: "Street Play",
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    title: "Classical Kathak Rhythm & Mudra Ensemble",
    category: "Dance",
    url: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    title: "Youth Cultural Parliament Plenary Hall",
    category: "Parliament",
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    title: "Indie Folk Fusion Percussion Live",
    category: "Music",
    url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 6,
    title: "Grand Evening Garba & Dandiya Under Lights",
    category: "Dandiya & Finale",
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80"
  }
];

export const SCHEDULE_TIMELINE = [
  {
    time: "10:00 AM - 11:30 AM",
    title: "Inaugural Ceremony & National Natya Vandana",
    venue: "Main Proscenium Hall",
    description: "Lamp lighting with Padmashri Smt. Meenakshi Sanyal and address by Festival Chairman Prof. Virendra N. Kaul."
  },
  {
    time: "11:45 AM - 02:00 PM",
    title: "National Street Play Championship (Nukkad Natak Prelims)",
    venue: "Meghdoot Open Amphitheatre",
    description: "16 selected collegiate squads presenting socio-political and contemporary dramatizations."
  },
  {
    time: "02:00 PM - 03:00 PM",
    title: "High-Tea Networking & Sovereign Banquet",
    venue: "Delegates Dining Enclosure",
    description: "Artistic exchanges, director roundtables, and delegate lunch service."
  },
  {
    time: "03:15 PM - 05:30 PM",
    title: "National Youth Cultural Parliament (Plenary Debate)",
    venue: "Cultural Senate Chamber",
    description: "Deliberations on National Performing Arts Policy with voting by accredited delegates."
  },
  {
    time: "05:45 PM - 08:15 PM",
    title: "Curated Proscenium Stage Dramas (Finals)",
    venue: "Main Proscenium Hall",
    description: "Flagship theatrical performances with full stagecraft, lighting, and live score."
  },
  {
    time: "08:30 PM - 10:15 PM",
    title: "Grand Garba & Dandiya Raas Night",
    venue: "Festive Promenade & Open Courtyard",
    description: "Authentic Gujarati folk percussionists, live singing, and open-circle Dandiya for all pass holders."
  },
  {
    time: "10:15 PM - Midnight",
    title: "Celebrity Guest DJ & Sangeet Finale",
    venue: "Festival Central Stage",
    description: "Bass-heavy electronic folk remix headliner set celebrating youth and stage camaraderie."
  }
];
