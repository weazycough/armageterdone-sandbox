// field.tsx — the parts every labelled control shares, copied from the shared
// UI component library (see NOTICE.md): a field column, its description, its
// error, a TextField and a Textarea. Inside a React Aria field the label,
// description and error ids wire themselves.

import type * as React from "react";
import {
  composeRenderProps,
  FieldError as FieldErrorPrimitive,
  Text,
  TextArea as TextAreaPrimitive,
  TextField as TextFieldPrimitive,
} from "react-aria-components";
import type {
  FieldErrorProps,
  TextFieldProps as TextFieldPrimitiveProps,
  ValidationResult,
} from "react-aria-components";
import { cn } from "../../lib/utils";
import { Input } from "./input";
import { Label } from "./label";

/** The field look, shared by Input and Textarea. */
export const fieldClass =
  "w-full min-w-0 rounded-[2px] border border-input bg-background px-4 py-[0.85rem] font-sans text-[length:inherit] text-foreground outline-none placeholder:text-(--fg-tertiary)";

/** The column a label, its control, the description and the error sit in. */
export const fieldColumnClass = "flex flex-col gap-1.5 text-left";

function FieldDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text>): React.ReactNode {
  return (
    <Text
      slot="description"
      data-slot="field-description"
      className={cn("text-xs leading-snug text-muted-foreground", className)}
      {...props}
    />
  );
}

function FieldError({
  className,
  ...props
}: Omit<FieldErrorProps, "className"> &
  React.RefAttributes<HTMLElement> & { className?: string }): React.ReactNode {
  return (
    <FieldErrorPrimitive
      data-slot="field-error"
      className={cn("text-xs leading-snug font-medium text-error", className)}
      {...props}
    />
  );
}

/** Label, description and error props every composed field takes. */
interface FieldProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

type TextFieldProps = Omit<TextFieldPrimitiveProps, "className" | "children"> &
  React.RefAttributes<HTMLDivElement> &
  FieldProps & {
    className?: string;
    placeholder?: string;
    /** A multi-line field. */
    multiline?: boolean;
    rows?: number;
  };

/** A labelled text field: `<TextField label="Name" />`. */
function TextField({
  label,
  description,
  errorMessage,
  className,
  placeholder,
  multiline = false,
  rows = 3,
  ...props
}: TextFieldProps): React.ReactNode {
  const hint = placeholder === undefined ? {} : { placeholder };
  return (
    <TextFieldPrimitive
      data-slot="text-field"
      className={cn(fieldColumnClass, className)}
      {...props}
    >
      {label != null && <Label>{label}</Label>}
      {multiline ? <Textarea {...hint} rows={rows} /> : <Input {...hint} />}
      {description != null && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
    </TextFieldPrimitive>
  );
}

function Textarea({
  className,
  ...props
}: React.ComponentProps<typeof TextAreaPrimitive>): React.ReactNode {
  return (
    <TextAreaPrimitive
      data-slot="textarea"
      className={composeRenderProps(className, (className) =>
        cn(
          fieldClass,
          "min-h-20 resize-y data-disabled:opacity-45 data-focused:border-accent data-focused:ring-2 data-focused:ring-ring data-invalid:border-error",
          className,
        ),
      )}
      {...props}
    />
  );
}

export { FieldDescription, FieldError, TextField, Textarea };
export type { FieldProps, TextFieldProps };
