import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Harshit Singh — AI product engineer who ships frontend";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    kicker: "Portfolio",
    title: "I build the unglamorous parts of AI products.",
    description:
      "The gateway, the cap, the fallback, and the citation that can\u2019t be faked. Two apps, both running, both open.",
    claim: { value: "364", label: "tests in Prep", source: "tests/unit + tests/e2e" },
  });
}
