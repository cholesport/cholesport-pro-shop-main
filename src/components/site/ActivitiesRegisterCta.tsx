import { Link } from "@tanstack/react-router";
import { Calendar, CreditCard, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ACTIVITIES_PATH,
  ACTIVITIES_PRICING_HASH,
  ACTIVITIES_REGISTER_CTA_HEADER,
  ACTIVITIES_REGISTER_CTA_LABEL,
  ACTIVITIES_SCHEDULE_HASH,
} from "@/data/activities";

type RegisterHash = typeof ACTIVITIES_SCHEDULE_HASH | typeof ACTIVITIES_PRICING_HASH;

const VARIANT_CLASSES = {
  solid:
    "bg-accent text-accent-foreground shadow-md shadow-accent/30 ring-2 ring-accent/40 hover:bg-accent/90 hover:shadow-lg",
  outline:
    "border-2 border-accent bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground",
  onDark:
    "bg-accent text-accent-foreground shadow-lg shadow-black/25 ring-2 ring-white/20 hover:bg-accent/90",
  onDarkOutline:
    "border-2 border-accent bg-accent/15 text-white hover:bg-accent hover:text-accent-foreground",
} as const;

const SIZE_CLASSES = {
  sm: "px-3 py-2 text-xs gap-1.5 rounded-md",
  md: "px-5 py-2.5 text-sm gap-2 rounded-lg",
  lg: "px-7 py-3.5 text-sm sm:text-base gap-2 rounded-lg",
} as const;

type ActivitiesRegisterCtaProps = {
  variant?: keyof typeof VARIANT_CLASSES;
  size?: keyof typeof SIZE_CLASSES;
  hash?: RegisterHash;
  label?: string;
  short?: boolean;
  header?: boolean;
  showIcon?: boolean;
  icon?: "user" | "calendar" | "card";
  className?: string;
};

export function ActivitiesRegisterCta({
  variant = "solid",
  size = "md",
  hash,
  label,
  short = false,
  header = false,
  showIcon = true,
  icon = "user",
  className,
}: ActivitiesRegisterCtaProps) {
  const text =
    label ??
    (header
      ? ACTIVITIES_REGISTER_CTA_HEADER
      : short
        ? ACTIVITIES_REGISTER_CTA_HEADER
        : ACTIVITIES_REGISTER_CTA_LABEL);
  const Icon =
    icon === "calendar" ? Calendar : icon === "card" ? CreditCard : UserPlus;

  return (
    <Link
      to={ACTIVITIES_PATH}
      hash={hash}
      className={cn(
        "inline-flex items-center justify-center font-bold tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
    >
      {showIcon && <Icon size={size === "sm" ? 15 : 18} aria-hidden />}
      {text}
    </Link>
  );
}
