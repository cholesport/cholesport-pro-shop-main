import { useEffect, useRef, useState } from "react";
import { HERO_SLIDES } from "@/data/heroSlides";
import { CLUB_HERO_VIDEO_SRC } from "@/data/club";
import { cn } from "@/lib/utils";

const MEDIA_GRADE =
  "brightness-[0.9] contrast-[1.04] saturate-[0.88]";

/** Unified cinematic overlay — charcoal base with subtle accent warmth. */
export const GATEWAY_CARD_OVERLAY = [
  "linear-gradient(180deg,",
  "oklch(0.14 0.02 60 / 0.35) 0%,",
  "oklch(0.12 0.02 60 / 0.55) 45%,",
  "oklch(0.1 0.025 55 / 0.88) 100%)",
].join(" ");

const GATEWAY_MARQUEE_IMAGES = HERO_SLIDES.map((slide) => slide.src);

type GatewayCardImageProps = {
  src: string;
  className?: string;
};

export function GatewayCardImage({ src, className }: GatewayCardImageProps) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      className={cn(
        "absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]",
        "max-md:object-contain max-md:object-center",
        MEDIA_GRADE,
        className,
      )}
      loading="eager"
      decoding="async"
    />
  );
}

type GatewayCardVideoProps = {
  poster: string;
  videoSrc?: string;
};

export function GatewayCardVideo({ poster, videoSrc = CLUB_HERO_VIDEO_SRC }: GatewayCardVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [canPlayVideo, setCanPlayVideo] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const mobileViewport = window.matchMedia("(max-width: 767px)");
    const saveData = window.matchMedia("(prefers-reduced-data: reduce)");

    const syncVideoMode = () => {
      const allowVideo =
        !reduceMotion.matches &&
        !coarsePointer.matches &&
        !mobileViewport.matches &&
        !saveData.matches;
      setCanPlayVideo(allowVideo);
    };

    syncVideoMode();
    reduceMotion.addEventListener("change", syncVideoMode);
    coarsePointer.addEventListener("change", syncVideoMode);
    mobileViewport.addEventListener("change", syncVideoMode);
    saveData.addEventListener("change", syncVideoMode);

    return () => {
      reduceMotion.removeEventListener("change", syncVideoMode);
      coarsePointer.removeEventListener("change", syncVideoMode);
      mobileViewport.removeEventListener("change", syncVideoMode);
      saveData.removeEventListener("change", syncVideoMode);
    };
  }, []);

  useEffect(() => {
    if (!canPlayVideo) return;
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
  }, [canPlayVideo]);

  if (!canPlayVideo) {
    return <GatewayCardImage src={poster} />;
  }

  return (
    <video
      ref={videoRef}
      className={cn(
        "absolute inset-0 h-full w-full object-cover max-md:object-contain max-md:object-center",
        MEDIA_GRADE,
      )}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-hidden
      disablePictureInPicture
      controls={false}
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
}

export function GatewayCardProductMarquee() {
  const track = [...GATEWAY_MARQUEE_IMAGES, ...GATEWAY_MARQUEE_IMAGES];

  return (
    <div className="absolute inset-0 overflow-hidden bg-secondary" aria-hidden>
      <div dir="ltr" className="gateway-product-marquee absolute inset-y-0 start-0 flex h-full w-max items-stretch">
        {track.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="relative h-full w-36 shrink-0 border-e border-white/10 sm:w-44 md:w-52"
          >
            <img
              src={src}
              alt=""
              className={cn("h-full w-full object-cover object-center", MEDIA_GRADE)}
              loading={index < 4 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function GatewayCardOverlay() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: GATEWAY_CARD_OVERLAY }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-80"
        aria-hidden
      />
    </>
  );
}
