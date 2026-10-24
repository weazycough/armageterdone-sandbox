// utils.ts — `cn`, the class-name joiner every component uses: clsx for
// conditionals, then tailwind-merge so a caller's `className` overrides a
// component's default utility of the same kind (`px-2` beats `px-3.5`).
// Copied from the shared UI component library (see NOTICE.md).

import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
