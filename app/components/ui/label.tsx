// label.tsx — shadcn Label on React Aria (registry aria-nova), copied from the
// shared UI component library (see NOTICE.md). Inside a React Aria
// `TextField` it points at the field by itself; with an explicit `htmlFor` it
// is a plain label.

import { Label as LabelPrimitive, LabelContext } from "react-aria-components";
import type { LabelProps } from "react-aria-components";
import type * as React from "react";
import { cn } from "../../lib/utils";

function Label({
  className,
  htmlFor,
  slot,
  ...props
}: LabelProps & React.RefAttributes<HTMLLabelElement>): React.ReactNode {
  const label = (
    <LabelPrimitive
      data-slot="label"
      className={cn("text-sm font-medium text-foreground select-none", className)}
      {...props}
      htmlFor={htmlFor}
      slot={slot}
    />
  );
  if (htmlFor !== undefined && slot === undefined) {
    return <LabelContext.Provider value={null}>{label}</LabelContext.Provider>;
  }
  return label;
}

export { Label };
