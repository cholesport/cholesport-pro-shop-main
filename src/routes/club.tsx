import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ClubLandingPage } from "@/components/site/ClubLandingPage";
import {
  CLUB_PATH,
  CLUB_SEO_DESCRIPTION,
  CLUB_SEO_TITLE,
} from "@/data/club";
import { buildPageSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/club")({
  head: () => {
    const seo = buildPageSeoHead({
      title: CLUB_SEO_TITLE,
      description: CLUB_SEO_DESCRIPTION,
      path: CLUB_PATH,
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: ClubRoute,
});

function ClubRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <ClubLandingPage />
      </main>
      <Footer />
    </div>
  );
}
