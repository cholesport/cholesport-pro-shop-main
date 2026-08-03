import tableTennisImg from "@/assets/club-tt-action.png";
import kidsImg from "@/assets/club-kids-ninja.png";
import shopImg from "@/assets/hero/slide-03.png";
import eventsImg from "@/assets/club-events-climbing.png";
import { ACTIVITIES_PATH, ACTIVITIES_SCHEDULE_HASH } from "@/data/activities";
import { CLUB_PATH } from "@/data/club";

export type SiteGatewayAreaId = "table-tennis" | "kids" | "shop";

export const SITE_GATEWAY_STORAGE_KEY = "chole-site-area";

export const SITE_GATEWAY_HEADLINE = "מה מחפשים היום?";
export const SITE_GATEWAY_SUBHEADLINE =
  "ב-CHOLE משלבים מועדון טניס שולחן, פעילויות לילדים וחנות ציוד מקצועית — במקום אחד. בחרו את האזור שמתאים לכם.";

export type SiteGatewayCard = {
  id: SiteGatewayAreaId;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  /** Primary destination when the card is selected. */
  href: string;
  accentClass: string;
};

export const SITE_GATEWAY_CARDS: SiteGatewayCard[] = [
  {
    id: "table-tennis",
    title: "טניס שולחן",
    subtitle: "מועדון, לו\"ז שיעורים, כניסה למתחם והרשמה",
    image: tableTennisImg,
    imageAlt: "שחקני טניס שולחן במתחם CHOLE",
    href: "/table-tennis",
    accentClass: "from-sky-600/80 to-sky-900/90",
  },
  {
    id: "kids",
    title: "נינג'ה, קייטנות וימי הולדת",
    subtitle: "חוגים לילדים, קייטנות ואירועים במתחם",
    image: kidsImg,
    imageAlt: "ילדים בחוג נינג'ה במתחם CHOLE",
    href: "/kids",
    accentClass: "from-violet-600/75 to-violet-900/90",
  },
  {
    id: "shop",
    title: "חנות ציוד",
    subtitle: "מוצרים מקצועיים לנינג'ה, טניס שולחן ואימון",
    image: shopImg,
    imageAlt: "ציוד ספורט מקצועי של CHOLE",
    href: "/categories",
    accentClass: "from-accent/85 to-primary/90",
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
    "מועדון קהילתי בתל אביב עם שולחנות מקצועיים, שיעורי אימון, כניסה חופשית וקבוצת שחקנים פעילה. כל מה שצריך — במקום אחד.",
  image: tableTennisImg,
  imageAlt: "משחק טניס שולחן במתחם CHOLE TLV",
  links: [
    {
      label: "על המועדון והמתחם",
      description: "שעות פעילות, שולחנות, קהילה ופרטים מעשיים",
      href: `${CLUB_PATH}#table-tennis`,
    },
    {
      label: "לו\"ז שיעורים והרשמה",
      description: "בחירת תאריך, שריון מקום ומחירון טניס שולחן",
      href: `${ACTIVITIES_PATH}?focus=table-tennis#${ACTIVITIES_SCHEDULE_HASH}`,
    },
    {
      label: "ציוד טניס שולחן",
      description: "שולחנות, אביזרי אימון ומוצרים מקצועיים",
      href: "/categories/table-tennis-equipment",
    },
  ],
};

export const KIDS_HUB: SiteAreaHub = {
  id: "kids",
  eyebrow: "פעילויות לילדים",
  headline: "נינג'ה, קייטנות וימי הולדת",
  support:
    "חוגי נינג'ה ואקרובטיקה לילדים, קייטנות בעונות החופש והזמנת ימי הולדת במתחם. תנועה, אתגר וכיף — בבטיחות ובליווי מקצועי.",
  image: kidsImg,
  imageAlt: "ילדים בחוג נינג'ה במתחם CHOLE",
  links: [
    {
      label: "חוגי נינג'ה לילדים",
      description: "לו\"ז, הרשמה ומחירון לחוגי הנינג'ה",
      href: `${ACTIVITIES_PATH}?focus=ninja-kids#${ACTIVITIES_SCHEDULE_HASH}`,
    },
    {
      label: "קייטנות",
      description: "פרטים והרשמה לקייטנות בעונות החופש",
      href: `${ACTIVITIES_PATH}?focus=camps#${ACTIVITIES_SCHEDULE_HASH}`,
    },
    {
      label: "ימי הולדת ואירועים",
      description: "הזמנת יום הולדת או השכרת חלל במתחם",
      href: `${CLUB_PATH}#events`,
    },
    {
      label: "על חוגי הילדים במתחם",
      description: "גילאים, מה מחכה בחוג ופרטים נוספים",
      href: `${CLUB_PATH}#kids`,
    },
  ],
};

/** Decorative image for shop gateway card fallback — hub uses categories directly. */
export const SHOP_GATEWAY_IMAGE = shopImg;
export const KIDS_EVENTS_IMAGE = eventsImg;
