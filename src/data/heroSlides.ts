import slide01 from "@/assets/hero/slide-01.png";
import slide02 from "@/assets/hero/slide-02.png";
import slide03 from "@/assets/hero/slide-03.png";
import slide04 from "@/assets/hero/slide-04.png";
import slide05 from "@/assets/hero/slide-05.png";
import slide06 from "@/assets/hero/slide-06.png";
import slide07 from "@/assets/hero/slide-07.png";
import slide08 from "@/assets/hero/slide-08.png";
import slide09 from "@/assets/hero/slide-09.png";
import slide10 from "@/assets/hero/slide-10.png";

export type HeroSlide = {
  src: string;
  alt: string;
};

export const HERO_SLIDE_INTERVAL_MS = 3000;
export const HERO_SLIDE_TRANSITION_MS = 700;

export const HERO_SLIDES: HeroSlide[] = [
  { src: slide01, alt: "מזרן איירפלור כחול LEVITATE" },
  { src: slide02, alt: "ערימת מזרני איירפלור שחורים LEVITATE" },
  { src: slide03, alt: "מזרן משולש כחול וצהוב לג'ימבורי" },
  { src: slide04, alt: "קופסאות קפיצה PLYO SOFT BOX" },
  { src: slide05, alt: "משולש אדום וירוק לג'ימבורי" },
  { src: slide06, alt: "מזרן נחיתה כחול עם ונטים" },
  { src: slide07, alt: "סט ציוד ג'ימבורי — מדרגות, קובייה ורampa" },
  { src: slide08, alt: "שולחן טניס שולחן מקצועי CHOLE PRO25" },
  { src: slide09, alt: "שולחן טניס שולחן חוץ CHOLE OUTDOOR NAVY6" },
  { src: slide10, alt: "רובוט אימון טניס שולחן PONG BOT NOVA S PRO" },
];
