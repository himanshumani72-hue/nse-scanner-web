// Re-export the OG image so Twitter cards use the same design.
// Next.js looks for app/twitter-image.tsx separately from opengraph-image.tsx;
// this keeps them in sync with a single source of truth.
export { default, runtime, alt, size, contentType } from "./opengraph-image";
