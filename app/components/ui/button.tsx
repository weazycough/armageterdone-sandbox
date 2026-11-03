// button.tsx — shadcn Button on React Aria (registry aria-nova), copied from
// the shared UI component library (see NOTICE.md) and re-skinned to the
// Canary Cry theme's `.btn`: Jost caps with wide tracking, a 2px radius,
// canary yellow for the primary action and an outlined ghost.
//
// `buttonVariants` styles links too (`<Link className={buttonVariants()}>`),
// since most of the site's buttons navigate. Focus rings key on React Aria's
// `data-focus-visible`, not CSS `:focus-visible`, which also fires after a
// mouse press in React Aria. Each variant sets its own border colour: cva
// doesn't merge classes, so a base `border-transparent` would win over the
// ghost's `border-input` whenever Tailwind emits it later.

import type * as React from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { Button as ButtonPrimitive } from "react-aria-components";
import type { ButtonProps as ButtonPrimitiveProps } from "react-aria-components";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[2px] border font-display text-[0.82rem] font-semibold tracking-[0.12em] whitespace-nowrap uppercase no-underline transition outline-none select-none hover:no-underline data-focus-visible:ring-2 data-focus-visible:ring-ring data-focus-visible:ring-offset-2 data-focus-visible:ring-offset-background data-disabled:cursor-default data-disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-(--accent) text-(--on-accent) hover:-translate-y-px hover:bg-(--accent-2) hover:text-(--on-accent) data-hovered:bg-(--accent-2)",
        ghost:
          "border-input bg-transparent text-foreground hover:-translate-y-px hover:border-accent hover:text-accent data-hovered:border-accent data-hovered:text-accent",
        blue: "border-transparent bg-shield text-white hover:bg-(--shield-2) hover:text-white data-hovered:bg-(--shield-2)",
      },
      size: {
        default: "px-[1.4rem] py-[0.85rem]",
        sm: "px-3 py-2 text-[0.75rem]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = Omit<ButtonPrimitiveProps, "className"> &
  React.RefAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
  };

function Button({
  className,
  variant = "primary",
  size = "default",
  ...props
}: ButtonProps): React.ReactNode {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
