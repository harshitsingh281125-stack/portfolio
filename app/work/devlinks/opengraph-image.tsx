import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "DevLinks — case study";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    kicker: "Case study",
    title: "DevLinks",
    description:
      "A bookmark manager whose hard part is the server: it fetches URLs a stranger typed, which makes it an SSRF engine pointed at your own network.",
    claim: { value: "84", label: "tagging rules, no model call", source: "taggingRules.ts" },
  });
}
