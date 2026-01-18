import { sanityClient } from "@/lib/sanity.client";
import { allGlossaryTermsDirectoryQuery } from "@/lib/sanity.queries";
import GlossaryClient from "./glossary-client";

// In dev: no cache for immediate visibility after publish
// In prod: ISR revalidate every 5 minutes (300s) for faster updates
// Can temporarily set to 60s during bulk imports
export const revalidate = process.env.NODE_ENV === "development" ? 0 : 300;

export default async function GlossaryPage() {
  try {
    const terms = await sanityClient.fetch(allGlossaryTermsDirectoryQuery);

    // Pass terms to client component for filtering/search
    return <GlossaryClient initialTerms={terms || []} />;
  } catch (error) {
    console.error("[glossary] Error fetching terms:", error);
    return <GlossaryClient initialTerms={[]} />;
  }
}
