import { noteBySlug } from "@/lib/notes";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

const note = noteBySlug("e2e-suite-spent-real-calls")!;

export const alt = note.title;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ kicker: "Note", title: note.title, description: note.dek });
}
