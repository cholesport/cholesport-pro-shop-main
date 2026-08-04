import { FadeIn } from "@/components/site/FadeIn";
import {
  KIDS_FIRST_TIME_INFO_LABEL,
  KIDS_FIRST_TIME_SECTION_ID,
  KIDS_FIRST_TIME_TOPICS,
} from "@/data/kids";

export function KidsFirstTimeInfoSection() {
  return (
    <section
      id={KIDS_FIRST_TIME_SECTION_ID}
      className="scroll-mt-36 border-b border-border bg-secondary/20"
      aria-labelledby="kids-first-time-heading"
    >
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <FadeIn preset="section" immediate>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            לפני השיעור הראשון
          </p>
          <h2
            id="kids-first-time-heading"
            className="mt-2 text-2xl font-extrabold text-foreground md:text-3xl"
          >
            {KIDS_FIRST_TIME_INFO_LABEL}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            כמה דברים חשובים שכדאי לדעת לפני שמגיעים לחוג בפעם הראשונה.
          </p>
        </FadeIn>

        <div className="mt-8 space-y-5">
          {KIDS_FIRST_TIME_TOPICS.map((topic, index) => (
            <FadeIn key={topic.id} preset="card" index={index}>
              <article className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] md:p-6">
                <h3 className="text-lg font-bold text-foreground">{topic.title}</h3>
                <div className="mt-3 space-y-2.5">
                  {topic.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-relaxed text-foreground md:text-base">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
