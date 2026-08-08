import { useEffect, useRef } from "react";
import {
  TABLE_TENNIS_TRAINING_IMAGE,
  TABLE_TENNIS_TRAINING_IMAGE_ALT,
  TABLE_TENNIS_TRAINING_VIDEO_SRC,
} from "@/data/tableTennis";
import { cn } from "@/lib/utils";

const MEDIA_GRADE = "brightness-[0.92] contrast-[1.04] saturate-[0.9]";

type TableTennisTrainingMediaProps = {
  /** Tighter banner for schedule / pricing views. */
  compact?: boolean;
  className?: string;
};

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

export function TableTennisTrainingMedia({
  compact = false,
  className,
}: TableTennisTrainingMediaProps) {
  return (
    <div className={cn("space-y-2 md:space-y-0", className)} aria-label="אימוני טניס שולחן לבוגרים ונוער">
      {/* Mobile: stacked separate areas. Desktop: side by side. */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-px md:overflow-hidden md:rounded-xl md:border md:border-border md:bg-border">
        <figure
          className={cn(
            "relative overflow-hidden rounded-xl border border-border bg-secondary md:rounded-none md:border-0",
            compact ? "aspect-[16/9] max-md:aspect-[2/1]" : "aspect-[4/3] md:aspect-video",
          )}
        >
          <img
            src={TABLE_TENNIS_TRAINING_IMAGE}
            alt={TABLE_TENNIS_TRAINING_IMAGE_ALT}
            className={cn("absolute inset-0 h-full w-full object-cover object-center", MEDIA_GRADE)}
            loading="lazy"
            decoding="async"
          />
        </figure>

        <figure
          className={cn(
            "relative overflow-hidden rounded-xl border border-border bg-secondary md:rounded-none md:border-0",
            compact ? "aspect-[16/9] max-md:aspect-[2/1]" : "aspect-[4/3] md:aspect-video",
          )}
        >
          <TrainingVideo />
        </figure>
      </div>
    </div>
  );
}
