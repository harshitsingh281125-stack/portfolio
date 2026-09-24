"use client";

import { useEffect } from "react";

/**
 * Gives the work cards one height while they are closed, without letting an
 * open card drag its neighbour taller.
 *
 * The two requirements pull against each other in CSS. A grid row is as tall as
 * its tallest cell, so `align-items: stretch` matches the closed cards and then
 * stretches the closed one when its neighbour opens; `align-items: start` keeps
 * them independent and leaves the closed pair uneven, because the summary and
 * the stack line wrap to different numbers of lines between 900 and 1280px.
 * Reserving fixed line counts does not hold either: which card is taller flips
 * at 1280px.
 *
 * So the cards stay independent, and the closed height is measured and applied
 * as a floor. An open card is past the floor and ignores it. The floor is
 * recomputed only while every card is closed: measuring with one open would
 * either need that card shut mid-read, or would take the floor from its
 * neighbour alone and shrink it as the other opened.
 *
 * Without JavaScript the cards keep their natural heights — a few pixels apart
 * at some widths, and nothing else about them changes.
 */
export function EqualCardHeights({ selector }: { selector: string }) {
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (cards.length < 2) return;

    let frame = 0;
    let adjusting = false;
    const measure = () => {
      frame = 0;
      // Only while every card is closed. Measuring with one open would
      // recompute the floor from the remaining card alone and visibly shrink
      // it the moment its neighbour was opened.
      if (cards.some((c) => c.querySelector("details[open]"))) return;
      adjusting = true;
      for (const c of cards) c.style.minHeight = "";
      const tallest = Math.ceil(
        Math.max(...cards.map((c) => c.getBoundingClientRect().height)),
      );
      for (const c of cards) c.style.minHeight = `${tallest}px`;
      // Let the writes settle before observing again, or setting the floor
      // reads as a content change and schedules another pass forever.
      requestAnimationFrame(() => {
        adjusting = false;
      });
    };
    const schedule = () => {
      if (!frame && !adjusting) frame = requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener("resize", schedule);
    // Re-measure when a card is closed again, so the floor tracks the content.
    for (const c of cards) c.addEventListener("toggle", schedule, true);
    // Anything that rewraps the text — webfonts arriving after first paint, a
    // zoom change, a font-size setting — shows up as a size change here.
    const ro = new ResizeObserver(schedule);
    for (const c of cards) ro.observe(c);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
      for (const c of cards) {
        c.removeEventListener("toggle", schedule, true);
        c.style.minHeight = "";
      }
    };
  }, [selector]);

  return null;
}
