import { createClient } from "@sanity/client";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "peat8sel";
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Sanity client configured for runtime use (no token):
// - useCdn: true in production, false in development
// - perspective: "published" (only published documents)
// - No token: public dataset access only

if (!projectId || !dataset) {
  throw new Error(
    "Sanity config missing: projectId or dataset is undefined. Check NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET."
  );
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2025-11-20",
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
  // No token - public dataset access only
});

// Export projectId/dataset if needed elsewhere:
export const SANITY_PROJECT_ID = projectId;
export const SANITY_DATASET = dataset;

