import { tourBySlug, tours } from "@/lib/tours";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "An animated tour";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return tours.map((t) => ({ slug: t.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = tourBySlug(slug)!;
  return ogImage({ kicker: "Tour", title: tour.title, description: tour.blurb });
}
