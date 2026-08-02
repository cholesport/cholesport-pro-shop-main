import clubHeroImg from "@/assets/club-tt-serve.png";
import tableTennisImg from "@/assets/club-tt-action.png";
import kidsImg from "@/assets/club-kids-ninja.png";
import eventsImg from "@/assets/club-events-climbing.png";
import { COMPANY } from "@/data/legal";
import { TABLE_TENNIS_TABLE_COUNT } from "@/data/activities";
import { WHATSAPP_URL } from "@/lib/contact";

/** Instagram for the physical club / venue (@chole_tlv). */
export const CLUB_INSTAGRAM_HANDLE = "chole_tlv";
export const CLUB_INSTAGRAM_URL = `https://www.instagram.com/${CLUB_INSTAGRAM_HANDLE}/`;

/** Community WhatsApp group for finding table-tennis partners (CHOLE Ping pong). */
export const CLUB_WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/GSUee9GJj9LIRRSwypIvpB";
export const CLUB_WHATSAPP_GROUP_LABEL = "CHOLE Ping pong";

export const CLUB_PATH = "/club";

export const CLUB_BRAND = "CHOLE TLV";
export const CLUB_NAME = "מתחם CHOLE TLV";

export const CLUB_SEO_TITLE = `${CLUB_BRAND} - מועדון טניס שולחן וחוגי נינג'ה לילדים בתל אביב`;
export const CLUB_SEO_DESCRIPTION =
  "מתחם ספורט בתל אביב שמשלב מועדון טניס שולחן לכל הרמות עם חוגי נינג'ה ואקרובטיקה לילדים מגיל 2.5 עד 12. בית השואבה 6 — ימי הולדת והשכרת חלל לאירועים.";

/** Hero background video - muted autoplay loop (served from /public). */
export const CLUB_HERO_VIDEO_SRC = "/club/club-venue.mp4";

export const CLUB_HERO = {
  brand: CLUB_BRAND,
  headline: "מועדון טניס שולחן. חוגי נינג'ה לילדים. מקום לפרוק אנרגיה.",
  support:
    "מתחם קהילתי בתל אביב שמשלב שני עולמות במקום אחד: מועדון טניס שולחן לשחקנים בכל הרמות, וחוגי נינג'ה לילדים — לשחק, להתאמן, לקפוץ ולהכיר חברים חדשים.",
  image: clubHeroImg,
  imageAlt: "שחקני טניס שולחן במתחם CHOLE TLV",
  videoSrc: CLUB_HERO_VIDEO_SRC,
  primaryCta: "אשמח להתעניין במתחם",
  secondaryCta: "אינסטגרם @chole_tlv",
};

export const CLUB_INTRO =
  "CHOLE TLV הוא מתחם ספורט בתל אביב שמאחד בין שני עולמות: מועדון טניס שולחן קהילתי — מקום מפגש לפרוק אנרגיה, להתאמן ולשחק מול שחקנים ושחקניות בכל הרמות — ולצדו חוגי נינג'ה ואקרובטיקה לילדים מגיל 2.5 עד 12. שילוב של משחק, תנועה ואתגר תחת קורת גג אחת. בנוסף אפשר לקבוע ימי הולדת ולהשכיר את החלל לאירועים.";

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
    lead: "מועדון טניס שולחן פעיל — קהילה של שחקנים ושחקניות בכל הרמות והגילאים, בלב המתחם.",
    points: [
      `${TABLE_TENNIS_TABLE_COUNT} שולחנות מקצועיים במתחם קהילתי בתל אביב.`,
      "רובוט אימון מקצועי — ניתן לשריין זמן ולהתאמן איתו בתיאום מראש.",
      "פתוח בין 08:00 ל-22:00. ניתן בתאום מראש להגיע לפני או אחרי שעות הפעילות.",
      "אפשר להגיע לבד ולמצוא פרטנר מתאים לרמה שלכם.",
      `מומלץ להצטרף לקבוצת הוואטסאפ ${CLUB_WHATSAPP_GROUP_LABEL} כדי להתעדכן ולמצוא שותפים למשחק.`,
    ],
    image: tableTennisImg,
    imageAlt: "משחק טניס שולחן במתחם CHOLE TLV בתל אביב",
    ctaLabel: "לתיאום משחק / אימון",
    whatsappIntent: "table-tennis",
  },
  {
    id: "kids",
    title: "חוגי נינג'ה ואקרובטיקה לילדים",
    lead: "חוגי נינג'ה לילדים באותו מתחם — תנועה, אתגר וביטחון עצמי לגילאי 2.5 עד 12.",
    points: [
      "מתאים לגילאי 2.5-12, בקבוצות לפי גיל ורמה.",
      "מסלולי נינג'ה, אקרובטיקה, קואורדינציה וכושר.",
      "אווירה בטוחה ומלווה - לילדים שאוהבים לנוע ולהתנסות.",
      "פרטים על מערכת שעות והרשמה - בוואטסאפ או באינסטגרם.",
    ],
    image: kidsImg,
    imageAlt: "חוג נינג'ה ואקרובטיקה לילדים במתחם CHOLE TLV",
    ctaLabel: "לפרטים על חוגי ילדים",
    whatsappIntent: "kids",
  },
  {
    id: "events",
    title: "ימי הולדת והשכרת חלל",
    lead: "חוגגים במתחם - או שוכרים את החלל לאירוע פרטי / קבוצתי.",
    points: [
      "ימי הולדת לילדים בסביבה ספורטיבית ומלאת אנרגיה.",
      "השכרת המתחם לאירועים, מפגשי חברה ואימונים פרטיים.",
      "נתאים את הפעילות לקהל ולמטרה - טניס שולחן, נינג'ה או שילוב.",
      "לתיאום תאריך והצעת מחיר - כתבו לנו בוואטסאפ.",
    ],
    image: eventsImg,
    imageAlt: "ילדים מטפסים במתחם CHOLE TLV - ימי הולדת והשכרת חלל",
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
      value:
        "המתחם פתוח בין 08:00 ל-22:00. ניתן בתאום מראש להגיע לפני או אחרי שעות הפעילות.",
    },
    {
      label: "חניה",
      value:
        "אפשר להגיע עם רכב משעה 18:00 ובשבתות לאורך היום (חניה טורית). עדיף לתאם מראש.",
    },
    {
      label: "קהילה",
      value: `הצטרפו לקבוצת הוואטסאפ ${CLUB_WHATSAPP_GROUP_LABEL} — התעדכנות ומציאת שותפים למשחק.`,
      href: CLUB_WHATSAPP_GROUP_URL,
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
    "שלום, הגעתי מעמוד המתחם באתר CHOLE - אשמח לשמוע פרטים על אימונים / חוגים במתחם CHOLE TLV.",
  "table-tennis":
    "שלום, אשמח לתאם הגעה למועדון טניס השולחן של CHOLE TLV (משחק / אימון).",
  kids: "שלום, אשמח לקבל פרטים על חוגי נינג'ה ואקרובטיקה לילדים במתחם CHOLE TLV (גילאי 2.5-12).",
  events:
    "שלום, אשמח לתאם יום הולדת / השכרת חלל במתחם CHOLE TLV - אשמח לפרטים ותאריכים פנויים.",
};

export const CLUB_FINAL_CTA = {
  title: "רוצים להגיע למשחק או לחוג?",
  text: "כתבו לנו בוואטסאפ או עקבו אחרי העדכונים באינסטגרם — נשמח לחבר אתכם למתחם, למועדון טניס השולחן או לחוגי הנינג'ה.",
};

export function getClubInterestWhatsAppUrl(intent: ClubWhatsAppIntent = "general") {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(CLUB_WHATSAPP_MESSAGES[intent])}`;
}
