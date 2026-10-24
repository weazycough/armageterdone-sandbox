// input.tsx — shadcn Input on React Aria (registry aria-nova), copied from the
// shared UI component library (see NOTICE.md): a plain text field that labels
// itself from a surrounding React Aria `TextField`. Re-skinned to the theme's
// form fields: canvas background, strong line border, yellow focus ring. The
// ring keys on `data-focused`: a text field shows where the caret is however
// it got focus.

import type * as React from "react";
import { composeRenderProps, Input as InputPrimitive } from "react-aria-components";
import { cn } from "../../lib/utils";

function Input({
  className,
  ...props
}: React.ComponentProps<typeof InputPrimitive>): React.ReactNode {
  return (
    <InputPrimitive
      data-slot="input"
      className={composeRenderProps(className, (className) =>
        cn(
          "w-full min-w-0 rounded-[2px] border border-input bg-background px-4 py-[0.85rem] font-sans text-[length:inherit] text-foreground outline-none placeholder:text-(--fg-tertiary) data-disabled:opacity-45 data-focused:border-accent data-focused:ring-2 data-focused:ring-ring data-invalid:border-error",
          className,
        ),
      )}
      {...props}
    />
  );
}

export { Input };
