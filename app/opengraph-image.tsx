import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Harshit Singh — Frontend engineer";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    kicker: "Portfolio",
    title: "Frontend engineer building web & mobile products.",
    description: "3+ years building healthcare and marketplace applications with React and React Native.",
  });
}
