"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The embedded tour, mounted only once it is nearly on screen.
 *
 * `loading="lazy"` is not enough: Chrome's distance-from-viewport threshold
 * grows on a slow connection, so on a throttled Lighthouse run the stage —
 * ~2,500px below the fold — was fetched during the initial load anyway. The
 * tour carries its own stylesheet, webfont and rAF driver, and running all of
 * that while the page was still settling put total blocking time at 250–660ms
 * and swung /work/prep between 83 and 93. Nothing a reader saw; purely work
 * done for a frame they had not reached.
 *
 * An IntersectionObserver with a 400px margin loads it a screen early instead,
 * which is far enough that the stage is always ready by the time it is
 * scrolled to. The wrapper keeps its fixed height either way, so nothing
 * shifts when the frame arrives.
 *
 * On its own /tour route the frame is the content and is rendered eagerly by
 * TourEmbed, which does not use this component.
 */
export function LazyTourFrame({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // No IntersectionObserver (or no JS at all): fall back to showing it.
    if (!("IntersectionObserver" in window)) {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-full w-full">
      {show ? (
        <iframe src={src} title={title} className="h-full w-full border-0" />
      ) : (
        <noscript>
          <iframe src={src} title={title} className="h-full w-full border-0" />
        </noscript>
      )}
    </div>
  );
}
