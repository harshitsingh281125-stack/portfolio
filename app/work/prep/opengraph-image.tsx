import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Prep — case study";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    kicker: "Case study",
    title: "Prep",
    description:
      "An AI-native learning OS where a hallucinated citation is not rejected \u2014 it is unrepresentable.",
    claim: { value: "364", label: "tests", source: "tests/unit + tests/e2e" },
  });
}
