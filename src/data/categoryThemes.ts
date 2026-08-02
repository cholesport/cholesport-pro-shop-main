/** Per-category visual theme for vibrant category cards. */
export type CategoryBadge = {
  label: string;
  className: string;
};

export type CategoryTheme = {
  card: string;
  iconWrap: string;
  iconTint: string;
  titleHover: string;
  cta: string;
  glow: string;
  badge?: CategoryBadge;
};

const BADGE_POPULAR: CategoryBadge = {
  label: "פופולרי",
  className: "bg-rose-500 text-white shadow-md shadow-rose-500/30",
};

const BADGE_SALE: CategoryBadge = {
  label: "מבצע -16%",
  className: "bg-accent text-accent-foreground shadow-md shadow-accent/40 animate-pulse",
};

const BADGE_BEST: CategoryBadge = {
  label: "הטוב ביותר",
  className: "bg-violet-600 text-white shadow-md shadow-violet-500/30",
};

const BADGE_PRO: CategoryBadge = {
  label: "מקצועי",
  className: "bg-sky-600 text-white shadow-md shadow-sky-500/30",
};

const BADGE_TOP: CategoryBadge = {
  label: "הכי נמכר",
  className: "bg-orange-500 text-white shadow-md shadow-orange-500/30",
};

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  "table-tennis-equipment": {
    card: "border-sky-200/80 bg-gradient-to-br from-sky-50 via-white to-cyan-50 hover:border-sky-400",
    iconWrap: "bg-gradient-to-br from-sky-500 to-cyan-600 shadow-lg shadow-sky-500/35",
    iconTint: "brightness-0 invert",
    titleHover: "group-hover:text-sky-700",
    cta: "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-500/30 group-hover:shadow-lg group-hover:shadow-sky-500/40",
    glow: "group-hover:shadow-sky-200/60",
    badge: BADGE_TOP,
  },
  "pro-game-tables": {
    card: "border-indigo-200/80 bg-gradient-to-br from-indigo-50 via-white to-slate-50 hover:border-indigo-400",
    iconWrap: "bg-gradient-to-br from-indigo-600 to-slate-800 shadow-lg shadow-indigo-500/35",
    iconTint: "brightness-0 invert",
    titleHover: "group-hover:text-indigo-700",
    cta: "bg-gradient-to-r from-indigo-600 to-slate-800 text-white shadow-md shadow-indigo-500/30 group-hover:shadow-lg group-hover:shadow-indigo-500/40",
    glow: "group-hover:shadow-indigo-200/60",
    badge: BADGE_PRO,
  },
  gymboree: {
    card: "border-rose-200/80 bg-gradient-to-br from-rose-50 via-white to-pink-50 hover:border-rose-400",
    iconWrap: "bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/35",
    iconTint: "text-white",
    titleHover: "group-hover:text-rose-700",
    cta: "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/30 group-hover:shadow-lg group-hover:shadow-rose-500/40",
    glow: "group-hover:shadow-rose-200/60",
    badge: BADGE_POPULAR,
  },
  "training-accessories": {
    card: "border-lime-200/80 bg-gradient-to-br from-lime-50 via-white to-emerald-50 hover:border-lime-400",
    iconWrap: "bg-gradient-to-br from-lime-500 to-emerald-600 shadow-lg shadow-lime-500/35",
    iconTint: "text-white",
    titleHover: "group-hover:text-lime-800",
    cta: "bg-gradient-to-r from-lime-500 to-emerald-600 text-white shadow-md shadow-lime-500/30 group-hover:shadow-lg group-hover:shadow-lime-500/40",
    glow: "group-hover:shadow-lime-200/60",
    badge: { label: "מגוון רחב", className: "bg-emerald-600 text-white shadow-md shadow-emerald-500/30" },
  },
  "airfloor-mats": {
    card: "border-accent/50 bg-gradient-to-br from-orange-50 via-white to-amber-50 hover:border-accent",
    iconWrap: "bg-gradient-to-br from-accent to-orange-600 shadow-lg shadow-accent/40",
    iconTint: "brightness-0 invert",
    titleHover: "group-hover:text-accent",
    cta: "bg-gradient-to-r from-accent to-orange-500 text-accent-foreground shadow-md shadow-accent/35 group-hover:shadow-lg group-hover:shadow-accent/45",
    glow: "group-hover:shadow-orange-200/70",
    badge: BADGE_SALE,
  },
  "flexi-roll": {
    card: "border-violet-200/80 bg-gradient-to-br from-violet-50 via-white to-purple-50 hover:border-violet-400",
    iconWrap: "bg-gradient-to-br from-violet-600 to-purple-700 shadow-lg shadow-violet-500/35",
    iconTint: "text-white",
    titleHover: "group-hover:text-violet-700",
    cta: "bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-md shadow-violet-500/30 group-hover:shadow-lg group-hover:shadow-violet-500/40",
    glow: "group-hover:shadow-violet-200/60",
    badge: BADGE_BEST,
  },
  "landing-mats": {
    card: "border-teal-200/80 bg-gradient-to-br from-teal-50 via-white to-cyan-50 hover:border-teal-400",
    iconWrap: "bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg shadow-teal-500/35",
    iconTint: "brightness-0 invert",
    titleHover: "group-hover:text-teal-700",
    cta: "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-500/30 group-hover:shadow-lg group-hover:shadow-teal-500/40",
    glow: "group-hover:shadow-teal-200/60",
    badge: { label: "בטיחות מקסימלית", className: "bg-teal-600 text-white shadow-md shadow-teal-500/30" },
  },
  "show-room": {
    card: "border-sky-300/80 bg-gradient-to-br from-sky-600/10 via-white to-accent/10 hover:border-sky-500",
    iconWrap: "bg-gradient-to-br from-sky-600 to-accent shadow-lg shadow-sky-500/35",
    iconTint: "",
    titleHover: "group-hover:text-sky-700",
    cta: "bg-gradient-to-r from-sky-600 to-accent text-white shadow-md shadow-sky-500/30 group-hover:shadow-lg group-hover:shadow-sky-500/40",
    glow: "group-hover:shadow-sky-200/60",
    badge: { label: "בואו לבקר", className: "bg-sky-600 text-white shadow-md shadow-sky-500/30" },
  },
};

const DEFAULT_THEME: CategoryTheme = {
  card: "border-border bg-gradient-to-br from-secondary via-white to-secondary hover:border-accent/50",
  iconWrap: "bg-gradient-to-br from-primary to-slate-700 shadow-lg shadow-primary/25",
  iconTint: "text-white",
  titleHover: "group-hover:text-accent",
  cta: "bg-gradient-to-r from-accent to-orange-500 text-accent-foreground shadow-md shadow-accent/30 group-hover:shadow-lg group-hover:shadow-accent/40",
  glow: "group-hover:shadow-accent/20",
};

export function getCategoryTheme(slug: string): CategoryTheme {
  return CATEGORY_THEMES[slug] ?? DEFAULT_THEME;
}
