import type { CSSProperties } from "react";

/** A stagger delay for `.rise` and `[data-reveal]`, read by globals.css as --d. */
export function d(ms: number): CSSProperties {
  return { "--d": `${ms}ms` } as CSSProperties;
}
