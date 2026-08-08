import { useEffect, useRef, type ReactNode } from "react";
import {
  TABLE_TENNIS_TRAINING_IMAGE,
  TABLE_TENNIS_TRAINING_IMAGE_ALT,
  TABLE_TENNIS_TRAINING_VIDEO_SRC,
} from "@/data/tableTennis";
import { cn } from "@/lib/utils";

const MEDIA_GRADE = "brightness-[0.92] contrast-[1.04] saturate-[0.9]";

type MediaFrameProps = {
  compact?: boolean;
  /** When false, no own border/radius (used inside a shared desktop grid). */
  framed?: boolean;
  className?: string;
  children: ReactNode;
};

function MediaFrame({ compact = false, framed = true, className, children }: MediaFrameProps) {
  return (
    <figure
      className={cn(
        "relative overflow-hidden bg-secondary",
        framed && "rounded-xl border border-border",
        compact ? "aspect-[16/9] max-md:aspect-[2/1]" : "aspect-[4/3] md:aspect-video",
        className,
      )}
    >
      {children}
    </figure>
  );
}

function TrainingVideo({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (
        reduceMotion.matches ||
        document.documentElement.classList.contains("a11y-reduce-motion")
      ) {
        video.pause();
        return;
      }
      void video.play().catch(() => {
        /* Autoplay may be blocked; poster remains visible. */
      });
    };

    syncPlayback();
    reduceMotion.addEventListener("change", syncPlayback);
    return () => reduceMotion.removeEventListener("change", syncPlayback);
  }, []);

  return (
    <video
      ref={videoRef}
      className={cn("absolute inset-0 h-full w-full object-cover object-center", MEDIA_GRADE, className)}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={TABLE_TENNIS_TRAINING_IMAGE}
      aria-label={TABLE_TENNIS_TRAINING_IMAGE_ALT}
      disablePictureInPicture
      controls={false}
    >
      <source src={TABLE_TENNIS_TRAINING_VIDEO_SRC} type="video/mp4" />
    </video>
  );
}

function TrainingImage() {
  return (
    <img
      src={TABLE_TENNIS_TRAINING_IMAGE}
      alt={TABLE_TENNIS_TRAINING_IMAGE_ALT}
      className={cn("absolute inset-0 h-full w-full object-cover object-center", MEDIA_GRADE)}
      loading="lazy"
      decoding="async"
    />
  );
}

export type TableTennisTrainingMediaLayout = "side-by-side" | "video-only" | "image-only";

type TableTennisTrainingMediaProps = {
  /** Tighter banner for schedule / pricing views. */
  compact?: boolean;
  /**
   * side-by-side — desktop-style pair
   * video-only / image-only — for mobile schedule layout (video top, image bottom)
   */
  layout?: TableTennisTrainingMediaLayout;
  className?: string;
};

export function TableTennisTrainingMedia({
  compact = false,
  layout = "side-by-side",
  className,
}: TableTennisTrainingMediaProps) {
  if (layout === "video-only") {
    return (
      <div className={className} aria-label="סרטון אימוני טניס שולחן לבוגרים ונוער">
        <MediaFrame compact={compact}>
          <TrainingVideo />
        </MediaFrame>
      </div>
    );
  }

  if (layout === "image-only") {
    return (
      <div className={className} aria-label="תמונת אימוני טניס שולחן לבוגרים ונוער">
        <MediaFrame compact={compact}>
          <TrainingImage />
        </MediaFrame>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2 md:space-y-0", className)} aria-label="אימוני טניס שולחן לבוגרים ונוער">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-px md:overflow-hidden md:rounded-xl md:border md:border-border md:bg-border">
        <MediaFrame compact={compact} framed={false} className="max-md:rounded-xl max-md:border max-md:border-border">
          <TrainingImage />
        </MediaFrame>
        <MediaFrame compact={compact} framed={false} className="max-md:rounded-xl max-md:border max-md:border-border">
          <TrainingVideo />
        </MediaFrame>
      </div>
    </div>
  );
}
