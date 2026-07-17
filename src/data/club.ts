import clubHeroImg from "@/assets/club-tt-serve.png";
import tableTennisImg from "@/assets/club-tt-action.png";
import kidsImg from "@/assets/club-kids-ninja.png";
import eventsImg from "@/assets/club-tt-action.png";
import { COMPANY } from "@/data/legal";
import { WHATSAPP_URL } from "@/lib/contact";

/** Instagram for the physical club / venue (@chole_tlv). */
export const CLUB_INSTAGRAM_HANDLE = "chole_tlv";
export const CLUB_INSTAGRAM_URL = `https://www.instagram.com/${CLUB_INSTAGRAM_HANDLE}/`;

/** Community WhatsApp group for finding table-tennis partners. */
export const CLUB_WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/KdaeTc1M4nRDt9JcfV5kb2";

export const CLUB_PATH = "/club";

export const CLUB_BRAND = "CHOLE TLV";
export const CLUB_NAME = "מתחם CHOLE TLV";

export const CLUB_SEO_TITLE = `${CLUB_BRAND} — מועדון טניס שולחן וחוגי ילדים בתל אביב`;
export const CLUB_SEO_DESCRIPTION =
  "מועדון טניס שולחן לכל הרמות והגילאים בבית השואבה 6, תל אביב. חוגי נינג'ה ואקרובטיקה לילדים מגיל 2.5 עד 12, ימי הולדת והשכרת חלל לאירועים.";

/** Hero background video — muted autoplay loop (served from /public). */
export const CLUB_HERO_VIDEO_SRC = "/club/club-venue.mp4";

export const CLUB_HERO = {
  brand: CLUB_BRAND,
  headline: "מועדון טניס שולחן. מקום לפרוק אנרגיה.",
  support:
    "מתחם קהילתי בתל אביב — לשחק, להתאמן ולהכיר שחקנים בכל הרמות והגילאים.",
  image: clubHeroImg,
  imageAlt: "שחקני טניס שולחן במתחם CHOLE TLV",
  videoSrc: CLUB_HERO_VIDEO_SRC,
  primaryCta: "אשמח להתעניין במתחם",
  secondaryCta: "אינסטגרם @chole_tlv",
};

export const CLUB_INTRO =
  "CHOLE TLV הוא קודם כול מועדון טניס שולחן — מקום מפגש נפלא לפרוק אנרגיה, להתאמן ולשחק מול שחקנים ושחקניות בכל הרמות. בנוסף פועלים במתחם חוגי ילדים בנינג'ה ואקרובטיקה, ואפשר גם לקבוע ימי הולדת ולהשכיר את החלל לאירועים.";

export type ClubPillar = {
  id: string;
  title: string;
  lead: string;
  points: string[];
  image: string;
  imageAlt: string;
  ctaLabel: string;
  whatsappIntent: ClubWhatsAppIntent;
};

export type ClubWhatsAppIntent =
  | "table-tennis"
  | "kids"
  | "events"
  | "general";

export const CLUB_PILLARS: ClubPillar[] = [
  {
    id: "table-tennis",
    title: "מועדון טניס שולחן",
    lead: "הלב של המתחם — קהילה פעילה של שחקנים ושחקניות בכל הרמות והגילאים.",
    points: [
      "כמה שולחנות מקצועיים במתחם קהילתי בתל אביב.",
      "פתוח רוב שעות היממה — מלבד שעות החוגים.",
      "אפשר להגיע לבד ולמצוא פרטנר מתאים לרמה שלכם.",
      "כניסה = כשעתיים משחק / אימון.",
      "מומלץ להצטרף לקבוצת הוואטסאפ כדי להתעדכן ולמצוא שותפים למשחק.",
    ],
    image: tableTennisImg,
    imageAlt: "משחק טניס שולחן במתחם CHOLE TLV בתל אביב",
    ctaLabel: "לתיאום משחק / אימון",
    whatsappIntent: "table-tennis",
  },
  {
    id: "kids",
    title: "חוגי נינג'ה ואקרובטיקה לילדים",
    lead: "חוגים דינמיים לילדים מגיל 2.5 עד 12 — אתגר, תנועה וביטחון עצמי.",
    points: [
      "מתאים לגילאי 2.5–12, בקבוצות לפי גיל ורמה.",
      "מסלולי נינג'ה, אקרובטיקה, קואורדינציה וכושר.",
      "אווירה בטוחה ומלווה — לילדים שאוהבים לנוע ולהתנסות.",
      "פרטים על מערכת שעות והרשמה — בוואטסאפ או באינסטגרם.",
    ],
    image: kidsImg,
    imageAlt: "חוג נינג'ה ואקרובטיקה לילדים במתחם CHOLE TLV",
    ctaLabel: "לפרטים על חוגי ילדים",
    whatsappIntent: "kids",
  },
  {
    id: "events",
    title: "ימי הולדת והשכרת חלל",
    lead: "חוגגים במתחם — או שוכרים את החלל לאירוע פרטי / קבוצתי.",
    points: [
      "ימי הולדת לילדים בסביבה ספורטיבית ומלאת אנרגיה.",
      "השכרת המתחם לאירועים, מפגשי חברה ואימונים פרטיים.",
      "נתאים את הפעילות לקהל ולמטרה — טניס שולחן, נינג'ה או שילוב.",
      "לתיאום תאריך והצעת מחיר — כתבו לנו בוואטסאפ.",
    ],
    image: eventsImg,
    imageAlt: "מתחם CHOLE TLV — חלל לאימונים, ימי הולדת ואירועים",
    ctaLabel: "לתיאום יום הולדת / אירוע",
    whatsappIntent: "events",
  },
];

export const CLUB_PRACTICAL = {
  title: "לפני שמגיעים",
  items: [
    {
      label: "כתובת",
      value: COMPANY.address,
    },
    {
      label: "שעות",
      value: "המתחם פתוח רוב שעות היממה — מלבד שעות החוגים. מומלץ לתאם מראש.",
    },
    {
      label: "חניה",
      value:
        "אפשר להגיע עם רכב משעה 18:00 ובשבתות לאורך היום (חניה טורית). עדיף לתאם מראש.",
    },
    {
      label: "קהילה",
      value: "בקבוצת הוואטסאפ מתעדכנים בהודעות ומוצאים פרטנרים למשחק.",
    },
  ],
};

export const CLUB_TEASER = {
  label: "מתחם CHOLE TLV",
  text: "מועדון טניס שולחן · חוגי נינג'ה ואקרובטיקה לילדים · ימי הולדת",
  cta: "לעמוד המתחם",
};

export const CLUB_WHATSAPP_MESSAGES: Record<ClubWhatsAppIntent, string> = {
  general:
    "שלום, הגעתי מעמוד המתחם באתר CHOLE — אשמח לשמוע פרטים על אימונים / חוגים במתחם CHOLE TLV.",
  "table-tennis":
    "שלום, אשמח לתאם הגעה למועדון טניס השולחן של CHOLE TLV (משחק / אימון).",
  kids: "שלום, אשמח לקבל פרטים על חוגי נינג'ה ואקרובטיקה לילדים במתחם CHOLE TLV (גילאי 2.5–12).",
  events:
    "שלום, אשמח לתאם יום הולדת / השכרת חלל במתחם CHOLE TLV — אשמח לפרטים ותאריכים פנויים.",
};

export const CLUB_FINAL_CTA = {
  title: "רוצים להגיע להתאמן?",
  text: "כתבו לנו בוואטסאפ או עקבו אחרי העדכונים באינסטגרם — נשמח לחבר אתכם למתחם.",
};

export function getClubInterestWhatsAppUrl(intent: ClubWhatsAppIntent = "general") {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(CLUB_WHATSAPP_MESSAGES[intent])}`;
}
