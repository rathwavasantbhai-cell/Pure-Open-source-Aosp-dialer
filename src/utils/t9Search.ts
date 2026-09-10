import { Contact, CallLogItem } from '../types';

const CHAR_TO_T9: Record<string, string> = {
  a: '2', b: '2', c: '2',
  d: '3', e: '3', f: '3',
  g: '4', h: '4', i: '4',
  j: '5', k: '5', l: '5',
  m: '6', n: '6', o: '6',
  p: '7', q: '7', r: '7', s: '7',
  t: '8', u: '8', v: '8',
  w: '9', x: '9', y: '9', z: '9'
};

export function convertNameToT9(name: string): string {
  return name
    .toLowerCase()
    .split('')
    .map(c => CHAR_TO_T9[c] || (/\d/.test(c) ? c : ' '))
    .join('');
}

export function searchContactsT9(contacts: Contact[], query: string): Contact[] {
  if (!query.trim()) return [];
  const cleanQuery = query.replace(/\D/g, '');
  if (!cleanQuery) return [];

  return contacts.filter(contact => {
    const t9Name = convertNameToT9(contact.name);
    const rawDigits = contact.number.replace(/\D/g, '');
    return t9Name.includes(cleanQuery) || rawDigits.includes(cleanQuery);
  });
}

export const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'Alice Miller', number: '+1 (555) 234-5678', avatarColor: '#3b82f6', lastCalled: 'Yesterday' },
  { id: '2', name: 'Bob Johnson', number: '+1 (555) 345-6789', avatarColor: '#10b981', lastCalled: '2 days ago' },
  { id: '3', name: 'Charlie Davis', number: '+1 (555) 456-7890', avatarColor: '#8b5cf6', lastCalled: 'May 12' },
  { id: '4', name: 'Doctor Smith', number: '+1 (555) 678-1234', avatarColor: '#ef4444', lastCalled: 'May 10' },
  { id: '5', name: 'Emma Wilson', number: '+1 (555) 890-2345', avatarColor: '#ec4899', lastCalled: 'May 8' },
  { id: '6', name: 'Home', number: '+1 (555) 100-2000', avatarColor: '#f59e0b', lastCalled: 'Today' },
  { id: '7', name: 'Mom', number: '+1 (555) 999-8888', avatarColor: '#06b6d4', lastCalled: '15 mins ago' },
  { id: '8', name: 'Office Helpdesk', number: '+1 (555) 432-1098', avatarColor: '#6366f1', lastCalled: '3 days ago' },
  { id: '9', name: 'Sam Taylor', number: '+1 (555) 777-6655', avatarColor: '#14b8a6', lastCalled: 'Last week' },
];

export const INITIAL_CALL_LOGS: CallLogItem[] = [
  { id: 'cl-1', name: 'Mom', number: '+1 (555) 999-8888', direction: 'INCOMING', durationSeconds: 145, timestamp: Date.now() - 1000 * 60 * 18 },
  { id: 'cl-2', name: 'Alice Miller', number: '+1 (555) 234-5678', direction: 'OUTGOING', durationSeconds: 48, timestamp: Date.now() - 1000 * 60 * 95 },
  { id: 'cl-3', name: 'Doctor Smith', number: '+1 (555) 678-1234', direction: 'MISSED', durationSeconds: 0, timestamp: Date.now() - 1000 * 60 * 360 },
  { id: 'cl-4', name: 'Bob Johnson', number: '+1 (555) 345-6789', direction: 'INCOMING', durationSeconds: 210, timestamp: Date.now() - 1000 * 60 * 1440 },
  { id: 'cl-5', name: 'Home', number: '+1 (555) 100-2000', direction: 'OUTGOING', durationSeconds: 92, timestamp: Date.now() - 1000 * 60 * 2800 },
];
