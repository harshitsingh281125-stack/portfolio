import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Prep — case study";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    kicker: "Case study",
    title: "Prep",
    description: "An interview study planner with resource retrieval, provider fallback, and scheduled recall.",
  });
}
