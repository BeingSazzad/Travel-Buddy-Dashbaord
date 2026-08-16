import { CMS_STORAGE_KEY } from '@/lib/constants'

export type CmsStatus = 'published' | 'draft'
export type CmsKind = 'page' | 'onboarding' | 'faq'

export type PageSection = {
  id: string
  title: string
  body: string
}

export type CmsPageContent = {
  headline: string
  subtitle: string
  sections: PageSection[]
  footer: string
  numbered: boolean
}

export type OnboardSlide = {
  id: string
  title: string
  description: string
  image: string
}

export type FaqItem = {
  id: string
  question: string
  answer: string
}

export type CmsDoc = {
  slug: string
  title: string
  kind: CmsKind
  page: CmsPageContent
  slides: OnboardSlide[]
  faq: FaqItem[]
  status: CmsStatus
  updatedAt: string
}

const EMPTY_PAGE: CmsPageContent = {
  headline: '',
  subtitle: '',
  sections: [],
  footer: '',
  numbered: false,
}

function section(id: string, title: string, body: string): PageSection {
  return { id, title, body }
}

const ONBOARD_SLIDES: OnboardSlide[] = [
  {
    id: 'ob1',
    title: 'Meet women travelling the same way',
    description: 'Find companions heading to your city. Match, chat and plan before you even land.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&h=1800&fit=crop&q=85',
  },
  {
    id: 'ob2',
    title: 'Join events that feel like real life',
    description: 'Yoga mornings, wine nights, travel mixers — meetups that turn strangers into friends.',
    image: 'https://images.unsplash.com/photo-1543269865-cbf224953034?auto=format&fit=crop&w=1200&h=1800&fit=crop&q=85',
  },
  {
    id: 'ob3',
    title: 'Places women actually trust',
    description: 'Cafés, stays and hidden gems recommended by members like you — not anonymous reviews.',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&h=1800&fit=crop&q=85',
  },
]

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'f1',
    question: 'How does matching work on Seluna?',
    answer: 'Seluna matches women travelling to the same city around the same dates. Open Discover and filter by destination, dates, interests, and languages.',
  },
  {
    id: 'f2',
    question: 'Is Seluna a dating app?',
    answer: 'No. Seluna is a women-only friendship and travel companion app. Dating pitches are against the community guidelines.',
  },
  {
    id: 'f3',
    question: 'How do I verify my account?',
    answer: 'Open Profile → Verify identity. You confirm you are 18+ with a government ID and a selfie (Veriff).',
  },
  {
    id: 'f4',
    question: 'How do I manage or cancel Plus?',
    answer: 'Open Profile → Seluna Plus to see your plan, switch monthly/yearly, or open payment & cancel.',
  },
  {
    id: 'f5',
    question: 'What if I feel unsafe?',
    answer: 'Use Report on a profile, chat, or event. The team reviews reports. In an emergency, contact local services first.',
  },
]

function doc(
  slug: string,
  title: string,
  kind: CmsKind,
  extra: Partial<CmsDoc> & { updatedAt: string },
): CmsDoc {
  return {
    slug,
    title,
    kind,
    page: EMPTY_PAGE,
    slides: [],
    faq: [],
    status: 'published',
    ...extra,
  }
}

const SEED: CmsDoc[] = [
  doc('about', 'About us', 'page', {
    updatedAt: '2026-08-16',
    page: {
      numbered: false,
      headline: 'About Seluna',
      subtitle: 'Women · Travel · Community',
      sections: [
        section(
          'a1',
          'Who we are',
          'Seluna is a verified, members-only travel and social community for women aged 18 and older. Meet companions heading to the same city, join local meetups, and travel with more confidence.',
        ),
        section(
          'a2',
          'Mission',
          'Make solo travel feel less solo — without turning the app into a dating product. Friendship, safety, and shared itineraries first.',
        ),
        section(
          'a3',
          'Story',
          'Built for women who plan trips around cafés, museums, and slow mornings. Matching is based on destination and dates, not a swipe deck for romance.',
        ),
      ],
      footer: 'Women-only · 18+ · Verified community',
    },
  }),
  doc('terms', 'Terms & Conditions', 'page', {
    updatedAt: '2026-08-12',
    page: {
      numbered: false,
      headline: 'Seluna Terms of Service',
      subtitle: 'Last updated: August 2026',
      sections: [
        section(
          't1',
          '1. Membership & Community Purpose',
          'Seluna is a verified, members-only travel and social community for women aged 18 and older. By accessing or using Seluna, you confirm that you are at least 18 years of age and agree to interact with other members respectfully, lawfully, and in good faith.',
        ),
        section(
          't2',
          '2. Account Security & Accuracy',
          'You are responsible for maintaining the accuracy of your profile information and the confidentiality of your account credentials. Any activities that occur under your account are your sole responsibility.',
        ),
        section(
          't3',
          '3. Membership & Subscriptions',
          'Seluna requires an active subscription to access social matching, trips, and community features. Subscriptions auto-renew unless cancelled at least 24 hours before the renewal date. You may manage or cancel your subscription at any time in Subscription Management.',
        ),
        section(
          't4',
          '4. User Conduct & Safety',
          'You agree to abide by our Community Guidelines. Harassment, hate speech, sexual solicitation, fraud, commercial spam, and non-consensual sharing of private information are strictly prohibited and will result in permanent account termination.',
        ),
        section(
          't5',
          '5. Member Interactions & Events',
          'Seluna provides a platform for women to discover travel companions and attend meetups. Members are solely responsible for their off-platform meetings and travel arrangements. Seluna does not endorse or guarantee the safety of individual member-organized trips or events.',
        ),
        section(
          't6',
          '6. Partner Offers & Redemptions',
          'Exclusive deals and partner benefits displayed on Seluna are provided by third-party venues and services. Terms, availability, and redemption criteria are determined by the respective venue partner.',
        ),
        section(
          't7',
          '7. Account Termination',
          'Seluna reserves the right to suspend or terminate accounts that violate our Terms of Service or Community Guidelines without prior notice.',
        ),
      ],
      footer:
        'If you have any questions regarding our Terms & Conditions, please contact Seluna Support through the Help section in your profile settings.',
    },
  }),
  doc('privacy', 'Privacy Policy', 'page', {
    updatedAt: '2026-08-10',
    page: {
      numbered: false,
      headline: 'Seluna Privacy Policy',
      subtitle: 'Your privacy & safety are our highest priorities',
      sections: [
        section(
          'p1',
          '1. Information We Collect',
          'We collect information you provide directly to us during registration, profile creation, and app usage (such as your name, date of birth, photos, bio, travel plans, event RSVPs, and messages). Identity verification data is securely processed via our partner Veriff.',
        ),
        section(
          'p2',
          '2. How We Use Your Information',
          'Your information is used solely to provide travel matching, community event discovery, safety verification, and personalized recommendations. We do not sell your personal data to third parties.',
        ),
        section(
          'p3',
          '3. Location Data & Privacy',
          'We collect approximate location data (city level) to match you with nearby travellers and local meetups. Your exact street address or precise GPS coordinates are never displayed to other members.',
        ),
        section(
          'p4',
          '4. Profile Visibility & Controls',
          'You maintain full control over your profile visibility. You can customize whether your age, upcoming travel dates, and current city are visible to other members through your Privacy settings.',
        ),
        section(
          'p5',
          '5. Data Storage & Security',
          'We employ industry-standard encryption and security protocols to protect your personal data, chat history, and account credentials.',
        ),
        section(
          'p6',
          '6. Your Data Rights & Deletion',
          'You have the right to access, update, export, or permanently delete your personal information at any time directly within the app or by contacting support.',
        ),
      ],
      footer:
        'Have questions about how your data is handled? Contact our Privacy Team through Help & Support in your profile settings.',
    },
  }),
  doc('guidelines', 'Community Guidelines', 'page', {
    updatedAt: '2026-08-16',
    page: {
      numbered: true,
      headline: 'Seluna is a community',
      subtitle:
        "Seluna is a women's friendship, travel and community platform — not a dating app. These guidelines keep it safe, warm, and welcoming for every member.",
      sections: [
        section(
          'g1',
          'Harassment',
          'Unwelcome, intimidating, or repeated contact toward another member is not allowed. If someone asks you to stop, stop — and report any continued unwanted attention.',
        ),
        section(
          'g2',
          'Hate speech',
          'Content that attacks, degrades, or incites violence against people based on race, ethnicity, religion, sexual orientation, gender identity, disability, or nationality has no place here.',
        ),
        section(
          'g3',
          'Sexual content',
          'Explicit or suggestive sexual content is prohibited. Seluna is a safe, respectful space — keep all photos, posts, and messages non-sexual.',
        ),
        section(
          'g4',
          'No dating solicitation',
          "Seluna is a women's friendship, travel and community platform — not a dating app. Romantic or dating-oriented propositions toward other members are not permitted. Keep connections friendly and travel-focused.",
        ),
        section(
          'g5',
          'Scams',
          'Deceptive schemes, requests for money, fake offers, or any attempt to defraud members will result in immediate removal and may be reported to authorities.',
        ),
        section(
          'g6',
          'Discrimination',
          'Treating anyone unfairly because of who they are — their background, identity, beliefs, or appearance — is unacceptable. Every member deserves equal respect.',
        ),
        section(
          'g7',
          'Bullying',
          'Targeted insults, mocking, exclusion, or repeated humiliating behaviour toward a member is prohibited. Disagree respectfully or walk away.',
        ),
        section(
          'g8',
          'Impersonation',
          'Pretending to be someone else — another member, a staff member, or a public figure — is strictly forbidden. Be yourself.',
        ),
        section(
          'g9',
          'Sharing private information',
          "Never share another member's private details (home address, phone number, financial info, photos) without consent. Protect everyone's privacy as you'd protect your own.",
        ),
        section(
          'g10',
          'Dangerous event behavior',
          'At Seluna events, never endanger others: no weapons, drugs, unsafe locations, or reckless conduct. Hosts must keep venues safe and accessible, and members must follow host and venue rules.',
        ),
      ],
      footer:
        'Breaking these guidelines can result in content removal, loss of access to social features, or permanent account removal. Use the Report option wherever you see it — our team reviews every report.',
    },
  }),
  doc('onboarding', 'Onboarding', 'onboarding', {
    updatedAt: '2026-08-16',
    slides: ONBOARD_SLIDES,
  }),
  doc('faq', 'FAQ', 'faq', {
    updatedAt: '2026-08-16',
    faq: FAQ_ITEMS,
  }),
]

function cloneSeed() {
  return SEED.map((row) => ({
    ...row,
    page: {
      ...row.page,
      sections: row.page.sections.map((s) => ({ ...s })),
    },
    slides: row.slides.map((s) => ({ ...s })),
    faq: row.faq.map((f) => ({ ...f })),
  }))
}

function read(): CmsDoc[] {
  const raw = localStorage.getItem(CMS_STORAGE_KEY)
  if (!raw) {
    const seed = cloneSeed()
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(seed))
    return seed
  }
  try {
    const rows = JSON.parse(raw) as CmsDoc[]
    return rows
      .filter((row) => SEED.some((s) => s.slug === row.slug))
      .map((row) => ({
        ...row,
        page: row.page ?? EMPTY_PAGE,
        slides: row.slides ?? [],
        faq: row.faq ?? [],
      }))
  } catch {
    return cloneSeed()
  }
}

function write(rows: CmsDoc[]) {
  localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(rows))
}

export const cmsStore = {
  list: read,
  get(slug: string) {
    return read().find((row) => row.slug === slug) ?? null
  },
  save(slug: string, patch: Partial<CmsDoc>) {
    const rows = read()
    const index = rows.findIndex((row) => row.slug === slug)
    if (index < 0) return null
    rows[index] = { ...rows[index], ...patch, updatedAt: new Date().toISOString().slice(0, 10) }
    write(rows)
    return rows[index]
  },
}
