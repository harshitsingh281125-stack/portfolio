import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The one button on the site. Ink, never colour (PLAN.md §1.1): "primary" is
 * filled ink, the default is a panel pill with a hairline ring. Controls are
 * pills; containers are 12px (§1.3).
 *
 * min-h-11 is 44px, Apple's default touch target, kept below 640px where a
 * finger is the pointer. Above it the size variant decides.
 */
export function buttonClass(variant: "primary" | "default" = "default", size: "sm" | "md" = "md") {
  return (
    "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium no-underline " +
    "transition-[opacity,box-shadow,transform] duration-150 active:scale-[0.98] " +
    (size === "sm" ? "px-4 text-[14px] sm:min-h-9 " : "px-5 text-[15px] sm:min-h-11 ") +
    (variant === "primary"
      ? "bg-content text-surface hover:opacity-[0.86]"
      : "bg-panel text-content shadow-[0_0_0_1px_var(--border)] hover:shadow-[0_0_0_1px_var(--content-faint)]")
  );
}

export function Button({
  href,
  children,
  external,
  variant,
  download,
}: {
  href: string;
  children: ReactNode;
  /** Opens in a new tab. mailto: and PDFs are plain links, not external. */
  external?: boolean;
  variant?: "primary" | "default";
  download?: boolean;
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
    <a href={href} className={className} download={download}>
      {children}
    </a>
  );
}
