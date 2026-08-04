import { COMPANY } from "@/data/legal";
import { CONTACT_PHONE_DISPLAY } from "@/lib/contact";
import { CLUB_INSTAGRAM_HANDLE, CLUB_INSTAGRAM_URL } from "@/data/club";

export const NINJA_ART_SUMMER_CAMP_ID = "ninja-art-summer-2026";

export const NINJA_ART_SUMMER_CAMP = {
  id: NINJA_ART_SUMMER_CAMP_ID,
  title: "קייטנת קיץ נינג'ה ואמנות",
  titleEn: "NINJA & ART Summer Camp",
  brand: "chole Summer camp",
  venue: COMPANY.address,
  instagramHandle: CLUB_INSTAGRAM_HANDLE,
  instagramUrl: CLUB_INSTAGRAM_URL,
  phone: CONTACT_PHONE_DISPLAY,
  hours: "09:00 – 14:30",
  ageGroups: ["גילאי 4–6", "גילאי 7+"],
  ageNote: "פעילויות מהנות ויצירתיות לבנים ובנות",
  flyerImage: "/camps/ninja-art-summer-2026.png",
  flyerAlt: "קייטנת קיץ נינג'ה ואמנות CHOLE TLV — מודעה",
  tagline: "יום שלם של פעילות חברתית ותנועתית — בלי מסכים!",
  activities: [
    "פעילויות נינג'ה ואקרובטיקה",
    "סדנאות אמנות",
    "ג'גלינג",
    "פינג פונג ותרגילי קואורדינציה",
    "ארוחת צהריים והמשך פעילויות ספורט ואמנות אחר הצהריים",
  ],
  sessions: [
    { id: "round-1", label: "מחזור 1", dates: "2–6.8", startDate: "2026-08-02", endDate: "2026-08-06" },
    { id: "round-2", label: "מחזור 2", dates: "9–13.8", startDate: "2026-08-09", endDate: "2026-08-13" },
    { id: "round-3", label: "מחזור 3", dates: "16–20.8", startDate: "2026-08-16", endDate: "2026-08-20" },
    { id: "round-4", label: "מחזור 4", dates: "23–27.8", startDate: "2026-08-23", endDate: "2026-08-27" },
    {
      id: "final-days",
      label: "יומיים אחרונים",
      dates: "30–31.8",
      startDate: "2026-08-30",
      endDate: "2026-08-31",
    },
  ],
} as const;

export type CampSession = (typeof NINJA_ART_SUMMER_CAMP.sessions)[number];

export function getCampSessionStatus(
  session: CampSession,
  today = new Date(),
): "past" | "active" | "upcoming" {
  const start = new Date(`${session.startDate}T00:00:00`);
  const end = new Date(`${session.endDate}T23:59:59`);
  if (today > end) return "past";
  if (today >= start && today <= end) return "active";
  return "upcoming";
}

export const KIDS_CAMPS_SECTION_ID = "camps";
