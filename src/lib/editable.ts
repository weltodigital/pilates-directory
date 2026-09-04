import { CLASS_TYPE_OPTIONS, field, isEmail, normaliseUrl } from '@/lib/validation'

/**
 * What a studio owner may change, and what each value has to look like.
 *
 * Name, address, postcode and coordinates are deliberately absent. They
 * decide the listing's URL and its place on the map, and a change to any of
 * them describes a different studio rather than a correction to this one.
 * Those go through us by email.
 *
 * This list is the whole allowlist: the edit route reads keys from here and
 * ignores anything else in the request body, so an extra field posted by hand
 * cannot reach the table.
 */

export type FieldType =
  | 'text' | 'textarea' | 'url' | 'email' | 'tel'
  | 'number' | 'money' | 'bool' | 'tags' | 'hours'

export interface EditableField {
  key: string;
  label: string;
  type: FieldType;
  group: string;
  hint?: string;
  options?: string[];
  max?: number;
}

export const DAYS = [
  'monday', 'tuesday', 'wednesday', 'thursday',
  'friday', 'saturday', 'sunday',
]

export const EDITABLE_FIELDS: EditableField[] = [
  // ------------------------------------------------------------- about
  {
    key: 'description', label: 'About the studio', type: 'textarea', group: 'About',
    max: 800,
    hint: 'A few sentences on what you offer and who it suits. Plain text, no links.',
  },

  // --------------------------------------------------- contact & booking
  { key: 'phone', label: 'Phone', type: 'tel', group: 'Contact and booking', max: 40 },
  {
    key: 'email', label: 'Public email', type: 'email', group: 'Contact and booking',
    hint: 'Shown on your listing. It does not have to be your sign-in address.',
  },
  { key: 'website', label: 'Website', type: 'url', group: 'Contact and booking' },
  {
    key: 'booking_url', label: 'Booking link', type: 'url', group: 'Contact and booking',
    hint: 'Where visitors book a class - your timetable, or your booking platform.',
  },
  {
    key: 'online_booking_available', label: 'Classes can be booked online',
    type: 'bool', group: 'Contact and booking',
  },

  // ------------------------------------------------------------ classes
  {
    key: 'class_types', label: 'Class types', type: 'tags', group: 'Classes',
    options: CLASS_TYPE_OPTIONS,
  },
  {
    key: 'class_levels', label: 'Levels taught', type: 'tags', group: 'Classes',
    options: ['Beginner', 'Improver', 'Intermediate', 'Advanced'],
  },
  {
    key: 'goal_tags', label: 'What people come to you for', type: 'tags', group: 'Classes',
    options: [
      'Back pain', 'Posture', 'Prenatal', 'Postnatal', 'Over 60s',
      'Rehabilitation', 'Sports performance', 'Strength', 'Flexibility',
    ],
  },
  {
    key: 'schedule_tags', label: 'When you run classes', type: 'tags', group: 'Classes',
    options: ['Early morning', 'Daytime', 'Evening', 'Weekend'],
  },
  {
    key: 'class_size_max', label: 'Maximum class size', type: 'number', group: 'Classes',
    hint: 'Places in your largest group class.',
  },
  {
    key: 'beginner_friendly', label: 'Suitable for complete beginners',
    type: 'bool', group: 'Classes',
  },

  // ------------------------------------------------------------- prices
  {
    key: 'price_drop_in', label: 'Drop-in class', type: 'money', group: 'Prices',
    hint: 'Price of a single class, in pounds.',
  },
  {
    key: 'price_class_pack', label: 'Class pack', type: 'text', group: 'Prices',
    max: 120, hint: 'For example: 10-class pack £230',
  },
  {
    key: 'price_membership', label: 'Membership', type: 'text', group: 'Prices',
    max: 120, hint: 'For example: unlimited monthly £120',
  },
  {
    key: 'price_intro_offer', label: 'Intro offer', type: 'text', group: 'Prices',
    max: 160, hint: 'For example: first class free, or 3 classes for £30',
  },

  // --------------------------------------------------------- facilities
  {
    key: 'equipment_available', label: 'Equipment', type: 'tags', group: 'Facilities',
    options: [
      'Reformers', 'Mats', 'Cadillac', 'Wunda Chair', 'Ladder Barrel',
      'Spine Corrector', 'Tower', 'Pilates Rings', 'Resistance Bands',
      'Small Props',
    ],
  },
  {
    key: 'instructor_qualifications', label: 'Instructor qualifications',
    type: 'tags', group: 'Facilities',
    options: ['BASI', 'Body Control', 'APPI', 'Polestar', 'STOTT', 'PMA', 'HCPC', 'CSP'],
  },
  { key: 'parking_available', label: 'Parking available', type: 'bool', group: 'Facilities' },
  {
    key: 'accessibility_features', label: 'Accessibility', type: 'tags', group: 'Facilities',
    options: [
      'Wheelchair accessible entrance', 'Wheelchair accessible parking',
      'Wheelchair accessible toilet', 'Step-free access', 'Lift',
      'Accessible changing room',
    ],
  },

  // ------------------------------------------------------ opening hours
  {
    key: 'opening_hours', label: 'Opening hours', type: 'hours', group: 'Opening hours',
    hint: 'Leave a day blank if you are closed. For example: 7:00 AM - 8:00 PM',
  },
]

export const EDITABLE_KEYS = EDITABLE_FIELDS.map(f => f.key)

export const FIELD_GROUPS = EDITABLE_FIELDS.reduce<Record<string, EditableField[]>>(
  (groups, f) => {
    (groups[f.group] ||= []).push(f);
    return groups;
  },
  {}
);

export function fieldSpec(key: string): EditableField | undefined {
  return EDITABLE_FIELDS.find(f => f.key === key);
}

/**
 * Coerce one submitted value to what the column expects, or explain why it
 * cannot be. Absent and empty both mean "clear this field", which is a
 * legitimate edit: a studio that stopped offering memberships needs to be
 * able to remove the price.
 */
export function parseValue(spec: EditableField, raw: unknown): { value: any } | { error: string } {
  switch (spec.type) {
    case 'text':
    case 'textarea': {
      const v = field(raw, spec.max || 300);
      return { value: v };
    }

    case 'tel': {
      const v = field(raw, 40);
      if (v && !/^[\d\s()+-]{7,}$/.test(v)) return { error: 'That does not look like a phone number.' };
      return { value: v };
    }

    case 'email': {
      const v = field(raw, 254);
      if (v && !isEmail(v)) return { error: 'Enter a valid email address.' };
      return { value: v ? v.toLowerCase() : null };
    }

    case 'url': {
      const v = field(raw, 300);
      if (!v) return { value: null };
      const url = normaliseUrl(v);
      if (!url) return { error: 'Enter a full web address, for example https://yourstudio.co.uk' };
      return { value: url };
    }

    case 'number': {
      if (raw === null || raw === undefined || raw === '') return { value: null };
      const n = Number(raw);
      if (!Number.isInteger(n) || n < 1 || n > 200) return { error: 'Enter a whole number between 1 and 200.' };
      return { value: n };
    }

    case 'money': {
      if (raw === null || raw === undefined || raw === '') return { value: null };
      const n = Number(String(raw).replace(/[£,\s]/g, ''));
      if (!Number.isFinite(n) || n < 0 || n > 10000) return { error: 'Enter a price in pounds, for example 22.50' };
      return { value: Math.round(n * 100) / 100 };
    }

    case 'bool': {
      if (raw === null || raw === undefined || raw === '') return { value: null };
      return { value: raw === true || raw === 'true' || raw === 'yes' };
    }

    case 'tags': {
      if (!Array.isArray(raw)) return { value: null };
      const allowed = new Set(spec.options || []);
      const out = raw.filter((v): v is string => typeof v === 'string' && allowed.has(v));
      return { value: out.length ? out : null };
    }

    case 'hours': {
      if (raw === null || raw === undefined) return { value: null };
      if (typeof raw !== 'object' || Array.isArray(raw)) return { error: 'Opening hours are not in the expected format.' };
      const out: Record<string, string> = {};
      for (const day of DAYS) {
        const v = field((raw as any)[day], 60);
        if (v) out[day] = v;
      }
      return { value: Object.keys(out).length ? out : null };
    }
  }
}

/**
 * Stable JSON, with object keys in a fixed order.
 *
 * Needed because opening_hours is a jsonb column: Postgres stores its keys in
 * its own canonical order (by length, then bytewise), while the form rebuilds
 * them Monday-first. Comparing the two with plain JSON.stringify reported a
 * change on every save, whether or not a single hour had been touched.
 */
function canonical(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

/**
 * True when a stored value and a submitted one are the same edit.
 *
 * An empty tag list counts as no value. The columns hold a mix of null and
 * [] for "nothing selected", and treating those as different recorded a
 * change every time an owner saved a form whose tags they had never touched
 * - which then published as a deliberate clear.
 */
export function sameValue(a: unknown, b: unknown): boolean {
  const empty = (v: unknown) =>
    v === null || v === undefined || (Array.isArray(v) && v.length === 0);
  if (a === b) return true;
  if (empty(a) && empty(b)) return true;
  return canonical(a ?? null) === canonical(b ?? null);
}

/** Human-readable rendering of a stored value, for the review screen. */
export function displayValue(spec: EditableField | undefined, value: unknown): string {
  if (value === null || value === undefined || value === '') return '(empty)';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (spec?.type === 'money') return `£${Number(value).toFixed(2)}`;
  if (spec?.type === 'hours' && typeof value === 'object') {
    return DAYS
      .filter(d => (value as any)[d])
      .map(d => `${d[0].toUpperCase()}${d.slice(1, 3)}: ${(value as any)[d]}`)
      .join(' · ') || '(empty)';
  }
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
