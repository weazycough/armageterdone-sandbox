// page-parts.tsx — the building blocks the Ghost page templates repeat
// (page-*.hbs): the heraldic bracket frame, the centred hero, prose sections,
// button links, producer tiers and feature cards. Class names are the Ghost
// theme's, so app/styles/theme.css styles them unchanged.

import type * as React from "react";
import { cn } from "../lib/utils";
import { SmartLink } from "./smart-link";
import { buttonVariants } from "./ui/button";

/** The four corner brackets around a block. */
export function BracketFrame({
  maxWidth,
  className,
  children,
}: {
  maxWidth?: string;
  className?: string;
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <div
      className={cn("bracket-frame", className)}
      style={maxWidth === undefined ? undefined : { maxWidth, margin: "0 auto" }}
    >
      <span className="bracket bracket--tl" />
      <span className="bracket bracket--tr" />
      <span className="bracket bracket--bl" />
      <span className="bracket bracket--br" />
      {children}
    </div>
  );
}

/** The centred, bracket-framed page hero most custom pages open with. */
export function BracketHero({
  variant = "about",
  maxWidth,
  eyebrow,
  title,
  titleStyle,
  lede,
  children,
}: {
  /** Theme class pair: `about-hero` / `about-hero__lede`, and so on. */
  variant?: "about" | "support" | "meetups";
  maxWidth: string;
  eyebrow: string;
  title: React.ReactNode;
  titleStyle?: React.CSSProperties;
  lede: React.ReactNode;
  /** Buttons under the lede. */
  children?: React.ReactNode;
}): React.ReactNode {
  return (
    <header className={`${variant}-hero`}>
      <div className="container">
        <BracketFrame maxWidth={maxWidth}>
          <div style={{ padding: "var(--space-3) var(--space-5)", textAlign: "center" }}>
            <span className="eyebrow">{eyebrow}</span>
            <h1 style={titleStyle}>{title}</h1>
            <p className={`${variant}-hero__lede`}>{lede}</p>
            {children !== undefined && (
              <p className="page-buttons page-buttons--center">{children}</p>
            )}
          </div>
        </BracketFrame>
      </div>
    </header>
  );
}

/** The plain page hero (Ghost page.hbs and the simpler templates). */
export function PageHero({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
}): React.ReactNode {
  return (
    <header className="page-hero">
      <div className="container">
        {eyebrow !== undefined && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {lede !== undefined && <p className="muted">{lede}</p>}
      </div>
    </header>
  );
}

/** A full-width section; `alt` is the shaded variant. */
export function Section({
  alt = false,
  id,
  children,
}: {
  alt?: boolean;
  id?: string;
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <section id={id} className={alt ? "section section--alt" : "section"}>
      <div className="container">{children}</div>
    </section>
  );
}

/** A centred column of prose: the templates' `max-width: 44rem` (or 42rem) block. */
export function Prose({
  width = "44rem",
  center = false,
  className,
  children,
}: {
  width?: "42rem" | "44rem";
  center?: boolean;
  className?: string;
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <div
      className={cn("prose", center && "prose--center", className)}
      style={{
        maxWidth: width,
        margin: "0 auto",
        ...(center ? { textAlign: "center" as const } : {}),
      }}
    >
      {children}
    </div>
  );
}

/** A section holding one prose column, the most common block on the pages. */
export function ProseSection({
  alt,
  id,
  width,
  center,
  children,
}: {
  alt?: boolean;
  id?: string;
  width?: "42rem" | "44rem";
  center?: boolean;
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <Section alt={alt} id={id}>
      <Prose width={width} center={center}>
        {children}
      </Prose>
    </Section>
  );
}

/** A link styled as the theme's button. Site paths use the router. Extra
 *  classes win over the button's own (tailwind-merge). */
export function ButtonLink({
  href,
  variant = "primary",
  newTab = false,
  className,
  children,
}: {
  href: string;
  variant?: "primary" | "ghost";
  newTab?: boolean;
  className?: string;
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <SmartLink
      href={href}
      className={cn(buttonVariants({ variant }), className)}
      {...(newTab ? { target: "_blank" } : {})}
    >
      {children}
    </SmartLink>
  );
}

/** Buttons side by side, wrapping on narrow screens. */
export function Buttons({ children }: { children: React.ReactNode }): React.ReactNode {
  return <p className="page-buttons">{children}</p>;
}

/** One producer tier card (support, ccbc, tube). */
export function Tier({
  href,
  amount,
  title,
  cta,
  variant,
  children,
}: {
  href: string;
  amount: string;
  title: string;
  cta: string;
  variant?: "accent" | "highlight" | "open";
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <SmartLink
      className={cn("producer-tier", variant !== undefined && `producer-tier--${variant}`)}
      href={href}
    >
      <span className="producer-tier__amount">{amount}</span>
      <h3>{title}</h3>
      <p>{children}</p>
      <span className="producer-tier__cta">{cta}</span>
    </SmartLink>
  );
}

/** A grid of tiers; `two` is the two-column layout. */
export function Tiers({
  two = false,
  children,
}: {
  two?: boolean;
  children: React.ReactNode;
}): React.ReactNode {
  return <div className={cn("producer-tiers", two && "producer-tiers--two")}>{children}</div>;
}

/** One card in a `product-features` grid. */
export function Feature({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <article className="product-feature">
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

/** A dashed box for content the team still has to supply. */
export function Placeholder({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <div className="placeholder-box">
      <p className="muted" style={{ marginBottom: "var(--space-3)" }}>
        {label}
      </p>
      {children}
    </div>
  );
}
