import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The one button on the site. Ink, never colour (PLAN.md §1.1): "primary" is
 * filled ink, the default is an ink outline.
 *
 * min-h-11 is 44px, Apple's default touch target (accessibility.md › Controls)
 * — at py-1.5 alone these came in at 35px on a phone. Above 640px the pointer
 * takes over and the 28px desktop default applies, so the padding decides.
 */
export function buttonClass(variant: "primary" | "default" = "default") {
  return (
    "inline-flex min-h-11 items-center gap-1.5 rounded-md border px-3 py-1.5 sm:min-h-0 " +
    "text-ui font-medium no-underline " +
    (variant === "primary"
      ? "border-content bg-content text-surface hover:opacity-90"
      : "border-edge-strong text-content hover:bg-surface")
  );
}

export function Button({
  href,
  children,
  external,
  variant,
}: {
  href: string;
  children: ReactNode;
  /** Opens in a new tab. mailto: and PDFs are plain links, not external. */
  external?: boolean;
  variant?: "primary" | "default";
}) {
  const className = buttonClass(variant);
  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  if (href.startsWith("/") && !href.endsWith(".pdf")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
