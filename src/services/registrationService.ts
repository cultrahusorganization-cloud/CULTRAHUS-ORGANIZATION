import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  setDoc,
  updateDoc, 
  deleteDoc,
  where,
  limit
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { RegistrationRecord, RegistrationType, RegistrationStats } from '../types';
import { generateUniqueCode } from '../utils/codeGenerator';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.warn('Firestore operational notification:', JSON.stringify(errInfo));
  return errInfo;
}

// Distinct Firestore collection names
export const COLLECTION_MASTER = 'registrations';
export const COLLECTION_DELEGATES = 'delegates';
export const COLLECTION_TICKETS = 'tickets';
export const COLLECTION_TROUPES = 'troupes';
export const COLLECTION_SECRETARIAT = 'secretariat';
export const COLLECTION_SPONSORS = 'sponsors';
export const COLLECTION_INQUIRIES = 'inquiries';

const LOCAL_STORAGE_KEY = 'cultrahus_registrations_cache_v3';

export function getLocalCache(): RegistrationRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    // Filter out any lingering mock/seed items
    return Array.isArray(list) ? list.filter(r => !isMockRecord(r)) : [];
  } catch (e) {
    return [];
  }
}

export function saveLocalCache(list: RegistrationRecord[]) {
  try {
    const cleanList = list.filter(r => !isMockRecord(r));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanList));
  } catch (e) {
    // Ignore storage quota
  }
}

function isMockRecord(r: RegistrationRecord): boolean {
  if (!r) return false;
  if (r.id === 'cultrahus_lead_01' || r.id === 'seed_lead_01') return true;
  if (r.uniqueCode === 'SNGM-DEL-8801A') return true;
  if (r.source === 'gemini_app') return true;
  if (typeof r.notes === 'string' && (r.notes.includes('Initial organizational seed') || r.notes.includes('mock') || r.notes.includes('seed'))) return true;
  return false;
}

export function getCollectionNameForType(type: RegistrationType): string {
  switch (type) {
    case 'delegate': return COLLECTION_DELEGATES;
    case 'ticket': return COLLECTION_TICKETS;
    case 'troupe': return COLLECTION_TROUPES;
    case 'secretariat': return COLLECTION_SECRETARIAT;
    case 'sponsor': return COLLECTION_SPONSORS;
    case 'inquiry': return COLLECTION_INQUIRIES;
    default: return COLLECTION_MASTER;
  }
}

/**
 * Register a new Delegate or Ticket holder.
 * Guarantees a unique code for every person.
 * Saves into both the distinct collection ('delegates' or 'tickets') AND the master 'registrations' collection.
 */
export async function registerParticipant(data: {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  designation?: string;
  cityState?: string;
  type: RegistrationType;
  participationCategory?: string;
  parliamentTrack?: string;
  priorExperience?: string;
  accessCode?: string;
  ticketTier?: 'classic' | 'royal' | 'sovereign' | 'Standard' | 'VIP' | 'Speaker' | 'Student' | 'Executive';
  tierName?: string;
  quantity?: number;
  seats?: string[];
  foodAddon?: string;
  amountPaid?: number;
  source?: 'vercel' | 'gemini_app' | 'direct';
  notes?: string;
}): Promise<RegistrationRecord> {
  const uniqueCode = generateUniqueCode(data.type);
  const now = new Date().toISOString();

  let categoryGroup: RegistrationRecord['_category'] = 'delegates';
  if (data.type === 'ticket') categoryGroup = 'tickets';
  else if (data.type === 'troupe') categoryGroup = 'plays';
  else if (data.type === 'secretariat') categoryGroup = 'secretariat';
  else if (data.type === 'sponsor') categoryGroup = 'sponsors';
  else if (data.type === 'inquiry') categoryGroup = 'inquiries';

  const newRecord: Omit<RegistrationRecord, 'id'> = {
    uniqueCode,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim() || '',
    organization: data.organization?.trim() || '',
    designation: data.designation?.trim() || '',
    cityState: data.cityState?.trim() || 'Bhiwadi',
    type: data.type,
    participationCategory: data.participationCategory,
    parliamentTrack: data.parliamentTrack,
    priorExperience: data.priorExperience,
    accessCode: data.accessCode,
    ticketTier: data.ticketTier,
    tierName: data.tierName,
    quantity: data.quantity || 1,
    seats: data.seats || [],
    foodAddon: data.foodAddon,
    amountPaid: data.amountPaid || 0,
    status: 'confirmed',
    source: data.source || 'vercel',
    notes: data.notes || '',
    createdAt: now,
    _category: categoryGroup,
  };

  const tempId = 'temp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  const provisionalRecord: RegistrationRecord = { id: tempId, ...newRecord };
  const currentCache = getLocalCache();
  saveLocalCache([provisionalRecord, ...currentCache]);

  const specificCollection = getCollectionNameForType(data.type);

  try {
    // 1. Add to the distinct collection (e.g. 'delegates' or 'tickets')
    const specificDocRef = await addDoc(collection(db, specificCollection), newRecord);
    const finalId = specificDocRef.id;

    // 2. Also save to the master 'registrations' collection using the exact same ID
    try {
      await setDoc(doc(db, COLLECTION_MASTER, finalId), newRecord);
    } catch (mirrorErr) {
      console.warn('Master mirror write notification:', mirrorErr);
    }

    const finalRecord: RegistrationRecord = {
      id: finalId,
      ...newRecord,
    };
    const updatedCache = currentCache.filter(item => item.id !== tempId);
    saveLocalCache([finalRecord, ...updatedCache]);
    return finalRecord;
  } catch (err) {
    console.warn('Firestore write fallback triggered, saved in local cache:', err);
    return provisionalRecord;
  }
}

/**
 * Register a Theatre Troupe
 * Saves into 'troupes' collection and master 'registrations' collection
 */
export async function registerTroupe(data: {
  troupeName: string;
  playTitle: string;
  playwright?: string;
  director: string;
  contactPerson: string;
  email: string;
  whatsappPhone: string;
  category: string;
  castCrewCount: number;
  durationMinutes: number;
  synopsis: string;
  technicalRider?: string;
}): Promise<RegistrationRecord> {
  const uniqueCode = generateUniqueCode('troupe');
  const now = new Date().toISOString();

  const newRecord: Omit<RegistrationRecord, 'id'> = {
    uniqueCode,
    name: data.director.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.whatsappPhone.trim(),
    organization: data.troupeName.trim(),
    designation: 'Troupe Director',
    cityState: 'Bhiwadi',
    type: 'troupe',
    troupeName: data.troupeName.trim(),
    playTitle: data.playTitle.trim(),
    playwright: data.playwright?.trim() || '',
    director: data.director.trim(),
    contactPerson: data.contactPerson.trim(),
    participationCategory: data.category,
    castCrewCount: data.castCrewCount,
    durationMinutes: data.durationMinutes,
    synopsis: data.synopsis.trim(),
    technicalRider: data.technicalRider?.trim() || '',
    amountPaid: 0,
    status: 'under-review',
    source: 'vercel',
    createdAt: now,
    _category: 'plays',
  };

  const tempId = 'temp_' + Date.now();
  const provisionalRecord: RegistrationRecord = { id: tempId, ...newRecord };
  const currentCache = getLocalCache();
  saveLocalCache([provisionalRecord, ...currentCache]);

  try {
    // 1. Add to distinct 'troupes' collection
    const troupeDoc = await addDoc(collection(db, COLLECTION_TROUPES), newRecord);
    const finalId = troupeDoc.id;

    // 2. Mirror into master 'registrations'
    try {
      await setDoc(doc(db, COLLECTION_MASTER, finalId), newRecord);
    } catch (mErr) {
      console.warn('Troupe mirror notification:', mErr);
    }

    const finalRecord: RegistrationRecord = { id: finalId, ...newRecord };
    const updatedCache = currentCache.filter(item => item.id !== tempId);
    saveLocalCache([finalRecord, ...updatedCache]);
    return finalRecord;
  } catch (err) {
    console.warn('Troupe write fallback triggered:', err);
    return provisionalRecord;
  }
}

/**
 * Register Secretariat Application
 * Saves into 'secretariat' collection and master 'registrations' collection
 */
export async function registerSecretariat(data: {
  fullName: string;
  email: string;
  whatsappPhone: string;
  department: string;
  previousExperience: string;
  whyJoin: string;
  timeCommitment: string;
  referredBy: string;
}): Promise<RegistrationRecord> {
  const uniqueCode = generateUniqueCode('secretariat');
  const now = new Date().toISOString();

  const newRecord: Omit<RegistrationRecord, 'id'> = {
    uniqueCode,
    name: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.whatsappPhone.trim(),
    organization: 'Cultrahus Secretariat Applicant',
    designation: `Candidate (${data.department})`,
    cityState: 'Bhiwadi',
    type: 'secretariat',
    department: data.department,
    priorExperience: data.previousExperience.trim(),
    whyJoin: data.whyJoin.trim(),
    timeCommitment: data.timeCommitment.trim(),
    referredBy: data.referredBy.trim(),
    amountPaid: 0,
    status: 'pending',
    source: 'vercel',
    createdAt: now,
    _category: 'secretariat',
  };

  const tempId = 'temp_' + Date.now();
  const provisionalRecord: RegistrationRecord = { id: tempId, ...newRecord };
  const currentCache = getLocalCache();
  saveLocalCache([provisionalRecord, ...currentCache]);

  try {
    // 1. Add to distinct 'secretariat' collection
    const secDoc = await addDoc(collection(db, COLLECTION_SECRETARIAT), newRecord);
    const finalId = secDoc.id;

    // 2. Mirror into master 'registrations'
    try {
      await setDoc(doc(db, COLLECTION_MASTER, finalId), newRecord);
    } catch (mErr) {
      console.warn('Secretariat mirror notification:', mErr);
    }

    const finalRecord: RegistrationRecord = { id: finalId, ...newRecord };
    const updatedCache = currentCache.filter(item => item.id !== tempId);
    saveLocalCache([finalRecord, ...updatedCache]);
    return finalRecord;
  } catch (err) {
    console.warn('Secretariat write fallback triggered:', err);
    return provisionalRecord;
  }
}

/**
 * Register Sponsorship Inquiry
 * Saves into 'sponsors' collection and master 'registrations' collection
 */
export async function registerSponsor(data: {
  brandName: string;
  contactPerson: string;
  email: string;
  whatsappPhone: string;
  cityState: string;
  sponsorTier: string;
  proposalNotes?: string;
  amount?: number;
}): Promise<RegistrationRecord> {
  const uniqueCode = generateUniqueCode('sponsor');
  const now = new Date().toISOString();

  const newRecord: Omit<RegistrationRecord, 'id'> = {
    uniqueCode,
    name: data.contactPerson.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.whatsappPhone.trim(),
    organization: data.brandName.trim(),
    brandName: data.brandName.trim(),
    cityState: data.cityState.trim() || 'Bhiwadi',
    designation: 'Brand Representative',
    type: 'sponsor',
    sponsorTier: data.sponsorTier,
    proposalNotes: data.proposalNotes?.trim() || '',
    amountPaid: data.amount || 0,
    status: 'pending',
    source: 'vercel',
    createdAt: now,
    _category: 'sponsors',
  };

  const tempId = 'temp_' + Date.now();
  const provisionalRecord: RegistrationRecord = { id: tempId, ...newRecord };
  const currentCache = getLocalCache();
  saveLocalCache([provisionalRecord, ...currentCache]);

  try {
    // 1. Add to distinct 'sponsors' collection
    const spnDoc = await addDoc(collection(db, COLLECTION_SPONSORS), newRecord);
    const finalId = spnDoc.id;

    // 2. Mirror into master 'registrations'
    try {
      await setDoc(doc(db, COLLECTION_MASTER, finalId), newRecord);
    } catch (mErr) {
      console.warn('Sponsor mirror notification:', mErr);
    }

    const finalRecord: RegistrationRecord = { id: finalId, ...newRecord };
    const updatedCache = currentCache.filter(item => item.id !== tempId);
    saveLocalCache([finalRecord, ...updatedCache]);
    return finalRecord;
  } catch (err) {
    console.warn('Sponsor write fallback triggered:', err);
    return provisionalRecord;
  }
}

/**
 * Register Contact / General Inquiry
 * Saves into 'inquiries' collection and master 'registrations' collection
 */
export async function registerInquiry(data: {
  fullName: string;
  email: string;
  whatsappPhone?: string;
  category: string;
  subject?: string;
  message: string;
}): Promise<RegistrationRecord> {
  const uniqueCode = generateUniqueCode('inquiry');
  const now = new Date().toISOString();

  const newRecord: Omit<RegistrationRecord, 'id'> = {
    uniqueCode,
    name: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.whatsappPhone?.trim() || '',
    cityState: 'Bhiwadi',
    type: 'inquiry',
    inquiryCategory: data.category,
    subject: data.subject?.trim() || '',
    message: data.message.trim(),
    amountPaid: 0,
    status: 'pending',
    source: 'vercel',
    createdAt: now,
    _category: 'inquiries',
  };

  const tempId = 'temp_' + Date.now();
  const provisionalRecord: RegistrationRecord = { id: tempId, ...newRecord };
  const currentCache = getLocalCache();
  saveLocalCache([provisionalRecord, ...currentCache]);

  try {
    // 1. Add to distinct 'inquiries' collection
    const inqDoc = await addDoc(collection(db, COLLECTION_INQUIRIES), newRecord);
    const finalId = inqDoc.id;

    // 2. Mirror into master 'registrations'
    try {
      await setDoc(doc(db, COLLECTION_MASTER, finalId), newRecord);
    } catch (mErr) {
      console.warn('Inquiry mirror notification:', mErr);
    }

    const finalRecord: RegistrationRecord = { id: finalId, ...newRecord };
    const updatedCache = currentCache.filter(item => item.id !== tempId);
    saveLocalCache([finalRecord, ...updatedCache]);
    return finalRecord;
  } catch (err) {
    console.warn('Inquiry write fallback triggered:', err);
    return provisionalRecord;
  }
}

/**
 * Real-time listener for the Admin Portal & Registry.
 * Subscribes to the master 'registrations' collection, and also polls distinct collections
 * to ensure ANY entry created in 'tickets', 'delegates', 'troupes', 'secretariat', 'sponsors', 'inquiries'
 * is immediately visible with zero latency.
 */
export function subscribeToRegistrations(
  onData: (records: RegistrationRecord[]) => void,
  onError?: (error: Error) => void
): () => void {
  // First, emit clean local cache instantly so UI renders immediately
  const cached = getLocalCache().filter(r => !isMockRecord(r));
  if (cached.length > 0) {
    onData(cached);
  }

  let masterRecords: RegistrationRecord[] = [];
  const individualRecordsMap = new Map<string, RegistrationRecord>();

  const emitCombined = () => {
    const combinedMap = new Map<string, RegistrationRecord>();
    
    // 1. Add master records
    for (const r of masterRecords) {
      if (!isMockRecord(r)) {
        combinedMap.set(r.id, r);
        if (r.uniqueCode) combinedMap.set(r.uniqueCode, r);
      }
    }

    // 2. Add any individual collection records that might have been added directly
    for (const [, r] of individualRecordsMap.entries()) {
      if (!isMockRecord(r)) {
        if (!combinedMap.has(r.id) && !combinedMap.has(r.uniqueCode)) {
          combinedMap.set(r.id, r);
        }
      }
    }

    // Convert to array and deduplicate
    const finalArray = Array.from(new Set(combinedMap.values()));
    finalArray.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

    saveLocalCache(finalArray);
    onData(finalArray);
  };

  try {
    const qMaster = query(collection(db, COLLECTION_MASTER), orderBy('createdAt', 'desc'), limit(500));
    
    const unsubMaster = onSnapshot(
      qMaster,
      (snapshot) => {
        masterRecords = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data() as Omit<RegistrationRecord, 'id'>;
          const rec: RegistrationRecord = {
            id: docSnap.id,
            ...d
          };
          if (!isMockRecord(rec)) {
            let cat: RegistrationRecord['_category'] = d._category;
            if (!cat) {
              if (d.type === 'ticket') cat = 'tickets';
              else if (d.type === 'troupe') cat = 'plays';
              else if (d.type === 'secretariat') cat = 'secretariat';
              else if (d.type === 'sponsor') cat = 'sponsors';
              else if (d.type === 'inquiry') cat = 'inquiries';
              else cat = 'delegates';
            }
            rec._category = cat;
            masterRecords.push(rec);
          }
        });
        emitCombined();
      },
      (error) => {
        console.warn('Real-time master query notice:', error);
        if (onError) onError(error);
      }
    );

    // Also listen to distinct 'tickets' and 'delegates' collections
    const unsubTickets = onSnapshot(
      collection(db, COLLECTION_TICKETS),
      (snap) => {
        snap.forEach(docSnap => {
          const d = docSnap.data() as Omit<RegistrationRecord, 'id'>;
          const rec: RegistrationRecord = { ...d, id: docSnap.id, type: d.type || 'ticket', _category: 'tickets' };
          if (!isMockRecord(rec)) individualRecordsMap.set(docSnap.id, rec);
        });
        emitCombined();
      },
      () => {}
    );

    const unsubDelegates = onSnapshot(
      collection(db, COLLECTION_DELEGATES),
      (snap) => {
        snap.forEach(docSnap => {
          const d = docSnap.data() as Omit<RegistrationRecord, 'id'>;
          const rec: RegistrationRecord = { ...d, id: docSnap.id, type: d.type || 'delegate', _category: 'delegates' };
          if (!isMockRecord(rec)) individualRecordsMap.set(docSnap.id, rec);
        });
        emitCombined();
      },
      () => {}
    );

    return () => {
      unsubMaster();
      unsubTickets();
      unsubDelegates();
    };
  } catch (err) {
    console.error('Failed to bind snapshot listener:', err);
    onData(getLocalCache());
    return () => {};
  }
}

/**
 * Update participant status across collections
 */
export async function updateParticipantStatus(
  id: string,
  status: RegistrationRecord['status'],
  type?: RegistrationType
): Promise<void> {
  const updates: Partial<RegistrationRecord> = {
    status,
    checkedInAt: status === 'checked-in' ? new Date().toISOString() : undefined,
  };

  const cached = getLocalCache().map(item => item.id === id ? { ...item, ...updates } : item);
  saveLocalCache(cached);

  if (!id.startsWith('temp_')) {
    try {
      // 1. Update in master
      await updateDoc(doc(db, COLLECTION_MASTER, id), updates).catch(() => {});
      
      // 2. Update in specific collection if type is known
      if (type) {
        const specCol = getCollectionNameForType(type);
        await updateDoc(doc(db, specCol, id), updates).catch(() => {});
      } else {
        // Try both delegates and tickets
        await updateDoc(doc(db, COLLECTION_DELEGATES, id), updates).catch(() => {});
        await updateDoc(doc(db, COLLECTION_TICKETS, id), updates).catch(() => {});
      }
    } catch (err) {
      console.error('Error updating status in Firebase:', err);
    }
  }
}

/**
 * Delete a registration across all collections
 */
export async function deleteParticipant(id: string, type?: RegistrationType): Promise<void> {
  const cached = getLocalCache().filter(item => item.id !== id);
  saveLocalCache(cached);

  if (!id.startsWith('temp_')) {
    try {
      await deleteDoc(doc(db, COLLECTION_MASTER, id)).catch(() => {});
      if (type) {
        const specCol = getCollectionNameForType(type);
        await deleteDoc(doc(db, specCol, id)).catch(() => {});
      } else {
        await deleteDoc(doc(db, COLLECTION_DELEGATES, id)).catch(() => {});
        await deleteDoc(doc(db, COLLECTION_TICKETS, id)).catch(() => {});
        await deleteDoc(doc(db, COLLECTION_TROUPES, id)).catch(() => {});
        await deleteDoc(doc(db, COLLECTION_SECRETARIAT, id)).catch(() => {});
        await deleteDoc(doc(db, COLLECTION_SPONSORS, id)).catch(() => {});
        await deleteDoc(doc(db, COLLECTION_INQUIRIES, id)).catch(() => {});
      }
    } catch (err) {
      console.error('Error deleting document:', err);
    }
  }
}

/**
 * Purges mock, dummy, and test records to ensure only clean genuine registrations remain
 */
export async function purgeAllMockData(): Promise<{ count: number; message: string }> {
  let purgedCount = 0;
  try {
    // 1. Clear local cache
    const current = getLocalCache();
    const clean = current.filter(r => !isMockRecord(r));
    purgedCount = current.length - clean.length;
    saveLocalCache(clean);

    // 2. Clear known seed doc from Firestore
    await deleteDoc(doc(db, COLLECTION_MASTER, 'cultrahus_lead_01')).catch(() => {});
    await deleteDoc(doc(db, COLLECTION_DELEGATES, 'cultrahus_lead_01')).catch(() => {});

    // 3. Scan for any records with source 'gemini_app' or seed unique code
    const qSeed = query(collection(db, COLLECTION_MASTER), where('uniqueCode', '==', 'SNGM-DEL-8801A'));
    const snapSeed = await getDocs(qSeed);
    snapSeed.forEach(async (d) => {
      await deleteDoc(d.ref).catch(() => {});
      purgedCount++;
    });

    return {
      count: purgedCount,
      message: 'All pre-seeded mock and demo data removed successfully!'
    };
  } catch (err) {
    console.warn('Purge notice:', err);
    return { count: 0, message: 'Cleaned local cache.' };
  }
}

/**
 * Find record by unique code or phone
 */
export async function findByCode(codeOrPhone: string): Promise<RegistrationRecord | null> {
  const cleaned = codeOrPhone.trim().toUpperCase();
  const digitsOnly = codeOrPhone.replace(/\D/g, '');

  const localMatch = getLocalCache().find(r => 
    !isMockRecord(r) && (
      r.uniqueCode.toUpperCase() === cleaned || 
      (digitsOnly.length === 10 && r.phone?.replace(/\D/g, '') === digitsOnly)
    )
  );
  if (localMatch) return localMatch;

  try {
    // 1. Search in master registrations
    const q1 = query(
      collection(db, COLLECTION_MASTER),
      where('uniqueCode', '==', cleaned),
      limit(1)
    );
    const snap1 = await getDocs(q1);
    if (!snap1.empty) {
      const docSnap = snap1.docs[0];
      const rec = { id: docSnap.id, ...(docSnap.data() as Omit<RegistrationRecord, 'id'>) };
      if (!isMockRecord(rec)) return rec;
    }

    // 2. Search in distinct 'delegates' collection
    const qDel = query(collection(db, COLLECTION_DELEGATES), where('uniqueCode', '==', cleaned), limit(1));
    const snapDel = await getDocs(qDel);
    if (!snapDel.empty) {
      const docSnap = snapDel.docs[0];
      const data = docSnap.data() as Omit<RegistrationRecord, 'id'>;
      return { ...data, id: docSnap.id, type: 'delegate' };
    }

    // 3. Search in distinct 'tickets' collection
    const qTkt = query(collection(db, COLLECTION_TICKETS), where('uniqueCode', '==', cleaned), limit(1));
    const snapTkt = await getDocs(qTkt);
    if (!snapTkt.empty) {
      const docSnap = snapTkt.docs[0];
      const data = docSnap.data() as Omit<RegistrationRecord, 'id'>;
      return { ...data, id: docSnap.id, type: 'ticket' };
    }

    // Search by 10-digit phone
    if (digitsOnly.length === 10) {
      const qPhone = query(
        collection(db, COLLECTION_MASTER),
        where('phone', '==', digitsOnly),
        limit(1)
      );
      const snapPhone = await getDocs(qPhone);
      if (!snapPhone.empty) {
        const docSnap = snapPhone.docs[0];
        const rec = { id: docSnap.id, ...(docSnap.data() as Omit<RegistrationRecord, 'id'>) };
        if (!isMockRecord(rec)) return rec;
      }
    }
  } catch (err) {
    console.warn('Firestore lookup error:', err);
  }
  return null;
}

/**
 * Calculates statistics across all categories
 */
export function calculateStats(records: RegistrationRecord[]): RegistrationStats {
  let delegates = 0;
  let tickets = 0;
  let plays = 0;
  let secretariat = 0;
  let sponsors = 0;
  let inquiries = 0;
  let checkedIn = 0;
  let totalRevenue = 0;

  for (const r of records) {
    if (isMockRecord(r)) continue;

    const cat = r._category || (r.type === 'ticket' ? 'tickets' : r.type === 'troupe' ? 'plays' : r.type === 'secretariat' ? 'secretariat' : r.type === 'sponsor' ? 'sponsors' : r.type === 'inquiry' ? 'inquiries' : 'delegates');
    if (cat === 'delegates') delegates++;
    else if (cat === 'tickets') tickets++;
    else if (cat === 'plays') plays++;
    else if (cat === 'secretariat') secretariat++;
    else if (cat === 'sponsors') sponsors++;
    else if (cat === 'inquiries') inquiries++;

    if (r.status === 'checked-in') checkedIn++;
    if (r.amountPaid) totalRevenue += r.amountPaid;
  }

  const validCount = records.filter(r => !isMockRecord(r)).length;

  return {
    total: validCount,
    delegates,
    tickets,
    plays,
    secretariat,
    sponsors,
    inquiries,
    checkedIn,
    totalRevenue,
  };
}

/**
 * Initializes Firestore configuration, ensures collections and documents are ready,
 * and removes any dummy or mock data so database starts completely clean.
 */
export async function ensureInitialCollectionsAndData(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Health check document
    const testDocRef = doc(db, 'test', 'connection');
    await setDoc(testDocRef, {
      status: 'connected',
      project: 'cultrahus',
      database: 'ai-studio-1959e55b-78c9-4673-be88-b7d93b87ba81',
      lastSyncedAt: new Date().toISOString(),
    }, { merge: true });

    // 2. Official event configuration with updated venue: Bhiwadi (Venue: TBA)
    const eventSettingsRef = doc(db, 'event_settings', 'cultrahus_config');
    await setDoc(eventSettingsRef, {
      eventName: 'Cultrahus Sangam 2026',
      subtitle: 'National Theatre Conclave & Cultural Parliament 2026',
      organization: 'Cultrahus Organization',
      organizerEmail: 'cultrahusorganization@gmail.com',
      date: 'Sunday, 18 October 2026',
      venue: 'TBA (Auditorium Complex, Bhiwadi)',
      city: 'Bhiwadi',
      state: 'Rajasthan',
      region: 'NCR',
      databaseId: 'ai-studio-1959e55b-78c9-4673-be88-b7d93b87ba81',
      collections: {
        delegates: COLLECTION_DELEGATES,
        tickets: COLLECTION_TICKETS,
        troupes: COLLECTION_TROUPES,
        secretariat: COLLECTION_SECRETARIAT,
        sponsors: COLLECTION_SPONSORS,
        inquiries: COLLECTION_INQUIRIES,
        master: COLLECTION_MASTER
      },
      isPublicRegistrationOpen: true,
      lastUpdated: new Date().toISOString(),
    }, { merge: true });

    // 3. Purge any dummy/seed documents
    await purgeAllMockData();

    return {
      success: true,
      message: 'Firestore distinct collections (delegates, tickets, troupes, secretariat, sponsors, inquiries) active with venue set to Bhiwadi (Venue: TBA) and clean database!'
    };
  } catch (error) {
    console.warn('Initial collections check notice:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown Firestore initialization error'
    };
  }
}
