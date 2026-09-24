import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "DevLinks — case study";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    kicker: "Case study",
    title: "DevLinks",
    description: "A developer bookmark manager with searchable collections, duplicate detection, and public sharing.",
  });
}
