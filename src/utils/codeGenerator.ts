import { RegistrationType } from '../types';

/**
 * Generates an unmistakable, high-entropy unique pass/badge code
 * Format: SNGM-[DEL|TKT|TRP|SEC|SPN|INQ]-[RANDOM_ALPHANUMERIC]
 * e.g. SNGM-DEL-89421 or SNGM-TKT-31958
 */
export function generateUniqueCode(type: RegistrationType): string {
  let prefix = 'SNGM-DEL';
  if (type === 'ticket') prefix = 'SNGM-TKT';
  else if (type === 'troupe') prefix = 'SNGM-TRP';
  else if (type === 'secretariat') prefix = 'SNGM-SEC';
  else if (type === 'sponsor') prefix = 'SNGM-SPN';
  else if (type === 'inquiry') prefix = 'SNGM-INQ';

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 5; i++) {
    rand += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${rand}`;
}

export function isValidCode(code: string): boolean {
  return /^(SNGM|CLT)-(DEL|TCK|TKT|TRP|SEC|SPN|INQ)-[A-Z0-9]{4,8}$/i.test(code.trim());
}
