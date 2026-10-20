// Text from the OASIS Founding Identity (October 2026). Edit wording here;
// the pages read from this file.

export type Proverb = {
  language: "Yoruba" | "Igbo" | "Hausa";
  original: string;
  translation: string;
  meaning: string;
};

export const FULL_NAME = "Outreach for Affirming Spaces, Inclusion and Sustainability";

export const PURPOSE =
  "Protecting mental wellbeing and supporting practical recovery where climate disruption and exclusion meet in Nigeria.";

export const PURPOSE_LONG =
  "Our purpose begins where climate disruption and exclusion meet: protecting mental wellbeing and supporting practical recovery in Nigeria.";

export const VISION =
  "A Nigeria where people facing exclusion can remain safe, mentally well and able to rebuild their lives in a changing climate.";

export const MISSION =
  "To protect and restore the mental wellbeing of marginalised people affected by climate-related displacement in Nigeria through:";

export const MISSION_AREAS = [
  "Confidential psychosocial support",
  "Safer housing pathways",
  "Continuity of essential healthcare",
  "Livelihood recovery",
];

export const LETTERS = [
  { letter: "O", word: "Outreach", meaning: "Support that reaches people where they are." },
  { letter: "AS", word: "Affirming Spaces", meaning: "Care and support that respect identity, consent and agency." },
  { letter: "I", word: "Inclusion", meaning: "Assistance people can access safely and with dignity." },
  { letter: "S", word: "Sustainability", meaning: "Recovery pathways that extend beyond the immediate crisis." },
];

// Overall aim and five core objectives (Aim and Objectives, October 2026).
export const AIM =
  "Our overall aim is to help marginalised people in Nigeria who are affected by climate-related displacement stay safe, recover their mental wellbeing and rebuild their lives.";

export const OBJECTIVES = [
  {
    title: "Improve mental wellbeing",
    detail:
      "Help people recover from trauma and distress through confidential emotional support and referrals to qualified professionals.",
    area: "Psychosocial support",
  },
  {
    title: "Help people find and keep safer housing",
    detail:
      "Support access to safe, affordable accommodation, help people navigate renting, and assist with voluntary moves to safer places.",
    area: "Safer housing",
  },
  {
    title: "Keep essential healthcare accessible",
    detail:
      "Connect people with confidential healthcare, including support for substance use, sexual and reproductive health, and specialist needs.",
    area: "Essential healthcare",
  },
  {
    title: "Help people rebuild their livelihoods and make their own choices",
    detail:
      "Support income recovery and practical planning so people can regain stability and control over their lives.",
    area: "Livelihoods",
  },
  {
    title: "Help communities prepare for climate disruption",
    detail:
      "Work with communities to develop preparedness plans and gather evidence that improves access to protection and recovery support.",
    area: "Preparedness and evidence",
  },
];

export const FOCUS = [
  {
    label: "Initial programme focus",
    detail:
      "Climate-related displacement, housing insecurity and mental-health recovery for marginalised adults in Nigeria, whether caused by flooding, drought, extreme heat, desertification or coastal erosion.",
  },
  {
    label: "Who we prioritise",
    detail:
      "Adults from marginalised and underserved communities affected by climate-related disruption, including people facing stigma, discrimination, violence, social exclusion or previous adversity.",
  },
  {
    label: "Where we begin",
    detail: "Nigeria, starting with a locally focused pilot designed with trusted community, healthcare and housing partners.",
  },
  {
    label: "How we respond",
    detail:
      "We coordinate psychosocial support, safer housing pathways, essential-care referrals and livelihood recovery through OASIS Safe Ground.",
  },
];

export const GUIDING_PRINCIPLE =
  "Support mental wellbeing by addressing safety, living conditions, care and livelihoods together.";

export const PHILOSOPHY = {
  headline: ["Community power.", "Bodily autonomy.", "Collective care."],
  intro:
    "OASIS is guided by a decolonial, intersectional feminist philosophy. We understand climate harm and mental distress through unequal relations of power, including patriarchy, colonial legacies, economic exclusion and the policing of bodies and identities.",
  rows: [
    {
      label: "What we centre",
      decolonial: "Nigerian and African knowledge, lived experience and community authority.",
      feminist: "Bodily autonomy, reproductive justice and non-coercive, person-centred care.",
    },
    {
      label: "What we challenge",
      decolonial: "Colonial legacies, extractive relations and unequal global responsibility for climate harm.",
      feminist: "Patriarchy, gendered violence, stigma and discrimination.",
    },
    {
      label: "How it shapes our work",
      decolonial:
        "Communities shape priorities, budgets and evidence, and funding supports community-defined goals. We critically examine inherited practices and use sound clinical evidence.",
      feminist:
        "Our inclusive African feminism addresses how gender, identity, disability, poverty and displacement interact to shape access to safety, resources and decision-making power.",
    },
  ],
  summary:
    "Together, these commitments advance community self-determination, bodily autonomy, collective care and accountability.",
};

export const PRINCIPLES = [
  {
    principle: "Community power",
    commitment: "Affected communities hold governing roles and share authority over resource decisions.",
    appliesTo: "Governance and budgets",
  },
  {
    principle: "Non-extractive practice",
    commitment:
      "We obtain consent, pay people for their expertise and return findings to communities. We never require trauma stories or photographs.",
    appliesTo: "Research, evidence and communications",
  },
  {
    principle: "Accountable care",
    commitment:
      "We protect choice, dignity and confidentiality, and apply these standards to leaders, staff and funders alike.",
    appliesTo: "Everyone connected to OASIS",
  },
];

export const INTELLECTUAL_GROUNDING = {
  before: "Intellectual grounding: the ",
  title: "Charter of Feminist Principles for African Feminists",
  after: ", African Feminist Forum.",
};

export const PROVERBS = {
  palace: {
    language: "Yoruba",
    original: "Ilé ọba tó jó, ẹwà ló bù kún un.",
    translation: "When the king’s palace burns, it is rebuilt more beautiful.",
    meaning: "Loss is not the end of the story. Recovery can restore what was taken, and more.",
  },
  noOneBehind: {
    language: "Igbo",
    original: "Onye aghala nwanne ya.",
    translation: "Let no one leave their brother or sister behind.",
    meaning: "Inclusion is a duty we owe one another, not a favour.",
  },
  kiteAndEagle: {
    language: "Igbo",
    original: "Egbe bere, ugo bere; nke sị ibe ya ebela, nku kwaa ya.",
    translation: "Let the kite perch and let the eagle perch. Whichever says the other shall not, may its wing break.",
    meaning: "There is room for everyone. Excluding others harms the whole community.",
  },
  oneHand: {
    language: "Hausa",
    original: "Hannu ɗaya ba ya ɗaukar jinka.",
    translation: "One hand cannot lift a thatched roof.",
    meaning: "No single organisation can do this alone. Our objectives depend on trusted partners.",
  },
  slowly: {
    language: "Hausa",
    original: "Sannu-sannu ba ta hana zuwa.",
    translation: "Moving slowly does not stop you from arriving.",
    meaning: "Recovery takes time. Steady support gets people there.",
  },
  joinedHands: {
    language: "Yoruba",
    original: "Àgbájọ ọwọ́ la fi ń sọ̀yà.",
    translation: "It is with joined hands that we beat our chests with pride.",
    meaning: "Strength and dignity are built collectively.",
  },
  multitude: {
    language: "Igbo",
    original: "Igwe bụ ike.",
    translation: "The multitude is strength.",
    meaning: "Together, we are stronger than any crisis.",
  },
} satisfies Record<string, Proverb>;

// Ways to work with OASIS. Not from the identity document itself; worded from
// its partnership, funding and non-extractive research commitments.
export const WAYS_TO_WORK = [
  {
    title: "Community and care partners",
    text: "Community, healthcare and housing organisations who share our commitment to safety, dignity and recovery.",
    subject: "Partnership",
    cta: "Partner with us",
  },
  {
    title: "Funders",
    text: "Funding that supports community-defined goals, with communities shaping priorities, budgets and evidence.",
    subject: "Funding",
    cta: "Talk to us about funding",
  },
  {
    title: "Research collaborators",
    text: "Non-extractive research: we obtain consent, pay people for their expertise and return findings to communities.",
    subject: "Research collaboration",
    cta: "Collaborate on research",
  },
];

export function contactHref(subject?: string) {
  return subject ? `/contact?subject=${encodeURIComponent(subject)}` : "/contact";
}

export const SITE_URL = "https://www.oasisinnigeria.org";

export const CONTACT_EMAIL = "talktous@oasisinnigeria.org";

export const ADDRESS = {
  locality: "Yenagoa",
  lga: "Yenagoa LGA",
  region: "Bayelsa State",
  country: "Nigeria",
  countryCode: "NG",
};
export const ADDRESS_LINES = [`${ADDRESS.locality}, ${ADDRESS.lga}`, `${ADDRESS.region}, ${ADDRESS.country}`];
export const INSTAGRAM = { handle: "@oasis.in.nigeria", url: "https://www.instagram.com/oasis.in.nigeria/" };
