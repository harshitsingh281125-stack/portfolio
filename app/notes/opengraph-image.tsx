import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Notes — Harshit Singh";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    kicker: "Notes",
    title: "Notes",
    description:
      "Three things I measured while building Prep, at more length than a case study has room for.",
  });
}
