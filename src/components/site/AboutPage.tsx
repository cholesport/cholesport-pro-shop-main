import { Link } from "@tanstack/react-router";
import { FadeIn } from "@/components/site/FadeIn";
import {
  ABOUT_HEADING,
  ABOUT_INTRO,
  ABOUT_SECTIONS,
} from "@/data/about";
import { CLUB_PATH } from "@/data/club";

export function AboutPage() {
  return (
    <article className="bg-background">
      <div className="mx-auto max-w-7xl px-4 pt-10 md:pt-14">
        <FadeIn preset="detail" immediate>
          <header className="border-b border-border/70 pb-3">
            <h1 className="text-start text-sm font-medium uppercase tracking-[0.12em] text-foreground md:text-base">
              {ABOUT_HEADING}
            </h1>
          </header>
        </FadeIn>

        <div className="mx-auto max-w-3xl py-10 md:py-14">
          <FadeIn preset="detail" delay={40} immediate>
            <p className="text-lg font-semibold leading-relaxed text-foreground md:text-xl">
              {ABOUT_INTRO}
            </p>
          </FadeIn>

          <div className="mt-10 space-y-10 md:mt-12 md:space-y-12">
            {ABOUT_SECTIONS.map((section, index) => (
              <FadeIn key={section.id} preset="section" index={index} as="section">
                <h2 className="text-xl font-bold text-foreground md:text-2xl">{section.title}</h2>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-base leading-relaxed text-muted-foreground md:text-lg"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn preset="section" delay={80} className="mt-12 border-t border-border pt-8">
            <p className="text-sm text-muted-foreground md:text-base">
              רוצים להכיר את המתחם מקרוב?{" "}
              <Link to={CLUB_PATH} className="font-semibold text-accent hover:underline">
                לעמוד מתחם CHOLE TLV
              </Link>
            </p>
          </FadeIn>
        </div>
      </div>
    </article>
  );
}
