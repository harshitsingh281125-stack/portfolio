"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { Screen } from "@/lib/projects";

/**
 * A project's application captures in the card's grey well. With one screen it
 * is just the image; with more, a row of tabs switches between them (WAI-ARIA
 * tabs: arrow keys, Home and End, roving tabindex). Every image is in the HTML
 * from the start, stacked in one grid cell, so switching is a cross-fade with
 * no layout shift and nothing to fetch.
 */
export function ScreenSwitcher({ name, screens }: { name: string; screens: Screen[] }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const current = screens[active];
  const panelId = `${baseId}-panel`;
  const tabId = (i: number) => `${baseId}-tab-${i}`;

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = screens.length - 1;
    const next =
      event.key === "ArrowRight" ? (active === last ? 0 : active + 1)
      : event.key === "ArrowLeft" ? (active === 0 ? last : active - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  const multiple = screens.length > 1;

  return (
    <figure className="screen-switcher">
      <a
        id={panelId}
        href={current.src}
        target="_blank"
        rel="noreferrer"
        className="project-well"
        aria-label={`Enlarge ${name} screenshot: ${current.label}`}
        {...(multiple ? { role: "tabpanel", "aria-labelledby": tabId(active) } : {})}
      >
        <span className="screen-stack">
          {screens.map((screen, i) => (
            // eslint-disable-next-line @next/next/no-img-element -- local, pre-sized application screenshot
            <img
              key={screen.src}
              src={screen.src}
              width={screen.width}
              height={screen.height}
              alt={i === active ? screen.alt : ""}
              aria-hidden={i === active ? undefined : true}
              data-active={i === active ? "" : undefined}
              loading="lazy"
              decoding="async"
            />
          ))}
        </span>
      </a>

      <figcaption className="screen-bar">
        {multiple ? (
          <div className="screen-tabs" role="tablist" aria-label={`${name} screens`} onKeyDown={onKeyDown}>
            {screens.map((screen, i) => (
              <button
                key={screen.src}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={tabId(i)}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls={panelId}
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
              >
                {screen.label}
              </button>
            ))}
          </div>
        ) : null}
        <span className="screen-caption">
          {current.caption}
        </span>
      </figcaption>
    </figure>
  );
}
