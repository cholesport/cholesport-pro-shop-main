import type { LegalSection } from "@/data/legal";
import { COMPANY } from "@/data/legal";
import { CONTACT_PHONE_DISPLAY, WHATSAPP_URL } from "@/lib/contact";

/** Accessibility statement content - required for Israeli service sites (תקנות נגישות). */
export const ACCESSIBILITY_COORDINATOR = {
  title: "רכז נגישות",
  organization: COMPANY.name,
  phone: CONTACT_PHONE_DISPLAY,
  email: COMPANY.email,
  whatsappUrl: WHATSAPP_URL,
  address: COMPANY.address,
};

export const ACCESSIBILITY_STATEMENT_SECTIONS: LegalSection[] = [
  {
    title: "1. מחויבות לנגישות",
    paragraphs: [
      `${COMPANY.name} פועלת להנגשת אתר האינטרנט שלה לאנשים עם מוגבלות, בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ"ח-1998, ולתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013.`,
      "אנו רואים בנגישות ערך מרכזי וממשיכים לשפר את חוויית השימוש באתר עבור כלל הלקוחות.",
    ],
  },
  {
    title: "2. תקן היעד",
    paragraphs: [
      'האתר שואף לעמוד בתקן הישראלי ת"י 5568 לנגישות תכנים באינטרנט, המבוסס על הנחיות WCAG 2.0 ברמת AA.',
    ],
  },
  {
    title: "3. התאמות נגישות באתר",
    bullets: [
      "קישור \"דלג לתוכן הראשי\" בראש כל עמוד.",
      "תפריט נגישות קבוע הכולל: הגדלת טקסט, ניגודיות גבוהה, גווני אפור, היפוך צבעים, הדגשת קישורים וכותרות, גופן קריא, ריווח טקסט, סמן גדול, מדריך קריאה, הדגשת פוקוס מקלדת ועצירת אנימציות.",
      "ניווט במקלדת והצגת פוקוס על רכיבים אינטראקטיביים.",
      "מבנה סמנטי בעברית (RTL) עם כותרות ותוויות לשדות טפסים.",
      "שמירת העדפות נגישות במכשיר המשתמש (localStorage).",
    ],
  },
  {
    title: "4. מידע על רכז הנגישות",
    paragraphs: [
      `לשאלות, בקשות להתאמות או דיווח על תקלת נגישות ניתן לפנות אל ${ACCESSIBILITY_COORDINATOR.title} של ${ACCESSIBILITY_COORDINATOR.organization}:`,
    ],
    bullets: [
      `טלפון: ${ACCESSIBILITY_COORDINATOR.phone}`,
      `דוא״ל: ${ACCESSIBILITY_COORDINATOR.email}`,
      `כתובת: ${ACCESSIBILITY_COORDINATOR.address}`,
      "ניתן גם ליצור קשר בוואטסאפ דרך כפתור הוואטסאפ באתר.",
    ],
  },
  {
    title: "5. דרכי פנייה וטיפול",
    paragraphs: [
      "נשתדל להשיב לפניות בנושא נגישות בהקדם האפשרי, ובדרך כלל תוך עד 5 ימי עסקים. אם נתקלתם בקושי, אנא ציינו את כתובת העמוד, סוג הדפדפן/מכשיר ותיאור הבעיה.",
    ],
  },
  {
    title: "6. מגבלות ידועות",
    paragraphs: [
      "חלק מתכנים של צד שלישי (למשל הטמעות חיצוניות) עשויים שלא להיות נגישים במלואם. אנו פועלים לצמצם מגבלות אלה ככל הניתן. אם נמצאה מגבלה - נשמח שתדווחו לנו.",
    ],
  },
  {
    title: "7. עדכון ההצהרה",
    paragraphs: [
      `הצהרה זו עודכנה לאחרונה ב־${COMPANY.lastUpdated}. ייתכנו עדכונים בהתאם לשיפורים באתר או לשינויי דין.`,
    ],
  },
];
