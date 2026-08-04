import tableTennisImg from "@/assets/club-tt-action.png";
import tableTennisKidsImg from "@/assets/club-tt-kids.png";
import kidsImg from "@/assets/club-kids-ninja.png";
import eventsImg from "@/assets/club-events-climbing.png";
import { CLUB_HERO_VIDEO_SRC, CLUB_PATH } from "@/data/club";
import {
  KIDS_FIRST_TIME_INFO_LABEL,
  KIDS_FIRST_TIME_SECTION_ID,
  NINJA_KIDS_AGE_FROM_LABEL,
  NINJA_KIDS_HUB_SUPPORT,
} from "@/data/kids";

export type SiteGatewayAreaId = "table-tennis" | "kids" | "shop";

export type GatewayCardMediaType = "image" | "video" | "marquee";

export const SITE_GATEWAY_STORAGE_KEY = "chole-site-area";

export const SITE_GATEWAY_HEADLINE = "מה מחפשים היום?";
export const SITE_GATEWAY_SUBHEADLINE =
  "ב-CHOLE משלבים מועדון טניס שולחן, חוגי נינג'ה ואקרובטיקה לילדים וחנות ציוד מקצועית והכל במקום אחד. בחרו את האזור שמתאים לכם.";

export type SiteGatewayCard = {
  id: SiteGatewayAreaId;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  href: string;
  mediaType: GatewayCardMediaType;
  videoSrc?: string;
};

export const SITE_GATEWAY_CARDS: SiteGatewayCard[] = [
  {
    id: "table-tennis",
    title: "טניס שולחן",
    subtitle: "מועדון, לו\"ז שיעורים, כניסה למתחם והרשמה",
    image: tableTennisImg,
    imageAlt: "שחקני טניס שולחן במתחם CHOLE",
    href: "/table-tennis",
    mediaType: "video",
    videoSrc: CLUB_HERO_VIDEO_SRC,
  },
  {
    id: "kids",
    title: "חוגי נינג'ה לילדים ונוער",
    subtitle: `חוגים לילדים ונוער ${NINJA_KIDS_AGE_FROM_LABEL}, קייטנות ואירועים במתחם`,
    image: kidsImg,
    imageAlt: "ילדים בחוג נינג'ה במתחם CHOLE",
    href: "/kids",
    mediaType: "image",
  },
  {
    id: "shop",
    title: "חנות ציוד",
    subtitle: "מוצרים מקצועיים לנינג'ה, אקרובטיקה, טניס שולחן וג'ימבורי",
    image: tableTennisImg,
    imageAlt: "ציוד ספורט מקצועי של CHOLE",
    href: "/categories",
    mediaType: "marquee",
  },
];

export type SiteAreaHubLink = {
  label: string;
  description: string;
  href: string;
  external?: boolean;
};

export type SiteAreaHub = {
  id: SiteGatewayAreaId;
  eyebrow: string;
  headline: string;
  support: string;
  image: string;
  imageAlt: string;
  links: SiteAreaHubLink[];
};

export const TABLE_TENNIS_HUB: SiteAreaHub = {
  id: "table-tennis",
  eyebrow: "מתחם הפינגפונג",
  headline: "טניס שולחן — מועדון, אימונים וכניסה למתחם",
  support:
    "מועדון קהילתי בתל אביב עם שולחנות מקצועיים, חוג טניס שולחן לילדים, אימונים קבוצתיים וכניסה חופשית. כל מה שצריך — במקום אחד.",
  image: tableTennisKidsImg,
  imageAlt: "ילדים בחוג טניס שולחן במתחם CHOLE TLV",
  links: [
    {
      label: "על המועדון והמתחם",
      description: "שעות פעילות, שולחנות, קהילה ופרטים מעשיים",
      href: `${CLUB_PATH}#table-tennis`,
    },
    {
      label: "ציוד טניס שולחן",
      description: "שולחנות, אביזרי אימון ומוצרים מקצועיים",
      href: "/categories/table-tennis-equipment",
    },
  ],
};

export const KIDS_HUB_HEADLINE = "חוגי נינג'ה ואקרובטיקה לילדים ונוער";

export const KIDS_HUB: SiteAreaHub = {
  id: "kids",
  eyebrow: "CHOLE TLV",
  headline: KIDS_HUB_HEADLINE,
  support: NINJA_KIDS_HUB_SUPPORT,
  image: kidsImg,
  imageAlt: "ילדים בחוג נינג'ה במתחם CHOLE",
  links: [
    {
      label: "קייטנות",
      description: "קייטנת נינג'ה ואמנות — מחזורים, פעילויות והרשמה",
      href: "/kids#camps",
    },
    {
      label: "ימי הולדת ואירועים",
      description: "הזמנת יום הולדת או השכרת חלל במתחם",
      href: `${CLUB_PATH}#events`,
    },
    {
      label: KIDS_FIRST_TIME_INFO_LABEL,
      description: "נגישות, מה להביא, נוכחות הורים ועוד",
      href: `/kids#${KIDS_FIRST_TIME_SECTION_ID}`,
    },
  ],
};

export const KIDS_EVENTS_IMAGE = eventsImg;
