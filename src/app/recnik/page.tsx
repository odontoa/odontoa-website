import { getPublishedTerms } from "@/lib/content/recnik";
import GlossaryClient from "./glossary-client";

/* Recnik je lokalni sadrzaj (src/lib/content/recnik.ts), stranica je staticka. */
export default function GlossaryPage() {
  return <GlossaryClient initialTerms={getPublishedTerms()} />;
}
